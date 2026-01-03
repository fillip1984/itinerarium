"use client";

import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import DayCard from "~/components/day-card";
import { useTRPC } from "~/trpc/react";

export default function Home() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data: days, isLoading } = useQuery(trpc.day.getAll.queryOptions());

  // init db
  const initDays = useMutation(
    trpc.day.initialize.mutationOptions({
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

  return (
    <>
      <div className="flex grow overflow-hidden">
        <div className="flex grow gap-2 overflow-y-auto p-4">
          {days?.map((day) => (
            <DayCard key={day.name} day={day} />
          ))}
        </div>
      </div>
    </>
  );
}
