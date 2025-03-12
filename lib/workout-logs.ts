import api from "./axios"

// Interface para os dados de uma série em um registro de treino
export interface WorkoutLogSet {
  id?: number
  reps: string
  weight: string
  completed: boolean
}

// Interface para os dados de um exercício em um registro de treino
export interface WorkoutLogExercise {
  id?: number
  exerciseId: number
  name: string
  sets: WorkoutLogSet[]
}

// Interface para os dados de um registro de treino
export interface WorkoutLog {
  id?: number
  workoutPlanId: number
  date: string
  notes?: string
  exercises: WorkoutLogExercise[]
}

// Função para buscar todos os registros de treino
export const getAllWorkoutLogs = async (): Promise<WorkoutLog[]> => {
  const response = await api.get<WorkoutLog[]>("/workout-logs")
  return response.data
}

// Função para buscar um registro de treino pelo ID
export const getWorkoutLogById = async (id: number): Promise<WorkoutLog> => {
  const response = await api.get<WorkoutLog>(`/workout-logs/${id}`)
  return response.data
}

// Função para criar um novo registro de treino
export const createWorkoutLog = async (workoutLog: WorkoutLog): Promise<WorkoutLog> => {
  const response = await api.post<WorkoutLog>("/workout-logs", workoutLog)
  return response.data
}

// Função para atualizar um registro de treino existente
export const updateWorkoutLog = async (id: number, workoutLog: WorkoutLog): Promise<WorkoutLog> => {
  const response = await api.put<WorkoutLog>(`/workout-logs/${id}`, workoutLog)
  return response.data
}

// Função para excluir um registro de treino
export const deleteWorkoutLog = async (id: number): Promise<void> => {
  await api.delete(`/workout-logs/${id}`)
}

