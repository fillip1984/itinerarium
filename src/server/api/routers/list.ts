import { eq } from "drizzle-orm";
import z from "zod/v4";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { list } from "~/server/db/schema";

export const listRouter = createTRPCRouter({
  // Create
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        reservationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(list).values({
        name: input.name,
        description: input.description,
        reservationId: input.reservationId,
      });
    }),
  // Read all
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.list.findMany({
      columns: {
        createdAt: false,
        updatedAt: false,
      },
      orderBy: (list, { asc }) => asc(list.name),
    });
  }),
  // Read one
  // getById: publicProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(async ({ ctx, input }) => {
  //     const result = await ctx.db
  //       .select()
  //       .from(reservation)
  //       .where(eq(reservation.id, input.id));
  //     return result[0];
  //   }),
  // Update
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(list)
        .set({
          name: input.name,
          description: input.description,
        })
        .where(eq(list.id, input.id));
    }),
  // Delete
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(list).where(eq(list.id, input.id));
    }),
});
