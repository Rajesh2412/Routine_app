
import { z } from "zod";

export type BodyPart =
  | "Chest"
  | "Back"
  | "Legs"
  | "Shoulders"
  | "Arms"
  | "Core"
  | "Abs"
  | "Lower Back"
  | "Rest";

export interface Workout {
  id: string;
  date: string; // Changed to string to store ISO date string
  type: string;
  reps: number;
  sets: number;
  equipment: string;
  bodyPart: BodyPart;
  kg?: number;
}

export const workoutFormSchema = z.object({
  type: z.string().min(2, "Workout type must be at least 2 characters."),
  reps: z.coerce.number().min(1, "Reps must be at least 1."),
  sets: z.coerce.number().min(1, "Sets must be at least 1."),
  equipment: z.string().min(2, "Equipment must be at least 2 characters."),
  bodyPart: z.enum(["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Abs", "Lower Back"]),
  kg: z.coerce.number().min(0, "Weight must be a positive number.").optional(),
});

export type WorkoutFormValues = z.infer<typeof workoutFormSchema>;

export interface WaterIntakeData {
  date: string; // e.g., "Mon", "Tue"
  intake: number; // in Liters
}

export interface ProteinIntakeData {
    id: string; // "yyyy-MM-dd"
    date: string; // ISO date string
    intake: number; // in grams
}

export interface DailyStats {
    id: string; // "yyyy-MM-dd"
    date: string; // ISO date string
    steps: number;
    stepsGoal: number;
}

export interface UserProfile {
    id: string; // Typically a user ID, but we'll use a static one for now
    weight: string;
    height: string;
    lastUpdated: string; // ISO date string
}

    