import { TRPCError } from "@trpc/server"
import { generateSlug } from "random-word-slugs"
import { z } from "zod/v4"
import { prisma } from "@/db"
import { inngest } from "@/inngest/client"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"

export const projectsRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        value: z
          .string()
          .min(1, { message: "value is required" })
          .max(10000, { message: "value is too long" }),
      })
    )
    .mutation(async ({ input }) => {
      const createdProject = await prisma.project.create({
        data: {
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
  getMany: baseProcedure.query(async () => {
    const projects = await prisma.project.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    })

    return projects
  }),
  getOne: baseProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "Id is required" }),
      })
    )
    .query(async ({ input }) => {
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.id,
        },
      })

      if (!existingProject) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" })
      }

      return existingProject
    }),
})
