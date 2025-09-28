
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CalendarDays, Dumbbell, Coffee, Weight, Repeat, Layers } from "lucide-react";
import { WEEKLY_PLAN } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Workout } from "@/lib/types";
import { format } from "date-fns";

const weeklyPlanWithIcons = WEEKLY_PLAN.map(plan => ({
    ...plan,
    icon: plan.focus === "Rest" ? <Coffee className="h-10 w-10 text-primary" /> : <Dumbbell className="h-10 w-10 text-primary" />
}));

interface WeeklyPlanProps {
  workouts: Workout[];
}

export default function WeeklyPlan({ workouts }: WeeklyPlanProps) {
  const [currentDay, setCurrentDay] = useState("");
  const isMobile = useIsMobile();

  useEffect(() => {
    const today = new Date();
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
    setCurrentDay(dayName);
  }, []);

  if (!currentDay) {
    return null; // Or a loading skeleton
  }
  
  const getWorkoutsForDay = (dayName: string) => {
    return workouts.filter(workout => {
      return format(new Date(workout.date), 'EEEE') === dayName;
    });
  };

  const renderTabsList = () => {
    const triggers = weeklyPlanWithIcons.map((item) => (
      <TabsTrigger key={item.day} value={item.day} className="py-2 flex-1">
        {item.day.substring(0,3)}
      </TabsTrigger>
    ));

    if (isMobile) {
      return (
        <div className="relative w-full overflow-hidden">
          <Carousel
            opts={{
              align: "start",
              startIndex: weeklyPlanWithIcons.findIndex(d => d.day === currentDay),
            }}
            className="w-full"
          >
            <CarouselContent>
               <TabsList className="grid w-full grid-cols-7 h-auto p-0 border-none bg-transparent">
                {weeklyPlanWithIcons.map((item, index) => (
                   <CarouselItem key={index} className="basis-1/4">
                      <TabsTrigger key={item.day} value={item.day} className="py-2 w-full">
                          {item.day.substring(0,3)}
                      </TabsTrigger>
                   </CarouselItem>
                ))}
               </TabsList>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      );
    }

    return (
       <TabsList className="grid w-full grid-cols-7 h-auto">
        {triggers}
      </TabsList>
    );
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
          {renderTabsList()}
          {weeklyPlanWithIcons.map((item) => {
            const dayWorkouts = getWorkoutsForDay(item.day);
            return (
                <TabsContent key={item.day} value={item.day}>
                  <div className="mt-4 flex flex-col md:flex-row bg-secondary/30 rounded-lg">
                    <div className="flex flex-col items-center justify-center p-8 min-h-[150px] md:w-1/3">
                      {item.icon}
                      <p className="mt-4 text-2xl font-bold text-foreground">
                        {item.focus} Day
                      </p>
                      <p className="text-sm text-muted-foreground">{item.day}</p>
                    </div>
                  
                    <div className="h-full p-4 md:w-2/3">
                       {dayWorkouts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 max-h-[200px] overflow-y-auto pr-2">
                          {dayWorkouts.map(workout => (
                            <div key={workout.id} className="p-2 bg-background/50 rounded-full border border-border/50 text-xs w-40">
                               <p className="font-semibold text-primary truncate text-center">{workout.type}</p>
                               <div className="flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-1 mt-1 text-muted-foreground">
                                  <span className="flex items-center gap-1"><Layers className="h-2.5 w-2.5" /> {workout.sets} S</span>
                                  <span className="flex items-center gap-1"><Repeat className="h-2.5 w-2.5" /> {workout.reps} R</span>
                                  {workout.kg > 0 && <span className="flex items-center gap-1"><Weight className="h-2.5 w-2.5" /> {workout.kg} kg</span>}
                               </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full rounded-lg bg-background/20">
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No workouts logged for this day yet.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
            )
          })}
        </Tabs>
      </CardContent>
    </Card>
  );
}
