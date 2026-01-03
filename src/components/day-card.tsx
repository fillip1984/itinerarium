import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { DayType, TimeslotType } from "~/server/api/types";
import { freeReservation } from "~/server/api/types";
import { useReservationStore } from "~/server/stores/reservationStore";
import { useTRPC } from "~/trpc/react";
import DayChart from "./day-chart";

export default function DayCard({ day }: { day: DayType }) {
  return (
    <div
      key={day.name}
      className="flex gap-2 min-w-1/3 flex-col rounded border-2 border-green-300 bg-zinc-800/80 p-4"
    >
      {/* heading */}
      <div>
        <h3>{day.name}</h3>
      </div>

      {/* contents */}
      <div className="flex grow flex-col">
        {day.timeslots?.map((timeslot) => (
          <TimeslotRow key={timeslot.startTime} timeslot={timeslot} />
        ))}
      </div>

      {/* footer */}
      <DayChart timeslots={day.timeslots} />
    </div>
  );
}

const TimeslotRow = ({ timeslot }: { timeslot: TimeslotType }) => {
  const hour = parseInt(timeslot.startTime.split(":")![0]!);
  const { selectedReservationId } = useReservationStore();

  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const changeReservation = useMutation(
    trpc.day.reserveTimeslot.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          void queryClient.invalidateQueries(trpc.day.pathFilter()),
        );
      },
    }),
  );
  const handleApplyActivity = () => {
    changeReservation.mutate({
      timeslotId: timeslot.id,
      reservationId: selectedReservationId,
    });
  };

  return (
    <div
      onMouseEnter={(e) => {
        if (e.buttons === 1) {
          handleApplyActivity();
        }
      }}
      onMouseDown={handleApplyActivity}
      className={`flex grow select-none hover:opacity-85 ${
        hour === 0 ? "rounded-t-lg" : hour === 23 ? "rounded-b-lg" : ""
      }`}
      style={{
        backgroundColor: timeslot.reservation?.color ?? freeReservation.color,
      }}
    >
      <div
        className={`flex grow overflow-hidden ${hour !== 0 ? "border-t" : ""} px-2 py-0.5 text-ellipsis whitespace-nowrap`}
      >
        <span className="text-muted-foreground text-sm w-12">
          {hour === 0 ? 12 : hour > 12 ? hour - 12 : hour}
          {hour < 12 ? "am" : "pm"}
        </span>
        <span>{timeslot.reservation?.name ?? "Free"}</span>
      </div>
    </div>
  );
};
