"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Workout, WorkoutFormValues, BodyPart } from "@/lib/types";

const ALL_BODY_PARTS: BodyPart[] = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Abs", "Lower Back"];

const formSchema = z.object({
  type: z.string().min(2, { message: "Workout type is required." }),
  reps: z.coerce
    .number({ invalid_type_error: "Reps must be a number." })
    .min(1, { message: "Must be at least 1 rep." }),
  sets: z.coerce
    .number({ invalid_type_error: "Sets must be a number." })
    .min(1, { message: "Must be at least 1 set." }),
  equipment: z.string().min(2, { message: "Equipment is required." }),
  bodyPart: z.enum(["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Abs", "Lower Back"]),
  kg: z.coerce.number({ invalid_type_error: "Weight must be a number." }).min(0).optional(),
});


interface WorkoutFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addWorkout: (data: WorkoutFormValues) => void;
  updateWorkout: (data: Workout) => void;
  editingWorkout: Workout | null;
  initialValues?: Partial<WorkoutFormValues>;
}

export default function WorkoutForm({
  isOpen,
  setIsOpen,
  addWorkout,
  updateWorkout,
  editingWorkout,
  initialValues,
}: WorkoutFormProps) {
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      reps: 0,
      sets: 0,
      equipment: "None",
      bodyPart: undefined,
      kg: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (editingWorkout) {
        form.reset({
          ...editingWorkout,
          reps: Number(editingWorkout.reps),
          sets: Number(editingWorkout.sets),
          kg: Number(editingWorkout.kg || 0),
        });
      } else {
        form.reset({
          type: "",
          reps: 0,
          sets: 0,
          equipment: "None",
          bodyPart: initialValues?.bodyPart || undefined,
          kg: 0,
        });
      }
    }
  }, [editingWorkout, form, isOpen, initialValues]);

  const onSubmit = (data: WorkoutFormValues) => {
    const workoutData = {
      ...data,
      reps: Number(data.reps),
      sets: Number(data.sets),
      kg: Number(data.kg || 0),
    };

    if (editingWorkout) {
      updateWorkout({ ...editingWorkout, ...workoutData });
    } else {
      addWorkout(workoutData);
    }
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editingWorkout ? "Edit Workout" : "Log New Workout"}
          </DialogTitle>
          <DialogDescription>
            {editingWorkout
              ? "Update the details of your workout."
              : "Add a new workout to your journal. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workout Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Push-ups" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repetitions</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 12" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sets</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Equipment</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dumbbells" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="kg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (kg)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bodyPart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Part</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a body part" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ALL_BODY_PARTS.map((part) => (
                        <SelectItem key={part} value={part}>
                          {part}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {editingWorkout ? "Save Changes" : "Save Workout"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
