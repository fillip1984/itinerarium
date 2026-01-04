"use client";

import { FaListCheck } from "react-icons/fa6";
import { MdTimelapse } from "react-icons/md";

import type { ReservationType } from "~/server/api/types";
import { freeReservation } from "~/server/api/types";

export default function ReservationList({
  reservations,
  setReservationToManage,
}: {
  reservations: ReservationType[];
  setReservationToManage: (reservation: ReservationType | null) => void;
}) {
  return (
    <div className="h-80 overflow-y-auto gap-2 flex flex-col pr-2 pb-12">
      {reservations?.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          setReservationToManage={setReservationToManage}
        />
      ))}
      <ReservationCard
        reservation={{
          ...freeReservation,
          timeslots: Array.from({
            length: calcFreeHoursPerWeek(reservations ?? []),
          }).map((_, i) => {
            return { startTime: i.toString() };
          }),
        }}
      />
    </div>
  );
}

const ReservationCard = ({
  reservation,
  setReservationToManage,
}: {
  reservation: ReservationType;
  setReservationToManage?: (reservation: ReservationType | null) => void;
}) => {
  return (
    <div
      onClick={() =>
        setReservationToManage && setReservationToManage(reservation)
      }
      className="p-2 border rounded hover:border-white"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{reservation.name}</h3>
        <p className="text-sm text-muted-foreground">
          <div
            style={{ backgroundColor: reservation.color }}
            className="h-4 w-4 rounded"
          ></div>
        </p>
      </div>

      <div className="flex flex-col pl-1 gap-1">
        <div className="flex gap-1 items-center">
          <FaListCheck />
          <span className="font-bold">{reservation.lists?.length ?? 0}</span>
        </div>
        <div className="flex gap-1 items-center">
          <MdTimelapse />
          <span className="font-bold">
            {reservation.timeslots?.length ?? 0}
          </span>
          <span className="text-muted-foreground">hours/week</span>
        </div>
      </div>
    </div>
  );
};

const calcFreeHoursPerWeek = (reservations: ReservationType[]) => {
  const totalHours = 24 * 7;
  const reservedHours = reservations.reduce(
    (acc, reservation) => acc + reservation.timeslots.length,
    0,
  );
  return totalHours - reservedHours;
};
