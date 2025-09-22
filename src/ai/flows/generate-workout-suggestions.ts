'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating workout suggestions based on user workout history and fitness goals.
 *
 * - generateWorkoutSuggestions - A function that generates workout suggestions.
 * - GenerateWorkoutSuggestionsInput - The input type for the generateWorkoutSuggestions function.
 * - GenerateWorkoutSuggestionsOutput - The return type for the generateWorkoutSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWorkoutSuggestionsInputSchema = z.object({
  workoutHistory: z
    .string()
    .describe('A summary of the user\'s past workout history.'),
  fitnessGoals: z
    .string()
    .describe('The user\'s fitness goals (e.g., build muscle, lose weight).'),
});
export type GenerateWorkoutSuggestionsInput = z.infer<
  typeof GenerateWorkoutSuggestionsInputSchema
>;

const GenerateWorkoutSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe('Suggested workout routines based on workout history and goals.'),
});
export type GenerateWorkoutSuggestionsOutput = z.infer<
  typeof GenerateWorkoutSuggestionsOutputSchema
>;

export async function generateWorkoutSuggestions(
  input: GenerateWorkoutSuggestionsInput
): Promise<GenerateWorkoutSuggestionsOutput> {
  return generateWorkoutSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWorkoutSuggestionsPrompt',
  input: {schema: GenerateWorkoutSuggestionsInputSchema},
  output: {schema: GenerateWorkoutSuggestionsOutputSchema},
  prompt: `You are a personal trainer. Generate workout suggestions based on the user's workout history and fitness goals.

Workout History: {{{workoutHistory}}}
Fitness Goals: {{{fitnessGoals}}}

Suggestions:`,
});

const generateWorkoutSuggestionsFlow = ai.defineFlow(
  {
    name: 'generateWorkoutSuggestionsFlow',
    inputSchema: GenerateWorkoutSuggestionsInputSchema,
    outputSchema: GenerateWorkoutSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
