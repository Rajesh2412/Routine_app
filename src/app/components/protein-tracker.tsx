"use client";

import { useState }
from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Drumstick, Plus, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProteinTrackerProps {
  dailyIntake: number | null;
  proteinGoal: number; // in grams
  onAddProtein: (grams: number) => void;
  isLoading: boolean;
}

export default function ProteinTracker({ dailyIntake, proteinGoal, onAddProtein, isLoading }: ProteinTrackerProps) {
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    const grams = parseInt(amount, 10);
    if (!isNaN(grams) && grams > 0) {
      onAddProtein(grams);
      setAmount("");
    }
  };

  const progress = proteinGoal > 0 && dailyIntake ? Math.round((dailyIntake / proteinGoal) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Drumstick className="h-6 w-6 text-primary" />
          Protein Intake
        </CardTitle>
        <CardDescription>
          Track your daily protein consumption towards your goal of {proteinGoal.toFixed(0)}g.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
            <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        ) : (
            <>
                <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                        <p className="text-sm text-muted-foreground">Progress</p>
                        <p className="text-lg font-bold text-primary">{dailyIntake?.toFixed(0) || 0}g / {proteinGoal.toFixed(0)}g</p>
                    </div>
                    <Progress value={progress} className="h-3" />
                </div>

                <div className="flex w-full items-center space-x-2">
                    <Input
                        type="number"
                        placeholder="Grams of protein"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1"
                    />
                    <Button onClick={handleAdd} size="icon">
                        <Plus className="h-5 w-5" />
                        <span className="sr-only">Add Protein</span>
                    </Button>
                </div>
            </>
        )}
      </CardContent>
    </Card>
  );
}
