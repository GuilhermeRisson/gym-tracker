import api from "./axios"

// Interface para os dados de login
interface LoginData {
  email: string
  password: string
}

// Interface para os dados de registro
interface RegisterData {
  name: string
  email: string
  password: string
  weightUnit: "kg" | "lbs"
}

// Interface para a resposta de autenticação
interface AuthResponse {
  token: string
  user: {
    id: number
    name: string
    email: string
    weightUnit: "kg" | "lbs"
  }
}

// Função para fazer login
export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data)

  // Salvar o token no localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
  }

  return response.data
}

// Função para fazer registro
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/register", data)

  // Salvar o token no localStorage
  if (response.data.token) {
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("user", JSON.stringify(response.data.user))
  }

  return response.data
}

// Função para fazer logout
export const logout = (): void => {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}

// Função para verificar se o usuário está autenticado
export const isAuthenticated = (): boolean => {
  return localStorage.getItem("token") !== null
}

// Função para obter o usuário atual
export const getCurrentUser = () => {
  const user = localStorage.getItem("user")
  return user ? JSON.parse(user) : null
}

