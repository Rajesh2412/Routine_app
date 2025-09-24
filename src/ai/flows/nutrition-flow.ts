
'use server';

/**
 * @fileOverview An AI flow to analyze the nutritional content of a meal from a description.
 *
 * - analyzeNutrition - A function that handles the nutrition analysis process.
 * - NutritionAnalysisInput - The input type for the analyzeNutrition function.
 * - NutritionInfo - The return type for the analyzeNutrition function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const NutritionAnalysisInputSchema = z.object({
  mealDescription: z.string().describe('A description of a meal consumed by the user.'),
});
export type NutritionAnalysisInput = z.infer<typeof NutritionAnalysisInputSchema>;

const NutritionInfoSchema = z.object({
    calories: z.number().describe('Estimated total calories for the meal.'),
    protein: z.number().describe('Estimated grams of protein.'),
    carbs: z.number().describe('Estimated grams of carbohydrates.'),
    fat: z.number().describe('Estimated grams of fat.'),
    notes: z.string().optional().describe('A brief note about the estimation, e.g., if it is a rough estimate or any assumptions made.'),
});
export type NutritionInfo = z.infer<typeof NutritionInfoSchema>;


export async function analyzeNutrition(input: NutritionAnalysisInput): Promise<NutritionInfo> {
    return nutritionAnalysisFlow(input);
}


const nutritionPrompt = ai.definePrompt({
    name: 'nutritionPrompt',
    input: { schema: NutritionAnalysisInputSchema },
    output: { schema: NutritionInfoSchema },
    prompt: `You are an expert nutritionist. Based on the user's meal description, provide an estimated breakdown of the nutritional content.

Meal Description: {{{mealDescription}}}

Analyze the description and return the estimated calories, protein, carbohydrates, and fat in the specified JSON format. If the description is vague, make a reasonable assumption and mention it in the notes.
`,
});

const nutritionAnalysisFlow = ai.defineFlow(
    {
        name: 'nutritionAnalysisFlow',
        inputSchema: NutritionAnalysisInputSchema,
        outputSchema: NutritionInfoSchema,
    },
    async (input) => {
        if (!process.env.GEMINI_API_KEY) {
          throw new Error('GEMINI_API_KEY is not set.');
        }
        const { output } = await nutritionPrompt(input);
        return output!;
    }
);
