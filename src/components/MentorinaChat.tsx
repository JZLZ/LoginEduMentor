import React, { useState, useEffect, useRef } from "react"
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  createConversation,
  createQuestionTutorConversation,
  type MentorinaConversation,
  type MentorinaMessage,
} from "../services/mentorinaApi"
import type { EnemQuestion } from "../services/enemDevApi"

interface MentorinaChatProps {
  userName?: string
  context?: string
  initialQuestion?: EnemQuestion
  onClose: () => void
}

// ============================================================================
// AVATAR OFICIAL DA MENTORINA AI
// ============================================================================
export const MentorinaAvatar: React.FC<{ size?: "sm" | "md" | "lg" }> = ({ size = "md" }) => {
  const dim = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10"
  const starDim = size === "sm" ? 16 : size === "lg" ? 24 : 20

  return (
    <div className={`relative ${dim} shrink-0 select-none`}>
      <div className="w-full h-full rounded-full bg-[#4F3CF0] flex items-center justify-center shadow-xs">
        {/* Foto da Mentorina */}
        <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2448_1560)">
            <path d="M22 44C34.1503 44 44 34.1503 44 22C44 9.84974 34.1503 0 22 0C9.84974 0 0 9.84974 0 22C0 34.1503 9.84974 44 22 44Z" fill="#4F3CF0" />
            <path d="M22 51.3333V33Z" fill="black" />
            <path d="M22 51.3333V33" stroke-width="26" stroke-linecap="round" stroke="#3420C2" />
            <path d="M22 43.2667V33Z" fill="black" />
            <path d="M22 43.2667V33" stroke-width="22" stroke-linecap="round" stroke="#6A5AF5" />
            <path d="M21.9999 34.6133C29.7761 34.6133 36.0799 28.3095 36.0799 20.5333C36.0799 12.7571 29.7761 6.45331 21.9999 6.45331C14.2238 6.45331 7.91992 12.7571 7.91992 20.5333C7.91992 28.3095 14.2238 34.6133 21.9999 34.6133Z" fill="url(#paint0_radial_2448_1560)" />
            <path opacity="0.45" d="M18.6959 13.9385C20.8272 13.1627 22.1956 11.5466 21.7523 10.3288C21.309 9.11089 19.222 8.75246 17.0907 9.52818C14.9594 10.3039 13.591 11.92 14.0343 13.1379C14.4776 14.3558 16.5646 14.7142 18.6959 13.9385Z" fill="white" />
            <path opacity="0.45" d="M12.9065 26.3999C14.2025 26.3999 15.2531 25.7433 15.2531 24.9333C15.2531 24.1233 14.2025 23.4666 12.9065 23.4666C11.6105 23.4666 10.5598 24.1233 10.5598 24.9333C10.5598 25.7433 11.6105 26.3999 12.9065 26.3999Z" fill="#FF6B57" />
            <path opacity="0.45" d="M31.0932 26.3999C32.3893 26.3999 33.4399 25.7433 33.4399 24.9333C33.4399 24.1233 32.3893 23.4666 31.0932 23.4666C29.7972 23.4666 28.7466 24.1233 28.7466 24.9333C28.7466 25.7433 29.7972 26.3999 31.0932 26.3999Z" fill="#FF6B57" />
            <path d="M17.0132 21.4133C17.9043 21.4133 18.6266 20.494 18.6266 19.36C18.6266 18.2259 17.9043 17.3066 17.0132 17.3066C16.1222 17.3066 15.3999 18.2259 15.3999 19.36C15.3999 20.494 16.1222 21.4133 17.0132 21.4133Z" fill="#17152E" />
            <path d="M17.5999 19.0666C17.9239 19.0666 18.1865 18.804 18.1865 18.48C18.1865 18.156 17.9239 17.8933 17.5999 17.8933C17.2758 17.8933 17.0132 18.156 17.0132 18.48C17.0132 18.804 17.2758 19.0666 17.5999 19.0666Z" fill="white" />
            <path d="M26.9866 21.4133C27.8776 21.4133 28.6 20.494 28.6 19.36C28.6 18.2259 27.8776 17.3066 26.9866 17.3066C26.0956 17.3066 25.3733 18.2259 25.3733 19.36C25.3733 20.494 26.0956 21.4133 26.9866 21.4133Z" fill="#17152E" />
            <path d="M27.5732 19.0666C27.8972 19.0666 28.1599 18.804 28.1599 18.48C28.1599 18.156 27.8972 17.8933 27.5732 17.8933C27.2492 17.8933 26.9866 18.156 26.9866 18.48C26.9866 18.804 27.2492 19.0666 27.5732 19.0666Z" fill="white" />
            <path d="M17.0132 24.0533C19.6052 24.0533 21.7065 21.952 21.7065 19.36C21.7065 16.7679 19.6052 14.6666 17.0132 14.6666C14.4211 14.6666 12.3198 16.7679 12.3198 19.36C12.3198 21.952 14.4211 24.0533 17.0132 24.0533Z" fill="white" fill-opacity="0.18" stroke="#17152E" />
            <path d="M26.9865 24.0533C29.5786 24.0533 31.6799 21.952 31.6799 19.36C31.6799 16.7679 29.5786 14.6666 26.9865 14.6666C24.3945 14.6666 22.2932 16.7679 22.2932 19.36C22.2932 21.952 24.3945 24.0533 26.9865 24.0533Z" fill="white" fill-opacity="0.18" stroke="#17152E" />
            <path d="M21.1199 18.7733C21.7065 17.9911 22.2932 17.9911 22.8799 18.7733" stroke="#17152E" />
            <path d="M12.3199 18.7733L8.50659 17.6ZM31.6799 18.7733L35.4933 17.6Z" fill="black" />
            <path d="M12.3199 18.7733L8.50659 17.6M31.6799 18.7733L35.4933 17.6" stroke-linecap="round" stroke="#17152E" />
            <path d="M18.7732 24.9333C20.9243 27.28 23.0754 27.28 25.2265 24.9333" stroke-linecap="round" stroke="#17152E" />
          </g>
          <defs>
            <radialGradient id="paint0_radial_2448_1560" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18.6207 15.4645) scale(21.12)">
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
}: MentorinaChatProps) {
  const [conversations, setConversations] = useState<MentorinaConversation[]>([])
  const [activeConvId, setActiveConvId] = useState<string>("")
  const [messages, setMessages] = useState<MentorinaMessage[]>([])
  const [inputText, setInputText] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const activeConversation = conversations.find((c) => c.id === activeConvId)
  const chatContext =
    activeConversation?.context ||
    (context && context.trim() ? context : "Matemática")

  // Carrega lista de conversas
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

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
            const { conversation, initialBotMessage } = await createQuestionTutorConversation(
              initialQuestion,
              "socratic",
            )
            if (!isMounted) return
            setConversations([conversation, ...list])
            setActiveConvId(conversation.id)
            setMessages([initialBotMessage])
            return
          } catch (e) {
            console.error("Erro ao iniciar tutoria de questão:", e)
          }
        }

        setConversations(list)
        if (list.length > 0) {
          setActiveConvId(list[0].id)
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar conversas:", err)
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
    if (!activeConvId) {
      setMessages([])
      return
    }
    let isMounted = true

    fetchMessages(activeConvId)
      .then((msgs) => {
        if (isMounted) {
          setMessages(msgs)
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar mensagens:", err)
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
    if ((!text && !selectedImage) || isSending) return

    const imageToSend = selectedImage || undefined
    setInputText("")
    setSelectedImage(null)
    setIsSending(true)

    let convId = activeConvId
    if (!convId) {
      try {
        const newTitle = text.length > 32 ? `${text.slice(0, 30)}...` : text || "Nova dúvida"
        const newConv = await createConversation(newTitle, context)
        setConversations((prev) => [newConv, ...prev])
        setActiveConvId(newConv.id)
        convId = newConv.id
      } catch (err) {
        console.error("Erro ao criar conversa:", err)
        setIsSending(false)
        return
      }
    } else {
      const activeConv = conversations.find((c) => c.id === convId)
      if (activeConv && (activeConv.title === "Nova conversa" || !activeConv.lastMessagePreview)) {
        const newTitle = text.length > 32 ? `${text.slice(0, 30)}...` : text || "Nova dúvida"
        setConversations((prev) =>
          prev.map((c) => (c.id === convId ? { ...c, title: newTitle } : c))
        )
      }
    }

    // Otimista: renderiza imediatamente a mensagem do usuário
    const optimisticUserMsg: MentorinaMessage = {
      id: `temp-${Date.now()}`,
      conversationId: convId,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      imageUrl: imageToSend,
    }
    setMessages((prev) => [...prev, optimisticUserMsg])

    try {
      const response = await sendMessage(convId, text, imageToSend)
      // Substitui pela resposta oficial
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimisticUserMsg.id),
        response.userMessage,
        response.botMessage,
      ])

      // Atualiza lista de conversas
      const updatedList = await fetchConversations()
      setConversations(updatedList)
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err)
    } finally {
      setIsSending(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  // Criação de nova conversa
  const handleNewConversation = async () => {
    try {
      const newConv = await createConversation("Nova conversa", context)
      setConversations((prev) => [newConv, ...prev])
      setActiveConvId(newConv.id)
      setShowMobileSidebar(false)
      setMessages([])
    } catch (err) {
      console.error("Erro ao criar conversa:", err)
    }
  }

  // Trata upload de imagem
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Lê como DataURL para exibição e mock
    const reader = new FileReader()
    reader.onload = () => {
      setSelectedImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Trata colagem de imagem (Ctrl+V)
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onload = () => {
            setSelectedImage(reader.result as string)
          }
          reader.readAsDataURL(file)
        }
      }
    }
  }

  return (
    <div className="w-full h-[calc(100vh-100px)] min-h-[580px] max-h-[850px] flex flex-col lg:flex-row gap-5 max-w-[1184px] mx-auto select-none animate-in fade-in duration-200">
      {/* ===================================================================== */}
      {/* COLUNA ESQUERDA: LISTA DE CONVERSAS (300px no desktop)                */}
      {/* ===================================================================== */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40 lg:z-auto
          w-[300px] bg-white border border-[#E2DFF1] rounded-3xl p-5
          flex flex-col shadow-xs transition-transform duration-200 ease-in-out
          ${showMobileSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header da Sidebar de Conversas */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E2DFF1]">
          <div className="flex items-center gap-2">
            <h2 className="text-[#17152E] font-bold text-lg tracking-tight">Conversas</h2>
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
              className="w-8 h-8 rounded-xl bg-[#E9E6FF] hover:bg-[#ded9ff] active:scale-95 text-[#4F3CF0] flex items-center justify-center transition cursor-pointer"
              title="Nova conversa"
              aria-label="Iniciar nova conversa"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3.33334V12.6667" stroke="#4F3CF0" strokeWidth="2" strokeLinecap="round" />
                <path d="M3.33325 8H12.6666" stroke="#4F3CF0" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {/* Fechar gaveta no mobile */}
            <button
              type="button"
              onClick={() => setShowMobileSidebar(false)}
              className="lg:hidden p-1.5 text-[#5F5B7D] hover:bg-[#F7F6FC] rounded-lg transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista de Conversas com Scroll */}
        <div className="flex-1 overflow-y-auto space-y-2 mt-4 pr-1 scrollbar-thin">
          {conversations.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#5F5B7D]/70">
              <p className="text-xs font-medium">Nenhuma conversa ainda.</p>
              <p className="text-[11px] mt-1 text-[#8C88AA]">Envie uma dúvida para começar!</p>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeConvId
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => {
                    setActiveConvId(conv.id)
                    setShowMobileSidebar(false)
                  }}
                  className={`
                    w-full text-left p-3.5 rounded-xl transition duration-150 cursor-pointer
                    border flex flex-col gap-1 relative
                    ${isActive
                      ? "bg-[#E9E6FF] border-[#4F3CF0]/20 text-[#4F3CF0]"
                      : "bg-white border-transparent hover:bg-[#F7F6FC] text-[#17152E]"
                    }
                  `}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-semibold text-sm truncate ${isActive ? "text-[#4F3CF0]" : "text-[#17152E]"}`}>
                      {conv.title}
                    </span>
                    <span className="text-[11px] text-[#5F5B7D] shrink-0 font-medium">{conv.updatedAt}</span>
                  </div>

                  {conv.questionData && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F7F6FC] text-[#4F3CF0] border border-[#E2DFF1]">
                        ENEM {conv.questionData.year} · {conv.questionData.discipline}
                      </span>
                    </div>
                  )}

                  {conv.lastMessagePreview && (
                    <p className="text-xs text-[#5F5B7D] truncate font-normal leading-relaxed">
                      {conv.lastMessagePreview}
                    </p>
                  )}
                </button>
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
        <header className="px-5 sm:px-6 py-4 border-b border-[#E2DFF1] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3 sm:gap-3.5">
            {/* Botão para abrir menu de conversas em telas menores */}
            <button
              type="button"
              onClick={() => setShowMobileSidebar(true)}
              className="lg:hidden p-2 rounded-xl text-[#5F5B7D] hover:bg-[#F7F6FC] border border-[#E2DFF1] transition"
              aria-label="Abrir conversas"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Avatar Mentorina */}
            <MentorinaAvatar size="md" />

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-[#17152E] tracking-tight">Mentorina</h1>
                {activeConversation?.questionData && (
                  <span className="px-2.5 py-0.5 bg-[#E9E6FF] text-[#4F3CF0] border border-[#D2CBFC] rounded-full text-[11px] font-bold">
                    {activeConversation.questionData.title}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#5F5B7D] font-medium">
                <span className="inline-block w-2 h-2 rounded-full bg-[#137A51]" />
                <span>Online</span>
                <span>·</span>
                <span>{chatContext}</span>
              </div>
            </div>
          </div>

          {/* Botão FECHAR (Fiel ao SVG Figma: bg #E9E6FF, texto #17152E, chevron <) */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E9E6FF] hover:bg-[#ded9ff] active:scale-95 text-[#17152E] text-sm font-semibold transition cursor-pointer shadow-2xs"
            title="Voltar para a página anterior"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        </header>

        {/* =================================================================== */}
        {/* CONTAINER DE MENSAGENS COM ROLAGEM                                  */}
        {/* =================================================================== */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 bg-[#FAF9FD]/40 scrollbar-thin">
          {messages.map((msg) => {
            const isUser = msg.sender === "user"

            if (isUser) {
              return (
                <div key={msg.id} className="flex justify-end items-end gap-2">
                  <div className="max-w-[85%] sm:max-w-[70%] flex flex-col items-end">
                    {/* Imagem enviada pelo usuário se houver */}
                    {msg.imageUrl && (
                      <div className="mb-2 max-w-xs rounded-xl overflow-hidden border border-[#E2DFF1] shadow-xs">
                        <img src={msg.imageUrl} alt="Questão enviada" className="w-full h-auto object-cover" />
                      </div>
                    )}

                    {/* Balão roxo do usuário */}
                    <div className="bg-[#4F3CF0] text-white rounded-2xl rounded-br-xs px-5 py-3.5 shadow-xs">
                      <p className="text-sm font-normal leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>

                    <span className="text-[10px] text-[#5F5B7D] font-medium mt-1 mr-1">{msg.timestamp}</span>
                  </div>
                </div>
              )
            }

            // Mensagem da Mentorina AI
            return (
              <div key={msg.id} className="flex items-start gap-3 max-w-[95%] sm:max-w-[88%]">
                <div className="flex-1 flex flex-col items-start min-w-0">
                  {/* Card branco com borda da resposta da Mentorina */}
                  <div className="w-full bg-white border border-[#E2DFF1] rounded-2xl rounded-tl-xs p-5 shadow-xs text-[#17152E]">
                    <FormattedMessageText content={msg.text} />

                    {/* Chips de ação rápida / sugestões de dúvidas */}
                    {msg.chips && msg.chips.length > 0 && (
                      <div className="mt-4 pt-3.5 border-t border-[#E2DFF1] flex flex-wrap gap-2">
                        {msg.chips.map((chip, cIdx) => (
                          <button
                            key={cIdx}
                            type="button"
                            onClick={() => handleSendMessage(chip)}
                            disabled={isSending}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F7F6FC] hover:bg-[#E9E6FF] hover:text-[#4F3CF0] hover:border-[#4F3CF0]/40 text-[#17152E] border border-[#E2DFF1] rounded-full text-xs font-medium transition cursor-pointer active:scale-95 disabled:opacity-50"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>{chip}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-[#5F5B7D] font-medium mt-1 ml-1">{msg.timestamp}</span>
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
              <div className="bg-white border border-[#E2DFF1] rounded-2xl rounded-tl-xs px-5 py-3.5 shadow-xs flex items-center gap-2">
                <span className="text-xs text-[#5F5B7D] font-medium">Mentorina está analisando</span>
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
        {/* INPUT DE MENSAGEM & ANEXO                                           */}
        {/* =================================================================== */}
        <div className="p-3.5 sm:p-5 border-t border-[#E2DFF1] bg-white shrink-0">
          {/* Pré-visualização de imagem anexada */}
          {selectedImage && (
            <div className="mb-3 max-w-[724px] mx-auto flex items-center gap-2">
              <div className="relative inline-block">
                <img
                  src={selectedImage}
                  alt="Pré-visualização"
                  className="w-16 h-16 object-cover rounded-xl border-2 border-[#4F3CF0] shadow-xs"
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

          {/* Formulário de Input (Fiel ao SVG 724x60 rx=29.5 border #8C88AA) */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            onPaste={handlePaste}
            className="w-full max-w-[724px] mx-auto h-[60px] bg-white border border-[#8C88AA] rounded-full pl-6 pr-2 py-2 flex items-center justify-between gap-3 focus-within:border-[#4F3CF0] focus-within:ring-2 focus-within:ring-[#4F3CF0]/20 transition-all shadow-xs"
          >
            {/* Input de arquivo invisível para suporte a upload/paste */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Campo de Texto */}
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida..."
              disabled={isSending}
              className="flex-1 bg-transparent border-0 outline-none text-[#17152E] placeholder:text-[#5F5B7D] text-sm sm:text-[15px] font-normal"
            />

            {/* Botão Enviar (44x44 rx=22 bg #4F3CF0 com seta branca para a direita) */}
            <button
              type="submit"
              disabled={(!inputText.trim() && !selectedImage) || isSending}
              className="w-[44px] h-[44px] rounded-full bg-[#4F3CF0] hover:bg-[#3D2CD8] active:scale-95 disabled:opacity-40 disabled:pointer-events-none text-white flex items-center justify-center transition cursor-pointer shrink-0 shadow-xs"
              title="Enviar mensagem"
              aria-label="Enviar mensagem"
            >
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M16.167 22H27.833M22.833 27L27.833 22L22.833 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>

          {/* Texto de aviso legal / disclaimer */}
          <p className="text-center text-[11px] text-[#5F5B7D] mt-2.5 font-medium">
            A Mentorina AI pode cometer erros. Verifique informações importantes.
          </p>
        </div>
      </section>
    </div>
  )
}

