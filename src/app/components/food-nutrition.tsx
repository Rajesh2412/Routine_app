
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
import { Salad } from "lucide-react";

export default function FoodNutrition() {
  const [mealDescription, setMealDescription] = useState("");

  const handleAnalysis = async () => {
    // Placeholder for future implementation
    console.log("Analyzing:", mealDescription);
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
        />
        <Button onClick={handleAnalysis}>
            Analyze Meal
        </Button>
      </CardContent>
    </Card>
  );
}
