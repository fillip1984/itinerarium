"use client";

import { useState } from "react";
import { BsPalette } from "react-icons/bs";
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
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
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

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
          <FieldGroup className="pb-3">
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
          </FieldGroup>
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
