import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { day } from "~/server/db/schema";

// const daySchema = z.object({
//   id: z.string(),
//   name: z.string().min(1),
//   order: z.number().int().min(1).max(7),
// });

export const dayRouter = createTRPCRouter({
  // Create
  //   create: publicProcedure
  //     .input(daySchema.omit({ id: true }))
  //     .mutation(async ({ ctx, input }) => {
  //       return ctx.db.insert(day).values({
  //         name: input.name,
  //         order: input.order,
  //       });
  //     }),
  // Read all
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(day).orderBy(day.order);
  }),
  // Read one
  //   getById: publicProcedure
  //     .input(z.object({ id: z.string() }))
  //     .query(async ({ ctx, input }) => {
  //       const result = await ctx.db
  //         .select()
  //         .from(day)
  //         .where(eq(day.id, input.id));
  //       return result[0];
  //     }),
  // Update
  //   update: publicProcedure
  //     .input(daySchema.required({ id: true }))
  //     .mutation(async ({ ctx, input }) => {
  //       return ctx.db
  //         .update(day)
  //         .set({
  //           name: input.name,
  //           order: input.order,
  //         })
  //         .where(eq(day.id, input.id));
  //     }),
  // Delete
  //   delete: publicProcedure
  //     .input(z.object({ id: z.string() }))
  //     .mutation(async ({ ctx, input }) => {
  //       return ctx.db.delete(day).where(eq(day.id, input.id));
  //     }),
  initializeDays: publicProcedure.mutation(async ({ ctx }) => {
    const daysOfWeek = [
      { name: "Monday", order: 1 },
      { name: "Tuesday", order: 2 },
      { name: "Wednesday", order: 3 },
      { name: "Thursday", order: 4 },
      { name: "Friday", order: 5 },
      { name: "Saturday", order: 6 },
      { name: "Sunday", order: 7 },
    ];
    return ctx.db.insert(day).values(daysOfWeek);
  }),
});
