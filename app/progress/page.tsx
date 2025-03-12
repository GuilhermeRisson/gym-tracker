"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, BarChart, Calendar, Dumbbell } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Dados de exemplo - em uma aplicação real, isso viria do seu banco de dados
const workoutHistory = [
  { id: 1, date: "15/10/2023", plan: "Treino Completo", exercises: 5, duration: 65 },
  { id: 2, date: "12/10/2023", plan: "Treino Completo", exercises: 5, duration: 70 },
  { id: 3, date: "10/10/2023", plan: "Push Pull Legs", exercises: 6, duration: 75 },
  { id: 4, date: "08/10/2023", plan: "Push Pull Legs", exercises: 6, duration: 80 },
  { id: 5, date: "05/10/2023", plan: "Treino Completo", exercises: 5, duration: 60 },
  { id: 6, date: "03/10/2023", plan: "Treino ABC", exercises: 7, duration: 85 },
  { id: 7, date: "01/10/2023", plan: "Treino ABC", exercises: 7, duration: 80 },
]

const exerciseProgress = {
  "Supino Reto": [
    { date: "01/09/2023", weight: 50 },
    { date: "08/09/2023", weight: 55 },
    { date: "15/09/2023", weight: 55 },
    { date: "22/09/2023", weight: 60 },
    { date: "29/09/2023", weight: 65 },
    { date: "06/10/2023", weight: 65 },
    { date: "13/10/2023", weight: 70 },
  ],
  Agachamento: [
    { date: "01/09/2023", weight: 70 },
    { date: "08/09/2023", weight: 75 },
    { date: "15/09/2023", weight: 80 },
    { date: "22/09/2023", weight: 85 },
    { date: "29/09/2023", weight: 90 },
    { date: "06/10/2023", weight: 95 },
    { date: "13/10/2023", weight: 100 },
  ],
  "Levantamento Terra": [
    { date: "01/09/2023", weight: 90 },
    { date: "08/09/2023", weight: 95 },
    { date: "15/09/2023", weight: 100 },
    { date: "22/09/2023", weight: 105 },
    { date: "29/09/2023", weight: 110 },
    { date: "06/10/2023", weight: 115 },
    { date: "13/10/2023", weight: 120 },
  ],
}

const exerciseOptions = Object.keys(exerciseProgress)

export default function ProgressPage() {
  const [selectedExercise, setSelectedExercise] = useState(exerciseOptions[0])
  const [timeRange, setTimeRange] = useState("1m")

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Acompanhamento de Progresso</h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso nos treinos e veja suas melhorias ao longo do tempo.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">
              <BarChart className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="exercises">
              <Dumbbell className="h-4 w-4 mr-2" />
              Progresso de Exercícios
            </TabsTrigger>
            <TabsTrigger value="history">
              <Calendar className="h-4 w-4 mr-2" />
              Histórico de Treinos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Treinos</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{workoutHistory.length}</div>
                  <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Duração Média</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(
                      workoutHistory.reduce((acc, workout) => acc + workout.duration, 0) / workoutHistory.length,
                    )}{" "}
                    min
                  </div>
                  <p className="text-xs text-muted-foreground">Por treino</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ficha Mais Usada</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Treino Completo</div>
                  <p className="text-xs text-muted-foreground">3 treinos</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Frequência de Treinos</CardTitle>
                <CardDescription>Número de treinos por semana no último mês.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart className="h-16 w-16 mx-auto mb-2" />
                  <p>O gráfico de frequência de treinos apareceria aqui</p>
                  <p className="text-sm">Usando Chart.js ou biblioteca similar</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercises" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Progresso de Exercícios</CardTitle>
                    <CardDescription>Acompanhe seus ganhos de força ao longo do tempo.</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Selecione exercício" />
                      </SelectTrigger>
                      <SelectContent>
                        {exerciseOptions.map((exercise) => (
                          <SelectItem key={exercise} value={exercise}>
                            {exercise}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Período" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">Último Mês</SelectItem>
                        <SelectItem value="3m">Últimos 3 Meses</SelectItem>
                        <SelectItem value="6m">Últimos 6 Meses</SelectItem>
                        <SelectItem value="1y">Último Ano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LineChart className="h-16 w-16 mx-auto mb-2" />
                  <p>O gráfico de progresso para {selectedExercise} apareceria aqui</p>
                  <p className="text-sm">Usando Chart.js ou biblioteca similar</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recordes Pessoais</CardTitle>
                <CardDescription>Seus melhores desempenhos para cada exercício.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {exerciseOptions.map((exercise) => {
                    const data = exerciseProgress[exercise as keyof typeof exerciseProgress]
                    const maxWeight = Math.max(...data.map((d) => d.weight))

                    return (
                      <Card key={exercise} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base">{exercise}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-2xl font-bold">{maxWeight} kg</div>
                          <p className="text-xs text-muted-foreground">
                            Alcançado em {data.find((d) => d.weight === maxWeight)?.date}
                          </p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Treinos Recentes</CardTitle>
                <CardDescription>Seu histórico de treinos dos últimos 30 dias.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {workoutHistory.map((workout) => (
                    <div
                      key={workout.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1">
                        <div className="font-medium">{workout.plan}</div>
                        <div className="text-sm text-muted-foreground">{workout.date}</div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Dumbbell className="h-3 w-3" />
                          {workout.exercises} exercícios
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {workout.duration} min
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

