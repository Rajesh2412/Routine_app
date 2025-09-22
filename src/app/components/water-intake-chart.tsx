"use client";

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GlassWater } from "lucide-react";
import type { WaterIntakeData } from "@/lib/types";

interface WaterIntakeChartProps {
  waterIntakeData: WaterIntakeData[];
}

const dailyGoal = 3; // in Liters

export default function WaterIntakeChart({ waterIntakeData }: WaterIntakeChartProps) {
  const today = new Date();
  const todayString = today.toLocaleDateString('en-US', { weekday: 'short' });

  const todayData = waterIntakeData.find(d => d.date === todayString);
  const todayIntake = todayData ? todayData.intake : 0;
  
  const progress = Math.round((todayIntake / dailyGoal) * 100);
  const remainingIntake = Math.max(0, dailyGoal - todayIntake);

  const radialData = [{ name: "Today", value: progress, fill: "hsl(var(--primary))" }];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterIntakeData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIntake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}L`}
                />
                <Tooltip
                  cursor={{ fill: "hsla(var(--secondary))" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="intake" fill="url(#colorIntake)" radius={[10, 10, 0, 0]} barSize={20} animationDuration={1500} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="relative flex flex-col items-center justify-center h-[250px] space-y-2">
            <ResponsiveContainer width="100%" height="100%">
               <RadialBarChart 
                innerRadius="70%" 
                outerRadius="90%" 
                data={radialData} 
                startAngle={90} 
                endAngle={450}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background
                  dataKey='value'
                  cornerRadius={10}
                  className="fill-primary"
                  animationDuration={1500}
                />
              </RadialBarChart>
            </ResponsiveContainer>
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-3xl font-bold text-primary">{progress}%</p>
                <p className="text-sm text-muted-foreground">of 3L goal</p>
            </div>
             <p className="text-center text-sm text-muted-foreground absolute bottom-4">
              {remainingIntake > 0
                ? `You have ${remainingIntake.toFixed(1)}L more to go!`
                : "Goal achieved! 🎉"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
