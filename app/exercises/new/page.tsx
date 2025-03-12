"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { createExercise } from "@/lib/exercises"

const categories = ["Peito", "Costas", "Pernas", "Ombros", "Braços", "Core"]
const equipmentTypes = ["Barra", "Halteres", "Máquina", "Cabo", "Peso Corporal", "Kettlebell", "Elástico", "Outro"]

export default function NewExercisePage() {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [equipment, setEquipment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createExercise({ name, category, equipment })

      toast({
        title: "Exercício criado",
        description: `${name} foi adicionado à sua biblioteca de exercícios.`,
      })

      router.push("/exercises")
    } catch (error: any) {
      toast({
        title: "Falha ao criar exercício",
        description: error.response?.data?.message || "Houve um erro ao criar o exercício. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Adicionar Novo Exercício</h1>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Detalhes do Exercício</CardTitle>
              <CardDescription>
                Digite os detalhes do novo exercício que você deseja adicionar à sua biblioteca.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Exercício</Label>
                <Input
                  id="name"
                  placeholder="ex., Supino Reto"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipment">Equipamento</Label>
                <Select value={equipment} onValueChange={setEquipment} required>
                  <SelectTrigger id="equipment">
                    <SelectValue placeholder="Selecione o tipo de equipamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map((equip) => (
                      <SelectItem key={equip} value={equip}>
                        {equip}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/exercises")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Criando..." : "Criar Exercício"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}

