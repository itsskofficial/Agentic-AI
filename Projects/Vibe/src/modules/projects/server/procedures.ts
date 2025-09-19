import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";
import prisma from "@/lib/db";
import { generateSlug } from "random-word-slugs";
import { ingest } from "@/injest/client";
import { TRPCError } from "@trpc/server";

export const projectsRouter = createTRPCRouter({
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return projects;
  }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string().min(1, { message: "ID is required" }) }))
    .query(async ({ input, ctx }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return existingProject;
    }),

  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "Prompt is required" })
          .max(10000, { message: "Prompt is too long" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const createdProject = await prisma.project.create({
        data: {
          name: generateSlug(2, { format: "kebab" }),
          userId: ctx.auth.userId,
          messages: {
            create: {
              content: input.value,
              role: "user",
              type: "result",
            },
          },
        },
      });

      await ingest.send({
        name: "code/agent.run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      });

      return createdProject;
    }),
});