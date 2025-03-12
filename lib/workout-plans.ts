import api from "./axios"

// Interface para os dados de exercício em um plano de treino
export interface WorkoutPlanExercise {
  id?: number
  exerciseId: number
  sets: number
  reps: string
  weight: string
}

// Interface para os dados de um plano de treino
export interface WorkoutPlan {
  id?: number
  name: string
  days: string[]
  exercises: WorkoutPlanExercise[]
}

// Função para buscar todos os planos de treino
export const getAllWorkoutPlans = async (): Promise<WorkoutPlan[]> => {
  const response = await api.get<WorkoutPlan[]>("/workout-plans")
  return response.data
}

// Função para buscar um plano de treino pelo ID
export const getWorkoutPlanById = async (id: number): Promise<WorkoutPlan> => {
  const response = await api.get<WorkoutPlan>(`/workout-plans/${id}`)
  return response.data
}

// Função para criar um novo plano de treino
export const createWorkoutPlan = async (workoutPlan: WorkoutPlan): Promise<WorkoutPlan> => {
  const response = await api.post<WorkoutPlan>("/workout-plans", workoutPlan)
  return response.data
}

// Função para atualizar um plano de treino existente
export const updateWorkoutPlan = async (id: number, workoutPlan: WorkoutPlan): Promise<WorkoutPlan> => {
  const response = await api.put<WorkoutPlan>(`/workout-plans/${id}`, workoutPlan)
  return response.data
}

// Função para excluir um plano de treino
export const deleteWorkoutPlan = async (id: number): Promise<void> => {
  await api.delete(`/workout-plans/${id}`)
}

