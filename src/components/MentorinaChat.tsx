import React, { useState, useEffect, useRef } from "react"
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  createConversation,
  createQuestionTutorConversation,
  deleteConversation,
  MentorinaApiError,
  type MentorinaConversation,
  type MentorinaMessage,
} from "../services/mentorinaApi"
import type { EnemQuestion } from "../services/enemDevApi"

const MAX_MESSAGE_LENGTH = 2000

interface MentorinaChatProps {
  userName?: string
  context?: string
  initialQuestion?: EnemQuestion
  onClose: () => void
  onSessionExpired: () => void
}

// ============================================================================
// AVATAR OFICIAL DA MENTORINA AI
// ============================================================================
export const MentorinaAvatar: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const dim =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10"
  const starDim = size === "sm" ? 16 : size === "lg" ? 24 : 20

  return (
    <div className={`relative ${dim} shrink-0 select-none`}>
      <div className="w-full h-full rounded-full bg-[#4F3CF0] flex items-center justify-center shadow-xs">
        {/* Foto da Mentorina */}
        <svg
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_2448_1560)">
            <path
              d="M22 44C34.1503 44 44 34.1503 44 22C44 9.84974 34.1503 0 22 0C9.84974 0 0 9.84974 0 22C0 34.1503 9.84974 44 22 44Z"
              fill="#4F3CF0"
            />
            <path d="M22 51.3333V33Z" fill="black" />
            <path
              d="M22 51.3333V33"
              stroke-width="26"
              stroke-linecap="round"
              stroke="#3420C2"
            />
            <path d="M22 43.2667V33Z" fill="black" />
            <path
              d="M22 43.2667V33"
              stroke-width="22"
              stroke-linecap="round"
              stroke="#6A5AF5"
            />
            <path
              d="M21.9999 34.6133C29.7761 34.6133 36.0799 28.3095 36.0799 20.5333C36.0799 12.7571 29.7761 6.45331 21.9999 6.45331C14.2238 6.45331 7.91992 12.7571 7.91992 20.5333C7.91992 28.3095 14.2238 34.6133 21.9999 34.6133Z"
              fill="url(#paint0_radial_2448_1560)"
            />
            <path
              opacity="0.45"
              d="M18.6959 13.9385C20.8272 13.1627 22.1956 11.5466 21.7523 10.3288C21.309 9.11089 19.222 8.75246 17.0907 9.52818C14.9594 10.3039 13.591 11.92 14.0343 13.1379C14.4776 14.3558 16.5646 14.7142 18.6959 13.9385Z"
              fill="white"
            />
            <path
              opacity="0.45"
              d="M12.9065 26.3999C14.2025 26.3999 15.2531 25.7433 15.2531 24.9333C15.2531 24.1233 14.2025 23.4666 12.9065 23.4666C11.6105 23.4666 10.5598 24.1233 10.5598 24.9333C10.5598 25.7433 11.6105 26.3999 12.9065 26.3999Z"
              fill="#FF6B57"
            />
            <path
              opacity="0.45"
              d="M31.0932 26.3999C32.3893 26.3999 33.4399 25.7433 33.4399 24.9333C33.4399 24.1233 32.3893 23.4666 31.0932 23.4666C29.7972 23.4666 28.7466 24.1233 28.7466 24.9333C28.7466 25.7433 29.7972 26.3999 31.0932 26.3999Z"
              fill="#FF6B57"
            />
            <path
              d="M17.0132 21.4133C17.9043 21.4133 18.6266 20.494 18.6266 19.36C18.6266 18.2259 17.9043 17.3066 17.0132 17.3066C16.1222 17.3066 15.3999 18.2259 15.3999 19.36C15.3999 20.494 16.1222 21.4133 17.0132 21.4133Z"
              fill="#17152E"
            />
            <path
              d="M17.5999 19.0666C17.9239 19.0666 18.1865 18.804 18.1865 18.48C18.1865 18.156 17.9239 17.8933 17.5999 17.8933C17.2758 17.8933 17.0132 18.156 17.0132 18.48C17.0132 18.804 17.2758 19.0666 17.5999 19.0666Z"
              fill="white"
            />
            <path
              d="M26.9866 21.4133C27.8776 21.4133 28.6 20.494 28.6 19.36C28.6 18.2259 27.8776 17.3066 26.9866 17.3066C26.0956 17.3066 25.3733 18.2259 25.3733 19.36C25.3733 20.494 26.0956 21.4133 26.9866 21.4133Z"
              fill="#17152E"
            />
            <path
              d="M27.5732 19.0666C27.8972 19.0666 28.1599 18.804 28.1599 18.48C28.1599 18.156 27.8972 17.8933 27.5732 17.8933C27.2492 17.8933 26.9866 18.156 26.9866 18.48C26.9866 18.804 27.2492 19.0666 27.5732 19.0666Z"
              fill="white"
            />
            <path
              d="M17.0132 24.0533C19.6052 24.0533 21.7065 21.952 21.7065 19.36C21.7065 16.7679 19.6052 14.6666 17.0132 14.6666C14.4211 14.6666 12.3198 16.7679 12.3198 19.36C12.3198 21.952 14.4211 24.0533 17.0132 24.0533Z"
              fill="white"
              fill-opacity="0.18"
              stroke="#17152E"
            />
            <path
              d="M26.9865 24.0533C29.5786 24.0533 31.6799 21.952 31.6799 19.36C31.6799 16.7679 29.5786 14.6666 26.9865 14.6666C24.3945 14.6666 22.2932 16.7679 22.2932 19.36C22.2932 21.952 24.3945 24.0533 26.9865 24.0533Z"
              fill="white"
              fill-opacity="0.18"
              stroke="#17152E"
            />
            <path
              d="M21.1199 18.7733C21.7065 17.9911 22.2932 17.9911 22.8799 18.7733"
              stroke="#17152E"
            />
            <path
              d="M12.3199 18.7733L8.50659 17.6ZM31.6799 18.7733L35.4933 17.6Z"
              fill="black"
            />
            <path
              d="M12.3199 18.7733L8.50659 17.6M31.6799 18.7733L35.4933 17.6"
              stroke-linecap="round"
              stroke="#17152E"
            />
            <path
              d="M18.7732 24.9333C20.9243 27.28 23.0754 27.28 25.2265 24.9333"
              stroke-linecap="round"
              stroke="#17152E"
            />
          </g>
          <defs>
            <radialGradient
              id="paint0_radial_2448_1560"
              cx="0"
              cy="0"
              r="1"
              gradientUnits="userSpaceOnUse"
              gradientTransform="translate(18.6207 15.4645) scale(21.12)"
            >
              <stop stop-color="#EEFFA8" />
              <stop offset="0.55" stop-color="#C6F432" />
              <stop offset="1" stop-color="#A6D11A" />
            </radialGradient>
            <clipPath id="clip0_2448_1560">
              <rect width="44" height="44" rx="22" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  )
}

// ============================================================================
// FORMATADOR DE TEXTO / FÓRMULAS
// ============================================================================
const FormattedMessageText: React.FC<{ content: string }> = ({ content }) => {
  // Quebra por blocos de fórmula $$ ... $$
  const parts = content.split(/(\$\$[\s\S]*?\$\$)/g)

  return (
    <div className="space-y-2.5 text-sm leading-relaxed break-words">
      {parts.map((part, pIdx) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const formula = part.slice(2, -2).trim()
          return (
            <div
              key={pIdx}
              className="my-3 py-2 px-3.5 bg-[#F7F6FC] border border-[#E2DFF1] rounded-xl font-mono text-xs sm:text-sm text-[#4F3CF0] text-center font-medium overflow-x-auto"
            >
              {formula}
            </div>
          )
        }

        // Divide por parágrafos
        const paragraphs = part.split("\n\n")

        return (
          <React.Fragment key={pIdx}>
            {paragraphs.map((para, paraIdx) => {
              if (!para.trim()) return null

              // Processa linhas simples
              const lines = para.split("\n")

              return (
                <p key={paraIdx} className="leading-relaxed">
                  {lines.map((line, lIdx) => {
                    // Substitui **negrito** e $fórmula inline$
                    const formattedLine = renderInlineFormatting(line)

                    return (
                      <React.Fragment key={lIdx}>
                        {lIdx > 0 && <br />}
                        {formattedLine}
                      </React.Fragment>
                    )
                  })}
                </p>
              )
            })}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// Função auxiliar para formatação inline (**negrito**, *itálico*, $inline$)
function renderInlineFormatting(text: string): React.ReactNode {
  // Regex para capturar **negrito** ou $inline$
  const tokenRegex = /(\*\*[^*]+\*\*|\$[^\$]+\$)/g
  const parts = text.split(tokenRegex)

  return parts.map((token, idx) => {
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={idx} className="font-semibold text-[#17152E]">
          {token.slice(2, -2)}
        </strong>
      )
    }
    if (token.startsWith("$") && token.endsWith("$")) {
      return (
        <code
          key={idx}
          className="mx-0.5 px-1.5 py-0.5 bg-[#E9E6FF] text-[#4F3CF0] rounded-md font-mono text-[13px] font-medium"
        >
          {token.slice(1, -1)}
        </code>
      )
    }
    return token
  })
}

// ============================================================================
// COMPONENTE PRINCIPAL MENTORINA CHAT
// ============================================================================
export default function MentorinaChat({
  userName = "Estudante",
  context = "Matemática",
  initialQuestion,
  onClose,
  onSessionExpired,
}: MentorinaChatProps) {
  const [conversations, setConversations] = useState<MentorinaConversation[]>(
    [],
  )
  const [activeConvId, setActiveConvId] = useState<string>("")
  const [messages, setMessages] = useState<MentorinaMessage[]>([])
  const [inputText, setInputText] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [deletingConvId, setDeletingConvId] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const questionTutorRequestRef = useRef<{
    questionId: string
    request: ReturnType<typeof createQuestionTutorConversation>
  } | null>(null)

  const activeConversation = conversations.find((c) => c.id === activeConvId)
  const chatContext =
    activeConversation?.context ||
    (context && context.trim() ? context : "Matemática")

  const reportError = (error: unknown, fallback: string) => {
    if (error instanceof MentorinaApiError && error.status === 401) {
      onSessionExpired()
      return
    }
    setErrorMessage(error instanceof Error ? error.message : fallback)
  }

  const handleCopyMessage = async (msgId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedMessageId(msgId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch {
      // fallback silencioso
    }
  }

  const handleDeleteConversation = async (
    e: React.MouseEvent,
    convId: string,
  ) => {
    e.stopPropagation()
    if (deletingConvId) return

    const convToDelete = conversations.find((c) => c.id === convId)
    const title = convToDelete?.title || "esta conversa"
    const confirmed = window.confirm(
      `Deseja realmente excluir "${title}" do histórico?`,
    )
    if (!confirmed) return

    setDeletingConvId(convId)
    setErrorMessage(null)

    try {
      await deleteConversation(convId)

      const nextConversations = conversations.filter((c) => c.id !== convId)
      setConversations(nextConversations)

      if (activeConvId === convId) {
        if (nextConversations.length > 0) {
          setActiveConvId(nextConversations[0].id)
        } else {
          setActiveConvId("")
          setMessages([])
        }
      }
    } catch (err) {
      reportError(err, "Não foi possível excluir a conversa. Tente novamente.")
    } finally {
      setDeletingConvId(null)
    }
  }

  // Carrega lista de conversas
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)
    setErrorMessage(null)

    fetchConversations()
      .then(async (list) => {
        if (!isMounted) return

        // Se uma questão do ENEM foi informada para tutoria direta
        if (initialQuestion) {
          const qId = `${initialQuestion.year}_${initialQuestion.index}`
          const existing = list.find((c) => c.questionId === qId)
          if (existing) {
            setConversations(list)
            setActiveConvId(existing.id)
            return
          }

          // Cria sessão de tutoria socrática focada na questão
          try {
            let pendingRequest = questionTutorRequestRef.current
            if (!pendingRequest || pendingRequest.questionId !== qId) {
              pendingRequest = {
                questionId: qId,
                request: createQuestionTutorConversation(
                  initialQuestion,
                  "socratic",
                ),
              }
              questionTutorRequestRef.current = pendingRequest
            }
            const { conversation, initialBotMessage } =
              await pendingRequest.request
            if (!isMounted) return
            setConversations([conversation, ...list])
            setActiveConvId(conversation.id)
            setMessages([initialBotMessage])
            return
          } catch (e) {
            if (questionTutorRequestRef.current?.questionId === qId) {
              questionTutorRequestRef.current = null
            }
            reportError(e, "Não foi possível iniciar a tutoria desta questão.")
          }
        }

        setConversations(list)
        if (list.length > 0) {
          setActiveConvId(list[0].id)
        }
      })
      .catch((err) => {
        if (isMounted) {
          reportError(err, "Não foi possível carregar as conversas.")
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [initialQuestion])

  // Carrega mensagens da conversa ativa
  useEffect(() => {
    setErrorMessage(null)
    if (!activeConvId) {
      setMessages([])
      return
    }
    if (activeConvId.startsWith("temp-conv-")) {
      setMessages([])
      return
    }
    let isMounted = true
    setMessages([])

    fetchMessages(activeConvId)
      .then((msgs) => {
        if (isMounted) {
          setMessages(msgs)
        }
      })
      .catch((err) => {
        if (isMounted) {
          reportError(err, "Não foi possível carregar as mensagens.")
        }
      })

    return () => {
      isMounted = false
    }
  }, [activeConvId])

  // Scroll automático para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isSending])

  // Trata envio de mensagem
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend !== undefined ? textToSend : inputText).trim()
    if ((!text && !selectedImage) || isSending || isLoading) return

    setErrorMessage(null)
    const imageToSend = selectedImage || undefined
    setInputText("")
    setSelectedImage(null)
    setIsSending(true)

    let convId = activeConvId
    let conversationMetadata = conversations.find((c) => c.id === convId)
    if (!convId) {
      try {
        const newTitle =
          text.length > 32 ? `${text.slice(0, 30)}...` : text || "Nova dúvida"
        const newConv = await createConversation(newTitle, context)
        conversationMetadata = newConv
        setConversations((prev) => [newConv, ...prev])
        setActiveConvId(newConv.id)
        convId = newConv.id
      } catch (err) {
        setInputText(text)
        if (imageToSend) setSelectedImage(imageToSend)
        reportError(err, "Não foi possível criar uma conversa.")
        setIsSending(false)
        return
      }
    } else {
      const activeConv = conversations.find((c) => c.id === convId)
      if (
        activeConv &&
        (activeConv.title === "Nova conversa" || !activeConv.lastMessagePreview)
      ) {
        const newTitle =
          text.length > 32 ? `${text.slice(0, 30)}...` : text || "Nova dúvida"
        conversationMetadata = { ...activeConv, title: newTitle }
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, title: newTitle } : c)),
        )
      }
    }

    // Otimista: renderiza imediatamente a mensagem do usuário
    const optimisticUserMsg: MentorinaMessage = {
      id: `temp-${Date.now()}`,
      conversationId: convId,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      imageUrl: imageToSend,
    }
    setMessages((prev) => [...prev, optimisticUserMsg])

    try {
      const requestConvId = convId.startsWith("temp-conv-") ? "" : convId
      const cleanStudentName =
        userName &&
        !["system", "system admin"].includes(userName.trim().toLowerCase())
          ? userName.trim().split(" ")[0]
          : undefined
      const response = await sendMessage(requestConvId, text, imageToSend, {
        title: conversationMetadata?.title,
        context: conversationMetadata?.context,
        questionId: conversationMetadata?.questionId,
        studentName: cleanStudentName,
      })

      // Se o backend devolveu um conversation_id diferente (primeira mensagem
      // criou a conversa real), atualiza o ID ativo e a lista de conversas
      const realConvId = response.botMessage.conversationId || convId
      if (realConvId !== convId) {
        setActiveConvId(realConvId)
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, id: realConvId } : c)),
        )
      }

      // Substitui pela resposta oficial
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimisticUserMsg.id),
        { ...response.userMessage, conversationId: realConvId },
        response.botMessage,
      ])

      // Atualiza lista de conversas do backend
      try {
        const updatedList = await fetchConversations()
        setConversations(updatedList)
      } catch (err) {
        reportError(
          err,
          "A mensagem foi enviada, mas o histórico não foi atualizado.",
        )
      }
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== optimisticUserMsg.id))
      setInputText(text)
      if (imageToSend) setSelectedImage(imageToSend)
      reportError(err, "Não foi possível enviar a mensagem.")
    } finally {
      setIsSending(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  // Criação de nova conversa
  const handleNewConversation = async () => {
    if (isLoading || isSending) return

    try {
      setErrorMessage(null)
      const newConv = await createConversation("Nova conversa", context)
      setConversations((prev) => [newConv, ...prev])
      setActiveConvId(newConv.id)
      setShowMobileSidebar(false)
      setMessages([])
    } catch (err) {
      reportError(err, "Não foi possível criar uma conversa.")
    }
  }

  // Trata upload de imagem
  const readImageFile = (file: File) => {
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setErrorMessage("Use uma imagem PNG, JPEG ou WebP.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage("A imagem deve ter no máximo 5 MB.")
      return
    }

    setErrorMessage(null)
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setSelectedImage(reader.result)
      } else {
        setErrorMessage("Não foi possível ler a imagem selecionada.")
      }
    }
    reader.onerror = () =>
      setErrorMessage("Não foi possível ler a imagem selecionada.")
    reader.readAsDataURL(file)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) readImageFile(file)
    e.target.value = ""
  }

  // Trata colagem de imagem (Ctrl+V)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile()
        if (file) {
          readImageFile(file)
          return
        }
      }
    }
  }

  return (
    <div className="w-full h-[calc(100dvh-100px)] min-h-0 max-h-[850px] flex flex-col lg:flex-row gap-5 max-w-[1184px] mx-auto animate-in fade-in duration-200">
      {/* ===================================================================== */}
      {/* COLUNA ESQUERDA: LISTA DE CONVERSAS (300px no desktop)                */}
      {/* ===================================================================== */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 lg:z-auto
          w-[300px] bg-white border border-[#E2DFF1] rounded-3xl p-5
          flex flex-col shadow-xs transition-transform duration-200 ease-in-out
          ${
            showMobileSidebar
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header da Sidebar de Conversas */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2DFF1]">
          <div className="flex items-center gap-2">
            <h2 className="text-[#17152E] font-bold text-lg tracking-tight">
              Conversas
            </h2>
            {conversations.length > 0 && (
              <span className="px-2 py-0.5 bg-[#F7F6FC] text-[#5F5B7D] border border-[#E2DFF1] rounded-full text-xs font-semibold">
                {conversations.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Botão + Nova conversa (Fiel ao design Figma 32x32 rx=12 bg #E9E6FF) */}
            <button
              type="button"
              onClick={handleNewConversation}
              disabled={isLoading || isSending}
              className="w-8 h-8 rounded-xl bg-[#E9E6FF] hover:bg-[#ded9ff] active:scale-95 text-[#4F3CF0] flex items-center justify-center transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Nova conversa"
              aria-label="Iniciar nova conversa"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8 3.33334V12.6667"
                  stroke="#4F3CF0"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M3.33325 8H12.6666"
                  stroke="#4F3CF0"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Fechar gaveta no mobile */}
            <button
              type="button"
              onClick={() => setShowMobileSidebar(false)}
              className="lg:hidden p-1.5 text-[#5F5B7D] hover:bg-[#F7F6FC] rounded-lg transition"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M18 6L6 18M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista de Conversas com Scroll */}
        <div className="flex-1 overflow-y-auto space-y-2 mt-4 pr-1 scrollbar-thin">
          {conversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#5F5B7D]/70">
              <p className="text-xs font-medium">Nenhuma conversa ainda.</p>
              <p className="text-[11px] mt-1 text-[#8C88AA]">
                Envie uma dúvida para começar!
              </p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeConvId
              const isDeletingThis = deletingConvId === conv.id
              return (
                <div
                  key={conv.id}
                  onClick={() => {
                    if (isSending || isDeletingThis) return
                    setActiveConvId(conv.id)
                    setShowMobileSidebar(false)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      if (isSending || isDeletingThis) return
                      setActiveConvId(conv.id)
                      setShowMobileSidebar(false)
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  className={`
                    group w-full text-left p-3.5 rounded-xl transition duration-150 cursor-pointer
                    border flex flex-col gap-1 relative focus:outline-none focus:ring-2 focus:ring-[#4F3CF0]/20
                    ${
                      isSending || isDeletingThis
                        ? "cursor-not-allowed opacity-60"
                        : ""
                    }
                    ${
                      isActive
                        ? "bg-[#E9E6FF] border-[#4F3CF0]/20 text-[#4F3CF0]"
                        : "bg-white border-transparent hover:bg-[#F7F6FC] text-[#17152E]"
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-semibold text-sm truncate flex-1 ${
                        isActive ? "text-[#4F3CF0]" : "text-[#17152E]"
                      }`}
                    >
                      {conv.title}
                    </span>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[11px] text-[#5F5B7D] font-medium hidden sm:inline sm:group-hover:hidden">
                        {conv.updatedAt}
                      </span>

                      {/* Botão para excluir esta conversa individualmente */}
                      <button
                        type="button"
                        disabled={isDeletingThis || isSending}
                        onClick={(e) => handleDeleteConversation(e, conv.id)}
                        title="Excluir esta conversa"
                        aria-label={`Excluir conversa ${conv.title}`}
                        className="p-1 rounded-md text-[#5F5B7D] hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 disabled:opacity-40"
                      >
                        {isDeletingThis ? (
                          <span className="w-3.5 h-3.5 border-2 border-red-500/30 border-t-red-600 rounded-full animate-spin block" />
                        ) : (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {conv.questionId && conv.context && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F7F6FC] text-[#4F3CF0] border border-[#E2DFF1]">
                        {conv.context}
                      </span>
                    </div>
                  )}

                  {conv.lastMessagePreview && (
                    <p className="text-xs text-[#5F5B7D] truncate font-normal leading-relaxed">
                      {conv.lastMessagePreview}
                    </p>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Rodapé informativo discreto */}
        <div className="pt-4 border-t border-[#E2DFF1] mt-2">
          <p className="text-[11px] text-[#5F5B7D] text-center font-medium">
            Histórico salvo automaticamente
          </p>
        </div>
      </aside>

      {/* Backdrop para mobile quando a gaveta de conversas está aberta */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-[#17152E]/40 z-30 lg:hidden backdrop-blur-xs"
          onClick={() => setShowMobileSidebar(false)}
        />
      )}

      {/* ===================================================================== */}
      {/* COLUNA DIREITA: ÁREA PRINCIPAL DO CHAT                                */}
      {/* ===================================================================== */}
      <section className="flex-1 bg-white border border-[#E2DFF1] rounded-3xl flex flex-col overflow-hidden shadow-xs relative">
        {/* =================================================================== */}
        {/* HEADER DO CHAT (Mentorina info + Botão Fechar)                       */}
        {/* =================================================================== */}
        <header className="px-5 sm:px-6 py-3.5 border-b border-[#E2DFF1] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* Botão para abrir menu de conversas em telas menores */}
            <button
              type="button"
              onClick={() => setShowMobileSidebar(true)}
              className="lg:hidden p-2 rounded-xl text-[#5F5B7D] hover:bg-[#F7F6FC] border border-[#E2DFF1] transition"
              aria-label="Abrir conversas"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M4 6h16M4 12h16M4 18h16"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Avatar Mentorina com status indicator */}
            <div className="relative shrink-0">
              <MentorinaAvatar size="md" />
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#27AE60] border-2 border-white rounded-full ring-1 ring-[#27AE60]/30 animate-pulse"
                title="Online · Pronta para ajudar"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-[#17152E] tracking-tight">
                  Mentorina
                </h1>
                {activeConversation?.questionId && (
                  <span className="px-2.5 py-0.5 bg-[#F2F0FF] text-[#4F3CF0] border border-[#D2CBFC] rounded-full text-[11px] font-bold truncate max-w-[160px] sm:max-w-none">
                    {activeConversation.questionData?.title ??
                      activeConversation.title}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Botão para excluir esta conversa atual individualmente */}
            {activeConvId && (
              <button
                type="button"
                disabled={deletingConvId === activeConvId || isSending}
                onClick={(e) => handleDeleteConversation(e, activeConvId)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-[#5F5B7D] hover:text-[#DC2626] hover:bg-[#FEE2E2]/60 active:scale-95 transition cursor-pointer text-xs sm:text-sm font-medium border border-transparent hover:border-red-200 disabled:opacity-40"
                title="Excluir esta conversa"
                aria-label="Excluir esta conversa do histórico"
              >
                {deletingConvId === activeConvId ? (
                  <span className="w-3.5 h-3.5 border-2 border-red-500/30 border-t-red-600 rounded-full animate-spin" />
                ) : (
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </svg>
                )}
                <span className="hidden sm:inline">Excluir</span>
              </button>
            )}

            {/* Botão FECHAR */}
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#E9E6FF] hover:bg-[#ded9ff] active:scale-95 text-[#17152E] text-xs sm:text-sm font-semibold transition cursor-pointer shadow-2xs"
              title="Voltar para a página anterior"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 12L6 8L10 4"
                  stroke="#17152E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Fechar</span>
            </button>
          </div>
        </header>

        {/* =================================================================== */}
        {/* CONTAINER DE MENSAGENS COM ROLAGEM                                  */}
        {/* =================================================================== */}
        <div
          aria-live="polite"
          className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF9FD]/60 scrollbar-thin"
        >
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="shrink-0 font-semibold"
                aria-label="Fechar mensagem de erro"
              >
                ×
              </button>
            </div>
          )}
          {isLoading && messages.length === 0 && (
            <div className="flex items-center justify-center gap-3 py-12 text-sm text-[#5F5B7D]">
              <span className="h-5 w-5 rounded-full border-2 border-[#D2CBFC] border-t-[#4F3CF0] animate-spin" />
              <span>Preparando sua conversa...</span>
            </div>
          )}
          {!isLoading && messages.length === 0 && (
            <div className="flex min-h-full flex-col items-center justify-center px-4 py-8 text-center max-w-2xl mx-auto">
              <div className="relative mb-5 p-4 rounded-3xl bg-gradient-to-b from-[#FAF8FF] to-[#EBE7FF] border border-[#D2CBFC] shadow-sm">
                <MentorinaAvatar size="lg" />
                <span className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-[#27AE60] border-2 border-white rounded-full shadow-xs" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#17152E]">
                Oi, {userName.split(" ")[0]}! Sou a Mentorina.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#5F5B7D] max-w-lg">
                Sua tutora pedagógica inteligente. Posso analisar questões passo
                a passo, dar dicas socráticas sem estragar o gabarito ou te
                ajudar a estruturar seus estudos para o ENEM.
              </p>

              <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                {[
                  {
                    icon: "📐",
                    title: "Matemática & Geometria",
                    prompt:
                      "Como interpretar enunciados com gráficos e figuras no ENEM?",
                  },
                  {
                    icon: "✍️",
                    title: "Redação Nota 1000",
                    prompt:
                      "Quais são os 5 elementos essenciais da proposta de intervenção?",
                  },
                  {
                    icon: "🔬",
                    title: "Ciências da Natureza",
                    prompt:
                      "Explique a diferença entre biomagnificação e bioacumulação com exemplos.",
                  },
                  {
                    icon: "📊",
                    title: "Estratégia & TRI",
                    prompt:
                      "Como a Teoria de Resposta ao Item valoriza a coerência pedagógica?",
                  },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.prompt)}
                    disabled={isLoading || isSending}
                    className="p-3.5 rounded-2xl border border-[#E2DFF1] bg-white hover:border-[#4F3CF0]/40 hover:bg-[#F7F5FF] transition-all text-left group shadow-2xs cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-xs font-bold text-[#17152E] group-hover:text-[#4F3CF0] transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-[#5F5B7D] leading-relaxed line-clamp-2">
                      {item.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((msg) => {
            const isUser = msg.sender === "user"

            if (isUser) {
              return (
                <div key={msg.id} className="flex justify-end items-end gap-2">
                  <div className="max-w-[85%] sm:max-w-[70%] flex flex-col items-end">
                    {/* Imagem enviada pelo usuário se houver */}
                    {msg.imageUrl && (
                      <div className="mb-2 max-w-xs rounded-xl overflow-hidden border border-[#E2DFF1] shadow-xs">
                        <img
                          src={msg.imageUrl}
                          alt="Questão enviada"
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}

                    {/* Balão roxo do usuário */}
                    <div className="bg-[#4F3CF0] text-white rounded-2xl rounded-br-xs px-4 sm:px-5 py-3 shadow-xs">
                      <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap">
                        {msg.text}
                      </p>
                    </div>

                    <span className="text-[10px] text-[#8C88AA] font-medium mt-1 mr-1">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              )
            }

            // Mensagem da Mentorina AI
            return (
              <div
                key={msg.id}
                className="flex items-start gap-3 max-w-[96%] sm:max-w-[88%] group"
              >
                <div className="mt-1 shrink-0">
                  <MentorinaAvatar size="sm" />
                </div>
                <div className="flex-1 flex flex-col items-start min-w-0">
                  {/* Cabeçalho de identificação da IA */}
                  <div className="flex items-center gap-2 mb-1.5 ml-1">
                    <span className="font-bold text-xs text-[#17152E]">
                      Mentorina
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E9E6FF] text-[#4F3CF0]">
                      Tutora IA
                    </span>
                    <span className="text-[10px] text-[#8C88AA] font-normal">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Card com borda da resposta da Mentorina */}
                  <div className="w-full bg-white border border-[#E2DFF1] rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-2xs text-[#17152E] hover:border-[#D2CBFC] transition-colors">
                    <FormattedMessageText content={msg.text} />

                    {/* Rodapé com botão de cópia rápida */}
                    <div className="mt-3 pt-2.5 border-t border-[#E2DFF1]/70 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#777392] hover:text-[#4F3CF0] px-2 py-1 rounded-md hover:bg-[#F2F0FF] transition cursor-pointer"
                        title="Copiar explicação"
                      >
                        {copiedMessageId === msg.id ? (
                          <>
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#27AE60"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-[#27AE60] font-semibold">
                              Copiado!
                            </span>
                          </>
                        ) : (
                          <>
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <rect
                                x="9"
                                y="9"
                                width="13"
                                height="13"
                                rx="2"
                                ry="2"
                              />
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                            </svg>
                            <span>Copiar</span>
                          </>
                        )}
                      </button>

                      <span className="text-[10px] text-[#8C88AA]">
                        Mentorina AI · ENEM
                      </span>
                    </div>

                    {/* Chips de ação rápida / sugestões de dúvidas */}
                    {msg.chips && msg.chips.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-[#E2DFF1] flex flex-wrap gap-2">
                        {msg.chips.map((chip, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => handleSendMessage(chip)}
                            disabled={isLoading || isSending}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F7F6FC] hover:bg-[#E9E6FF] hover:text-[#4F3CF0] hover:border-[#4F3CF0]/40 text-[#17152E] border border-[#E2DFF1] rounded-full text-xs font-medium transition cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.2"
                            >
                              <path
                                d="M5 12h14M12 5l7 7-7 7"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span>{chip}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}

          {/* Indicador de digitando / pensando */}
          {isSending && (
            <div className="flex items-start gap-3 max-w-[80%] animate-in fade-in duration-200">
              <div className="mt-1">
                <MentorinaAvatar size="sm" />
              </div>
              <div className="bg-white border border-[#E2DFF1] rounded-2xl rounded-tl-xs px-4 py-3 shadow-xs flex items-center gap-2.5">
                <span className="text-xs text-[#5F5B7D] font-medium">
                  Mentorina está analisando
                </span>
                <span className="inline-flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-[#4F3CF0] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-[#4F3CF0] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-[#4F3CF0] rounded-full animate-bounce" />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* =================================================================== */}
        {/* INPUT DE MENSAGEM (Fiel ao SVG 724x60 rx=29.5 border #8C88AA)       */}
        {/* =================================================================== */}
        <div className="p-3 sm:p-5 border-t border-[#E2DFF1] bg-white shrink-0">
          {/* Pré-visualização de imagem anexada se houver */}
          {selectedImage && (
            <div className="mb-3 max-w-[724px] mx-auto flex items-center gap-2">
              <div className="relative inline-block">
                <img
                  src={selectedImage}
                  alt="Pré-visualização"
                  className="w-14 h-14 object-cover rounded-xl border-2 border-[#4F3CF0] shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-[#17152E] text-white rounded-full flex items-center justify-center text-xs hover:bg-red-500 transition shadow-xs cursor-pointer"
                  title="Remover anexo"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Formulário de Input com 724x60 rx=29.5 border #8C88AA */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            onPaste={handlePaste}
            className="mentorina-input-bar w-full max-w-[724px] mx-auto h-[60px] bg-white border border-[#8C88AA] rounded-full pl-6 pr-2 flex !flex-row flex-nowrap items-center justify-between gap-3 focus-within:border-[#4F3CF0] focus-within:ring-2 focus-within:ring-[#4F3CF0]/20 transition-all shadow-xs"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            {/* Campo de Texto alinhado horizontalmente lado a lado com o botão enviar */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida..."
              disabled={isLoading || isSending}
              maxLength={MAX_MESSAGE_LENGTH}
              aria-label="Digite sua dúvida..."
              className="flex-1 min-w-0 h-full bg-transparent border-0 outline-none text-left text-[#17152E] placeholder:text-[#5F5B7D] text-sm sm:text-[15px] font-normal leading-normal disabled:cursor-not-allowed"
              style={{
                flex: "1 1 0%",
                minWidth: 0,
                height: "100%",
                border: "none",
                outline: "none",
                backgroundColor: "transparent",
              }}
            />

            {/* Botão Enviar perfeitamente alinhado lado a lado à direita */}
            <button
              type="submit"
              disabled={
                (!inputText.trim() && !selectedImage) || isSending || isLoading
              }
              title="Enviar mensagem"
              aria-label="Enviar mensagem"
              className="shrink-0 w-[44px] h-[44px] rounded-full p-0 border-0 bg-transparent flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-transform active:scale-95 focus:outline-none"
              style={{
                width: "44px",
                height: "44px",
                flexShrink: 0,
                padding: 0,
                border: "none",
                background: "transparent",
              }}
            >
              {isSending ? (
                <div className="w-[44px] h-[44px] rounded-full bg-[#4F3CF0] flex items-center justify-center">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              ) : (
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 44 44"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-[44px] h-[44px] block"
                >
                  <rect width="44" height="44" rx="22" fill="#4F3CF0" />
                  <path
                    d="M18.167 22H29.833M24.833 27L29.833 22L24.833 17"
                    stroke="white"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </form>

          {/* Texto de aviso legal / disclaimer fiel ao Figma */}
          <p className="text-center text-[11px] text-[#5F5B7D] mt-2.5 font-medium">
            A Mentorina AI pode cometer erros. Verifique informações
            importantes.
          </p>
        </div>
      </section>
    </div>
  )
}
