import { eq } from "drizzle-orm";
import z from "zod/v4";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { day, timeslot } from "~/server/db/schema";

export const dayRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.query.day.findMany({
      with: {
        timeslots: {
          orderBy: (timeslot, { asc }) => asc(timeslot.startTime),
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
  reserveTimeslot: publicProcedure
    .input(
      z.object({
        timeslotId: z.string(),
        reservationId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(timeslot)
        .set({
          reservationId:
            input.reservationId === "" ? null : input.reservationId,
        })
        .where(eq(timeslot.id, input.timeslotId));
    }),
  initialize: publicProcedure.mutation(async ({ ctx }) => {
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
