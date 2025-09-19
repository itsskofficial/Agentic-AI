import { createAgent, createNetwork, createState, tool } from "@injest/agent";
import { type Message } from "@injest/agent/types";
import { Sandbox } from "@e2b/code-interpreter";
import { z } from "zod";
import { ingest } from "./client";
import { getSandbox, parseAgentOutput } from "./utils";
import * as OpenAI from "@injest/agent/providers/openai";
import { prompt, fragmentTitlePrompt, responsePrompt } from "@/lib/prompt";
import prisma from "@/lib/db";

interface AgentState {
	summary: string;
	files: Record<string, string>;
}

const codeAgent = createAgent({
	id: "code-agent",
	name: "Coding Agent",
	description: "An expert coding agent.",
	defaultModel: OpenAI.GPT_4_1_MINI,
	defaultTool: "terminal",
	system: prompt,
	// This lifeCycle hook is the critical addition.
	lifeCycle: {
		onResponse: (response) => {
			const lastMessage = response.output[response.output.length - 1];
			if (lastMessage.text?.includes("TASK_SUMMARY:")) {
				response.network.state.data.summary = lastMessage.text;
			}
			return response;
		},
	},
	tools: {
		terminal: tool({
			name: "terminal",
			description: "Use the terminal to run commands.",
			input: z.object({
				command: z.string(),
			}),
			fn: async ({ input, step }) => {
				return await step.run("terminal", async () => {
					const { sandboxId } = step.event.data;
					const buffers = { stdout: "", stderr: "" };
					try {
						const sandbox = await getSandbox(sandboxId);
						const { stdout, stderr } = await sandbox.process.start(
							input.command
						);
						buffers.stdout = stdout;
						buffers.stderr = stderr;
						return { stdout, stderr };
					} catch (error) {
						console.error(
							`Command failed: ${error}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`
						);
						return `Command failed: ${error}\nstdout: ${buffers.stdout}\nstderr: ${buffers.stderr}`;
					}
				});
			},
		}),
		createOrUpdateFiles: tool({
			name: "createOrUpdateFiles",
			description: "Create or update files in the sandbox.",
			input: z.object({
				files: z.array(
					z.object({
						path: z.string(),
						content: z.string(),
					})
				),
			}),
			fn: async ({ input, step, network }) => {
				const newFiles = await step.run(
					"create-or-update-files",
					async () => {
						try {
							const { sandboxId } = step.event.data;
							const updatedFiles = {
								...(network.state.data.files || {}),
							};
							const sandbox = await getSandbox(sandboxId);
							for (const file of input.files) {
								await sandbox.filesystem.write(
									file.path,
									file.content
								);
								updatedFiles[file.path] = file.content;
							}
							return updatedFiles;
						} catch (error) {
							return error;
						}
					}
				);

				if (typeof newFiles === "object") {
					network.state.data.files = newFiles;
				}
				return newFiles;
			},
		}),
		readFiles: tool({
			name: "readFiles",
			description: "Read files from the sandbox.",
			input: z.object({
				files: z.array(z.string()),
			}),
			fn: async ({ input, step }) => {
				return await step.run("read-files", async () => {
					try {
						const { sandboxId } = step.event.data;
						const sandbox = await getSandbox(sandboxId);
						const contents = [];
						for (const file of input.files) {
							const content = await sandbox.filesystem.read(file);
							contents.push({ path: file, content });
						}
						return contents;
					} catch (error) {
						return error;
					}
				});
			},
		}),
	},
});

const fragmentTitleGenerator = createAgent({
	id: "fragment-title-generator",
	name: "Fragment Title Generator",
	description: "A fragment title generator.",
	defaultModel: OpenAI.GPT_4_TURBO,
	system: fragmentTitlePrompt,
});

const responseGenerator = createAgent({
	id: "response-generator",
	name: "Response Generator",
	description: "A response generator.",
	defaultModel: OpenAI.GPT_4_TURBO,
	system: responsePrompt,
});

const network = createNetwork<AgentState>({
	id: "coding-agent-network",
	name: "Coding Agent Network",
	agents: { codeAgent },
	maxLoops: 15,
	router: async ({ network }) => {
		const summary = network.state.data.summary;
		if (summary) {
			return;
		}
		return { agent: "codeAgent", next: "codeAgent" };
	},
});

export const codeAgentFunction = ingest.createFunction(
	{ id: "code-agent-function", name: "Code Agent Function" },
	{ event: "code/agent.run" },
	async ({ event, step }) => {
		const sandboxId = await step.run("get-sandbox-id", async () => {
			const sandbox = await Sandbox.create({
				template: "vibe-nextjs-template",
			});
			await sandbox.setTimeout(30 * 60 * 1000); // 30 minutes
			return sandbox.id;
		});

		const previousMessages = await step.run(
			"get-previous-messages",
			async () => {
				const formattedMessages: Message[] = [];
				const messages = await prisma.message.findMany({
					where: { projectId: event.data.projectId },
					orderBy: { createdAt: "desc" },
					take: 5,
				});

				messages.reverse().forEach((message) => {
					formattedMessages.push({
						role:
							message.role === "assistant" ? "assistant" : "user",
						text: message.content,
					});
				});

				return formattedMessages;
			}
		);

		const state = createState<AgentState>(
			{
				summary: "",
				files: {},
			},
			{
				messages: previousMessages,
			}
		);

		const result = await network.run(event.data.value, { state });

		const isError =
			!result.state.data.summary ||
			Object.keys(result.state.data.files ?? {}).length === 0;

		const fragmentTitleOutput = await fragmentTitleGenerator.run(
			result.state.data.summary
		);
		const responseOutput = await responseGenerator.run(
			result.state.data.summary
		);

		const sandboxURL = await step.run("get-sandbox-url", async () => {
			const sandbox = await getSandbox(sandboxId);
			const host = await sandbox.getHostname(3000);
			return `https://${host}`;
		});

		await step.run("save-result", async () => {
			if (isError) {
				return await prisma.message.create({
					data: {
						content: "Something went wrong, please try again.",
						role: "assistant",
						type: "error",
						projectId: event.data.projectId,
					},
				});
			}

			return await prisma.message.create({
				data: {
					content: parseAgentOutput(responseOutput, "Here you go!"),
					role: "assistant",
					type: "result",
					projectId: event.data.projectId,
					fragment: {
						create: {
							sandboxUrl: sandboxURL,
							title: parseAgentOutput(
								fragmentTitleOutput,
								"Fragment"
							),
							files: result.state.data.files,
						},
					},
				},
			});
		});

		return {
			url: sandboxURL,
			title: "Fragment",
			files: result.state.data.files,
			summary: result.state.data.summary,
		};
	}
);
