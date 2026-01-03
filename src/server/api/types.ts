import type { RouterOutputs } from "~/trpc/react";

export type DayType = RouterOutputs["day"]["getAll"][number];
export type TimeslotType = DayType["timeslots"][number];

export type ActivityType = {
  name: string;
  color: string;
};

export const activities: ActivityType[] = [
  { name: "Chores", color: "#eb4034" },
  { name: "Home repair", color: "#19ba07" },
  { name: "Running", color: "#075ef5" },
  { name: "Sleeping", color: "#f5f107" },
  { name: "Programming", color: "#b907f5" },
  { name: "Leisure", color: "#07e1f5" },
  { name: "Working", color: "#f5b507" },
];

export const freeActivity: ActivityType = { name: "Free", color: "#5c5b5a" };
