
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Footprints, Ruler, Weight, Flame } from "lucide-react";
import { format } from "date-fns";
import type { DailyStats, UserProfile } from "@/lib/types";

interface PersonalStatsProps {
  stats: DailyStats | null;
  profile: UserProfile | null;
  onUpdateSteps: (newSteps: number) => void;
  onUpdateProfile: (newProfile: Partial<UserProfile>) => void;
}

export default function PersonalStats({
  stats,
  profile,
  onUpdateSteps,
  onUpdateProfile,
}: PersonalStatsProps) {
  const [isEditingSteps, setIsEditingSteps] = useState(false);
  const [editableSteps, setEditableSteps] = useState(stats?.steps || 0);

  const [isEditingWeight, setIsEditingWeight] = useState(false);
  const [editableWeight, setEditableWeight] = useState(profile?.weight || "");
  
  const [isEditingHeight, setIsEditingHeight] = useState(false);
  const [editableHeight, setEditableHeight] = useState(profile?.height || "");

  useEffect(() => {
    if (stats) {
      setEditableSteps(stats.steps);
    }
  }, [stats]);
  
  useEffect(() => {
    if (profile) {
      setEditableWeight(profile.weight);
      setEditableHeight(profile.height);
    }
  }, [profile]);

  const stepProgress = stats
    ? Math.round((stats.steps / stats.stepsGoal) * 100)
    : 0;
  const currentSteps = stats ? stats.steps : 0;
  const goalSteps = stats ? stats.stepsGoal : 8000;

  const handleStepsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newSteps = parseInt((e.target as HTMLInputElement).value, 10);
      if (!isNaN(newSteps) && newSteps >= 0) {
        onUpdateSteps(newSteps);
        setIsEditingSteps(false);
      }
    } else if (e.key === "Escape") {
      setIsEditingSteps(false);
      setEditableSteps(currentSteps); // Reset to original value
    }
  };
  
  const handleWeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        onUpdateProfile({ weight: editableWeight, lastUpdated: new Date().toISOString() });
        setIsEditingWeight(false);
    } else if (e.key === 'Escape') {
        setIsEditingWeight(false);
        setEditableWeight(profile?.weight || "");
    }
  };
  
  const handleHeightKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        onUpdateProfile({ height: editableHeight, lastUpdated: new Date().toISOString() });
        setIsEditingHeight(false);
    } else if (e.key === 'Escape') {
        setIsEditingHeight(false);
        setEditableHeight(profile?.height || "");
    }
  };

  const proteinNeeded = useMemo(() => {
    if (!profile?.weight) return "N/A";
    const weightValue = parseFloat(profile.weight);
    if (isNaN(weightValue)) return "N/A";
    return `${(weightValue * 1.6).toFixed(0)}g`;
  }, [profile?.weight]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                className="h-auto p-0 text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            ) : (
              <div
                className="cursor-pointer text-2xl font-bold"
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
        </Card>

        {/* Weight Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Weight</CardTitle>
            <Weight className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
            {isEditingWeight ? (
               <Input
                    value={editableWeight}
                    onChange={(e) => setEditableWeight(e.target.value)}
                    onKeyDown={handleWeightKeyDown}
                    onBlur={() => setIsEditingWeight(false)}
                    autoFocus
                    className="h-auto p-0 text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            ) : (
                <div 
                    className="cursor-pointer text-2xl font-bold"
                    onClick={() => setIsEditingWeight(true)}
                >
                    {profile?.weight || "N/A"}
                </div>
            )}
            {profile?.lastUpdated && (
              <p className="pt-2 text-xs text-muted-foreground">
                Last updated: {format(new Date(profile.lastUpdated), "Pp")}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Protein Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protein Needed</CardTitle>
            <Flame className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">
                {proteinNeeded}
            </div>
            <p className="pt-2 text-xs text-muted-foreground">
                Daily protein goal (1.6g/kg)
            </p>
          </CardContent>
        </Card>

        {/* Height Card */}
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Height</CardTitle>
            <Ruler className="h-8 w-8 text-primary" />
          </CardHeader>
          <CardContent>
             {isEditingHeight ? (
               <Input
                    value={editableHeight}
                    onChange={(e) => setEditableHeight(e.target.value)}
                    onKeyDown={handleHeightKeyDown}
                    onBlur={() => setIsEditingHeight(false)}
                    autoFocus
                    className="h-auto p-0 text-2xl font-bold border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
            ) : (
                <div 
                    className="cursor-pointer text-2xl font-bold"
                    onClick={() => setIsEditingHeight(true)}
                >
                    {profile?.height || "N/A"}
                </div>
            )}
            {profile?.lastUpdated && (
              <p className="pt-2 text-xs text-muted-foreground">
                Last updated: {format(new Date(profile.lastUpdated), "Pp")}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
