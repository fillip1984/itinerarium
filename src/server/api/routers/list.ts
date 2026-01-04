import { eq } from "drizzle-orm";
import z from "zod/v4";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { list, listItem } from "~/server/db/schema";

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
      with: {
        items: true,
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
  addItem: publicProcedure
    .input(
      z.object({
        listId: z.string(),
        itemName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(listItem).values({
        listId: input.listId,
        name: input.itemName,
      });
    }),
  removeItem: publicProcedure
    .input(
      z.object({
        itemId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.delete(listItem).where(eq(listItem.id, input.itemId));
    }),
  completeItem: publicProcedure
    .input(
      z.object({
        itemId: z.string(),
        complete: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(listItem)
        .set({ complete: input.complete })
        .where(eq(listItem.id, input.itemId));
    }),
});
