"use client";

import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function ColorPickerDropdown({
  currentColor,
  updateColor,
}: {
  currentColor: string;
  updateColor: (color: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          style={{ backgroundColor: currentColor }}
        >
          <span className="sr-only">Select Color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Color</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid grid-cols-5 gap-2 p-2">
          {[
            "#f87171",
            "#fbbf24",
            "#34d399",
            "#60a5fa",
            "#a78bfa",
            "#f472b6",
            "#f97316",
            "#eab308",
            "#10b981",
            "#3b82f6",
            "#8b5cf6",
            "#ec4899",
          ].map((color) => (
            <DropdownMenuItem
              key={color}
              onClick={() => updateColor(color)}
              className="h-8 w-8 rounded"
              style={{ backgroundColor: color }}
            ></DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
