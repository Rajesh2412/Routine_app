"use server";

import { z } from "zod";
import type { Workout } from "@/lib/types";

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
    // This is a mock response since the Gemini API key is not available.
    const mockSuggestions = `
Here is a sample workout plan based on your goals:

**Focus: Upper Body Strength & Endurance**

*   **Day 1: Push Day (Chest, Shoulders, Triceps)**
    *   Bench Press: 3 sets of 8-12 reps
    *   Overhead Press: 3 sets of 8-12 reps
    *   Incline Dumbbell Press: 3 sets of 10-15 reps
    *   Tricep Pushdowns: 3 sets of 12-15 reps
    *   Lateral Raises: 3 sets of 15-20 reps

*   **Day 2: Pull Day (Back, Biceps)**
    *   Pull-ups/Lat Pulldowns: 3 sets to failure or 8-12 reps
    *   Bent-Over Rows: 3 sets of 8-12 reps
    *   Bicep Curls: 3 sets of 12-15 reps
    *   Face Pulls: 3 sets of 15-20 reps

*   **Day 3: Active Recovery or Cardio**
    *   30-45 minutes of light cardio (jogging, cycling, etc.)
    *   Full-body stretching.
`;
    
    return await new Promise(resolve => setTimeout(() => {
        resolve({ success: true, message: mockSuggestions });
    }, 1000));

  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    return { success: false, message: "Failed to generate AI suggestions. Please try again." };
  }
}
