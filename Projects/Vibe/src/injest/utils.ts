import { Sandbox } from "@e2b/code-interpreter";
import { type Message } from "@injest/agent/types";
import { sandboxTimeout } from "@/types";

export async function getSandbox(sandboxId: string) {
  const sandbox = await Sandbox.reconnect(sandboxId);
  await sandbox.setTimeout(sandboxTimeout);
  return sandbox;
}

export function parseAgentOutput(
  value: Message[],
  fallback: string
): string {
  const output = value[0];
  if (output.type !== "text") {
    return fallback;
  }

  if (Array.isArray(output.text)) {
    return output.text.map((t) => t.text).join("");
  }

  return output.text;
}