"use client";

import type { Workout } from "@/lib/types";
import WorkoutCard from "./workout-card";
import { FileText } from "lucide-react";

interface WorkoutHistoryProps {
  workouts: Workout[];
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
}

export default function WorkoutHistory({
  workouts,
  onEdit,
  onDelete,
}: WorkoutHistoryProps) {
  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-12 text-center">
        <FileText className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Workouts Logged</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Log a new workout to see your history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout.id}
          workout={workout}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
