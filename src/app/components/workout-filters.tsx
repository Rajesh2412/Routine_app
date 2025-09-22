"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface WorkoutFiltersProps {
  bodyParts: string[];
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function WorkoutFilters({
  bodyParts,
  currentFilter,
  onFilterChange,
}: WorkoutFiltersProps) {
  return (
    <RadioGroup
      value={currentFilter}
      onValueChange={onFilterChange}
      className="flex flex-wrap gap-2"
    >
      {bodyParts.map((part) => (
        <div key={part}>
          <RadioGroupItem value={part} id={`filter-${part}`} className="sr-only" />
          <Label
            htmlFor={`filter-${part}`}
            className="cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary hover:bg-secondary/50"
          >
            {part}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
