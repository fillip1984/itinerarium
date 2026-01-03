import { eq } from "drizzle-orm";
import z from "zod/v4";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { reservation } from "~/server/db/schema";

export const reservationRouter = createTRPCRouter({
  // Create
  create: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        color: z.string().length(7),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(reservation).values({
        name: input.name,
        description: input.description,
        color: input.color,
      });
    }),
  // Read all
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.reservation.findMany({
      columns: {
        createdAt: false,
        updatedAt: false,
      },
      orderBy: (reservation, { asc }) => asc(reservation.name),
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
        color: z.string().length(7),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(reservation)
        .set({
          name: input.name,
          description: input.description,
          color: input.color,
        })
        .where(eq(reservation.id, input.id));
    }),
  // Delete
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(reservation).where(eq(reservation.id, input.id));
    }),
  // Initialize with default reservations
  initialize: publicProcedure.mutation(async ({ ctx }) => {
    const reservations = [
      { name: "Chores", color: "#eb4034" },
      { name: "Home repair", color: "#19ba07" },
      { name: "Running", color: "#075ef5" },
      { name: "Sleeping", color: "#f5f107" },
      { name: "Programming", color: "#b907f5" },
      { name: "Leisure", color: "#07e1f5" },
      { name: "Working", color: "#f5b507" },
    ];
    return await ctx.db.insert(reservation).values(reservations);
  }),
});
