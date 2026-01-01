import { ModeToggle } from "./theme-toggle";

export default function floating() {
  return (
    <div className="absolute right-4 bottom-4">
      <ModeToggle />
    </div>
  );
}
