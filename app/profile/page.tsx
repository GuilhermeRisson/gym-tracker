"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import api from "@/lib/axios"
import { getCurrentUser } from "@/lib/auth"

export default function ProfilePage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg")
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        // Tentar obter o usuário do localStorage primeiro
        const user = getCurrentUser()

        if (user) {
          setName(user.name)
          setEmail(user.email)
          setWeightUnit(user.weightUnit)
          setIsLoadingProfile(false)
          return
        }

        // Se não tiver no localStorage, buscar da API
        const response = await api.get("/users/profile")
        const userData = response.data

        setName(userData.name)
        setEmail(userData.email)
        setWeightUnit(userData.weightUnit)
      } catch (error) {
        toast({
          title: "Erro ao carregar perfil",
          description: "Não foi possível carregar os dados do seu perfil.",
          variant: "destructive",
        })
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadUserProfile()
  }, [toast])

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.put("/users/profile", {
        name,
        email,
        weightUnit,
      })

      // Atualizar o usuário no localStorage
      const user = getCurrentUser()
      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...user,
            name,
            email,
            weightUnit,
          }),
        )
      }

      toast({
        title: "Perfil atualizado",
        description: "Seu perfil foi atualizado com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Falha ao atualizar perfil",
        description:
          error.response?.data?.message || "Houve um erro ao atualizar seu perfil. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const currentPassword = formData.get("current-password") as string
    const newPassword = formData.get("new-password") as string
    const confirmPassword = formData.get("confirm-password") as string

    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "A nova senha e a confirmação da senha devem ser iguais.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      await api.put("/users/password", {
        currentPassword,
        newPassword,
      })

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi atualizada com sucesso.",
      })

      // Resetar formulário
      e.currentTarget.reset()
    } catch (error: any) {
      toast({
        title: "Falha ao atualizar senha",
        description:
          error.response?.data?.message || "Houve um erro ao atualizar sua senha. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await api.put("/users/preferences", {
        weightUnit,
        enableNotifications,
        autoBackup,
      })

      toast({
        title: "Preferências atualizadas",
        description: "Suas preferências foram atualizadas com sucesso.",
      })
    } catch (error: any) {
      toast({
        title: "Falha ao atualizar preferências",
        description:
          error.response?.data?.message || "Houve um erro ao atualizar suas preferências. Por favor, tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingProfile) {
    return (
      <div className="container mx-auto py-10">
        <div className="max-w-3xl mx-auto text-center">
          <p>Carregando perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Configurações de Perfil</h1>

        <Tabs defaultValue="profile" className="space-y-4">
          <TabsList>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="password">Senha</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <form onSubmit={handleProfileSubmit}>
                <CardHeader>
                  <CardTitle>Informações do Perfil</CardTitle>
                  <CardDescription>Atualize suas informações pessoais.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="password">
            <Card>
              <form onSubmit={handlePasswordSubmit}>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>Atualize sua senha para manter sua conta segura.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" name="current-password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" name="new-password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                    <Input id="confirm-password" name="confirm-password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Atualizando..." : "Atualizar Senha"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <form onSubmit={handlePreferencesSubmit}>
                <CardHeader>
                  <CardTitle>Preferências</CardTitle>
                  <CardDescription>Personalize sua experiência no aplicativo.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Unidade de Peso</Label>
                    <RadioGroup
                      value={weightUnit}
                      onValueChange={(value) => setWeightUnit(value as "kg" | "lbs")}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="kg" id="kg" />
                        <Label htmlFor="kg" className="font-normal">
                          Quilogramas (kg)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lbs" id="lbs" />
                        <Label htmlFor="lbs" className="font-normal">
                          Libras (lbs)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Notificações</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notifications">Ativar Notificações</Label>
                        <p className="text-sm text-muted-foreground">Receba lembretes para seus treinos agendados.</p>
                      </div>
                      <Switch
                        id="notifications"
                        checked={enableNotifications}
                        onCheckedChange={setEnableNotifications}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Gerenciamento de Dados</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="auto-backup">Backup Automático</Label>
                        <p className="text-sm text-muted-foreground">
                          Faça backup automático dos seus dados de treino.
                        </p>
                      </div>
                      <Switch id="auto-backup" checked={autoBackup} onCheckedChange={setAutoBackup} />
                    </div>

                    <div className="pt-2">
                      <Button variant="outline" type="button">
                        Exportar Dados
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Salvando..." : "Salvar Preferências"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

