"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { type Exercise, getAllExercises, deleteExercise } from "@/lib/exercises"

const categories = ["Todos", "Peito", "Costas", "Pernas", "Ombros", "Braços", "Core"]

export default function ExercisesPage() {
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("Todos")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const data = await getAllExercises()
        setExercises(data)
      } catch (error) {
        toast({
          title: "Erro ao carregar exercícios",
          description: "Não foi possível carregar a lista de exercícios.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchExercises()
  }, [toast])

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "Todos" || exercise.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: number) => {
    if (confirm("Tem certeza que deseja excluir este exercício?")) {
      try {
        await deleteExercise(id)
        setExercises(exercises.filter((exercise) => exercise.id !== id))
        toast({
          title: "Exercício excluído",
          description: "O exercício foi excluído com sucesso.",
        })
      } catch (error) {
        toast({
          title: "Erro ao excluir exercício",
          description: "Não foi possível excluir o exercício.",
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
            <h1 className="text-3xl font-bold tracking-tight">Exercícios</h1>
            <p className="text-muted-foreground">
              Gerencie sua biblioteca de exercícios. Adicione, edite ou remova exercícios.
            </p>
          </div>
          <Link href="/exercises/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Exercício
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Biblioteca de Exercícios</CardTitle>
            <CardDescription>Navegue e pesquise por todos os exercícios disponíveis.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar exercícios..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Equipamento</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        Carregando exercícios...
                      </TableCell>
                    </TableRow>
                  ) : filteredExercises.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                        Nenhum exercício encontrado. Tente ajustar sua pesquisa ou adicione um novo exercício.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExercises.map((exercise) => (
                      <TableRow key={exercise.id}>
                        <TableCell className="font-medium">{exercise.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{exercise.category}</Badge>
                        </TableCell>
                        <TableCell>{exercise.equipment}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Link href={`/exercises/${exercise.id}/edit`}>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Editar</span>
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => exercise.id && handleDelete(exercise.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Excluir</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

