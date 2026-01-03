import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { day, timeslot } from "~/server/db/schema";

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
    return ctx.db.query.day.findMany({
      with: {
        timeslots: {
          with: {
            reservation: true,
          },
        },
      },
      orderBy: (day, { asc }) => asc(day.order),
    });
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
      { name: "Sunday", order: 0 },
      { name: "Monday", order: 1 },
      { name: "Tuesday", order: 2 },
      { name: "Wednesday", order: 3 },
      { name: "Thursday", order: 4 },
      { name: "Friday", order: 5 },
      { name: "Saturday", order: 6 },
    ];
    const finalResult = await ctx.db.transaction(async (tx) => {
      const result = await tx
        .insert(day)
        .values(daysOfWeek)
        .returning({ insertedId: day.id });
      for (const dayEntry of result) {
        const timeslots = [];
        for (let hour = 0; hour < 24; hour++) {
          const startTime = `${hour.toString().padStart(2, "0")}:00:00`;
          const endTime = `${hour.toString().padStart(2, "0")}:59:59`;
          timeslots.push({
            startTime,
            endTime,
            dayId: dayEntry.insertedId,
          });
        }
        await tx.insert(timeslot).values(timeslots);
      }
      return result;
    });
    return finalResult;
  }),
});
