/**
 * Serviço de Integração da Mentorina AI com Suporte a Questões do ENEM (api.enem.dev)
 *
 * Integração com o backend real (FastAPI - mentorina-api):
 * - POST /api/v1/chat                          → Enviar mensagem e obter resposta da IA
 * - GET  /api/v1/chat/conversations             → Listar conversas do estudante
 * - GET  /api/v1/chat/conversations/:id          → Detalhe de uma conversa
 *
 * A autenticação usa o mesmo token JWT do sherlock-backend, armazenado pelo tokenStorage.
 *
 * Para forçar mock local (sem backend): defina VITE_USE_MOCK_MENTORINA=true no .env
 */

import type { EnemQuestion } from "./enemDevApi"
import { tokenStorage } from "./api"

export interface MentorinaConversation {
  id: string
  title: string
  context?: string
  questionId?: string
  questionData?: EnemQuestion
  updatedAt: string
  lastMessagePreview?: string
}

export interface MentorinaMessage {
  id: string
  conversationId: string
  sender: "user" | "mentorina"
  text: string
  timestamp: string
  chips?: string[]
  imageUrl?: string
  questionContext?: {
    year: number
    index: number
    discipline: string
    title: string
  }
}

export interface MentorinaConversationMetadata {
  title?: string
  context?: string
  questionId?: string
  studentName?: string
}

function getStoredStudentFirstName(): string | undefined {
  try {
    const stored = localStorage.getItem("sherlock_user_name")
    if (stored && stored.trim()) {
      const first = stored.trim().split(" ")[0]
      if (
        first &&
        !["system", "system admin", "sistema", "root"].includes(
          first.toLowerCase(),
        )
      ) {
        return first
      }
    }
    const full = localStorage.getItem("sherlock_user_fullname")
    if (full && full.trim()) {
      const first = full.trim().split(" ")[0]
      if (
        first &&
        !["system", "system admin", "sistema", "root"].includes(
          first.toLowerCase(),
        )
      ) {
        return first
      }
    }
  } catch {
    // ignore
  }
  return undefined
}

export class MentorinaApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = "MentorinaApiError"
  }
}

const configuredMentorinaApiUrl =
  import.meta.env.VITE_MENTORINA_API_URL?.trim().replace(/\/$/, "")

export const MENTORINA_CONFIG = {
  USE_MOCK: import.meta.env.VITE_USE_MOCK_MENTORINA === "true",
  MENTORINA_API_URL:
    configuredMentorinaApiUrl ||
    (import.meta.env.DEV ? "http://localhost:8000" : ""),
}

// ============================================================================
// HELPER DE REQUISIÇÃO AUTENTICADA À MENTORINA API
// ============================================================================

async function mentorinaFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!MENTORINA_CONFIG.MENTORINA_API_URL) {
    console.error(
      "[MENTORINA-CLIENT] Erro: VITE_MENTORINA_API_URL não configurada.",
    )
    throw new Error(
      "A URL da API da Mentorina não foi configurada para este build.",
    )
  }

  const token = tokenStorage.get()
  const headers = new Headers(options.headers || {})

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json")
  }

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const method = options.method || "GET"
  const url = `${MENTORINA_CONFIG.MENTORINA_API_URL}/api/v1${
    endpoint.startsWith("/") ? "" : "/"
  }${endpoint}`

  let parsedBody: unknown = null
  if (options.body && typeof options.body === "string") {
    try {
      parsedBody = JSON.parse(options.body)
    } catch {
      parsedBody = options.body
    }
  }

  console.log(`[MENTORINA-CLIENT] >>> [${method}] ${url}`, {
    hasAuthToken: Boolean(token),
    payload: parsedBody,
  })

  let response: Response

  try {
    response = await fetch(url, { ...options, headers })
  } catch (err) {
    console.error(`[MENTORINA-CLIENT] !!! FALHA DE CONEXÃO COM: ${url}`, {
      error: err instanceof Error ? err.message : String(err),
      dica: "Verifique se o backend mentorina-api está rodando em http://127.0.0.1:8000",
    })
    throw new Error(
      "Não foi possível conectar à Mentorina AI. Verifique se o servidor mentorina-api está em execução.",
    )
  }

  const data = await response.json().catch(() => null)

  console.log(
    `[MENTORINA-CLIENT] <<< [${response.status} ${response.statusText}] de ${url}`,
    {
      responsePayload: data,
    },
  )

  if (!response.ok) {
    const errorData = data as {
      detail?: string | Array<{ msg?: string }>
      message?: string
    } | null
    const detail = errorData?.detail
    const message = Array.isArray(detail)
      ? detail
          .map((item) => item.msg)
          .filter(Boolean)
          .join(". ")
      : detail ||
        errorData?.message ||
        `Erro na requisição (${response.status})`

    console.error(
      `[MENTORINA-CLIENT] !!! ERRO RETORNADO PELA API (${response.status}):`,
      {
        message,
        detail,
      },
    )

    throw new MentorinaApiError(
      response.status === 401
        ? "Sessão expirada. Faça login novamente para conversar com a Mentorina."
        : message,
      response.status,
    )
  }

  return data as T
}

// ============================================================================
// TIPOS DE RESPOSTA DO BACKEND (FastAPI)
// ============================================================================

/** POST /api/v1/chat */
interface BackendChatResponse {
  conversation_id: string
  response: string
  tools_used: string[]
  tokens_used: number
}

/** GET /api/v1/chat/conversations */
interface BackendConversationItem {
  conversation_id: string
  title: string
  updated_at: string
  total_messages: number
  context?: string | null
  question_id?: string | null
}

/** GET /api/v1/chat/conversations/:id */
interface BackendMessageItem {
  role: string
  content: string | null
  tools_used: string[] | null
  timestamp: string
  image_data?: string | null
}

interface BackendConversationDetail {
  conversation_id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  messages: BackendMessageItem[]
}

// ============================================================================
// HELPERS DE FORMATO / TIMESTAMP
// ============================================================================

function getFormattedTime(): string {
  const now = new Date()
  return now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
}

function formatRelativeDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)

    if (diffMinutes < 1) return "agora mesmo"
    if (diffMinutes < 60) return `${diffMinutes}min atrás`

    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours}h atrás`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays === 1) return "ontem"
    if (diffDays < 7) return `${diffDays} dias atrás`

    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
  } catch {
    return "recente"
  }
}

function formatTimestamp(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return getFormattedTime()
  }
}

// ============================================================================
// HELPERS DE INTEGRAÇÃO COM QUESTÕES DO ENEM (api.enem.dev)
// ============================================================================

/**
 * Converte uma questão da api.enem.dev em um texto contextualizado completo
 * para ser injetado no prompt da Mentorina AI.
 */
export function formatEnemQuestionContext(question: EnemQuestion): string {
  const alternativesList = question.alternatives
    .map((alt) => `(${alt.letter}) ${alt.text}`)
    .join("\n")

  return `[CONTEXTO DA QUESTÃO]
Título: ${question.title}
Ano: ${question.year}
Disciplina: ${question.discipline}
${question.language ? `Língua: ${question.language}\n` : ""}
Texto de apoio / Enunciado:
${question.context}

${
  question.alternativesIntroduction
    ? `Comando: ${question.alternativesIntroduction}\n`
    : ""
}
Alternativas:
${alternativesList}

Gabarito Oficial: Alternativa (${question.correctAlternative})`
}

/**
 * Gera uma resposta socrática ou explicativa para uma questão do ENEM
 */
export function generateEnemQuestionResponse(
  question: EnemQuestion,
  userPrompt: string = "",
): { text: string; chips: string[] } {
  const promptLower = userPrompt.toLowerCase()
  const correctAlt = question.alternatives.find(
    (a) =>
      a.letter.toUpperCase() ===
      String(question.correctAlternative).toUpperCase(),
  )
  const wrongAlts = question.alternatives.filter(
    (a) =>
      a.letter.toUpperCase() !==
      String(question.correctAlternative).toUpperCase(),
  )

  // 1. Pedido de dica socrática (sem dar a resposta de bandeja)
  if (
    promptLower.includes("dica") ||
    promptLower.includes("socrática") ||
    promptLower.includes("como começar") ||
    promptLower.includes("pistas")
  ) {
    return {
      text: `Excelente escolha! Vamos pensar juntos pelo **método socrático** 💡:

1. **Observe o comando central**:
${
  question.alternativesIntroduction
    ? `> "${question.alternativesIntroduction}"`
    : "Qual é exatamente a grandeza, fenômeno ou relação causal que a questão solicita?"
}

2. **Pista de raciocínio**:
No ENEM, questões da área de **${question.discipline}** exigem relacionar os dados do texto com o conceito teórico fundamental, em vez de decorar fórmulas isoladas.

3. **Duas alternativas para você descartar de cara**:
Preste atenção nas alternativas que trazem afirmações generalistas ou que contradizem o texto-base. Dentre elas, você já pode desconsiderar **(${wrongAlts[0]?.letter || "B"})** e **(${wrongAlts[wrongAlts.length - 1]?.letter || "E"})**!

Agora reflita: o que resta de mais consistente entre as alternativas restantes?`,
      chips: [
        "Quais alternativas posso eliminar?",
        "Qual o conceito teórico principal?",
        "Me explique a resolução completa",
      ],
    }
  }

  // 2. Análise de distratores / eliminação de alternativas
  if (
    promptLower.includes("eliminar") ||
    promptLower.includes("errada") ||
    promptLower.includes("distrator") ||
    promptLower.includes("pegadinha")
  ) {
    const wrongSample = wrongAlts.slice(0, 2)
    return {
      text: `Vamos desvendar os **distratores** (as pegadinhas clássicas do ENEM) dessa questão! 🎯

${wrongSample
  .map(
    (alt) => `❌ **Por que a alternativa (${alt.letter}) é falsa:**
Ela afirma: *"${alt.text.slice(0, 90)}..."*
O erro aqui é que ela parte de uma premissa incorreta ou extrapola o que o enunciado forneceu, induzindo ao erro comum de quem faz leitura apressada.`,
  )
  .join("\n\n")}

✨ **Dica de ouro da Mentorina**:
No ENEM, desconfie de alternativas com termos categóricos como *"sempre"*, *"nunca"*, *"exclusivamente"* ou que desconsideram o contexto social/científico do problema.`,
      chips: [
        `Por que a (${question.correctAlternative}) é a correta?`,
        "Resolução passo a passo",
        "Tirar outra dúvida",
      ],
    }
  }

  // 3. Resolução Completa e Detalhada
  return {
    text: `Aqui está a **análise completa da ${question.title}**! 🎓

### 1. Gabarito Oficial: Alternativa (${question.correctAlternative})
${correctAlt ? `> **(${correctAlt.letter}) ${correctAlt.text}**\n` : ""}
### 2. Por que esta é a alternativa correta:
Esta alternativa expressa com precisão a relação exigida pela matriz de referência do ENEM para **${question.discipline}**. Ao interpretar o texto de apoio e os dados apresentados, concluímos que este é o único desfecho coerente com as evidências apresentadas.

${
  question.discipline === "matematica"
    ? `### 3. Raciocínio de Cálculo:
Identificamos os dados do problema e aplicamos o modelo matemático correspondente, chegando exatamente ao resultado que valida a alternativa **(${question.correctAlternative})**.`
    : `### 3. Competência Avaliada:
A questão avalia a capacidade de analisar criticamente o fenômeno apresentado e sintetizar a resposta com base na fundamentação teórica sólida.`
}

### 4. Lição para o ENEM:
Guarde esse padrão: quando uma questão trouxer texto longo ou gráficos, grife o comando final imediatamente antes das alternativas. Isso poupa tempo precioso no dia da prova!`,
    chips: [
      "Me dê outra questão parecida",
      "Como memorizar esse padrão?",
      "Voltar para o simulado",
    ],
  }
}

// ============================================================================
// RESPOSTAS INTELIGENTES DO MOCK GERAL
// ============================================================================

function generateMockResponse(
  question: string,
): { text: string; chips: string[] } {
  const lower = question.toLowerCase()

  if (
    lower.includes("enem") &&
    (lower.includes("questão") || lower.includes("questao"))
  ) {
    return {
      text: `Estou conectada ao banco oficial da **api.enem.dev**! 📚

Posso te ajudar a:
1. **Resolver passo a passo** qualquer questão histórica do ENEM com fórmulas formatadas em KaTeX ($$...$$);
2. Dar **dicas socráticas** para você descobrir a resposta sem estragar o desafio;
3. Explicar por que os **distratores** estão errados para você nunca mais cair em pegadinha.

Qual ano ou assunto você gostaria de treinar agora?`,
      chips: [
        "Simulado de Matemática",
        "Simulado de Natureza",
        "Mini-simulado rápido",
      ],
    }
  }

  return {
    text: `Entendi sua dúvida sobre **"${question.slice(0, 60)}"**!

Com base na matriz de referência do ENEM, esse tópico costuma ser cobrado de forma interdisciplinar e contextualizada no cotidiano.

Gostaria que eu:
1. Explique a **teoria fundamental** com uma analogia simples;
2. Mostre uma **aplicação prática** típica de questão do ENEM;
3. Resolva um exemplo numérico passo a passo?`,
    chips: [
      "Explicar teoria com analogia",
      "Mostrar questão do ENEM",
      "Passo a passo com cálculos",
    ],
  }
}

// ============================================================================
// MOCK DATA & ESTADO EM MEMÓRIA (fallback quando USE_MOCK = true)
// ============================================================================

let conversationsState: MentorinaConversation[] = []
let messagesState: Record<string, MentorinaMessage[]> = {}

// ============================================================================
// API CLIENT — INTEGRAÇÃO REAL COM O BACKEND MENTORINA-API
// ============================================================================

export async function fetchConversations(): Promise<MentorinaConversation[]> {
  if (MENTORINA_CONFIG.USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 120))
    return [...conversationsState]
  }

  const items = await mentorinaFetch<BackendConversationItem[]>(
    "/chat/conversations",
  )

  return items.map((item) => ({
    id: item.conversation_id,
    title: item.title,
    context: item.context || undefined,
    questionId: item.question_id || undefined,
    updatedAt: formatRelativeDate(item.updated_at),
    lastMessagePreview:
      item.total_messages > 0 ? `${item.total_messages} mensagens` : undefined,
  }))
}

export async function fetchMessages(
  conversationId: string,
): Promise<MentorinaMessage[]> {
  if (MENTORINA_CONFIG.USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 120))
    return messagesState[conversationId]
      ? [...messagesState[conversationId]]
      : []
  }

  const detail = await mentorinaFetch<BackendConversationDetail>(
    `/chat/conversations/${conversationId}`,
  )

  return detail.messages.map((msg, idx) => ({
    id: `${conversationId}-msg-${idx}`,
    conversationId,
    sender: msg.role === "user" ? "user" as const : "mentorina" as const,
    text: msg.content || "",
    timestamp: formatTimestamp(msg.timestamp),
    imageUrl: msg.image_data || undefined,
    chips: undefined,
  }))
}

export async function sendMessage(
  conversationId: string,
  text: string,
  imageUrl?: string,
  metadata?: MentorinaConversationMetadata,
): Promise<{ userMessage: MentorinaMessage; botMessage: MentorinaMessage }> {
  if (MENTORINA_CONFIG.USE_MOCK) {
    const timeNow = getFormattedTime()

    const userMessage: MentorinaMessage = {
      id: `msg-user-${Date.now()}`,
      conversationId,
      sender: "user",
      text,
      timestamp: timeNow,
      imageUrl,
    }

    if (!messagesState[conversationId]) {
      messagesState[conversationId] = []
    }
    messagesState[conversationId].push(userMessage)

    const convIndex = conversationsState.findIndex(
      (c) => c.id === conversationId,
    )
    const conv = convIndex !== -1 ? conversationsState[convIndex] : null

    if (convIndex !== -1 && conv) {
      const currentTitle = conv.title
      const newTitle =
        currentTitle === "Nova conversa" || !currentTitle
          ? text.length > 32
            ? `${text.slice(0, 30)}...`
            : text || "Dúvida enviada"
          : currentTitle
      conversationsState[convIndex] = {
        ...conv,
        title: newTitle,
        lastMessagePreview: text,
        updatedAt: "agora mesmo",
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    let mockAnswer: { text: string; chips: string[] }
    if (conv?.questionData) {
      mockAnswer = generateEnemQuestionResponse(conv.questionData, text)
    } else {
      mockAnswer = generateMockResponse(text)
    }

    const botMessage: MentorinaMessage = {
      id: `msg-bot-${Date.now()}`,
      conversationId,
      sender: "mentorina",
      text: mockAnswer.text,
      timestamp: getFormattedTime(),
      chips: mockAnswer.chips,
    }

    messagesState[conversationId].push(botMessage)

    return { userMessage, botMessage }
  }

  // ── BACKEND REAL ──
  const timeNow = getFormattedTime()

  // Mensagem do usuário (renderizada otimisticamente pelo componente,
  // aqui montamos a versão definitiva)
  const userMessage: MentorinaMessage = {
    id: `msg-user-${Date.now()}`,
    conversationId,
    sender: "user",
    text,
    timestamp: timeNow,
    imageUrl,
  }

  const studentNameToPass =
    metadata?.studentName?.trim() || getStoredStudentFirstName()

  // Chama o endpoint POST /api/v1/chat
  const result = await mentorinaFetch<BackendChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({
      message: text,
      conversation_id:
        conversationId.startsWith("temp-conv-") || conversationId === ""
          ? null
          : conversationId,
      conversation_title: metadata?.title,
      context: metadata?.context,
      question_id: metadata?.questionId,
      image_data: imageUrl,
      student_name: studentNameToPass,
    }),
  })

  const botMessage: MentorinaMessage = {
    id: `msg-bot-${Date.now()}`,
    conversationId: result.conversation_id,
    sender: "mentorina",
    text: result.response,
    timestamp: getFormattedTime(),
    chips: undefined,
  }

  // Se o conversationId mudou (primeira mensagem criou uma conversa), atualiza
  if (result.conversation_id !== conversationId) {
    userMessage.conversationId = result.conversation_id
  }

  return { userMessage, botMessage }
}

export async function createConversation(
  title?: string,
  context?: string,
  questionData?: EnemQuestion,
): Promise<MentorinaConversation> {
  if (MENTORINA_CONFIG.USE_MOCK) {
    const newId = `conv-${Date.now()}`
    const newConv: MentorinaConversation = {
      id: newId,
      title:
        title || (questionData ? `${questionData.title}` : "Nova conversa"),
      context:
        context ||
        (questionData
          ? `${questionData.discipline} · ENEM ${questionData.year}`
          : undefined),
      questionId: questionData
        ? `${questionData.year}_${questionData.index}`
        : undefined,
      questionData,
      updatedAt: "agora mesmo",
      lastMessagePreview: "",
    }

    conversationsState.unshift(newConv)
    messagesState[newId] = []

    return newConv
  }

  // A conversa é persistida junto com a primeira mensagem enviada ao backend.
  const tempId = `temp-conv-${Date.now()}`
  return {
    id: tempId,
    title: title || (questionData ? `${questionData.title}` : "Nova conversa"),
    context:
      context ||
      (questionData
        ? `${questionData.discipline} · ENEM ${questionData.year}`
        : undefined),
    questionId: questionData
      ? `${questionData.year}_${questionData.index}`
      : undefined,
    questionData,
    updatedAt: "agora mesmo",
    lastMessagePreview: "",
  }
}

/**
 * Inicia uma sessão de tutoria com a Mentorina especificamente para uma questão do ENEM.
 * Envia o contexto completo da questão como primeira mensagem para a IA.
 */
export async function createQuestionTutorConversation(
  question: EnemQuestion,
  mode: "socratic" | "explanation" = "socratic",
): Promise<{
  conversation: MentorinaConversation
  initialBotMessage: MentorinaMessage
}> {
  const title = `${question.title}`
  const context = `ENEM ${question.year} · ${question.discipline}`

  if (MENTORINA_CONFIG.USE_MOCK) {
    const conversation = await createConversation(title, context, question)

    const initialText =
      mode === "socratic"
        ? `Olá! Notei que você está praticando a **${question.title}** (${question.discipline}). 

> *"Qual a sua principal dúvida sobre esta questão?"*

Posso te orientar sem estragar o desafio:
1. Te dar uma **dica do que observar no enunciado**;
2. Ajudar a **eliminar alternativas absurdas**;
3. Ou, se preferir, te dar a **resolução comentada passo a passo**!`
        : `Olá! Vamos destrinchar a **${question.title}** juntas! 

${generateEnemQuestionResponse(question, "resolução completa").text}`

    const botMessage: MentorinaMessage = {
      id: `msg-bot-intro-${Date.now()}`,
      conversationId: conversation.id,
      sender: "mentorina",
      text: initialText,
      timestamp: getFormattedTime(),
      chips: [
        "Me dê uma dica socrática",
        "Quais alternativas posso eliminar?",
        "Explicação passo a passo",
        "Qual o conceito fundamental cobrado?",
      ],
      questionContext: {
        year: question.year,
        index: question.index,
        discipline: question.discipline,
        title: question.title,
      },
    }

    messagesState[conversation.id] = [botMessage]
    const cIndex = conversationsState.findIndex((c) => c.id === conversation.id)
    if (cIndex !== -1) {
      conversationsState[cIndex].lastMessagePreview =
        "Sessão de tutoria iniciada"
    }

    return { conversation, initialBotMessage: botMessage }
  }

  // ── BACKEND REAL ──
  // Envia o contexto da questão como primeira mensagem para criar a conversa
  const questionContext = formatEnemQuestionContext(question)
  const introMessage =
    mode === "socratic"
      ? `Preciso de ajuda com esta questão do ENEM. Me oriente pelo método socrático, sem revelar a resposta diretamente:\n\n${questionContext}`
      : `Me explique a resolução completa desta questão do ENEM:\n\n${questionContext}`

  const result = await mentorinaFetch<BackendChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({
      message: introMessage,
      conversation_id: null,
      conversation_title: title,
      context,
      question_id: `${question.year}_${question.index}`,
    }),
  })

  const conversation: MentorinaConversation = {
    id: result.conversation_id,
    title,
    context,
    questionId: `${question.year}_${question.index}`,
    questionData: question,
    updatedAt: "agora mesmo",
    lastMessagePreview: "Sessão de tutoria iniciada",
  }

  const botMessage: MentorinaMessage = {
    id: `msg-bot-intro-${Date.now()}`,
    conversationId: result.conversation_id,
    sender: "mentorina",
    text: result.response,
    timestamp: getFormattedTime(),
    chips: [
      "Me dê uma dica socrática",
      "Quais alternativas posso eliminar?",
      "Explicação passo a passo",
      "Qual o conceito fundamental cobrado?",
    ],
    questionContext: {
      year: question.year,
      index: question.index,
      discipline: question.discipline,
      title: question.title,
    },
  }

  return { conversation, initialBotMessage: botMessage }
}

export async function deleteConversation(
  conversationId: string,
): Promise<void> {
  if (MENTORINA_CONFIG.USE_MOCK) {
    conversationsState = conversationsState.filter(
      (c) => c.id !== conversationId,
    )
    delete messagesState[conversationId]
    return
  }

  // Tenta deletar no backend (inclusive se tiver prefixo temp-conv- persistido)
  try {
    await mentorinaFetch<void>(
      `/chat/conversations/${encodeURIComponent(conversationId)}`,
      {
        method: "DELETE",
      },
    )
  } catch (err) {
    // Se a conversa já não existe no backend (ex: conversa local temporária ainda não enviada, ou 404),
    // consideramos a exclusão concluída com sucesso no cliente
    if (err instanceof MentorinaApiError && err.status === 404) {
      return
    }
    throw err
  }
}
