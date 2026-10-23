import { useState, useEffect } from "react"
import MascotMinhoquinha from "./MascotMinhoquinha"
import logoMark from "../assets/logo/EduMentor AI — Plataforma Adaptativa de Estudos e Tutoria/Group.png"

interface LandingPageProps {
  onNavigate: (screen: "login" | "signup") => void
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState<number | null>(0) // First open by default as in Figma

  // Interactive question option in Simulados card
  const [selectedSimuladoOption, setSelectedSimuladoOption] =
    useState<string>("B")

  // Interactive chat state for Mentorina section
  const [chatMessages, setChatMessages] = useState<Array<{
    sender: "user" | "mentorina"
    text: string
  }>>([
    {
      sender: "user",
      text: "Não entendi o coeficiente angular 😵",
    },
    {
      sender: "mentorina",
      text: "Pensa numa rampa: o coeficiente angular diz o quanto ela sobe a cada passo pra frente. Em f(x) = 2x + 1, ela sobe 2 a cada 1.",
    },
    {
      sender: "user",
      text: "Me dá um exercício?",
    },
    {
      sender: "mentorina",
      text: "Claro! Se f(x) = 3x − 2, quanto vale f(4)? 🙂",
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  function handleSendChat(customText?: string) {
    const textToSend = customText ?? chatInput
    if (!textToSend.trim()) return

    const newMessages = [
      ...chatMessages,
      { sender: "user" as const, text: textToSend },
    ]
    setChatMessages(newMessages)
    if (!customText) setChatInput("")
    setIsTyping(true)

    setTimeout(() => {
      let reply = "Boa pergunta! Vamos analisar isso com calma passo a passo..."
      const lower = textToSend.toLowerCase()
      if (lower.includes("exercício") || lower.includes("exercicio")) {
        reply =
          "Aqui vai um do ENEM: Se um plano de celular cobra R$ 30 fixos mais R$ 2 por GB extra, qual é a função custo C(x)?"
      } else if (
        lower.includes("memorização") ||
        lower.includes("dica") ||
        lower.includes("macete")
      ) {
        reply =
          "💡 Macete: Se o 'a' é positivo, a reta sobe (lucro). Se o 'a' é negativo, a reta desce (prejuízo). Nunca mais esquece!"
      } else if (lower.includes("outro jeito") || lower.includes("explicar")) {
        reply =
          "Imagina que você está subindo uma escada rolante. A inclinação da rampa é a taxa de variação constante da função!"
      } else if (lower.includes("10") || lower.includes("f(4)")) {
        reply =
          "Exatamente! f(4) = 3*(4) − 2 = 12 − 2 = 10. Você mandou muito bem! 🎉"
      }

      setChatMessages((prev) => [...prev, { sender: "mentorina", text: reply }])
      setIsTyping(false)
    }, 700)
  }

  // Smooth centering for Mentorina section whenever requested
  function scrollToMentorina(e?: React.MouseEvent) {
    if (e) e.preventDefault()
    setMobileMenuOpen(false)
    const el = document.getElementById("mentorina")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" })
      window.history.pushState(null, "", "#mentorina")
    }
  }

  useEffect(() => {
    function checkHash() {
      if (window.location.hash === "#mentorina") {
        setTimeout(() => {
          document.getElementById("mentorina")?.scrollIntoView({
            behavior: "smooth",
            block: "center",
          })
        }, 150)
      }
    }
    checkHash()
    window.addEventListener("hashchange", checkHash)
    return () => window.removeEventListener("hashchange", checkHash)
  }, [])

  const faqList = [
    {
      id: 0,
      question: "O EduMentor AI é só para o ENEM?",
      answer:
        "Por enquanto, sim. Ele foi feito para quem vai prestar o ENEM: trilhas, simulados e redação seguem o formato da prova.",
    },
    {
      id: 1,
      question: "De onde vêm as questões dos simulados?",
      answer:
        "De provas anteriores do ENEM, organizadas por ano e por área do conhecimento.",
    },
    {
      id: 2,
      question: "Posso estudar várias matérias ao mesmo tempo?",
      answer:
        "A trilha é uma por vez, para você manter o foco. Ao terminar a atual, próxima é liberada.",
    },
    {
      id: 3,
      question: "A nota da redação é a nota oficial?",
      answer:
        "Não. É uma estimativa da IA pelas 5 competências do ENEM. O mais valioso é o feedback do que melhorar primeiro.",
    },
    {
      id: 4,
      question: "Preciso fazer o nivelamento?",
      answer:
        "Não é obrigatório. Ele tem só 6 questões por área, mas você pode escolher direto as matérias que quer focar.",
    },
    {
      id: 5,
      question: "Funciona no celular?",
      answer:
        "Sim. Você estuda no celular ou no computador, e o progresso fica salvo nos dois.",
    },
  ]

  return (
    <div className="min-h-screen bg-[#F7F6FC] text-[#17152E] font-sans antialiased overflow-x-hidden selection:bg-[#C6F432] selection:text-[#17152E]">
      {/* =========================================================================
          1. HEADER / NAVIGATION (menu) - calibrado (+5%)
          ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[#17152E]/90 border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 h-[62px] flex items-center justify-between gap-5">
          {/* =================================================================
              LOGO DA MARCA (Header) - Composto por: Ícone, Nome e Badge
              ================================================================= */}
          <a
            href="#hero"
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label="EduMentor AI - Início"
          >
            {/* PARTE 1: Símbolo / Ícone oficial (balão roxo, escadaria branca de 3 degraus, ponto e estrela verde-limão) */}
            <img
              src={logoMark}
              alt="EduMentor AI"
              className="w-8 h-8 object-contain group-hover:scale-105 transition-transform"
            />

            {/* PARTES 2 & 3: Tipografia e Badge */}
            <div className="flex items-center gap-1.5">
              {/* PARTE 2: Texto com o nome "EduMentor" */}
              <span className="font-display font-extrabold text-xl tracking-tight text-white">
                EduMentor
              </span>
              {/* PARTE 3: Pílula verde com a sigla "AI" */}
              <span className="bg-[#C6F432] text-[#17152E] font-display font-extrabold text-[9.5px] px-1.5 py-0.5 rounded-full tracking-wider leading-none -translate-y-1">
                AI
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[#D9D6EE] font-bold text-xs sm:text-sm">
            <a
              href="#como-funciona"
              className="hover:text-white transition-colors py-1"
            >
              Como funciona
            </a>
            <a
              href="#recursos"
              className="hover:text-white transition-colors py-1"
            >
              Recursos
            </a>
            <a
              href="#mentorina"
              onClick={scrollToMentorina}
              className="hover:text-white transition-colors py-1 cursor-pointer"
            >
              Mentorina
            </a>
            <a
              href="#duvidas"
              className="hover:text-white transition-colors py-1"
            >
              Dúvidas
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate("login")}
              className="px-4.5 py-2 text-white font-bold text-xs rounded-full border border-white/30 hover:border-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => onNavigate("signup")}
              className="px-4.5 py-2 bg-[#C6F432] hover:bg-[#b5e028] text-[#17152E] font-bold text-xs rounded-full shadow-[0_3px_10px_rgba(198,244,50,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Criar minha conta
            </button>
          </div>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-white hover:text-[#C6F432] transition-colors"
            aria-label="Abrir menu de navegação"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#17152E] border-b border-white/10 px-5 py-4 flex flex-col gap-2.5 text-center">
            <a
              href="#como-funciona"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D9D6EE] hover:text-white font-bold text-sm py-1"
            >
              Como funciona
            </a>
            <a
              href="#recursos"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D9D6EE] hover:text-white font-bold text-sm py-1"
            >
              Recursos
            </a>
            <a
              href="#mentorina"
              onClick={scrollToMentorina}
              className="text-[#D9D6EE] hover:text-white font-bold text-sm py-1 cursor-pointer"
            >
              Mentorina
            </a>
            <a
              href="#duvidas"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#D9D6EE] hover:text-white font-bold text-sm py-1"
            >
              Dúvidas
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onNavigate("login")}
                className="w-full py-2 text-white font-bold text-xs rounded-full border border-white/30"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => onNavigate("signup")}
                className="w-full py-2 bg-[#C6F432] text-[#17152E] font-bold text-xs rounded-full"
              >
                Criar minha conta
              </button>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          2. HERO SECTION - calibrado (+5px altura)
          ========================================================================= */}
      <section
        id="hero"
        className="relative bg-[#17152E] pt-[48px] md:pt-[52px] pb-[36px] md:pb-[46px] overflow-hidden flex flex-col justify-center"
      >
        {/* Glow Orbs */}
        <div
          className="absolute w-[440px] h-[440px] -top-[90px] left-[55%] md:left-[60%] bg-[rgba(79,60,240,0.6)] blur-[85px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute w-[320px] h-[320px] top-[240px] right-[-60px] bg-[rgba(60,200,240,0.25)] blur-[65px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute w-[360px] h-[360px] top-[320px] -left-[130px] bg-[rgba(79,60,240,0.3)] blur-[75px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute w-[190px] h-[190px] top-[400px] left-[45%] bg-[rgba(198,244,50,0.18)] blur-[38px] rounded-full pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle grid pattern */}
        <div className="hero-grid-pattern absolute inset-0 pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 flex flex-col items-start gap-3">
              {/* Badge: NOVO Tutora de IA feita para o ENEM */}
              <div className="inline-flex items-center gap-1.5 bg-[#2A2550] border border-white/10 rounded-full px-3 py-0.5 shadow-xs">
                <span className="bg-[#C6F432] text-[#17152E] font-bold text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wider">
                  NOVO
                </span>
                <span className="text-white font-bold text-xs sm:text-[13px]">
                  Tutora de IA feita para o ENEM
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-display font-extrabold text-[28px] sm:text-[44px] md:text-[50px] lg:text-[53px] leading-[1.08] text-white tracking-[-0.025em]">
                Sua trilha até o
                <br />
                ENEM, com uma
                <br />
                <span className="text-[#C6F432]">tutora 24h.</span>
              </h1>

              {/* Description */}
              <p className="font-sans font-normal text-xs sm:text-sm md:text-base leading-relaxed text-[#D9D6EE] max-w-[525px]">
                Trilha adaptativa, simulados com questões reais e correção de
                redação por IA. E quando travar às 2 da manhã, a Mentorina
                explica de outro jeito.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-1 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => onNavigate("signup")}
                  className="w-full sm:w-auto px-6.5 py-2.5 sm:py-3 bg-[#C6F432] hover:bg-[#b5e028] text-[#17152E] font-bold text-sm rounded-full flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(198,244,50,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Criar minha conta</span>
                  <svg
                    className="w-3.5 h-3.5 text-[#17152E]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>

                <a
                  href="#como-funciona"
                  className="w-full sm:w-auto px-6.5 py-2.5 sm:py-3 border border-white/30 hover:border-white text-white font-bold text-sm rounded-full flex items-center justify-center gap-1.5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <span>Ver como funciona</span>
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                </a>
              </div>

              {/* Confidence points */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 text-[#ABA7C8] font-bold text-[11px] sm:text-xs">
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#137A51]/30 border border-[#C6F432] flex items-center justify-center text-[#C6F432] text-[8px] font-black">
                    ✓
                  </span>
                  <span>Questões reais do ENEM</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#137A51]/30 border border-[#C6F432] flex items-center justify-center text-[#C6F432] text-[8px] font-black">
                    ✓
                  </span>
                  <span>Redação pelas 5 competências</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#137A51]/30 border border-[#C6F432] flex items-center justify-center text-[#C6F432] text-[8px] font-black">
                    ✓
                  </span>
                  <span>Celular e computador</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual: Smartphone Mockup + Floating Cards */}
            <div className="lg:col-span-5 relative flex justify-center items-center mt-2 lg:mt-0 h-[350px] sm:h-[415px] lg:h-[508px] w-full">
              {/* Phone Stage Wrapper (centralizado lado a lado com o centro do texto) */}
              <div className="relative w-[320px] h-[660px] scale-[0.46] sm:scale-[0.56] md:scale-[0.62] lg:scale-[0.70] transition-transform origin-center my-auto shrink-0 lg:-translate-y-[44px] lg:-translate-x-4">
                {/* Floating Card 1 (Mentorina Bubble) (Aumentado em 5%) */}
                <div
                  style={
                    {
                      "--rot": "-3deg",
                      transform: "rotate(-3deg)",
                    } as React.CSSProperties
                  }
                  className="absolute z-20 left-[-243px] top-[110px] w-[263px] h-[149px] bg-white rounded-[21px] p-[17px] flex flex-col items-start gap-1.5 shadow-[0px_4px_10px_rgba(23,20,46,0.18),0px_16px_40px_-8px_rgba(79,61,240,0.3)] animate-float-slow select-none"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className="w-[29px] h-[29px] rounded-full bg-[#4F3CF0] flex items-center justify-center text-white text-[12.5px] font-bold shrink-0">
                      M
                    </div>
                    <span className="font-sans font-bold text-[14.7px] text-[#17152E]">
                      Mentorina
                    </span>
                    <span className="w-2 h-2 rounded-full bg-[#137A51] ml-auto" />
                  </div>
                  <div className="w-full bg-[#E9E6FF] text-[#17152E] rounded-[15px] p-[10px_13px] font-sans text-[13.6px] leading-[20px]">
                    Pensa numa escada: o &quot;a&quot; diz o quanto ela sobe a
                    cada degrau. 🙂
                  </div>
                </div>

                {/* Floating Card 2 (Streak / Success) */}
                <div
                  style={
                    {
                      "--rot": "4deg",
                      transform: "rotate(4deg)",
                    } as React.CSSProperties
                  }
                  className="absolute z-20 left-[255px] top-[-30px] w-[200px] h-[73px] bg-white rounded-[20px] p-4 flex flex-col items-start gap-1.5 shadow-[0px_4px_10px_rgba(23,20,46,0.18),0px_16px_40px_-8px_rgba(79,61,240,0.3)] animate-float-delayed select-none"
                >
                  <div className="flex items-center gap-1.5 text-[#137A51] font-sans font-bold text-sm">
                    <svg
                      className="w-4 h-4 text-[#137A51]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Você acertou!</span>
                  </div>
                  <div className="font-sans text-xs text-[#5F5B7D] leading-4">
                    Sequência de 5 dias estudando
                  </div>
                </div>

                {/* Floating Card 3 (Redação Score) */}
                <div
                  style={
                    {
                      "--rot": "-4deg",
                      transform: "rotate(-4deg)",
                    } as React.CSSProperties
                  }
                  className="absolute z-20 left-[270px] top-[376px] w-[200px] h-[106px] bg-white rounded-[20px] p-4 flex flex-col items-start gap-1.5 shadow-[0px_4px_10px_rgba(23,20,46,0.18),0px_16px_40px_-8px_rgba(79,61,240,0.3)] animate-float-slow select-none"
                >
                  <div className="font-sans text-[10px] font-bold uppercase tracking-[0.06em] text-[#4F3CF0] leading-[14px]">
                    REDAÇÃO · NOTA ESTIMADA
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-extrabold text-[40px] leading-[42px] tracking-[-0.02em] text-[#17152E]">
                      760
                    </span>
                    <span className="font-sans text-sm font-bold text-[#5F5B7D] leading-[19px]">
                      /1000
                    </span>
                  </div>
                  <div className="w-full bg-[#E9E6FF] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#3CC8F0] h-full rounded-full w-[76%]" />
                  </div>
                </div>

                {/* Floating Card 4 (Cronômetro Pill) */}
                <div
                  style={
                    {
                      "--rot": "15deg",
                      transform: "rotate(15deg)",
                    } as React.CSSProperties
                  }
                  className="absolute z-20 left-[-101px] top-[467px] w-[158px] h-[50px] bg-[#FF6B57] text-[#17152E] rounded-full px-[18px] py-[12px] flex items-center gap-2 shadow-[0px_4px_10px_rgba(23,20,46,0.18),0px_16px_40px_-8px_rgba(79,61,240,0.3)] animate-float-delayed select-none"
                >
                  <svg
                    className="w-[18px] h-[18px] text-[#17152E] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.2"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="font-mono font-medium text-[20px] leading-[26px] text-[#17152E]">
                    00:04:52
                  </span>
                </div>

                {/* Mobile Phone Device Body (Aumentado em 10%) */}
                <div className="relative w-[320px] h-[660px] scale-[1.10] origin-center bg-[#0E0C1F] border-2 border-[#3A3566] rounded-[48px] p-2.5 shadow-[0px_4px_10px_rgba(23,20,46,0.18),0px_16px_40px_-8px_rgba(79,61,240,0.3)] select-none">
                  {/* Screen */}
                  <div className="w-[300px] h-[640px] bg-[#F7F6FC] rounded-[38px] p-[18px_16px_16px] flex flex-col gap-3 overflow-hidden text-[#17152E] relative">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between text-[13px] font-bold text-[#17152E] px-1 h-[18px]">
                      <span className="font-sans font-bold text-[13px]">
                        9:41
                      </span>
                      <div className="w-[22px] h-[11px] bg-[#17152E] rounded-[3px]" />
                    </div>

                    {/* App User Header */}
                    <div className="flex items-center justify-between pt-0.5">
                      <div>
                        <h2 className="font-display font-extrabold text-[24px] text-[#17152E] leading-[25px] tracking-[-0.015em]">
                          Oi, Júlia!
                        </h2>
                        <p className="font-sans text-[12px] text-[#5F5B7D] leading-4">
                          Bora continuar de onde parou?
                        </p>
                      </div>
                      <div className="w-[34px] h-[34px] rounded-full bg-[#E9E6FF] text-[#4F3CF0] font-display font-extrabold text-[14px] flex items-center justify-center shrink-0">
                        J
                      </div>
                    </div>

                    {/* Countdown Card */}
                    <div className="bg-[#17152E] text-white rounded-[16px] p-[14px_16px] flex items-center justify-between shadow-xs">
                      <div className="flex items-baseline gap-2.5">
                        <span className="font-display font-extrabold text-[36px] leading-[38px] tracking-[-0.02em] text-[#C6F432]">
                          39
                        </span>
                        <span className="font-sans font-bold text-[14px] text-white leading-[19px]">
                          dias para o ENEM
                        </span>
                      </div>
                      <span className="bg-[#2A2550] text-white font-mono font-medium text-[11px] px-2 py-1 rounded-full">
                        08/11
                      </span>
                    </div>

                    {/* Level Card */}
                    <div className="bg-[#E9E6FF] rounded-[16px] p-[14px] flex flex-col gap-2">
                      <span className="font-sans text-[10px] font-bold tracking-[0.06em] text-[#4F3CF0] uppercase leading-[14px]">
                        SEU NÍVEL · NIVELAMENTO
                      </span>
                      <span className="font-display font-bold text-[18px] leading-[19px] tracking-[-0.005em] text-[#17152E]">
                        Intermediário
                      </span>
                      {/* Progress bars */}
                      <div className="space-y-1.5 text-[11px] pt-1">
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-[11px] text-[#17152E] w-[70px]">
                            Matemática
                          </span>
                          <div className="flex-1 bg-white h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#4F3CF0] h-full rounded-full w-[68%]" />
                          </div>
                          <span className="font-mono font-medium text-[10px] text-[#17152E] w-[24px] text-right">
                            68%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-[11px] text-[#17152E] w-[70px]">
                            Natureza
                          </span>
                          <div className="flex-1 bg-white h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#4F3CF0] h-full rounded-full w-[45%]" />
                          </div>
                          <span className="font-mono font-medium text-[10px] text-[#17152E] w-[24px] text-right">
                            45%
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-[11px] text-[#17152E] w-[70px]">
                            Linguagens
                          </span>
                          <div className="flex-1 bg-white h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[#4F3CF0] h-full rounded-full w-[78%]" />
                          </div>
                          <span className="font-mono font-medium text-[10px] text-[#17152E] w-[24px] text-right">
                            78%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Next Task Card */}
                    <div className="bg-white border border-[#E2DFF1] rounded-[16px] p-[14px] flex flex-col gap-2.5 shadow-xs">
                      <span className="font-sans text-[10px] font-bold tracking-[0.06em] text-[#4F3CF0] uppercase leading-[14px]">
                        PRÓXIMA TAREFA
                      </span>
                      <h3 className="font-display font-bold text-[17px] leading-[18px] tracking-[-0.005em] text-[#17152E]">
                        Funções do 1º grau
                      </h3>
                      <button
                        type="button"
                        onClick={() => onNavigate("signup")}
                        className="w-full h-[38px] bg-[#4F3CF0] hover:bg-[#4837d9] text-white rounded-full text-[13px] font-sans font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth="2.5"
                        >
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        <span>Continuar estudando</span>
                      </button>
                    </div>

                    {/* Mentorina Floating Action Button */}
                    <div className="absolute left-[234px] top-[568px] w-[56px] h-[56px] bg-[#4F3CF0] rounded-full shadow-[0px_4px_10px_rgba(23,20,46,0.18),0px_16px_40px_-8px_rgba(79,61,240,0.3)] flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform z-10">
                      <div className="w-4 h-4 flex items-center justify-center mb-0.5">
                        <span className="w-2 h-2 rounded-full bg-[#C6F432]" />
                      </div>
                      <span className="font-sans font-bold text-[10px] text-white tracking-[0.06em] leading-none">
                        IA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FEATURE RIBBON (faixa de recursos) - calibrado (+5px altura)
          ========================================================================= */}
      <section className="bg-[#C6F432] text-[#17152E] py-3.5 border-y border-[#17152E]/10 overflow-hidden select-none">
        <div className="animate-marquee items-center gap-6 font-display font-bold text-sm md:text-base tracking-tight">
          {[1, 2, 3].map((set) => (
            <div key={set} className="flex items-center gap-5 shrink-0">
              <span>Trilha adaptativa</span>
              <span className="text-xs opacity-70">✦</span>
              <span>Questões reais do ENEM</span>
              <span className="text-xs opacity-70">✦</span>
              <span>Simulados com cronômetro</span>
              <span className="text-xs opacity-70">✦</span>
              <span>Redação corrigida por IA</span>
              <span className="text-xs opacity-70">✦</span>
              <span>Mentorina 24h</span>
              <span className="text-xs opacity-70">✦</span>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          4. THE PROBLEM SECTION (o problema) - +10px no início
          ========================================================================= */}
      <section
        id="problema"
        className="pt-[59px] md:pt-[75px] pb-[49px] md:pb-[65px] bg-[#F7F6FC]"
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Problem Info */}
            <div className="lg:col-span-5 flex flex-col items-start gap-3">
              <span className="inline-block bg-[#E9E6FF] text-[#4F3CF0] font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                POR QUE O EDUMENTOR?
              </span>
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[38px] leading-[1.12] text-[#17152E] tracking-tight">
                Estudar sozinho
                <br />
                não precisa ser
                <br />
                solitário.
              </h2>
              <p className="text-[#5F5B7D] text-sm sm:text-base md:text-[16.5px] leading-relaxed pt-0.5">
                Muita gente desiste das metas de estudo para o ENEM.
                <br />
                Quase nunca é falta de vontade: é falta de rumo e de
                <br />
                alguém para tirar a dúvida na hora.
              </p>
            </div>

            {/* Right Problem Cards (Antes vs Com EduMentor) */}
            <div className="lg:col-span-7 flex flex-col gap-3">
              {/* Card 1 */}
              <div className="bg-white border border-[#E2DFF1] rounded-xl p-4 md:p-4.5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-2.5 md:gap-3 items-center">
                {/* Antes */}
                <div className="md:col-span-5 flex flex-col gap-1">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FCE8E8] text-[#C42B30] text-[9px] font-bold flex items-center justify-center">
                      ✕
                    </span>
                    <span className="text-[#C42B30] font-bold text-[10px] uppercase tracking-wide">
                      Antes
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm md:text-base text-[#17152E]">
                    &quot;Não sei por onde começar.&quot;
                  </h3>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex md:col-span-1 justify-center text-[#8C88AA]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>

                {/* Depois */}
                <div className="md:col-span-6 flex flex-col gap-1">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E3F5EC] text-[#137A51] text-[9px] font-bold flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-[#137A51] font-bold text-[10px] uppercase tracking-wide">
                      Com o EduMentor
                    </span>
                  </div>
                  <p className="text-[#17152E] text-xs leading-normal">
                    Sua trilha mostra o que estudar hoje, na ordem certa para o
                    seu curso-alvo.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-[#E2DFF1] rounded-xl p-4 md:p-4.5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-2.5 md:gap-3 items-center">
                {/* Antes */}
                <div className="md:col-span-5 flex flex-col gap-1">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FCE8E8] text-[#C42B30] text-[9px] font-bold flex items-center justify-center">
                      ✕
                    </span>
                    <span className="text-[#C42B30] font-bold text-[10px] uppercase tracking-wide">
                      Antes
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm md:text-base text-[#17152E]">
                    &quot;Meu cronograma nunca funciona.&quot;
                  </h3>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex md:col-span-1 justify-center text-[#8C88AA]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>

                {/* Depois */}
                <div className="md:col-span-6 flex flex-col gap-1">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E3F5EC] text-[#137A51] text-[9px] font-bold flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-[#137A51] font-bold text-[10px] uppercase tracking-wide">
                      Com o EduMentor
                    </span>
                  </div>
                  <p className="text-[#17152E] text-xs leading-normal">
                    A trilha se ajusta ao seu desempenho e à sua meta de horas
                    por semana.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-[#E2DFF1] rounded-xl p-4 md:p-4.5 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-2.5 md:gap-3 items-center">
                {/* Antes */}
                <div className="md:col-span-5 flex flex-col gap-1">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#FCE8E8] text-[#C42B30] text-[9px] font-bold flex items-center justify-center">
                      ✕
                    </span>
                    <span className="text-[#C42B30] font-bold text-[10px] uppercase tracking-wide">
                      Antes
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-sm md:text-base text-[#17152E]">
                    &quot;Travei e não tem ninguém pra perguntar.&quot;
                  </h3>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex md:col-span-1 justify-center text-[#8C88AA]">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>

                {/* Depois */}
                <div className="md:col-span-6 flex flex-col gap-1">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#E3F5EC] text-[#137A51] text-[9px] font-bold flex items-center justify-center">
                      ✓
                    </span>
                    <span className="text-[#137A51] font-bold text-[10px] uppercase tracking-wide">
                      Com o EduMentor
                    </span>
                  </div>
                  <p className="text-[#17152E] text-xs leading-normal">
                    A Mentorina responde na hora, até de madrugada, e explica de
                    outro jeito.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. HOW IT WORKS (como funciona) - +10px no início
          ========================================================================= */}
      <section
        id="como-funciona"
        className="pt-[59px] md:pt-[75px] pb-[49px] md:pb-[65px] bg-white relative overflow-hidden"
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6 xl:px-0 relative z-10">
          {/* Header (grupo) - 1280px x 152px, gap 16px */}
          <div className="flex flex-col items-start gap-4 max-w-[1280px] w-full">
            {/* Pill / Badge: COMO FUNCIONA (173px x 30px, bg #E9E6FF, radius 999px, padding 6px 14px, gap 6px) */}
            <div className="inline-flex items-center gap-1.5 px-[14px] py-[6px] bg-[#E9E6FF] rounded-full">
              {/* Frame 14x14 with vector */}
              <div className="w-[14px] h-[14px] relative flex items-center justify-center shrink-0">
                <svg
                  className="w-[14px] h-[14px] text-[#4F3CF0]"
                  viewBox="0 0 14 14"
                  fill="none"
                >
                  <path d="M3 1.5H11V12.5L7 10L3 12.5V1.5Z" fill="#4F3CF0" />
                </svg>
              </div>
              <span className="font-sans font-bold text-[13px] leading-[18px] tracking-[0.08em] text-[#4F3CF0] uppercase">
                COMO FUNCIONA
              </span>
            </div>

            {/* Title: Do cadastro à prova, em 4 passos (Bricolage Grotesque 800 56px/60px -0.025em #17152E) */}
            <h2 className="font-display font-extrabold text-[28px] sm:text-[40px] md:text-[48px] lg:text-[56px] leading-[1.08] lg:leading-[60px] tracking-[-0.025em] text-[#17152E] max-w-[900px]">
              Do cadastro à prova, em 4 passos
            </h2>

            {/* Subtitle (Nunito Sans 400 20px/30px #5F5B7D) */}
            <p className="font-sans font-normal text-sm sm:text-base lg:text-[20px] lg:leading-[30px] text-[#5F5B7D] max-w-[804px]">
              Você responde poucas perguntas e a IA monta o caminho até o ENEM.
              O resto é estudar.
            </p>
          </div>

          {/* 4 Steps Grid (grupo) - 1280px x 300px, gap 24px */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1280px] w-full mt-10 md:mt-12 relative z-10">
            {/* Step 01 (302px x 300px, bg #F7F6FC, radius 24px, padding 32px, gap 16px) */}
            <div className="bg-[#F7F6FC] rounded-[24px] p-6 sm:p-8 flex flex-col items-start gap-4 min-h-[300px] justify-start transition-all">
              {/* Pill 01: 50px x 36px, bg #E9E6FF, radius 999px */}
              <div className="w-[50px] h-[36px] px-[14px] py-[6px] bg-[#E9E6FF] rounded-full flex items-center justify-center shrink-0">
                <span className="font-mono font-medium text-[18px] leading-[24px] text-[#17152E]">
                  01
                </span>
              </div>
              <h3 className="font-display font-bold text-[22px] sm:text-[24px] lg:text-[26px] leading-[28px] lg:leading-[32px] tracking-[-0.01em] text-[#17152E]">
                Conte seu objetivo
              </h3>
              <p className="font-sans font-normal text-sm sm:text-base lg:text-[17px] leading-[24px] lg:leading-[26px] text-[#5F5B7D]">
                Escolha o curso e a universidade que você quer. A trilha
                prioriza as áreas com mais peso para eles.
              </p>
            </div>

            {/* Step 02 (302px x 300px, bg #F7F6FC, radius 24px, padding 32px, gap 16px) */}
            <div className="bg-[#F7F6FC] rounded-[24px] p-6 sm:p-8 flex flex-col items-start gap-4 min-h-[300px] justify-start transition-all">
              {/* Pill 02: 50px x 36px, bg #E9E6FF, radius 999px */}
              <div className="w-[50px] h-[36px] px-[14px] py-[6px] bg-[#E9E6FF] rounded-full flex items-center justify-center shrink-0">
                <span className="font-mono font-medium text-[18px] leading-[24px] text-[#17152E]">
                  02
                </span>
              </div>
              <h3 className="font-display font-bold text-[22px] sm:text-[24px] lg:text-[26px] leading-[28px] lg:leading-[32px] tracking-[-0.01em] text-[#17152E]">
                Faça o nivelamento
              </h3>
              <p className="font-sans font-normal text-sm sm:text-base lg:text-[17px] leading-[24px] lg:leading-[26px] text-[#5F5B7D]">
                São só 6 questões por área. Se preferir, escolha direto as
                matérias que quer focar.
              </p>
            </div>

            {/* Step 03 (302px x 300px, bg #F7F6FC, radius 24px, padding 32px, gap 16px) */}
            <div className="bg-[#F7F6FC] rounded-[24px] p-6 sm:p-8 flex flex-col items-start gap-4 min-h-[300px] justify-start transition-all">
              {/* Pill 03: 50px x 36px, bg #E9E6FF, radius 999px */}
              <div className="w-[50px] h-[36px] px-[14px] py-[6px] bg-[#E9E6FF] rounded-full flex items-center justify-center shrink-0">
                <span className="font-mono font-medium text-[18px] leading-[24px] text-[#17152E]">
                  03
                </span>
              </div>
              <h3 className="font-display font-bold text-[22px] sm:text-[24px] lg:text-[26px] leading-[28px] lg:leading-[32px] tracking-[-0.01em] text-[#17152E]">
                Receba sua trilha
              </h3>
              <p className="font-sans font-normal text-sm sm:text-base lg:text-[17px] leading-[24px] lg:leading-[26px] text-[#5F5B7D]">
                A IA distribui módulos, tópicos e revisões até o dia do ENEM, no
                ritmo da sua meta semanal.
              </p>
            </div>

            {/* Step 04 (302px x 300px, bg #17152E, radius 24px, padding 32px, gap 16px) */}
            <div className="bg-[#17152E] rounded-[24px] p-6 sm:p-8 flex flex-col items-start gap-4 min-h-[300px] justify-start relative transition-all group overflow-visible">
              {/* Minhoquinha v6 (cauda saindo um pouco acima do número quatro) */}
              <div className="absolute left-[18px] sm:left-[28px] -top-[150px] sm:-top-[158px] w-[190px] sm:w-[220px] h-[190px] sm:h-[220px] z-20 pointer-events-none select-none">
                <MascotMinhoquinha
                  size={220}
                  variant="stairs"
                  className="w-full h-full"
                />
              </div>

              {/* Pill 04: 50px x 36px, bg #C6F432, radius 999px */}
              <div className="w-[50px] h-[36px] px-[14px] py-[6px] bg-[#C6F432] rounded-full flex items-center justify-center shrink-0 relative z-10">
                <span className="font-mono font-medium text-[18px] leading-[24px] text-[#17152E]">
                  04
                </span>
              </div>
              <h3 className="font-display font-bold text-[22px] sm:text-[24px] lg:text-[26px] leading-[28px] lg:leading-[32px] tracking-[-0.01em] text-white relative z-10">
                Estude, treine e revise
              </h3>
              <p className="font-sans font-normal text-sm sm:text-base lg:text-[17px] leading-[24px] lg:leading-[26px] text-[#D9D6EE] relative z-10">
                Tópicos com resumo e exemplo, simulados com questões reais e a
                Mentorina sempre por perto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          6. FEATURES GRID (recursos) - +10px no início
          ========================================================================= */}
      <section
        id="recursos"
        className="pt-[59px] md:pt-[75px] pb-[49px] md:pb-[65px] bg-[#F7F6FC]"
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16">
          {/* Header */}
          <div className="flex flex-col items-start gap-2 mb-7 md:mb-9 max-w-2xl">
            <span className="bg-[#E9E6FF] text-[#4F3CF0] font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              RECURSOS
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[38px] leading-tight text-[#17152E] tracking-tight">
              Tudo o que você precisa para chegar no ENEM
            </h2>
          </div>

          {/* Bento Grid */}
          <div className="space-y-4">
            {/* Top Row: Big Trilha Adaptativa Card + 39 Dias Card */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Trilha Adaptativa (Wide Purple Card) */}
              <div className="lg:col-span-8 bg-[#4F3CF0] text-white rounded-[28px] p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 justify-around shadow-md relative overflow-hidden min-h-[429px]">
                {/* Trilha adaptativa - Bloco Centralizado (360px x 247px, gap 16px) */}
                <div className="flex flex-col items-center justify-center text-center gap-4 w-full md:w-[360px] max-w-[360px] shrink-0 my-auto">
                  {/* Icon Card: 48px x 48px, bg #FFFFFF, radius 14px, padding 12px */}
                  <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center text-[#4F3CF0] shadow-xs shrink-0">
                    <svg
                      className="w-6 h-6 text-[#4F3CF0]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="6" r="3" />
                      <path d="M9 18h3a3 3 0 0 0 3-3V9a3 3 0 0 1 3-3h0" />
                    </svg>
                  </div>

                  {/* Title: Trilha adaptativa (Bricolage Grotesque 800 36px/40px -0.025em text-center #FFFFFF) */}
                  <h3 className="font-display font-extrabold text-[28px] sm:text-[32px] md:text-[36px] leading-[34px] sm:leading-[40px] tracking-[-0.025em] text-white text-center w-full max-w-[360px]">
                    Trilha adaptativa
                  </h3>

                  {/* Description: (Nunito Sans 400 18px/27px text-center #E9E6FF) */}
                  <p className="font-sans font-normal text-sm sm:text-base md:text-[18px] leading-[24px] sm:leading-[27px] text-[#E9E6FF] text-center w-full max-w-[360px]">
                    Módulos, tópicos com resumo e exemplo e questões no fim. A
                    trilha muda conforme você acerta e erra.
                  </p>

                  {/* Pill Badge: 220px x 30px, bg rgba(255,255,255,0.15), radius 999px, padding 6px 12px */}
                  <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/15 rounded-full w-auto sm:w-[220px] h-[30px] shrink-0">
                    <div className="w-3.5 h-3.5 relative flex items-center justify-center shrink-0">
                      <svg
                        className="w-3.5 h-3.5 text-[#C6F432]"
                        viewBox="0 0 14 14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="7" cy="7" r="5" />
                        <circle cx="7" cy="7" r="2" />
                      </svg>
                    </div>
                    <span className="font-sans font-bold text-[13px] leading-[18px] text-white whitespace-nowrap">
                      Uma trilha por vez: foco total
                    </span>
                  </div>
                </div>

                {/* Embedded Mini Track Mockup (Aumentado para ~350px-360px com mais respiro) */}
                <div className="w-full md:w-[350px] lg:w-[360px] bg-white text-[#17152E] rounded-[20px] p-4.5 sm:p-5 shadow-md flex flex-col gap-2.5 shrink-0 my-auto">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#4F3CF0]">
                    <span>MATEMÁTICA · 48% CONCLUÍDO</span>
                  </div>
                  <div className="w-full bg-[#E9E6FF] h-2 rounded-full overflow-hidden">
                    <div className="bg-[#4F3CF0] h-full w-[48%]" />
                  </div>

                  {/* Modules preview */}
                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="bg-[#F7F6FC] rounded-xl p-2.5 sm:p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-[#E3F5EC] text-[#137A51] flex items-center justify-center font-bold text-[10px]">
                          ✓
                        </span>
                        <div>
                          <div className="font-bold text-xs sm:text-[13px] text-[#17152E]">
                            Módulo 1 · Funções
                          </div>
                          <div className="text-[10px] text-[#5F5B7D]">
                            Concluído
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#E9E6FF] border border-[#4F3CF0] rounded-xl p-2.5 sm:p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-[#4F3CF0] text-white flex items-center justify-center font-bold text-[10px]">
                          ▶
                        </span>
                        <div>
                          <div className="font-bold text-xs sm:text-[13px] text-[#17152E]">
                            Módulo 2 · Geometria
                          </div>
                          <div className="text-[10px] text-[#5F5B7D]">
                            Em andamento · 3 de 6 tópicos
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F7F6FC] rounded-xl p-2.5 sm:p-3 flex items-center justify-between opacity-80">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-white text-[#8C88AA] flex items-center justify-center font-bold text-[10px] shadow-2xs">
                          ⏱
                        </span>
                        <div>
                          <div className="font-bold text-xs sm:text-[13px] text-[#17152E]">
                            Módulo 3 · Estatística
                          </div>
                          <div className="text-[10px] text-[#5F5B7D]">
                            Revisão em 2 dias
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#F7F6FC] rounded-xl p-2.5 sm:p-3 flex items-center justify-between opacity-60">
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded-md bg-white text-[#8C88AA] flex items-center justify-center font-bold text-[10px] shadow-2xs">
                          🔒
                        </span>
                        <div>
                          <div className="font-bold text-xs sm:text-[13px] text-[#8C88AA]">
                            Módulo 4 · Probabilidade
                          </div>
                          <div className="text-[10px] text-[#5F5B7D]">
                            Bloqueado
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown Card (contagem regressiva - 400px x 429px, bg #17152E, radius 28px, padding 40px, gap 12px) */}
              <div className="lg:col-span-4 bg-[#17152E] text-white rounded-[28px] p-8 sm:p-10 flex flex-col items-start gap-3 justify-between shadow-md min-h-[429px]">
                {/* Icon (48px x 48px, bg #2A2550, radius 14px, padding 12px) */}
                <div className="w-12 h-12 rounded-[14px] bg-[#2A2550] flex items-center justify-center shrink-0">
                  <svg
                    className="w-6 h-6 text-[#C6F432]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>

                {/* Number & Unit Group (align-items: baseline, gap 12px) */}
                <div className="flex items-baseline gap-3 pt-1">
                  <span className="font-display font-extrabold text-[84px] sm:text-[100px] md:text-[120px] leading-[1] md:leading-[120px] text-[#C6F432] tracking-[-0.05em]">
                    39
                  </span>
                  <span className="font-display font-bold text-[26px] sm:text-[30px] md:text-[32px] leading-[35px] text-white tracking-[-0.01em]">
                    dias
                  </span>
                </div>

                {/* Title (Bricolage Grotesque 700 26px/32px -0.01em #FFFFFF, max-w 320px) */}
                <h3 className="font-display font-bold text-[22px] sm:text-[26px] leading-[28px] sm:leading-[32px] tracking-[-0.01em] text-white max-w-[320px]">
                  Contagem regressiva para o ENEM
                </h3>

                {/* Description (Nunito Sans 400 16px/24px #ABA7C8, max-w 320px) */}
                <p className="font-sans font-normal text-sm sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#ABA7C8] max-w-[320px]">
                  Sempre à vista na Home, para você nunca perder o ritmo.
                </p>
              </div>
            </div>

            {/* Bottom Row: 3 Feature Cards (grupo: 1280px x 476px, gap 24px) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1280px] w-full">
              {/* 1. Simulados com questões reais (411.33px x 476px, bg #FFFFFF, border #E2DFF1, radius 28px, padding 32px, gap 16px) */}
              <div className="bg-white border border-[#E2DFF1] rounded-[28px] p-6 sm:p-8 flex flex-col items-start gap-4 justify-between shadow-[0px_2px_8px_rgba(23,20,46,0.06)] min-h-[476px]">
                {/* Header elements: Icon, Title, Description */}
                <div className="flex flex-col items-start gap-3 w-full">
                  {/* Icon (48px x 48px, bg #E9E6FF, radius 14px, padding 12px) */}
                  <div className="w-12 h-12 rounded-[14px] bg-[#E9E6FF] flex items-center justify-center text-[#4F3CF0] shrink-0">
                    <svg
                      className="w-6 h-6 text-[#4F3CF0]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-[22px] sm:text-[26px] leading-[28px] sm:leading-[32px] tracking-[-0.01em] text-[#17152E]">
                    Simulados com questões reais
                  </h3>
                  <p className="font-sans font-normal text-sm sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#5F5B7D]">
                    Provas anteriores do ENEM por ano e área, com cronômetro e
                    gabarito comentado.
                  </p>
                </div>

                {/* Question simulation preview (gap 8px, height 148px) */}
                <div className="flex flex-col items-start gap-2 w-full">
                  {/* Option A (height 44px, padding 10px 12px, radius 12px) */}
                  <div
                    onClick={() => setSelectedSimuladoOption("A")}
                    className={`w-full h-[44px] px-3 py-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                      selectedSimuladoOption === "A"
                        ? "bg-[#E3F5EC] border-2 border-[#137A51]"
                        : "bg-white border border-[#8C88AA]"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                        selectedSimuladoOption === "A"
                          ? "bg-[#137A51] text-white"
                          : "bg-[#F7F6FC] text-[#17152E]"
                      }`}
                    >
                      A
                    </span>
                    <span className="font-sans text-sm text-[#17152E]">
                      10%
                    </span>
                  </div>

                  {/* Option B (Selected / Acertou) */}
                  <div
                    onClick={() => setSelectedSimuladoOption("B")}
                    className={`w-full h-[44px] px-3 py-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                      selectedSimuladoOption === "B"
                        ? "bg-[#E3F5EC] border-2 border-[#137A51]"
                        : "bg-white border border-[#8C88AA]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                          selectedSimuladoOption === "B"
                            ? "bg-[#137A51] text-white"
                            : "bg-[#F7F6FC] text-[#17152E]"
                        }`}
                      >
                        B
                      </span>
                      <span className="font-sans text-sm text-[#17152E]">
                        16,7%
                      </span>
                    </div>
                    {selectedSimuladoOption === "B" && (
                      <span className="font-sans font-bold text-xs text-[#137A51]">
                        ✓ acertou
                      </span>
                    )}
                  </div>

                  {/* Option C */}
                  <div
                    onClick={() => setSelectedSimuladoOption("C")}
                    className={`w-full h-[44px] px-3 py-2.5 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                      selectedSimuladoOption === "C"
                        ? "bg-[#E3F5EC] border-2 border-[#137A51]"
                        : "bg-white border border-[#8C88AA]"
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full font-bold flex items-center justify-center text-xs shrink-0 ${
                        selectedSimuladoOption === "C"
                          ? "bg-[#137A51] text-white"
                          : "bg-[#F7F6FC] text-[#17152E]"
                      }`}
                    >
                      C
                    </span>
                    <span className="font-sans text-sm text-[#17152E]">
                      25%
                    </span>
                  </div>
                </div>

                {/* Cronômetro Pill (139px x 40px, padding 8px 14px, radius 999px, border #8C88AA) */}
                <div className="w-[139px] h-[40px] px-3.5 py-2 bg-white border border-[#8C88AA] rounded-full inline-flex items-center gap-2 shrink-0">
                  <svg
                    className="w-4 h-4 text-[#17152E] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="font-mono font-medium text-[18px] leading-[24px] text-[#17152E]">
                    01:24:10
                  </span>
                </div>
              </div>

              {/* 2. Redação corrigida por IA (411.33px x 476px, bg #FFFFFF, border #E2DFF1, radius 28px, padding 32px, gap 16px) */}
              <div className="bg-white border border-[#E2DFF1] rounded-[28px] p-6 sm:p-8 flex flex-col items-start gap-4 justify-between shadow-[0px_2px_8px_rgba(23,20,46,0.06)] min-h-[476px]">
                {/* Header elements: Icon, Title, Description */}
                <div className="flex flex-col items-start gap-3 w-full">
                  {/* Icon (48px x 48px, bg #E9E6FF, radius 14px, padding 12px) */}
                  <div className="w-12 h-12 rounded-[14px] bg-[#E9E6FF] flex items-center justify-center text-[#4F3CF0] shrink-0">
                    <svg
                      className="w-6 h-6 text-[#4F3CF0]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-[22px] sm:text-[26px] leading-[28px] sm:leading-[32px] tracking-[-0.01em] text-[#17152E]">
                    Redação corrigida por IA
                  </h3>
                  <p className="font-sans font-normal text-sm sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#5F5B7D]">
                    Feedback pelas 5 competências do ENEM e uma nota estimada,
                    com o que melhorar primeiro.
                  </p>
                </div>

                {/* Competencies Progress Bars (gap 10px, height 116px) */}
                <div className="flex flex-col gap-2.5 w-full my-auto">
                  {/* C1 · Norma culta */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-bold text-[13px] leading-[18px] text-[#17152E]">
                        C1 · Norma culta
                      </span>
                      <span className="font-mono font-medium text-xs text-[#17152E]">
                        180/200
                      </span>
                    </div>
                    <div className="w-full bg-[#E9E6FF] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#3CC8F0] h-full rounded-full w-[90%]" />
                    </div>
                  </div>

                  {/* C3 · Argumentação */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-bold text-[13px] leading-[18px] text-[#17152E]">
                        C3 · Argumentação
                      </span>
                      <span className="font-mono font-medium text-xs text-[#17152E]">
                        120/200
                      </span>
                    </div>
                    <div className="w-full bg-[#E9E6FF] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#FF6B57] h-full rounded-full w-[60%]" />
                    </div>
                  </div>

                  {/* C5 · Proposta */}
                  <div className="flex flex-col gap-1.5 w-full">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-sans font-bold text-[13px] leading-[18px] text-[#17152E]">
                        C5 · Proposta
                      </span>
                      <span className="font-mono font-medium text-xs text-[#17152E]">
                        140/200
                      </span>
                    </div>
                    <div className="w-full bg-[#E9E6FF] h-2 rounded-full overflow-hidden">
                      <div className="bg-[#FF6B57] h-full rounded-full w-[70%]" />
                    </div>
                  </div>
                </div>

                {/* Empty bottom spacer to align visually with card 1 and 3 */}
                <div className="h-2" />
              </div>

              {/* 3. Revisões no momento certo (409.33px x 476px, bg #E9E6FF, radius 28px, padding 32px, gap 16px) */}
              <div className="bg-[#E9E6FF] rounded-[28px] p-6 sm:p-8 flex flex-col items-start gap-4 justify-between min-h-[476px]">
                {/* Header elements: Icon, Title, Description */}
                <div className="flex flex-col items-start gap-3 w-full">
                  {/* Icon (48px x 48px, bg #FFFFFF, radius 14px, padding 12px) */}
                  <div className="w-12 h-12 rounded-[14px] bg-white flex items-center justify-center text-[#4F3CF0] shrink-0">
                    <svg
                      className="w-6 h-6 text-[#4F3CF0]"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                  <h3 className="font-display font-bold text-[22px] sm:text-[26px] leading-[28px] sm:leading-[32px] tracking-[-0.01em] text-[#17152E]">
                    Revisões no momento certo
                  </h3>
                  <p className="font-sans font-normal text-sm sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#5F5B7D]">
                    Errou? A questão volta nas suas revisões dos próximos dias,
                    até você dominar o assunto.
                  </p>
                </div>

                {/* Spaced repetition chips (gap 8px, height 76px, flex-wrap) */}
                <div className="flex flex-wrap gap-2 pt-2 w-full my-auto">
                  {/* Chip 1: Hoje · Geometria (bg #C6F432, radius 999px, padding 8px 14px) */}
                  <span className="bg-[#C6F432] text-[#17152E] font-sans font-bold text-[13px] leading-[18px] px-3.5 py-2 rounded-full inline-flex items-center">
                    Hoje · Geometria
                  </span>

                  {/* Chip 2: Amanhã · Funções (bg #FFFFFF, border #E2DFF1, radius 999px, padding 8px 14px) */}
                  <span className="bg-white border border-[#E2DFF1] text-[#17152E] font-sans font-bold text-[13px] leading-[18px] px-3.5 py-2 rounded-full inline-flex items-center">
                    Amanhã · Funções
                  </span>

                  {/* Chip 3: Em 3 dias · Estatística (bg #FFFFFF, border #E2DFF1, radius 999px, padding 8px 14px) */}
                  <span className="bg-white border border-[#E2DFF1] text-[#17152E] font-sans font-bold text-[13px] leading-[18px] px-3.5 py-2 rounded-full inline-flex items-center">
                    Em 3 dias · Estatística
                  </span>
                </div>

                {/* Empty bottom spacer to align visually with card 1 and 2 */}
                <div className="h-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          7. MENTORINA SECTION (mentorina) - Compactada proporcionalmente
          ========================================================================= */}
      <section
        id="mentorina"
        className="py-12 sm:py-16 lg:py-[80px] px-6 sm:px-10 lg:px-[64px] bg-[#17152E] text-white relative overflow-hidden isolate flex flex-col justify-center min-h-[660px]"
      >
        {/* Glow Orb 1 - Top right */}
        <div
          className="absolute w-[480px] h-[480px] left-[850px] top-[-80px] bg-[rgba(79,60,240,0.55)] blur-[95px] rounded-full pointer-events-none -z-10"
          aria-hidden="true"
        />

        {/* Glow Orb 2 - Bottom left */}
        <div
          className="absolute w-[360px] h-[360px] left-[-120px] top-[340px] bg-[rgba(60,200,240,0.22)] blur-[65px] rounded-full pointer-events-none -z-10"
          aria-hidden="true"
        />

        <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 xl:gap-16 relative z-10 w-full">
          {/* Left Column */}
          <div className="w-full lg:w-[470px] xl:w-[490px] shrink-0 flex flex-col items-start gap-4 sm:gap-5 relative isolate">
            {/* Pill Badge */}
            <div className="flex flex-row items-center px-3 py-1 gap-1.5 w-[130px] h-[28px] bg-[#2A2550] rounded-full shrink-0">
              <svg
                className="w-3.5 h-3.5 text-[#C6F432]"
                viewBox="0 0 14 14"
                fill="currentColor"
              >
                <path d="M7 0.5L8.6 5.4L13.5 7L8.6 8.6L7 13.5L5.4 8.6L0.5 7L5.4 5.4L7 0.5Z" />
              </svg>
              <span className="font-sans font-bold text-[12px] leading-[16px] tracking-[0.08em] text-[#C6F432]">
                MENTORINA
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display font-extrabold text-[32px] sm:text-[40px] lg:text-[46px] leading-[36px] sm:leading-[44px] lg:leading-[50px] tracking-[-0.025em] text-white max-w-[490px]">
              Travou? Pergunta pra Mentorina.
            </h2>

            {/* Subtitle */}
            <p className="font-sans font-normal text-[15px] sm:text-[17px] leading-[24px] sm:leading-[27px] text-[#D9D6EE] max-w-[490px]">
              Sua tutora de IA fica num botão em todas as telas de estudo e já
              abre sabendo o que você está estudando. De dia ou às 2 da manhã.
            </p>

            {/* 4 Feature rows */}
            <div className="flex flex-col items-start gap-2.5 sm:gap-3 w-full pt-0.5">
              {/* Row 1: Explica de outro jeito */}
              <div className="flex flex-row items-center gap-3.5 w-full">
                <div className="w-9 h-9 rounded-[10px] bg-[#2A2550] p-2 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4.5 h-4.5 text-[#C6F432]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.83"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18h6" />
                    <path d="M10 22h4" />
                    <path d="M12 2a7 7 0 00-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <h3 className="font-sans font-bold text-[15px] sm:text-[16px] leading-[21px] text-white">
                    Explica de outro jeito
                  </h3>
                  <p className="font-sans font-normal text-[13px] sm:text-[14px] leading-[18px] text-[#ABA7C8]">
                    Com analogias e passo a passo, até fazer sentido.
                  </p>
                </div>
              </div>

              {/* Row 2: Cria exercícios na hora */}
              <div className="flex flex-row items-center gap-3.5 w-full">
                <div className="w-9 h-9 rounded-[10px] bg-[#2A2550] p-2 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4.5 h-4.5 text-[#C6F432]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.83"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <h3 className="font-sans font-bold text-[15px] sm:text-[16px] leading-[21px] text-white">
                    Cria exercícios na hora
                  </h3>
                  <p className="font-sans font-normal text-[13px] sm:text-[14px] leading-[18px] text-[#ABA7C8]">
                    Para fixar o que você acabou de aprender.
                  </p>
                </div>
              </div>

              {/* Row 3: Dá dicas de memorização */}
              <div className="flex flex-row items-center gap-3.5 w-full">
                <div className="w-9 h-9 rounded-[10px] bg-[#2A2550] p-2 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4.5 h-4.5 text-[#C6F432]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.83"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <h3 className="font-sans font-bold text-[15px] sm:text-[16px] leading-[21px] text-white">
                    Dá dicas de memorização
                  </h3>
                  <p className="font-sans font-normal text-[13px] sm:text-[14px] leading-[18px] text-[#ABA7C8]">
                    Macetes para levar para o dia da prova.
                  </p>
                </div>
              </div>

              {/* Row 4: Corrige sua redação */}
              <div className="flex flex-row items-center gap-3.5 w-full">
                <div className="w-9 h-9 rounded-[10px] bg-[#2A2550] p-2 flex items-center justify-center shrink-0">
                  <svg
                    className="w-4.5 h-4.5 text-[#C6F432]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.83"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <div className="flex flex-col items-start gap-0.5">
                  <h3 className="font-sans font-bold text-[15px] sm:text-[16px] leading-[21px] text-white">
                    Corrige sua redação
                  </h3>
                  <p className="font-sans font-normal text-[13px] sm:text-[14px] leading-[18px] text-[#ABA7C8]">
                    Feedback pelas 5 competências do ENEM.
                  </p>
                </div>
              </div>
            </div>

            {/* Minhoquinha v6 perched (reduzida proporcionalmente) */}
            <div className="hidden xl:block absolute left-[295px] top-[345px] w-[170px] h-[170px] z-20 pointer-events-none">
              <MascotMinhoquinha
                size={170}
                variant="coiled"
                coilColor="white"
              />
            </div>
          </div>

          {/* Right: Interactive Mentorina Live Chat - Compactado */}
          <div className="w-full lg:w-[580px] xl:w-[620px] shrink-0 bg-white text-[#17152E] rounded-[24px] p-5 sm:p-5.5 flex flex-col gap-3 shadow-[0px_20px_50px_-8px_rgba(79,61,240,0.32)] relative z-10 min-h-[440px] justify-between">
            {/* Chat Header */}
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-[#E2DFF1] w-full shrink-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shadow-xs">
                  <MascotMinhoquinha size={40} variant="avatar" />
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#137A51] border-2 border-white absolute bottom-0 right-0 z-10" />
              </div>
              <div className="flex flex-col items-start">
                <h3 className="font-sans font-bold text-[15px] leading-[20px] text-[#17152E]">
                  Mentorina
                </h3>
                <p className="font-sans font-normal text-[11px] leading-[15px] text-[#137A51]">
                  ● Online · Funções do 1º grau
                </p>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex flex-col gap-2.5 min-h-[180px] max-h-[220px] overflow-y-auto pr-1 w-full py-1">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex w-full ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`font-sans font-normal text-[14px] leading-[20px] px-3.5 py-2.5 shadow-xs ${
                      msg.sender === "user"
                        ? "bg-[#4F3CF0] text-white rounded-[18px_18px_5px_18px] max-w-[270px]"
                        : "bg-[#E9E6FF] text-[#17152E] rounded-[18px_18px_18px_5px] max-w-[360px]"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start w-full">
                  <div className="bg-[#E9E6FF] text-[#17152E] rounded-[18px_18px_18px_5px] px-3.5 py-2 font-sans text-[12px] flex items-center gap-1.5 animate-pulse shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F3CF0]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F3CF0]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F3CF0]" />
                    <span>Mentorina está digitando...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt suggestion chips */}
            <div className="flex flex-wrap items-center gap-1.5 w-full shrink-0">
              <button
                type="button"
                onClick={() =>
                  handleSendChat("Pode explicar isso de outro jeito?")
                }
                className="box-border flex flex-row items-center px-2.5 py-1 gap-1.5 h-[30px] border border-[#E2DFF1] hover:border-[#4F3CF0] bg-white rounded-full transition-colors cursor-pointer text-[#4F3CF0] font-sans font-bold text-[12px] leading-[16px]"
              >
                <svg
                  className="w-3 h-3 text-[#4F3CF0]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 2a7 7 0 00-7 7c0 2.5 1.5 4.5 3 6h8c1.5-1.5 3-3.5 3-6a7 7 0 00-7-7z" />
                </svg>
                <span>Explicar de outro jeito</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSendChat("Tem alguma dica de memorização?")
                }
                className="box-border flex flex-row items-center px-2.5 py-1 gap-1.5 h-[30px] border border-[#E2DFF1] hover:border-[#4F3CF0] bg-white rounded-full transition-colors cursor-pointer text-[#4F3CF0] font-sans font-bold text-[12px] leading-[16px]"
              >
                <svg
                  className="w-3 h-3 text-[#4F3CF0]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
                <span>Dica de memorização</span>
              </button>
            </div>

            {/* Chat input box */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendChat()
              }}
              className="box-border flex flex-row items-center px-2 py-1 pl-3.5 sm:pl-4 gap-2 w-full h-[46px] bg-[#F7F6FC] border border-[#E2DFF1] rounded-full focus-within:border-[#4F3CF0] transition-colors shrink-0"
            >
              <input
                type="text"
                placeholder="Digite sua dúvida..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-transparent font-sans font-normal text-[14px] leading-[18px] text-[#17152E] placeholder-[#5F5B7D] outline-none"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-full bg-[#4F3CF0] hover:bg-[#3f2ee0] text-white flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-sm active:scale-95"
                aria-label="Enviar mensagem para a Mentorina"
              >
                <svg
                  className="w-3.5 h-3.5 text-white transform rotate-45 -translate-y-0.5 -translate-x-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* =========================================================================
          8. MULTIPLATFORM (celular e computador / EM QUALQUER LUGAR) - +10px no início
          ========================================================================= */}
      <section
        id="aparelhos"
        className="pt-[59px] md:pt-[75px] pb-[49px] md:pb-[65px] bg-white"
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 lg:px-16 text-center">
          {/* Header */}
          <div className="flex flex-col items-center gap-2 mb-7 md:mb-9 max-w-xl mx-auto">
            <span className="bg-[#E9E6FF] text-[#4F3CF0] font-bold text-[10px] uppercase px-2.5 py-0.5 rounded-full tracking-wider">
              EM QUALQUER LUGAR
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-[38px] leading-tight text-[#17152E] tracking-tight">
              No celular e no computador
            </h2>
            <p className="text-[#5F5B7D] text-xs sm:text-sm leading-relaxed">
              Comece no ônibus e termine em casa: sua trilha, seus simulados e a
              Mentorina sincronizados.
            </p>
          </div>

          {/* Dual Mockups Container */}
          <div className="relative max-w-[940px] mx-auto flex flex-col lg:flex-row items-center justify-center gap-5 lg:gap-0">
            {/* Desktop Mockup (Notebook) */}
            <div className="w-full lg:w-[735px] h-auto md:h-[368px] bg-[#17152E] rounded-xl p-2.5 shadow-lg text-left flex flex-col">
              {/* Notebook Screen */}
              <div className="w-full h-full bg-[#F7F6FC] rounded-lg flex flex-col md:flex-row overflow-hidden border border-white/10">
                {/* Sidebar */}
                <div className="w-full md:w-[130px] bg-white p-3 border-r border-[#E2DFF1] flex flex-col gap-2 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-xs bg-[#4F3CF0] flex items-center justify-center text-white text-[8px] font-bold">
                      E
                    </div>
                    <span className="font-display font-extrabold text-[11px] text-[#17152E]">
                      EduMentor
                    </span>
                    <span className="bg-[#C6F432] text-[#17152E] text-[6px] font-bold px-1 rounded-2xs">
                      AI
                    </span>
                  </div>

                  <nav className="flex flex-col gap-0.5 text-[10px] font-semibold">
                    <div className="bg-[#E9E6FF] text-[#4F3CF0] font-bold px-2 py-1 rounded-md flex items-center gap-1">
                      <span>🏠</span> Início
                    </div>
                    <div className="text-[#17152E] px-2 py-1 hover:bg-[#F7F6FC] rounded-md flex items-center gap-1">
                      <span>🗺️</span> Sua trilha
                    </div>
                    <div className="text-[#17152E] px-2 py-1 hover:bg-[#F7F6FC] rounded-md flex items-center gap-1">
                      <span>📝</span> Simulados
                    </div>
                    <div className="text-[#17152E] px-2 py-1 hover:bg-[#F7F6FC] rounded-md flex items-center gap-1">
                      <span>✍️</span> Redação
                    </div>
                    <div className="text-[#17152E] px-2 py-1 hover:bg-[#F7F6FC] rounded-md flex items-center gap-1">
                      <span>👤</span> Perfil
                    </div>
                  </nav>
                </div>

                {/* Main Desktop Dashboard Area */}
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2 text-[#17152E]">
                  <h3 className="font-display font-extrabold text-base">
                    Oi, Júlia!
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="bg-[#17152E] text-white p-2.5 rounded-md flex flex-col justify-between">
                      <span className="text-[7px] uppercase font-bold text-[#ABA7C8]">
                        FALTAM
                      </span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="font-display font-extrabold text-xl text-[#C6F432]">
                          39
                        </span>
                        <span className="text-[9px] font-bold">
                          dias para o ENEM
                        </span>
                      </div>
                    </div>

                    <div className="bg-[#E9E6FF] p-2.5 rounded-md flex flex-col justify-between">
                      <span className="text-[7px] uppercase font-bold text-[#4F3CF0]">
                        SEU NÍVEL
                      </span>
                      <span className="font-display font-bold text-xs text-[#17152E]">
                        Intermediário
                      </span>
                    </div>
                  </div>

                  <div className="bg-white border border-[#E2DFF1] p-2.5 rounded-md flex items-center justify-between">
                    <div>
                      <span className="text-[7px] uppercase font-bold text-[#4F3CF0]">
                        PRÓXIMA TAREFA
                      </span>
                      <h4 className="font-display font-bold text-xs text-[#17152E]">
                        Funções do 1º grau
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => onNavigate("signup")}
                      className="px-2.5 py-1 bg-[#4F3CF0] text-white text-[10px] font-bold rounded-full cursor-pointer"
                    >
                      Continuar estudando
                    </button>
                  </div>

                  {/* Quick access cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-white border border-[#E2DFF1] p-1.5 rounded-md text-center">
                      <div className="font-bold text-[10px]">Estudar</div>
                      <div className="text-[8px] text-[#5F5B7D]">Atalho</div>
                    </div>
                    <div className="bg-white border border-[#E2DFF1] p-1.5 rounded-md text-center">
                      <div className="font-bold text-[10px]">Simulado</div>
                      <div className="text-[8px] text-[#5F5B7D]">Atalho</div>
                    </div>
                    <div className="bg-white border border-[#E2DFF1] p-1.5 rounded-md text-center">
                      <div className="font-bold text-[10px]">Redação</div>
                      <div className="text-[8px] text-[#5F5B7D]">Atalho</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Device Mockup positioned overlapping on the right */}
            <div className="w-[205px] h-[368px] bg-[#0E0C1F] rounded-[26px] p-1.5 shadow-lg text-left shrink-0 lg:-ml-12 lg:mt-8 z-20 border border-[#3A3566]">
              {/* Screen simulating active exam */}
              <div className="w-full h-full bg-[#F7F6FC] rounded-[20px] p-2 flex flex-col justify-between text-[#17152E]">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold mb-1.5">
                    <span className="text-[#5F5B7D]">✕ Sair</span>
                    <span className="bg-white border border-[#8C88AA] px-1 py-0.5 rounded-full font-mono text-[8px]">
                      01:24:10
                    </span>
                  </div>

                  <span className="text-[8px] font-bold text-[#4F3CF0] tracking-wider uppercase">
                    QUESTÃO 12 DE 45
                  </span>

                  <p className="text-[10px] text-[#17152E] leading-tight mt-0.5 mb-1.5">
                    O gráfico mostra o consumo de energia de uma casa em 6
                    meses. Em qual intervalo ele cresceu mais?
                  </p>

                  <div className="space-y-1 text-[9px]">
                    <div className="bg-white border border-[#8C88AA] p-1 rounded flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#F7F6FC] flex items-center justify-center font-bold text-[8px]">
                        A
                      </span>
                      <span>Jan. para fev.</span>
                    </div>
                    <div className="bg-white border border-[#8C88AA] p-1 rounded flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#F7F6FC] flex items-center justify-center font-bold text-[8px]">
                        B
                      </span>
                      <span>Fev. para mar.</span>
                    </div>
                    <div className="bg-[#E9E6FF] border border-[#4F3CF0] p-1 rounded flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#4F3CF0] text-white flex items-center justify-center font-bold text-[8px]">
                        C
                      </span>
                      <span>Mar. para abr.</span>
                    </div>
                    <div className="bg-white border border-[#8C88AA] p-1 rounded flex items-center gap-1">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#F7F6FC] flex items-center justify-center font-bold text-[8px]">
                        D
                      </span>
                      <span>Abr. para mai.</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-1 bg-[#4F3CF0] text-white text-[10px] font-bold rounded-full text-center"
                >
                  Próxima
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          9. FAQ SECTION (dúvidas) - Compactado proporcionalmente
          ========================================================================= */}
      <section
        id="duvidas"
        className="py-14 sm:py-16 lg:py-[96px] px-6 sm:px-10 lg:px-[80px] bg-[#F7F6FC] relative overflow-hidden isolate min-h-[740px] flex flex-col items-start justify-center"
      >
        <div className="max-w-[1280px] mx-auto w-full flex flex-col items-start gap-6 lg:gap-9 relative z-10">
          {/* Minhoquinha v6 · interrogação (reduzida um pouco) */}
          <div className="hidden lg:block absolute right-4 xl:right-8 top-[-6px] w-[160px] h-[160px] z-20 pointer-events-none">
            <MascotMinhoquinha size={160} variant="question" />
          </div>
          {/* Header */}
          <div className="flex flex-col items-start gap-3 w-full">
            {/* Pill Badge */}
            <div className="flex flex-row items-center px-3.5 py-1.5 gap-1.5 w-[115px] h-[30px] bg-[#E9E6FF] rounded-full shrink-0">
              <svg
                className="w-3.5 h-3.5 text-[#4F3CF0]"
                viewBox="0 0 14 14"
                fill="currentColor"
              >
                <path d="M7 0.5L8.6 5.4L13.5 7L8.6 8.6L7 13.5L5.4 8.6L0.5 7L5.4 5.4L7 0.5Z" />
              </svg>
              <span className="font-sans font-bold text-[13px] leading-[18px] tracking-[0.08em] text-[#4F3CF0]">
                DÚVIDAS
              </span>
            </div>

            {/* Title */}
            <h2 className="font-display font-extrabold text-[32px] sm:text-[40px] lg:text-[48px] leading-[38px] sm:leading-[46px] lg:leading-[54px] tracking-[-0.025em] text-[#17152E]">
              Perguntas frequentes
            </h2>
          </div>

          {/* FAQ 2-Column Grid - Reduzido um pouco (max-w-[1140px], gap 20px) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 lg:gap-5 w-full max-w-[1140px] items-start">
            {/* Column 1 (gap 12px) */}
            <div className="flex flex-col gap-3 w-full">
              {faqList.slice(0, 3).map((item) => {
                const isActive = activeFaq === item.id
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveFaq(isActive ? null : item.id)}
                    className={`box-border flex flex-col items-start p-4.5 sm:py-4.5 sm:px-5.5 gap-2 w-full min-h-[118px] bg-white rounded-[18px] shadow-[0px_2px_8px_rgba(23,20,46,0.05)] transition-all cursor-pointer ${
                      isActive
                        ? "border-2 border-[#4F3CF0]"
                        : "border border-[#E2DFF1] hover:border-[#4F3CF0]/60"
                    }`}
                  >
                    {/* Header Row: Question + Button */}
                    <div className="flex flex-row items-center justify-between gap-3 w-full">
                      <h3 className="font-sans font-bold text-[16px] sm:text-[17px] leading-[23px] text-[#17152E] flex-1">
                        {item.question}
                      </h3>
                      <button
                        type="button"
                        aria-label={
                          isActive ? "Recolher pergunta" : "Expandir pergunta"
                        }
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 p-1 transition-colors ${
                          isActive
                            ? "bg-[#4F3CF0] text-white"
                            : "bg-[#E9E6FF] text-[#4F3CF0]"
                        }`}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        >
                          {isActive ? (
                            <line x1="3" y1="8" x2="13" y2="8" />
                          ) : (
                            <>
                              <line x1="8" y1="3" x2="8" y2="13" />
                              <line x1="3" y1="8" x2="13" y2="8" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>

                    {/* Answer text */}
                    <p className="font-sans font-normal text-[14px] sm:text-[14.5px] leading-[22px] text-[#5F5B7D] w-full">
                      {item.answer}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Column 2 (gap 12px) */}
            <div className="flex flex-col gap-3 w-full">
              {faqList.slice(3, 6).map((item) => {
                const isActive = activeFaq === item.id
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveFaq(isActive ? null : item.id)}
                    className={`box-border flex flex-col items-start p-4.5 sm:py-4.5 sm:px-5.5 gap-2 w-full min-h-[118px] bg-white rounded-[18px] shadow-[0px_2px_8px_rgba(23,20,46,0.05)] transition-all cursor-pointer ${
                      isActive
                        ? "border-2 border-[#4F3CF0]"
                        : "border border-[#E2DFF1] hover:border-[#4F3CF0]/60"
                    }`}
                  >
                    {/* Header Row: Question + Button */}
                    <div className="flex flex-row items-center justify-between gap-3 w-full">
                      <h3 className="font-sans font-bold text-[16px] sm:text-[17px] leading-[23px] text-[#17152E] flex-1">
                        {item.question}
                      </h3>
                      <button
                        type="button"
                        aria-label={
                          isActive ? "Recolher pergunta" : "Expandir pergunta"
                        }
                        className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 p-1 transition-colors ${
                          isActive
                            ? "bg-[#4F3CF0] text-white"
                            : "bg-[#E9E6FF] text-[#4F3CF0]"
                        }`}
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 16 16"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        >
                          {isActive ? (
                            <line x1="3" y1="8" x2="13" y2="8" />
                          ) : (
                            <>
                              <line x1="8" y1="3" x2="8" y2="13" />
                              <line x1="3" y1="8" x2="13" y2="8" />
                            </>
                          )}
                        </svg>
                      </button>
                    </div>

                    {/* Answer text */}
                    <p className="font-sans font-normal text-[14px] sm:text-[14.5px] leading-[22px] text-[#5F5B7D] w-full">
                      {item.answer}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          10. FINAL CTA SECTION (bloco CTA) - Ajustado (+10%)
          ========================================================================= */}
      <section
        id="cta"
        className="min-h-screen py-12 sm:py-16 lg:py-20 bg-[#F7F6FC] px-4 sm:px-6 lg:px-8 flex items-center justify-center scroll-mt-12"
      >
        <div className="w-full max-w-[1056px] mx-auto flex items-center justify-center">
          {/* bloco CTA (ajustado +10%: 1056px x 584px, padding 72px 66px, gap 20px, bg #17152E, rounded-[36px]) */}
          <div className="w-full bg-[#17152E] text-white rounded-[30px] sm:rounded-[36px] px-6 sm:px-12 lg:px-[66px] py-11 sm:py-14 lg:py-[72px] min-h-[500px] lg:min-h-[584px] text-center relative overflow-hidden isolate flex flex-col items-center justify-center gap-5 shadow-[0px_22px_55px_-8px_rgba(23,20,46,0.3)]">
            {/* Glow Orb 1 - Top left: width 400px, height 400px, blur 70px */}
            <div
              className="absolute w-[400px] h-[400px] left-[-100px] top-[-135px] bg-[rgba(79,60,240,0.7)] blur-[70px] rounded-full pointer-events-none -z-10"
              aria-hidden="true"
            />
            {/* Glow Orb 2 - Bottom right: width 430px, height 430px, blur 75px */}
            <div
              className="absolute w-[430px] h-[430px] right-[-65px] bottom-[-65px] bg-[rgba(79,60,240,0.5)] blur-[75px] rounded-full pointer-events-none -z-10"
              aria-hidden="true"
            />

            {/* Minhoquinha em formato de escadaria (192px, +10%) com olhos fechados e sorriso aberto */}
            <div className="relative z-10 w-[192px] h-[192px] flex items-center justify-center shrink-0">
              {/* Partículas comemorativas da Figma */}
              <span className="absolute left-[12%] top-[16%] w-1.5 h-1.5 rounded-xs bg-[#C6F432] -rotate-20 pointer-events-none" />
              <span className="absolute right-[15%] top-[23%] w-1.5 h-1.5 rounded-xs bg-[#FF6B57] rotate-25 pointer-events-none" />
              <span className="absolute left-[26%] top-[37%] w-1.5 h-1.5 rounded-full bg-[#3CC8F0] pointer-events-none" />
              <span className="absolute right-[12%] top-[48%] w-1.5 h-1.5 rounded-full bg-[#FF6B57] pointer-events-none" />
              <span className="absolute right-[19%] top-[11%] w-1.5 h-1.5 rounded-full bg-[#3CC8F0] pointer-events-none" />

              <MascotMinhoquinha
                size={192}
                variant="stairs"
                mood="joy"
                coilColor="white"
              />
            </div>

            {/* Title: Bora pro ENEM? (+10%: 79px) */}
            <h2 className="font-display font-extrabold text-[40px] sm:text-[52px] md:text-[66px] lg:text-[79px] leading-[44px] sm:leading-[56px] md:leading-[70px] lg:leading-[80px] tracking-[-0.04em] text-white text-center relative z-10 max-w-[550px]">
              Bora pro ENEM?
            </h2>

            {/* Subtitle (+10%: ~17.5px) */}
            <p className="font-sans font-normal text-[15px] sm:text-[16px] lg:text-[17.5px] leading-[24px] sm:leading-[26px] lg:leading-[27px] text-center text-[#E9E6FF] max-w-[530px] relative z-10">
              Crie sua conta, conte seu curso-alvo e receba sua trilha hoje
              mesmo.
            </p>

            {/* Button Group */}
            <div className="relative z-10 pt-1.5 flex flex-col items-center gap-3.5">
              <button
                type="button"
                onClick={() => onNavigate("signup")}
                className="w-auto min-w-[260px] h-[54px] px-8 py-3.5 bg-[#C6F432] hover:bg-[#b5e028] text-[#17152E] rounded-full flex items-center justify-center gap-2.5 shadow-[0_4px_18px_rgba(198,244,50,0.35)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <span className="font-sans font-bold text-[16px] leading-[22px] text-[#17152E] whitespace-nowrap">
                  Criar minha conta
                </span>
                <svg
                  className="w-4.5 h-4.5 text-[#17152E] shrink-0"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 10h12" />
                  <path d="m11 5 5 5-5 5" />
                </svg>
              </button>

              {/* Leva menos de 2 minutos. */}
              <span className="font-sans font-bold text-[13px] leading-[18px] text-[#E9E6FF] text-center">
                Leva menos de 2 minutos.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          11. FOOTER (rodapé) - +10px no início
          ========================================================================= */}
      <footer className="bg-[#17152E] text-[#D9D6EE] pt-[51px] pb-[33px] px-5 md:px-10 lg:px-16 border-t border-white/10 relative overflow-hidden">
        {/* Soft footer ambient glows */}
        <div
          className="absolute w-[290px] h-[290px] top-[30px] -left-[90px] bg-[rgba(79,60,240,0.1)] blur-[55px] rounded-full pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute w-[290px] h-[290px] top-[30px] right-[-90px] bg-[rgba(79,60,240,0.1)] blur-[55px] rounded-full pointer-events-none"
          aria-hidden="true"
        />

        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-6">
            {/* ===============================================================
                LOGO DA MARCA (Footer / Rodapé)
                =============================================================== */}
            <div className="md:col-span-6 flex flex-col items-start gap-2">
              <div className="flex items-center gap-2">
                {/* PARTE 1: Símbolo / Ícone oficial (balão roxo, escadaria branca de 3 degraus, ponto e estrela verde-limão) */}
                <img
                  src={logoMark}
                  alt="EduMentor AI"
                  className="w-7 h-7 object-contain"
                />

                {/* PARTES 2 & 3: Tipografia e Badge */}
                <div className="flex items-center gap-1">
                  {/* PARTE 2: Texto "EduMentor" */}
                  <span className="font-display font-extrabold text-base tracking-tight text-white">
                    EduMentor
                  </span>
                  {/* PARTE 3: Badge com a sigla "AI" */}
                  <span className="bg-[#C6F432] text-[#17152E] font-display font-extrabold text-[9px] px-1 py-0.5 rounded-full tracking-wider leading-none -translate-y-0.5">
                    AI
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#D9D6EE] max-w-xs leading-relaxed">
                Sua trilha até o ENEM, com uma tutora 24h.
              </p>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-6 grid grid-cols-2 gap-4">
              {/* Coluna Produto */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[#C6F432] font-bold text-[10px] uppercase tracking-wider mb-0.5">
                  PRODUTO
                </span>
                <a
                  href="#como-funciona"
                  className="hover:text-white transition-colors text-[11px] sm:text-xs"
                >
                  Como funciona
                </a>
                <a
                  href="#recursos"
                  className="hover:text-white transition-colors text-[11px] sm:text-xs"
                >
                  Recursos
                </a>
                <a
                  href="#mentorina"
                  onClick={scrollToMentorina}
                  className="hover:text-white transition-colors text-[11px] sm:text-xs cursor-pointer"
                >
                  Mentorina
                </a>
                <a
                  href="#recursos"
                  className="hover:text-white transition-colors text-[11px] sm:text-xs"
                >
                  Simulados
                </a>
                <a
                  href="#recursos"
                  className="hover:text-white transition-colors text-[11px] sm:text-xs"
                >
                  Redação
                </a>
              </div>

              {/* Coluna Ajuda */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[#C6F432] font-bold text-[10px] uppercase tracking-wider mb-0.5">
                  AJUDA
                </span>
                <a
                  href="#duvidas"
                  className="hover:text-white transition-colors text-[11px] sm:text-xs"
                >
                  Dúvidas
                </a>
                <button
                  type="button"
                  onClick={() => alert("Suporte: contato@edumentor.ai")}
                  className="text-left hover:text-white transition-colors text-[11px] sm:text-xs cursor-pointer"
                >
                  Fale com o suporte
                </button>
                <button
                  type="button"
                  onClick={() =>
                    alert("Termos de uso da plataforma EduMentor AI.")
                  }
                  className="text-left hover:text-white transition-colors text-[11px] sm:text-xs cursor-pointer"
                >
                  Termos de uso
                </button>
                <button
                  type="button"
                  onClick={() =>
                    alert("Política de privacidade e proteção de dados LGPD.")
                  }
                  className="text-left hover:text-white transition-colors text-[11px] sm:text-xs cursor-pointer"
                >
                  Privacidade
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-[#ABA7C8]">
            <div>© 2026 EduMentor AI · EdTech Futuro do Saber</div>
            <div>Feito com sabedoria para quem vai prestar o ENEM</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
