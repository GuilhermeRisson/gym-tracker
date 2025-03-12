import api from "./axios"

// Interface para os dados de exercício
export interface Exercise {
  id?: number
  name: string
  category: string
  equipment: string
}

// Função para buscar todos os exercícios
export const getAllExercises = async (): Promise<Exercise[]> => {
  const response = await api.get<Exercise[]>("/exercises")
  return response.data
}

// Função para buscar um exercício pelo ID
export const getExerciseById = async (id: number): Promise<Exercise> => {
  const response = await api.get<Exercise>(`/exercises/${id}`)
  return response.data
}

// Função para criar um novo exercício
export const createExercise = async (exercise: Exercise): Promise<Exercise> => {
  const response = await api.post<Exercise>("/exercises", exercise)
  return response.data
}

// Função para atualizar um exercício existente
export const updateExercise = async (id: number, exercise: Exercise): Promise<Exercise> => {
  const response = await api.put<Exercise>(`/exercises/${id}`, exercise)
  return response.data
}

// Função para excluir um exercício
export const deleteExercise = async (id: number): Promise<void> => {
  await api.delete(`/exercises/${id}`)
}

