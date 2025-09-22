"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Ruler, Weight } from "lucide-react";

const stats = [
  {
    title: "My Weight",
    value: "75 kg",
    icon: <Weight className="h-8 w-8 text-primary" />,
  },
  {
    title: "Body Water",
    value: "58 %",
    icon: <Droplets className="h-8 w-8 text-primary" />,
  },
  {
    title: "My Height",
    value: "180cm / 5'11\"",
    icon: <Ruler className="h-8 w-8 text-primary" />,
  },
];

export default function PersonalStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
