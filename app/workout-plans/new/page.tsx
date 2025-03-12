"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2 } from "lucide-react"
import { createWorkoutPlan } from "@/lib/workout-plans"
import { type Exercise, getAllExercises } from "@/lib/exercises"

const weekdays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"]

export default function NewWorkoutPlanPage() {
  const [name, setName] = useState("")
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [exercises, setExercises] = useState<
    Array<{
      id: number
      exerciseId: number
      sets: number
      reps: string
      weight: string
    }>
  >([])
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingExercises, setIsLoadingExercises] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getAllExercises()
        setAvailableExercises(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar exercícios",
          description: "Não foi possível carregar a lista de exercícios.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingExercises(false)
      }
    }

    fetchExercises()
  }, [toast])

  const handleDayToggle = (day: string) => {
    setSelectedDays(selectedDays.includes(day) ? selectedDays.filter((d) => d !== day) : [...selectedDays, day])
  }

  const addExercise = () => {
    setExercises([
      ...exercises,
      {
        id: Date.now(),
        exerciseId: 0,
        sets: 3,
        reps: "8-12",
        weight: "0",
      },
    ])
  }

  const removeExercise = (id: number) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id))
  }

  const updateExercise = (id: number, field: string, value: any) => {
    setExercises(exercises.map((exercise) => (exercise.id === id ? { ...exercise, [field]: value } : exercise)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedDays.length === 0) {
      toast({
        title: "Nenhum dia selecionado",
        description: "Por favor, selecione pelo menos um dia de treino.",
        variant: "destructive",
      })
      return
    }

    if (exercises.length === 0) {
      toast({
        title: "Nenhum exercício adicionado",
        description: "Por favor, adicione pelo menos um exercício à sua ficha de treino.",
        variant: "destructive",
      })
      return
    }

    // Verificar se todos os exercícios têm um exercício selecionado
    const hasInvalidExercise = exercises.some((exercise) => exercise.exerciseId === 0)
    if (hasInvalidExercise) {
      toast({
        title: "Exercício inválido",
        description: "Por favor, selecione um exercício para todas as entradas.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await createWorkoutPlan({
        name,
        days: selectedDays,
        exercises: exercises.map(({ id, ...rest }) => rest),
      })

      toast({
        title: "Ficha de treino criada",
        description: `${name} foi criada com sucesso.`,
      })

      router.push("/workout-plans")
    } catch (error: any) {
      toast({
        title: "Falha ao criar ficha de treino",
        description:
          error.response?.data?.message || "Houve um erro ao criar a ficha de treino. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Criar Nova Ficha de Treino</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>Digite os detalhes básicos da sua ficha de treino.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Ficha de Treino</Label>
                  <Input
                    id="name"
                    placeholder="ex., Treino Completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Dias de Treino</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {weekdays.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={selectedDays.includes(day)}
                          onCheckedChange={() => handleDayToggle(day)}
                        />
                        <Label htmlFor={day} className="font-normal">
                          {day}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Exercícios</CardTitle>
                <CardDescription>Adicione exercícios à sua ficha de treino.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingExercises ? (
                  <div className="text-center py-4 text-muted-foreground">Carregando exercícios...</div>
                ) : exercises.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-4">Nenhum exercício adicionado ainda.</p>
                    <Button type="button" onClick={addExercise}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Exercício
                    </Button>
                  </div>
                ) : (
                  <>
                    {exercises.map((exercise, index) => (
                      <div key={exercise.id} className="grid gap-4 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Exercício {index + 1}</h4>
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeExercise(exercise.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remover</span>
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`exercise-${exercise.id}`}>Exercício</Label>
                            <Select
                              value={exercise.exerciseId.toString()}
                              onValueChange={(value) =>
                                updateExercise(exercise.id, "exerciseId", Number.parseInt(value))
                              }
                            >
                              <SelectTrigger id={`exercise-${exercise.id}`}>
                                <SelectValue placeholder="Selecione um exercício" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableExercises.map((ex) => (
                                  <SelectItem key={ex.id} value={ex.id?.toString() || "0"}>
                                    {ex.name} ({ex.equipment})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`sets-${exercise.id}`}>Séries</Label>
                            <Input
                              id={`sets-${exercise.id}`}
                              type="number"
                              min="1"
                              value={exercise.sets}
                              onChange={(e) => updateExercise(exercise.id, "sets", Number.parseInt(e.target.value))}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`reps-${exercise.id}`}>Repetições</Label>
                            <Input
                              id={`reps-${exercise.id}`}
                              placeholder="ex., 8-12 ou 10"
                              value={exercise.reps}
                              onChange={(e) => updateExercise(exercise.id, "reps", e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`weight-${exercise.id}`}>Peso Inicial</Label>
                            <Input
                              id={`weight-${exercise.id}`}
                              placeholder="ex., 50"
                              value={exercise.weight}
                              onChange={(e) => updateExercise(exercise.id, "weight", e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <Button type="button" variant="outline" onClick={addExercise} className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Outro Exercício
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <CardFooter className="flex justify-between px-0">
              <Button type="button" variant="outline" onClick={() => router.push("/workout-plans")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || isLoadingExercises}>
                {isLoading ? "Criando..." : "Criar Ficha de Treino"}
              </Button>
            </CardFooter>
          </div>
        </form>
      </div>
    </div>
  )
}

