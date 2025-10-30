import { messagesRouter } from "@/modules/messages/server/procedure"
import { projectsRouter } from "@/modules/projects/server/procedure"
import { usageRouter } from "@/modules/usage/server/procedures"
import { createTRPCRouter } from "../init"

export const appRouter = createTRPCRouter({
  messages: messagesRouter,
  projects: projectsRouter,
  usage: usageRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
