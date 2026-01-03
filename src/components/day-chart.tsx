"use client";

import { useEffect, useState } from "react";
import { LabelList, Pie, PieChart } from "recharts";

import type { ChartConfig } from "~/components/ui/chart";
import type { TimeslotType } from "~/server/api/types";
import { Card, CardContent } from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

export default function DayChart({ timeslots }: { timeslots: TimeslotType[] }) {
  const [chartData, setChartData] = useState<
    { activity: string; hours: number; fill: string }[]
  >([]);

  useEffect(() => {
    // sum and sort activities by hours into chart data format
    const activityGroups = timeslots.reduce(
      (acc, ts) => {
        const activityName = ts.reservation?.name ?? "Free";
        if (!acc[activityName]) {
          acc[activityName] = {
            activity: activityName,
            hours: 0,
            fill: ts.reservation?.color ?? "#5c5b5a",
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
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-62.5"
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
}
