/**
 * Serviço de Integração da Mentorina AI com Suporte a Questões do ENEM (api.enem.dev)
 *
 * Pronto para conexão com backend real:
 * - Para usar backend real: defina VITE_USE_MOCK_MENTORINA=false no .env ou altere CONFIG.USE_MOCK = false
 * - Para configurar a URL base da API: defina VITE_API_URL no .env ou altere CONFIG.API_BASE_URL
 *
 * Integração com a API do ENEM:
 * - Formatação estruturada de enunciados, textos de apoio e alternativas para o contexto da IA.
 * - Modo Socrático: orienta o aluno passo a passo por meio de reflexões sem revelar a resposta de imediato.
 * - Modo Resolução Completa: explica detalhadamente por que a alternativa correta é a certa e analisa os distratores/pegadinhas.
 * - Inicialização direta de conversas a partir de qualquer questão do ENEM ou simulado.
 */

import type { EnemQuestion, EnemAlternative } from "./enemDevApi"

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

export const MENTORINA_CONFIG = {
  USE_MOCK: import.meta.env.VITE_USE_MOCK_MENTORINA !== "false",
  API_BASE_URL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/mentorina` : "/api/mentorina",
}

// ============================================================================
// MOCK DATA & ESTADO EM MEMÓRIA
// ============================================================================

const INITIAL_CONVERSATIONS: MentorinaConversation[] = []
const INITIAL_MESSAGES: Record<string, MentorinaMessage[]> = {}

let conversationsState = [...INITIAL_CONVERSATIONS]
let messagesState: Record<string, MentorinaMessage[]> = { ...INITIAL_MESSAGES }

function getFormattedTime(): string {
  const now = new Date()
  return now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
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

${question.alternativesIntroduction ? `Comando: ${question.alternativesIntroduction}\n` : ""}
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
    (a) => a.letter.toUpperCase() === String(question.correctAlternative).toUpperCase(),
  )
  const wrongAlts = question.alternatives.filter(
    (a) => a.letter.toUpperCase() !== String(question.correctAlternative).toUpperCase(),
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
${question.alternativesIntroduction ? `> "${question.alternativesIntroduction}"` : "Qual é exatamente a grandeza, fenômeno ou relação causal que a questão solicita?"}

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

function generateMockResponse(question: string): { text: string; chips: string[] } {
  const lower = question.toLowerCase()

  // Se o prompt mencionar uma questão do ENEM ou disciplina
  if (lower.includes("enem") && (lower.includes("questão") || lower.includes("questao"))) {
    return {
      text: `Estou conectada ao banco oficial da **api.enem.dev**! 📚

Posso te ajudar a:
1. **Resolver passo a passo** qualquer questão histórica do ENEM com fórmulas formatadas em KaTeX ($$...$$);
2. Dar **dicas socráticas** para você descobrir a resposta sem estragar o desafio;
3. Explicar por que os **distratores** estão errados para você nunca mais cair em pegadinha.

Qual ano ou assunto você gostaria de treinar agora?`,
      chips: ["Simulado de Matemática", "Simulado de Natureza", "Mini-simulado rápido"],
    }
  }

  if (lower.includes("delta") || lower.includes("b^2 - 4ac")) {
    return {
      text: `O discriminante $\\Delta$ (delta) indica a quantidade de raízes reais da equação do 2º grau:
$$\\Delta = b^2 - 4ac$$

- Se $\\Delta > 0$: a função possui **duas raízes reais distintas** (o gráfico corta o eixo $x$ em 2 pontos).
- Se $\\Delta = 0$: a função possui **uma raiz real dupla** (o vértice tangencia o eixo $x$).
- Se $\\Delta < 0$: a função **não possui raízes reais** (o gráfico não encosta no eixo $x$).

Além disso, o $\\Delta$ entra diretamente na fórmula do $Y$ do vértice: $Y_v = -\\frac{\\Delta}{4a}$, que representa o valor máximo ou mínimo da função!`,
      chips: ["Calcular Y do vértice", "Ver outro exemplo de função", "Como memorizar as fórmulas?"],
    }
  }

  if (lower.includes("outro exemplo") || lower.includes("exemplo")) {
    return {
      text: `Aqui está um exemplo clássico de prova:
Considere a trajetória de um projétil dada por:
$$h(t) = -5t^2 + 20t$$
onde $h$ é a altura em metros e $t$ é o tempo em segundos.

1. **Tempo para atingir a altura máxima:**
$$t_v = -\\frac{b}{2a} = -\\frac{20}{2 \\times (-5)} = \\frac{-20}{-10} = 2\\text{ segundos}$$

2. **Altura máxima atingida:**
Substituindo $t = 2$:
$$h(2) = -5(2)^2 + 20(2) = -5(4) + 40 = -20 + 40 = 20\\text{ metros}$$

Viu como calcular $h(t_v)$ costuma ser até mais rápido do que calcular $\\Delta$?`,
      chips: ["Praticar questão parecida", "Como calcular quando toca o chão?"],
    }
  }

  if (lower.includes("praticar") || lower.includes("exercício") || lower.includes("questao")) {
    return {
      text: `Desafio rápido para você fixar:

Uma fábrica vende um produto por um preço $p$. O lucro diário é modelado por:
$$L(p) = -p^2 + 60p - 500$$

Qual deve ser o preço $p$ para que o lucro seja **máximo**?

Tente calcular usando $X_v = -\\frac{b}{2a}$ e me diga o resultado!`,
      chips: ["O preço é 30?", "O preço é 60?", "Pode me dar uma dica?"],
    }
  }

  if (lower.includes("30")) {
    return {
      text: `Perfeito! 🎉 Você acertou em cheio!
Com $a = -1$ e $b = 60$:
$$X_v = -\\frac{60}{2 \\times (-1)} = -\\frac{60}{-2} = 30$$

O preço ótimo é exatamente R$ 30,00! Você dominou o conceito de vértice da parábola no ENEM.`,
      chips: ["Ver outra matéria", "Revisar geometria plana", "Fazer um simulado"],
    }
  }

  // Resposta padrão contextual
  return {
    text: `Entendi sua dúvida sobre **"${question.slice(0, 60)}"**!

Com base na matriz de referência do ENEM, esse tópico costuma ser cobrado de forma interdisciplinar e contextualizada no cotidiano.

Gostaria que eu:
1. Explique a **teoria fundamental** com uma analogia simples;
2. Mostre uma **aplicação prática** típica de questão do ENEM;
3. Resolva um exemplo numérico passo a passo?`,
    chips: ["Explicar teoria com analogia", "Mostrar questão do ENEM", "Passo a passo com cálculos"],
  }
}

// ============================================================================
// API CLIENT IMPLEMENTATION
// ============================================================================

export async function fetchConversations(): Promise<MentorinaConversation[]> {
  if (MENTORINA_CONFIG.USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 120))
    return [...conversationsState]
  }

  const response = await fetch(`${MENTORINA_CONFIG.API_BASE_URL}/conversations`, {
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok) {
    throw new Error(`Falha ao carregar conversas: ${response.statusText}`)
  }
  return response.json()
}

export async function fetchMessages(conversationId: string): Promise<MentorinaMessage[]> {
  if (MENTORINA_CONFIG.USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 120))
    return messagesState[conversationId] ? [...messagesState[conversationId]] : []
  }

  const response = await fetch(`${MENTORINA_CONFIG.API_BASE_URL}/conversations/${conversationId}/messages`, {
    headers: { "Content-Type": "application/json" },
  })
  if (!response.ok) {
    throw new Error(`Falha ao carregar mensagens: ${response.statusText}`)
  }
  return response.json()
}

export async function sendMessage(
  conversationId: string,
  text: string,
  imageUrl?: string,
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

    // Atualiza preview da conversa e título caso seja a primeira dúvida
    const convIndex = conversationsState.findIndex((c) => c.id === conversationId)
    const conv = convIndex !== -1 ? conversationsState[convIndex] : null

    if (convIndex !== -1 && conv) {
      const currentTitle = conv.title
      const newTitle =
        currentTitle === "Nova conversa" || !currentTitle
          ? (text.length > 32 ? `${text.slice(0, 30)}...` : text || "Dúvida enviada")
          : currentTitle
      conversationsState[convIndex] = {
        ...conv,
        title: newTitle,
        lastMessagePreview: text,
        updatedAt: "agora mesmo",
      }
    }

    // Simula tempo de raciocínio da Mentorina AI (500ms)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Se a conversa estiver associada a uma questão do ENEM, gera resposta contextualizada
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

  const response = await fetch(`${MENTORINA_CONFIG.API_BASE_URL}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, imageUrl }),
  })
  if (!response.ok) {
    throw new Error(`Falha ao enviar mensagem: ${response.statusText}`)
  }
  return response.json()
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
      title: title || (questionData ? `${questionData.title}` : "Nova conversa"),
      context: context || (questionData ? `${questionData.discipline} · ENEM ${questionData.year}` : undefined),
      questionId: questionData ? `${questionData.year}_${questionData.index}` : undefined,
      questionData,
      updatedAt: "agora mesmo",
      lastMessagePreview: "",
    }

    conversationsState.unshift(newConv)
    messagesState[newId] = []

    return newConv
  }

  const response = await fetch(`${MENTORINA_CONFIG.API_BASE_URL}/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, context, questionData }),
  })
  if (!response.ok) {
    throw new Error(`Falha ao criar conversa: ${response.statusText}`)
  }
  return response.json()
}

/**
 * Inicia uma sessão de tutoria com a Mentorina especificamente para uma questão do ENEM.
 * Pré-popula a conversa com a questão e a saudação da Mentorina oferecendo ajuda socrática ou resolução.
 */
export async function createQuestionTutorConversation(
  question: EnemQuestion,
  mode: "socratic" | "explanation" = "socratic",
): Promise<{ conversation: MentorinaConversation; initialBotMessage: MentorinaMessage }> {
  const title = `${question.title}`
  const context = `ENEM ${question.year} · ${question.discipline}`

  const conversation = await createConversation(title, context, question)

  // Mensagem inicial da Mentorina contextualizada com a questão
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

  if (MENTORINA_CONFIG.USE_MOCK) {
    messagesState[conversation.id] = [botMessage]
    const cIndex = conversationsState.findIndex((c) => c.id === conversation.id)
    if (cIndex !== -1) {
      conversationsState[cIndex].lastMessagePreview = "Sessão de tutoria iniciada"
    }
  }

  return { conversation, initialBotMessage: botMessage }
}

export async function deleteConversation(conversationId: string): Promise<void> {
  if (MENTORINA_CONFIG.USE_MOCK) {
    conversationsState = conversationsState.filter((c) => c.id !== conversationId)
    delete messagesState[conversationId]
    return
  }

  const response = await fetch(`${MENTORINA_CONFIG.API_BASE_URL}/conversations/${conversationId}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error(`Falha ao excluir conversa: ${response.statusText}`)
  }
}
