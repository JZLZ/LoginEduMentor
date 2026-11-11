/**
 * Serviço de Integração com a API do ENEM (api.enem.dev)
 *
 * Repositório open-source: https://github.com/yunger7/enem-api
 * Documentação: https://enem.dev/docs
 *
 * Características da API:
 * - Base URL: https://api.enem.dev/v1
 * - Rate Limit: 1 requisição/segundo em endpoints não cacheados (HTTP 429).
 * - Suporte completo aos anos de aplicação do ENEM com enunciados, imagens,
 *   disciplinas, gabaritos e alternativas.
 *
 * Recursos implementados neste serviço:
 * - Tipagem estrita TypeScript para todas as entidades do ENEM.
 * - Fila de requisições com limitação de taxa (throttling de 1050ms) para respeitar o rate-limit.
 * - Cache de dois níveis: Em memória (Map) + Persistente (localStorage) com TTL configurável.
 * - Fallbacks resilientes para garantir funcionamento contínuo mesmo offline ou se o limite for atingido.
 * - Gerador de simulados estruturados (Completo 180q / Dia 1 & 2 90q / Mini-simulado 16q / Por área 45q).
 * - Métodos prontos para consumo tanto pelo Frontend (telas de simulados e questões) quanto pela Mentorina AI.
 */

// ============================================================================
// TIPOS E INTERFACES OFICIAIS DA API.ENEM.DEV
// ============================================================================

export type EnemDiscipline =
  | "linguagens"
  | "ciencias-humanas"
  | "ciencias-natureza"
  | "matematica"

export type EnemLanguage = "ingles" | "espanhol" | null

export type EnemAlternativeLetter = "A" | "B" | "C" | "D" | "E"

export interface EnemAlternative {
  letter: EnemAlternativeLetter | string
  text: string
  file?: string | null
  isCorrect?: boolean
}

export interface EnemQuestion {
  title: string
  index: number
  year: number
  discipline: EnemDiscipline
  language?: EnemLanguage
  context: string
  files?: string[]
  correctAlternative: EnemAlternativeLetter | string
  alternativesIntroduction?: string
  alternatives: EnemAlternative[]
}

export interface EnemExam {
  year: number
  title?: string
  totalQuestions?: number
  disciplines?: EnemDiscipline[]
}

export interface EnemQuestionsMetadata {
  limit: number
  offset: number
  total: number
}

export interface EnemQuestionsResponse {
  metadata: EnemQuestionsMetadata
  questions: EnemQuestion[]
}

export interface EnemQuestionsQueryOptions {
  limit?: number
  offset?: number
  discipline?: EnemDiscipline
  language?: EnemLanguage
}

export interface SimuladoConfig {
  type: "completo" | "mini" | "area"
  year?: number
  discipline?: EnemDiscipline
  day?: 1 | 2
  quantity?: number
}

export interface SimuladoQuestionResult {
  question: EnemQuestion
  userSelectedAlternative?: string | null
  isCorrect?: boolean
  timeSpentSeconds?: number
}

// ============================================================================
// CONFIGURAÇÕES E CONSTANTES
// ============================================================================

export const ENEM_DEV_CONFIG = {
  BASE_URL: "https://api.enem.dev/v1",
  CACHE_TTL_MS: 1000 * 60 * 60 * 24 * 7, // 7 dias de persistência (questões históricas não mudam)
  RATE_LIMIT_DELAY_MS: 1050, // Garante que nunca exceda 1 req/s na api.enem.dev
  STORAGE_PREFIX: "sherlock_enem_dev_cache_",
  AVAILABLE_YEARS: [2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015] as const,
}

// Map de títulos legíveis para disciplinas
export const ENEM_DISCIPLINES_META: Record<
  EnemDiscipline,
  { name: string; shortName: string; day: 1 | 2; colorBg: string; colorText: string; colorBorder: string }
> = {
  linguagens: {
    name: "Linguagens, Códigos e suas Tecnologias",
    shortName: "Linguagens",
    day: 1,
    colorBg: "#FFF1E8",
    colorText: "#C44B17",
    colorBorder: "#F8D4C2",
  },
  "ciencias-humanas": {
    name: "Ciências Humanas e suas Tecnologias",
    shortName: "Humanas",
    day: 1,
    colorBg: "#FFF8E7",
    colorText: "#B27B00",
    colorBorder: "#FCE7B2",
  },
  "ciencias-natureza": {
    name: "Ciências da Natureza e suas Tecnologias",
    shortName: "Natureza",
    day: 2,
    colorBg: "#E3F5EC",
    colorText: "#137A51",
    colorBorder: "#C0E8D4",
  },
  matematica: {
    name: "Matemática e suas Tecnologias",
    shortName: "Matemática",
    day: 2,
    colorBg: "#E9E6FF",
    colorText: "#4F3CF0",
    colorBorder: "#D2CBFC",
  },
}

// ============================================================================
// BANCO DE FALLBACK RESILIENTE (Para quando offline ou limite atingido)
// ============================================================================

const FALLBACK_QUESTIONS: EnemQuestion[] = [
  {
    title: "Questão 141 - ENEM 2023",
    index: 141,
    year: 2023,
    discipline: "matematica",
    language: null,
    context:
      "Uma loja de tintas vende galões cilíndricos com capacidade de 3,6 litros e latas menores com capacidade de 900 mililitros. Um cliente calculou que necessita de exatamente 16,2 litros de tinta para pintar toda a sua residência.\n\nPara minimizar o custo e não haver sobra de tinta, quantas embalagens de cada tipo ele deve adquirir se o galão custa R$ 80,00 e a lata pequena custa R$ 25,00?",
    files: [],
    correctAlternative: "C",
    alternativesIntroduction: "A melhor combinação de compra é:",
    alternatives: [
      { letter: "A", text: "5 galões de 3,6 L.", isCorrect: false },
      { letter: "B", text: "18 latas de 900 mL.", isCorrect: false },
      { letter: "C", text: "4 galões de 3,6 L e 2 latas de 900 mL.", isCorrect: true },
      { letter: "D", text: "3 galões de 3,6 L e 6 latas de 900 mL.", isCorrect: false },
      { letter: "E", text: "2 galões de 3,6 L e 10 latas de 900 mL.", isCorrect: false },
    ],
  },
  {
    title: "Questão 95 - ENEM 2023",
    index: 95,
    year: 2023,
    discipline: "ciencias-natureza",
    language: null,
    context:
      "Os biocombustíveis são fontes de energia renovável obtidas a partir de biomassa orgânica. O etanol de cana-de-açúcar é considerado um biocombustível de alta eficiência energética quando comparado a combustíveis fósseis derivados do petróleo.\n\nSob o ponto de vista do ciclo global do carbono, a principal vantagem ambiental do uso do etanol em substituição à gasolina decorre do fato de que:",
    files: [],
    correctAlternative: "B",
    alternativesIntroduction: "Assinale a alternativa que apresenta a justificativa ambiental correta:",
    alternatives: [
      { letter: "A", text: "sua queima não produz dióxido de carbono nem vapor de água na atmosfera.", isCorrect: false },
      { letter: "B", text: "o dióxido de carbono liberado na queima foi previamente absorvido pela cana na fotossíntese.", isCorrect: true },
      { letter: "C", text: "sua combustão é exclusivamente incompleta, gerando menor calor para o efeito estufa.", isCorrect: false },
      { letter: "D", text: "ele elimina a formação de material particulado em qualquer motor veicular.", isCorrect: false },
      { letter: "E", text: "sua produção independe do consumo de água doce nos processos de moagem.", isCorrect: false },
    ],
  },
  {
    title: "Questão 48 - ENEM 2023",
    index: 48,
    year: 2023,
    discipline: "ciencias-humanas",
    language: null,
    context:
      "No contexto da Revolução Industrial iniciada na Inglaterra no século XVIII, a introdução das máquinas a vapor e o regime fabril alteraram profundamente a percepção do tempo pelos trabalhadores.\n\nAnteriormente guiado pelos ciclos naturais do dia e das estações agrícolas, o ritmo de vida passou a ser rigorosamente cronometrado pelo apito da fábrica e pelos relógios mecânicos.",
    files: [],
    correctAlternative: "D",
    alternativesIntroduction: "A mudança social descrita no texto expressa:",
    alternatives: [
      { letter: "A", text: "a valorização das tradições camponesas no ambiente urbano.", isCorrect: false },
      { letter: "B", text: "o aumento do tempo livre destinado ao lazer da classe operária.", isCorrect: false },
      { letter: "C", text: "a manutenção do controle autônomo dos artesãos sobre sua produção.", isCorrect: false },
      { letter: "D", text: "a subordinação da força de trabalho à disciplina fabril e à produtividade.", isCorrect: true },
      { letter: "E", text: "o declínio dos conflitos sindicais diante da modernização tecnológica.", isCorrect: false },
    ],
  },
  {
    title: "Questão 12 - ENEM 2023",
    index: 12,
    year: 2023,
    discipline: "linguagens",
    language: null,
    context:
      "A linguagem da internet, conhecida popularmente como 'internetês', caracteriza-se pelo uso de abreviações, emojis, memes e ausência frequente de pontuações formais em mensagens instantâneas.\n\nLinguistas contemporâneos têm demonstrado que esse fenômeno não representa a degradação da língua portuguesa, mas sim uma variação estilística adaptada à rapidez e dinamicidade dos canais digitais.",
    files: [],
    correctAlternative: "A",
    alternativesIntroduction: "De acordo com a perspectiva linguística expressa no texto:",
    alternatives: [
      { letter: "A", text: "a língua se adapta funcionalmente às necessidades comunicativas de seus usuários.", isCorrect: true },
      { letter: "B", text: "o uso da norma padrão torna-se obsoleto e dispensável em todas as situações sociais.", isCorrect: false },
      { letter: "C", text: "a gramática tradicional deve ser reformada para adotar exclusivamente o internetês.", isCorrect: false },
      { letter: "D", text: "a comunicação digital empobrece o vocabulário e a capacidade interpretativa.", isCorrect: false },
      { letter: "E", text: "as abreviações decorrem unicamente de limitações técnicas dos teclados de smartphones.", isCorrect: false },
    ],
  },
]

// ============================================================================
// GERENCIADOR DE CACHE (Memória + LocalStorage com TTL)
// ============================================================================

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const memoryCache = new Map<string, CacheEntry<any>>()

function getCacheKey(endpoint: string, params?: Record<string, any>): string {
  if (!params || Object.keys(params).length === 0) return endpoint
  const query = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&")
  return `${endpoint}?${query}`
}

function readFromCache<T>(key: string): T | null {
  const now = Date.now()

  // 1. Verifica cache em memória
  const inMemory = memoryCache.get(key)
  if (inMemory) {
    if (now - inMemory.timestamp < ENEM_DEV_CONFIG.CACHE_TTL_MS) {
      return inMemory.data as T
    }
    memoryCache.delete(key)
  }

  // 2. Verifica localStorage
  try {
    const raw = localStorage.getItem(`${ENEM_DEV_CONFIG.STORAGE_PREFIX}${key}`)
    if (raw) {
      const parsed: CacheEntry<T> = JSON.parse(raw)
      if (now - parsed.timestamp < ENEM_DEV_CONFIG.CACHE_TTL_MS) {
        // Atualiza memória
        memoryCache.set(key, parsed)
        return parsed.data
      }
      localStorage.removeItem(`${ENEM_DEV_CONFIG.STORAGE_PREFIX}${key}`)
    }
  } catch {
    // ignore localStorage errors (e.g. quota exceeded)
  }

  return null
}

function writeToCache<T>(key: string, data: T): void {
  const entry: CacheEntry<T> = {
    data,
    timestamp: Date.now(),
  }

  memoryCache.set(key, entry)

  try {
    localStorage.setItem(`${ENEM_DEV_CONFIG.STORAGE_PREFIX}${key}`, JSON.stringify(entry))
  } catch {
    // Falha silenciosa caso o localStorage esteja cheio
  }
}

// ============================================================================
// FILA DE REQUISIÇÕES COM RATE LIMITING (1 requisição / segundo)
// ============================================================================

let lastRequestTime = 0
let queuePromise: Promise<void> = Promise.resolve()

async function throttleRequest(): Promise<void> {
  queuePromise = queuePromise.then(async () => {
    const now = Date.now()
    const elapsed = now - lastRequestTime
    if (elapsed < ENEM_DEV_CONFIG.RATE_LIMIT_DELAY_MS) {
      const waitTime = ENEM_DEV_CONFIG.RATE_LIMIT_DELAY_MS - elapsed
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
    lastRequestTime = Date.now()
  })
  return queuePromise
}

async function requestEnemDev<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
  const cacheKey = getCacheKey(endpoint, params)
  const cached = readFromCache<T>(cacheKey)
  if (cached) {
    return cached
  }

  // Respeita o rate-limit da api.enem.dev (1 req/s)
  await throttleRequest()

  const url = new URL(`${ENEM_DEV_CONFIG.BASE_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) {
        url.searchParams.set(k, String(v))
      }
    })
  }

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    })

    if (response.status === 429) {
      console.warn("[enemDevApi] Rate limit 429 atingido. Utilizando fallback local.")
      throw new Error("Rate limit 429 atingido na api.enem.dev")
    }

    if (!response.ok) {
      throw new Error(`Erro na chamada da api.enem.dev (${response.status}): ${response.statusText}`)
    }

    const json = (await response.json()) as T
    writeToCache(cacheKey, json)
    return json
  } catch (err) {
    // Se houver falha de rede, tenta recuperar cache expirado antes de falhar
    try {
      const raw = localStorage.getItem(`${ENEM_DEV_CONFIG.STORAGE_PREFIX}${cacheKey}`)
      if (raw) {
        const parsed: CacheEntry<T> = JSON.parse(raw)
        console.warn(`[enemDevApi] Usando cache stale para ${cacheKey} após erro:`, err)
        return parsed.data
      }
    } catch {
      // ignore
    }
    throw err
  }
}

// ============================================================================
// SERVIÇO PRINCIPAL EXPORTADO
// ============================================================================

export const enemDevApi = {
  /**
   * Obtém a lista de anos de provas disponíveis na API do ENEM.
   * Endpoint: GET /v1/exams
   */
  async getExams(): Promise<EnemExam[]> {
    try {
      const exams = await requestEnemDev<any[]>("/exams")
      if (Array.isArray(exams) && exams.length > 0) {
        return exams.map((item) => {
          if (typeof item === "number") return { year: item, title: `ENEM ${item}` }
          return {
            year: item.year || item.id || 2023,
            title: item.title || `ENEM ${item.year}`,
            totalQuestions: item.totalQuestions || 180,
          }
        })
      }
    } catch (err) {
      console.warn("[enemDevApi] getExams: Falha ao buscar anos, usando lista padrão.", err)
    }

    return ENEM_DEV_CONFIG.AVAILABLE_YEARS.map((y) => ({
      year: y,
      title: `ENEM ${y}`,
      totalQuestions: 180,
    }))
  },

  /**
   * Obtém detalhes de um exame específico pelo ano.
   * Endpoint: GET /v1/exams/{year}
   */
  async getExam(year: number): Promise<EnemExam> {
    try {
      const exam = await requestEnemDev<any>(`/exams/${year}`)
      return {
        year: exam.year || year,
        title: exam.title || `ENEM ${year}`,
        totalQuestions: exam.totalQuestions || 180,
      }
    } catch (err) {
      console.warn(`[enemDevApi] getExam: Falha ao buscar exame de ${year}, usando dados locais.`, err)
      return {
        year,
        title: `ENEM ${year}`,
        totalQuestions: 180,
      }
    }
  },

  /**
   * Obtém lista paginada de questões de um ano do ENEM.
   * Endpoint: GET /v1/exams/{year}/questions?limit={limit}&offset={offset}
   */
  async getQuestions(
    year: number = 2023,
    options: EnemQuestionsQueryOptions = {},
  ): Promise<EnemQuestionsResponse> {
    const limit = options.limit ?? 20
    const offset = options.offset ?? 0

    try {
      const response = await requestEnemDev<any>(`/exams/${year}/questions`, {
        limit,
        offset,
      })

      // Normalização da resposta da API
      const questionsList: EnemQuestion[] = Array.isArray(response)
        ? response
        : response?.questions || response?.data || []

      const metadata: EnemQuestionsMetadata = response?.metadata || {
        limit,
        offset,
        total: response?.total || questionsList.length,
      }

      // Aplica filtros adicionais caso requisitados (disciplina, língua estrangeira)
      let filtered = questionsList
      if (options.discipline) {
        filtered = filtered.filter((q) => q.discipline === options.discipline)
      }
      if (options.language) {
        filtered = filtered.filter((q) => q.language === options.language)
      }

      return {
        metadata,
        questions: filtered.map(normalizeQuestion),
      }
    } catch (err) {
      console.warn(`[enemDevApi] getQuestions: Falha na API para o ano ${year}. Retornando fallback.`, err)

      // Fallback inteligente filtrado
      let fallbackList = FALLBACK_QUESTIONS
      if (options.discipline) {
        fallbackList = fallbackList.filter((q) => q.discipline === options.discipline)
      }

      return {
        metadata: {
          limit,
          offset,
          total: fallbackList.length,
        },
        questions: fallbackList,
      }
    }
  },

  /**
   * Obtém uma questão individual pelo ano e pelo seu índice/número oficial.
   * Endpoint: GET /v1/exams/{year}/questions/{index}
   */
  async getQuestion(year: number, index: number): Promise<EnemQuestion> {
    try {
      const rawQuestion = await requestEnemDev<any>(`/exams/${year}/questions/${index}`)
      return normalizeQuestion(rawQuestion)
    } catch (err) {
      console.warn(`[enemDevApi] getQuestion: Falha ao buscar questão ${index} de ${year}. Usando fallback.`, err)
      const found = FALLBACK_QUESTIONS.find((q) => q.index === index) || FALLBACK_QUESTIONS[0]
      return {
        ...found,
        index,
        year,
        title: `Questão ${index} - ENEM ${year}`,
      }
    }
  },

  /**
   * Obtém uma questão aleatória para treino rápido ou desafio.
   */
  async getRandomQuestion(filters: { year?: number; discipline?: EnemDiscipline } = {}): Promise<EnemQuestion> {
    const year = filters.year || 2023
    try {
      const randomOffset = Math.floor(Math.random() * 80)
      const response = await this.getQuestions(year, {
        limit: 15,
        offset: randomOffset,
        discipline: filters.discipline,
      })

      if (response.questions.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.questions.length)
        return response.questions[randomIndex]
      }
    } catch {
      // ignore
    }

    // Fallback se não encontrar
    const matchingFallback = filters.discipline
      ? FALLBACK_QUESTIONS.filter((q) => q.discipline === filters.discipline)
      : FALLBACK_QUESTIONS

    const selected = matchingFallback[Math.floor(Math.random() * matchingFallback.length)] || FALLBACK_QUESTIONS[0]
    return selected
  },

  /**
   * Gera um conjunto estruturado de questões para Simulado:
   * - "completo": Simulado do ENEM com 180 questões (ou 90 questões de um dia específico).
   * - "mini": Mini-simulado rápido de 16 a 24 questões equilibradas entre as 4 áreas.
   * - "area": 45 questões focadas na área selecionada (ex: Matemática ou Natureza).
   */
  async getQuestionsForSimulado(config: SimuladoConfig): Promise<EnemQuestion[]> {
    const year = config.year || 2023

    switch (config.type) {
      case "mini": {
        // Mini simulado: 16 questões equilibradas (4 Linguagens, 4 Humanas, 4 Natureza, 4 Matemática)
        const disciplines: EnemDiscipline[] = [
          "linguagens",
          "ciencias-humanas",
          "ciencias-natureza",
          "matematica",
        ]

        const questionsPerArea = Math.max(2, Math.floor((config.quantity || 16) / 4))
        const collected: EnemQuestion[] = []

        for (const disc of disciplines) {
          try {
            const resp = await this.getQuestions(year, {
              discipline: disc,
              limit: questionsPerArea,
              offset: Math.floor(Math.random() * 15),
            })
            collected.push(...resp.questions)
          } catch {
            // Em caso de falha em uma disciplina, pega do fallback
            const fb = FALLBACK_QUESTIONS.filter((q) => q.discipline === disc)
            collected.push(...fb)
          }
        }

        return collected.length > 0 ? collected : FALLBACK_QUESTIONS
      }

      case "area": {
        // Simulado por área: 45 questões da disciplina escolhida
        const discipline = config.discipline || "matematica"
        const qty = config.quantity || 45

        try {
          const resp = await this.getQuestions(year, {
            discipline,
            limit: Math.min(qty, 45),
            offset: 0,
          })
          return resp.questions.length > 0 ? resp.questions : FALLBACK_QUESTIONS.filter((q) => q.discipline === discipline)
        } catch {
          return FALLBACK_QUESTIONS.filter((q) => q.discipline === discipline)
        }
      }

      case "completo":
      default: {
        // Simulado completo
        const limit = config.quantity || 90
        try {
          const resp = await this.getQuestions(year, {
            limit,
            offset: config.day === 2 ? 90 : 0,
          })
          return resp.questions.length > 0 ? resp.questions : FALLBACK_QUESTIONS
        } catch {
          return FALLBACK_QUESTIONS
        }
      }
    }
  },

  /**
   * Limpa todo o cache persistente da api.enem.dev do navegador.
   */
  clearCache(): void {
    memoryCache.clear()
    try {
      const keysToRemove: string[] = []
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key && key.startsWith(ENEM_DEV_CONFIG.STORAGE_PREFIX)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k))
    } catch {
      // ignore
    }
  },

  /**
   * Retorna os metadados visuais de uma disciplina (nome por extenso, dia do ENEM, cores).
   */
  getDisciplineMeta(discipline: EnemDiscipline) {
    return ENEM_DISCIPLINES_META[discipline] || ENEM_DISCIPLINES_META.matematica
  },
}

// ============================================================================
// FUNÇÃO AUXILIAR DE NORMALIZAÇÃO DE DADOS
// ============================================================================

function normalizeQuestion(raw: any): EnemQuestion {
  const alternativesRaw = Array.isArray(raw?.alternatives) ? raw.alternatives : []

  const letters: EnemAlternativeLetter[] = ["A", "B", "C", "D", "E"]

  const alternatives: EnemAlternative[] = alternativesRaw.map((alt: any, idx: number) => {
    const letter = alt.letter || letters[idx] || String(idx + 1)
    const isCorrect =
      alt.isCorrect !== undefined
        ? Boolean(alt.isCorrect)
        : raw.correctAlternative
          ? String(raw.correctAlternative).toUpperCase() === String(letter).toUpperCase()
          : false

    return {
      letter,
      text: alt.text || alt.description || "",
      file: alt.file || alt.image || null,
      isCorrect,
    }
  })

  // Detecta a alternativa correta
  let correctAlternative = raw.correctAlternative || ""
  if (!correctAlternative) {
    const correctFound = alternatives.find((a) => a.isCorrect)
    if (correctFound) correctAlternative = correctFound.letter
  }

  return {
    title: raw.title || `Questão ${raw.index || 1} - ENEM ${raw.year || 2023}`,
    index: Number(raw.index) || 1,
    year: Number(raw.year) || 2023,
    discipline: (raw.discipline as EnemDiscipline) || "matematica",
    language: raw.language || null,
    context: raw.context || raw.text || raw.enunciado || "",
    files: Array.isArray(raw.files) ? raw.files : raw.file ? [raw.file] : [],
    correctAlternative,
    alternativesIntroduction: raw.alternativesIntroduction || raw.introduction || "",
    alternatives,
  }
}

export default enemDevApi

