"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, Edit, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type WorkoutPlan, getAllWorkoutPlans, deleteWorkoutPlan } from "@/lib/workout-plans"

export default function WorkoutPlansPage() {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)
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
        setIsLoading(false)
      }
    }

    fetchWorkoutPlans()
  }, [toast])

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir esta ficha de treino?")) {
      try {
        await deleteWorkoutPlan(id)
        setWorkoutPlans(workoutPlans.filter((plan) => plan.id !== id))
        toast({
          title: "Ficha de treino excluída",
          description: "A ficha de treino foi excluída com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro ao excluir ficha de treino",
          description: "Não foi possível excluir a ficha de treino.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fichas de Treino</h1>
            <p className="text-muted-foreground">Crie e gerencie suas rotinas de treino.</p>
          </div>
          <Link href="/workout-plans/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Criar Nova Ficha
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suas Fichas de Treino</CardTitle>
            <CardDescription>Visualize e gerencie todas as suas fichas de treino.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-6 text-muted-foreground">Carregando fichas de treino...</div>
            ) : workoutPlans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhuma ficha de treino ainda</h3>
                <p className="text-muted-foreground mt-2 mb-6">Crie sua primeira ficha de treino para começar.</p>
                <Link href="/workout-plans/new">
                  <Button>Criar Ficha de Treino</Button>
                </Link>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Dias de Treino</TableHead>
                      <TableHead>Exercícios</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workoutPlans.map((plan) => (
                      <TableRow key={plan.id}>
                        <TableCell className="font-medium">
                          <Link href={`/workout-plans/${plan.id}`} className="hover:underline">
                            {plan.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {plan.days.map((day) => (
                              <Badge key={day} variant="outline">
                                {day.substring(0, 3)}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{plan.exercises.length}</TableCell>
                        <TableCell>{new Date().toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/workout-plans/${plan.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                            </Link>
                            <Button variant="ghost" size="icon" onClick={() => plan.id && handleDelete(plan.id)}>
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

