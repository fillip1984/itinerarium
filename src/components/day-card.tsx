import type { DayType, TimeslotType } from "~/server/api/types";
import { freeActivity } from "~/server/api/types";
import DayChart from "./day-chart";

export default function DayCard({ day }: { day: DayType }) {
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
  const handleApplyActivity = () => {
    // setTimeslots((prev) =>
    //   prev.map((ts) =>
    //     ts.hour === hour
    //       ? { ...ts, activity: ts.activity ? undefined : selectedActivity }
    //       : ts,
    //   ),
    // );
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
        timeslot.startTime === "00:00:00"
          ? "rounded-t-lg"
          : timeslot.startTime === "23:00:00"
            ? "rounded-b-lg"
            : ""
      }`}
      style={{
        backgroundColor: timeslot.reservation?.color ?? freeActivity.color,
      }}
    >
      <span
        className={`flex grow overflow-hidden ${timeslot.startTime !== "00:00:00" ? "border-t" : ""} p-1 text-ellipsis whitespace-nowrap`}
      >
        {/* {timeslot.startTime === "00:00:00"
                ? 12
                : timeslot.startTime > "12:00:00"
                  ? parseInt(timeslot.startTime.split(":")[0]) - 12
                  : parseInt(timeslot.startTime.split(":")[0])}
              {parseInt(timeslot.startTime.split(":")[0]) < 12 ? "am" : "pm"} -{" "} */}
        {timeslot.startTime}-{timeslot.reservation?.name ?? "Free"}
      </span>
    </div>
  );
};
