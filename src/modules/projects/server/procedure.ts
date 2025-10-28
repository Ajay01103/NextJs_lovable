import { TRPCError } from "@trpc/server"
import { generateSlug } from "random-word-slugs"
import { z } from "zod/v4"
import { prisma } from "@/db"
import { inngest } from "@/inngest/client"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "value is required" })
          .max(10000, { message: "value is too long" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const createdProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, {
            format: "kebab",
          }),
          messages: {
            create: {
              content: input.value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      })

      await inngest.send({
        name: "code-agent/run",
        data: {
          value: input.value,
          projectId: createdProject.id,
        },
      })

      return createdProject
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return projects
  }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Id is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      // findUnique only accepts a unique field; use findFirst to filter by id + userId
      const existingProject = await prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      })

      if (!existingProject) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" })
      }

      return existingProject
    }),
})
