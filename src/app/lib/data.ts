import type { Workout, BodyPart } from "./types";

export const BODY_PARTS: BodyPart[] = [
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
];

export const initialWorkouts: Workout[] = [
  {
    id: "1",
    date: new Date("2024-07-20T10:00:00Z"),
    type: "Bench Press",
    reps: 8,
    equipment: "Barbell",
    bodyPart: "Chest",
  },
  {
    id: "2",
    date: new Date("2024-07-20T10:30:00Z"),
    type: "Bicep Curls",
    reps: 12,
    equipment: "Dumbbells",
    bodyPart: "Arms",
  },
  {
    id: "3",
    date: new Date("2024-07-18T09:00:00Z"),
    type: "Squats",
    reps: 10,
    equipment: "Barbell",
    bodyPart: "Legs",
  },
  {
    id: "4",
    date: new Date("2024-07-18T09:30:00Z"),
    type: "Deadlifts",
    reps: 5,
    equipment: "Barbell",
    bodyPart: "Back",
  },
  {
    id: "5",
    date: new Date("2024-07-16T17:00:00Z"),
    type: "Plank",
    reps: 1,
    equipment: "Bodyweight",
    bodyPart: "Core",
  },
];
