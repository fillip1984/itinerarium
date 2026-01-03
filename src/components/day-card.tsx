import type { ActivityType } from "~/app/page";
import type { DayType } from "~/server/api/types";
import { freeActivity } from "~/app/page";
import DayChart from "./day-chart";

export default function DayCard({
  day,
  selectedActivity,
}: {
  day: DayType;
  selectedActivity: ActivityType;
}) {
  console.log("Rendering DayCard for", day.name, selectedActivity);
  // const [timeslots, setTimeslots] = useState<TimeslotType[]>(
  //   Array.from({ length: 24 }, (_, i) => ({ hour: i, color: "" })),
  // );

  const handleApplyActivity = (hour: string) => {
    console.log(`Applying activity ${selectedActivity.name} to hour ${hour}`);
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
          <div
            key={timeslot.startTime}
            onMouseEnter={(e) => {
              if (e.buttons === 1) {
                console.log(`${e.buttons}entered into ${timeslot.startTime}`);
                handleApplyActivity(timeslot.startTime);
              }
            }}
            onMouseDown={() => handleApplyActivity(timeslot.startTime)}
            className={`flex grow select-none hover:opacity-85 ${
              timeslot.startTime === "00:00:00"
                ? "rounded-t-lg"
                : timeslot.startTime === "23:00:00"
                  ? "rounded-b-lg"
                  : ""
            }`}
            style={{
              backgroundColor:
                timeslot.reservation?.color ?? freeActivity.color,
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
        ))}
      </div>

      {/* footer */}
      {/* <div className="flex gap-2">
        <span className="flex items-center gap-1">
          <FaRegCircle />
          {timeslots.filter((ts) => !ts.activity).length}
        </span>
        <span className="flex items-center gap-1">
          <FaCircle />
          {timeslots.filter((ts) => ts.activity).length}
        </span>
      </div> */}
      <DayChart timeslots={day.timeslots} />
    </div>
  );
}
