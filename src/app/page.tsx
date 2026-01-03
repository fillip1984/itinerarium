"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import ActivitySelector from "~/components/activity-selector";
import DayCard from "~/components/day-card";
import { useTRPC } from "~/trpc/react";

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

export default function Home() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data: days, isLoading } = useQuery(trpc.day.getAll.queryOptions());
  const initDays = useMutation(
    trpc.day.initializeDays.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.day.pathFilter());
      },
    }),
  );

  useEffect(() => {
    if (!isLoading && days?.length === 0) {
      initDays.mutate();
    } else {
      console.log("Days exist, no init needed");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const [selectedActivity, setSelectedActivity] =
    useState<ActivityType>(freeActivity);
  return (
    <>
      <div className="flex grow overflow-hidden">
        <div className="flex grow gap-2 overflow-y-auto p-4">
          {days?.map((day) => (
            <DayCard
              key={day.name}
              day={day}
              selectedActivity={selectedActivity}
            />
          ))}
        </div>
      </div>

      <ActivitySelector
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
      />
    </>
  );
}
