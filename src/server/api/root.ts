import { createTRPCRouter } from "~/server/api/trpc";
import { dayRouter } from "./routers/day";
import { listRouter } from "./routers/list";
import { reservationRouter } from "./routers/reservation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  day: dayRouter,
  reservation: reservationRouter,
  list: listRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
