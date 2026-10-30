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
    // O backend espera { email, senha } e devolve o token no header
    // Authorization (Bearer ...), não no corpo da resposta.
    const url = `${API_BASE_URL}/auth/login`
    let response: Response
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), senha: password.trim() }),
      })
    } catch {
      throw new Error(
        "Não foi possível conectar ao servidor backend. Verifique se o sherlock-backend está em execução.",
      )
    }

    const body = (await response.json().catch(() => null)) as
      | { message?: string | string[]; data?: { status?: string } }
      | null

    if (!response.ok) {
      const message = Array.isArray(body?.message)
        ? body?.message.join(". ")
        : body?.message || `Erro na requisição (${response.status})`
      throw new Error(message)
    }

    const token =
      response.headers.get("Authorization")?.replace(/^Bearer\s+/i, "") ?? null

    if (!token) {
      // Múltiplas contas: seleção de perfil necessária (sem token nesta etapa).
      throw new Error(
        "Esta conta exige seleção de perfil antes de continuar. Tente novamente pelo fluxo de seleção.",
      )
    }

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
   * Cadastro completo (POST /api/auth/cadastro) — cria usuário + conta.
   * É o fluxo oficial usado pela autenticação (coleção accounts), permitindo
   * login logo após o cadastro.
   */
  cadastrar: async (payload: {
    nomeCompleto: string
    dataNascimento: string
    escolaridade: string
    celular: string
    email: string
    emailRecuperacao: string
    senha: string
    confirmarSenha: string
    termosAceitos: boolean
    responsavelLegal?: { nomeCompleto: string; cpf: string }
  }): Promise<void> => {
    await apiFetch<unknown>("/auth/cadastro", {
      method: "POST",
      body: JSON.stringify(payload),
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

// ============================================================================
// Onboarding — Tela 01 (Curso-alvo)
// ============================================================================

export interface CourseOption {
  id: string
  name: string
  slug: string
}

interface CourseSearchResponse {
  message: string
  data: {
    items: CourseOption[]
    page: number
    limit: number
    total: number
  }
}

interface WeightAreasResponse {
  message: string
  data: {
    courseId: string
    courseName: string
    weightAreas: string[]
  }
}

interface TargetCourseResponse {
  message: string
  data: {
    targetCourseId: string | null
    targetCourseName: string | null
  }
}

/**
 * Cliente de cursos (catálogo oficial) — busca e áreas de maior peso.
 */
export const coursesApi = {
  /** Busca cursos pelo termo (o backend ignora acento e maiúsculas/minúsculas). */
  search: async (term: string): Promise<CourseOption[]> => {
    const query = term.trim()
    const res = await apiFetch<CourseSearchResponse>(
      `/courses?search=${encodeURIComponent(query)}&limit=10`,
      { method: "GET" },
    )
    return res.data.items
  },

  /** Retorna as áreas de maior peso de um curso. */
  getWeightAreas: async (courseId: string): Promise<string[]> => {
    const res = await apiFetch<WeightAreasResponse>(
      `/courses/${courseId}/weight-areas`,
      { method: "GET" },
    )
    return res.data.weightAreas
  },
}

export interface QuizQuestion {
  id: string
  area: string
  statement: string
  options: { letter: string; text: string }[]
}

interface StartAssessmentResponse {
  message: string
  data: {
    sessionId: string
    total: number
    index: number
    question: QuizQuestion
  }
}

interface AnswerResponse {
  message: string
  data: {
    index: number
    total: number
    finished: boolean
    question: QuizQuestion | null
  }
}

export interface AssessmentResult {
  total: number
  correct: number
  wrong: number
  level: "Iniciante" | "Intermediário" | "Avançado"
}

interface ResultResponse {
  message: string
  data: AssessmentResult
}

/**
 * Cliente de nivelamento (assessment) — sessão de questões.
 */
export const assessmentApi = {
  /** Inicia uma sessão de nivelamento e retorna a 1ª questão. */
  start: async (
    type: "geral" | "lingua",
    language?: "ingles" | "espanhol",
  ): Promise<StartAssessmentResponse["data"]> => {
    const res = await apiFetch<StartAssessmentResponse>("/assessment/start", {
      method: "POST",
      body: JSON.stringify(language ? { type, language } : { type }),
    })
    return res.data
  },

  /** Registra a resposta da questão atual e retorna a próxima ou o fim. */
  answer: async (
    sessionId: string,
    letter: string,
    elapsedMs: number,
  ): Promise<AnswerResponse["data"]> => {
    const res = await apiFetch<AnswerResponse>(
      `/assessment/${sessionId}/answer`,
      {
        method: "POST",
        body: JSON.stringify({ letter, elapsedMs }),
      },
    )
    return res.data
  },

  /** Finaliza a sessão (calcula pontuação/nível). */
  finish: async (sessionId: string): Promise<AssessmentResult> => {
    const res = await apiFetch<ResultResponse>(
      `/assessment/${sessionId}/finish`,
      { method: "POST" },
    )
    return res.data
  },

  /** Resultado da sessão. */
  result: async (sessionId: string): Promise<AssessmentResult> => {
    const res = await apiFetch<ResultResponse>(
      `/assessment/${sessionId}/result`,
      { method: "GET" },
    )
    return res.data
  },
}

/**
 * Cliente de onboarding — persistência incremental do fluxo.
 */
export const onboardingApi = {
  /** Registra o curso-alvo escolhido na Tela 01. */
  setTargetCourse: async (
    courseId: string,
  ): Promise<TargetCourseResponse["data"]> => {
    const res = await apiFetch<TargetCourseResponse>(
      "/onboarding/target-course",
      {
        method: "PUT",
        body: JSON.stringify({ courseId }),
      },
    )
    return res.data
  },

  /** Registra o modo de início escolhido na Tela 02 (Como começar). */
  setStartMode: async (
    mode: "nivelamento" | "materias",
  ): Promise<{ startMode: "nivelamento" | "materias" | null }> => {
    const res = await apiFetch<{
      message: string
      data: { startMode: "nivelamento" | "materias" | null }
    }>("/onboarding/start-mode", {
      method: "PUT",
      body: JSON.stringify({ mode }),
    })
    return res.data
  },

  /** Registra as matérias (ordem = prioridade) e a língua (Tela 03c). */
  setSubjects: async (payload: {
    subjects: string[]
    foreignLanguage: "ingles" | "espanhol"
  }): Promise<{
    subjects: string[]
    foreignLanguage: "ingles" | "espanhol" | null
  }> => {
    const res = await apiFetch<{
      message: string
      data: { subjects: string[]; foreignLanguage: "ingles" | "espanhol" | null }
    }>("/onboarding/subjects", {
      method: "PUT",
      body: JSON.stringify(payload),
    })
    return res.data
  },

  /** Registra apenas a língua estrangeira (Tela 03d). */
  setForeignLanguage: async (
    foreignLanguage: "ingles" | "espanhol",
  ): Promise<{ foreignLanguage: "ingles" | "espanhol" | null }> => {
    const res = await apiFetch<{
      message: string
      data: { foreignLanguage: "ingles" | "espanhol" | null }
    }>("/onboarding/foreign-language", {
      method: "PUT",
      body: JSON.stringify({ foreignLanguage }),
    })
    return res.data
  },

  /** Retorna o perfil de onboarding (para pré-seleção). */
  getMe: async (): Promise<{
    targetCourseId: string | null
    targetCourseName: string | null
    startMode: "nivelamento" | "materias" | null
    subjects: string[]
    foreignLanguage: "ingles" | "espanhol" | null
  }> => {
    const res = await apiFetch<{
      message: string
      data: {
        targetCourseId: string | null
        targetCourseName: string | null
        startMode: "nivelamento" | "materias" | null
        subjects: string[]
        foreignLanguage: "ingles" | "espanhol" | null
      }
    }>("/onboarding/me", { method: "GET" })
    return res.data
  },
}
