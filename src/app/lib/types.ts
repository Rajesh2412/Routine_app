import { z } from "zod";

export type BodyPart =
  | "Chest"
  | "Back"
  | "Legs"
  | "Shoulders"
  | "Arms"
  | "Core";

export interface Workout {
  id: string;
  date: string; // Changed to string to store ISO date string
  type: string;
  reps: number;
  equipment: string;
  bodyPart: BodyPart;
}

export const workoutFormSchema = z.object({
  type: z.string().min(2, "Workout type must be at least 2 characters."),
  reps: z.coerce.number().min(1, "Reps must be at least 1."),
  equipment: z.string().min(2, "Equipment must be at least 2 characters."),
  bodyPart: z.enum(["Chest", "Back", "Legs", "Shoulders", "Arms", "Core"]),
});

export type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

export interface WaterIntakeData {
    date: string;
    intake: number;
}
