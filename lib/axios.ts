import axios from "axios"

// Criando uma instância do axios com configurações base
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor para adicionar token de autenticação em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Interceptor para tratamento global de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tratamento de erros comuns
    if (error.response) {
      // O servidor respondeu com um status de erro
      console.error("Erro na resposta:", error.response.status, error.response.data)

      // Se o token expirou ou é inválido (401), podemos redirecionar para login
      if (error.response.status === 401) {
        localStorage.removeItem("token")
        // Em um contexto real, você pode redirecionar para a página de login
        // window.location.href = '/login';
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error("Erro na requisição:", error.request)
    } else {
      // Algo aconteceu na configuração da requisição
      console.error("Erro:", error.message)
    }

    return Promise.reject(error)
  },
)

export default api

