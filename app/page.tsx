import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, LineChart, ListChecks, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col items-center justify-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">Sistema de Controle de Academia</h1>
          <p className="text-muted-foreground">
            Acompanhe seus treinos, monitore seu progresso e alcance seus objetivos de fitness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exercícios</CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100+</div>
              <p className="text-xs text-muted-foreground">Exercícios pré-definidos</p>
            </CardContent>
            <CardFooter>
              <Link href="/exercises" className="w-full">
                <Button className="w-full">Gerenciar Exercícios</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fichas de Treino</CardTitle>
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Criar</div>
              <p className="text-xs text-muted-foreground">Fichas de treino personalizadas</p>
            </CardContent>
            <CardFooter>
              <Link href="/workout-plans" className="w-full">
                <Button className="w-full">Gerenciar Fichas</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Acompanhar Progresso</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Análises</div>
              <p className="text-xs text-muted-foreground">Visualize seu progresso ao longo do tempo</p>
            </CardContent>
            <CardFooter>
              <Link href="/progress" className="w-full">
                <Button className="w-full">Ver Progresso</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perfil</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Configurações</div>
              <p className="text-xs text-muted-foreground">Gerencie sua conta</p>
            </CardContent>
            <CardFooter>
              <Link href="/profile" className="w-full">
                <Button className="w-full">Ver Perfil</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <Link href="/login">
            <Button variant="outline">Entrar</Button>
          </Link>
          <Link href="/register">
            <Button>Cadastrar</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

