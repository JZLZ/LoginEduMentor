/**
 * Serviço de integração com o Sherlock Backend (NestJS API).
 * Gerencia chamadas de autenticação, registro e persistência de token JWT.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://localhost:21165/api"

const TOKEN_KEY = "sherlock_auth_token"

export interface UserTokenPayload {
  sub: string
  email: string
  name: string
  surname: string
  role: "user" | "sysadmin"
  exp?: number
  iat?: number
}

export interface LoginResponse {
  message: string
  data: {
    token: string
  }
}

export interface RegisterResponse {
  message: string
  data: {
    _id: string
    name: string
    surname: string
    email: string
    role: string
    createdAt?: string
    tempPassword?: string | null
  }
}

export interface ApiError {
  message: string | string[]
  error?: string
  statusCode?: number
}

export interface UserDetailsResponse {
  message: string
  data: unknown
}

/**
 * Decodifica o payload de um token JWT sem dependências externas.
 */
export function parseJwt(token: string): UserTokenPayload | null {
  try {
    const parts = token.split(".")
    if (parts.length < 2) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/**
 * Utilitários para manipular o token no LocalStorage.
 */
export const tokenStorage = {
  get: (): string | null => {
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },
  set: (token: string): void => {
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      // Ignora erro de storage indisponível
    }
  },
  clear: (): void => {
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      // Ignora erro
    }
  },
  getUser: (): UserTokenPayload | null => {
    const token = tokenStorage.get()
    return token ? parseJwt(token) : null
  },
}

/**
 * Função genérica para requisições à API do sherlock-backend.
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const token = tokenStorage.get()
  const headers = new Headers(options.headers || {})

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`

  let response: Response
  try {
    response = await fetch(url, { ...options, headers })
  } catch (err) {
    throw new Error(
      "Não foi possível conectar ao servidor backend. Verifique se o sherlock-backend está em execução.",
    )
  }

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    const errorData = data as ApiError | null
    const message = Array.isArray(errorData?.message)
      ? errorData.message.join(". ")
      : errorData?.message || `Erro na requisição (${response.status})`
    throw new Error(message)
  }

  return data as T
}

export const authApi = {
  /**
   * Realiza login no backend sherlock-backend (POST /api/auth/login).
   */
  login: async (email: string, password: string): Promise<{
    token: string
    user: UserTokenPayload | null
  }> => {
    const res = await apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: email.trim(), password: password.trim() }),
    })

    const token = res.data.token
    tokenStorage.set(token)
    const user = parseJwt(token)

    return { token, user }
  },

  /**
   * Realiza cadastro de usuário no backend (POST /api/user/register).
   */
  register: async (userData: {
    name: string
    surname: string
    email: string
    password?: string
    generatePassword?: boolean
  }): Promise<RegisterResponse> => {
    return await apiFetch<RegisterResponse>("/user/register", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  /**
   * Valida o token JWT atual na rota protegida (GET /api/auth).
   */
  verifyToken: async (): Promise<boolean> => {
    try {
      await apiFetch<{ message: string }>("/auth", { method: "GET" })
      return true
    } catch {
      return false
    }
  },

  /**
   * Busca dados do usuário por ID (GET /api/user/:id).
   */
  getUserById: async (id: string) => {
    return await apiFetch<UserDetailsResponse>(`/user/${id}`, {
      method: "GET",
    })
  },

  /**
   * Desloga o usuário limpando o token armazenado.
   */
  logout: (): void => {
    tokenStorage.clear()
  },

  /**
   * Retorna a URL base configurada.
   */
  getBaseUrl: (): string => API_BASE_URL,
}
