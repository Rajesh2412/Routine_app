
"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Salad, Loader2 } from "lucide-react";
import { analyzeNutrition, type NutritionInfo } from "@/ai/flows/nutrition-flow";

export default function FoodNutrition() {
  const [mealDescription, setMealDescription] = useState("");
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    if (!mealDescription.trim()) {
      setError("Please describe your meal.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setNutritionInfo(null);
    try {
      const result = await analyzeNutrition({ mealDescription });
      setNutritionInfo(result);
    } catch (e) {
      console.error(e);
      setError("Sorry, I couldn't analyze that meal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Salad className="h-6 w-6 text-primary" />
          Food Nutrition Analysis
        </CardTitle>
        <CardDescription>
          Describe your meal to get an estimated nutritional breakdown.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="e.g., A grilled chicken salad with avocado, tomatoes, and a light vinaigrette."
          value={mealDescription}
          onChange={(e) => setMealDescription(e.target.value)}
          rows={3}
          disabled={isLoading}
        />
        <Button onClick={handleAnalysis} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze Meal"
          )}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {nutritionInfo && (
          <div className="space-y-4 rounded-lg border bg-secondary/30 p-4">
            <h3 className="font-semibold">Nutritional Estimate:</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center justify-center rounded-lg bg-background p-3">
                <p className="text-2xl font-bold text-primary">
                  {nutritionInfo.calories}
                </p>
                <p className="text-sm text-muted-foreground">Calories</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-background p-3">
                <p className="text-2xl font-bold text-primary">
                  {nutritionInfo.protein}g
                </p>
                <p className="text-sm text-muted-foreground">Protein</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-background p-3">
                <p className="text-2xl font-bold text-primary">
                  {nutritionInfo.carbs}g
                </p>
                <p className="text-sm text-muted-foreground">Carbs</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-lg bg-background p-3">
                <p className="text-2xl font-bold text-primary">
                  {nutritionInfo.fat}g
                </p>
                <p className="text-sm text-muted-foreground">Fat</p>
              </div>
            </div>
            {nutritionInfo.notes && (
                <p className="text-xs text-muted-foreground pt-2 italic">
                    Note: {nutritionInfo.notes}
                </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
