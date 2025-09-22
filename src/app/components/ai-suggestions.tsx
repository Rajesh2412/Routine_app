"use client";

import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAiWorkoutSuggestions } from "@/app/actions";
import type { Workout } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AiSuggestionsProps {
  workouts: Workout[];
}

export default function AiSuggestions({ workouts }: AiSuggestionsProps) {
  const [goals, setGoals] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!goals) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter your fitness goals.",
      });
      return;
    }

    startTransition(async () => {
      const result = await getAiWorkoutSuggestions(workouts, goals);
      if (result.success) {
        setSuggestions(result.message);
      } else {
        toast({
          variant: "destructive",
          title: "AI Error",
          description: result.message,
        });
      }
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        Describe your fitness goals (e.g., build muscle, improve cardio) and
        our AI will create a personalized plan for you.
      </p>
      <Textarea
        placeholder="e.g., I want to build upper body strength and improve my endurance."
        value={goals}
        onChange={(e) => setGoals(e.target.value)}
        className="min-h-[100px]"
        disabled={isPending}
      />
      <Button onClick={handleSubmit} disabled={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          "Get Suggestions"
        )}
      </Button>

      {suggestions && (
        <Card className="mt-4 bg-secondary">
          <CardContent className="p-6">
            <h4 className="font-semibold mb-2">Your AI Workout Plan</h4>
            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
              {suggestions}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
