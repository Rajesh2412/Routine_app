
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, query, where } from "firebase/firestore";
import { getDb } from "@/app/lib/firebase";
import type { Workout, WorkoutFormValues, WaterIntakeData } from "@/lib/types";
import { BODY_PARTS } from "@/app/lib/data";
import { Loader2, History } from "lucide-react";
import WorkoutHistory from "@/app/components/workout-history";
import WorkoutFilters from "@/app/components/workout-filters";
import WorkoutForm from "@/app/components/workout-form";
import Header from "@/app/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FloatingMenu from "./components/floating-menu";
import PersonalStats from "./components/personal-stats";
import WaterIntakeChart from "./components/water-intake-chart";
import WaterIntakeForm from "@/app/components/water-intake-form";
import { format, subDays, startOfDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Filter } from "lucide-react";

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [waterIntakeData, setWaterIntakeData] = useState<WaterIntakeData[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [isWorkoutFormOpen, setIsWorkoutFormOpen] = useState(false);
  const [isWaterFormOpen, setIsWaterFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [isDbReady, setIsDbReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    console.log("Attempting to initialize database...");
    getDb()
      .then(() => {
        console.log("Database ready, client is online.");
        setIsDbReady(true);
      })
      .catch((error) => {
        console.error("!!! Failed to initialize database:", error);
        toast({
          variant: "destructive",
          title: "Database Connection Error",
          description: "Could not connect to Firestore. Please check console for details.",
          duration: 10000,
        });
      });
  }, [toast]);

  const fetchWaterIntakeData = useCallback(async () => {
    if (!isDbReady) {
      console.log("DB not ready, skipping water intake fetch.");
      return;
    }
    try {
      const db = await getDb();
      const today = startOfDay(new Date());
      const weekAgo = subDays(today, 6);
      
      const q = query(
        collection(db, "waterIntake"),
        where("date", ">=", format(weekAgo, "yyyy-MM-dd")),
        where("date", "<=", format(today, "yyyy-MM-dd"))
      );

      const querySnapshot = await getDocs(q);
      const fetchedData: { [key: string]: number } = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        fetchedData[data.date] = data.intake;
      });

      const last7DaysData: WaterIntakeData[] = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(today, 6 - i);
        const dateString = format(date, "yyyy-MM-dd");
        const dayName = format(date, "E");
        return {
          date: dayName,
          intake: fetchedData[dateString] || 0,
        };
      });

      setWaterIntakeData(last7DaysData);

    } catch (error) {
      console.error("Error fetching water intake data: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not load water intake data.",
      });
    }
  }, [toast, isDbReady]);

  useEffect(() => {
    if (!isDbReady) {
       console.log("DB not ready, skipping initial data fetch.");
      return;
    }

    const fetchInitialData = async () => {
      console.log("DB is ready, fetching initial data...");
      setIsLoading(true);
      try {
        const db = await getDb();
        const workoutsQuerySnapshot = await getDocs(collection(db, "workouts"));
        const workoutsData = workoutsQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Workout[];
        setWorkouts(workoutsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        
        await fetchWaterIntakeData();

      } catch (error) {
        console.error("Error fetching initial data: ", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load initial app data.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [isDbReady, toast, fetchWaterIntakeData]);


  const handleAddWorkout = async (workout: WorkoutFormValues) => {
    if (!isDbReady) {
       toast({ variant: "destructive", title: "Database not ready."});
       return;
    }
    const newWorkout = {
      ...workout,
      date: new Date().toISOString(),
    };
    try {
      const db = await getDb();
      const docRef = await addDoc(collection(db, "workouts"), newWorkout);
      setWorkouts((prev) => [{ id: docRef.id, ...newWorkout } as Workout, ...prev]);
       toast({
        title: "Success",
        description: "Workout logged successfully.",
      });
    } catch (error) {
      console.error("Error adding workout: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save workout. Check console for details.",
      });
    }
  };

  const handleUpdateWorkout = async (workout: Workout) => {
    if (!isDbReady) {
       toast({ variant: "destructive", title: "Database not ready."});
       return;
    }
    try {
      const db = await getDb();
      const workoutRef = doc(db, "workouts", workout.id);
      const { id, ...workoutData } = workout;
      await updateDoc(workoutRef, workoutData);
      setWorkouts((prev) =>
        prev.map((w) => (w.id === workout.id ? workout : w))
      );
      toast({
        title: "Success",
        description: "Workout updated successfully.",
      });
    } catch (error) {
      console.error("Error updating workout: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update workout. Check console for details.",
      });
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    if (!isDbReady) {
       toast({ variant: "destructive", title: "Database not ready."});
       return;
    }
    try {
      const db = await getDb();
      await deleteDoc(doc(db, "workouts", id));
      setWorkouts((prev) => prev.filter((w) => w.id !== id));
      toast({
        title: "Success",
        description: "Workout deleted.",
      });
    } catch (error) {
      console.error("Error deleting workout: ", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not delete workout. Check console for details.",
      });
    }
  };

  const handleAddWater = async (quantity: number) => {
    if (!isDbReady) {
       toast({ variant: "destructive", title: "Database not ready."});
       return;
    }
    const intakeInLiters = quantity / 1000;
    const today = startOfDay(new Date());
    const docId = format(today, "yyyy-MM-dd");

    try {
      const db = await getDb();
      const docRef = doc(db, "waterIntake", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentIntake = docSnap.data().intake || 0;
        await updateDoc(docRef, {
          intake: currentIntake + intakeInLiters,
        });
      } else {
        await setDoc(docRef, {
          date: format(today, "yyyy-MM-dd"),
          intake: intakeInLiters,
        });
      }
      toast({
        title: "Success",
        description: `${quantity}ml of water logged.`,
      });
      await fetchWaterIntakeData(); // Refresh chart data
    } catch (error) {
       console.error("Error adding water intake: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not log water intake. Check console for details.",
      });
    }
  };
  
  const handleOpenEditForm = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsWorkoutFormOpen(true);
  };
  
  const handleOpenAddForm = () => {
    setEditingWorkout(null);
    setIsWorkoutFormOpen(true);
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
        <WaterIntakeChart data={waterIntakeData} />
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
        showHistory={showHistory}
        onOpenWaterForm={() => setIsWaterFormOpen(true)}
      />

      <WorkoutForm
        isOpen={isWorkoutFormOpen}
        setIsOpen={setIsWorkoutFormOpen}
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
