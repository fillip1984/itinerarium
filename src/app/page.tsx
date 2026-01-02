"use client";

import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useQuery } from "@tanstack/react-query";
import { BsPalette } from "react-icons/bs";
import { LabelList, Pie, PieChart } from "recharts";

import type { ChartConfig } from "~/components/ui/chart";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { useTRPC } from "~/trpc/react";

export type DayType = {
  name: string;
};

export type ActivityType = {
  name: string;
  color: string;
};

export type TimeslotType = {
  hour: number;
  activity?: ActivityType;
  // color: string;
  // startTime: string;
  // endTime: string;
  // description: string;
};

const activities: ActivityType[] = [
  { name: "Chores", color: "#eb4034" },
  { name: "Home repair", color: "#19ba07" },
  { name: "Running", color: "#075ef5" },
  { name: "Sleeping", color: "#f5f107" },
  { name: "Programming", color: "#b907f5" },
  { name: "Leisure", color: "#07e1f5" },
  { name: "Working", color: "#f5b507" },
];

const freeActivity: ActivityType = { name: "Free", color: "#5c5b5a" };

export default function Home() {
  // const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data: days } = useQuery(trpc.day.getAll.queryOptions());
  // const initDays = useMutation(
  //   trpc.day.initializeDays.mutationOptions({
  //     onSuccess: () => {
  //       queryClient.invalidateQueries(trpc.day.pathFilter());
  //     },
  //   }),
  // );

  // useEffect(() => {
  //   console.log("Days inited:", days);
  //   // if (!isLoading && !days) {
  //   initDays.mutate();
  //   // }
  // }, []);
  // const days = [
  //   { name: "Sunday" },
  //   { name: "Monday" },
  //   { name: "Tuesday" },
  //   { name: "Wednesday" },
  //   { name: "Thursday" },
  //   { name: "Friday" },
  //   { name: "Saturday" },
  // ];
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

const DayCard = ({
  day,
  selectedActivity,
}: {
  day: DayType;
  selectedActivity: ActivityType;
}) => {
  const [timeslots, setTimeslots] = useState<TimeslotType[]>(
    Array.from({ length: 24 }, (_, i) => ({ hour: i, color: "" })),
  );

  const handleApplyActivity = (hour: number) => {
    setTimeslots((prev) =>
      prev.map((ts) =>
        ts.hour === hour
          ? { ...ts, activity: ts.activity ? undefined : selectedActivity }
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
            className={`flex grow select-none hover:opacity-85 ${
              timeslot.hour === 0
                ? "rounded-t-lg"
                : timeslot.hour === 23
                  ? "rounded-b-lg"
                  : ""
            }`}
            style={{
              backgroundColor: timeslot.activity?.color ?? freeActivity.color,
            }}
          >
            <span
              className={`flex grow overflow-hidden ${timeslot.hour !== 0 ? "border-t" : ""} p-1 text-ellipsis whitespace-nowrap`}
            >
              {timeslot.hour === 0
                ? 12
                : timeslot.hour > 12
                  ? timeslot.hour - 12
                  : timeslot.hour}
              {timeslot.hour < 12 ? "am" : "pm"} -{" "}
              {timeslot.activity?.name ?? "Free"}
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
      <DayChart timeslots={timeslots} />
    </div>
  );
};

const ActivitySelector = ({
  selectedActivity,
  setSelectedActivity,
}: {
  selectedActivity: ActivityType;
  setSelectedActivity: React.Dispatch<React.SetStateAction<ActivityType>>;
}) => {
  const [showNewDialog, setShowNewDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <BsPalette className="" />
            <span className="sr-only">Select Activity</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Activity Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedActivity.name}
            onValueChange={(value) => {
              const act = activities.find(
                (activity) => activity.name === value,
              );
              setSelectedActivity(act!);
            }}
          >
            <DropdownMenuRadioItem
              key="Free"
              value="Free"
              onClick={() => setSelectedActivity(freeActivity)}
            >
              Free
            </DropdownMenuRadioItem>
            <DropdownMenuSeparator />
            {activities.map((activity) => (
              <DropdownMenuRadioItem
                key={activity.name}
                value={activity.name}
                onClick={() => setSelectedActivity(activity)}
              >
                {activity.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
              Manage Activities
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>
              Provide a name for your new file. Click create when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="existing">
            <TabsList>
              <TabsTrigger value="existing">Existing</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
            </TabsList>
            <TabsContent value="existing">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="new">
              <FieldGroup className="py-3">
                <Field>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="shadcn@vercel.com"
                    autoComplete="off"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="message">Message (Optional)</FieldLabel>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Check out this file"
                  />
                </Field>
              </FieldGroup>
            </TabsContent>
          </Tabs>
          {/* <FieldGroup className="pb-3">
            <Field>
              <FieldLabel htmlFor="filename">File Name</FieldLabel>
              <Input id="filename" name="filename" placeholder="document.txt" />
            </Field>
          </FieldGroup>
          <FieldGroup className="py-3">
            <Field>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="shadcn@vercel.com"
                autoComplete="off"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="message">Message (Optional)</FieldLabel>
              <Textarea
                id="message"
                name="message"
                placeholder="Check out this file"
              />
            </Field>
          </FieldGroup> */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const DayChart = ({ timeslots }: { timeslots: TimeslotType[] }) => {
  const [chartData, setChartData] = useState<
    { activity: string; hours: number; fill: string }[]
  >([]);

  useEffect(() => {
    // sum and sort activities by hours into chart data format
    const activityGroups = timeslots.reduce(
      (acc, ts) => {
        const activityName = ts.activity?.name ?? "Free";
        if (!acc[activityName]) {
          acc[activityName] = {
            activity: activityName,
            hours: 0,
            fill: ts.activity?.color ?? freeActivity.color,
          };
        }
        acc[activityName].hours += 1;
        return acc;
      },
      {} as Record<string, { activity: string; hours: number; fill: string }>,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChartData(
      Object.values(activityGroups).sort((a, b) => {
        if (a.activity === "Free") return 1;
        if (b.activity === "Free") return -1;
        return b.hours - a.hours;
      }),
    );
  }, [timeslots]);

  // TODO: make this dynamic based on activities used
  const chartConfig = {
    hours: {
      label: "Hours",
    },
    Chores: {
      label: "Chores",
      color: "#eb4034",
    },
    HomeRepair: {
      label: "Home repair",
      color: "#19ba07",
    },
    Running: {
      label: "Running",
      color: "#075ef5",
    },
    Sleeping: {
      label: "Sleeping",
      color: "#f5f107",
    },
    Programming: {
      label: "Programming",
      color: "#b907f5",
    },
    Leisure: {
      label: "Leisure",
      color: "#07e1f5",
    },
    Working: {
      label: "Working",
      color: "#f5b507",
    },
    Free: {
      label: "Free",
      color: "#5c5b5a",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="hours" hideLabel />}
            />
            <Pie data={chartData} dataKey="hours">
              <LabelList
                dataKey="activity"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
