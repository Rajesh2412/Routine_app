"use client";

import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { CalendarDays, Dumbbell, Coffee } from "lucide-react";

const weeklyPlan = [
  { day: "Sunday", focus: "Shoulders", icon: <Dumbbell className="h-10 w-10 text-primary" /> },
  { day: "Monday", focus: "Abs", icon: <Dumbbell className="h-10 w-10 text-primary" /> },
  { day: "Tuesday", focus: "Legs", icon: <Dumbbell className="h-10 w-10 text-primary" /> },
  { day: "Wednesday", focus: "Rest", icon: <Coffee className="h-10 w-10 text-primary" /> },
  { day: "Thursday", focus: "Chest", icon: <Dumbbell className="h-10 w-10 text-primary" /> },
  { day: "Friday", focus: "Back", icon: <Dumbbell className="h-10 w-10 text-primary" /> },
  { day: "Saturday", focus: "Lower Back", icon: <Dumbbell className="h-10 w-10 text-primary" /> },
];

// JS Date object's getDay() returns 0 for Sunday, 1 for Monday, etc.
const dayIndexMap: { [key: string]: number } = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

export default function WeeklyPlan() {
  const [currentDay, setCurrentDay] = useState("");

  useEffect(() => {
    const today = new Date();
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
    setCurrentDay(dayName);
  }, []);

  if (!currentDay) {
    return null; // Or a loading skeleton
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-6 w-6 text-primary" />
          Weekly Plan
        </CardTitle>
        <CardDescription>
          Your workout schedule for the week. Today is {currentDay}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={currentDay} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 h-auto">
            {weeklyPlan.map((item) => (
              <TabsTrigger key={item.day} value={item.day} className="py-2">
                {item.day.substring(0,3)}
              </TabsTrigger>
            ))}
          </TabsList>
          {weeklyPlan.map((item) => (
            <TabsContent key={item.day} value={item.day}>
              <div className="flex flex-col items-center justify-center p-8 bg-secondary/30 rounded-lg mt-4 min-h-[150px]">
                {item.icon}
                <p className="mt-4 text-2xl font-bold text-foreground">
                  {item.focus} Day
                </p>
                 <p className="text-sm text-muted-foreground">{item.day}</p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
