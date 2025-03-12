export type User = {
  id: number
  name: string
  email: string
  password: string // Em uma aplicação real, isso seria criptografado
  weightUnit: "kg" | "lbs"
  createdAt: Date
  updatedAt: Date
}

export type Exercise = {
  id: number
  name: string
  category: string
  equipment: string | null
  createdAt: Date
  updatedAt: Date
}

export type WorkoutPlan = {
  id: number
  userId: number
  name: string
  createdAt: Date
  updatedAt: Date
}

export type WorkoutPlanDay = {
  id: number
  workoutPlanId: number
  dayOfWeek: string // Segunda, Terça, etc.
  createdAt: Date
  updatedAt: Date
}

export type WorkoutPlanExercise = {
  id: number
  workoutPlanDayId: number
  exerciseId: number
  sets: number
  reps: string // ex., "8-12" ou "10"
  weight: number
  createdAt: Date
  updatedAt: Date
}

export type WorkoutLog = {
  id: number
  userId: number
  workoutPlanId: number | null
  date: Date
  notes: string | null
  duration: number | null // em minutos
  createdAt: Date
  updatedAt: Date
}

export type WorkoutLogExercise = {
  id: number
  workoutLogId: number
  exerciseId: number
  createdAt: Date
  updatedAt: Date
}

export type WorkoutLogSet = {
  id: number
  workoutLogExerciseId: number
  setNumber: number
  reps: number
  weight: number
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

export type ProgressHistory = {
  id: number
  userId: number
  exerciseId: number
  weight: number
  date: Date
  createdAt: Date
  updatedAt: Date
}

