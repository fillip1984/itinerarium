import type { RouterOutputs } from "~/trpc/react";

export type DayType = RouterOutputs["day"]["getAll"][number];
export type TimeslotType = DayType["timeslots"][number];
export type ReservationType = RouterOutputs["reservation"]["getAll"][number];

export const freeReservation: ReservationType = {
  id: "",
  name: "Free",
  description: "No reservation",
  color: "#5c5b5a",
  timeslots: [],
  lists: [],
};
