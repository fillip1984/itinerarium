"use client";

import { useState } from "react";
import { BsPalette } from "react-icons/bs";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function floating() {
  return (
    <div className="absolute right-4 bottom-4">
      <div className="flex flex-col gap-3">
        <ActivitySelector />
        <ModeToggle />
      </div>
    </div>
  );
}

const ActivitySelector = () => {
  const [selectedActivity, setSelectedActivity] = useState("Free");
  const activities = [
    "Chores",
    "Leisure",
    "Running",
    "Sleeping",
    "Stretching",
    "Weight Lifting",
  ];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <BsPalette className="" />
          <span className="sr-only">Select Activity</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={selectedActivity}
          onValueChange={setSelectedActivity}
        >
          <DropdownMenuRadioItem
            key="Free"
            value="Free"
            onClick={() => setSelectedActivity("Free")}
          >
            Free
          </DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          {activities.map((activity) => (
            <DropdownMenuRadioItem
              key={activity}
              value={activity}
              onClick={() => setSelectedActivity(activity)}
            >
              {activity}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
