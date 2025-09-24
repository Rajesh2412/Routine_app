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
import { CalendarDays, Dumbbell, Coffee } from "lucide-react";
import { WEEKLY_PLAN } from "@/lib/data";
import { useIsMobile } from "@/hooks/use-mobile";


const weeklyPlanWithIcons = WEEKLY_PLAN.map(plan => ({
    ...plan,
    icon: plan.focus === "Rest" ? <Coffee className="h-10 w-10 text-primary" /> : <Dumbbell className="h-10 w-10 text-primary" />
}));


export default function WeeklyPlan() {
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
          {weeklyPlanWithIcons.map((item) => (
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
