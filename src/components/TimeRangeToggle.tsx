import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type TimeRange = "weekly" | "monthly";

interface TimeRangeToggleProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

export function TimeRangeToggle({ value, onChange }: TimeRangeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => v && onChange(v as TimeRange)}
      className="bg-muted/50 p-1 rounded-lg"
    >
      <ToggleGroupItem
        value="weekly"
        className="text-xs px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md"
      >
        Weekly
      </ToggleGroupItem>
      <ToggleGroupItem
        value="monthly"
        className="text-xs px-3 py-1.5 data-[state=on]:bg-background data-[state=on]:shadow-sm rounded-md"
      >
        Monthly
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
