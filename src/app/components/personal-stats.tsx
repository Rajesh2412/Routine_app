"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Ruler, Weight } from "lucide-react";
import { format } from "date-fns";

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

const secondaryStats = [
  {
    title: "Body Water",
    value: "58 %",
    icon: <Droplets className="h-8 w-8 text-primary" />,
  },
];

export default function PersonalStats() {
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    // This now runs only on the client, avoiding the hydration error.
    setLastUpdated(format(new Date(), "PPP"));
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      <div className="mt-4 grid grid-cols-1 gap-4">
        {secondaryStats.map((stat) => (
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
