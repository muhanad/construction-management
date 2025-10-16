import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../trpc'

export const projectsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.project.findMany({
      include: {
        client: true,
        manager: true,
        _count: {
          select: {
            tasks: true,
            issues: true,
            invoices: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.project.findUnique({
        where: { id: input.id },
        include: {
          client: true,
          manager: true,
          tasks: {
            include: {
              assignee: true,
            },
          },
          issues: {
            include: {
              assignee: true,
              createdBy: true,
            },
          },
          expenses: true,
          invoices: {
            include: {
              client: true,
            },
          },
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).default('PLANNING'),
        budget: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        clientId: z.string(),
        managerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.project.create({
        data: {
          ...input,
          managerId: ctx.session.user.id,
        },
        include: {
          client: true,
          manager: true,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        status: z.enum(['PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED']).optional(),
        budget: z.number().optional(),
        actualCost: z.number().optional(),
        percentComplete: z.number().min(0).max(100).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        clientId: z.string().optional(),
        managerId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.project.update({
        where: { id },
        data,
        include: {
          client: true,
          manager: true,
        },
      })
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.project.delete({
        where: { id: input.id },
      })
    }),
})
