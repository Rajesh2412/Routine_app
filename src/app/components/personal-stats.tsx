"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Footprints, Ruler, Weight, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import type { DailyStats } from "@/lib/types";
import { Button } from "@/components/ui/button";

const mainStats = [
  {
    title: "My Weight",
    value: "75 kg",
    icon: <Weight className="h-8 w-8 text-primary" />,
  },
  {
    title: "My Height",
    value: "180cm / 5'11\"",
    icon: <Ruler className="h-8 w-8 text-primary" />,
  },
];

interface PersonalStatsProps {
    stats: DailyStats | null;
    onSyncSteps: () => void;
    onUpdateSteps: (newSteps: number) => void;
}


export default function PersonalStats({ stats, onSyncSteps, onUpdateSteps }: PersonalStatsProps) {
  const [lastUpdated, setLastUpdated] = useState("");
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [editableSteps, setEditableSteps] = useState(stats?.steps || 0);

  useEffect(() => {
    // This now runs only on the client, avoiding the hydration error.
    setLastUpdated(format(new Date(), "PPP"));
  }, []);

  useEffect(() => {
    if (stats) {
      setEditableSteps(stats.steps);
    }
  }, [stats]);


  const stepProgress = stats ? Math.round((stats.steps / stats.stepsGoal) * 100) : 0;
  const currentSteps = stats ? stats.steps : 0;
  const goalSteps = stats ? stats.stepsGoal : 8000;

  const handleStepsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newSteps = parseInt((e.target as HTMLInputElement).value, 10);
      if (!isNaN(newSteps) && newSteps >= 0) {
        onUpdateSteps(newSteps);
        setIsEditingSteps(false);
      }
    } else if (e.key === 'Escape') {
        setIsEditingSteps(false);
        setEditableSteps(currentSteps); // Reset to original value
    }
  };


  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Today's Footsteps
                </CardTitle>
                <Footprints className="h-8 w-8 text-primary" />
            </CardHeader>
            <CardContent className="flex-grow">
                {isEditingSteps ? (
                  <Input
                    type="number"
                    value={editableSteps}
                    onChange={(e) => setEditableSteps(Number(e.target.value))}
                    onKeyDown={handleStepsKeyDown}
                    onBlur={() => setIsEditingSteps(false)}
                    autoFocus
                    className="text-2xl font-bold h-auto p-0 border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                ) : (
                <div 
                  className="text-2xl font-bold cursor-pointer"
                  onClick={() => setIsEditingSteps(true)}
                >
                  {currentSteps.toLocaleString()}
                </div>
                )}
                <p className="text-xs text-muted-foreground">
                    Target: {goalSteps.toLocaleString()} steps
                </p>
                <Progress value={stepProgress} className="mt-4 h-2" />
            </CardContent>
            <CardFooter>
                 <Button onClick={onSyncSteps} size="sm" variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync Steps
                </Button>
            </CardFooter>
        </Card>
        {mainStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {lastUpdated && (
                <p className="pt-2 text-xs text-muted-foreground">
                  Last updated: {lastUpdated}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
