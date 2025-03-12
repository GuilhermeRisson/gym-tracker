"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Check, ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { getAllWorkoutPlans } from "@/lib/workout-plans"
import { createWorkoutLog } from "@/lib/workout-logs"

export default function LogWorkoutPage() {
  const [workoutPlans, setWorkoutPlans] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState<string>("")
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0])
  const [notes, setNotes] = useState<string>("")
  const [exercises, setExercises] = useState<
    Array<{
      id: number
      exerciseId: number
      name: string
      sets: Array<{
        id: number
        reps: string
        weight: string
        completed: boolean
      }>
    }>
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPlans, setIsLoadingPlans] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchWorkoutPlans = async () => {
      try {
        const data = await getAllWorkoutPlans()
        setWorkoutPlans(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar fichas de treino",
          description: "Não foi possível carregar a lista de fichas de treino.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingPlans(false)
      }
    }

    fetchWorkoutPlans()
  }, [toast])

  const handlePlanChange = async (planId: string) => {
    setSelectedPlan(planId)

    if (planId) {
      try {
        const selectedPlanData = workoutPlans.find((plan) => plan.id === Number.parseInt(planId))

        if (selectedPlanData) {
          setExercises(
            selectedPlanData.exercises.map((exercise: any) => ({
              id: Date.now() + exercise.exerciseId,
              exerciseId: exercise.exerciseId,
              name: availableExercises.find((ex: any) => ex.id === exercise.exerciseId)?.name || "Exercício",
              sets: [
                {
                  id: Date.now(),
                  reps: exercise.reps,
                  weight: exercise.weight,
                  completed: false,
                },
                {
                  id: Date.now() + 1,
                  reps: exercise.reps,
                  weight: exercise.weight,
                  completed: false,
                },
                {
                  id: Date.now() + 2,
                  reps: exercise.reps,
                  weight: exercise.weight,
                  completed: false,
                },
              ],
            })),
          )
        }
      } catch (error) {
        toast({
          title: "Erro ao carregar exercícios",
          description: "Não foi possível carregar os exercícios da ficha de treino.",
          variant: "destructive",
        })
      }
    } else {
      setExercises([])
    }
  }

  const addSet = (exerciseIndex: number) => {
    const exercise = exercises[exerciseIndex]
    const lastSet = exercise.sets[exercise.sets.length - 1]

    setExercises(
      exercises.map((ex, index) =>
        index === exerciseIndex
          ? {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  id: Date.now(),
                  reps: lastSet.reps,
                  weight: lastSet.weight,
                  completed: false,
                },
              ],
            }
          : ex,
      ),
    )
  }

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    if (exercises[exerciseIndex].sets.length <= 1) {
      toast({
        title: "Não é possível remover série",
        description: "Cada exercício deve ter pelo menos uma série.",
        variant: "destructive",
      })
      return
    }

    setExercises(
      exercises.map((ex, exIndex) =>
        exIndex === exerciseIndex
          ? {
              ...ex,
              sets: ex.sets.filter((_, sIndex) => sIndex !== setIndex),
            }
          : ex,
      ),
    )
  }

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: any) => {
    setExercises(
      exercises.map((ex, exIndex) =>
        exIndex === exerciseIndex
          ? {
              ...ex,
              sets: ex.sets.map((set, sIndex) => (sIndex === setIndex ? { ...set, [field]: value } : set)),
            }
          : ex,
      ),
    )
  }

  const toggleSetCompletion = (exerciseIndex: number, setIndex: number) => {
    updateSet(exerciseIndex, setIndex, "completed", !exercises[exerciseIndex].sets[setIndex].completed)
  }

  const moveSet = (exerciseIndex: number, setIndex: number, direction: "up" | "down") => {
    if (
      (direction === "up" && setIndex === 0) ||
      (direction === "down" && setIndex === exercises[exerciseIndex].sets.length - 1)
    ) {
      return
    }

    const newExercises = [...exercises]
    const sets = [...newExercises[exerciseIndex].sets]
    const targetIndex = direction === "up" ? setIndex - 1 : setIndex + 1

    // Trocar séries
    ;[sets[setIndex], sets[targetIndex]] = [sets[targetIndex], sets[setIndex]]

    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      sets,
    }

    setExercises(newExercises)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedPlan) {
      toast({
        title: "Nenhuma ficha de treino selecionada",
        description: "Por favor, selecione uma ficha de treino.",
        variant: "destructive",
      })
      return
    }

    if (exercises.length === 0) {
      toast({
        title: "Nenhum exercício",
        description: "Seu treino não tem exercícios.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      await createWorkoutLog({
        workoutPlanId: Number.parseInt(selectedPlan),
        date,
        notes,
        exercises: exercises.map((ex) => ({
          exerciseId: ex.exerciseId,
          name: ex.name,
          sets: ex.sets.map(({ id, ...rest }) => rest),
        })),
      })

      toast({
        title: "Treino registrado",
        description: `Seu treino foi registrado com sucesso.`,
      })

      router.push("/progress")
    } catch (error: any) {
      toast({
        title: "Falha ao registrar treino",
        description:
          error.response?.data?.message || "Houve um erro ao registrar seu treino. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Simulação de exercícios disponíveis para o nome
  const availableExercises = [
    { id: 1, name: "Supino Reto" },
    { id: 2, name: "Agachamento" },
    { id: 3, name: "Levantamento Terra" },
    { id: 4, name: "Barra Fixa" },
    { id: 5, name: "Desenvolvimento" },
    { id: 6, name: "Rosca Direta" },
    { id: 7, name: "Tríceps Corda" },
    { id: 8, name: "Leg Press" },
    { id: 9, name: "Puxada Frontal" },
  ]

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Registrar Treino</h1>

        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Treino</CardTitle>
                <CardDescription>Selecione sua ficha de treino e insira os detalhes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="plan">Ficha de Treino</Label>
                  <Select value={selectedPlan} onValueChange={handlePlanChange} disabled={isLoadingPlans}>
                    <SelectTrigger id="plan">
                      <SelectValue placeholder={isLoadingPlans ? "Carregando..." : "Selecione uma ficha de treino"} />
                    </SelectTrigger>
                    <SelectContent>
                      {workoutPlans.map((plan) => (
                        <SelectItem key={plan.id} value={plan.id.toString()}>
                          {plan.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Data</Label>
                  <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações</Label>
                  <Textarea
                    id="notes"
                    placeholder="Como foi seu treino? Algum recorde pessoal ou desafios?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>

            {selectedPlan && (
              <Card>
                <CardHeader>
                  <CardTitle>Exercícios</CardTitle>
                  <CardDescription>Registre suas séries, repetições e pesos para cada exercício.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {exercises.map((exercise, exerciseIndex) => (
                    <div key={exercise.id} className="space-y-4 p-4 border rounded-lg">
                      <div className="font-medium text-lg">{exercise.name}</div>

                      <div className="space-y-3">
                        {exercise.sets.map((set, setIndex) => (
                          <div key={set.id} className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-10 text-center font-medium text-muted-foreground">
                              #{setIndex + 1}
                            </div>

                            <div className="grid grid-cols-2 gap-2 flex-1">
                              <div className="space-y-1">
                                <Label htmlFor={`reps-${exercise.id}-${set.id}`} className="text-xs">
                                  Repetições
                                </Label>
                                <Input
                                  id={`reps-${exercise.id}-${set.id}`}
                                  value={set.reps}
                                  onChange={(e) => updateSet(exerciseIndex, setIndex, "reps", e.target.value)}
                                  className={set.completed ? "border-green-500" : ""}
                                />
                              </div>

                              <div className="space-y-1">
                                <Label htmlFor={`weight-${exercise.id}-${set.id}`} className="text-xs">
                                  Peso
                                </Label>
                                <Input
                                  id={`weight-${exercise.id}-${set.id}`}
                                  value={set.weight}
                                  onChange={(e) => updateSet(exerciseIndex, setIndex, "weight", e.target.value)}
                                  className={set.completed ? "border-green-500" : ""}
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className={set.completed ? "text-green-500" : ""}
                                onClick={() => toggleSetCompletion(exerciseIndex, setIndex)}
                              >
                                <Check className="h-4 w-4" />
                                <span className="sr-only">Completar</span>
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => moveSet(exerciseIndex, setIndex, "up")}
                                disabled={setIndex === 0}
                              >
                                <ChevronUp className="h-4 w-4" />
                                <span className="sr-only">Mover para cima</span>
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => moveSet(exerciseIndex, setIndex, "down")}
                                disabled={setIndex === exercise.sets.length - 1}
                              >
                                <ChevronDown className="h-4 w-4" />
                                <span className="sr-only">Mover para baixo</span>
                              </Button>

                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeSet(exerciseIndex, setIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remover</span>
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => addSet(exerciseIndex)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Adicionar Série
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <CardFooter className="flex justify-between px-0">
              <Button type="button" variant="outline" onClick={() => router.push("/dashboard")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading || isLoadingPlans}>
                {isLoading ? "Salvando..." : "Registrar Treino"}
              </Button>
            </CardFooter>
          </div>
        </form>
      </div>
    </div>
  )
}

