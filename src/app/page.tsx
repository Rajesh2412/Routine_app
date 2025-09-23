
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { getDb } from "@/app/lib/firebase";
import type { Workout, WorkoutFormValues, WaterIntakeData } from "@/lib/types";
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
import WaterIntakeForm from "./components/water-intake-form";
import { format, subDays } from "date-fns";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isWaterFormOpen, setIsWaterFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [waterIntakeData, setWaterIntakeData] = useState<WaterIntakeData[]>([]);

  const fetchWaterIntakeData = useCallback(async () => {
    const db = await getDb();
    const today = new Date();
    const last7Days: WaterIntakeData[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, "yyyy-MM-dd");
      const docRef = doc(db, "waterIntake", dateString);
      const docSnap = await getDoc(docRef);
      
      last7Days.push({
        date: format(date, 'EEE'),
        intake: docSnap.exists() ? docSnap.data().totalIntake : 0,
      });
    }
    setWaterIntakeData(last7Days);
  }, []);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const db = await getDb();
      const querySnapshot = await getDocs(collection(db, "workouts"));
      const workoutsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Workout[];
      setWorkouts(workoutsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      
      await fetchWaterIntakeData();
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchWaterIntakeData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const handleAddWorkout = async (workout: WorkoutFormValues) => {
    const newWorkout = {
      ...workout,
      date: new Date().toISOString(),
    };
    try {
      const db = await getDb();
      const docRef = await addDoc(collection(db, "workouts"), newWorkout);
      setWorkouts((prev) => [{ id: docRef.id, ...newWorkout } as Workout, ...prev]);
    } catch (error) {
      console.error("Error adding workout: ", error);
    }
  };

  const handleAddWater = async (quantity: number) => {
    const db = await getDb();
    const today = new Date();
    const dateString = format(today, "yyyy-MM-dd");
    const docRef = doc(db, "waterIntake", dateString);

    try {
        const docSnap = await getDoc(docRef);
        let newTotal = quantity / 1000; // Convert ml to L
        if (docSnap.exists()) {
            newTotal += docSnap.data().totalIntake;
        }
        await setDoc(docRef, { totalIntake: newTotal, date: today.toISOString() });
        fetchWaterIntakeData(); // Refresh chart data
    } catch (error) {
        console.error("Error updating water intake: ", error);
    }
  };

  const handleUpdateWorkout = async (workout: Workout) => {
    try {
      const db = await getDb();
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
      const db = await getDb();
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

  const filteredWorkouts = useMemo(() => {
    if (filter === "All") {
      return workouts;
    }
    return workouts.filter((w) => w.bodyPart === filter);
  }, [workouts, filter]);

  const allFilters = useMemo(() => ["All", ...BODY_PARTS], []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    if (showHistory) {
      return (
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
              <WorkoutHistory
                workouts={filteredWorkouts}
                onEdit={handleOpenEditForm}
                onDelete={handleDeleteWorkout}
              />
            </CardContent>
          </Card>
        </div>
      );
    }
    return (
      <div className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <PersonalStats />
        <WaterIntakeChart waterIntakeData={waterIntakeData}/>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto p-4 md:p-8 pb-32">
        {renderContent()}
      </main>

      <FloatingMenu
        onOpenAddForm={handleOpenAddForm}
        onShowHistory={() => setShowHistory(true)}
        onShowHome={() => setShowHistory(false)}
        onOpenWaterForm={() => setIsWaterFormOpen(true)}
        showHistory={showHistory}
      />

      <WorkoutForm
        isOpen={isFormOpen}
        setIsOpen={setIsFormOpen}
        addWorkout={handleAddWorkout}
        updateWorkout={handleUpdateWorkout}
        editingWorkout={editingWorkout}
      />

      <WaterIntakeForm
        isOpen={isWaterFormOpen}
        setIsOpen={setIsWaterFormOpen}
        addWater={handleAddWater}
      />
    </div>
  );
}
