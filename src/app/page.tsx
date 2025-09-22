
"use client";

import { useState, useMemo, useEffect } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import type { Workout, WorkoutFormValues } from "@/lib/types";
import { BODY_PARTS } from "@/app/lib/data";
import { Filter, Home as HomeIcon, Loader2, History } from "lucide-react";
import WorkoutHistory from "@/app/components/workout-history";
import WorkoutFilters from "@/app/components/workout-filters";
import WorkoutForm from "@/app/components/workout-form";
import Header from "@/app/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FloatingMenu from "./components/floating-menu";
import PersonalStats from "./components/personal-stats";
import WaterIntakeChart from "./components/water-intake-chart";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);


  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "workouts"));
        const workoutsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Workout[];
        setWorkouts(workoutsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (error) {
        console.error("Error fetching workouts: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const handleAddWorkout = async (workout: WorkoutFormValues) => {
    const newWorkout = {
      ...workout,
      date: new Date().toISOString(),
    };
    try {
      const docRef = await addDoc(collection(db, "workouts"), newWorkout);
      setWorkouts((prev) => [{ id: docRef.id, ...newWorkout } as Workout, ...prev]);
    } catch (error) {
      console.error("Error adding workout: ", error);
    }
  };

  const handleUpdateWorkout = async (workout: Workout) => {
    try {
      const workoutRef = doc(db, "workouts", workout.id);
      // We don't want to save the id field inside the document
      const { id, ...workoutData } = workout;
      await updateDoc(workoutRef, workoutData);
      setWorkouts((prev) =>
        prev.map((w) => (w.id === workout.id ? workout : w))
      );
    } catch (error) {
      console.error("Error updating workout: ", error);
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await deleteDoc(doc(db, "workouts", id));
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
    } catch (error) {
      console.error("Error deleting workout: ", error);
    }
  };

  const handleOpenEditForm = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsFormOpen(true);
  };
  
  const handleOpenAddForm = () => {
    setEditingWorkout(null);
    setIsFormOpen(true);
  };

  const handleShowHistory = (show: boolean) => {
    setShowHistory(show);
  };

  const filteredWorkouts = useMemo(() => {
    if (filter === "All") {
      return workouts;
    }
    return workouts.filter((w) => w.bodyPart === filter);
  }, [workouts, filter]);

  const allFilters = useMemo(() => ["All", ...BODY_PARTS], []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8 pb-32">
        {!showHistory && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <PersonalStats />
            <WaterIntakeChart />
          </div>
        )}
        {showHistory && (
          <div className="mt-8">
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
                    bodyParts={allFilters}
                    currentFilter={filter}
                    onFilterChange={setFilter}
                  />
                </div>
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <WorkoutHistory
                      workouts={filteredWorkouts}
                      onEdit={handleOpenEditForm}
                      onDelete={handleDeleteWorkout}
                    />
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <FloatingMenu onOpenAddForm={handleOpenAddForm} onShowHistory={() => handleShowHistory(!showHistory)} />

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
