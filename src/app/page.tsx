"use client";

import { useState, useMemo } from "react";
import type { Workout } from "@/lib/types";
import { initialWorkouts, BODY_PARTS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PlusCircle, Bot, Filter, History } from "lucide-react";
import WorkoutHistory from "@/app/components/workout-history";
import WorkoutFilters from "@/app/components/workout-filters";
import AiSuggestions from "@/app/components/ai-suggestions";
import WorkoutForm from "@/app/components/workout-form";
import Header from "@/app/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [filter, setFilter] = useState<string>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  const handleAddWorkout = (workout: Omit<Workout, "id" | "date">) => {
    const newWorkout: Workout = {
      id: new Date().toISOString(),
      date: new Date(),
      ...workout,
    };
    setWorkouts((prev) => [newWorkout, ...prev]);
  };

  const handleUpdateWorkout = (workout: Workout) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === workout.id ? workout : w))
    );
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const handleOpenEditForm = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsFormOpen(true);
  };
  
  const handleOpenAddForm = () => {
    setEditingWorkout(null);
    setIsFormOpen(true);
  };

  const filteredWorkouts = useMemo(() => {
    if (filter === "All") {
      return workouts;
    }
    return workouts.filter((w) => w.bodyPart === filter);
  }, [workouts, filter]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          <aside className="lg:col-span-1 flex flex-col gap-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Start Your Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">Ready to sweat? Log your workout and track your progress.</p>
                <Button onClick={handleOpenAddForm} className="w-full">
                  <PlusCircle /> Log New Workout
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot /> AI Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AiSuggestions workouts={workouts} />
              </CardContent>
            </Card>
          </aside>

          <div className="lg:col-span-2 mt-8 lg:mt-0">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History /> Workout History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Filter size={20} /> Filter by Body Part</h3>
                  <WorkoutFilters
                    bodyParts={["All", ...BODY_PARTS]}
                    currentFilter={filter}
                    onFilterChange={setFilter}
                  />
                </div>
                <WorkoutHistory
                  workouts={filteredWorkouts}
                  onEdit={handleOpenEditForm}
                  onDelete={handleDeleteWorkout}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <WorkoutForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        addWorkout={handleAddWorkout}
        updateWorkout={handleUpdateWorkout}
        editingWorkout={editingWorkout}
      />
    </div>
  );
}
