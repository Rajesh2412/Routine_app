
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc, query, where } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { Workout, WorkoutFormValues, WaterIntakeData, DailyStats, BodyPart, UserProfile, ProteinIntakeData } from "@/lib/types";
import { WEEKLY_PLAN } from "@/lib/data";
import { Loader2, History, Filter } from "lucide-react";
import WorkoutHistory from "@/app/components/workout-history";
import WorkoutFilters from "@/app/components/workout-filters";
import WorkoutForm from "@/app/components/workout-form";
import Header from "@/app/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FloatingMenu from "./components/floating-menu";
import PersonalStats from "./components/personal-stats";
import WaterIntakeChart from "./components/water-intake-chart";
import WaterIntakeForm from "@/app/components/water-intake-form";
import WeeklyPlan from "./components/weekly-plan";
import FoodNutrition from "./components/food-nutrition";
import ProteinTracker from "./components/protein-tracker";
import { format, subDays, startOfDay } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const ALL_BODY_PARTS: BodyPart[] = ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Abs", "Lower Back"];
const USER_PROFILE_ID = "mainUser"; // Using a static ID for the single-user app

export default function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [waterIntakeData, setWaterIntakeData] = useState<WaterIntakeData[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [proteinIntake, setProteinIntake] = useState<ProteinIntakeData | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [isWorkoutFormOpen, setIsWorkoutFormOpen] = useState(false);
  const [isWaterFormOpen, setIsWaterFormOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [isDbReady, setIsDbReady] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getDb()
      .then(() => {
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
  
  const fetchProteinIntake = useCallback(async () => {
    if (!isDbReady) return;
    try {
        const db = await getDb();
        const todayId = format(startOfDay(new Date()), "yyyy-MM-dd");
        const docRef = doc(db, "proteinIntake", todayId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setProteinIntake(docSnap.data() as ProteinIntakeData);
        } else {
            const newProteinIntake: ProteinIntakeData = {
                id: todayId,
                date: new Date().toISOString(),
                intake: 0,
            }
            await setDoc(docRef, newProteinIntake);
            setProteinIntake(newProteinIntake);
        }
    } catch (error) {
        console.error("Error fetching protein intake:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load protein intake data.",
        });
    }
  }, [isDbReady, toast]);

  const handleAddProtein = async (grams: number) => {
    if (!isDbReady) {
       toast({ variant: "destructive", title: "Database not ready."});
       return;
    }
    const todayId = format(startOfDay(new Date()), "yyyy-MM-dd");

    try {
      const db = await getDb();
      const docRef = doc(db, "proteinIntake", todayId);
      const currentIntake = proteinIntake?.intake || 0;
      const newIntake = currentIntake + grams;
      
      await setDoc(docRef, { intake: newIntake, id: todayId, date: new Date().toISOString() }, { merge: true });

      setProteinIntake(prev => ({
          ...(prev || { id: todayId, date: new Date().toISOString() }),
          intake: newIntake,
      }));

      toast({
        title: "Success",
        description: `${grams}g of protein logged.`,
      });
    } catch (error) {
       console.error("Error adding protein intake: ", error);
       toast({
        variant: "destructive",
        title: "Error",
        description: "Could not log protein intake.",
      });
    }
  };

  const fetchWaterIntakeData = useCallback(async () => {
    if (!isDbReady) return;
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

  const fetchDailyStats = useCallback(async () => {
    if (!isDbReady) return;
    try {
        const db = await getDb();
        const todayId = format(startOfDay(new Date()), "yyyy-MM-dd");
        const docRef = doc(db, "dailyStats", todayId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setDailyStats(docSnap.data() as DailyStats);
        } else {
            const newDailyStats: DailyStats = {
                id: todayId,
                date: new Date().toISOString(),
                steps: 0,
                stepsGoal: 8000,
            }
            await setDoc(docRef, newDailyStats);
            setDailyStats(newDailyStats);
        }
    } catch (error) {
        console.error("Error fetching daily stats:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load daily stats.",
        });
    }
}, [isDbReady, toast]);

const fetchUserProfile = useCallback(async () => {
    if (!isDbReady) return;
    try {
        const db = await getDb();
        const docRef = doc(db, "userProfile", USER_PROFILE_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
        } else {
            const newUserProfile: UserProfile = {
                id: USER_PROFILE_ID,
                weight: "75 kg",
                height: "180cm / 5'11\"",
                lastUpdated: new Date().toISOString(),
            }
            await setDoc(docRef, newUserProfile);
            setUserProfile(newUserProfile);
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load user profile.",
        });
    }
}, [isDbReady, toast]);


  useEffect(() => {
    if (!isDbReady) return;

    const fetchInitialData = async () => {
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
        await fetchDailyStats();
        await fetchUserProfile();
        await fetchProteinIntake();

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
  }, [isDbReady, toast, fetchWaterIntakeData, fetchDailyStats, fetchUserProfile, fetchProteinIntake]);


  const handleAddWorkout = async (workout: WorkoutFormValues) => {
    if (!isDbReady) {
       toast({ variant: "destructive", title: "Database not ready."});
       return;
    }
    const newWorkout = {
      ...workout,
      date: new Date().toISOString(),
      kg: workout.kg || 0,
    };
    try {
      const db = await getDb();
      const docRef = await addDoc(collection(db, "workouts"), newWorkout);
      setWorkouts((prev) => [{ id: docRef.id, ...newWorkout } as Workout, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
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
      await updateDoc(workoutRef, {...workoutData, kg: workout.kg || 0});
      setWorkouts((prev) =>
        prev.map((w) => (w.id === workout.id ? workout : w)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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

  const handleUpdateSteps = async (newSteps: number) => {
    if (!isDbReady || !dailyStats) {
       toast({ variant: "destructive", title: "Database not ready or stats not loaded."});
       return;
    }
    try {
      const db = await getDb();
      const docRef = doc(db, "dailyStats", dailyStats.id);
      await updateDoc(docRef, { steps: newSteps });
      setDailyStats(prev => prev ? { ...prev, steps: newSteps } : null);
      toast({
        title: "Success",
        description: "Steps updated successfully.",
      });
    } catch (error) {
      console.error("Error updating steps:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update steps.",
      });
    }
  };
  
    const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    if (!isDbReady) {
       toast({ variant: "destructive", title: "Database not ready."});
       return;
    }
    try {
      const db = await getDb();
      const docRef = doc(db, "userProfile", USER_PROFILE_ID);
      await updateDoc(docRef, data);
      setUserProfile(prev => prev ? { ...prev, ...data } : null);
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not update profile.",
      });
    }
  };

  const proteinGoal = useMemo(() => {
    if (!userProfile?.weight) return 0;
    const weightValue = parseFloat(userProfile.weight);
    if (isNaN(weightValue)) return 0;
    return weightValue * 1.6;
  }, [userProfile?.weight]);

  const handleOpenEditForm = (workout: Workout) => {
    setEditingWorkout(workout);
    setIsWorkoutFormOpen(true);
  };
  
  const handleOpenAddForm = () => {
    const today = new Date();
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
    const todaysPlan = WEEKLY_PLAN.find(plan => plan.day === dayName);
    const bodyPart = todaysPlan?.focus as BodyPart | undefined;
    
    // Check if the body part is valid for the form
    const validBodyPart = bodyPart && ALL_BODY_PARTS.includes(bodyPart) ? bodyPart : undefined;

    setEditingWorkout(null);
    formInitialValues.bodyPart = validBodyPart; // Set initial value for form
    setIsWorkoutFormOpen(true);
  };

  const formInitialValues: Partial<WorkoutFormValues> = {};


  const filteredWorkouts = useMemo(() => {
    if (filter === "All") {
      return workouts;
    }
    return workouts.filter((w) => w.bodyPart === filter);
  }, [workouts, filter]);

  const allFilters = useMemo(() => ["All", ...ALL_BODY_PARTS.filter(p => p !== 'Rest' && p !== 'Abs' && p !== 'Lower Back')], []);

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
        <PersonalStats 
          stats={dailyStats} 
          profile={userProfile}
          onUpdateSteps={handleUpdateSteps}
          onUpdateProfile={handleUpdateProfile}
        />
        <WeeklyPlan workouts={workouts} />
        <WaterIntakeChart data={waterIntakeData} />
        <FoodNutrition />
        <ProteinTracker 
            dailyIntake={proteinIntake?.intake || 0}
            proteinGoal={proteinGoal}
            onAddProtein={handleAddProtein}
            isLoading={!proteinIntake}
        />
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
        initialValues={formInitialValues}
      />
      <WaterIntakeForm 
        isOpen={isWaterFormOpen}
        setIsOpen={setIsWaterFormOpen}
        addWater={handleAddWater}
      />
    </div>
  );
}
