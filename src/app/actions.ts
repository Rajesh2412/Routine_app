"use server";

import { generateWorkoutSuggestions } from "@/ai/flows/generate-workout-suggestions";
import type { Workout } from "@/lib/types";
import { z } from "zod";

const SuggestionSchema = z.object({
  workouts: z.array(z.any()),
  fitnessGoals: z.string().min(3, "Fitness goals must be at least 3 characters long."),
});

export async function getAiWorkoutSuggestions(
  workouts: Workout[],
  fitnessGoals: string
): Promise<{ success: boolean; message: string }> {

  const validation = SuggestionSchema.safeParse({ workouts, fitnessGoals });

  if (!validation.success) {
    return { success: false, message: validation.error.errors[0].message };
  }

  try {
    const workoutHistory = workouts
      .slice(0, 10) // Use last 10 workouts for brevity
      .map(
        (w) =>
          `${w.type} (${w.reps} reps, focusing on ${w.bodyPart} with ${w.equipment}) on ${w.date.toLocaleDateString()}`
      )
      .join("\n");

    const result = await generateWorkoutSuggestions({
      workoutHistory: workoutHistory || "No recent workouts.",
      fitnessGoals: fitnessGoals,
    });
    
    return { success: true, message: result.suggestions };
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    return { success: false, message: "Failed to generate AI suggestions. Please try again." };
  }
}
