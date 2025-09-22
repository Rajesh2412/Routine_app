"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { GlassWater } from "lucide-react";

const data = [
  { date: "Mon", intake: 2.1 },
  { date: "Tue", intake: 2.5 },
  { date: "Wed", intake: 1.8 },
  { date: "Thu", intake: 3.0 },
  { date: "Fri", intake: 2.2 },
  { date: "Sat", intake: 2.8 },
  { date: "Sun", intake: 2.4 },
];

const dailyGoal = 3; // in Liters
const todayIntake = data[data.length - 1].intake;
const progress = (todayIntake / dailyGoal) * 100;
const remainingIntake = Math.max(0, dailyGoal - todayIntake);

export default function WaterIntakeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GlassWater className="h-6 w-6 text-primary" />
          Water Intake
        </CardTitle>
        <CardDescription>
          Your water consumption for the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}L`}
              />
              <Bar dataKey="intake" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span>Today's Progress</span>
                <span>{todayIntake.toFixed(1)}L / {dailyGoal}L</span>
            </div>
          <Progress value={progress} />
          <p className="text-center text-sm text-muted-foreground pt-2">
            {remainingIntake > 0
              ? `You have ${remainingIntake.toFixed(1)}L more to go. Keep it up!`
              : "Great job! You've reached your daily goal."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
