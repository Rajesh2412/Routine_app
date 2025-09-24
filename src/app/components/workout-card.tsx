"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreVertical,
  Edit,
  Trash2,
  Calendar,
  Repeat,
  Cog,
  Target,
  Layers,
} from "lucide-react";
import type { Workout } from "@/lib/types";
import DeleteWorkoutDialog from "./delete-workout-dialog";

interface WorkoutCardProps {
  workout: Workout;
  onEdit: (workout: Workout) => void;
  onDelete: (id: string) => void;
}

export default function WorkoutCard({
  workout,
  onEdit,
  onDelete,
}: WorkoutCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = () => {
    onDelete(workout.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <Card className="transition-all hover:shadow-md hover:shadow-primary/20">
        <CardHeader className="flex flex-row items-start justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl">{workout.type}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(workout.date), "PPP")}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(workout)}>
                <Edit className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Repeat className="h-4 w-4 text-accent" />
              <span>{workout.reps} reps</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-accent" />
              <span>{workout.sets} sets</span>
            </div>
            <div className="flex items-center gap-2">
              <Cog className="h-4 w-4 text-accent" />
              <span>{workout.equipment}</span>
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="secondary" className="flex items-center gap-2 w-fit">
              <Target className="h-4 w-4" />
              {workout.bodyPart}
            </Badge>
          </div>
        </CardContent>
      </Card>
      <DeleteWorkoutDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
