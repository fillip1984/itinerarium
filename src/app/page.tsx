"use client";

import { FaCircle, FaRegCircle } from "react-icons/fa";
import { useState } from "react";

export type DayType = {
  name: string;
};

export type TimeslotType = {
  hour: number;
  activity?: string;
  // color: string;
  // startTime: string;
  // endTime: string;
  // description: string;
};

export default function Home() {
  const days = [
    { name: "Sunday" },
    { name: "Monday" },
    { name: "Tuesday" },
    { name: "Wednesday" },
    { name: "Thursday" },
    { name: "Friday" },
    { name: "Saturday" },
  ];
  return (
    <div className="flex grow overflow-hidden">
      <div className="flex grow gap-2 overflow-y-auto p-4">
        {days.map((day) => (
          <DayCard key={day.name} day={day} />
        ))}
      </div>
    </div>
  );
}

const DayCard = ({ day }: { day: DayType }) => {
  const activity = "Exercise";
  const [timeslots, setTimeslots] = useState<TimeslotType[]>(
    Array.from({ length: 24 }, (_, i) => ({ hour: i, color: "" })),
  );

  const handleApplyActivity = (hour: number) => {
    setTimeslots((prev) =>
      prev.map((ts) =>
        ts.hour === hour
          ? { ...ts, activity: ts.activity ? undefined : activity }
          : ts,
      ),
    );
  };

  return (
    <div
      key={day.name}
      className="flex min-w-1/3 flex-col rounded border-2 border-green-300 bg-zinc-800/80 p-4"
    >
      {/* heading */}
      <div>
        <h3>{day.name}</h3>
      </div>

      {/* contents */}
      <div className="flex grow flex-col">
        {timeslots?.map((timeslot) => (
          <div
            key={timeslot.hour}
            onMouseEnter={(e) => {
              if (e.buttons === 1) {
                console.log(`${e.buttons}entered into ${timeslot.hour}`);
                handleApplyActivity(timeslot.hour);
              }
            }}
            onMouseDown={() => handleApplyActivity(timeslot.hour)}
            className={`flex grow select-none ${
              timeslot.hour === 0
                ? "rounded-t-lg"
                : timeslot.hour === 23
                  ? "rounded-b-lg"
                  : ""
            } ${timeslot.activity ? "bg-green-500" : "bg-gray-500"}`}
          >
            {timeslot.hour} - {timeslot.activity ?? "Free"}
          </div>
        ))}
      </div>

      {/* footer */}
      <div className="flex gap-2">
        <span className="flex items-center gap-1">
          <FaRegCircle />
          {timeslots.filter((ts) => !ts.activity).length}
        </span>
        <span className="flex items-center gap-1">
          <FaCircle />
          {timeslots.filter((ts) => ts.activity).length}
        </span>
      </div>
    </div>
  );
};
