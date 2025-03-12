"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const categories = ["Peito", "Costas", "Pernas", "Ombros", "Braços", "Core"]
const equipmentTypes = ["Barra", "Halteres", "Máquina", "Cabo", "Peso Corporal", "Kettlebell", "Elástico", "Outro"]

interface ExerciseFormProps {
  initialData?: {
    id?: number
    name: string
    category: string
    equipment: string
  }
  onSubmit: (data: {
    name: string
    category: string
    equipment: string
  }) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

export default function ExerciseForm({
  initialData = { name: "", category: "", equipment: "" },
  onSubmit,
  onCancel,
  isLoading,
}: ExerciseFormProps) {
  const [name, setName] = useState(initialData.name)
  const [category, setCategory] = useState(initialData.category)
  const [equipment, setEquipment] = useState(initialData.equipment)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({ name, category, equipment })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : initialData.id ? "Atualizar Exercício" : "Criar Exercício"}
        </Button>
      </div>
    </form>
  )
}

