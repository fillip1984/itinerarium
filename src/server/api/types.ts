import type { RouterOutputs } from "~/trpc/react";

export type DayType = RouterOutputs["day"]["getAll"][number];
export type TimeslotType = DayType["timeslots"][number];
