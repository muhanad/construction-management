import { createTRPCRouter } from './trpc'
import { projectsRouter } from './routers/projects'

export const appRouter = createTRPCRouter({
  projects: projectsRouter,
})

export type AppRouter = typeof appRouter
