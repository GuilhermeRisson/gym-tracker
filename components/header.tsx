"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Dumbbell, LogOut, Menu, User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { isAuthenticated, logout, getCurrentUser } from "@/lib/auth"

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated()
      setIsLoggedIn(authenticated)

      if (authenticated) {
        const user = getCurrentUser()
        if (user) {
          setUserName(user.name)
        }
      }
    }

    checkAuth()

    // Verificar autenticação quando a janela recebe foco
    window.addEventListener("focus", checkAuth)

    return () => {
      window.removeEventListener("focus", checkAuth)
    }
  }, [])

  const routes = [
    { href: "/", label: "Início", public: true },
    { href: "/exercises", label: "Exercícios", public: false },
    { href: "/workout-plans", label: "Fichas de Treino", public: false },
    { href: "/log-workout", label: "Registrar Treino", public: false },
    { href: "/progress", label: "Progresso", public: false },
  ]

  const handleLogout = () => {
    logout()
    setIsLoggedIn(false)
    router.push("/")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Dumbbell className="h-6 w-6" />
            <span className="font-bold hidden md:inline-block">Controle de Academia</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-between">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes
              .filter((route) => route.public || isLoggedIn)
              .map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "transition-colors hover:text-foreground/80",
                    pathname === route.href ? "text-foreground" : "text-foreground/60",
                  )}
                >
                  {route.label}
                </Link>
              ))}
          </nav>

          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <User className="h-4 w-4" />
                    {userName || "Usuário"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Entrar
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </>
            )}
            <ModeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-end md:hidden">
          <ModeToggle />
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Abrir menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {routes
                .filter((route) => route.public || isLoggedIn)
                .map((route) => (
                  <DropdownMenuItem key={route.href} asChild>
                    <Link href={route.href}>{route.label}</Link>
                  </DropdownMenuItem>
                ))}

              {isLoggedIn ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Perfil</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sair
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">Entrar</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register">Cadastrar</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

