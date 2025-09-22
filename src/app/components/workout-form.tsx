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
import type { Workout, WorkoutFormValues } from "@/lib/types";
import { BODY_PARTS } from "@/app/lib/data";

const formSchema = z.object({
  type: z.string().min(2, { message: "Workout type is required." }),
  reps: z.coerce
    .number({ invalid_type_error: "Reps must be a number." })
    .min(1, { message: "Must be at least 1 rep." }),
  equipment: z.string().min(2, { message: "Equipment is required." }),
  bodyPart: z.string({ required_error: "Please select a body part." }),
});

interface WorkoutFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addWorkout: (data: WorkoutFormValues) => void;
  updateWorkout: (data: Workout) => void;
  editingWorkout: Workout | null;
}

export default function WorkoutForm({
  isOpen,
  setIsOpen,
  addWorkout,
  updateWorkout,
  editingWorkout,
}: WorkoutFormProps) {
  const form = useForm<WorkoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      reps: 0,
      equipment: "",
      bodyPart: undefined,
    },
  });

  useEffect(() => {
    if (editingWorkout) {
      form.reset({
        ...editingWorkout,
        reps: Number(editingWorkout.reps),
      });
    } else {
      form.reset({
        type: "",
        reps: 0,
        equipment: "None",
        bodyPart: undefined,
      });
    }
  }, [editingWorkout, form, isOpen]);

  const onSubmit = (data: WorkoutFormValues) => {
    if (editingWorkout) {
      updateWorkout({ ...editingWorkout, ...data, reps: Number(data.reps) });
    } else {
      addWorkout({ ...data, reps: Number(data.reps) });
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
                      {BODY_PARTS.map((part) => (
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
