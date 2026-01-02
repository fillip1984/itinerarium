"use client";

import { ModeToggle } from "./theme-toggle";

export default function floating() {
  return (
    <div className="absolute right-0 bottom-4 rounded-l bg-gray-700/60 p-2">
      <div className="flex flex-col gap-3">
        <ModeToggle />
      </div>
    </div>
  );
}
