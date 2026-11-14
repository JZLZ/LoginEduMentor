import { useState, useEffect, useMemo } from "react"
import { authApi, onboardingApi, tokenStorage } from "../services/api"
import {
  MODULES_DATA,
  type SubmoduleItem,
  type SubmoduleQuestion,
} from "../data/modulesData"
import TermsModal from "../TermsModal"
import MentorinaChat from "./MentorinaChat"
import enemDevApi, { type EnemQuestion } from "../services/enemDevApi"
import {
  validatePassword,
  recordPreviousPassword,
  getStoredPreviousPassword,
} from "../utils/passwordValidation"

interface DashboardProps {
  go: (screen: any) => void
  onSessionExpired: () => void
  userName?: string
  userEmail?: string
  startMode?: "nivelamento" | "materias"
  targetCourse?: string
}

type TabType = "inicio" | "trilha" | "simulados" | "redacao" | "perfil"

export interface EssayHistoryItem {
  id: string
  theme: string
  date: string
  score: number
  status: "Corrigida" | "Em correção"
  wordsCount?: number
  linesCount?: number
  competencies: {
    c1: number
    c2: number
    c3: number
    c4: number
    c5: number
  }
  feedback: {
    c1Feedback: string
    c2Feedback: string
    c3Feedback: string
    c4Feedback: string
    c5Feedback: string
    strengths: string[]
    improvements: string[]
    generalComment: string
  }
  text: string
}

const DEFAULT_ESSAY_HISTORY: EssayHistoryItem[] = [
  {
    id: "redacao-1",
    theme:
      "Desafios para a valorização de comunidades e povos tradicionais no Brasil",
    date: "28 de Outubro de 2026",
    score: 760,
    status: "Corrigida",
    wordsCount: 420,
    linesCount: 30,
    competencies: {
      c1: 160,
      c2: 160,
      c3: 140,
      c4: 160,
      c5: 140,
    },
    feedback: {
      c1Feedback:
        "Excelente domínio da norma padrão. Foram identificados apenas dois desvios pontuais de concordância e pontuação entre orações subordinadas no D1.",
      c2Feedback:
        "Compreensão perfeita da proposta temática. Repertório legitimado com citação de Darcy Ribeiro ('O Povo Brasileiro') e da Constituição Federal de 1988 com total produtividade.",
      c3Feedback:
        "Projeto de texto muito bem articulado, com tese clara, argumentos consistentes e encadeamento progressivo dos pontos de vista.",
      c4Feedback:
        "Estrutura coesiva diversificada interparágrafos. Atenção no interior do D2 para evitar repetição próxima de operadores argumentativos adversativos.",
      c5Feedback:
        "Proposta de intervenção completa e exemplar, contemplando agente (Ministério dos Povos Indígenas), ação, meio/modo, efeito e detalhamento específico.",
      strengths: [
        "Tese clara e bem defendida.",
        "Bom uso de dados (CNPq) para sustentar o argumento.",
      ],
      improvements: [
        "C3: os argumentos do D2 ficaram meio soltos no final do parágrafo.",
        "C5: a proposta pode ter um detalhamento da ação para ficar 100%.",
      ],
      generalComment:
        "Excelente trabalho! Sua redação demonstra maturidade argumentativa e domínio dos critérios do ENEM. Ajustando os detalhes de pontuação e coesão, a nota 1000 está ao seu alcance!",
    },
    text: `Historicamente, a formação social e cultural brasileira foi enriquecida pelas práticas, saberes e tradições dos povos originários e comunidades tradicionais. Não obstante, na contemporaneidade, esses grupos enfrentam constantes desafios para terem sua identidade reconhecida e seus direitos territoriais assegurados. Nesse contexto, destacam-se a invisibilidade social promovida pelo descaso estatal e a pressão exercida pelo avanço predatório de atividades econômicas sobre territórios tradicionais. Desse modo, torna-se imperativo desarticular esse cenário para garantir a cidadania plena dessas populações.

Em primeira análise, cabe pontuar a omissão governamental no que tange à garantia dos direitos básicos previstos na Carta Magna de 1988. Segundo o antropólogo Darcy Ribeiro, o Brasil é marcado por uma "matriz multicultural", fruto da confluência de matrizes indígenas e afro-brasileiras. Todavia, a ausência de políticas públicas efetivas de demarcação e preservação territorial perpetua um processo histórico de apagamento. Assim, a falta de titulação oficial vulnerabiliza essas comunidades diante de invasões e especulações fundiárias.

Ademais, a expansão de atividades extrativas e agropecuárias sem a devida fiscalização intensifica a degradação ambiental e os conflitos sociais. Sob a ótica do sociólogo Zygmunt Bauman, a sociedade contemporânea tende a priorizar o lucro imediato em detrimento da dignidade humana. Dessa maneira, líderes comunitários sofrem ameaças e têm suas práticas sustentáveis desvalorizadas, o que desestrutura os modos de vida tradicionais e enfraquece a biodiversidade dos biomas protegidos por esses povos.

Portanto, medidas urgentes são necessárias para reverter esse quadro. Para tanto, cabe ao Ministério dos Povos Indígenas, em parceria com o Ministério da Justiça e Segurança Pública, intensificar a fiscalização e a homologação de territórios tradicionais, por meio do aumento do contingente de agentes da Funai e do Ibama nas áreas de conflito, a fim de garantir a segurança e a integridade cultural desses grupos. Outrossim, o Ministério da Educação deve promover campanhas pedagógicas em escolas públicas para valorizar esses saberes ancestrais. Feito isso, o Brasil caminhará rumo a uma cidadania verdadeiramente inclusiva.`,
  },
  {
    id: "redacao-2",
    theme:
      "Invisibilidade e registro civil: garantia de acesso à cidadania no Brasil",
    date: "14 de Outubro de 2026",
    score: 680,
    status: "Corrigida",
    wordsCount: 395,
    linesCount: 28,
    competencies: {
      c1: 120,
      c2: 160,
      c3: 120,
      c4: 140,
      c5: 140,
    },
    feedback: {
      c1Feedback:
        "Bom domínio da linguagem culta formal, com poucos desvios gramaticais de concordância.",
      c2Feedback:
        "Tema abordado de maneira ampla e consistente. Sugere-se aprofundar a relação entre o documento e os direitos fundamentais.",
      c3Feedback:
        "Argumentação consistente e coerente ao longo de todo o texto com projeto de texto claro.",
      c4Feedback:
        "Excelente uso de conectivos inter e intraparágrafos sem repetições viciosas.",
      c5Feedback:
        "Proposta de intervenção muito bem estruturada com todos os 5 elementos exigidos no ENEM.",
      strengths: [
        "Excelente repertório conectivo e coesão textual",
        "Proposta de intervenção completa e viável com Defensoria Pública",
      ],
      improvements: [
        "Aprofundar os dados e repertório sociológico no primeiro desenvolvimento",
        "Evitar generalizações sobre a atuação dos cartórios locais",
      ],
      generalComment:
        "Ótima redação! O texto é muito fluído e agradável de ler. Aprofundar o repertório sociológico no D1 elevará ainda mais a sua nota.",
    },
    text: `Na clássica obra "Cidadãos de Papel", o jornalista Gilberto Dimenstein denuncia a existência de direitos assegurados pela legislação brasileira que não se concretizam no cotidiano da população. Analogamente a essa crítica, a ausência de registro civil no Brasil priva milhares de indivíduos do acesso a prerrogativas fundamentais, configurando uma grave barreira à cidadania plena. Dessa forma, a negligência burocrática e a desigualdade socioespacial sustentam esse quadro excludente, demandando transformações imediatas.

De início, convém ressaltar que a certidão de nascimento representa a chave inaugural para o exercício de direitos civis, políticos e sociais. Sem ela, torna-se inviável emitir documentos como o RG, matricular-se na rede pública de ensino ou usufruir de programas sociais de transferência de renda. Consoante o filósofo Thomas Marshall, a cidadania só é integral quando os direitos sociais são plenamente efetivados. Logo, a ausência documental gera a invisibilidade do indivíduo perante o Estado, perpetuando o ciclo da miséria e da marginalização.

Outrossim, as barreiras geográficas e informacionais nas regiões interioranas e periféricas agravam a carência de registros. Muitas famílias em situação de vulnerabilidade desconhecem a gratuidade do primeiro registro de nascimento, garantida por lei federal, ou encontram cartórios distantes de suas residências, sem transporte acessível. Consequentemente, gerações inteiras permanecem desprovidas de identificação civil oficial, distanciando o país dos preceitos de dignidade estabelecidos na Declaração Universal dos Direitos Humanos.

Infere-se, portanto, a necessidade de ações estratégicas para erradicar o sub-registro no Brasil. Urge que o Ministério dos Direitos Humanos e da Cidadania, em cooperação com as prefeituras municipais e a Defensoria Pública, amplie mutirões itinerantes de emissão de certidões em áreas periféricas, rurais e ribeirinhas, mediante o envio de unidades móveis equipadas e com atendimento humanizado e gratuito. Ademais, campanhas informativas em rádio e televisão aberta devem elucidar a importância do registro. Com essas medidas, a garantia da cidadania deixará de ser apenas papel e se tornará realidade para todos os brasileiros.`,
  },
]

const DEFAULT_MODEL_ESSAY = `Historicamente, a formação social e cultural brasileira foi enriquecida pelas práticas, saberes e tradições dos povos originários e comunidades tradicionais. Não obstante, na contemporaneidade, esses grupos enfrentam constantes desafios para terem sua identidade reconhecida e seus direitos territoriais assegurados. Nesse contexto, destacam-se a invisibilidade social promovida pelo descaso estatal e a pressão exercida pelo avanço predatório de atividades econômicas sobre territórios tradicionais. Desse modo, torna-se imperativo desarticular esse cenário para garantir a cidadania plena dessas populações.

Em primeira análise, cabe pontuar a omissão governamental no que tange à garantia dos direitos básicos previstos na Carta Magna de 1988. Segundo o antropólogo Darcy Ribeiro, o Brasil é marcado por uma "matriz multicultural", fruto da confluência de matrizes indígenas e afro-brasileiras. Todavia, a ausência de políticas públicas efetivas de demarcação e preservação territorial perpetua um processo histórico de apagamento. Assim, a falta de titulação oficial vulnerabiliza essas comunidades diante de invasões e especulações fundiárias.

Ademais, a expansão de atividades extrativas e agropecuárias sem a devida fiscalização intensifica a degradação ambiental e os conflitos sociais. Sob a ótica do sociólogo Zygmunt Bauman, a sociedade contemporânea tende a priorizar o lucro imediato em detrimento da dignidade humana. Dessa maneira, líderes comunitários sofrem ameaças e têm suas práticas sustentáveis desvalorizadas, o que desestrutura os modos de vida tradicionais e enfraquece a biodiversidade dos biomas protegidos por esses povos.

Portanto, medidas urgentes são necessárias para reverter esse quadro. Para tanto, cabe ao Ministério dos Povos Indígenas, em parceria com o Ministério da Justiça e Segurança Pública, intensificar a fiscalização e a homologação de territórios tradicionais, por meio do aumento do contingente de agentes da Funai e do Ibama nas áreas de conflito, a fim de garantir a segurança e a integridade cultural desses grupos. Outrossim, o Ministério da Educação deve promover campanhas pedagógicas em escolas públicas para valorizar esses saberes ancestrais. Feito isso, o Brasil caminhará rumo a uma cidadania verdadeiramente inclusiva.`

function getInitialUserName(): string {
  try {
    const stored = localStorage.getItem("sherlock_user_name")
    if (stored && stored.trim()) return stored.trim()

    const full = localStorage.getItem("sherlock_user_fullname")
    if (full && full.trim()) return full.trim().split(" ")[0]

    const user = tokenStorage.getUser() as any
    if (user) {
      const name =
        user.name ||
        user.nome ||
        user.fullName ||
        user.nomeCompleto ||
        user.given_name
      if (name && typeof name === "string" && name.trim()) {
        return name.trim().split(" ")[0]
      }
    }

    const email = localStorage.getItem("sherlock_user_email")
    if (email && email.includes("@")) {
      const prefix = email.split("@")[0].split(/[._-]/)[0]
      if (prefix) return prefix.charAt(0).toUpperCase() + prefix.slice(1)
    }

    const remembered = localStorage.getItem("sherlock_remembered_login")
    if (remembered) {
      const parsed = JSON.parse(remembered)
      if (parsed.email && parsed.email.includes("@")) {
        const prefix = parsed.email.split("@")[0].split(/[._-]/)[0]
        if (prefix) return prefix.charAt(0).toUpperCase() + prefix.slice(1)
      }
    }
  } catch {
    // ignore
  }
  return "Gabriel"
}

function getInitialUserEmail(): string {
  try {
    const email = localStorage.getItem("sherlock_user_email")
    if (email && email.trim()) return email.trim()

    const user = tokenStorage.getUser() as any
    if (user?.email) return user.email

    const remembered = localStorage.getItem("sherlock_remembered_login")
    if (remembered) {
      const parsed = JSON.parse(remembered)
      if (parsed.email) return parsed.email
    }
  } catch {
    // ignore
  }
  return "aluno@edumentor.ai"
}

function getInitialUserFullName(fallbackFirstName: string): string {
  try {
    const full = localStorage.getItem("sherlock_user_fullname")
    if (full && full.trim()) return full.trim()
    const stored = localStorage.getItem("sherlock_user_name")
    if (stored && stored.trim()) return stored.trim()
  } catch {
    // ignore
  }
  return fallbackFirstName
}

function getInitialStartMode(
  propMode?: "nivelamento" | "materias",
): "nivelamento" | "materias" {
  try {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const param = urlParams.get("mode") || urlParams.get("start_mode")
      if (param === "materias" || param === "nivelamento") return param
      const stored = localStorage.getItem("sherlock_start_mode")
      if (stored === "materias" || stored === "nivelamento") return stored
    }
  } catch {
    // ignore
  }
  return propMode || "nivelamento"
}

function getInitialPrioritySubjects(): [string, string] {
  try {
    const raw = localStorage.getItem("sherlock_selected_subjects")
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const sub1 = parsed[0] || "Matemática"
        const sub2 =
          parsed[1] ||
          (sub1.toLowerCase().includes("matemática")
            ? "Natureza"
            : "Matemática")
        return [sub1, sub2]
      }
    }
  } catch {
    // ignore
  }
  return ["Matemática", "Natureza"]
}

function getInitialTargetCourse(propCourse?: string): string {
  if (propCourse && propCourse.trim()) return propCourse.trim()
  try {
    const stored = localStorage.getItem("sherlock_target_course_name")
    if (stored && stored.trim()) return stored.trim()
  } catch {
    // ignore
  }
  return "Medicina"
}

function formatFeedbackDate(dateStr?: string): string {
  if (!dateStr || dateStr.toLowerCase().includes("hoje")) {
    const now = new Date()
    const d = String(now.getDate()).padStart(2, "0")
    const m = String(now.getMonth() + 1).padStart(2, "0")
    return `${d}/${m}`
  }
  const monthMap: Record<string, string> = {
    janeiro: "01",
    fevereiro: "02",
    março: "03",
    marco: "03",
    abril: "04",
    maio: "05",
    junho: "06",
    julho: "07",
    agosto: "08",
    setembro: "09",
    outubro: "10",
    novembro: "11",
    dezembro: "12",
  }
  const match = dateStr.match(/(\d{1,2})\s+de\s+([a-zA-ZçÇ]+)/i)
  if (match) {
    const day = match[1].padStart(2, "0")
    const month = monthMap[match[2].toLowerCase()] || "10"
    return `${day}/${month}`
  }
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/")
    if (parts.length >= 2) {
      return `${parts[0].padStart(2, "0")}/${parts[1].padStart(2, "0")}`
    }
  }
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-")
    if (parts.length === 3 && parts[0].length === 4) {
      return `${parts[2].padStart(2, "0")}/${parts[1].padStart(2, "0")}`
    }
  }
  return "28/10"
}

export interface ExamResultData {
  id: string
  title: string
  totalQuestions: number
  correctCount: number
  percent: number
  timeSpent: string
  avgTimePerQuestion: string
  triScore: number
  triMessage: string
  blankCount: number
  blankPercent: number
  date: string
}

interface ExamSimuladoQuestion {
  index: number
  year: number
  discipline: string
  badge: string
  context: string
  intro: string
  alternatives: { letter: string; text: string }[]
  correct: string
}

const SIMULADO_90_QUESTIONS: ExamSimuladoQuestion[] = Array.from(
  { length: 90 },
  (_, i) => {
    if (i === 7) {
      // Questão 08 do Simulado (ENEM 2023 - Questão 141 - Tintas conforme SVG oficial)
      return {
        index: 8,
        year: 2023,
        discipline: "Matemática",
        badge: "QUESTÃO 08 · ENEM 2023",
        context:
          "Uma loja de tintas vende galões cilíndricos com capacidade de 3,6 litros e latas menores com capacidade de 900 mililitros. Um cliente calculou que necessita de exatamente 16,2 litros de tinta para pintar toda a sua residência.\n\nPara minimizar o custo e não haver sobra de tinta, quantas embalagens de cada tipo ele deve adquirir se o galão custa R$ 80,00 e a lata pequena custa R$ 25,00?",
        intro: "A melhor combinação de compra é:",
        alternatives: [
          { letter: "A", text: "5 galões de 3,6 L." },
          { letter: "B", text: "18 latas de 900 mL." },
          { letter: "C", text: "4 galões de 3,6 L e 2 latas de 900 mL." },
          { letter: "D", text: "3 galões de 3,6 L e 6 latas de 900 mL." },
          { letter: "E", text: "2 galões de 3,6 L e 10 latas de 900 mL." },
        ],
        correct: "C",
      }
    }

    const questionPool = [
      {
        discipline: "Matemática",
        context:
          "Um arquiteto está projetando uma praça circular e necessita calcular a área destinada ao gramado central. O diâmetro total da praça mede 40 metros, e haverá uma pista de caminhada perimetral de 2 metros de largura contornando todo o gramado.\n\nConsiderando a aproximação de π = 3,14, qual será a área total destinada exclusivamente ao gramado?",
        intro: "A área do gramado central da praça mede, aproximadamente:",
        alternatives: [
          { letter: "A", text: "1.017,36 m²." },
          { letter: "B", text: "1.256,00 m²." },
          { letter: "C", text: "961,62 m²." },
          { letter: "D", text: "1.133,54 m²." },
          { letter: "E", text: "854,20 m²." },
        ],
        correct: "A",
      },
      {
        discipline: "Ciências da Natureza",
        context:
          "Os biocombustíveis são fontes de energia renovável obtidas a partir de biomassa orgânica. O etanol de cana-de-açúcar é considerado um biocombustível de alta eficiência energética quando comparado a combustíveis fósseis derivados do petróleo.\n\nSob o ponto de vista do ciclo global do carbono, a principal vantagem ambiental do uso do etanol em substituição à gasolina decorre do fato de que:",
        intro:
          "Assinale a alternativa que apresenta a justificativa ambiental correta:",
        alternatives: [
          {
            letter: "A",
            text: "sua queima não produz dióxido de carbono nem vapor de água na atmosfera.",
          },
          {
            letter: "B",
            text: "o dióxido de carbono liberado na queima foi previamente absorvido pela cana na fotossíntese.",
          },
          {
            letter: "C",
            text: "sua combustão é exclusivamente incompleta, gerando menor calor para o efeito estufa.",
          },
          {
            letter: "D",
            text: "ele elimina a formação de material particulado em qualquer motor veicular.",
          },
          {
            letter: "E",
            text: "sua produção independe do consumo de água doce nos processos de moagem.",
          },
        ],
        correct: "B",
      },
      {
        discipline: "Ciências Humanas",
        context:
          "No contexto da Revolução Industrial iniciada na Inglaterra no século XVIII, a introdução das máquinas a vapor e o regime fabril alteraram profundamente a percepção do tempo pelos trabalhadores.\n\nAnteriormente guiado pelos ciclos naturais do dia e das estações agrícolas, o ritmo de vida passou a ser rigorosamente cronometrado pelo apito da fábrica e pelos relógios mecânicos.",
        intro: "A mudança social descrita no texto expressa:",
        alternatives: [
          {
            letter: "A",
            text: "a valorização das tradições camponesas no ambiente urbano.",
          },
          {
            letter: "B",
            text: "o aumento do tempo livre destinado ao lazer da classe operária.",
          },
          {
            letter: "C",
            text: "a manutenção do controle autônomo dos artesãos sobre sua produção.",
          },
          {
            letter: "D",
            text: "a subordinação da força de trabalho à disciplina fabril e à produtividade.",
          },
          {
            letter: "E",
            text: "o declínio dos conflitos sindicais diante da modernização tecnológica.",
          },
        ],
        correct: "D",
      },
      {
        discipline: "Linguagens",
        context:
          "A linguagem da internet, conhecida popularmente como 'internetês', caracteriza-se pelo uso de abreviações, emojis, memes e ausência frequente de pontuações formais em mensagens instantâneas.\n\nLinguistas contemporâneos têm demonstrado que esse fenômeno não representa a degradação da língua portuguesa, mas sim uma variação estilística adaptada à rapidez e dinamicidade dos canais digitais.",
        intro: "De acordo com a perspectiva linguística expressa no texto:",
        alternatives: [
          {
            letter: "A",
            text: "a língua se adapta funcionalmente às necessidades comunicativas de seus usuários.",
          },
          {
            letter: "B",
            text: "o uso da norma padrão torna-se obsoleto e dispensável em todas as situações sociais.",
          },
          {
            letter: "C",
            text: "a gramática tradicional deve ser reformada para adotar exclusivamente o internetês.",
          },
          {
            letter: "D",
            text: "a comunicação digital empobrece o vocabulário e a capacidade interpretativa.",
          },
          {
            letter: "E",
            text: "as abreviações decorrem unicamente de limitações técnicas dos teclados de smartphones.",
          },
        ],
        correct: "A",
      },
    ]

    const item = questionPool[i % questionPool.length]
    return {
      index: i + 1,
      year: 2023,
      discipline: item.discipline,
      badge: `QUESTÃO ${String(i + 1).padStart(2, "0")} · ENEM 2023`,
      context: item.context,
      intro: item.intro,
      alternatives: item.alternatives,
      correct: item.correct,
    }
  },
)

export default function Dashboard({
  go,
  onSessionExpired,
  userName: propUserName,
  userEmail: propUserEmail,
  startMode: propStartMode,
  targetCourse: propTargetCourse,
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("inicio")
  const [isMentorinaChatOpen, setIsMentorinaChatOpen] = useState(false)
  const [mentorinaActiveQuestion, setMentorinaActiveQuestion] =
    useState<EnemQuestion | undefined>(undefined)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userName, setUserName] = useState<string>(
    () => propUserName || getInitialUserName(),
  )
  const [userFullName, setUserFullName] = useState<string>(() =>
    getInitialUserFullName(propUserName || getInitialUserName()),
  )
  const [userEmail, setUserEmail] = useState<string>(
    () => propUserEmail || getInitialUserEmail(),
  )
  const [startMode, setStartMode] = useState<"nivelamento" | "materias">(() =>
    getInitialStartMode(propStartMode),
  )
  const [targetCourse, setTargetCourse] = useState<string>(() =>
    getInitialTargetCourse(propTargetCourse),
  )
  const [prioritySubjects, setPrioritySubjects] = useState<[string, string]>(
    () => getInitialPrioritySubjects(),
  )
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [selectedSubmodule, setSelectedSubmodule] = useState<number>(2)
  const [moduleCompleted, setModuleCompleted] = useState<boolean>(false)
  const [completedTopics, setCompletedTopics] =
    useState<Record<string, boolean>>({})
  const [completedQuestions, setCompletedQuestions] =
    useState<Record<string, boolean>>({})
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState<boolean>(false)
  const [questionResults, setQuestionResults] =
    useState<Record<string, "acertei" | "errei">>({})
  const [selectedAnswers, setSelectedAnswers] =
    useState<Record<string, number>>({})
  const [activeQuestionModal, setActiveQuestionModal] =
    useState<SubmoduleQuestion | null>(null)
  const [foreignLang, setForeignLang] = useState<"Inglês" | "Espanhol">(() => {
    try {
      const saved = localStorage.getItem("sherlock_foreign_lang")
      if (saved === "Espanhol" || saved === "Inglês") return saved
    } catch {
      // ignore
    }
    return "Inglês"
  })

  const toggleForeignLang = () => {
    setForeignLang((prev) => {
      const next = prev === "Inglês" ? "Espanhol" : "Inglês"
      try {
        localStorage.setItem("sherlock_foreign_lang", next)
      } catch {
        // ignore
      }
      return next
    })
  }

  const [essayHistory, setEssayHistory] = useState<EssayHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("sherlock_essay_history")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // ignore
    }
    return DEFAULT_ESSAY_HISTORY
  })
  const [selectedEssayFeedback, setSelectedEssayFeedback] =
    useState<EssayHistoryItem | null>(null)
  const [isWritingEssay, setIsWritingEssay] = useState<boolean>(false)
  const [newEssayTheme, setNewEssayTheme] = useState<string>(
    "Desafios para a valorização de comunidades e povos tradicionais no Brasil",
  )
  const [newEssayText, setNewEssayText] = useState<string>(() => {
    try {
      const stored = localStorage.getItem("sherlock_essay_draft")
      if (stored !== null) return stored
    } catch {
      // ignore
    }
    return ""
  })
  const [essaySeconds, setEssaySeconds] = useState<number>(() => {
    try {
      const stored = localStorage.getItem("sherlock_essay_seconds")
      if (stored !== null) {
        const parsed = parseInt(stored, 10)
        if (!isNaN(parsed) && parsed >= 0) return parsed
      }
    } catch {
      // ignore
    }
    return 4360 // 01:12:40 (padrão)
  })
  const [openMotivatorIndex, setOpenMotivatorIndex] = useState<number | null>(
    null,
  )

  // Estados para Simulado em Execução (Modo Prova - Simulado Completo / Mini / Por Área)
  const [activeExam, setActiveExam] = useState<null | {
    id: string
    title: string
    totalQuestions: number
  }>(null)
  const [examQuestionIndex, setExamQuestionIndex] = useState<number>(0) // Inicia na Questão 01
  const [examAnswers, setExamAnswers] = useState<Record<number, string>>({}) // Inicia vazio (todas em branco)
  const [examSecondsLeft, setExamSecondsLeft] = useState<number>(19800) // 5h 30m (19800s)
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false)
  const [examDelivered, setExamDelivered] = useState<boolean>(false)
  const [selectedExamResult, setSelectedExamResult] =
    useState<ExamResultData | null>(null)
  const [isViewingAnswerKey, setIsViewingAnswerKey] = useState<boolean>(false)
  const [selectedGabaritoIndex, setSelectedGabaritoIndex] = useState<number>(7) // Questão 08 padrão
  const [gabaritoFilter, setGabaritoFilter] =
    useState<"todas" | "erros" | "acertos">("todas")

  // Timer countdown durante o Simulado
  useEffect(() => {
    if (!activeExam || examDelivered) return
    const interval = setInterval(() => {
      setExamSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [activeExam, examDelivered])

  const formatExamTimer = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600)
    const m = Math.floor((totalSecs % 3600) / 60)
    const s = totalSecs % 60
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${pad(h)}:${pad(m)}:${pad(s)}`
  }

  const handleDeliverExam = () => {
    const answeredCount = Object.keys(examAnswers).length
    const total = activeExam?.totalQuestions || 90

    let correctCount = 74
    let percent = 82
    let blankCount = 16
    let blankPercent = 18
    let triScore = 784
    let triMessage = "Acima da nota de corte de Medicina"
    let timeSpent = "4:47:42"
    let avgTimePerQuestion = "Média de 3m 11s por questão"

    if (activeExam?.id === "mini") {
      correctCount = 14
      percent = 70
      blankCount = 0
      blankPercent = 0
      triScore = 710
      triMessage = "Dentro do esperado para Matemática"
      timeSpent = "42:12"
      avgTimePerQuestion = "Média de 2m 06s por questão"
    } else if (activeExam?.id === "area") {
      correctCount = 29
      percent = 64
      blankCount = 16
      blankPercent = 36
      triScore = 745
      triMessage = "Acima da média de Ciências da Natureza"
      timeSpent = "02:15:40"
      avgTimePerQuestion = "Média de 3m 00s por questão"
    }

    if (answeredCount > 0) {
      let actualCorrect = 0
      Object.entries(examAnswers).forEach(([qIdx, ans]) => {
        const q = SIMULADO_90_QUESTIONS[Number(qIdx)]
        if (q && q.correct === ans) {
          actualCorrect++
        }
      })
      correctCount = actualCorrect
      percent = Math.round((correctCount / total) * 100)
      blankCount = total - answeredCount
      blankPercent = Math.round((blankCount / total) * 100)

      const timeSpentSecs = 19800 - examSecondsLeft
      if (timeSpentSecs > 10) {
        const h = Math.floor(timeSpentSecs / 3600)
        const m = Math.floor((timeSpentSecs % 3600) / 60)
        const s = timeSpentSecs % 60
        const pad = (n: number) => n.toString().padStart(2, "0")
        timeSpent = `${pad(h)}:${pad(m)}:${pad(s)}`
        const avgSecs = Math.round(timeSpentSecs / (answeredCount || 1))
        const avgM = Math.floor(avgSecs / 60)
        const avgS = avgSecs % 60
        avgTimePerQuestion = `Média de ${avgM}m ${avgS}s por questão`
      }
      triScore = Math.round(450 + (actualCorrect / total) * 450)
      triMessage =
        triScore >= 750
          ? "Acima da nota de corte de Medicina"
          : "Dentro da média geral nacional"
    }

    setSelectedExamResult({
      id: activeExam?.id || "completo",
      title: activeExam?.title || "Simulado Completo",
      totalQuestions: total,
      correctCount,
      percent,
      timeSpent,
      avgTimePerQuestion,
      triScore,
      triMessage,
      blankCount,
      blankPercent,
      date: "24 de Outubro",
    })

    setActiveExam(null)
    setExamDelivered(false)
    setShowSubmitModal(false)
    setIsViewingAnswerKey(false)
    setActiveTab("simulados")
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Timer countdown durante a escrita da redação
  useEffect(() => {
    if (!isWritingEssay) return
    const interval = setInterval(() => {
      setEssaySeconds((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [isWritingEssay])

  // Salva automaticamente o rascunho em tempo real
  useEffect(() => {
    try {
      if (newEssayText) {
        localStorage.setItem("sherlock_essay_draft", newEssayText)
      } else {
        localStorage.removeItem("sherlock_essay_draft")
      }
    } catch {
      // ignore
    }
  }, [newEssayText])

  // Salva automaticamente o tempo restante do cronômetro em tempo real
  useEffect(() => {
    if (!isWritingEssay) return
    try {
      localStorage.setItem("sherlock_essay_seconds", essaySeconds.toString())
    } catch {
      // ignore
    }
  }, [isWritingEssay, essaySeconds])

  const formatTimer = (totalSecs: number) => {
    const h = Math.floor(totalSecs / 3600)
    const m = Math.floor((totalSecs % 3600) / 60)
    const s = totalSecs % 60
    const pad = (n: number) => n.toString().padStart(2, "0")
    return `${pad(h)}:${pad(m)}:${pad(s)}`
  }

  const computedLinesCount = useMemo(() => {
    if (!newEssayText.trim()) return 0
    const paragraphs = newEssayText.split("\n")
    let total = 0
    for (const p of paragraphs) {
      if (p.length === 0) {
        total += 1
      } else {
        total += Math.max(1, Math.ceil(p.length / 72))
      }
    }
    return total
  }, [newEssayText])

  const computedWordsCount = useMemo(() => {
    return newEssayText.trim() ? newEssayText.trim().split(/\s+/).length : 0
  }, [newEssayText])

  const computedParagraphsCount = useMemo(() => {
    return newEssayText
      ? newEssayText.split("\n").filter((p) => p.trim().length > 0).length
      : 0
  }, [newEssayText])

  const essayStructureStatus = useMemo(() => {
    const rawParagraphs = newEssayText
      .split("\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0)
    const count = rawParagraphs.length

    return {
      intro: count > 1 || (count === 1 && rawParagraphs[0].length >= 20),
      dev1: count > 2 || (count === 2 && rawParagraphs[1].length >= 20),
      dev2: count > 3 || (count === 3 && rawParagraphs[2].length >= 20),
      concl: count >= 4 && rawParagraphs[3].length >= 20,
    }
  }, [newEssayText])

  const handleSendEssayForCorrection = () => {
    const words = newEssayText.trim()
      ? newEssayText.trim().split(/\s+/).length
      : 0
    const lines = computedLinesCount || 30
    const textToSubmit = newEssayText.trim() || DEFAULT_MODEL_ESSAY

    const newSubmittedEssay: EssayHistoryItem = {
      id: `redacao-${Date.now()}`,
      theme: newEssayTheme,
      date: "Hoje",
      score: 960,
      status: "Corrigida",
      wordsCount: words || 420,
      linesCount: Math.min(Math.max(lines, 28), 30),
      competencies: {
        c1: 190,
        c2: 200,
        c3: 190,
        c4: 190,
        c5: 190,
      },
      feedback: {
        c1Feedback:
          "Excelente domínio da modalidade culta formal, vocabulário refinado e precisão sintática exemplar.",
        c2Feedback:
          "Compreensão aprofundada da proposta com repertório legitimado e produtivo (Constituição Federal de 1988 e Darcy Ribeiro).",
        c3Feedback:
          "Projeto de texto consistente, com progressão temática contínua e argumentos sólidos.",
        c4Feedback:
          "Mecanismos coesivos intra e interparágrafos bem empregados, garantindo fluidez estrutural.",
        c5Feedback:
          "Proposta de intervenção completa, com agente, ação, meio, efeito e detalhamento em conformidade com os direitos humanos.",
        strengths: [
          "Articulação brilhante entre a base constitucional e o pensamento antropológico de Darcy Ribeiro",
          "Proposta de intervenção social com os 5 elementos completos e detalhados",
          "Excelente vocabulário e domínio da norma culta padrão",
        ],
        improvements: [
          "Aprofundar dados demográficos do IBGE para fortalecer ainda mais o segundo parágrafo de desenvolvimento",
        ],
        generalComment:
          "Parabéns! Sua redação atingiu um patamar excepcional (960 pontos), demonstrando grande domínio das 5 competências avaliadas no ENEM.",
      },
      text: textToSubmit,
    }

    const updatedHistory = [newSubmittedEssay, ...essayHistory]
    setEssayHistory(updatedHistory)
    try {
      localStorage.setItem(
        "sherlock_essay_history",
        JSON.stringify(updatedHistory),
      )
      localStorage.removeItem("sherlock_essay_draft")
      localStorage.removeItem("sherlock_essay_seconds")
    } catch {
      // ignore
    }
    setIsWritingEssay(false)
    setNewEssayText("")
    setEssaySeconds(4360)
    setSelectedEssayFeedback(newSubmittedEssay)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  interface TrackSubject {
    id: string
    name: string
    status: string
    progress: number
    isCurrent: boolean
    topicsCount: number
  }

  const initialTrackSubjects: TrackSubject[] = [
    {
      id: "matematica",
      name: "Matemática",
      status: "Em andamento · 12 de 32 tópicos",
      progress: 38,
      isCurrent: true,
      topicsCount: 32,
    },
    {
      id: "natureza",
      name: "Ciências da Natureza",
      status: "Não iniciada · 32 tópicos · Libera após Matemática",
      progress: 0,
      isCurrent: false,
      topicsCount: 32,
    },
    {
      id: "linguagens",
      name: "Linguagens",
      status: "Não iniciada · 24 tópicos · Libera após Natureza",
      progress: 0,
      isCurrent: false,
      topicsCount: 24,
    },
  ]

  const catalogSubjects: TrackSubject[] = [
    ...initialTrackSubjects,
    {
      id: "humanas",
      name: "Ciências Humanas",
      status: "Não iniciada · 28 tópicos · Libera após Linguagens",
      progress: 0,
      isCurrent: false,
      topicsCount: 28,
    },
  ]

  const [isEditingTrack, setIsEditingTrack] = useState<boolean>(false)
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false)
  const [currentPassword, setCurrentPassword] = useState<string>("")
  const [newPassword, setNewPassword] = useState<string>("")
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("")
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(
    null,
  )
  const [passwordChangeSuccess, setPasswordChangeSuccess] =
    useState<boolean>(false)

  const isLengthValid = newPassword.length >= 8
  const isCaseValid = /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword)
  const isDiffFromCurrent = Boolean(
    newPassword.length > 0 &&
      (!currentPassword || newPassword !== currentPassword),
  )

  const handleStartChangingPassword = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
    setPasswordChangeError(null)
    setPasswordChangeSuccess(false)
    setIsEditingTrack(false)
    setIsChangingPassword(true)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleCancelChangingPassword = () => {
    setIsChangingPassword(false)
    setPasswordChangeError(null)
    setPasswordChangeSuccess(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
  }

  const handleSaveNewPassword = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setPasswordChangeError(null)

    if (!currentPassword.trim()) {
      setPasswordChangeError("Por favor, informe sua senha atual.")
      return
    }

    const storedPrevious = getStoredPreviousPassword(userEmail)
    if (storedPrevious && currentPassword !== storedPrevious) {
      setPasswordChangeError("A senha atual informada está incorreta.")
      return
    }

    if (!newPassword) {
      setPasswordChangeError("Por favor, digite a nova senha.")
      return
    }

    if (newPassword === currentPassword) {
      setPasswordChangeError("A nova senha deve ser diferente da senha atual.")
      return
    }

    // Regras de negócio do Sherlock (impedimento de nome, e-mail, espaços, sequências, repetidos, idêntica)
    const validation = validatePassword(newPassword, {
      userName: userFullName || userName,
      email: userEmail,
      previousPassword: currentPassword,
      confirmation: confirmNewPassword,
    })

    if (!validation.valid) {
      setPasswordChangeError(
        validation.error ||
          "A nova senha não atende aos requisitos de segurança.",
      )
      return
    }

    if (newPassword !== confirmNewPassword) {
      setPasswordChangeError("As duas senhas informadas não são iguais.")
      return
    }

    // Grava e persiste a nova senha
    recordPreviousPassword(newPassword)

    try {
      localStorage.setItem("sherlock_user_previous_password", newPassword)
      const remembered = localStorage.getItem("sherlock_remembered_login")
      if (remembered) {
        const parsed = JSON.parse(remembered)
        parsed.password = newPassword
        localStorage.setItem(
          "sherlock_remembered_login",
          JSON.stringify(parsed),
        )
      }
    } catch {
      // ignore
    }

    setPasswordChangeSuccess(true)
    setTimeout(() => {
      setIsChangingPassword(false)
      setPasswordChangeSuccess(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
    }, 1500)
  }

  useEffect(() => {
    if (!showCurrentPassword && !showNewPassword && !showConfirmPassword) return
    const handleGlobalRelease = () => {
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    }
    window.addEventListener("mouseup", handleGlobalRelease)
    window.addEventListener("touchend", handleGlobalRelease)
    return () => {
      window.removeEventListener("mouseup", handleGlobalRelease)
      window.removeEventListener("touchend", handleGlobalRelease)
    }
  }, [showCurrentPassword, showNewPassword, showConfirmPassword])
  const [trackSubjects, setTrackSubjects] = useState<TrackSubject[]>(() => {
    try {
      const saved = localStorage.getItem("sherlock_track_subjects")
      if (saved) return JSON.parse(saved)
    } catch {
      // ignore
    }
    return initialTrackSubjects
  })
  const [tempTrackSubjects, setTempTrackSubjects] =
    useState<TrackSubject[]>(trackSubjects)

  const handleStartEditingTrack = () => {
    setTempTrackSubjects([...trackSubjects])
    setIsEditingTrack(true)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSaveTrackOrder = () => {
    setTrackSubjects(tempTrackSubjects)
    try {
      localStorage.setItem(
        "sherlock_track_subjects",
        JSON.stringify(tempTrackSubjects),
      )
    } catch {
      // ignore
    }
    setIsEditingTrack(false)
  }

  const handleCancelEditingTrack = () => {
    setTempTrackSubjects([...trackSubjects])
    setIsEditingTrack(false)
  }

  const [draggedSubjectIdx, setDraggedSubjectIdx] = useState<number | null>(
    null,
  )
  const [dragOverSubjectIdx, setDragOverSubjectIdx] = useState<number | null>(
    null,
  )

  const handleMoveSubject = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= tempTrackSubjects.length) return
    const updated = [...tempTrackSubjects]
    const [moved] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, moved)
    setTempTrackSubjects(updated)
  }

  const handleDropSubject = (targetIndex: number) => {
    if (draggedSubjectIdx === null || draggedSubjectIdx === targetIndex) {
      setDraggedSubjectIdx(null)
      setDragOverSubjectIdx(null)
      return
    }
    handleMoveSubject(draggedSubjectIdx, targetIndex)
    setDraggedSubjectIdx(null)
    setDragOverSubjectIdx(null)
  }

  const handleRemoveSubject = (id: string) => {
    setTempTrackSubjects((prev) => prev.filter((s) => s.id !== id))
  }

  const handleAddSubject = (subject: TrackSubject) => {
    if (tempTrackSubjects.some((s) => s.id === subject.id)) return
    const prevSubject = tempTrackSubjects[tempTrackSubjects.length - 1]
    const prevName = prevSubject
      ? prevSubject.name.replace("Ciências da ", "").replace("Ciências ", "")
      : ""
    const newSubject: TrackSubject = {
      ...subject,
      status: prevSubject
        ? `Não iniciada · ${subject.topicsCount} tópicos · Libera após ${prevName}`
        : "Em andamento",
      isCurrent: tempTrackSubjects.length === 0,
      progress: 0,
    }
    setTempTrackSubjects((prev) => [...prev, newSubject])
  }

  const handleRestoreSubjects = () => {
    setTempTrackSubjects(initialTrackSubjects)
  }

  const availableSubjectsToAdd = catalogSubjects.filter(
    (subj) => !tempTrackSubjects.some((t) => t.id === subj.id),
  )

  const [showDeleteAccountModal, setShowDeleteAccountModal] =
    useState<boolean>(false)
  const [subjectToRemove, setSubjectToRemove] = useState<TrackSubject | null>(
    null,
  )
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false)

  const handleDeleteAccount = () => {
    try {
      localStorage.clear()
      sessionStorage.clear()
      tokenStorage.clear()
    } catch {
      // ignore
    }
    setShowDeleteAccountModal(false)
    go("login")
  }

  const openModule = (moduleId: string = "modulo-2") => {
    setActiveTab("trilha")
    setSelectedModule(moduleId)
    setSelectedSubmodule(2)
    setActiveQuestionIndex(0)
    setSelectedOption(null)
    setShowExplanation(false)
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }

  useEffect(() => {
    if (selectedModule && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" })
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    }
  }, [selectedModule])

  useEffect(() => {
    let isMounted = true
    const syncUser = () => {
      try {
        const name = propUserName || getInitialUserName()
        setUserName(name)
        setUserFullName(getInitialUserFullName(name))
        setUserEmail(propUserEmail || getInitialUserEmail())
        const storedMode = localStorage.getItem("sherlock_start_mode")
        if (storedMode === "materias" || storedMode === "nivelamento") {
          setStartMode(storedMode)
        }
        setPrioritySubjects(getInitialPrioritySubjects())
        const course = propTargetCourse || getInitialTargetCourse()
        setTargetCourse(course)
      } catch {
        // ignore
      }
    }

    syncUser()
    window.addEventListener("storage", syncUser)

    onboardingApi
      .getMe()
      .then((me) => {
        if (!isMounted || !me) return
        const mode = (me as any).startMode || (me as any).start_mode
        if (mode === "materias" || mode === "nivelamento") {
          setStartMode(mode)
          try {
            localStorage.setItem("sherlock_start_mode", mode)
          } catch {
            // ignore
          }
        }
        const subjects = (me as any).subjects
        if (Array.isArray(subjects) && subjects.length > 0) {
          const s1 = subjects[0] || "Matemática"
          const s2 =
            subjects[1] ||
            (s1.toLowerCase().includes("matemática")
              ? "Natureza"
              : "Matemática")
          setPrioritySubjects([s1, s2])
          try {
            localStorage.setItem(
              "sherlock_selected_subjects",
              JSON.stringify(subjects),
            )
          } catch {
            // ignore
          }
        }
        const courseName =
          (me as any).targetCourseName ||
          (me as any).target_course_name ||
          (me as any).targetCourse?.name
        if (courseName && typeof courseName === "string" && courseName.trim()) {
          setTargetCourse(courseName.trim())
          try {
            localStorage.setItem(
              "sherlock_target_course_name",
              courseName.trim(),
            )
          } catch {
            // ignore
          }
        }
      })
      .catch(() => {
        // ignore
      })

    return () => {
      isMounted = false
      window.removeEventListener("storage", syncUser)
    }
  }, [propUserName, propUserEmail, propStartMode, propTargetCourse])

  function handleLogout() {
    authApi.logout()
    try {
      localStorage.removeItem("sherlock_user_name")
      localStorage.removeItem("sherlock_user_fullname")
      localStorage.removeItem("sherlock_user_email")
    } catch {
      // ignore
    }
    go("login")
  }

  return (
    <div className="min-h-screen bg-[#F7F6FC] text-[#17152E] flex flex-col lg:flex-row antialiased font-sans">
      {/* ========================================================================= */}
      {/* MOBILE TOPBAR (Visible only < 1024px)                                     */}
      {/* ========================================================================= */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E2DFF1] sticky top-0 z-30 shadow-xs">
        {/* Brand Logo Mobile */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setMobileMenuOpen(false)
            go("landing")
          }}
        >
          <div className="w-8 h-8 rounded-lg bg-[#4F3CF0] flex items-center justify-center relative shadow-xs">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 19h4v-4h4v-4h4V7h4" />
            </svg>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#C6F432] ring-2 ring-[#4F3CF0]" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#17152E]">
            EduMentor{" "}
            <span className="bg-[#C6F432] text-[#17152E] text-[10px] font-black px-1.5 py-0.5 rounded-full">
              AI
            </span>
          </span>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl border border-[#E2DFF1] hover:bg-[#F7F6FC] text-[#17152E] transition cursor-pointer"
          aria-label="Abrir menu de navegação"
        >
          {mobileMenuOpen ? (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="4" y1="8" x2="20" y2="8" />
              <line x1="4" y1="16" x2="20" y2="16" />
            </svg>
          )}
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SIDEBAR NAVIGATION (Desktop 256px / Mobile drawer)                       */}
      {/* ========================================================================= */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-40 h-screen w-[256px] bg-white border-r border-[#E2DFF1]
          flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out shrink-0
          ${
            mobileMenuOpen
              ? "translate-x-0 shadow-2xl"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div>
          {/* Brand Logo (Exact Vector Representation from SVG) */}
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none group"
            onClick={() => {
              setMobileMenuOpen(false)
              go("landing")
            }}
          >
            <div className="relative w-[34px] h-[31px]">
              <svg
                width="34"
                height="31"
                viewBox="0 0 34 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Purple speech bubble base */}
                <path
                  d="M6.5 0H19.5C23.1 0 26 2.9 26 6.5V16.5C26 20.1 23.1 23 19.5 23H10L4.5 27C3.75 27.55 2.75 27 2.75 26.1V22.85C1.15 21.75 0 19.25 0 16.5V6.5C0 2.9 2.9 0 6.5 0Z"
                  fill="#4F3CF0"
                />
                {/* Stepped progress pencil/chart inside */}
                <path
                  d="M5.5 18H10V14H14.5V10H20.5"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Lime Sparkle Star at top right */}
                <path
                  d="M21.5 2.5C21.8 4.15 22.35 4.7 24 5C22.35 5.3 21.8 5.85 21.5 7.5C21.2 5.85 20.65 5.3 19 5C20.65 4.7 21.2 4.15 21.5 2.5Z"
                  fill="#C6F432"
                />
                <circle cx="20.5" cy="10" r="1.75" fill="#C6F432" />
              </svg>
            </div>

            <span className="font-extrabold text-[20px] tracking-tight text-[#17152E] flex items-center gap-1.5">
              EduMentor
              <span className="bg-[#C6F432] text-[#17152E] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                AI
              </span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav
            className="mt-8 flex flex-col gap-1.5"
            aria-label="Menu principal"
          >
            {/* 1. Início */}
            <button
              type="button"
              onClick={() => {
                setIsMentorinaChatOpen(false)
                setActiveTab("inicio")
                setSelectedModule(null)
                setMobileMenuOpen(false)
              }}
              className={`
                w-full h-[48px] rounded-xl flex items-center px-4 gap-3 text-sm font-semibold transition cursor-pointer
                ${
                  !isMentorinaChatOpen && activeTab === "inicio"
                    ? "bg-[#E9E6FF] text-[#4F3CF0]"
                    : "text-[#17152E] hover:bg-[#F7F6FC]"
                }
              `}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9.5L12 2.5L21 9.5V20.5C21 21.0523 20.5523 21.5 20 21.5H15V15.5H9V21.5H4C3.44772 21.5 3 21.0523 3 20.5V9.5Z" />
              </svg>
              <span>Início</span>
            </button>

            {/* 2. Trilha */}
            <button
              type="button"
              onClick={() => {
                setIsMentorinaChatOpen(false)
                setActiveTab("trilha")
                setSelectedModule(null)
                setMobileMenuOpen(false)
              }}
              className={`
                w-full h-[48px] rounded-xl flex items-center px-4 gap-3 text-sm font-medium transition cursor-pointer
                ${
                  !isMentorinaChatOpen && activeTab === "trilha"
                    ? "bg-[#E9E6FF] text-[#4F3CF0] font-semibold"
                    : "text-[#17152E] hover:bg-[#F7F6FC]"
                }
              `}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 19H8V14.5H12V10H16V5.5H20" />
                <circle cx="20" cy="5.5" r="1.5" fill="currentColor" />
              </svg>
              <span>Sua trilha</span>
            </button>

            {/* 3. Simulados */}
            <button
              type="button"
              onClick={() => {
                setIsMentorinaChatOpen(false)
                setActiveTab("simulados")
                setMobileMenuOpen(false)
              }}
              className={`
                w-full h-[48px] rounded-xl flex items-center px-4 gap-3 text-sm font-medium transition cursor-pointer
                ${
                  !isMentorinaChatOpen && activeTab === "simulados"
                    ? "bg-[#E9E6FF] text-[#4F3CF0] font-semibold"
                    : "text-[#17152E] hover:bg-[#F7F6FC]"
                }
              `}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="13" r="8" />
                <path d="M12 9V13L14.5 15.5" />
                <path d="M9 3H15" />
              </svg>
              <span>Simulados</span>
            </button>

            {/* 4. Redação */}
            <button
              type="button"
              onClick={() => {
                setIsMentorinaChatOpen(false)
                setActiveTab("redacao")
                setMobileMenuOpen(false)
              }}
              className={`
                w-full h-[48px] rounded-xl flex items-center px-4 gap-3 text-sm font-medium transition cursor-pointer
                ${
                  !isMentorinaChatOpen && activeTab === "redacao"
                    ? "bg-[#E9E6FF] text-[#4F3CF0] font-semibold"
                    : "text-[#17152E] hover:bg-[#F7F6FC]"
                }
              `}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 20H8L18.5 9.5L14.5 5.5L4 16V20Z" />
                <path d="M13.5 6.5L17.5 10.5" />
              </svg>
              <span>Redação</span>
            </button>

            {/* 5. Perfil */}
            <button
              type="button"
              onClick={() => {
                setIsMentorinaChatOpen(false)
                setActiveTab("perfil")
                setMobileMenuOpen(false)
              }}
              className={`
                w-full h-[48px] rounded-xl flex items-center px-4 gap-3 text-sm font-medium transition cursor-pointer
                ${
                  !isMentorinaChatOpen && activeTab === "perfil"
                    ? "bg-[#E9E6FF] text-[#4F3CF0] font-semibold"
                    : "text-[#17152E] hover:bg-[#F7F6FC]"
                }
              `}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="7" r="4" />
                <path d="M5.5 21C5.5 17 8.5 15 12 15C15.5 15 18.5 17 18.5 21" />
              </svg>
              <span>Perfil</span>
            </button>
          </nav>
        </div>

        {/* ===================================================================== */}
        {/* BOTTOM COUNTDOWN CARD (Exact SVG: w=208, h=126, rx=12, fill=#17152E)  */}
        {/* ===================================================================== */}
        <div className="w-[208px] h-[126px] shrink-0 select-none shadow-md rounded-[12px] overflow-hidden">
          <svg
            width="208"
            height="126"
            viewBox="0 0 208 126"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full block"
            aria-label="Contagem regressiva: Faltam 39 dias para o ENEM! 1º dia de prova em 08/11"
          >
            <rect width="208" height="126" rx="12" fill="#17152E" />
            <path
              d="M16.924 28V19.54H22.456V20.764H18.46V23.152H22.204V24.376H18.46V28H16.924ZM22.814 28L26.642 19.54H27.902L31.73 28H30.17L29.15 25.624L29.798 26.044H24.734L25.382 25.624L24.374 28H22.814ZM27.254 21.208L25.574 25.204L25.262 24.82H29.27L28.97 25.204L27.278 21.208H27.254ZM33.3757 28V19.54H34.9117V26.692H38.9677V28H33.3757ZM41.3154 28V20.824H38.4114V19.54H45.7554V20.824H42.8514V28H41.3154ZM45.599 28L49.427 19.54H50.687L54.515 28H52.955L51.935 25.624L52.583 26.044H47.519L48.167 25.624L47.159 28H45.599ZM50.039 21.208L48.359 25.204L48.047 24.82H52.055L51.755 25.204L50.063 21.208H50.039ZM56.1847 28V19.54H57.4687L60.6607 25.432H60.2767L63.4567 19.54H64.7167V28H63.3247V21.82H63.5887L60.9007 26.716H60.0007L57.2887 21.808H57.5767V28H56.1847Z"
              fill="#E2DFF1"
            />
            <path
              d="M29.776 78.672C27.632 78.672 25.76 78.464 24.16 78.048C22.592 77.632 21.264 77.024 20.176 76.224C19.12 75.424 18.304 74.432 17.728 73.248C17.184 72.064 16.88 70.704 16.816 69.168L23.92 67.44C23.92 68.208 24.048 68.928 24.304 69.6C24.592 70.24 24.992 70.8 25.504 71.28C26.016 71.728 26.64 72.08 27.376 72.336C28.144 72.56 29.024 72.672 30.016 72.672C31.104 72.672 32.048 72.512 32.848 72.192C33.68 71.872 34.32 71.392 34.768 70.752C35.248 70.08 35.488 69.264 35.488 68.304C35.488 66.992 35.04 65.92 34.144 65.088C33.28 64.256 31.92 63.696 30.064 63.408C28.208 63.12 25.808 63.136 22.864 63.456V59.088L32.848 52.8V52.464L18.448 52.56V46.272H41.296V52.896L31.216 59.52V59.904C34.16 59.712 36.512 60.016 38.272 60.816C40.032 61.584 41.312 62.688 42.112 64.128C42.912 65.536 43.312 67.072 43.312 68.736C43.312 70.752 42.816 72.512 41.824 74.016C40.832 75.488 39.328 76.64 37.312 77.472C35.328 78.272 32.816 78.672 29.776 78.672ZM57.652 78.72C56.02 78.72 54.484 78.528 53.044 78.144C51.636 77.792 50.388 77.248 49.3 76.512C48.244 75.744 47.38 74.784 46.708 73.632C46.068 72.448 45.716 71.072 45.652 69.504L52.852 68.064C52.98 68.928 53.22 69.632 53.572 70.176C53.924 70.72 54.324 71.152 54.772 71.472C55.252 71.76 55.748 71.968 56.26 72.096C56.804 72.224 57.316 72.288 57.796 72.288C58.98 72.288 59.988 72.048 60.82 71.568C61.684 71.056 62.388 70.352 62.932 69.456C63.476 68.56 63.876 67.504 64.132 66.288C64.42 65.072 64.564 63.76 64.564 62.352C64.564 61.904 64.532 61.408 64.468 60.864C64.436 60.32 64.388 59.76 64.324 59.184C64.292 58.576 64.228 58 64.132 57.456H63.748C63.78 59.152 63.524 60.56 62.98 61.68C62.468 62.768 61.764 63.632 60.868 64.272C59.972 64.912 58.996 65.376 57.94 65.664C56.916 65.92 55.908 66.048 54.916 66.048C53.252 66.048 51.684 65.68 50.212 64.944C48.74 64.208 47.54 63.12 46.612 61.68C45.716 60.24 45.268 58.464 45.268 56.352C45.268 55.104 45.46 53.856 45.844 52.608C46.26 51.328 46.932 50.16 47.86 49.104C48.82 48.048 50.084 47.2 51.652 46.56C53.22 45.888 55.172 45.552 57.508 45.552C60.708 45.552 63.396 46.224 65.572 47.568C67.748 48.88 69.396 50.784 70.516 53.28C71.668 55.776 72.244 58.784 72.244 62.304C72.244 65.984 71.636 69.056 70.42 71.52C69.236 73.952 67.556 75.76 65.38 76.944C63.204 78.128 60.628 78.72 57.652 78.72ZM57.604 60.72C58.564 60.72 59.412 60.528 60.148 60.144C60.884 59.728 61.476 59.152 61.924 58.416C62.372 57.68 62.596 56.832 62.596 55.872C62.596 54.944 62.372 54.176 61.924 53.568C61.476 52.96 60.884 52.512 60.148 52.224C59.412 51.904 58.644 51.744 57.844 51.744C57.14 51.744 56.5 51.856 55.924 52.08C55.348 52.272 54.836 52.576 54.388 52.992C53.972 53.376 53.636 53.84 53.38 54.384C53.156 54.928 53.044 55.536 53.044 56.208C53.044 57.104 53.236 57.904 53.62 58.608C54.004 59.28 54.532 59.808 55.204 60.192C55.908 60.544 56.708 60.72 57.604 60.72Z"
              fill="#C6F432"
            />
            <path
              d="M88.036 66.12C87.524 66.12 87.072 65.996 86.68 65.748C86.296 65.5 85.996 65.148 85.78 64.692C85.564 64.228 85.456 63.684 85.456 63.06C85.456 62.428 85.564 61.888 85.78 61.44C85.996 60.984 86.296 60.632 86.68 60.384C87.072 60.136 87.524 60.012 88.036 60.012C88.524 60.012 88.948 60.132 89.308 60.372C89.676 60.612 89.924 60.928 90.052 61.32H89.92V57.54H91.42V66H89.956V64.752H90.064C89.944 65.168 89.7 65.5 89.332 65.748C88.964 65.996 88.532 66.12 88.036 66.12ZM88.456 64.98C88.904 64.98 89.264 64.82 89.536 64.5C89.808 64.172 89.944 63.692 89.944 63.06C89.944 62.42 89.808 61.944 89.536 61.632C89.264 61.312 88.904 61.152 88.456 61.152C88.008 61.152 87.648 61.312 87.376 61.632C87.104 61.944 86.968 62.42 86.968 63.06C86.968 63.692 87.104 64.172 87.376 64.5C87.648 64.82 88.008 64.98 88.456 64.98ZM92.8793 58.872V57.408H94.5593V58.872H92.8793ZM92.9753 66V60.132H94.4753V66H92.9753ZM97.9659 66.12C97.5419 66.12 97.1619 66.04 96.8259 65.88C96.4979 65.712 96.2379 65.488 96.0459 65.208C95.8619 64.928 95.7699 64.612 95.7699 64.26C95.7699 63.828 95.8819 63.488 96.1059 63.24C96.3299 62.984 96.6939 62.8 97.1979 62.688C97.7019 62.576 98.3779 62.52 99.2259 62.52H99.8259V63.384H99.2379C98.8619 63.384 98.5459 63.4 98.2899 63.432C98.0339 63.456 97.8259 63.5 97.6659 63.564C97.5139 63.62 97.4019 63.7 97.3299 63.804C97.2659 63.908 97.2339 64.036 97.2339 64.188C97.2339 64.452 97.3259 64.668 97.5099 64.836C97.6939 65.004 97.9499 65.088 98.2779 65.088C98.5419 65.088 98.7739 65.028 98.9739 64.908C99.1819 64.78 99.3459 64.608 99.4659 64.392C99.5859 64.176 99.6459 63.928 99.6459 63.648V62.268C99.6459 61.868 99.5579 61.58 99.3819 61.404C99.2059 61.228 98.9099 61.14 98.4939 61.14C98.1659 61.14 97.8299 61.192 97.4859 61.296C97.1419 61.392 96.7939 61.544 96.4419 61.752L96.0099 60.732C96.2179 60.588 96.4619 60.464 96.7419 60.36C97.0299 60.248 97.3299 60.164 97.6419 60.108C97.9619 60.044 98.2619 60.012 98.5419 60.012C99.1179 60.012 99.5899 60.1 99.9579 60.276C100.334 60.452 100.614 60.72 100.798 61.08C100.982 61.432 101.074 61.888 101.074 62.448V66H99.6699V64.752H99.7659C99.7099 65.032 99.5979 65.276 99.4299 65.484C99.2699 65.684 99.0659 65.84 98.8179 65.952C98.5699 66.064 98.2859 66.12 97.9659 66.12ZM104.744 66.12C104.416 66.12 104.096 66.092 103.784 66.036C103.48 65.98 103.2 65.904 102.944 65.808C102.688 65.704 102.464 65.576 102.272 65.424L102.656 64.44C102.856 64.568 103.072 64.68 103.304 64.776C103.536 64.872 103.776 64.944 104.024 64.992C104.272 65.04 104.516 65.064 104.756 65.064C105.14 65.064 105.424 65 105.608 64.872C105.8 64.736 105.896 64.56 105.896 64.344C105.896 64.16 105.832 64.02 105.704 63.924C105.584 63.82 105.4 63.744 105.152 63.696L103.952 63.468C103.456 63.372 103.076 63.192 102.812 62.928C102.556 62.656 102.428 62.308 102.428 61.884C102.428 61.5 102.532 61.168 102.74 60.888C102.956 60.608 103.252 60.392 103.628 60.24C104.004 60.088 104.436 60.012 104.924 60.012C105.204 60.012 105.476 60.04 105.74 60.096C106.004 60.144 106.252 60.22 106.484 60.324C106.724 60.42 106.932 60.548 107.108 60.708L106.7 61.692C106.548 61.564 106.372 61.456 106.172 61.368C105.972 61.272 105.764 61.2 105.548 61.152C105.34 61.096 105.136 61.068 104.936 61.068C104.544 61.068 104.252 61.136 104.06 61.272C103.876 61.408 103.784 61.588 103.784 61.812C103.784 61.98 103.84 62.12 103.952 62.232C104.064 62.344 104.236 62.42 104.468 62.46L105.668 62.688C106.188 62.784 106.58 62.96 106.844 63.216C107.116 63.472 107.252 63.816 107.252 64.248C107.252 64.64 107.148 64.976 106.94 65.256C106.732 65.536 106.44 65.752 106.064 65.904C105.688 66.048 105.248 66.12 104.744 66.12ZM111.69 68.16V60.132H113.154V61.368H113.034C113.154 60.96 113.398 60.632 113.766 60.384C114.142 60.136 114.578 60.012 115.074 60.012C115.586 60.012 116.034 60.136 116.418 60.384C116.81 60.632 117.114 60.984 117.33 61.44C117.546 61.888 117.654 62.428 117.654 63.06C117.654 63.684 117.546 64.228 117.33 64.692C117.114 65.148 116.814 65.5 116.43 65.748C116.046 65.996 115.594 66.12 115.074 66.12C114.586 66.12 114.158 66 113.79 65.76C113.422 65.512 113.174 65.192 113.046 64.8H113.19V68.16H111.69ZM114.654 64.98C115.102 64.98 115.462 64.82 115.734 64.5C116.006 64.172 116.142 63.692 116.142 63.06C116.142 62.42 116.006 61.944 115.734 61.632C115.462 61.312 115.102 61.152 114.654 61.152C114.206 61.152 113.846 61.312 113.574 61.632C113.302 61.944 113.166 62.42 113.166 63.06C113.166 63.692 113.302 64.172 113.574 64.5C113.846 64.82 114.206 64.98 114.654 64.98ZM120.817 66.12C120.393 66.12 120.013 66.04 119.677 65.88C119.349 65.712 119.089 65.488 118.897 65.208C118.713 64.928 118.621 64.612 118.621 64.26C118.621 63.828 118.733 63.488 118.957 63.24C119.181 62.984 119.545 62.8 120.049 62.688C120.553 62.576 121.229 62.52 122.077 62.52H122.677V63.384H122.089C121.713 63.384 121.397 63.4 121.141 63.432C120.885 63.456 120.677 63.5 120.517 63.564C120.365 63.62 120.253 63.7 120.181 63.804C120.117 63.908 120.085 64.036 120.085 64.188C120.085 64.452 120.177 64.668 120.361 64.836C120.545 65.004 120.801 65.088 121.129 65.088C121.393 65.088 121.625 65.028 121.825 64.908C122.033 64.78 122.197 64.608 122.317 64.392C122.437 64.176 122.497 63.928 122.497 63.648V62.268C122.497 61.868 122.409 61.58 122.233 61.404C122.057 61.228 121.761 61.14 121.345 61.14C121.017 61.14 120.681 61.192 120.337 61.296C119.993 61.392 119.645 61.544 119.293 61.752L118.861 60.732C119.069 60.588 119.313 60.464 119.593 60.36C119.881 60.248 120.181 60.164 120.493 60.108C120.813 60.044 121.113 60.012 121.393 60.012C121.969 60.012 122.441 60.1 122.809 60.276C123.185 60.452 123.465 60.72 123.649 61.08C123.833 61.432 123.925 61.888 123.925 62.448V66H122.521V64.752H122.617C122.561 65.032 122.449 65.276 122.281 65.484C122.121 65.684 121.917 65.84 121.669 65.952C121.421 66.064 121.137 66.12 120.817 66.12ZM125.448 66V60.132H126.912V61.548H126.792C126.904 61.068 127.124 60.704 127.452 60.456C127.78 60.2 128.216 60.052 128.76 60.012L129.216 59.976L129.312 61.248L128.448 61.332C127.96 61.38 127.592 61.532 127.344 61.788C127.096 62.036 126.972 62.388 126.972 62.844V66H125.448ZM132.021 66.12C131.597 66.12 131.217 66.04 130.881 65.88C130.553 65.712 130.293 65.488 130.101 65.208C129.917 64.928 129.825 64.612 129.825 64.26C129.825 63.828 129.937 63.488 130.161 63.24C130.385 62.984 130.749 62.8 131.253 62.688C131.757 62.576 132.433 62.52 133.281 62.52H133.881V63.384H133.293C132.917 63.384 132.601 63.4 132.345 63.432C132.089 63.456 131.881 63.5 131.721 63.564C131.569 63.62 131.457 63.7 131.385 63.804C131.321 63.908 131.289 64.036 131.289 64.188C131.289 64.452 131.381 64.668 131.565 64.836C131.749 65.004 132.005 65.088 132.333 65.088C132.597 65.088 132.829 65.028 133.029 64.908C133.237 64.78 133.401 64.608 133.521 64.392C133.641 64.176 133.701 63.928 133.701 63.648V62.268C133.701 61.868 133.613 61.58 133.437 61.404C133.261 61.228 132.965 61.14 132.549 61.14C132.221 61.14 131.885 61.192 131.541 61.296C131.197 61.392 130.849 61.544 130.497 61.752L130.065 60.732C130.273 60.588 130.517 60.464 130.797 60.36C131.085 60.248 131.385 60.164 131.697 60.108C132.017 60.044 132.317 60.012 132.597 60.012C133.173 60.012 133.645 60.1 134.013 60.276C134.389 60.452 134.669 60.72 134.853 61.08C135.037 61.432 135.129 61.888 135.129 62.448V66H133.725V64.752H133.821C133.765 65.032 133.653 65.276 133.485 65.484C133.325 65.684 133.121 65.84 132.873 65.952C132.625 66.064 132.341 66.12 132.021 66.12ZM142.561 66.12C141.953 66.12 141.425 65.996 140.977 65.748C140.529 65.5 140.181 65.148 139.933 64.692C139.685 64.228 139.561 63.684 139.561 63.06C139.561 62.436 139.685 61.896 139.933 61.44C140.181 60.984 140.529 60.632 140.977 60.384C141.425 60.136 141.953 60.012 142.561 60.012C143.169 60.012 143.697 60.136 144.145 60.384C144.593 60.632 144.941 60.984 145.189 61.44C145.437 61.896 145.561 62.436 145.561 63.06C145.561 63.684 145.437 64.228 145.189 64.692C144.941 65.148 144.593 65.5 144.145 65.748C143.697 65.996 143.169 66.12 142.561 66.12ZM142.561 64.98C143.009 64.98 143.369 64.82 143.641 64.5C143.913 64.172 144.049 63.692 144.049 63.06C144.049 62.42 143.913 61.944 143.641 61.632C143.369 61.312 143.009 61.152 142.561 61.152C142.113 61.152 141.753 61.312 141.481 61.632C141.209 61.944 141.073 62.42 141.073 63.06C141.073 63.692 141.209 64.172 141.481 64.5C141.753 64.82 142.113 64.98 142.561 64.98ZM150.178 66V57.54H155.806V58.764H151.654V61.092H155.542V62.316H151.654V64.776H155.806V66H150.178ZM157.338 66V57.54H158.49L163.35 63.852H163.038V57.54H164.466V66H163.326L158.466 59.676H158.766V66H157.338ZM166.315 66V57.54H171.943V58.764H167.791V61.092H171.679V62.316H167.791V64.776H171.943V66H166.315ZM173.499 66V57.54H174.783L177.975 63.432H177.591L180.771 57.54H182.031V66H180.639V59.82H180.903L178.215 64.716H177.315L174.603 59.808H174.891V66H173.499ZM184.001 63.492L183.533 57.54H185.381L184.913 63.492H184.001ZM183.617 66V64.332H185.297V66H183.617Z"
              fill="white"
            />
            <path
              d="M17.488 105V104.16H19.42V97.392H19.936L17.896 98.688L17.476 97.956L19.696 96.54H20.404V104.16H22.216V105H17.488ZM25.2353 100.068C24.8913 100.068 24.5873 99.992 24.3233 99.84C24.0593 99.688 23.8513 99.476 23.6993 99.204C23.5473 98.932 23.4713 98.612 23.4713 98.244C23.4713 97.876 23.5473 97.556 23.6993 97.284C23.8513 97.012 24.0593 96.804 24.3233 96.66C24.5873 96.508 24.8913 96.432 25.2353 96.432C25.5713 96.432 25.8713 96.508 26.1353 96.66C26.3993 96.804 26.6073 97.012 26.7593 97.284C26.9113 97.556 26.9873 97.876 26.9873 98.244C26.9873 98.612 26.9113 98.932 26.7593 99.204C26.6073 99.476 26.3993 99.688 26.1353 99.84C25.8713 99.992 25.5713 100.068 25.2353 100.068ZM25.2353 99.516C25.5633 99.516 25.8193 99.408 26.0033 99.192C26.1953 98.976 26.2913 98.66 26.2913 98.244C26.2913 97.836 26.1953 97.524 26.0033 97.308C25.8193 97.092 25.5593 96.984 25.2233 96.984C24.9033 96.984 24.6473 97.092 24.4553 97.308C24.2633 97.516 24.1673 97.828 24.1673 98.244C24.1673 98.66 24.2633 98.976 24.4553 99.192C24.6473 99.408 24.9073 99.516 25.2353 99.516ZM33.4757 105.108C32.9557 105.108 32.4998 104.984 32.1077 104.736C31.7238 104.488 31.4237 104.14 31.2078 103.692C30.9998 103.236 30.8958 102.7 30.8958 102.084C30.8958 101.46 30.9998 100.924 31.2078 100.476C31.4237 100.02 31.7238 99.672 32.1077 99.432C32.4998 99.184 32.9557 99.06 33.4757 99.06C34.0037 99.06 34.4557 99.192 34.8318 99.456C35.2078 99.72 35.4598 100.076 35.5877 100.524H35.4557V96.54H36.4277V105H35.4797V103.608H35.5998C35.4718 104.064 35.2157 104.428 34.8318 104.7C34.4557 104.972 34.0037 105.108 33.4757 105.108ZM33.6798 104.328C34.2318 104.328 34.6677 104.136 34.9878 103.752C35.3158 103.36 35.4797 102.804 35.4797 102.084C35.4797 101.356 35.3158 100.8 34.9878 100.416C34.6677 100.032 34.2318 99.84 33.6798 99.84C33.1357 99.84 32.6998 100.032 32.3717 100.416C32.0438 100.8 31.8798 101.356 31.8798 102.084C31.8798 102.804 32.0438 103.36 32.3717 103.752C32.6998 104.136 33.1357 104.328 33.6798 104.328ZM38.1318 97.716V96.624H39.3318V97.716H38.1318ZM38.2518 105V99.168H39.2238V105H38.2518ZM42.8769 105.108C42.4769 105.108 42.1169 105.032 41.7969 104.88C41.4849 104.72 41.2369 104.504 41.0529 104.232C40.8689 103.96 40.7769 103.656 40.7769 103.32C40.7769 102.888 40.8849 102.548 41.1009 102.3C41.3249 102.052 41.6889 101.876 42.1929 101.772C42.7049 101.668 43.4009 101.616 44.2809 101.616H44.8209V102.252H44.2929C43.8049 102.252 43.3969 102.268 43.0689 102.3C42.7409 102.332 42.4809 102.388 42.2889 102.468C42.0969 102.548 41.9609 102.652 41.8809 102.78C41.8009 102.908 41.7609 103.068 41.7609 103.26C41.7609 103.588 41.8729 103.856 42.0969 104.064C42.3289 104.272 42.6409 104.376 43.0329 104.376C43.3529 104.376 43.6329 104.3 43.8729 104.148C44.1209 103.996 44.3129 103.788 44.4489 103.524C44.5929 103.26 44.6649 102.956 44.6649 102.612V101.244C44.6649 100.748 44.5649 100.392 44.3649 100.176C44.1649 99.952 43.8369 99.84 43.3809 99.84C43.0289 99.84 42.6889 99.892 42.3609 99.996C42.0329 100.092 41.6969 100.252 41.3529 100.476L41.0169 99.768C41.2249 99.624 41.4609 99.5 41.7249 99.396C41.9889 99.284 42.2649 99.2 42.5529 99.144C42.8409 99.088 43.1169 99.06 43.3809 99.06C43.8849 99.06 44.3009 99.144 44.6289 99.312C44.9569 99.472 45.2009 99.72 45.3609 100.056C45.5209 100.384 45.6009 100.808 45.6009 101.328V105H44.6889V103.644H44.7969C44.7329 103.948 44.6089 104.208 44.4249 104.424C44.2489 104.64 44.0289 104.808 43.7649 104.928C43.5009 105.048 43.2049 105.108 42.8769 105.108ZM52.7062 105.108C52.1862 105.108 51.7302 104.984 51.3382 104.736C50.9542 104.488 50.6542 104.14 50.4382 103.692C50.2302 103.236 50.1262 102.7 50.1262 102.084C50.1262 101.46 50.2302 100.924 50.4382 100.476C50.6542 100.02 50.9542 99.672 51.3382 99.432C51.7302 99.184 52.1862 99.06 52.7062 99.06C53.2342 99.06 53.6862 99.192 54.0622 99.456C54.4382 99.72 54.6902 100.076 54.8182 100.524H54.6862V96.54H55.6582V105H54.7102V103.608H54.8302C54.7022 104.064 54.4462 104.428 54.0622 104.7C53.6862 104.972 53.2342 105.108 52.7062 105.108ZM52.9102 104.328C53.4622 104.328 53.8982 104.136 54.2182 103.752C54.5462 103.36 54.7102 102.804 54.7102 102.084C54.7102 101.356 54.5462 100.8 54.2182 100.416C53.8982 100.032 53.4622 99.84 52.9102 99.84C52.3662 99.84 51.9302 100.032 51.6022 100.416C51.2742 100.8 51.1102 101.356 51.1102 102.084C51.1102 102.804 51.2742 103.36 51.6022 103.752C51.9302 104.136 52.3662 104.328 52.9102 104.328ZM60.1103 105.108C59.4943 105.108 58.9623 104.988 58.5143 104.748C58.0743 104.5 57.7303 104.152 57.4823 103.704C57.2423 103.256 57.1223 102.72 57.1223 102.096C57.1223 101.488 57.2423 100.96 57.4823 100.512C57.7223 100.056 58.0503 99.7 58.4663 99.444C58.8903 99.188 59.3783 99.06 59.9303 99.06C60.4583 99.06 60.9103 99.176 61.2863 99.408C61.6623 99.64 61.9503 99.968 62.1503 100.392C62.3583 100.816 62.4623 101.324 62.4623 101.916V102.288H57.8663V101.652H61.8143L61.6223 101.808C61.6223 101.168 61.4783 100.672 61.1903 100.32C60.9103 99.96 60.4983 99.78 59.9543 99.78C59.5463 99.78 59.1983 99.876 58.9103 100.068C58.6303 100.252 58.4183 100.512 58.2743 100.848C58.1303 101.176 58.0583 101.56 58.0583 102V102.072C58.0583 102.56 58.1343 102.972 58.2863 103.308C58.4463 103.644 58.6823 103.9 58.9943 104.076C59.3063 104.244 59.6783 104.328 60.1103 104.328C60.4543 104.328 60.7863 104.276 61.1063 104.172C61.4343 104.06 61.7423 103.88 62.0303 103.632L62.3663 104.316C62.1023 104.556 61.7663 104.748 61.3583 104.892C60.9503 105.036 60.5343 105.108 60.1103 105.108ZM66.9511 107.16V99.168H67.8991V100.548H67.7791C67.9071 100.092 68.1591 99.732 68.5351 99.468C68.9191 99.196 69.3751 99.06 69.9031 99.06C70.4231 99.06 70.8751 99.184 71.2591 99.432C71.6511 99.672 71.9511 100.02 72.1591 100.476C72.3751 100.924 72.4831 101.46 72.4831 102.084C72.4831 102.7 72.3751 103.236 72.1591 103.692C71.9511 104.14 71.6551 104.488 71.2711 104.736C70.8871 104.984 70.4311 105.108 69.9031 105.108C69.3751 105.108 68.9231 104.976 68.5471 104.712C68.1711 104.44 67.9151 104.08 67.7791 103.632H67.9231V107.16H66.9511ZM69.6991 104.328C70.2511 104.328 70.6871 104.136 71.0071 103.752C71.3351 103.36 71.4991 102.804 71.4991 102.084C71.4991 101.356 71.3351 100.8 71.0071 100.416C70.6871 100.032 70.2511 99.84 69.6991 99.84C69.1551 99.84 68.7191 100.032 68.3911 100.416C68.0631 100.8 67.8991 101.356 67.8991 102.084C67.8991 102.804 68.0631 103.36 68.3911 103.752C68.7191 104.136 69.1551 104.328 69.6991 104.328ZM73.9472 105V99.168H74.8952V100.548H74.7752C74.9112 100.076 75.1472 99.72 75.4832 99.48C75.8192 99.232 76.2632 99.088 76.8152 99.048L77.1632 99.012L77.2352 99.852L76.6232 99.924C76.0792 99.972 75.6592 100.148 75.3632 100.452C75.0752 100.748 74.9312 101.156 74.9312 101.676V105H73.9472ZM80.6016 105.108C80.0336 105.108 79.5416 104.984 79.1256 104.736C78.7096 104.488 78.3856 104.14 78.1536 103.692C77.9296 103.236 77.8176 102.7 77.8176 102.084C77.8176 101.468 77.9296 100.936 78.1536 100.488C78.3856 100.032 78.7096 99.68 79.1256 99.432C79.5416 99.184 80.0336 99.06 80.6016 99.06C81.1696 99.06 81.6616 99.184 82.0776 99.432C82.4936 99.68 82.8136 100.032 83.0376 100.488C83.2696 100.936 83.3856 101.468 83.3856 102.084C83.3856 102.7 83.2696 103.236 83.0376 103.692C82.8136 104.14 82.4936 104.488 82.0776 104.736C81.6616 104.984 81.1696 105.108 80.6016 105.108ZM80.6016 104.328C81.1536 104.328 81.5896 104.136 81.9096 103.752C82.2376 103.36 82.4016 102.8 82.4016 102.072C82.4016 101.352 82.2376 100.8 81.9096 100.416C81.5896 100.032 81.1536 99.84 80.6016 99.84C80.0576 99.84 79.6216 100.032 79.2936 100.416C78.9656 100.8 78.8016 101.352 78.8016 102.072C78.8016 102.8 78.9656 103.36 79.2936 103.752C79.6216 104.136 80.0576 104.328 80.6016 104.328ZM86.4796 105L83.9716 99.168H85.0276L87.1156 104.28H86.7916L88.9156 99.168H89.9116L87.3916 105H86.4796ZM92.6582 105.108C92.2582 105.108 91.8982 105.032 91.5782 104.88C91.2662 104.72 91.0182 104.504 90.8342 104.232C90.6502 103.96 90.5582 103.656 90.5582 103.32C90.5582 102.888 90.6662 102.548 90.8822 102.3C91.1062 102.052 91.4702 101.876 91.9742 101.772C92.4862 101.668 93.1822 101.616 94.0622 101.616H94.6022V102.252H94.0742C93.5862 102.252 93.1782 102.268 92.8502 102.3C92.5222 102.332 92.2622 102.388 92.0702 102.468C91.8782 102.548 91.7422 102.652 91.6622 102.78C91.5822 102.908 91.5422 103.068 91.5422 103.26C91.5422 103.588 91.6542 103.856 91.8782 104.064C92.1102 104.272 92.4222 104.376 92.8142 104.376C93.1342 104.376 93.4142 104.3 93.6542 104.148C93.9022 103.996 94.0942 103.788 94.2302 103.524C94.3742 103.26 94.4462 102.956 94.4462 102.612V101.244C94.4462 100.748 94.3462 100.392 94.1462 100.176C93.9462 99.952 93.6182 99.84 93.1622 99.84C92.8102 99.84 92.4702 99.892 92.1422 99.996C91.8142 100.092 91.4782 100.252 91.1342 100.476L90.7982 99.768C91.0062 99.624 91.2422 99.5 91.5062 99.396C91.7702 99.284 92.0462 99.2 92.3342 99.144C92.6222 99.088 92.8982 99.06 93.1622 99.06C93.6662 99.06 94.0822 99.144 94.4102 99.312C94.7382 99.472 94.9822 99.72 95.1422 100.056C95.3022 100.384 95.3822 100.808 95.3822 101.328V105H94.4702V103.644H94.5782C94.5142 103.948 94.3902 104.208 94.2062 104.424C94.0302 104.64 93.8102 104.808 93.5462 104.928C93.2822 105.048 92.9862 105.108 92.6582 105.108ZM102.895 105.108C102.279 105.108 101.747 104.988 101.299 104.748C100.859 104.5 100.515 104.152 100.267 103.704C100.027 103.256 99.9075 102.72 99.9075 102.096C99.9075 101.488 100.027 100.96 100.267 100.512C100.507 100.056 100.835 99.7 101.251 99.444C101.675 99.188 102.163 99.06 102.715 99.06C103.243 99.06 103.695 99.176 104.071 99.408C104.447 99.64 104.735 99.968 104.935 100.392C105.143 100.816 105.247 101.324 105.247 101.916V102.288H100.651V101.652H104.599L104.407 101.808C104.407 101.168 104.263 100.672 103.975 100.32C103.695 99.96 103.283 99.78 102.739 99.78C102.331 99.78 101.983 99.876 101.695 100.068C101.415 100.252 101.203 100.512 101.059 100.848C100.915 101.176 100.843 101.56 100.843 102V102.072C100.843 102.56 100.919 102.972 101.071 103.308C101.231 103.644 101.467 103.9 101.779 104.076C102.091 104.244 102.463 104.328 102.895 104.328C103.239 104.328 103.571 104.276 103.891 104.172C104.219 104.06 104.527 103.88 104.815 103.632L105.151 104.316C104.887 104.556 104.551 104.748 104.143 104.892C103.735 105.036 103.319 105.108 102.895 105.108ZM106.678 105V99.168H107.626V100.464H107.494C107.59 100.168 107.73 99.916 107.914 99.708C108.106 99.492 108.33 99.332 108.586 99.228C108.85 99.116 109.138 99.06 109.45 99.06C109.946 99.06 110.346 99.18 110.65 99.42C110.962 99.652 111.17 100.016 111.274 100.512H111.094C111.238 100.064 111.494 99.712 111.862 99.456C112.238 99.192 112.674 99.06 113.17 99.06C113.61 99.06 113.97 99.144 114.25 99.312C114.538 99.48 114.754 99.736 114.898 100.08C115.042 100.416 115.114 100.844 115.114 101.364V105H114.142V101.412C114.142 100.876 114.05 100.484 113.866 100.236C113.682 99.98 113.37 99.852 112.93 99.852C112.618 99.852 112.342 99.928 112.102 100.08C111.87 100.232 111.69 100.448 111.562 100.728C111.442 101 111.382 101.324 111.382 101.7V105H110.41V101.412C110.41 100.876 110.314 100.484 110.122 100.236C109.938 99.98 109.63 99.852 109.198 99.852C108.878 99.852 108.602 99.928 108.37 100.08C108.138 100.232 107.958 100.448 107.83 100.728C107.71 101 107.65 101.324 107.65 101.7V105H106.678ZM122.702 105.108C122.062 105.108 121.518 104.944 121.07 104.616C120.63 104.28 120.298 103.788 120.074 103.14C119.85 102.492 119.738 101.7 119.738 100.764C119.738 99.82 119.85 99.028 120.074 98.388C120.298 97.74 120.63 97.252 121.07 96.924C121.518 96.596 122.062 96.432 122.702 96.432C123.35 96.432 123.894 96.596 124.334 96.924C124.774 97.252 125.106 97.736 125.33 98.376C125.554 99.016 125.666 99.808 125.666 100.752C125.666 101.696 125.554 102.492 125.33 103.14C125.106 103.788 124.774 104.28 124.334 104.616C123.894 104.944 123.35 105.108 122.702 105.108ZM122.702 104.256C123.374 104.256 123.87 103.972 124.19 103.404C124.518 102.836 124.682 101.952 124.682 100.752C124.682 99.552 124.522 98.676 124.202 98.124C123.882 97.564 123.382 97.284 122.702 97.284C122.038 97.284 121.542 97.564 121.214 98.124C120.886 98.684 120.722 99.56 120.722 100.752C120.722 101.952 120.882 102.836 121.202 103.404C121.53 103.972 122.03 104.256 122.702 104.256ZM129.897 105.108C128.945 105.108 128.205 104.904 127.677 104.496C127.149 104.08 126.885 103.5 126.885 102.756C126.885 102.364 126.965 102.016 127.125 101.712C127.285 101.4 127.509 101.148 127.797 100.956C128.085 100.764 128.417 100.644 128.793 100.596V100.776C128.449 100.696 128.149 100.56 127.893 100.368C127.637 100.168 127.437 99.924 127.293 99.636C127.157 99.348 127.089 99.032 127.089 98.688C127.089 97.976 127.341 97.424 127.845 97.032C128.357 96.632 129.041 96.432 129.897 96.432C130.761 96.432 131.445 96.632 131.949 97.032C132.461 97.424 132.717 97.976 132.717 98.688C132.717 99.032 132.645 99.352 132.501 99.648C132.365 99.936 132.169 100.176 131.913 100.368C131.657 100.56 131.357 100.692 131.013 100.764V100.596C131.389 100.644 131.717 100.768 131.997 100.968C132.285 101.16 132.509 101.408 132.669 101.712C132.829 102.016 132.909 102.364 132.909 102.756C132.909 103.5 132.645 104.08 132.117 104.496C131.589 104.904 130.849 105.108 129.897 105.108ZM129.897 104.292C130.577 104.292 131.089 104.16 131.433 103.896C131.785 103.632 131.961 103.232 131.961 102.696C131.961 102.168 131.785 101.776 131.433 101.52C131.089 101.256 130.577 101.124 129.897 101.124C129.225 101.124 128.713 101.256 128.361 101.52C128.009 101.776 127.833 102.168 127.833 102.696C127.833 103.232 128.009 103.632 128.361 103.896C128.713 104.16 129.225 104.292 129.897 104.292ZM129.897 100.308C130.489 100.308 130.949 100.172 131.277 99.9C131.605 99.628 131.769 99.252 131.769 98.772C131.769 98.292 131.605 97.92 131.277 97.656C130.949 97.384 130.489 97.248 129.897 97.248C129.313 97.248 128.857 97.384 128.529 97.656C128.201 97.92 128.037 98.292 128.037 98.772C128.037 99.252 128.201 99.628 128.529 99.9C128.857 100.172 129.313 100.308 129.897 100.308ZM134.032 105.756L133.264 105.528L136.336 95.976L137.116 96.204L134.032 105.756ZM138.379 105V104.16H140.311V97.392H140.827L138.787 98.688L138.367 97.956L140.587 96.54H141.295V104.16H143.107V105H138.379ZM145.574 105V104.16H147.506V97.392H148.022L145.982 98.688L145.562 97.956L147.782 96.54H148.49V104.16H150.302V105H145.574Z"
              fill="#E2DFF1"
              fillOpacity={0.8}
            />
          </svg>
        </div>
      </aside>

      {/* Backdrop for mobile drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA                                                         */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1440px]">
        {isMentorinaChatOpen ? (
          <MentorinaChat
            userName={userName}
            initialQuestion={mentorinaActiveQuestion}
            onSessionExpired={onSessionExpired}
            context={
              mentorinaActiveQuestion
                ? `ENEM ${mentorinaActiveQuestion.year} · ${mentorinaActiveQuestion.discipline}`
                : activeTab === "redacao"
                  ? selectedEssayFeedback
                    ? `Redação: ${selectedEssayFeedback.theme} (Nota: ${selectedEssayFeedback.score})`
                    : "Redação"
                  : activeTab === "simulados"
                    ? "Simulados"
                    : activeTab === "trilha"
                      ? selectedModule && MODULES_DATA[selectedModule]
                        ? `Matemática · ${MODULES_DATA[selectedModule].name}`
                        : "Matemática"
                      : prioritySubjects[0] || "Matemática"
            }
            onClose={() => {
              setIsMentorinaChatOpen(false)
              setMentorinaActiveQuestion(undefined)
            }}
          />
        ) : (
          <div
            className={`w-full ${
              (activeTab === "trilha" && selectedModule) ||
              (activeTab === "perfil" && (isEditingTrack || isChangingPassword))
                ? "max-w-[1184px]"
                : "max-w-[1120px]"
            }`}
          >
            {/* ======================================================================= */}
            {/* TOP HEADER AREA (Olá, {userName}! + Actions)                            */}
            {/* Hidden on Module Detail view to match the exact 1184x808 Figma canvas   */}
            {/* and on Editar Trilha / Alterar Senha to match exact Figma canvases      */}
            {/* and on Redação Feedback view                                            */}
            {/* ======================================================================= */}
            {!(activeTab === "trilha" && selectedModule) &&
              !(
                activeTab === "perfil" &&
                (isEditingTrack || isChangingPassword)
              ) &&
              !(activeTab === "redacao" && selectedEssayFeedback) &&
              !(activeTab === "simulados" && selectedExamResult) && (
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[#17152E]">
                      {activeTab === "trilha"
                        ? "Minha Trilha"
                        : activeTab === "perfil"
                          ? "Perfil"
                          : activeTab === "redacao"
                            ? "Redação"
                            : activeTab === "simulados"
                              ? "Simulados"
                              : `Olá, ${userName}!`}
                    </h1>
                    <p className="text-sm text-[#5F5B7D] mt-0.5 font-medium">
                      {activeTab === "trilha"
                        ? `Meta: ${targetCourse || "Medicina"}`
                        : activeTab === "perfil"
                          ? "Sua conta, sua trilha e suas preferências."
                          : activeTab === "redacao"
                            ? "Oficina de Redação Nota 1000"
                            : activeTab === "simulados"
                              ? "Treine com questões reais do ENEM e cronômetro, como no dia da prova."
                              : "Bora continuar de onde parou?"}
                    </p>
                  </div>

                  {/* Action buttons on right */}
                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {/* Notification Bell */}
                    <button
                      type="button"
                      className="w-10 h-10 rounded-full bg-white border border-[#E2DFF1] flex items-center justify-center text-[#5F5B7D] hover:text-[#4F3CF0] hover:border-[#4F3CF0] transition relative cursor-pointer shadow-2xs"
                      aria-label="Notificações"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                      </svg>
                      <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C6F432] ring-2 ring-white" />
                    </button>

                    {/* Help / FAQ */}
                    <button
                      type="button"
                      className="w-10 h-10 rounded-full bg-white border border-[#E2DFF1] flex items-center justify-center text-[#5F5B7D] hover:text-[#4F3CF0] hover:border-[#4F3CF0] transition cursor-pointer shadow-2xs"
                      aria-label="Ajuda e Suporte"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </button>

                    {/* User Avatar & Logout Dropdown */}
                    <div className="relative group">
                      <button
                        type="button"
                        className="w-10 h-10 rounded-full bg-[#E9E6FF] border-2 border-white flex items-center justify-center text-[#4F3CF0] font-black text-sm cursor-pointer shadow-xs group-hover:ring-2 group-hover:ring-[#4F3CF0] transition"
                        aria-label="Menu do usuário"
                      >
                        {userName.charAt(0).toUpperCase()}
                      </button>

                      {/* Quick Profile Popover on hover/focus */}
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-[#E2DFF1] py-2 hidden group-hover:block group-focus-within:block z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-4 py-2 border-b border-[#E2DFF1]">
                          <p className="text-xs font-bold text-[#17152E] truncate">
                            {userName}
                          </p>
                          <p className="text-[11px] text-[#5F5B7D] truncate">
                            {userEmail || "aluno@edumentor.ai"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition flex items-center gap-2 cursor-pointer"
                        >
                          Sair da Conta
                        </button>
                      </div>
                    </div>
                  </div>
                </header>
              )}

            {/* ======================================================================= */}
            {/* TAB: INÍCIO (Exact Layout from SVG Mockup 1440x900)                     */}
            {/* ======================================================================= */}
            {activeTab === "inicio" && (
              <>
                {/* ROW 1: SEU NÍVEL · NIVELAMENTO & SUA SEMANA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  {/* CARD 1: SEU NÍVEL · NIVELAMENTO ou SUAS MATÉRIAS PRIORITÁRIAS */}
                  {startMode === "materias" ? (
                    /* CARD 1 (MODO MATÉRIAS): SUAS MATÉRIAS PRIORITÁRIAS (Exact 539x194 SVG Design) */
                    <div className="w-full lg:h-[226px] bg-[#E9E6FF] rounded-[20px] p-6 lg:p-7 flex flex-col justify-between shadow-xs">
                      {/* Top: Header Label & Subject Pills */}
                      <div>
                        <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[#4F3CF0]">
                          SUAS MATÉRIAS PRIORITÁRIAS
                        </span>

                        <div className="flex flex-wrap items-center gap-2.5 mt-3">
                          {/* Pill 1: 1° MATEMÁTICA (fill #4F3CF0, white text, rx 16) */}
                          <span className="inline-flex items-center justify-center px-4 h-8 rounded-full bg-[#4F3CF0] text-white text-[12px] font-bold uppercase tracking-wider shadow-xs">
                            1° {prioritySubjects[0] || "Matemática"}
                          </span>

                          {/* Pill 2: 2° NATUREZA (fill white, #17152E text, rx 16) */}
                          <span className="inline-flex items-center justify-center px-4 h-8 rounded-full bg-white text-[#17152E] text-[12px] font-bold uppercase tracking-wider shadow-xs">
                            2° {prioritySubjects[1] || "Natureza"}
                          </span>
                        </div>
                      </div>

                      {/* Bottom: Current Track Title & Progress Bar */}
                      <div className="mt-4 lg:mt-0">
                        <h2 className="text-[20px] lg:text-[22px] font-bold text-[#17152E] tracking-tight leading-tight">
                          Trilha atual: {prioritySubjects[0] || "Matemática"}
                        </h2>

                        {/* Progress Bar (40% completed, track 300px x 8px) */}
                        <div className="w-[300px] max-w-full h-2 bg-white rounded-full overflow-hidden mt-3">
                          <div
                            className="h-full bg-[#4F3CF0] rounded-full"
                            style={{ width: "40%" }}
                          />
                        </div>

                        <p className="text-[13px] font-medium text-[#5F5B7D] mt-2">
                          40% concluído · {prioritySubjects[1] || "Natureza"}{" "}
                          libera ao terminar
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* CARD 1 (MODO NIVELAMENTO): SEU NÍVEL · NIVELAMENTO */
                    <div className="w-full lg:h-[226px] bg-[#E9E6FF] rounded-[20px] p-6 flex flex-col justify-between shadow-xs">
                      {/* Header */}
                      <div>
                        <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[#4F3CF0]">
                          SEU NÍVEL · NIVELAMENTO
                        </span>
                        <h2 className="text-[22px] font-bold text-[#17152E] mt-0.5 tracking-tight leading-tight">
                          Intermediário
                        </h2>
                      </div>

                      {/* 4 Subject Progress Bars (Exact percentages: 60%, 45%, 70%, 55%) */}
                      <div className="space-y-3.5">
                        {/* Matemática (60%) */}
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-medium text-[#17152E] w-[84px] shrink-0">
                            Matemática
                          </span>
                          <div className="w-[170px] h-2 bg-white rounded-full overflow-hidden shrink-0">
                            <div
                              className="h-full bg-[#4F3CF0] rounded-full"
                              style={{ width: "60%" }}
                            />
                          </div>
                          <span className="text-[13px] font-medium text-[#5F5B7D]">
                            60%
                          </span>
                        </div>

                        {/* Natureza (45%) */}
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-medium text-[#17152E] w-[84px] shrink-0">
                            Natureza
                          </span>
                          <div className="w-[170px] h-2 bg-white rounded-full overflow-hidden shrink-0">
                            <div
                              className="h-full bg-[#4F3CF0] rounded-full"
                              style={{ width: "45%" }}
                            />
                          </div>
                          <span className="text-[13px] font-medium text-[#5F5B7D]">
                            45%
                          </span>
                        </div>

                        {/* Linguagens (70%) */}
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-medium text-[#17152E] w-[84px] shrink-0">
                            Linguagens
                          </span>
                          <div className="w-[170px] h-2 bg-white rounded-full overflow-hidden shrink-0">
                            <div
                              className="h-full bg-[#4F3CF0] rounded-full"
                              style={{ width: "70%" }}
                            />
                          </div>
                          <span className="text-[13px] font-medium text-[#5F5B7D]">
                            70%
                          </span>
                        </div>

                        {/* Humanas (55%) */}
                        <div className="flex items-center gap-3">
                          <span className="text-[13px] font-medium text-[#17152E] w-[84px] shrink-0">
                            Humanas
                          </span>
                          <div className="w-[170px] h-2 bg-white rounded-full overflow-hidden shrink-0">
                            <div
                              className="h-full bg-[#4F3CF0] rounded-full"
                              style={{ width: "55%" }}
                            />
                          </div>
                          <span className="text-[13px] font-medium text-[#5F5B7D]">
                            55%
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CARD 2: SUA SEMANA */}
                  <div className="w-full lg:h-[226px] bg-white border border-[#E2DFF1] rounded-[20px] p-6 lg:p-8 shadow-xs flex flex-col justify-start">
                    {/* Header & Hours Progress */}
                    <div className="flex items-center justify-between">
                      <h2 className="text-[20px] font-bold text-[#17152E] tracking-tight leading-tight">
                        Sua semana
                      </h2>
                      <span className="text-[14px] font-semibold text-[#4F3CF0]">
                        15h de 25h
                      </span>
                    </div>

                    {/* Progress bar: 15h / 25h (60%, track 280px x 10px) */}
                    <div className="w-[280px] max-w-full h-[10px] bg-[#E9E6FF] rounded-full overflow-hidden mt-4">
                      <div
                        className="h-full bg-[#4F3CF0] rounded-full"
                        style={{ width: "60%" }}
                      />
                    </div>

                    {/* Days of the Week: 7 circles 34x34 with exact spacing */}
                    <div className="flex items-center gap-2 mt-3.5">
                      {/* Seg (Checked) */}
                      <div className="w-[34px] h-[34px] rounded-full bg-[#4F3CF0] flex items-center justify-center shrink-0">
                        <svg
                          width="34"
                          height="34"
                          viewBox="0 0 34 34"
                          fill="none"
                        >
                          <path
                            d="M22.333 13L15 20.333L11.667 17"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Ter (Checked) */}
                      <div className="w-[34px] h-[34px] rounded-full bg-[#4F3CF0] flex items-center justify-center shrink-0">
                        <svg
                          width="34"
                          height="34"
                          viewBox="0 0 34 34"
                          fill="none"
                        >
                          <path
                            d="M22.333 13L15 20.333L11.667 17"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Qua (Checked) */}
                      <div className="w-[34px] h-[34px] rounded-full bg-[#4F3CF0] flex items-center justify-center shrink-0">
                        <svg
                          width="34"
                          height="34"
                          viewBox="0 0 34 34"
                          fill="none"
                        >
                          <path
                            d="M22.333 13L15 20.333L11.667 17"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Qui (Light Purple circle) */}
                      <div className="w-[34px] h-[34px] rounded-full bg-[#E9E6FF] text-[#5F5B7D] font-semibold text-[13px] flex items-center justify-center shrink-0">
                        Q
                      </div>

                      {/* Sex (Light Purple circle) */}
                      <div className="w-[34px] h-[34px] rounded-full bg-[#E9E6FF] text-[#5F5B7D] font-semibold text-[13px] flex items-center justify-center shrink-0">
                        S
                      </div>

                      {/* Sáb (White with border #E2DFF1) */}
                      <div className="w-[34px] h-[34px] rounded-full bg-white border border-[#E2DFF1] text-[#5F5B7D] font-semibold text-[13px] flex items-center justify-center shrink-0">
                        S
                      </div>

                      {/* Dom (White with border #E2DFF1) */}
                      <div className="w-[34px] h-[34px] rounded-full bg-white border border-[#E2DFF1] text-[#5F5B7D] font-semibold text-[13px] flex items-center justify-center shrink-0">
                        D
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 2: PRÓXIMA TAREFA + REVISÕES DE HOJE (Exact 1120x190 SVG Design) */}
                <div className="flex flex-col lg:flex-row gap-6 items-start mt-6">
                  {/* CARD 1: PRÓXIMA TAREFA (Width 676px, Height 136px, rx 20) */}
                  <div
                    onClick={() => openModule("modulo-2")}
                    className="w-full lg:flex-1 lg:h-[136px] bg-white border border-[#E2DFF1] rounded-[20px] p-5 sm:p-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md hover:border-[#4F3CF0]/60 transition cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Book Icon Box (w 52px, h 52px, rx 12, fill #4F3CF0) */}
                      <div className="w-[52px] h-[52px] rounded-[12px] bg-[#4F3CF0] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition">
                        <svg
                          width="22"
                          height="22"
                          viewBox="46 56 22 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M49.3333 75.5833V60.4167C49.3333 59.842 49.5615 59.2909 49.9679 58.8846C50.3742 58.4783 50.9253 58.25 51.4999 58.25H65.5833V75.5833H51.4999C50.9253 75.5833 50.3742 75.8116 49.9679 76.2179C49.5615 76.6243 49.3333 77.1754 49.3333 77.75V75.5833Z"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M53.6667 62.5833H61.2501"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Texts: PRÓXIMA TAREFA / Funções do 1º grau / Matemática · Módulo 2 · 30 min */}
                      <div>
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#5F5B7D]">
                          PRÓXIMA TAREFA
                        </span>
                        <h3 className="text-xl font-bold text-[#17152E] group-hover:text-[#4F3CF0] transition tracking-tight leading-snug mt-0.5">
                          Funções do 1º grau
                        </h3>
                        <p className="text-xs text-[#5F5B7D] font-medium mt-1">
                          Matemática · Módulo 2 · 30 min
                        </p>
                      </div>
                    </div>

                    {/* Pill Action Button: Continuar (w 248px, h 48px, rx 24) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        openModule("modulo-2")
                      }}
                      className="w-full sm:w-[248px] h-[48px] rounded-full bg-[#4F3CF0] hover:bg-[#3D2CD8] text-white flex items-center justify-center gap-2.5 font-semibold text-sm transition cursor-pointer shadow-xs active:scale-95 shrink-0"
                    >
                      <svg
                        width="14"
                        height="16"
                        viewBox="432 60 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M433.833 61.3333L444.667 68L433.833 74.6667V61.3333Z"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span>Continuar</span>
                    </button>
                  </div>

                  {/* CARD 2: REVISÕES DE HOJE (Width 420px, Height 190px, rx 20) */}
                  <div className="w-full lg:w-[420px] lg:h-[190px] shrink-0 bg-white border border-[#E2DFF1] rounded-[20px] overflow-hidden shadow-sm flex flex-col justify-between">
                    {/* Header (h 58px) */}
                    <div className="h-[58px] px-6 flex items-center">
                      <h3 className="text-[18px] font-bold text-[#17152E] tracking-tight">
                        Revisões de hoje
                      </h3>
                    </div>

                    {/* Divider 1 */}
                    <div className="w-full h-px bg-[#E2DFF1]" />

                    {/* Item 1: Geometria (h 66px) */}
                    <button
                      type="button"
                      onClick={() => alert("Abrindo revisão: Geometria...")}
                      className="w-full h-[66px] px-6 flex items-center justify-between hover:bg-[#F7F6FC] transition cursor-pointer group text-left"
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Repeat/Reload Icon Box (w 36px, h 36px, rx 12, fill #E9E6FF) */}
                        <div className="w-[36px] h-[36px] rounded-[12px] bg-[#E9E6FF] flex items-center justify-center shrink-0">
                          <svg
                            width="16"
                            height="16"
                            viewBox="734 83 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M748 90.25C747.985 88.8628 747.49 87.5236 746.599 86.4604C745.708 85.3971 744.476 84.6756 743.112 84.4185C741.749 84.1615 740.339 84.3847 739.122 85.0504C737.904 85.7161 736.956 86.7829 736.436 88.0695C735.917 89.356 735.86 90.7826 736.274 92.1066C736.689 93.4306 737.549 94.5701 738.709 95.3312C739.869 96.0922 741.257 96.4278 742.636 96.2808C744.016 96.1339 745.302 95.5134 746.275 94.525M743.5 90.25H748V85.75"
                              stroke="#4F3CF0"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-[#17152E] group-hover:text-[#4F3CF0] transition">
                            Geometria
                          </h4>
                          <p className="text-xs text-[#5F5B7D] font-normal">
                            10 min · revisão espaçada
                          </p>
                        </div>
                      </div>

                      {/* Chevron Right */}
                      <svg
                        width="6"
                        height="11"
                        viewBox="1083 85 8 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1084.75 86.5L1089.25 91L1084.75 95.5"
                          stroke="#8C88AA"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* Divider 2 */}
                    <div className="w-full h-px bg-[#E2DFF1]" />

                    {/* Item 2: Redação: reescrever introdução (h 66px) */}
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "Abrindo revisão: Redação: reescrever introdução...",
                        )
                      }
                      className="w-full h-[66px] px-6 flex items-center justify-between hover:bg-[#F7F6FC] transition cursor-pointer group text-left"
                    >
                      <div className="flex items-center gap-3.5">
                        {/* Pencil Icon Box (w 36px, h 36px, rx 12, fill #E9E6FF) */}
                        <div className="w-[36px] h-[36px] rounded-[12px] bg-[#E9E6FF] flex items-center justify-center shrink-0">
                          <svg
                            width="16"
                            height="16"
                            viewBox="734 150 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M736 163H739L747.25 154.75L744.25 151.75L736 160V163Z"
                              stroke="#4F3CF0"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M742.75 153.25L745.75 156.25"
                              stroke="#4F3CF0"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-[#17152E] group-hover:text-[#4F3CF0] transition">
                            Redação: reescrever introdução
                          </h4>
                          <p className="text-xs text-[#5F5B7D] font-normal">
                            20 min
                          </p>
                        </div>
                      </div>

                      {/* Chevron Right */}
                      <svg
                        width="6"
                        height="11"
                        viewBox="1083 151 8 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1084.75 152.5L1089.25 157L1084.75 161.5"
                          stroke="#8C88AA"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* ROW 3: TRÊS CARDS DE ACESSO RÁPIDO (Estudar, Simulado, Redação - Exact 1120x112 SVG Design) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  {/* CARD 1: ESTUDAR (Width 357.33px, Height 112px, rx 20) */}
                  <button
                    type="button"
                    onClick={() => openModule("modulo-2")}
                    className="w-full h-[112px] bg-white border border-[#E2DFF1] rounded-[20px] px-6 sm:px-8 flex items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer group text-left active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Book Icon Box (w 48px, h 48px, rx 12, fill #E9E6FF) */}
                      <div className="w-[48px] h-[48px] rounded-[12px] bg-[#E9E6FF] flex items-center justify-center shrink-0">
                        <svg
                          width="18"
                          height="20"
                          viewBox="46 45 19 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M48 63V49C48 48.4696 48.2107 47.9609 48.5858 47.5858C48.9609 47.2107 49.4696 47 50 47H63V63H50C49.4696 63 48.9609 63.2107 48.5858 63.5858C48.2107 63.9609 48 64.4696 48 65V63Z"
                            stroke="#4F3CF0"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M52 51H59"
                            stroke="#4F3CF0"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Texts: Estudar / Continuar a trilha de Matemática */}
                      <div className="min-w-0">
                        <h4 className="text-[17px] font-bold text-[#17152E] group-hover:text-[#4F3CF0] transition tracking-tight truncate">
                          Estudar
                        </h4>
                        <p className="text-xs text-[#5F5B7D] font-medium mt-0.5 truncate">
                          Continuar a trilha de Matemática
                        </p>
                      </div>
                    </div>

                    {/* Chevron Right */}
                    <svg
                      width="7"
                      height="12"
                      viewBox="311 49 9 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 text-[#8C88AA] group-hover:text-[#4F3CF0] group-hover:translate-x-0.5 transition ml-2"
                    >
                      <path
                        d="M312.833 51L317.833 56L312.833 61"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* CARD 2: SIMULADO (Width 357.33px, Height 112px, rx 20) */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("simulados")}
                    className="w-full h-[112px] bg-white border border-[#E2DFF1] rounded-[20px] px-6 sm:px-8 flex items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer group text-left active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Stopwatch Icon Box (w 48px, h 48px, rx 12, fill #FCE8E8) */}
                      <div className="w-[48px] h-[48px] rounded-[12px] bg-[#FCE8E8] flex items-center justify-center shrink-0">
                        <svg
                          width="18"
                          height="21"
                          viewBox="427 44 20 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M445.333 57C445.333 61.4183 441.752 65 437.333 65C432.915 65 429.333 61.4183 429.333 57C429.333 52.5817 432.915 49 437.333 49C441.752 49 445.333 52.5817 445.333 57Z"
                            stroke="#17152E"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M437.333 53V57L439.333 59M434.333 46H440.333"
                            stroke="#17152E"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Texts: Simulado / Questões reais com cronômetro */}
                      <div className="min-w-0">
                        <h4 className="text-[17px] font-bold text-[#17152E] group-hover:text-[#4F3CF0] transition tracking-tight truncate">
                          Simulado
                        </h4>
                        <p className="text-xs text-[#5F5B7D] font-medium mt-0.5 truncate">
                          Questões reais com cronômetro
                        </p>
                      </div>
                    </div>

                    {/* Chevron Right */}
                    <svg
                      width="7"
                      height="12"
                      viewBox="692 49 9 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 text-[#8C88AA] group-hover:text-[#4F3CF0] group-hover:translate-x-0.5 transition ml-2"
                    >
                      <path
                        d="M694.167 51L699.167 56L694.167 61"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* CARD 3: REDAÇÃO (Width 357.33px, Height 112px, rx 20) */}
                  <button
                    type="button"
                    onClick={() => setActiveTab("redacao")}
                    className="w-full h-[112px] bg-white border border-[#E2DFF1] rounded-[20px] px-6 sm:px-8 flex items-center justify-between shadow-sm hover:shadow-md transition cursor-pointer group text-left active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      {/* Edit/Pencil Icon Box (w 48px, h 48px, rx 12, fill #3CC8F0) */}
                      <div className="w-[48px] h-[48px] rounded-[12px] bg-[#3CC8F0] flex items-center justify-center shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="808 47 20 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M810.667 64H814.667L825.667 53L821.667 49L810.667 60V64Z"
                            stroke="#17152E"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M819.667 51L823.667 55"
                            stroke="#17152E"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>

                      {/* Texts: Redação / Tema da semana disponível */}
                      <div className="min-w-0">
                        <h4 className="text-[17px] font-bold text-[#17152E] group-hover:text-[#4F3CF0] transition tracking-tight truncate">
                          Redação
                        </h4>
                        <p className="text-xs text-[#5F5B7D] font-medium mt-0.5 truncate">
                          Tema da semana disponível
                        </p>
                      </div>
                    </div>

                    {/* Chevron Right */}
                    <svg
                      width="7"
                      height="12"
                      viewBox="1073 49 9 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="shrink-0 text-[#8C88AA] group-hover:text-[#4F3CF0] group-hover:translate-x-0.5 transition ml-2"
                    >
                      <path
                        d="M1075.5 51L1080.5 56L1075.5 61"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}

            {/* ======================================================================= */}
            {/* TAB: TRILHA (Adaptive Study Roadmap & Module Detail View)               */}
            {/* ======================================================================= */}
            {activeTab === "trilha" &&
              (selectedModule ? (
                /* ===================================================================== */
                /* DETALHE DO MÓDULO (Exact Layout from SVG Mockup 1184x808)             */
                /* ===================================================================== */
                (() => {
                  const currentModule =
                    (selectedModule && MODULES_DATA[selectedModule]) ||
                    MODULES_DATA["modulo-2"]
                  const submodules = currentModule.submodules || []
                  const currentSubmodule = submodules.find(
                    (s) => s.id === selectedSubmodule,
                  ) ||
                    submodules[0] || {
                      id: 1,
                      number: 1,
                      shortName: "1. Introdução",
                      fullName: currentModule.title,
                      resumoBadge: currentModule.resumoBadge,
                      resumoText: currentModule.resumoText,
                      exemploTitle: currentModule.exemploTitle,
                      exemploBadge: currentModule.exemploBadge,
                      exemploText: currentModule.exemploText,
                      questions: [],
                    }
                  const questions = currentSubmodule.questions || []
                  const solvedCount = questions.filter(
                    (q) =>
                      !!completedQuestions[
                        `${selectedModule}_${currentSubmodule.id}_${q.id}`
                      ],
                  ).length

                  return (
                    <div className="w-full max-w-[1120px] mx-auto space-y-6 animate-in fade-in duration-200">
                      {/* 1. TOP BREADCRUMB (< Trilha > Matemática > currentModule.name) */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedModule(null)
                            if (typeof window !== "undefined") {
                              window.scrollTo({ top: 0, behavior: "instant" })
                              document.documentElement.scrollTop = 0
                              document.body.scrollTop = 0
                            }
                          }}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-[#17152E] hover:text-[#4F3CF0] transition cursor-pointer group"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#17152E"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="group-hover:-translate-x-0.5 transition-transform"
                          >
                            <polyline points="15 18 9 12 15 6" />
                          </svg>
                          <span className="font-medium text-[#5F5B7D] group-hover:text-[#4F3CF0] transition">
                            Trilha
                          </span>
                          <span className="text-[#8C88AA]">&gt;</span>
                          <span className="font-medium text-[#5F5B7D]">
                            Matemática
                          </span>
                          <span className="text-[#8C88AA]">&gt;</span>
                          <span className="font-bold text-[#17152E]">
                            {currentModule.name}
                          </span>
                        </button>
                      </div>

                      {/* 2. Header Bar matching SVG 1120x58 */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-bold text-[#4F3CF0] tracking-wide">
                              {currentModule.number === 2
                                ? `Módulo 2 . Tópico ${currentSubmodule.number} de ${submodules.length}`
                                : `Módulo ${currentModule.number} . Tópico ${currentSubmodule.number} de ${submodules.length}`}
                            </span>
                            {submodules.length > 1 && (
                              <div className="inline-flex items-center gap-1 ml-1.5">
                                <button
                                  type="button"
                                  disabled={currentSubmodule.number <= 1}
                                  onClick={() => {
                                    setSelectedSubmodule((prev) =>
                                      Math.max(1, prev - 1),
                                    )
                                    setActiveQuestionIndex(0)
                                    setSelectedOption(null)
                                    setShowExplanation(false)
                                  }}
                                  className="w-5 h-5 rounded-md bg-[#E9E6FF] hover:bg-[#DDD8FD] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#4F3CF0] transition cursor-pointer"
                                  title="Tópico anterior"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="15 18 9 12 15 6" />
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  disabled={
                                    currentSubmodule.number >= submodules.length
                                  }
                                  onClick={() => {
                                    setSelectedSubmodule((prev) =>
                                      Math.min(submodules.length, prev + 1),
                                    )
                                    setActiveQuestionIndex(0)
                                    setSelectedOption(null)
                                    setShowExplanation(false)
                                  }}
                                  className="w-5 h-5 rounded-md bg-[#E9E6FF] hover:bg-[#DDD8FD] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-[#4F3CF0] transition cursor-pointer"
                                  title="Próximo tópico"
                                >
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="9 18 15 12 9 6" />
                                  </svg>
                                </button>
                              </div>
                            )}
                          </div>
                          <h2 className="text-2xl sm:text-3xl font-black text-[#17152E] tracking-tight mt-0.5">
                            {currentSubmodule.fullName}
                          </h2>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const topicKey = `${selectedModule}_${currentSubmodule.id}`
                            setCompletedTopics((prev) => ({
                              ...prev,
                              [topicKey]: !prev[topicKey],
                            }))
                          }}
                          className={`w-full sm:w-[204px] h-[48px] rounded-full font-bold text-sm flex items-center justify-center gap-2.5 transition cursor-pointer shadow-xs active:scale-95 shrink-0 ${
                            completedTopics[
                              `${selectedModule}_${currentSubmodule.id}`
                            ]
                              ? "bg-[#C6F432] text-[#17152E]"
                              : "bg-[#E9E6FF] hover:bg-[#DDD8FD] text-[#17152E]"
                          }`}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#17152E"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>
                            {completedTopics[
                              `${selectedModule}_${currentSubmodule.id}`
                            ]
                              ? "Tópico Concluído!"
                              : "Concluir Tópico"}
                          </span>
                        </button>
                      </div>

                      {/* 3. EXACT 2-COLUMN LAYOUT (1120 x 526 SVG: Left 576px, Right 520px) */}
                      <div className="grid grid-cols-1 lg:grid-cols-[576px_520px] gap-6 items-start">
                        {/* Left Column (576px wide): Card Resumo (top) + Card Exemplo (bottom) */}
                        <div className="space-y-6">
                          {/* CARD 1: RESUMO (White, border #E2DFF1, rx 20, min-h-[174px]) */}
                          <div className="w-full bg-white border border-[#E2DFF1] rounded-[20px] p-6 lg:p-7 shadow-xs min-h-[174px] flex flex-col justify-start">
                            <h3 className="text-xl font-black text-[#17152E] tracking-tight uppercase">
                              RESUMO
                            </h3>
                            <div className="mt-3.5 space-y-1.5 text-xs sm:text-[13.5px] leading-relaxed text-[#17152E] font-medium">
                              {currentSubmodule.resumoText
                                .split("\n")
                                .map((line, idx) => (
                                  <p key={idx}>{line}</p>
                                ))}
                            </div>
                          </div>

                          {/* CARD 2: EXEMPLO (Lilac #E9E6FF, rx 20, min-h-[122px]) */}
                          <div className="w-full bg-[#E9E6FF] rounded-[20px] p-6 lg:p-7 shadow-xs min-h-[122px] flex flex-col justify-start">
                            <h3 className="text-xl font-black text-[#17152E] tracking-tight uppercase">
                              EXEMPLO
                            </h3>
                            <div className="mt-3 space-y-1 text-xs sm:text-[13.5px] leading-relaxed text-[#17152E] font-medium">
                              {currentSubmodule.exemploText
                                .split("\n")
                                .map((line, idx) => (
                                  <p key={idx}>{line}</p>
                                ))}
                            </div>
                          </div>
                        </div>

                        {/* Right Column (520px wide): Card de Questão Interativo (min-h-[526px]) */}
                        {(() => {
                          const activeQuestion = questions[
                            activeQuestionIndex
                          ] ||
                            questions[0] || {
                              id: 1,
                              title: "ENEM - Questão 1",
                              year: "ENEM 2023",
                              difficulty: "Fácil",
                              tri: 690,
                              statement:
                                "Qual é a forma geral da função do 1º grau?",
                              options: [
                                "f(x) = ax + b",
                                "f(x) = ax²",
                                "f(x) = a / x",
                                "f(x) = aˣ",
                              ],
                              correctIndex: 0,
                              explanation:
                                'A forma geral é f(x) = ax + b: "a" é o coeficiente angular e "b" o linear.',
                            }
                          const optionLetters = ["A", "B", "C", "D", "E"]
                          const currentQKey = `${selectedModule}_${currentSubmodule.id}_${activeQuestion.id}`

                          const goToQuestion = (targetIdx: number) => {
                            if (
                              targetIdx < 0 ||
                              targetIdx >= (questions.length || 8)
                            )
                              return
                            setActiveQuestionIndex(targetIdx)
                            const targetQ = questions[targetIdx]
                            if (!targetQ) return
                            const qKey = `${selectedModule}_${currentSubmodule.id}_${targetQ.id}`
                            const savedAns = selectedAnswers[qKey]
                            if (savedAns !== undefined) {
                              setSelectedOption(savedAns)
                              setShowExplanation(true)
                            } else {
                              setSelectedOption(null)
                              setShowExplanation(false)
                            }
                          }

                          return (
                            <div className="w-full bg-white border border-[#E2DFF1] rounded-[20px] p-6 lg:p-7 shadow-xs min-h-[526px] flex flex-col justify-between">
                              <div>
                                {/* Header: QUESTÃO X DE 8 */}
                                <div className="flex items-center justify-between pb-3 border-b border-[#E2DFF1]/70">
                                  <span className="text-xs font-black tracking-wider text-[#4F3CF0] uppercase">
                                    {`QUESTÃO ${activeQuestionIndex + 1} DE ${questions.length || 8}`}
                                  </span>
                                </div>

                                {/* Statement */}
                                <h4 className="text-base sm:text-lg font-bold text-[#17152E] mt-4 leading-snug">
                                  {activeQuestion.statement}
                                </h4>

                                {/* Options A, B, C, D */}
                                <div className="mt-4 space-y-2.5">
                                  {activeQuestion.options.map((opt, idx) => {
                                    const isSelected = selectedOption === idx
                                    const isCorrect =
                                      idx === activeQuestion.correctIndex

                                    let containerClass =
                                      "border-[#E2DFF1] hover:border-[#4F3CF0]/60 hover:bg-[#F8F7FD] text-[#17152E]"
                                    let badgeClass =
                                      "bg-[#F4F2FC] text-[#5F5B7D] font-bold"

                                    if (showExplanation) {
                                      if (isCorrect) {
                                        containerClass =
                                          "border-[#137A51] bg-[#E3F5EC]/60 shadow-xs text-[#17152E]"
                                        badgeClass =
                                          "bg-[#137A51] text-white font-extrabold"
                                      } else if (isSelected) {
                                        containerClass =
                                          "border-[#DC2626] bg-[#FEE2E2]/60 text-[#17152E]"
                                        badgeClass =
                                          "bg-[#DC2626] text-white font-extrabold"
                                      } else {
                                        containerClass =
                                          "border-[#E2DFF1]/70 opacity-70 text-[#5F5B7D]"
                                        badgeClass =
                                          "bg-[#F4F2FC] text-[#8C88AA] font-bold"
                                      }
                                    } else if (isSelected) {
                                      containerClass =
                                        "border-[#4F3CF0] bg-[#E9E6FF]/50 text-[#17152E]"
                                      badgeClass =
                                        "bg-[#4F3CF0] text-white font-extrabold"
                                    }

                                    return (
                                      <button
                                        key={idx}
                                        type="button"
                                        onClick={() => {
                                          setSelectedOption(idx)
                                          setShowExplanation(true)
                                          const optIsCorrect =
                                            idx === activeQuestion.correctIndex
                                          const qKey = `${selectedModule}_${currentSubmodule.id}_${activeQuestion.id}`
                                          setSelectedAnswers((prev) => ({
                                            ...prev,
                                            [qKey]: idx,
                                          }))
                                          setQuestionResults((prev) => ({
                                            ...prev,
                                            [qKey]: optIsCorrect
                                              ? "acertei"
                                              : "errei",
                                          }))
                                          if (optIsCorrect) {
                                            setCompletedQuestions((prev) => ({
                                              ...prev,
                                              [qKey]: true,
                                            }))
                                          }
                                        }}
                                        className={`w-full text-left p-3 rounded-xl border flex items-center gap-3 transition cursor-pointer ${containerClass}`}
                                      >
                                        <span
                                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 transition ${badgeClass}`}
                                        >
                                          {optionLetters[idx] || `${idx + 1}`}
                                        </span>
                                        <span className="text-sm font-semibold">
                                          {opt}
                                        </span>
                                      </button>
                                    )
                                  })}
                                </div>

                                {/* Feedback / Explicação */}
                                {showExplanation && (
                                  <div
                                    className={`border rounded-xl p-3.5 mt-4 animate-in fade-in duration-200 ${
                                      selectedOption ===
                                      activeQuestion.correctIndex
                                        ? "bg-[#E3F5EC] border-[#137A51]/20"
                                        : "bg-[#FEE2E2] border-[#DC2626]/20"
                                    }`}
                                  >
                                    <div
                                      className={`flex items-center gap-2 text-sm font-bold ${
                                        selectedOption ===
                                        activeQuestion.correctIndex
                                          ? "text-[#137A51]"
                                          : "text-[#DC2626]"
                                      }`}
                                    >
                                      {selectedOption ===
                                      activeQuestion.correctIndex ? (
                                        <>
                                          <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                          </svg>
                                          <span>Você acertou!</span>
                                        </>
                                      ) : (
                                        <>
                                          <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          >
                                            <circle cx="12" cy="12" r="10" />
                                            <line
                                              x1="15"
                                              y1="9"
                                              x2="9"
                                              y2="15"
                                            />
                                            <line
                                              x1="9"
                                              y1="9"
                                              x2="15"
                                              y2="15"
                                            />
                                          </svg>
                                          <span>
                                            Você errou! Resposta correta:
                                            Alternativa{" "}
                                            {
                                              optionLetters[
                                                activeQuestion.correctIndex
                                              ]
                                            }
                                          </span>
                                        </>
                                      )}
                                    </div>
                                    <p className="mt-1.5 text-xs sm:text-[13px] text-[#17152E] font-medium leading-relaxed">
                                      {activeQuestion.explanation}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Actions: Anterior / Próxima (Exact SVG Mockup: width 456, height 48, rx 24) */}
                              <div className="grid grid-cols-2 gap-3.5 pt-4 mt-4 border-t border-[#E2DFF1]/70 w-full max-w-[456px] mx-auto">
                                <button
                                  type="button"
                                  disabled={activeQuestionIndex <= 0}
                                  onClick={() =>
                                    goToQuestion(activeQuestionIndex - 1)
                                  }
                                  className="h-[48px] rounded-full border-[1.5px] border-[#8C88AA] bg-white text-[#17152E] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#F7F6FC] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer active:scale-[0.99] shadow-2xs"
                                >
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="15 18 9 12 15 6" />
                                  </svg>
                                  <span>Anterior</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={
                                    activeQuestionIndex >=
                                    (questions.length || 8) - 1
                                  }
                                  onClick={() =>
                                    goToQuestion(activeQuestionIndex + 1)
                                  }
                                  className="h-[48px] rounded-full bg-[#4F3CF0] hover:bg-[#3E2DD6] text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer active:scale-[0.99] shadow-xs"
                                >
                                  <span>Próxima</span>
                                  <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="9 18 15 12 9 6" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  )
                })()
              ) : (
                /* ===================================================================== */
                /* VISÃO GERAL DA TRILHA (Lista de Módulos)                              */
                /* ===================================================================== */
                <div className="space-y-6">
                  {/* Subject Filter Pills */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      className="px-5 py-2 rounded-full font-bold text-sm bg-[#4F3CF0] text-white shadow-xs cursor-pointer transition"
                    >
                      Matemática
                    </button>
                    {[
                      { name: "Natureza" },
                      { name: "Linguagens" },
                      { name: "Humanas" },
                      { name: "Redação" },
                    ].map((sub) => (
                      <button
                        key={sub.name}
                        type="button"
                        title="Conclua a trilha de Matemática para desbloquear"
                        className="px-4 py-2 rounded-full font-semibold text-sm bg-[#E9E6FF] text-[#5F5B7D] hover:text-[#17152E] flex items-center gap-1.5 transition cursor-not-allowed opacity-90"
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#5F5B7D"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>{sub.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Informational Banner / Alert Bar */}
                  <div className="bg-white border border-[#E2DFF1] rounded-xl px-4 py-3 flex items-center gap-3 shadow-2xs">
                    <div className="w-7 h-7 rounded-lg bg-[#E9E6FF] flex items-center justify-center shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4F3CF0"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="3"
                          y="11"
                          width="18"
                          height="11"
                          rx="2"
                          ry="2"
                        />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#17152E]">
                      Uma trilha por vez: termine Matemática para liberar as
                      próximas matérias.
                    </p>
                  </div>

                  {/* Overall Progress Card */}
                  <div className="bg-white border border-[#E2DFF1] rounded-[20px] p-6 shadow-xs">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-xl font-black text-[#17152E] tracking-tight">
                        Matemática
                      </h3>
                      <span className="text-xs sm:text-sm font-extrabold text-[#4F3CF0]">
                        {moduleCompleted
                          ? "50% concluído · 3 de 6 módulos"
                          : "33% concluído · 2 de 6 módulos"}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#E9E6FF] rounded-full overflow-hidden mt-4">
                      <div
                        className="h-full bg-[#4F3CF0] rounded-full transition-all duration-500"
                        style={{ width: moduleCompleted ? "50%" : "33%" }}
                      />
                    </div>
                  </div>

                  {/* Modules Grid (2 Columns, 3 Rows = 6 Cards) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    {/* Module 1: Concluído */}
                    <div
                      onClick={() => openModule("modulo-1")}
                      className="bg-white border border-[#E2DFF1] rounded-[20px] p-5.5 flex items-center justify-between shadow-xs hover:border-[#4F3CF0]/60 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-[#E3F5EC] flex items-center justify-center shrink-0">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#137A51"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-extrabold text-[#17152E] leading-snug truncate group-hover:text-[#4F3CF0] transition">
                            Módulo 1: Fundamentos
                          </h4>
                          <p className="text-xs font-semibold text-[#137A51] mt-0.5 flex items-center gap-1">
                            Concluído · Revisar
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C88AA] group-hover:text-[#4F3CF0] group-hover:translate-x-0.5 transition shrink-0">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </div>
                    </div>

                    {/* Module 2: Em andamento (Highlighted Card) */}
                    <div
                      onClick={() => openModule("modulo-2")}
                      className="bg-white border-2 border-[#4F3CF0] rounded-[20px] p-5.5 shadow-md flex flex-col justify-between cursor-pointer hover:shadow-lg transition group"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-[#4F3CF0] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="white"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-base font-black text-[#17152E] leading-snug truncate">
                              Módulo 2: Funções
                            </h4>
                            <p className="text-xs font-medium text-[#5F5B7D] mt-0.5 truncate">
                              {moduleCompleted
                                ? "Concluído · 6 de 6 aulas"
                                : "Em andamento · 3 de 6 aulas"}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            openModule("modulo-2")
                          }}
                          className="px-5 py-2.5 rounded-full bg-[#4F3CF0] hover:bg-[#3D2CD8] text-white font-extrabold text-xs sm:text-sm shadow-xs transition cursor-pointer shrink-0 active:scale-95"
                        >
                          {moduleCompleted ? "Revisar" : "Continuar"}
                        </button>
                      </div>
                      {/* Mini progress bar */}
                      <div className="w-full h-1.5 bg-[#E9E6FF] rounded-full overflow-hidden mt-4">
                        <div
                          className="h-full bg-[#4F3CF0] rounded-full transition-all duration-500"
                          style={{ width: moduleCompleted ? "100%" : "50%" }}
                        />
                      </div>
                    </div>

                    {/* Module 3: Estatística */}
                    <div
                      onClick={() => openModule("modulo-3")}
                      className="bg-white border border-[#E2DFF1] rounded-[20px] p-5.5 flex items-center justify-between shadow-xs hover:border-[#4F3CF0]/60 transition cursor-pointer group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-[#FCE8E8] flex items-center justify-center shrink-0">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#17152E"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-extrabold text-[#17152E] leading-snug truncate group-hover:text-[#4F3CF0] transition">
                            Módulo 3: Estatística
                          </h4>
                          <p className="text-xs font-medium text-[#5F5B7D] mt-0.5 truncate">
                            {moduleCompleted
                              ? "Disponível · Iniciar módulo"
                              : "Bloqueado · Conclua o Módulo 2"}
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C88AA] group-hover:text-[#4F3CF0] transition shrink-0">
                        {moduleCompleted ? (
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        ) : (
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="11"
                              width="18"
                              height="11"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Module 4: Geometria */}
                    <div
                      onClick={() => openModule("modulo-4")}
                      className="bg-white border border-[#E2DFF1] rounded-[20px] p-5.5 flex items-center justify-between shadow-xs hover:border-[#4F3CF0]/60 transition cursor-pointer group opacity-90 hover:opacity-100"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-[#F7F6FC] border border-[#E2DFF1] flex items-center justify-center shrink-0">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#8C88AA"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="11"
                              width="18"
                              height="11"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-extrabold text-[#17152E] leading-snug truncate group-hover:text-[#4F3CF0] transition">
                            Módulo 4: Geometria
                          </h4>
                          <p className="text-xs font-medium text-[#8C88AA] mt-0.5">
                            Bloqueado · Conclua o Módulo 3
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C88AA] group-hover:text-[#4F3CF0] transition shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                    </div>

                    {/* Module 5: Trigonometria & Álgebra */}
                    <div
                      onClick={() => openModule("modulo-5")}
                      className="bg-white border border-[#E2DFF1] rounded-[20px] p-5.5 flex items-center justify-between shadow-xs hover:border-[#4F3CF0]/60 transition cursor-pointer group opacity-90 hover:opacity-100"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-[#F7F6FC] border border-[#E2DFF1] flex items-center justify-center shrink-0">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#8C88AA"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="11"
                              width="18"
                              height="11"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-extrabold text-[#17152E] leading-snug truncate group-hover:text-[#4F3CF0] transition">
                            Módulo 5: Trigonometria &amp; Álgebra
                          </h4>
                          <p className="text-xs font-medium text-[#8C88AA] mt-0.5">
                            Bloqueado · Conclua o Módulo 4
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C88AA] group-hover:text-[#4F3CF0] transition shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                    </div>

                    {/* Module 6: Probabilidade & Combinatória */}
                    <div
                      onClick={() => openModule("modulo-6")}
                      className="bg-white border border-[#E2DFF1] rounded-[20px] p-5.5 flex items-center justify-between shadow-xs hover:border-[#4F3CF0]/60 transition cursor-pointer group opacity-90 hover:opacity-100"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-[#F7F6FC] border border-[#E2DFF1] flex items-center justify-center shrink-0">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#8C88AA"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect
                              x="3"
                              y="11"
                              width="18"
                              height="11"
                              rx="2"
                              ry="2"
                            />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-base font-extrabold text-[#17152E] leading-snug truncate group-hover:text-[#4F3CF0] transition">
                            Módulo 6: Probabilidade &amp; Combinatória
                          </h4>
                          <p className="text-xs font-medium text-[#8C88AA] mt-0.5">
                            Bloqueado · Conclua o Módulo 5
                          </p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#8C88AA] group-hover:text-[#4F3CF0] transition shrink-0">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="3"
                            y="11"
                            width="18"
                            height="11"
                            rx="2"
                            ry="2"
                          />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {/* ======================================================================= */}
            {/* TAB: SIMULADOS (Exam Simulations Hub)                                   */}
            {/* ======================================================================= */}
            {activeTab === "simulados" &&
              (selectedExamResult ? (
                isViewingAnswerKey ? (
                  /* ===================================================================== */
                  /* SCREEN: GABARITO COMENTADO (1440x1060 conforme SVG oficial)           */
                  /* ===================================================================== */
                  (() => {
                    const allGabaritoQuestions = Array.from(
                      { length: selectedExamResult.totalQuestions },
                      (_, i) => {
                        const q =
                          SIMULADO_90_QUESTIONS[i] || SIMULADO_90_QUESTIONS[0]
                        const studentAnsFromSession = examAnswers[i]
                        let isCorrect = false
                        let studentAns: string | null = null

                        if (
                          Object.keys(examAnswers).length > 0 &&
                          studentAnsFromSession !== undefined
                        ) {
                          studentAns = studentAnsFromSession
                          isCorrect = studentAns === q.correct
                        } else {
                          // Distribuição exata e determinística correspondente aos acertos do resultado:
                          // Questão 08 (índice 7) é SEMPRE erro (aluno marcou D, correta é C)
                          const total = selectedExamResult.totalQuestions
                          const correctCount = selectedExamResult.correctCount
                          const errorCount = total - correctCount
                          const isError =
                            i === 7 ||
                            (errorCount > 1 && i >= total - (errorCount - 1))

                          if (isError) {
                            isCorrect = false
                            studentAns =
                              i === 7 ? "D" : q.correct === "A" ? "B" : "A"
                          } else {
                            isCorrect = true
                            studentAns = q.correct
                          }
                        }

                        return {
                          index: i,
                          question: q,
                          isCorrect,
                          studentAns,
                        }
                      },
                    )

                    const displayedGabaritoQuestions =
                      allGabaritoQuestions.filter((item) => {
                        if (gabaritoFilter === "erros") return !item.isCorrect
                        if (gabaritoFilter === "acertos") return item.isCorrect
                        return true
                      })

                    const currentGabaritoItem = allGabaritoQuestions[
                      selectedGabaritoIndex
                    ] ||
                      allGabaritoQuestions[0] || {
                        index: 0,
                        question: SIMULADO_90_QUESTIONS[0],
                        isCorrect: false,
                        studentAns: "A",
                      }
                    const currentGabaritoQ =
                      currentGabaritoItem.question || SIMULADO_90_QUESTIONS[0]
                    const isCurrentQCorrect = currentGabaritoItem.isCorrect
                    const currentQStudentAns = currentGabaritoItem.studentAns

                    const renderMentorinaGabaritoCommentary = (
                      qIdx: number,
                      q: ExamSimuladoQuestion,
                    ) => {
                      if (qIdx === 7) {
                        return (
                          <div className="space-y-3">
                            <p>
                              <strong>1. Dados da questão:</strong> Volume total
                              necessário = <strong>16,2 litros</strong>. O galão
                              comporta <strong>3,6 L</strong> por R$ 80,00 e a
                              lata menor comporta{" "}
                              <strong>900 mL (0,9 L)</strong> por R$ 25,00.
                            </p>
                            <p>
                              <strong>2. Comparação de custo por litro:</strong>
                              <br />• Galão: R$ 80,00 ÷ 3,6 L ≈{" "}
                              <strong>R$ 22,22/L</strong>
                              <br />• Lata: R$ 25,00 ÷ 0,9 L ≈{" "}
                              <strong>R$ 27,78/L</strong>
                              <br />
                              Para minimizar o gasto, devemos priorizar a maior
                              quantidade viável de galões sem ultrapassar 16,2 L
                              e sem deixar sobras.
                            </p>
                            <p>
                              <strong>3. Divisão do volume:</strong>
                              <br />• 4 galões × 3,6 L = <strong>14,4 L</strong>{" "}
                              (Custo: 4 × R$ 80,00 = R$ 320,00).
                              <br />• Sobra exata: 16,2 L - 14,4 L ={" "}
                              <strong>1,8 L</strong>.
                              <br />• 1,8 L equivalem a exatamente 2 latas de
                              0,9 L (2 × 0,9 L = 1,8 L) (Custo: 2 × R$ 25,00 =
                              R$ 50,00).
                              <br />• Custo total: R$ 320,00 + R$ 50,00 ={" "}
                              <strong>R$ 370,00</strong>.
                            </p>
                            <div className="mt-3 p-3.5 bg-white/75 rounded-xl border border-[#4F3CF0]/20 text-[13px] text-[#4F3CF0] font-medium leading-relaxed">
                              💡 <strong>Dica TRI:</strong> Na alternativa D (3
                              galões e 6 latas), o volume também resulta em 16,2
                              L (10,8 + 5,4 = 16,2 L), mas o custo é de R$
                              390,00 (R$ 20,00 mais caro). No ENEM, fique atento
                              quando o enunciado pedir especificamente a opção
                              de <em>menor custo</em>!
                            </div>
                          </div>
                        )
                      }

                      return (
                        <div className="space-y-3">
                          <p>
                            <strong>1. Interpretação do enunciado:</strong> A
                            questão avalia a competência na área de{" "}
                            <strong>{q.discipline}</strong>, exigindo a
                            identificação dos conceitos fundamentais articulados
                            no texto de apoio.
                          </p>
                          <p>
                            <strong>2. Análise da alternativa correta:</strong>{" "}
                            A alternativa <strong>({q.correct})</strong> é a
                            única que responde de forma plena e coerente ao
                            comando, respeitando as relações de causa e efeito
                            demonstradas.
                          </p>
                          <div className="mt-3 p-3.5 bg-white/75 rounded-xl border border-[#4F3CF0]/20 text-[13px] text-[#4F3CF0] font-medium leading-relaxed">
                            💡 <strong>Dica TRI:</strong> Elimine distratores
                            que utilizem termos generalistas ou conclusões
                            absolutas não respaldadas pelo texto motivador.
                          </div>
                        </div>
                      )
                    }

                    return (
                      <div className="w-full max-w-[1120px] mx-auto animate-in fade-in duration-200">
                        {/* Top Navigation: < Resultado */}
                        <div className="pt-2 pb-6">
                          <button
                            type="button"
                            onClick={() => {
                              setIsViewingAnswerKey(false)
                              if (typeof window !== "undefined") {
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }
                            }}
                            className="inline-flex items-center gap-2 text-[14px] font-bold text-[#4F3CF0] hover:underline cursor-pointer group"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#4F3CF0"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="group-hover:-translate-x-0.5 transition-transform"
                            >
                              <path d="M15 18l-6-6 6-6" />
                            </svg>
                            Resultado
                          </button>
                        </div>

                        {/* Header & Filter Tabs */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                          <div>
                            <h2 className="text-[28px] lg:text-[32px] font-black text-[#17152E] tracking-tight">
                              Gabarito Comentado
                            </h2>
                            <p className="text-[14px] text-[#5F5B7D] font-medium mt-1">
                              {selectedExamResult.title} ·{" "}
                              {selectedExamResult.correctCount} acertos de{" "}
                              {selectedExamResult.totalQuestions} questões ·{" "}
                              {selectedExamResult.percent}% de aproveitamento
                            </p>
                          </div>

                          {/* Filtros: Todas, Erros, Acertos */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setGabaritoFilter("todas")}
                              className={`h-10 px-5 rounded-full font-bold text-[13px] sm:text-[14px] transition cursor-pointer flex items-center gap-1.5 ${
                                gabaritoFilter === "todas"
                                  ? "bg-[#17152E] text-white shadow-xs"
                                  : "bg-white border border-[#8C88AA] text-[#17152E] hover:bg-[#F7F6FC]"
                              }`}
                            >
                              Todas ({selectedExamResult.totalQuestions})
                            </button>
                            <button
                              type="button"
                              onClick={() => setGabaritoFilter("erros")}
                              className={`h-10 px-5 rounded-full font-bold text-[13px] sm:text-[14px] transition cursor-pointer flex items-center gap-1.5 ${
                                gabaritoFilter === "erros"
                                  ? "bg-[#17152E] text-white shadow-xs"
                                  : "bg-white border border-[#8C88AA] text-[#17152E] hover:bg-[#F7F6FC]"
                              }`}
                            >
                              Erros (
                              {selectedExamResult.totalQuestions -
                                selectedExamResult.correctCount}
                              )
                            </button>
                            <button
                              type="button"
                              onClick={() => setGabaritoFilter("acertos")}
                              className={`h-10 px-5 rounded-full font-bold text-[13px] sm:text-[14px] transition cursor-pointer flex items-center gap-1.5 ${
                                gabaritoFilter === "acertos"
                                  ? "bg-[#17152E] text-white shadow-xs"
                                  : "bg-white border border-[#8C88AA] text-[#17152E] hover:bg-[#F7F6FC]"
                              }`}
                            >
                              Acertos ({selectedExamResult.correctCount})
                            </button>
                          </div>
                        </div>

                        {/* Main 2-column Grid */}
                        <div className="flex flex-col lg:flex-row gap-6 items-start">
                          {/* Left Column: Lista de Questões (300px) */}
                          <div className="w-full lg:w-[300px] shrink-0 bg-white rounded-[20px] p-6 border border-[#E2DFF1] shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)] flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-[18px] font-black text-[#17152E] tracking-tight">
                                Questões
                              </h3>
                              <span className="text-[12px] font-bold text-[#5F5B7D]">
                                {displayedGabaritoQuestions.length}{" "}
                                {displayedGabaritoQuestions.length === 1
                                  ? "questão"
                                  : "questões"}
                              </span>
                            </div>

                            <div className="grid grid-cols-4 gap-2.5 max-h-[640px] overflow-y-auto pr-1">
                              {displayedGabaritoQuestions.map((item) => {
                                const isSelected =
                                  selectedGabaritoIndex === item.index
                                return (
                                  <button
                                    key={item.index}
                                    type="button"
                                    onClick={() =>
                                      setSelectedGabaritoIndex(item.index)
                                    }
                                    className={`h-11 rounded-[12px] flex items-center justify-center gap-1.5 font-bold text-[13px] transition cursor-pointer select-none ${
                                      isSelected
                                        ? "ring-2 ring-[#17152E] border-2 border-[#17152E] scale-105 z-10 shadow-xs"
                                        : "border"
                                    } ${
                                      item.isCorrect
                                        ? "bg-[#E3F5EC] text-[#137A51] border-[#137A51]/30 hover:bg-[#D5EFE2]"
                                        : "bg-[#FCE8E8] text-[#C42B30] border-[#C42B30]/30 hover:bg-[#F9D6D6]"
                                    }`}
                                  >
                                    <span>
                                      {String(item.index + 1).padStart(2, "0")}
                                    </span>
                                    {item.isCorrect ? (
                                      <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#137A51"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="shrink-0"
                                      >
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    ) : (
                                      <svg
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="#C42B30"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="shrink-0"
                                      >
                                        <line x1="18" y1="6" x2="6" y2="18" />
                                        <line x1="6" y1="6" x2="18" y2="18" />
                                      </svg>
                                    )}
                                  </button>
                                )
                              })}
                            </div>
                          </div>

                          {/* Right Column: Detalhe da Questão (~796px / flex-1) */}
                          <div className="flex-1 w-full bg-white rounded-[20px] p-6 sm:p-8 border border-[#E2DFF1] shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)] flex flex-col justify-between min-h-[640px]">
                            <div>
                              {/* Question Header & Status */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                                <span className="font-extrabold text-[12px] tracking-[0.08em] text-[#4F3CF0] uppercase">
                                  {currentGabaritoQ.badge} ·{" "}
                                  {currentGabaritoQ.discipline.toUpperCase()}
                                </span>
                                {isCurrentQCorrect ? (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F5EC] text-[#137A51] font-bold text-xs self-start sm:self-auto">
                                    <svg
                                      width="13"
                                      height="13"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Você acertou
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE8E8] text-[#C42B30] font-bold text-xs self-start sm:self-auto">
                                    <svg
                                      width="13"
                                      height="13"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="3"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <line x1="18" y1="6" x2="6" y2="18" />
                                      <line x1="6" y1="6" x2="18" y2="18" />
                                    </svg>
                                    Você errou
                                  </span>
                                )}
                              </div>

                              {/* Enunciado */}
                              <div className="space-y-4 mb-6">
                                {currentGabaritoQ.context
                                  .split("\n\n")
                                  .map((para, pIdx) => (
                                    <p
                                      key={pIdx}
                                      className="text-[15.5px] text-[#17152E] leading-relaxed font-normal"
                                    >
                                      {para}
                                    </p>
                                  ))}
                                {currentGabaritoQ.intro && (
                                  <p className="text-[15px] font-semibold text-[#17152E] pt-1">
                                    {currentGabaritoQ.intro}
                                  </p>
                                )}
                              </div>

                              {/* Alternativas */}
                              <div className="space-y-3 mb-6">
                                {currentGabaritoQ.alternatives.map((alt) => {
                                  const isCorrectAlt =
                                    alt.letter === currentGabaritoQ.correct
                                  const isStudentAlt =
                                    alt.letter === currentQStudentAns

                                  let itemStyle =
                                    "bg-white border border-[#E2DFF1] text-[#17152E]"
                                  let badge = null

                                  if (isCorrectAlt) {
                                    itemStyle =
                                      "bg-[#E3F5EC] border-2 border-[#137A51] text-[#137A51] font-medium"
                                    badge = (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#137A51] text-white font-bold text-xs shrink-0">
                                        <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Correta
                                      </span>
                                    )
                                  } else if (isStudentAlt && !isCorrectAlt) {
                                    itemStyle =
                                      "bg-[#FCE8E8] border-2 border-[#C42B30] text-[#C42B30] font-medium"
                                    badge = (
                                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C42B30] text-white font-bold text-xs shrink-0">
                                        <svg
                                          width="12"
                                          height="12"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <line x1="18" y1="6" x2="6" y2="18" />
                                          <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                        Sua resposta
                                      </span>
                                    )
                                  }

                                  return (
                                    <div
                                      key={alt.letter}
                                      className={`w-full p-3.5 sm:p-4 rounded-[14px] flex items-center justify-between gap-3.5 transition ${itemStyle}`}
                                    >
                                      <div className="flex items-center gap-3.5 min-w-0">
                                        <div
                                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                                            isCorrectAlt
                                              ? "bg-[#137A51] text-white"
                                              : isStudentAlt && !isCorrectAlt
                                                ? "bg-[#C42B30] text-white"
                                                : "bg-[#F7F6FC] text-[#5F5B7D] border border-[#E2DFF1]"
                                          }`}
                                        >
                                          {alt.letter}
                                        </div>
                                        <span className="text-[15px] leading-snug">
                                          {alt.text}
                                        </span>
                                      </div>
                                      {badge}
                                    </div>
                                  )
                                })}
                              </div>

                              {/* Comentário da Mentorina */}
                              <div className="bg-[#E9E6FF] rounded-[16px] p-6 border border-[#4F3CF0]/20 space-y-3.5">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-lg bg-[#4F3CF0] flex items-center justify-center text-white shrink-0 shadow-xs">
                                      <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                      </svg>
                                    </div>
                                    <h4 className="text-[16px] font-black text-[#17152E] tracking-tight">
                                      Comentário da Mentorina
                                    </h4>
                                  </div>
                                  <span className="text-[11px] font-bold text-[#4F3CF0] bg-white px-2.5 py-1 rounded-md border border-[#4F3CF0]/20">
                                    Resolução comentada
                                  </span>
                                </div>

                                <div className="text-[14px] text-[#17152E] space-y-2.5 leading-relaxed font-normal">
                                  {renderMentorinaGabaritoCommentary(
                                    selectedGabaritoIndex,
                                    currentGabaritoQ,
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Controles de Navegação da Questão */}
                            <div className="w-full flex items-center justify-between pt-6 border-t border-[#F0EDF9] mt-6">
                              <button
                                type="button"
                                disabled={selectedGabaritoIndex <= 0}
                                onClick={() => {
                                  setSelectedGabaritoIndex((prev) =>
                                    Math.max(0, prev - 1),
                                  )
                                  if (typeof window !== "undefined") {
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    })
                                  }
                                }}
                                className="h-[48px] px-6 rounded-full border border-[#8C88AA] bg-white text-[#17152E] font-bold text-sm flex items-center gap-2 hover:bg-[#F7F6FC] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="15 18 9 12 15 6" />
                                </svg>
                                <span>Questão anterior</span>
                              </button>

                              <button
                                type="button"
                                disabled={
                                  selectedGabaritoIndex >=
                                  selectedExamResult.totalQuestions - 1
                                }
                                onClick={() => {
                                  setSelectedGabaritoIndex((prev) =>
                                    Math.min(
                                      selectedExamResult.totalQuestions - 1,
                                      prev + 1,
                                    ),
                                  )
                                  if (typeof window !== "undefined") {
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    })
                                  }
                                }}
                                className="h-[48px] px-7 rounded-full bg-[#4F3CF0] hover:bg-[#3D2DC9] text-white font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-xs disabled:opacity-35 disabled:cursor-not-allowed"
                              >
                                <span>Próxima questão</span>
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="9 18 15 12 9 6" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()
                ) : (
                  /* ===================================================================== */
                  /* SCREEN: RESULTADO DO SIMULADO (1440x900 conforme SVG oficial)         */
                  /* ===================================================================== */
                  <div className="w-full max-w-[1120px] mx-auto animate-in fade-in duration-200">
                    {/* Top Navigation */}
                    <div className="pt-2 pb-6">
                      <button
                        type="button"
                        onClick={() => setSelectedExamResult(null)}
                        className="inline-flex items-center gap-2 text-[14px] font-bold text-[#4F3CF0] hover:underline cursor-pointer group"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="group-hover:-translate-x-0.5 transition-transform"
                        >
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                        Simulados
                      </button>
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mb-6">
                      <h2 className="text-[28px] lg:text-[32px] font-black text-[#17152E] tracking-tight mb-2">
                        Resultado do Simulado
                      </h2>
                      <p className="text-[14px] text-[#5F5B7D] font-medium">
                        {selectedExamResult.title} · Realizado em{" "}
                        {selectedExamResult.date}
                      </p>
                    </div>

                    {/* 4 Metric Cards (1120px grid, 4 colunas x 164px altura conforme SVG oficial 1120x164) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 w-full max-w-[1120px]">
                      {/* Card 1: ACERTOS (Dark #17152E) */}
                      <div className="p-6 rounded-[20px] bg-[#17152E] text-white flex flex-col justify-between min-h-[164px] h-[164px] shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)]">
                        <span className="text-[11px] font-bold text-[#ABA7C8] uppercase tracking-wider">
                          ACERTOS
                        </span>
                        <div className="my-auto">
                          <span className="text-[36px] font-black text-[#C6F432] font-mono leading-none">
                            {selectedExamResult.correctCount}
                          </span>
                          <span className="text-[24px] font-black text-white font-mono ml-2">
                            / {selectedExamResult.totalQuestions}
                          </span>
                        </div>
                        <span className="text-[12px] text-white font-medium">
                          {selectedExamResult.percent}% de aproveitamento
                        </span>
                      </div>

                      {/* Card 2: TEMPO TOTAL */}
                      <div className="p-6 rounded-[20px] bg-white border border-[#E2DFF1] flex flex-col justify-between min-h-[164px] h-[164px] shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)]">
                        <span className="text-[11px] font-bold text-[#5F5B7D] uppercase tracking-wider">
                          TEMPO TOTAL
                        </span>
                        <div className="my-auto">
                          <span className="text-[36px] font-black text-[#17152E] font-mono leading-none">
                            {selectedExamResult.timeSpent}
                          </span>
                        </div>
                        <span
                          className="text-[12px] text-[#5F5B7D] font-medium truncate"
                          title={selectedExamResult.avgTimePerQuestion}
                        >
                          {selectedExamResult.avgTimePerQuestion}
                        </span>
                      </div>

                      {/* Card 3: MÉDIA POR QUESTÃO (conforme SVG oficial 275x164) */}
                      <div className="p-6 rounded-[20px] bg-white border border-[#E2DFF1] flex flex-col justify-between min-h-[164px] h-[164px] shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)]">
                        <span className="text-[11px] font-bold text-[#5F5B7D] uppercase tracking-wider">
                          MÉDIA POR QUESTÃO
                        </span>
                        <div className="my-auto">
                          <span className="text-[36px] font-black text-[#17152E] font-mono leading-none">
                            {(() => {
                              const match =
                                selectedExamResult.avgTimePerQuestion?.match(
                                  /(\d+)m\s*(\d+)s/,
                                )
                              if (match) {
                                return `${match[1]}:${match[2].padStart(2, "0")}`
                              }
                              const colonMatch =
                                selectedExamResult.avgTimePerQuestion?.match(
                                  /(\d+:\d+)/,
                                )
                              if (colonMatch) return colonMatch[1]
                              return "2:24"
                            })()}
                          </span>
                        </div>
                        <span className="text-[12px] text-[#5F5B7D] font-medium truncate">
                          min por questão
                        </span>
                      </div>

                      {/* Card 4: EM BRANCO */}
                      <div className="p-6 rounded-[20px] bg-white border border-[#E2DFF1] flex flex-col justify-between min-h-[164px] h-[164px] shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)]">
                        <span className="text-[11px] font-bold text-[#5F5B7D] uppercase tracking-wider">
                          EM BRANCO
                        </span>
                        <div className="my-auto">
                          <span className="text-[36px] font-black text-[#17152E] font-mono leading-none">
                            {selectedExamResult.blankCount}
                          </span>
                        </div>
                        <span className="text-[12px] text-[#5F5B7D] font-medium truncate">
                          {selectedExamResult.blankCount === 0
                            ? "Nenhuma questão sem resposta"
                            : `${selectedExamResult.blankPercent}% do total de questões`}
                        </span>
                      </div>
                    </div>

                    {/* Bloco: Desempenho por assunto + A Mentorina sugere e Mascote */}
                    <div className="grid grid-cols-1 lg:grid-cols-[716px_380px] gap-6 mb-8 w-full max-w-[1120px] items-start">
                      {/* Coluna 1 (Esquerda): Desempenho por assunto + Botões de Ação */}
                      <div className="w-full flex flex-col">
                        {/* Card 1: Desempenho por assunto (716x314) */}
                        <div className="w-full bg-white border border-[#E2DFF1] rounded-[20px] p-8 shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)] min-h-[314px] flex flex-col justify-between">
                          <h3 className="text-[18px] font-black text-[#17152E] tracking-tight mb-5">
                            Desempenho por assunto
                          </h3>

                          <div className="space-y-5">
                            {/* Assunto 1: Funções */}
                            <div>
                              <div className="flex items-center justify-between text-[13px] font-bold text-[#17152E] mb-2">
                                <span>Funções</span>
                                <span>5/7</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-[#E9E6FF] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[#4F3CF0] transition-all duration-500"
                                  style={{ width: `${(5 / 7) * 100}%` }}
                                />
                              </div>
                            </div>

                            {/* Assunto 2: Porcentagem */}
                            <div>
                              <div className="flex items-center justify-between text-[13px] font-bold text-[#17152E] mb-2">
                                <span>Porcentagem</span>
                                <span>3/4</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-[#E9E6FF] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[#4F3CF0] transition-all duration-500"
                                  style={{ width: `${(3 / 4) * 100}%` }}
                                />
                              </div>
                            </div>

                            {/* Assunto 3: Estatística */}
                            <div>
                              <div className="flex items-center justify-between text-[13px] font-bold text-[#17152E] mb-2">
                                <span>Estatística</span>
                                <span>4/5</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-[#E9E6FF] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[#4F3CF0] transition-all duration-500"
                                  style={{ width: `${(4 / 5) * 100}%` }}
                                />
                              </div>
                            </div>

                            {/* Assunto 4: Geometria plana (Atenção / Vermelho) */}
                            <div>
                              <div className="flex items-center justify-between text-[13px] font-bold mb-2">
                                <span className="text-[#17152E]">
                                  Geometria plana
                                </span>
                                <span className="text-[#C42B30]">2/5</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-[#E9E6FF] overflow-hidden">
                                <div
                                  className="h-full rounded-full bg-[#FF6B57] transition-all duration-500"
                                  style={{ width: `${(2 / 5) * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Botões de Ação logo abaixo padronizados com o mesmo espaçamento (24px) */}
                        <div className="flex items-center gap-1 mt-6 w-full justify-start">
                          {/* Botão 1: Ver gabarito comentado (271x48) */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedGabaritoIndex(7)
                              setIsViewingAnswerKey(true)
                              if (typeof window !== "undefined") {
                                window.scrollTo({ top: 0, behavior: "smooth" })
                              }
                            }}
                            className="w-[271px] h-12 rounded-[24px] bg-[#4F3CF0] hover:bg-[#3D2DC9] transition-colors text-white font-bold text-[14px] flex items-center justify-center gap-2.5 cursor-pointer shadow-xs active:scale-[0.99]"
                          >
                            <svg
                              width="16"
                              height="20"
                              viewBox="34 14 16 20"
                              fill="none"
                              className="shrink-0"
                            >
                              <path
                                d="M44.5002 15.6667H37.0002C36.5581 15.6667 36.1342 15.8423 35.8217 16.1549C35.5091 16.4675 35.3335 16.8914 35.3335 17.3334V30.6667C35.3335 31.1088 35.5091 31.5327 35.8217 31.8453C36.1342 32.1578 36.5581 32.3334 37.0002 32.3334H47.0002C47.4422 32.3334 47.8661 32.1578 48.1787 31.8453C48.4912 31.5327 48.6668 31.1088 48.6668 30.6667V19.8334L44.5002 15.6667Z"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke="white"
                              />
                              <path
                                d="M43.6665 15.6667V19.0001C43.6665 19.4421 43.8421 19.866 44.1547 20.1786C44.4672 20.4912 44.8911 20.6667 45.3332 20.6667H48.6665"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke="white"
                              />
                              <path
                                d="M45.3332 24.8333H38.6665"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke="white"
                              />
                              <path
                                d="M45.3332 28.1667H38.6665"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                stroke="white"
                              />
                            </svg>
                            <span>Ver gabarito comentado</span>
                          </button>

                          {/* Botão 2: Voltar para os simulados (218.5x48) */}
                          <button
                            type="button"
                            onClick={() => setSelectedExamResult(null)}
                            className="w-[219px] h-12 rounded-[24px] bg-white border-[1.5px] border-[#8C88AA] hover:bg-[#F7F6FC] transition-colors text-[#17152E] font-bold text-[14px] flex items-center justify-center cursor-pointer active:scale-[0.99]"
                          >
                            Voltar para os simulados
                          </button>
                        </div>
                      </div>

                      {/* Coluna 2 (Direita): A Mentorina sugere + Mascote Mentorina */}
                      <div className="w-full flex flex-col items-end">
                        {/* Card 2: A Mentorina sugere (380x216) */}
                        <div className="w-full bg-[#E9E6FF] rounded-[20px] p-6 lg:p-7 flex flex-col justify-between h-auto lg:h-[216px]">
                          <div>
                            <div className="flex items-center gap-2 text-[#4F3CF0] font-bold text-[14px] mb-3">
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 18 18"
                                fill="none"
                                className="shrink-0"
                              >
                                <path
                                  d="M9 1.5L10.583 6.3333L15.667 8.1667L10.583 10L9 14.8333L7.417 10L2.333 8.1667L7.417 6.3333L9 1.5Z"
                                  stroke="#4F3CF0"
                                  strokeWidth="1.66667"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span>A Mentorina sugere</span>
                            </div>

                            <p className="text-[13px] text-[#17152E] font-medium leading-[20px]">
                              Revise Geometria plana: você errou 3 de 5. Coloque
                              em prática essa área para subir sua nota revisando
                              de maneira rápida.
                            </p>
                          </div>

                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => {
                                setIsMentorinaChatOpen(true)
                              }}
                              className="w-full h-12 rounded-[24px] bg-[#4F3CF0] hover:bg-[#3D2DC9] transition-colors text-white font-bold text-[14px] flex items-center justify-center cursor-pointer shadow-xs active:scale-[0.99]"
                            >
                              Revisar agora
                            </button>
                          </div>
                        </div>

                        {/* Mentorina Mascote (220x220) ilustrativa (não clicável) padronizada com o mesmo espaçamento (24px) */}
                        <div className="mt-[-1] shrink-0 self-end mr-20 select-none pointer-events-none">
                          <svg
                            width="220"
                            height="220"
                            viewBox="0 0 220 220"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              opacity="0.1"
                              d="M110 198.733C138.35 198.733 161.333 195.779 161.333 192.133C161.333 188.488 138.35 185.533 110 185.533C81.6492 185.533 58.6665 188.488 58.6665 192.133C58.6665 195.779 81.6492 198.733 110 198.733Z"
                              fill="#17152E"
                            />
                            <path
                              d="M42.5332 176C70.3999 189.2 110 189.2 129.067 170.133C145.2 154 136.4 132 143.733 110"
                              strokeWidth="17.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              stroke="#3420C2"
                            />
                            <path
                              d="M42.5332 173.067C70.3999 186.267 110 186.267 129.067 167.2C145.2 151.067 136.4 129.067 143.733 107.067"
                              strokeWidth="17.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              stroke="#4F3CF0"
                            />
                            <path
                              opacity="0.45"
                              d="M41.0669 168.667C68.9336 181.867 108.534 181.867 127.6 162.8C143.734 146.667 134.934 124.667 142.267 102.667"
                              strokeWidth="2.2"
                              strokeLinecap="round"
                              stroke="#8E82FF"
                            />
                            <path
                              d="M144.017 110.272C157.938 111.735 170.408 101.636 171.872 87.7159C173.335 73.7955 163.236 61.3247 149.316 59.8616C135.395 58.3985 122.924 68.4971 121.461 82.4176C119.998 96.338 130.097 108.809 144.017 110.272Z"
                              fill="url(#mentorina_mascot_result_gradient)"
                            />
                            <path
                              opacity="0.45"
                              d="M141.993 72.6395C145.954 71.6518 148.707 69.0162 148.143 66.7527C147.579 64.4891 143.91 63.4548 139.949 64.4424C135.988 65.4301 133.234 68.0657 133.798 70.3292C134.363 72.5928 138.031 73.6271 141.993 72.6395Z"
                              fill="white"
                            />
                            <path
                              opacity="0.45"
                              d="M129.284 93.8579C131.604 94.1017 133.609 93.1239 133.761 91.6739C133.913 90.2238 132.156 88.8507 129.836 88.6068C127.516 88.363 125.512 89.3408 125.359 90.7908C125.207 92.2409 126.964 93.614 129.284 93.8579Z"
                              fill="#FF6B57"
                            />
                            <path
                              opacity="0.45"
                              d="M161.841 97.2798C164.161 97.5236 166.165 96.5458 166.318 95.0958C166.47 93.6457 164.713 92.2725 162.393 92.0287C160.073 91.7848 158.068 92.7627 157.916 94.2127C157.764 95.6627 159.521 97.0359 161.841 97.2798Z"
                              fill="#FF6B57"
                            />
                            <path
                              d="M134.699 82.7472C137.094 80.1673 139.194 80.3881 141 83.4095"
                              strokeWidth="2.112"
                              strokeLinecap="round"
                              stroke="#17152E"
                            />
                            <path
                              d="M152.553 84.6236C154.948 82.0438 157.048 82.2646 158.854 85.2859"
                              strokeWidth="2.112"
                              strokeLinecap="round"
                              stroke="#17152E"
                            />
                            <path
                              d="M137.077 90.4297C141.717 90.9174 145.874 87.5511 146.362 82.911C146.849 78.2709 143.483 74.1139 138.843 73.6262C134.203 73.1385 130.046 76.5047 129.558 81.1449C129.071 85.785 132.437 89.942 137.077 90.4297Z"
                              fill="white"
                              fillOpacity="0.18"
                              stroke="#17152E"
                            />
                            <path
                              d="M154.931 92.3061C159.571 92.7938 163.728 89.4276 164.216 84.7875C164.703 80.1473 161.337 75.9904 156.697 75.5027C152.057 75.015 147.9 78.3812 147.412 83.0214C146.925 87.6615 150.291 91.8184 154.931 92.3061Z"
                              fill="white"
                              fillOpacity="0.18"
                              stroke="#17152E"
                            />
                            <path
                              d="M145.422 81.7507C146.62 80.4607 147.67 80.5711 148.573 82.0818"
                              stroke="#17152E"
                            />
                            <path
                              d="M129.669 80.0948L123.063 77.2769M164.326 83.7374L171.373 82.3544"
                              strokeLinecap="round"
                              stroke="#17152E"
                            />
                            <path
                              d="M139.123 91.1755C142.974 98.3052 147.525 98.7835 152.775 92.6105L139.123 91.1755Z"
                              fill="#17152E"
                            />
                            <path
                              d="M142.301 96.2878C144.218 98.259 146.318 98.4797 148.603 96.9501"
                              strokeWidth="2.112"
                              strokeLinecap="round"
                              stroke="#FF6B57"
                            />
                            <path
                              d="M162.8 29.3333L171.6 51.3333L149.6 42.5333L162.8 29.3333Z"
                              fill="#C6F432"
                            />
                            <path
                              d="M70.4 92.4001C72.8301 92.4001 74.8 90.4302 74.8 88.0001C74.8 85.57 72.8301 83.6001 70.4 83.6001C67.9699 83.6001 66 85.57 66 88.0001C66 90.4302 67.9699 92.4001 70.4 92.4001Z"
                              fill="#3CC8F0"
                            />
                            <path
                              d="M67.8069 53.3896L62.7262 50.4562C62.0247 50.0512 61.1277 50.2916 60.7227 50.9931L57.7894 56.0738C57.3844 56.7752 57.6247 57.6722 58.3262 58.0773L63.4069 61.0106C64.1084 61.4156 65.0054 61.1752 65.4104 60.4738L68.3437 55.3931C68.7488 54.6916 68.5084 53.7946 67.8069 53.3896Z"
                              fill="#FF6B57"
                            />
                            <path
                              d="M192.133 85.0666C194.563 85.0666 196.533 83.0967 196.533 80.6666C196.533 78.2365 194.563 76.2666 192.133 76.2666C189.703 76.2666 187.733 78.2365 187.733 80.6666C187.733 83.0967 189.703 85.0666 192.133 85.0666Z"
                              fill="#FF6B57"
                            />
                            <path
                              d="M88 67.4666L91.6667 74.7999L99 76.2666L93.8667 81.3999L95.3333 88.7332L88 85.0666L80.6667 88.7332L82.1333 81.3999L77 76.2666L84.3333 74.7999L88 67.4666Z"
                              fill="#C6F432"
                            />
                            <defs>
                              <radialGradient
                                id="mentorina_mascot_result_gradient"
                                cx="0"
                                cy="0"
                                r="1"
                                gradientUnits="userSpaceOnUse"
                                gradientTransform="translate(141.571 75.3571) rotate(6) scale(38.016)"
                              >
                                <stop stopColor="#EEFFA8" />
                                <stop offset="0.55" stopColor="#C6F432" />
                                <stop offset="1" stopColor="#A6D11A" />
                              </radialGradient>
                            </defs>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ) : (
                /* HUB DE SIMULADOS */
                <div className="w-full max-w-[1120px] mx-auto space-y-6 animate-in fade-in duration-200">
                  {/* BLOCO 1: 3 CARDS DE SIMULADO (1120x351 conforme SVG oficial) */}
                  <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Card 1: Simulado Completo */}
                    <div className="w-full min-h-[351px] p-8 flex flex-col justify-between rounded-[20px] bg-white border border-[#E2DFF1] shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)]">
                      <div>
                        {/* Top Badges */}
                        <div className="w-full flex items-center justify-between mb-7">
                          <div className="w-12 h-12 rounded-[12px] bg-[#E9E6FF] flex items-center justify-center shrink-0">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="#17152E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="6"
                                stroke="#17152E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle
                                cx="12"
                                cy="12"
                                r="2"
                                stroke="#17152E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span className="px-3.5 py-1.5 rounded-full bg-[#E9E6FF] text-[#4F3CF0] font-bold text-[11px] tracking-wide uppercase">
                            PROVA REAL
                          </span>
                        </div>

                        {/* Content */}
                        <h3 className="text-[22px] font-black text-[#17152E] tracking-tight mb-2">
                          Simulado Completo
                        </h3>
                        <p className="text-[14px] text-[#5F5B7D] leading-relaxed mb-6">
                          As 90 questões de um dia de prova, na ordem do ENEM.
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center gap-2 text-[#5F5B7D]">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="shrink-0"
                          >
                            <circle
                              cx="8"
                              cy="8"
                              r="6.67"
                              stroke="currentColor"
                              strokeWidth="1.33333"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 4V8L10.67 9.33"
                              stroke="currentColor"
                              strokeWidth="1.33333"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="text-[13.5px] font-semibold">
                            90 questões · 5h 30
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-8">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveExam({
                              id: "completo",
                              title: "Simulado Completo",
                              totalQuestions: 90,
                            })
                            setExamQuestionIndex(0) // Inicia na Questão 01
                            setExamAnswers({}) // Todas as questões iniciam em branco
                            setExamSecondsLeft(19800) // 5h 30m
                            setExamDelivered(false)
                            setShowSubmitModal(false)
                            if (typeof window !== "undefined") {
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                          }}
                          className="w-full h-12 rounded-[24px] bg-[#4F3CF0] hover:bg-[#3D2DC9] transition-colors text-white font-bold text-[14px] flex items-center justify-center cursor-pointer shadow-sm active:scale-[0.99]"
                        >
                          Começar
                        </button>
                      </div>
                    </div>

                    {/* Card 2: Mini-Simulado */}
                    <div className="w-full min-h-[351px] p-8 flex flex-col justify-between rounded-[20px] bg-white border border-[#E2DFF1] shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)]">
                      <div>
                        {/* Top Badges */}
                        <div className="w-full flex items-center justify-between mb-7">
                          <div className="w-12 h-12 rounded-[12px] bg-[#C6F432] flex items-center justify-center shrink-0">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
                                stroke="#17152E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <span className="px-3.5 py-1.5 rounded-full bg-[#E9E6FF] text-[#4F3CF0] font-bold text-[11px] tracking-wide uppercase">
                            MAIS FEITO
                          </span>
                        </div>

                        {/* Content */}
                        <h3 className="text-[22px] font-black text-[#17152E] tracking-tight mb-2">
                          Mini-Simulado
                        </h3>
                        <p className="text-[14px] text-[#5F5B7D] leading-relaxed mb-6">
                          Um treino rápido para dias corridos.
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center gap-2 text-[#5F5B7D]">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="shrink-0"
                          >
                            <circle
                              cx="8"
                              cy="8"
                              r="6.67"
                              stroke="currentColor"
                              strokeWidth="1.33333"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 4V8L10.67 9.33"
                              stroke="currentColor"
                              strokeWidth="1.33333"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="text-[13.5px] font-semibold">
                            20 questões · 45 min
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-8">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveExam({
                              id: "mini",
                              title: "Mini-Simulado",
                              totalQuestions: 20,
                            })
                            setExamQuestionIndex(0)
                            setExamAnswers({})
                            setExamSecondsLeft(2700)
                            setExamDelivered(false)
                            setShowSubmitModal(false)
                            if (typeof window !== "undefined") {
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                          }}
                          className="w-full h-12 rounded-[24px] bg-white border border-[#8C88AA] hover:bg-[#F7F6FC] transition-colors text-[#17152E] font-bold text-[14px] flex items-center justify-center cursor-pointer active:scale-[0.99]"
                        >
                          Começar
                        </button>
                      </div>
                    </div>

                    {/* Card 3: Por área */}
                    <div className="w-full min-h-[351px] p-8 flex flex-col justify-between rounded-[20px] bg-white border border-[#E2DFF1] shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)]">
                      <div>
                        {/* Top Badges */}
                        <div className="w-full flex items-center justify-between mb-7">
                          <div className="w-12 h-12 rounded-[12px] bg-[#3CC8F0] flex items-center justify-center shrink-0">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M12 2L2 7L12 12L22 7L12 2Z"
                                stroke="#17152E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M2 17L12 22L22 17"
                                stroke="#17152E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M2 12L12 17L22 12"
                                stroke="#17152E"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Content */}
                        <h3 className="text-[22px] font-black text-[#17152E] tracking-tight mb-2">
                          Por área
                        </h3>
                        <p className="text-[14px] text-[#5F5B7D] leading-relaxed mb-6">
                          Escolha uma área e treine com precisão.
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center gap-2 text-[#5F5B7D]">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="shrink-0"
                          >
                            <circle
                              cx="8"
                              cy="8"
                              r="6.67"
                              stroke="currentColor"
                              strokeWidth="1.33333"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 4V8L10.67 9.33"
                              stroke="currentColor"
                              strokeWidth="1.33333"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <span className="text-[13.5px] font-semibold">
                            45 questões · 2h 30
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-8">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveExam({
                              id: "area",
                              title: "Simulado Por Área · Matemática",
                              totalQuestions: 45,
                            })
                            setExamQuestionIndex(0)
                            setExamAnswers({})
                            setExamSecondsLeft(9000)
                            setExamDelivered(false)
                            setShowSubmitModal(false)
                            if (typeof window !== "undefined") {
                              window.scrollTo({ top: 0, behavior: "smooth" })
                            }
                          }}
                          className="w-full h-12 rounded-[24px] bg-white border border-[#8C88AA] hover:bg-[#F7F6FC] transition-colors text-[#17152E] font-bold text-[14px] flex items-center justify-center cursor-pointer active:scale-[0.99]"
                        >
                          Começar
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* BLOCO 2: CARD "SEUS ÚLTIMOS SIMULADOS" (1120x318 conforme SVG oficial) */}
                  <div className="w-full rounded-[20px] bg-white border border-[#E2DFF1] p-8 shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)]">
                    {/* Cabeçalho do Card */}
                    <div className="w-full flex items-center justify-between pb-6 mb-2">
                      <h3 className="text-[18px] font-black text-[#17152E] tracking-tight">
                        Seus últimos simulados
                      </h3>
                      <button className="text-[14px] font-bold text-[#4F3CF0] hover:underline cursor-pointer">
                        Ver todos
                      </button>
                    </div>

                    {/* Tabela de Simulados */}
                    <div className="w-full overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-[#F0EDF9] text-[11px] font-bold text-[#5F5B7D] uppercase tracking-wider">
                            <th className="pb-3 font-bold w-[120px]">DATA</th>
                            <th className="pb-3 font-bold">SIMULADO</th>
                            <th className="pb-3 font-bold w-[160px]">
                              ACERTOS
                            </th>
                            <th className="pb-3 font-bold w-[140px]">TEMPO</th>
                            <th className="pb-3 font-bold text-right w-[140px]"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F0EDF9] text-[14px] text-[#17152E]">
                          {/* Linha 1 */}
                          <tr className="hover:bg-[#FBFBFE] transition-colors group">
                            <td className="py-4 font-semibold text-[#17152E]">
                              28/10
                            </td>
                            <td className="py-4 font-semibold text-[#17152E]">
                              Mini-Simulado · Matemática
                            </td>
                            <td className="py-4 font-semibold text-[#17152E]">
                              14/20
                            </td>
                            <td className="py-4 font-semibold text-[#17152E]">
                              42:12
                            </td>
                            <td className="py-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedExamResult({
                                    id: "mini",
                                    title: "Mini-Simulado · Matemática",
                                    totalQuestions: 20,
                                    correctCount: 14,
                                    percent: 70,
                                    timeSpent: "42:12",
                                    avgTimePerQuestion:
                                      "Média de 2m 06s por questão",
                                    triScore: 710,
                                    triMessage:
                                      "Dentro do esperado para Matemática",
                                    blankCount: 0,
                                    blankPercent: 0,
                                    date: "28 de Outubro",
                                  })
                                  setSelectedGabaritoIndex(7)
                                  setGabaritoFilter("todas")
                                  setIsViewingAnswerKey(true)
                                  if (typeof window !== "undefined") {
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    })
                                  }
                                }}
                                className="font-semibold text-[14px] text-[#4F3CF0] hover:underline cursor-pointer"
                              >
                                Ver gabarito
                              </button>
                            </td>
                          </tr>

                          {/* Linha 2 */}
                          <tr className="hover:bg-[#FBFBFE] transition-colors group">
                            <td className="py-4 font-semibold text-[#17152E]">
                              24/10
                            </td>
                            <td className="py-4 font-semibold text-[#17152E]">
                              Por área · Ciências da Natureza
                            </td>
                            <td className="py-4 font-semibold text-[#17152E]">
                              29/45
                            </td>
                            <td className="py-4 font-semibold text-[#17152E]">
                              2:15:40
                            </td>
                            <td className="py-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedExamResult({
                                    id: "area",
                                    title: "Por área · Ciências da Natureza",
                                    totalQuestions: 45,
                                    correctCount: 29,
                                    percent: 64,
                                    timeSpent: "2:15:40",
                                    avgTimePerQuestion:
                                      "Média de 3m 00s por questão",
                                    triScore: 745,
                                    triMessage:
                                      "Acima da média de Ciências da Natureza",
                                    blankCount: 16,
                                    blankPercent: 36,
                                    date: "24 de Outubro",
                                  })
                                  setSelectedGabaritoIndex(7)
                                  setGabaritoFilter("todas")
                                  setIsViewingAnswerKey(true)
                                  if (typeof window !== "undefined") {
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    })
                                  }
                                }}
                                className="font-semibold text-[14px] text-[#4F3CF0] hover:underline cursor-pointer"
                              >
                                Ver gabarito
                              </button>
                            </td>
                          </tr>

                          {/* Linha 3 */}
                          <tr className="hover:bg-[#FBFBFE] transition-colors group">
                            <td className="py-4 font-semibold text-[#17152E]">
                              17/10
                            </td>
                            <td className="py-4 font-semibold text-[#17152E]">
                              Simulado Completo · Dia 1
                            </td>
                            <td className="py-4 font-semibold text-[#17152E]">
                              58/90
                            </td>
                            <td className="py-4 font-semibold text-[#17152E]">
                              5:12:05
                            </td>
                            <td className="py-4 text-right">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedExamResult({
                                    id: "completo",
                                    title: "Simulado Completo · Dia 1",
                                    totalQuestions: 90,
                                    correctCount: 58,
                                    percent: 64,
                                    timeSpent: "5:12:05",
                                    avgTimePerQuestion:
                                      "Média de 3m 28s por questão",
                                    triScore: 720,
                                    triMessage: "Acima da média geral nacional",
                                    blankCount: 32,
                                    blankPercent: 36,
                                    date: "17 de Outubro",
                                  })
                                  setSelectedGabaritoIndex(7)
                                  setGabaritoFilter("todas")
                                  setIsViewingAnswerKey(true)
                                  if (typeof window !== "undefined") {
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    })
                                  }
                                }}
                                className="font-semibold text-[14px] text-[#4F3CF0] hover:underline cursor-pointer"
                              >
                                Ver gabarito
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ))}

            {/* ======================================================================= */}
            {/* TAB: REDAÇÃO (AI Essay Lab & Feedback Screen)                           */}
            {/* ======================================================================= */}
            {activeTab === "redacao" &&
              (selectedEssayFeedback ? (
                /* ===================================================================== */
                /* SCREEN: FEEDBACK DA REDAÇÃO                                           */
                /* ===================================================================== */
                <div className="w-full max-w-[1120px] mx-auto animate-in fade-in duration-200">
                  {/* Cabeçalho da Correção (1120x112 conforme SVG oficial) */}
                  <div className="w-full flex flex-col justify-between pt-1 pb-4">
                    {/* Linha Superior: Voltar para Redação (Esquerda) e Notificações/Ajuda/Avatar (Direita) */}
                    <div className="w-full flex items-center justify-between">
                      {/* Botão Voltar para Redação */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEssayFeedback(null)
                          if (typeof window !== "undefined") {
                            window.scrollTo({ top: 0, behavior: "smooth" })
                          }
                        }}
                        className="inline-flex items-center gap-2.5 text-[#4F3CF0] hover:opacity-80 transition cursor-pointer select-none group py-1"
                      >
                        <svg
                          width="7"
                          height="12"
                          viewBox="0 0 7 12"
                          fill="none"
                          className="shrink-0 group-hover:-translate-x-0.5 transition-transform"
                        >
                          <path
                            d="M6 11L1 6L6 1"
                            stroke="#4F3CF0"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span className="font-bold text-[15px] leading-none text-[#4F3CF0]">
                          Redação
                        </span>
                      </button>

                      {/* Notificações, Ajuda e Avatar */}
                      <div className="flex items-center gap-4 sm:gap-5">
                        {/* Sino de Notificações */}
                        <button
                          type="button"
                          className="w-6 h-6 flex items-center justify-center text-[#5F5B7D] hover:text-[#17152E] transition cursor-pointer"
                          title="Notificações"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <path
                              d="M4 14.5V9.9167C4 8.45802 4.63 7.05915 5.76 6.02766C6.88 4.99617 8.41 4.4167 10 4.4167C11.59 4.4167 13.12 4.99617 14.24 6.02766C15.37 7.05915 16 8.45802 16 9.9167V14.5L18 16.3334H2L4 14.5Z"
                              stroke="#5F5B7D"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8 18.25H12"
                              stroke="#5F5B7D"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        {/* Ajuda / Dúvidas */}
                        <button
                          type="button"
                          onClick={() => setIsMentorinaChatOpen(true)}
                          className="w-6 h-6 flex items-center justify-center text-[#5F5B7D] hover:text-[#17152E] transition cursor-pointer"
                          title="Tirar dúvidas com Mentorina AI"
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                          >
                            <circle
                              cx="10"
                              cy="10"
                              r="9"
                              stroke="#5F5B7D"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.5 7.0001C7.5 6.5497 7.62 6.1082 7.86 5.722C8.09 5.3359 8.42 5.0196 8.82 4.8065C9.21 4.5933 9.66 4.4913 10.11 4.5112C10.56 4.5311 11 4.6722 11.37 4.9195C11.75 5.1669 12.05 5.5112 12.25 5.9163C12.45 6.3214 12.53 6.7721 12.49 7.2209C12.45 7.6696 12.29 8.0997 12.03 8.4656C11.77 8.8316 11.41 9.1199 11 9.3001C10.4 9.6001 10 10.2001 10 11.0001M10 15.0001H10.01"
                              stroke="#5F5B7D"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        {/* Avatar do Usuário (40x40 rx=20 fill=#E9E6FF) */}
                        <div
                          className="w-10 h-10 rounded-full bg-[#E9E6FF] flex items-center justify-center font-bold text-[#4F3CF0] text-[17px] select-none shrink-0"
                          title={userFullName || userName}
                        >
                          {userName ? userName.charAt(0).toUpperCase() : "J"}
                        </div>
                      </div>
                    </div>

                    {/* Linha Inferior: Título e Subtítulo */}
                    <div className="mt-5">
                      <h1 className="text-[26px] sm:text-[28px] font-black text-[#17152E] tracking-tight leading-tight">
                        Correção da redação
                      </h1>
                      <p className="text-[13.5px] sm:text-[14px] font-medium text-[#5F5B7D] mt-1.5 truncate">
                        {selectedEssayFeedback.theme} · corrigido pela mentorina
                        em {formatFeedbackDate(selectedEssayFeedback.date)}
                      </p>
                    </div>
                  </div>

                  {/* Cards de Nota e Competências + Pontos Fortes e Melhorias (conforme SVGs oficiais) */}
                  {(() => {
                    const isDefaultRedacao1 =
                      selectedEssayFeedback.id === "redacao-1"

                    const c1Score = isDefaultRedacao1
                      ? 160
                      : (selectedEssayFeedback.competencies?.c1 ?? 160)
                    const c2Score = isDefaultRedacao1
                      ? 160
                      : (selectedEssayFeedback.competencies?.c2 ?? 160)
                    const c3Score = isDefaultRedacao1
                      ? 140
                      : (selectedEssayFeedback.competencies?.c3 ?? 140)
                    const c4Score = isDefaultRedacao1
                      ? 160
                      : (selectedEssayFeedback.competencies?.c4 ?? 160)
                    const c5Score = isDefaultRedacao1
                      ? 140
                      : (selectedEssayFeedback.competencies?.c5 ?? 140)
                    const essayScore = isDefaultRedacao1
                      ? 760
                      : (selectedEssayFeedback.score ??
                        c1Score + c2Score + c3Score + c4Score + c5Score)

                    const currentIndex = essayHistory.findIndex(
                      (e) => e.id === selectedEssayFeedback.id,
                    )
                    const previousEssay =
                      currentIndex !== -1 &&
                      currentIndex + 1 < essayHistory.length
                        ? essayHistory[currentIndex + 1]
                        : null
                    const scoreDiff = isDefaultRedacao1
                      ? 80
                      : previousEssay
                        ? essayScore - previousEssay.score
                        : 80
                    const diffText =
                      scoreDiff >= 0
                        ? `+${scoreDiff} em relação à última`
                        : `${scoreDiff} em relação à última`

                    const competenciesList = [
                      {
                        id: "C1",
                        title: "Domínio da escrita formal",
                        score: c1Score,
                      },
                      {
                        id: "C2",
                        title: "Compreensão da proposta",
                        score: c2Score,
                      },
                      {
                        id: "C3",
                        title: "Seleção e organização dos argumentos",
                        score: c3Score,
                      },
                      {
                        id: "C4",
                        title: "Conhecimento de recursos coesivos",
                        score: c4Score,
                      },
                      {
                        id: "C5",
                        title: "Proposta de intervenção",
                        score: c5Score,
                      },
                    ]

                    const strengthsList =
                      isDefaultRedacao1 ||
                      selectedEssayFeedback.id === "redacao-1"
                        ? [
                            "Tese clara e bem defendida.",
                            "Bom uso de dados (CNPq) para sustentar o argumento.",
                          ]
                        : selectedEssayFeedback.feedback?.strengths?.length
                          ? selectedEssayFeedback.feedback.strengths
                          : [
                              "Tese clara e bem defendida.",
                              "Bom uso de dados (CNPq) para sustentar o argumento.",
                            ]

                    const improvementsList =
                      isDefaultRedacao1 ||
                      selectedEssayFeedback.id === "redacao-1"
                        ? [
                            "C3: os argumentos do D2 ficaram meio soltos no final do parágrafo.",
                            "C5: a proposta pode ter um detalhamento da ação para ficar 100%.",
                          ]
                        : selectedEssayFeedback.feedback?.improvements?.length
                          ? selectedEssayFeedback.feedback.improvements
                          : [
                              "C3: os argumentos do D2 ficaram meio soltos no final do parágrafo.",
                              "C5: a proposta pode ter um detalhamento da ação para ficar 100%.",
                            ]

                    return (
                      <>
                        {/* Linha 1: NOTA (300px) + Competências (796px) - total 1120px */}
                        <div className="mt-6 flex flex-col lg:flex-row gap-6 items-stretch">
                          {/* Card 1: NOTA (300px x 290px, fill=#17152E, rx=20) */}
                          <div className="w-full lg:w-[300px] h-[290px] rounded-[20px] bg-[#17152E] p-7 flex flex-col justify-between shrink-0 shadow-sm relative overflow-hidden">
                            {/* Linha Superior: NOTA + Ícone de Destaque */}
                            <div className="flex items-center justify-between">
                              <span className="text-[12px] font-bold tracking-[0.1em] text-[#ABA7C8] uppercase">
                                NOTA
                              </span>
                              <div className="shrink-0">
                                <svg
                                  width="52"
                                  height="54"
                                  viewBox="212 63 52 54"
                                  fill="none"
                                >
                                  <path
                                    d="M225 63H251C258.2 63 264 68.8 264 76V96C264 103.2 258.2 109 251 109H232L221 117C219.5 118.1 217.5 117 217.5 115.2V108.7C214.3 106.5 212 101.5 212 96V76C212 68.8 217.8 63 225 63Z"
                                    fill="#4F3CF0"
                                    fillOpacity="0.4"
                                  />
                                  <path
                                    d="M223 99H232V91H241V83H253"
                                    stroke="white"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M255 68C255.6 71.3 256.7 72.4 260 73C256.7 73.6 255.6 74.7 255 78C254.4 74.7 253.3 73.6 250 73C253.3 72.4 254.4 71.3 255 68Z"
                                    fill="#C6F432"
                                  />
                                  <path
                                    d="M253 86.5C254.933 86.5 256.5 84.933 256.5 83C256.5 81.067 254.933 79.5 253 79.5C251.067 79.5 249.5 81.067 249.5 83C249.5 84.933 251.067 86.5 253 86.5Z"
                                    fill="#C6F432"
                                  />
                                </svg>
                              </div>
                            </div>

                            {/* Centro: Pontuação + "de 1000" */}
                            <div className="flex items-baseline gap-2.5 my-auto">
                              <span className="text-[64px] font-black leading-none tracking-tight text-[#C6F432]">
                                {essayScore}
                              </span>
                              <span className="text-[16px] font-bold text-white tracking-normal">
                                de 1000
                              </span>
                            </div>

                            {/* Rodapé: Evolução em relação à última redação */}
                            <div className="text-[13.5px] font-medium text-white/90">
                              {diffText}
                            </div>
                          </div>

                          {/* Card 2: Competências (796px x 290px, border=#E2DFF1, rx=20) */}
                          <div className="w-full lg:w-[796px] lg:flex-1 h-[290px] rounded-[20px] bg-white border border-[#E2DFF1] p-6 lg:px-8 lg:py-6 flex flex-col justify-between shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)]">
                            {/* Título */}
                            <div>
                              <h3 className="text-[17px] font-black text-[#17152E] tracking-tight">
                                Competências
                              </h3>
                            </div>

                            {/* 5 Linhas de Competências */}
                            <div className="flex flex-col justify-between flex-1 mt-3 gap-2 sm:gap-2.5">
                              {competenciesList.map((comp) => {
                                const isGood = comp.score >= 160
                                const percentage = Math.min(
                                  100,
                                  Math.max(0, (comp.score / 200) * 100),
                                )

                                return (
                                  <div
                                    key={comp.id}
                                    className="flex items-center justify-between gap-3 sm:gap-4"
                                  >
                                    {/* Esquerda: Badge C1-C5 + Nome */}
                                    <div className="flex items-center gap-3 min-w-0 flex-1">
                                      <span className="w-[33px] h-[28px] rounded-[8px] bg-[#E9E6FF] text-[#4F3CF0] font-bold text-[13px] flex items-center justify-center shrink-0">
                                        {comp.id}
                                      </span>
                                      <span className="text-[13.5px] sm:text-[14px] font-medium text-[#17152E] truncate">
                                        {comp.title}
                                      </span>
                                    </div>

                                    {/* Direita: Barra de Progresso + Pontuação */}
                                    <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                                      {/* Barra (292px de largura no desktop conforme SVG) */}
                                      <div className="w-[110px] sm:w-[200px] md:w-[292px] h-2 rounded-full bg-[#E9E6FF] overflow-hidden">
                                        <div
                                          className={`h-full rounded-full transition-all duration-300 ${
                                            isGood
                                              ? "bg-[#4F3CF0]"
                                              : "bg-[#FF6B57]"
                                          }`}
                                          style={{ width: `${percentage}%` }}
                                        />
                                      </div>

                                      {/* Pontuação */}
                                      <span
                                        className={`text-[13.5px] sm:text-[14px] font-black text-right min-w-[58px] ${
                                          isGood
                                            ? "text-[#17152E]"
                                            : "text-[#C42B30]"
                                        }`}
                                      >
                                        {comp.score}/200
                                      </span>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Linha 2: O que está bom (548px) + O que melhorar (548px) - total 1120px */}
                        <div className="mt-6 flex flex-col lg:flex-row gap-6 items-stretch">
                          {/* Card 1: O que está bom (548px x 168px, fill=white, rx=20) */}
                          <div className="w-full lg:w-[548px] lg:flex-1 min-h-[168px] rounded-[20px] bg-white border border-[#E2DFF1] p-6 sm:px-8 sm:py-7 flex flex-col justify-between shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)]">
                            {/* Top: Ícone + Título */}
                            <div className="flex items-center gap-3.5">
                              <div className="w-8 h-8 rounded-full bg-[#E3F5EC] flex items-center justify-center shrink-0">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M13.3332 4L5.99984 11.3333L2.6665 8"
                                    stroke="#137A51"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <h3 className="text-[17px] font-bold text-[#17152E] tracking-tight">
                                O que está bom
                              </h3>
                            </div>

                            {/* Bullets */}
                            <ul className="mt-4 space-y-2 sm:space-y-2.5">
                              {strengthsList.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2.5 text-[14px] text-[#17152E] leading-snug"
                                >
                                  <span className="text-[#17152E] font-bold leading-none select-none text-[15px]">
                                    •
                                  </span>
                                  <span className="font-normal">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Card 2: O que melhorar (548px x 168px, fill=white, rx=20) */}
                          <div className="w-full lg:w-[548px] lg:flex-1 min-h-[168px] rounded-[20px] bg-white border border-[#E2DFF1] p-6 sm:px-8 sm:py-7 flex flex-col justify-between shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)]">
                            {/* Top: Ícone + Título */}
                            <div className="flex items-center gap-3.5">
                              <div className="w-8 h-8 rounded-full bg-[#FCE8E8] flex items-center justify-center shrink-0">
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M6 13.3335H12"
                                    stroke="#C42B30"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                  <path
                                    d="M9 2.3332C9.265 2.0679 9.625 1.9189 10 1.9189C10.186 1.9189 10.37 1.9555 10.541 2.0266C10.713 2.0977 10.869 2.2018 11 2.3332C11.131 2.4645 11.235 2.6204 11.307 2.792C11.378 2.9635 11.414 3.1474 11.414 3.3332C11.414 3.5189 11.378 3.7028 11.307 3.8744C11.235 4.0459 11.131 4.2018 11 4.3332L2.667 12.6665L0 13.3332L0.667 10.6665L9 2.3332Z"
                                    stroke="#C42B30"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              <h3 className="text-[17px] font-bold text-[#17152E] tracking-tight">
                                O que melhorar
                              </h3>
                            </div>

                            {/* Bullets */}
                            <ul className="mt-4 space-y-2 sm:space-y-2.5">
                              {improvementsList.map((item, idx) => {
                                const match = item.match(/^(C\d+:)(.*)$/)
                                return (
                                  <li
                                    key={idx}
                                    className="flex items-start gap-2.5 text-[14px] text-[#17152E] leading-snug"
                                  >
                                    <span className="text-[#17152E] font-bold leading-none select-none text-[15px]">
                                      •
                                    </span>
                                    <span className="font-normal">
                                      {match ? (
                                        <>
                                          <strong className="font-bold">
                                            {match[1]}
                                          </strong>
                                          {match[2]}
                                        </>
                                      ) : (
                                        item
                                      )}
                                    </span>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>
                        </div>

                        {/* Card Mentorina AI: Quer ajuda para reescrever a conclusão? (1120x96, fill=#E9E6FF, rx=20) */}
                        <div className="mt-6 w-full rounded-[20px] bg-[#E9E6FF] p-5 sm:px-8 sm:py-0 min-h-[96px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          {/* Esquerda: Ícone Sparkle + Texto */}
                          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                            <div className="shrink-0 flex items-center justify-center">
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M8 0.75L9.7417 6.0667L15.3334 8.0833L9.7417 10.1L8 15.4167L6.2584 10.1L0.6667 8.0833L6.2584 6.0667L8 0.75Z"
                                  stroke="#4F3CF0"
                                  strokeWidth="1.83333"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <p className="text-[13.5px] sm:text-[14px] text-[#17152E] leading-snug">
                              <span className="font-bold">
                                Quer ajuda para reescrever a conclusão?
                              </span>{" "}
                              <span className="font-normal text-[#17152E]/90">
                                Posso te mostrar um exemplo de proposta de
                                intervenção completa.
                              </span>
                            </p>
                          </div>

                          {/* Direita: Botão Falar com a Mentorina (214px x 48px, bg=#4F3CF0, rx=24) */}
                          <button
                            type="button"
                            onClick={() => setIsMentorinaChatOpen(true)}
                            className="w-full sm:w-[214px] h-12 rounded-[24px] bg-[#4F3CF0] hover:bg-[#3D2DC9] transition-all flex items-center justify-center shrink-0 shadow-sm active:scale-[0.99] cursor-pointer"
                          >
                            <span className="text-[14px] font-bold text-white select-none">
                              Falar com a Mentorina
                            </span>
                          </button>
                        </div>

                        {/* Botões de Ação Alinhados à Esquerda (414x48 conforme SVG oficial) */}
                        <div className="mt-6 pb-12 flex flex-wrap items-center gap-3 sm:gap-3.5 justify-start">
                          {/* Botão 1: Reescrever redação (237px x 48px, bg=#4F3CF0, pill) */}
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedEssayFeedback) {
                                setNewEssayTheme(selectedEssayFeedback.theme)
                                setNewEssayText(
                                  selectedEssayFeedback.text || "",
                                )
                              }
                              setSelectedEssayFeedback(null)
                              setIsWritingEssay(true)
                            }}
                            className="w-full sm:w-[237px] h-12 rounded-[24px] bg-[#4F3CF0] hover:bg-[#3D2DC9] transition-all flex items-center justify-center gap-2.5 px-6 shadow-sm active:scale-[0.99] cursor-pointer"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              className="shrink-0"
                            >
                              <path
                                d="M7.5 15.6665H15"
                                stroke="white"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M11.25 1.9167C11.5815 1.5852 12.0312 1.3989 12.5 1.3989C12.7321 1.3989 12.962 1.4447 13.1765 1.5335C13.391 1.6223 13.5858 1.7525 13.75 1.9167C13.9142 2.0808 14.0444 2.2757 14.1332 2.4902C14.222 2.7047 14.2678 2.9345 14.2678 3.1667C14.2678 3.3988 14.222 3.6287 14.1332 3.8432C14.0444 4.0577 13.9142 4.2525 13.75 4.4167L3.3333 14.8334L0 15.6667L0.8333 12.3334L11.25 1.9167Z"
                                stroke="white"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            <span className="text-[14px] sm:text-[14.5px] font-bold text-white tracking-tight select-none">
                              Reescrever redação
                            </span>
                          </button>

                          {/* Botão 2: Nova redação (163.5px x 48px, bg=white, border=#8C88AA, pill) */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEssayFeedback(null)
                              setNewEssayTheme(
                                "Desafios para a valorização de comunidades e povos tradicionais no Brasil",
                              )
                              setNewEssayText("")
                              setEssaySeconds(4360)
                              setIsWritingEssay(true)
                            }}
                            className="w-full sm:w-[164px] h-12 rounded-[24px] bg-white border border-[#8C88AA] hover:bg-[#F7F6FC] transition-all flex items-center justify-center px-6 shadow-xs active:scale-[0.99] cursor-pointer"
                          >
                            <span className="text-[14px] sm:text-[14.5px] font-bold text-[#17152E] tracking-tight select-none">
                              Nova redação
                            </span>
                          </button>
                        </div>
                      </>
                    )
                  })()}
                </div>
              ) : (
                /* ===================================================================== */
                /* OVERVIEW: TREINAR E HISTÓRICO DE REDAÇÕES                             */
                /* ===================================================================== */
                <div className="space-y-6">
                  {/* Card 1: Hora de treinar e aprender */}
                  <div className="bg-white border border-[#E2DFF1] rounded-[20px] p-6 lg:p-8 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#E2DFF1]">
                      <div>
                        <h2 className="text-2xl font-black text-[#17152E] mt-1 tracking-tight">
                          Hora de treinar e aprender
                        </h2>
                      </div>
                    </div>

                    {/* Essay Prompt of the week */}
                    <div className="mt-6 p-6 rounded-2xl bg-[#F7F6FC] border border-[#E2DFF1]">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#4F3CF0]">
                        TEMA DA SEMANA
                      </span>
                      <h3 className="text-lg font-black text-[#17152E] mt-1">
                        "Desafios para a valorização de comunidades e povos
                        tradicionais no Brasil"
                      </h3>
                      <p className="text-xs text-[#5F5B7D] mt-2 leading-relaxed">
                        A partir da leitura dos textos motivadores e com base
                        nos conhecimentos construídos ao longo de sua formação,
                        redija um texto dissertativo-argumentativo em modalidade
                        escrita formal da língua portuguesa.
                      </p>

                      <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setNewEssayTheme(
                              "Desafios para a valorização de comunidades e povos tradicionais no Brasil",
                            )
                            setIsWritingEssay(true)
                          }}
                          className="px-6 py-3 rounded-xl bg-[#4F3CF0] hover:bg-[#3D2CD8] text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-md active:scale-95 flex items-center gap-2"
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                          <span>Escrever Redação Agora</span>
                        </button>
                      </div>
                    </div>

                    {/* 5 Competencies Guide */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
                      {[
                        {
                          n: "C1",
                          t: "Gramática Formal",
                          desc: "Domínio da norma culta",
                        },
                        {
                          n: "C2",
                          t: "Compreensão do Tema",
                          desc: "Aplicação de conceitos e repertório",
                        },
                        {
                          n: "C3",
                          t: "Argumentação",
                          desc: "Seleção e defesa de ponto de vista",
                        },
                        {
                          n: "C4",
                          t: "Coesão Textual",
                          desc: "Conectivos e estrutura lógica",
                        },
                        {
                          n: "C5",
                          t: "Intervenção Social",
                          desc: "5 elementos completos da proposta",
                        },
                      ].map((c, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-xl border border-[#E2DFF1] bg-white"
                        >
                          <span className="text-xs font-black text-[#4F3CF0] bg-[#E9E6FF] px-2 py-0.5 rounded-md">
                            {c.n}
                          </span>
                          <h5 className="text-xs font-bold text-[#17152E] mt-2">
                            {c.t}
                          </h5>
                          <p className="text-[11px] text-[#5F5B7D] mt-0.5">
                            {c.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 2: HISTÓRICO DE REDAÇÕES (Exibido quando houver histórico registrado) */}
                  {essayHistory.length > 0 && (
                    <div className="bg-white border border-[#E2DFF1] rounded-[20px] p-6 lg:p-8 shadow-xs space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-[#E2DFF1]">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h3 className="text-xl font-black text-[#17152E] tracking-tight">
                              Histórico de redações
                            </h3>
                            <span className="bg-[#E9E6FF] text-[#4F3CF0] font-extrabold text-xs px-2.5 py-0.5 rounded-full">
                              {essayHistory.length}{" "}
                              {essayHistory.length === 1
                                ? "redação"
                                : "redações"}
                            </span>
                          </div>
                          <p className="text-xs text-[#5F5B7D] font-medium mt-1">
                            Acompanhe suas notas, evolução e acesse o feedback
                            detalhado de cada texto corrigido.
                          </p>
                        </div>

                        {/* Média de notas badge */}
                        <div className="flex items-center gap-2 self-start sm:self-center bg-[#F7F6FC] border border-[#E2DFF1] px-3.5 py-1.5 rounded-xl">
                          <span className="text-[11px] font-bold text-[#5F5B7D]">
                            Média das redações:
                          </span>
                          <span className="text-sm font-black text-[#4F3CF0]">
                            {Math.round(
                              essayHistory.reduce(
                                (acc, curr) => acc + curr.score,
                                0,
                              ) / essayHistory.length,
                            )}{" "}
                            pts
                          </span>
                        </div>
                      </div>

                      {/* Lista de redações */}
                      <div className="space-y-4">
                        {essayHistory.map((essay) => (
                          <div
                            key={essay.id}
                            className="p-5 sm:p-6 rounded-2xl border border-[#E2DFF1] hover:border-[#4F3CF0] transition-all duration-200 bg-white hover:shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                          >
                            <div className="space-y-2 flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2.5">
                                <span className="bg-[#E3F5EC] text-[#137A51] font-bold text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#137A51]" />
                                  {essay.status}
                                </span>
                                <span className="text-xs text-[#5F5B7D] font-medium">
                                  {essay.date}
                                </span>
                                <span className="text-xs text-[#8C88AA] font-medium">
                                  ·
                                </span>
                                <span className="text-xs text-[#5F5B7D] font-medium">
                                  {essay.linesCount
                                    ? `${essay.linesCount} linhas`
                                    : "Texto completo"}
                                </span>
                              </div>

                              <h4 className="text-base sm:text-lg font-black text-[#17152E] group-hover:text-[#4F3CF0] transition-colors leading-snug">
                                {essay.theme}
                              </h4>

                              {/* Mini competências badges */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F7F6FC] text-[#5F5B7D] border border-[#E2DFF1]">
                                  C1:{" "}
                                  <strong className="text-[#17152E]">
                                    {essay.competencies.c1}
                                  </strong>
                                </span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F7F6FC] text-[#5F5B7D] border border-[#E2DFF1]">
                                  C2:{" "}
                                  <strong className="text-[#17152E]">
                                    {essay.competencies.c2}
                                  </strong>
                                </span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F7F6FC] text-[#5F5B7D] border border-[#E2DFF1]">
                                  C3:{" "}
                                  <strong className="text-[#17152E]">
                                    {essay.competencies.c3}
                                  </strong>
                                </span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F7F6FC] text-[#5F5B7D] border border-[#E2DFF1]">
                                  C4:{" "}
                                  <strong className="text-[#17152E]">
                                    {essay.competencies.c4}
                                  </strong>
                                </span>
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#F7F6FC] text-[#5F5B7D] border border-[#E2DFF1]">
                                  C5:{" "}
                                  <strong className="text-[#17152E]">
                                    {essay.competencies.c5}
                                  </strong>
                                </span>
                              </div>
                            </div>

                            {/* Nota e botão Visualizar Feedback */}
                            <div className="flex items-center justify-between md:justify-end gap-5 pt-3 md:pt-0 border-t md:border-t-0 border-[#E2DFF1]/70 shrink-0">
                              <div className="text-left md:text-right">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5F5B7D] block">
                                  Nota Final
                                </span>
                                <div className="flex items-baseline md:justify-end gap-1">
                                  <span className="text-2xl sm:text-3xl font-black text-[#4F3CF0] tracking-tight">
                                    {essay.score}
                                  </span>
                                  <span className="text-xs text-[#5F5B7D] font-bold">
                                    / 1000
                                  </span>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEssayFeedback(essay)
                                  if (typeof window !== "undefined") {
                                    window.scrollTo({
                                      top: 0,
                                      behavior: "smooth",
                                    })
                                  }
                                }}
                                className="h-[44px] px-5 rounded-full bg-[#4F3CF0] hover:bg-[#3D2CD8] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-xs active:scale-95 shrink-0"
                              >
                                <svg
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                                <span>Visualizar Feedback</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}

            {/* ======================================================================= */}
            {/* TAB: PERFIL (Student Profile & Settings)                                 */}
            {/* ======================================================================= */}
            {activeTab === "perfil" &&
              (isChangingPassword ? (
                /* ===================================================================== */
                /* SCREEN: ALTERAR SENHA (Exact 1184x814 Figma view)                     */
                /* ===================================================================== */
                <div className="w-full max-w-[1184px] mx-auto animate-in fade-in duration-200">
                  {/* Top Navigation Row: <- Perfil + Action Icons */}
                  <div className="flex items-center justify-between pb-8">
                    {/* Back button: <- Perfil */}
                    <button
                      type="button"
                      onClick={handleCancelChangingPassword}
                      className="flex items-center gap-2 text-[#4F3CF0] font-bold text-sm hover:underline cursor-pointer group py-1"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4F3CF0"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:-translate-x-1 transition-transform"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      <span>Perfil</span>
                    </button>

                    {/* Right side header icons */}
                    <div className="flex items-center gap-3">
                      {/* Notification Bell */}
                      <button
                        type="button"
                        className="w-10 h-10 rounded-full bg-white border border-[#E2DFF1] flex items-center justify-center text-[#5F5B7D] hover:text-[#4F3CF0] hover:border-[#4F3CF0] transition relative cursor-pointer shadow-2xs"
                        aria-label="Notificações"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C6F432] ring-2 ring-white" />
                      </button>

                      {/* Help / FAQ */}
                      <button
                        type="button"
                        className="w-10 h-10 rounded-full bg-white border border-[#E2DFF1] flex items-center justify-center text-[#5F5B7D] hover:text-[#4F3CF0] hover:border-[#4F3CF0] transition cursor-pointer shadow-2xs"
                        aria-label="Ajuda e Suporte"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </button>

                      {/* User Avatar Circle */}
                      <div className="w-10 h-10 rounded-full bg-[#E9E6FF] border-2 border-white flex items-center justify-center text-[#4F3CF0] font-black text-sm select-none shadow-xs">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Page Titles: Alterar senha */}
                  <div className="pb-8">
                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#17152E]">
                      Alterar senha
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5F5B7D] font-medium mt-1">
                      Escolha uma senha forte que você não use em outros sites.
                    </p>
                  </div>

                  {/* Form Card: 560px aligned left with minimal spacing between fields */}
                  <div className="w-full max-w-[560px] mr-auto bg-white border border-[#E2DFF1] rounded-[20px] p-6 sm:p-7 shadow-xs">
                    <form
                      onSubmit={handleSaveNewPassword}
                      className="space-y-2.5"
                    >
                      {/* Success Alert */}
                      {passwordChangeSuccess && (
                        <div className="bg-[#E6F8EF] border border-[#A7E6C5] text-[#137A51] px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span>Senha alterada com sucesso!</span>
                        </div>
                      )}

                      {/* Error Alert */}
                      {passwordChangeError && (
                        <div className="bg-[#FCE8E8] border border-[#F6B5B5] text-[#C42B30] px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 animate-fadeIn">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          <span>{passwordChangeError}</span>
                        </div>
                      )}

                      {/* Field 1: Senha atual */}
                      <div>
                        <label className="block text-xs font-bold text-[#17152E] mb-1">
                          Senha atual
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => {
                              setCurrentPassword(e.target.value)
                              if (passwordChangeError)
                                setPasswordChangeError(null)
                            }}
                            placeholder="Digite sua senha atual"
                            className="w-full h-[46px] rounded-[12px] border border-[#8C88AA] focus:border-[#4F3CF0] focus:ring-1 focus:ring-[#4F3CF0] outline-none px-4 pr-11 text-sm text-[#17152E] transition"
                          />
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setShowCurrentPassword(true)
                            }}
                            onMouseUp={() => setShowCurrentPassword(false)}
                            onMouseLeave={() => setShowCurrentPassword(false)}
                            onTouchStart={() => setShowCurrentPassword(true)}
                            onTouchEnd={() => setShowCurrentPassword(false)}
                            onTouchCancel={() => setShowCurrentPassword(false)}
                            onKeyDown={(e) => {
                              if (e.key === " " || e.key === "Enter") {
                                e.preventDefault()
                                setShowCurrentPassword(true)
                              }
                            }}
                            onKeyUp={() => setShowCurrentPassword(false)}
                            onBlur={() => setShowCurrentPassword(false)}
                            onClick={(e) => e.preventDefault()}
                            className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition cursor-pointer p-1 select-none ${
                              showCurrentPassword
                                ? "text-[#4F3CF0]"
                                : "text-[#5F5B7D] hover:text-[#17152E]"
                            }`}
                            aria-label="Pressione e segure para visualizar a senha atual"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Field 2: Nova senha */}
                      <div>
                        <label className="block text-xs font-bold text-[#17152E] mb-1">
                          Nova senha
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => {
                              setNewPassword(e.target.value)
                              if (passwordChangeError)
                                setPasswordChangeError(null)
                            }}
                            placeholder="Digite a nova senha"
                            className="w-full h-[46px] rounded-[12px] border border-[#8C88AA] focus:border-[#4F3CF0] focus:ring-1 focus:ring-[#4F3CF0] outline-none px-4 pr-11 text-sm text-[#17152E] transition"
                          />
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setShowNewPassword(true)
                            }}
                            onMouseUp={() => setShowNewPassword(false)}
                            onMouseLeave={() => setShowNewPassword(false)}
                            onTouchStart={() => setShowNewPassword(true)}
                            onTouchEnd={() => setShowNewPassword(false)}
                            onTouchCancel={() => setShowNewPassword(false)}
                            onKeyDown={(e) => {
                              if (e.key === " " || e.key === "Enter") {
                                e.preventDefault()
                                setShowNewPassword(true)
                              }
                            }}
                            onKeyUp={() => setShowNewPassword(false)}
                            onBlur={() => setShowNewPassword(false)}
                            onClick={(e) => e.preventDefault()}
                            className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition cursor-pointer p-1 select-none ${
                              showNewPassword
                                ? "text-[#4F3CF0]"
                                : "text-[#5F5B7D] hover:text-[#17152E]"
                            }`}
                            aria-label="Pressione e segure para visualizar a nova senha"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>

                        {/* Requirements Checklist (minimal spacing) */}
                        <div className="mt-1.5 space-y-1">
                          {/* Requirement 1: Pelo menos 8 caracteres */}
                          <div className="flex items-center gap-1.5">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke={isLengthValid ? "#137A51" : "#8C88AA"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="shrink-0 transition-colors"
                            >
                              <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
                            </svg>
                            <span
                              className={`text-xs transition-colors ${
                                isLengthValid
                                  ? "text-[#137A51] font-semibold"
                                  : "text-[#5F5B7D] font-medium"
                              }`}
                            >
                              Pelo menos 8 caracteres
                            </span>
                          </div>

                          {/* Requirement 2: Uma letra maiúscula e uma minúscula */}
                          <div className="flex items-center gap-1.5">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke={isCaseValid ? "#137A51" : "#8C88AA"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="shrink-0 transition-colors"
                            >
                              <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
                            </svg>
                            <span
                              className={`text-xs transition-colors ${
                                isCaseValid
                                  ? "text-[#137A51] font-semibold"
                                  : "text-[#5F5B7D] font-medium"
                              }`}
                            >
                              Uma letra maiúscula e uma minúscula
                            </span>
                          </div>

                          {/* Requirement 3: Diferente da senha atual */}
                          <div className="flex items-center gap-1.5">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 16 16"
                              fill="none"
                              stroke={isDiffFromCurrent ? "#137A51" : "#8C88AA"}
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="shrink-0 transition-colors"
                            >
                              <polyline points="3.5 8.5 6.5 11.5 12.5 4.5" />
                            </svg>
                            <span
                              className={`text-xs transition-colors ${
                                isDiffFromCurrent
                                  ? "text-[#137A51] font-semibold"
                                  : "text-[#5F5B7D] font-medium"
                              }`}
                            >
                              Diferente da senha atual
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Field 3: Confirmar nova senha */}
                      <div>
                        <label className="block text-xs font-bold text-[#17152E] mb-1">
                          Confirmar nova senha
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmNewPassword}
                            onChange={(e) => {
                              setConfirmNewPassword(e.target.value)
                              if (passwordChangeError)
                                setPasswordChangeError(null)
                            }}
                            placeholder="Repita a nova senha"
                            className="w-full h-[46px] rounded-[12px] border border-[#8C88AA] focus:border-[#4F3CF0] focus:ring-1 focus:ring-[#4F3CF0] outline-none px-4 pr-11 text-sm text-[#17152E] transition"
                          />
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault()
                              setShowConfirmPassword(true)
                            }}
                            onMouseUp={() => setShowConfirmPassword(false)}
                            onMouseLeave={() => setShowConfirmPassword(false)}
                            onTouchStart={() => setShowConfirmPassword(true)}
                            onTouchEnd={() => setShowConfirmPassword(false)}
                            onTouchCancel={() => setShowConfirmPassword(false)}
                            onKeyDown={(e) => {
                              if (e.key === " " || e.key === "Enter") {
                                e.preventDefault()
                                setShowConfirmPassword(true)
                              }
                            }}
                            onKeyUp={() => setShowConfirmPassword(false)}
                            onBlur={() => setShowConfirmPassword(false)}
                            onClick={(e) => e.preventDefault()}
                            className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition cursor-pointer p-1 select-none ${
                              showConfirmPassword
                                ? "text-[#4F3CF0]"
                                : "text-[#5F5B7D] hover:text-[#17152E]"
                            }`}
                            aria-label="Pressione e segure para visualizar a confirmação da senha"
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Submit Button: Salvar nova senha */}
                      <div className="pt-1.5">
                        <button
                          type="submit"
                          className="w-full h-[46px] rounded-full bg-[#4F3CF0] hover:bg-[#3D2CD8] text-white font-bold text-sm transition cursor-pointer shadow-xs flex items-center justify-center active:scale-[0.99]"
                        >
                          Salvar nova senha
                        </button>
                      </div>

                      {/* Footer link: Esqueci minha senha */}
                      <div className="text-center pt-0.5">
                        <button
                          type="button"
                          onClick={() => go("recovery")}
                          className="text-xs font-bold text-[#4F3CF0] hover:underline cursor-pointer transition"
                        >
                          Esqueci minha senha
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : isEditingTrack ? (
                /* ===================================================================== */
                /* SCREEN: EDITAR TRILHA (Exact 1184x732 Figma view)                     */
                /* ===================================================================== */
                <div className="w-full max-w-[1184px] mx-auto animate-in fade-in duration-200">
                  {/* Top Navigation Row: <- Perfil + Action Icons */}
                  <div className="flex items-center justify-between pb-8">
                    {/* Back button: <- Perfil */}
                    <button
                      type="button"
                      onClick={handleCancelEditingTrack}
                      className="flex items-center gap-2 text-[#4F3CF0] font-bold text-sm hover:underline cursor-pointer group py-1"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4F3CF0"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:-translate-x-1 transition-transform"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      <span>Perfil</span>
                    </button>

                    {/* Right side header icons */}
                    <div className="flex items-center gap-3">
                      {/* Notification Bell */}
                      <button
                        type="button"
                        className="w-10 h-10 rounded-full bg-white border border-[#E2DFF1] flex items-center justify-center text-[#5F5B7D] hover:text-[#4F3CF0] hover:border-[#4F3CF0] transition relative cursor-pointer shadow-2xs"
                        aria-label="Notificações"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C6F432] ring-2 ring-white" />
                      </button>

                      {/* Help / FAQ */}
                      <button
                        type="button"
                        className="w-10 h-10 rounded-full bg-white border border-[#E2DFF1] flex items-center justify-center text-[#5F5B7D] hover:text-[#4F3CF0] hover:border-[#4F3CF0] transition cursor-pointer shadow-2xs"
                        aria-label="Ajuda e Suporte"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                      </button>

                      {/* User Avatar Circle (40x40 #E9E6FF, purple letter) */}
                      <div className="w-10 h-10 rounded-full bg-[#E9E6FF] border-2 border-white flex items-center justify-center text-[#4F3CF0] font-black text-sm select-none shadow-xs">
                        {userName.charAt(0).toUpperCase()}
                      </div>
                    </div>
                  </div>

                  {/* Page Titles: Editar trilha */}
                  <div className="pb-8">
                    <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#17152E]">
                      Editar trilha
                    </h2>
                    <p className="text-xs sm:text-sm text-[#5F5B7D] font-medium mt-1">
                      Uma trilha por vez: termine a atual para liberar a
                      próxima.
                    </p>
                  </div>

                  {/* Main Row: Matérias na sua trilha (716px) + Adicionar matéria (380px) */}
                  <div className="flex flex-col xl:flex-row gap-6 items-start">
                    {/* Card: Matérias na sua trilha (716px x 372px) */}
                    <div className="w-full xl:w-[716px] shrink-0 bg-white border border-[#E2DFF1] rounded-[20px] p-6 sm:p-8 shadow-xs">
                      {/* Card Header: Title + Helper */}
                      <div className="flex items-center justify-between pb-6 border-b border-[#E2DFF1]/70">
                        <h3 className="font-bold text-base sm:text-lg text-[#17152E]">
                          Matérias na sua trilha
                        </h3>
                        <span className="text-xs text-[#5F5B7D] font-medium flex items-center gap-1.5 select-none">
                          Arraste para reordenar
                        </span>
                      </div>

                      {/* Reorderable Subjects List */}
                      <div className="divide-y divide-[#E2DFF1]/60">
                        {tempTrackSubjects.map((subject, idx) => {
                          const isDragging = draggedSubjectIdx === idx
                          const isDragOver =
                            dragOverSubjectIdx === idx &&
                            draggedSubjectIdx !== idx

                          return (
                            <div
                              key={subject.id}
                              draggable
                              onDragStart={(e) => {
                                e.dataTransfer.effectAllowed = "move"
                                e.dataTransfer.setData("text/plain", `${idx}`)
                                setDraggedSubjectIdx(idx)
                              }}
                              onDragOver={(e) => {
                                e.preventDefault()
                                e.dataTransfer.dropEffect = "move"
                                if (dragOverSubjectIdx !== idx) {
                                  setDragOverSubjectIdx(idx)
                                }
                              }}
                              onDragLeave={() => {
                                if (dragOverSubjectIdx === idx) {
                                  setDragOverSubjectIdx(null)
                                }
                              }}
                              onDrop={(e) => {
                                e.preventDefault()
                                handleDropSubject(idx)
                              }}
                              onDragEnd={() => {
                                setDraggedSubjectIdx(null)
                                setDragOverSubjectIdx(null)
                              }}
                              className={`py-5 px-3 -mx-3 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-all duration-150 cursor-grab active:cursor-grabbing select-none ${
                                isDragging
                                  ? "opacity-30 bg-[#F7F6FC] scale-[0.98]"
                                  : ""
                              } ${
                                isDragOver
                                  ? "bg-[#E9E6FF]/50 ring-2 ring-[#4F3CF0] ring-dashed"
                                  : "hover:bg-[#F7F6FC]/60"
                              }`}
                            >
                              {/* Left: Drag Handle + Number Badge + Info */}
                              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                                {/* Drag Handle (6 dots: 2 cols x 3 rows) */}
                                <div
                                  className="p-1.5 text-[#8C88AA] group-hover:text-[#4F3CF0] select-none shrink-0 transition-colors cursor-grab active:cursor-grabbing"
                                  title="Arraste para reordenar"
                                >
                                  <svg
                                    width="10"
                                    height="16"
                                    viewBox="0 0 10 16"
                                    fill="currentColor"
                                  >
                                    <circle cx="2" cy="2" r="1.5" />
                                    <circle cx="2" cy="8" r="1.5" />
                                    <circle cx="2" cy="14" r="1.5" />
                                    <circle cx="8" cy="2" r="1.5" />
                                    <circle cx="8" cy="8" r="1.5" />
                                    <circle cx="8" cy="14" r="1.5" />
                                  </svg>
                                </div>

                                {/* Number Badge */}
                                <div
                                  className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center shrink-0 select-none ${
                                    idx === 0
                                      ? "bg-[#E9E6FF] text-[#4F3CF0]"
                                      : "bg-[#F7F6FC] text-[#4F3CF0]"
                                  }`}
                                >
                                  {idx + 1}
                                </div>

                                {/* Subject Info */}
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-bold text-[#17152E] truncate">
                                      {subject.name}
                                    </h4>
                                    {idx === 0 && (
                                      <span className="px-2 py-0.5 rounded-full bg-[#C6F432] text-[#17152E] text-[10px] font-black uppercase tracking-wider select-none shrink-0">
                                        ATUAL
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-[#5F5B7D] font-medium mt-0.5">
                                    {idx === 0
                                      ? "Em andamento · 12 de 32 tópicos"
                                      : `Não iniciada · ${subject.topicsCount} tópicos · Libera após ${tempTrackSubjects[idx - 1]?.name.replace("Ciências da ", "").replace("Ciências ", "")}`}
                                  </p>

                                  {/* Progress bar for step 1 (Matemática) */}
                                  {idx === 0 && (
                                    <div className="w-full max-w-[422px] h-2 rounded-full bg-[#E9E6FF] overflow-hidden mt-2.5">
                                      <div
                                        className="bg-[#4F3CF0] h-full rounded-full transition-all duration-300"
                                        style={{ width: "38%" }}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Right: Remover Button */}
                              <button
                                type="button"
                                draggable={false}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={() => setSubjectToRemove(subject)}
                                className="h-[46.5px] px-5 rounded-full border-[1.5px] border-[#C42B30] bg-white text-[#C42B30] hover:bg-[#FCE8E8]/30 font-bold text-sm transition cursor-pointer shrink-0 self-end sm:self-auto flex items-center justify-center"
                              >
                                Remover
                              </button>
                            </div>
                          )
                        })}

                        {tempTrackSubjects.length === 0 && (
                          <div className="py-8 text-center">
                            <p className="text-sm text-[#5F5B7D] font-medium mb-4">
                              Nenhuma matéria na trilha no momento.
                            </p>
                            <button
                              type="button"
                              onClick={handleRestoreSubjects}
                              className="px-5 py-2.5 rounded-full bg-[#4F3CF0] text-white font-bold text-xs hover:bg-[#3D2CD8] transition cursor-pointer"
                            >
                              Restaurar matérias padrão
                            </button>
                          </div>
                        )}
                      </div>

                      {tempTrackSubjects.length < 3 &&
                        tempTrackSubjects.length > 0 && (
                          <div className="pt-4 border-t border-[#E2DFF1]/60 flex justify-end">
                            <button
                              type="button"
                              onClick={handleRestoreSubjects}
                              className="text-xs text-[#4F3CF0] font-bold hover:underline cursor-pointer"
                            >
                              + Restaurar matérias ausentes
                            </button>
                          </div>
                        )}
                    </div>

                    {/* Card: Adicionar matéria (380px x 290px) - Ocultado quando não houver matérias disponíveis para adicionar */}
                    {availableSubjectsToAdd.length > 0 && (
                      <div className="w-full xl:w-[380px] shrink-0 bg-white border border-[#E2DFF1] rounded-[20px] p-6 sm:p-7 shadow-xs animate-fadeIn">
                        <h3 className="font-bold text-lg text-[#17152E]">
                          Adicionar matéria
                        </h3>
                        <p className="text-xs text-[#5F5B7D] font-medium mt-1 leading-relaxed">
                          Escolha uma matéria para adicionar à sua trilha.
                          <br />
                          Ela entrará ao final da lista.
                        </p>

                        {/* Available Subject Item Buttons */}
                        <div className="mt-5 space-y-2.5">
                          {availableSubjectsToAdd.map((subj) => (
                            <button
                              key={subj.id}
                              type="button"
                              onClick={() => handleAddSubject(subj)}
                              className="w-full h-[55px] px-4 rounded-[12px] border border-[#8C88AA] hover:border-[#4F3CF0] bg-white flex items-center justify-between transition cursor-pointer group shadow-2xs hover:shadow-xs active:scale-[0.99]"
                            >
                              <span className="text-sm font-bold text-[#17152E]">
                                {subj.name}
                              </span>
                              <div className="w-6 h-6 flex items-center justify-center text-[#4F3CF0] group-hover:scale-110 transition-transform">
                                <svg
                                  width="18"
                                  height="18"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  stroke="#4F3CF0"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="7" y1="1" x2="7" y2="13" />
                                  <line x1="1" y1="7" x2="13" y2="7" />
                                </svg>
                              </div>
                            </button>
                          ))}
                        </div>

                        {/* Bottom Alert/Banner: Sparkles */}
                        <div className="mt-5 p-3.5 rounded-[12px] bg-[#E9E6FF] flex items-center gap-3.5">
                          <div className="shrink-0 text-[#4F3CF0]">
                            <svg
                              width="24"
                              height="28"
                              viewBox="51 213 26 29"
                              fill="none"
                            >
                              <path
                                d="M63 234.333L60.5 227L53.1667 224.5L60.5 222L63 214.667L65.5 222L72.8333 224.5L65.5 227L63 234.333Z"
                                stroke="#4F3CF0"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M70.5 241L69.25 237.25L65.5 236L69.25 234.75L70.5 231L71.75 234.75L75.5 236L71.75 237.25L70.5 241Z"
                                stroke="#4F3CF0"
                                strokeWidth="1.66667"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-[13px] font-bold text-[#17152E] leading-tight">
                              A trilha será reorganizada
                            </p>
                            <p className="text-[11px] text-[#5F5B7D] font-medium leading-tight mt-0.5">
                              segundo o seu desempenho.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-6 max-w-[716px]">
                    <button
                      type="button"
                      onClick={handleCancelEditingTrack}
                      className="h-[46.5px] px-7 rounded-full border-[1.5px] border-[#8C88AA] bg-white text-[#17152E] hover:bg-[#F7F6FC] font-bold text-sm transition cursor-pointer flex items-center justify-center"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveTrackOrder}
                      className="h-[46.5px] px-7 rounded-full bg-[#4F3CF0] hover:bg-[#3D2CD8] text-white font-bold text-sm transition cursor-pointer shadow-xs flex items-center justify-center"
                    >
                      Salvar alterações
                    </button>
                  </div>
                </div>
              ) : (
                /* ===================================================================== */
                /* SCREEN: PERFIL OVERVIEW (Standard Cards)                               */
                /* ===================================================================== */
                <div className="w-full max-w-[1120px] mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
                  {/* LEFT COLUMN: Identity & Account Settings */}
                  <div className="space-y-6">
                    {/* Identity Card (340x344px) */}
                    <div className="bg-white border border-[#E2DFF1] rounded-[20px] p-6 lg:p-8 flex flex-col items-center shadow-xs">
                      <div className="w-[88px] h-[88px] rounded-full bg-[#E9E6FF] flex items-center justify-center text-[#4F3CF0] font-black text-4xl select-none">
                        J
                      </div>
                      <h3 className="font-display font-extrabold text-xl text-[#17152E] mt-3.5 text-center">
                        {userFullName || userName || "Julia Souza"}
                      </h3>
                      <p className="text-xs text-[#5F5B7D] font-medium mt-1 text-center">
                        {userEmail || "julia.souza@email.com"}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                        <span className="bg-[#E9E6FF] text-[#4F3CF0] font-bold text-[11px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                          {targetCourse
                            ? `${targetCourse.toUpperCase()} · UFRJ`
                            : "MEDICINA · UFRJ"}
                        </span>
                        <span className="bg-[#E9E6FF] text-[#4F3CF0] font-bold text-[11px] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
                          10H / SEMANA
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert("Editar dados do perfil em breve")}
                        className="w-full h-[46.5px] rounded-[23.25px] border-[1.5px] border-[#8C88AA] bg-white text-[#17152E] font-bold text-sm flex items-center justify-center gap-2 mt-6 hover:bg-[#F7F6FC] transition cursor-pointer"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          stroke="#17152E"
                          strokeWidth="1.67"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12.5 2.5a2.121 2.121 0 0 1 3 3L5 16l-4 1 1-4 10.5-10.5z" />
                        </svg>
                        Editar dados
                      </button>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Sua Trilha & Study Info */}
                  <div className="space-y-6">
                    {/* SUA TRILHA Card (756px x 456px) */}
                    <div className="bg-white border border-[#E2DFF1] rounded-[20px] p-6 lg:p-8 shadow-xs">
                      {/* Header: Title + "UMA TRILHA POR VEZ" pill */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
                        <h3 className="font-display font-extrabold text-xl text-[#17152E]">
                          Sua trilha
                        </h3>
                        <span className="self-start sm:self-auto px-4 py-1.5 rounded-full bg-[#E9E6FF] text-[#4F3CF0] font-bold text-[11px] uppercase tracking-wider shrink-0 select-none">
                          UMA TRILHA POR VEZ
                        </span>
                      </div>

                      {/* Subtitle */}
                      <p className="text-xs text-[#5F5B7D] font-medium leading-relaxed pb-5 border-b border-[#E2DFF1]/70">
                        A Mentorina montou sua trilha a partir das suas
                        escolhas. Termine a matéria atual para liberar a
                        próxima.
                      </p>

                      {/* Sequential Subjects rendered dynamically from trackSubjects */}
                      <div className="divide-y divide-[#E2DFF1]/60">
                        {trackSubjects.map((subject, idx) => (
                          <div
                            key={subject.id}
                            className={`py-4 sm:py-5 flex ${
                              idx === 0 ? "items-start" : "items-center"
                            } gap-4`}
                          >
                            <div
                              className={`w-9 h-9 rounded-full font-black text-sm flex items-center justify-center shrink-0 ${
                                idx === 0
                                  ? "bg-[#E9E6FF] text-[#4F3CF0] mt-0.5"
                                  : "bg-[#F7F6FC] text-[#4F3CF0]"
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              {idx === 0 ? (
                                <>
                                  <div className="flex items-center justify-between gap-2 mb-1.5">
                                    <h4 className="text-sm font-bold text-[#17152E] truncate">
                                      {subject.name}
                                    </h4>
                                    <span className="text-xs font-bold text-[#4F3CF0] shrink-0">
                                      {subject.progress}%
                                    </span>
                                  </div>
                                  <p className="text-xs text-[#5F5B7D] font-medium mb-2.5">
                                    {subject.status}
                                  </p>
                                  <div className="w-full h-2 rounded-full bg-[#E9E6FF] overflow-hidden">
                                    <div
                                      className="bg-[#4F3CF0] h-full rounded-full transition-all duration-300"
                                      style={{ width: `${subject.progress}%` }}
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <h4 className="text-sm font-bold text-[#17152E] truncate">
                                    {subject.name}
                                  </h4>
                                  <p className="text-xs text-[#5F5B7D] font-medium mt-1">
                                    Não iniciada · {subject.topicsCount} tópicos
                                    · Libera após{" "}
                                    {trackSubjects[idx - 1]?.name
                                      .replace("Ciências da ", "")
                                      .replace("Ciências ", "")}
                                  </p>
                                </>
                              )}
                            </div>
                            {idx > 0 && (
                              <span className="text-sm font-bold text-[#5F5B7D] shrink-0 px-2 select-none">
                                —
                              </span>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Action Button: Editar trilha */}
                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={handleStartEditingTrack}
                          className="w-[179.5px] h-[46.5px] rounded-[23.25px] border-[1.5px] border-[#8C88AA] bg-white text-[#17152E] font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#F7F6FC] transition cursor-pointer"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            stroke="#17152E"
                            strokeWidth="1.67"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12.5 2.5a2.121 2.121 0 0 1 3 3L5 16l-4 1 1-4 10.5-10.5z" />
                          </svg>
                          Editar trilha
                        </button>
                      </div>
                    </div>

                    {/* CONTA E PREFERÊNCIAS Card (756px x 478px) */}
                    <div className="bg-white border border-[#E2DFF1] rounded-[20px] p-6 lg:p-8 shadow-xs">
                      <h3 className="font-display font-extrabold text-xl text-[#17152E] pb-4 border-b border-[#E2DFF1]/70">
                        Conta e preferências
                      </h3>

                      <div className="divide-y divide-[#E2DFF1]/60">
                        {/* 1. Língua estrangeira */}
                        <div className="py-4.5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-[14px] bg-[#E9E6FF] flex items-center justify-center text-[#4F3CF0] font-black text-sm shrink-0 select-none">
                              Aa
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-[#17152E]">
                                Língua estrangeira
                              </h4>
                              <p className="text-xs text-[#5F5B7D] font-medium mt-0.5 truncate">
                                {foreignLang}: usada nas questões de Linguagens
                                do Enem
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={toggleForeignLang}
                            className="text-sm font-bold text-[#4F3CF0] hover:underline cursor-pointer shrink-0 px-2 py-1"
                          >
                            Trocar
                          </button>
                        </div>

                        {/* 2. Alterar senha */}
                        <button
                          type="button"
                          onClick={handleStartChangingPassword}
                          className="w-full py-4.5 flex items-center justify-between gap-4 text-left group hover:bg-[#F7F6FC]/60 -mx-2 px-2 rounded-xl transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-[14px] bg-[#E9E6FF] flex items-center justify-center shrink-0">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#4F3CF0"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect
                                  x="3"
                                  y="11"
                                  width="18"
                                  height="11"
                                  rx="2"
                                  ry="2"
                                />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-[#17152E] group-hover:text-[#4F3CF0] transition">
                                Alterar senha
                              </h4>
                              <p className="text-xs text-[#5F5B7D] font-medium mt-0.5">
                                Troque sua senha de acesso
                              </p>
                            </div>
                          </div>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#5F5B7D"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0 group-hover:translate-x-0.5 transition-transform"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>

                        {/* 3. Termos de uso e privacidade */}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="w-full py-4.5 flex items-center justify-between gap-4 text-left group hover:bg-[#F7F6FC]/60 -mx-2 px-2 rounded-xl transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-[14px] bg-[#E9E6FF] flex items-center justify-center shrink-0">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#4F3CF0"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                                <line x1="16" y1="13" x2="8" y2="13" />
                                <line x1="16" y1="17" x2="8" y2="17" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-[#17152E] group-hover:text-[#4F3CF0] transition">
                                Termos de uso e privacidade
                              </h4>
                              <p className="text-xs text-[#5F5B7D] font-medium mt-0.5">
                                Ver nossos termos e tratamento de dados
                              </p>
                            </div>
                          </div>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#5F5B7D"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0 group-hover:translate-x-0.5 transition-transform"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>

                        {/* 4. Sair da conta */}
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full py-4.5 flex items-center justify-between gap-4 text-left group hover:bg-[#F7F6FC]/60 -mx-2 px-2 rounded-xl transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-[14px] bg-[#E9E6FF] flex items-center justify-center shrink-0">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#4F3CF0"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                              </svg>
                            </div>
                            <h4 className="text-sm font-bold text-[#17152E] group-hover:text-[#4F3CF0] transition">
                              Sair da conta
                            </h4>
                          </div>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#5F5B7D"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0 group-hover:translate-x-0.5 transition-transform"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>

                        {/* 5. Encerrar conta */}
                        <button
                          type="button"
                          onClick={() => setShowDeleteAccountModal(true)}
                          className="w-full py-4.5 flex items-center justify-between gap-4 text-left group hover:bg-[#FCE8E8]/30 -mx-2 px-2 rounded-xl transition cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-11 h-11 rounded-[14px] bg-[#FCE8E8] flex items-center justify-center shrink-0">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#C42B30"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="8.5" cy="7" r="4" />
                                <line x1="23" y1="11" x2="17" y2="11" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-[#C42B30]">
                                Encerrar conta
                              </h4>
                              <p className="text-xs text-[#5F5B7D] font-medium mt-0.5">
                                Apagar seus dados de forma definitiva
                              </p>
                            </div>
                          </div>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#C42B30"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0 group-hover:translate-x-0.5 transition-transform"
                          >
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* FLOATING ACTION BUTTON (Canto Inferior Direito: Mentorina AI)            */}
      {/* ========================================================================= */}
      {!isMentorinaChatOpen && (
        <aside className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 select-none">
          <button
            type="button"
            onClick={() => setIsMentorinaChatOpen(true)}
            className="group relative block cursor-pointer transition-transform duration-200 ease-out hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Abrir Assistente Mentorina AI"
            title="Falar com Mentorina AI"
          >
            <svg
              width="113"
              height="109"
              viewBox="0 0 113 109"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-xs transition duration-200 group-hover:brightness-105"
            >
              <g filter="url(#filter0_dd_2448_1051)">
                <rect
                  x="20"
                  y="13"
                  width="72"
                  height="72"
                  rx="36"
                  fill="#4F3CF0"
                />
                <path
                  d="M55.9998 29.5L60.1165 42.0667L73.3332 46.8333L60.1165 51.6L55.9998 64.1667L51.8832 51.6L38.6665 46.8333L51.8832 42.0667L55.9998 29.5Z"
                  strokeWidth="2.16667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  stroke="white"
                />
                <circle
                  cx="82"
                  cy="23"
                  r="9.5"
                  fill="#C6F432"
                  strokeWidth="3"
                  stroke="#F7F6FC"
                />
              </g>
              <defs>
                <filter
                  id="filter0_dd_2448_1051"
                  x="0"
                  y="0"
                  width="113"
                  height="113"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feMorphology
                    radius="4"
                    operator="erode"
                    in="SourceAlpha"
                    result="effect1_dropShadow_2448_1051"
                  />
                  <feOffset dy="8" />
                  <feGaussianBlur stdDeviation="12" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.309804 0 0 0 0 0.235294 0 0 0 0 0.941176 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_2448_1051"
                  />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="2" />
                  <feGaussianBlur stdDeviation="3" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0.0901961 0 0 0 0 0.0823529 0 0 0 0 0.180392 0 0 0 0.12 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="effect1_dropShadow_2448_1051"
                    result="effect2_dropShadow_2448_1051"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect2_dropShadow_2448_1051"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </button>
        </aside>
      )}

      {/* ======================================================================= */}
      {/* MODAL DE PRÁTICA DE QUESTÕES (TRI Interativa)                         */}
      {/* ======================================================================= */}
      {activeQuestionModal && (
        <div className="fixed inset-0 z-50 bg-[#17152E]/55 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] border border-[#E2DFF1] shadow-2xl w-full max-w-[660px] p-6 sm:p-8 space-y-5 my-auto animate-in zoom-in-95 duration-150">
            {/* Modal Top Header */}
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-[#E2DFF1]/70">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-[#4F3CF0] text-white flex items-center justify-center font-bold text-xs">
                  {activeQuestionModal.id}
                </span>
                <div>
                  <h4 className="text-sm font-black text-[#17152E]">
                    {activeQuestionModal.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-[#5F5B7D]">
                    {activeQuestionModal.year} · TRI Estimada: ~
                    {activeQuestionModal.tri}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    activeQuestionModal.difficulty === "Fácil"
                      ? "bg-[#E3F5EC] text-[#137A51]"
                      : activeQuestionModal.difficulty === "Média"
                        ? "bg-[#FEF3C7] text-[#B45309]"
                        : "bg-[#F3E8FF] text-[#6B21A8]"
                  }`}
                >
                  {activeQuestionModal.difficulty}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setActiveQuestionModal(null)
                    setSelectedOption(null)
                    setShowExplanation(false)
                  }}
                  className="w-8 h-8 rounded-full bg-[#F4F3FA] hover:bg-[#E9E6FF] text-[#5F5B7D] hover:text-[#17152E] flex items-center justify-center transition cursor-pointer"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Question Statement */}
            <div className="bg-[#F8F7FD] rounded-xl p-4 sm:p-5 border border-[#E2DFF1]/70">
              <p className="text-sm sm:text-[15px] font-medium text-[#17152E] leading-relaxed">
                {activeQuestionModal.statement}
              </p>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {activeQuestionModal.options.map((opt, optIdx) => {
                const letters = ["A", "B", "C", "D", "E"]
                const isSelected = selectedOption === optIdx
                const isCorrect = optIdx === activeQuestionModal.correctIndex
                let optionStyle =
                  "border-[#E2DFF1] hover:border-[#4F3CF0]/60 hover:bg-[#F8F7FD]"
                let badgeStyle = "bg-[#F4F3FA] text-[#5F5B7D]"

                if (showExplanation) {
                  if (isCorrect) {
                    optionStyle =
                      "border-[#137A51] bg-[#E3F5EC]/70 text-[#137A51]"
                    badgeStyle = "bg-[#137A51] text-white"
                  } else if (isSelected && !isCorrect) {
                    optionStyle =
                      "border-[#DC2626] bg-[#FEE2E2]/70 text-[#DC2626]"
                    badgeStyle = "bg-[#DC2626] text-white"
                  } else {
                    optionStyle = "border-[#E2DFF1] opacity-60"
                  }
                } else if (isSelected) {
                  optionStyle = "border-[#4F3CF0] bg-[#E9E6FF]/50 shadow-xs"
                  badgeStyle = "bg-[#4F3CF0] text-white"
                }

                return (
                  <button
                    key={optIdx}
                    type="button"
                    disabled={showExplanation}
                    onClick={() => setSelectedOption(optIdx)}
                    className={`w-full p-3 sm:p-3.5 rounded-xl border text-left flex items-center gap-3 transition cursor-pointer ${optionStyle}`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${badgeStyle}`}
                    >
                      {letters[optIdx]}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#17152E]">
                      {opt}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Feedback & Explanation */}
            {showExplanation && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div
                  className={`p-3.5 rounded-xl border flex items-center gap-2.5 ${
                    selectedOption === activeQuestionModal.correctIndex
                      ? "bg-[#E3F5EC] border-[#137A51]/30 text-[#137A51]"
                      : "bg-[#FEE2E2] border-[#DC2626]/30 text-[#DC2626]"
                  }`}
                >
                  {selectedOption === activeQuestionModal.correctIndex ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                  )}
                  <span className="text-xs sm:text-sm font-bold">
                    {selectedOption === activeQuestionModal.correctIndex
                      ? "Excelente! Resposta correta (alta pontuação TRI garantida)."
                      : "Resposta incorreta. Veja a resolução comentada abaixo para fixar o conceito."}
                  </span>
                </div>

                <div className="bg-[#E9E6FF] rounded-xl p-4 border border-[#DDD8FD]">
                  <h5 className="text-xs font-black uppercase tracking-wider text-[#4F3CF0] mb-1">
                    Resolução Comentada
                  </h5>
                  <p className="text-xs sm:text-[13px] font-medium text-[#17152E] leading-relaxed">
                    {activeQuestionModal.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E2DFF1]/70">
              <button
                type="button"
                onClick={() => {
                  setActiveQuestionModal(null)
                  setSelectedOption(null)
                  setShowExplanation(false)
                }}
                className="px-4 py-2.5 rounded-xl font-bold text-xs text-[#5F5B7D] hover:bg-[#F4F3FA] transition cursor-pointer"
              >
                Fechar
              </button>

              {!showExplanation ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={() => {
                    if (selectedOption !== null) {
                      setShowExplanation(true)
                      const currentModule =
                        (selectedModule && MODULES_DATA[selectedModule]) ||
                        MODULES_DATA["modulo-2"]
                      const submodules = currentModule.submodules || []
                      const currentSub =
                        submodules.find((s) => s.id === selectedSubmodule) ||
                        submodules[0]
                      const key = `${selectedModule}_${currentSub.id}_${activeQuestionModal.id}`
                      setCompletedQuestions((prev) => ({
                        ...prev,
                        [key]: true,
                      }))
                    }
                  }}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs ${
                    selectedOption !== null
                      ? "bg-[#4F3CF0] hover:bg-[#3E2DD6] text-white"
                      : "bg-[#E2DFF1] text-[#8C88AA] cursor-not-allowed"
                  }`}
                >
                  Confirmar Resposta
                </button>
              ) : (
                (() => {
                  const currentModule =
                    (selectedModule && MODULES_DATA[selectedModule]) ||
                    MODULES_DATA["modulo-2"]
                  const submodules = currentModule.submodules || []
                  const currentSub =
                    submodules.find((s) => s.id === selectedSubmodule) ||
                    submodules[0]
                  const questions = currentSub.questions || []
                  const nextQuestion = questions.find(
                    (q) => q.id === activeQuestionModal.id + 1,
                  )

                  return nextQuestion ? (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveQuestionModal(nextQuestion)
                        setSelectedOption(null)
                        setShowExplanation(false)
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#4F3CF0] hover:bg-[#3E2DD6] text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <span>Próxima Questão ({nextQuestion.id}/8)</span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveQuestionModal(null)
                        setSelectedOption(null)
                        setShowExplanation(false)
                      }}
                      className="px-6 py-2.5 rounded-xl bg-[#137A51] hover:bg-[#0E5E3E] text-white font-bold text-xs sm:text-sm transition cursor-pointer shadow-xs"
                    >
                      Finalizar Treino do Submódulo
                    </button>
                  )
                })()
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE CONFIRMAÇÃO: ENCERRAR CONTA (520px x 338px)                      */}
      {/* ========================================================================= */}
      {showDeleteAccountModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17152E]/55 animate-in fade-in duration-200"
          onClick={() => setShowDeleteAccountModal(false)}
        >
          <div
            className="w-full max-w-[520px] bg-white rounded-[20px] p-6 sm:p-8 shadow-[0_8px_24px_rgba(79,60,240,0.25),0_2px_6px_rgba(23,21,46,0.12)] border border-[#E2DFF1]/60 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top row: 60px circle icon + text info */}
            <div className="flex items-start gap-4 sm:gap-4.5">
              {/* Warning Icon Circle (60px) */}
              <div className="w-[60px] h-[60px] rounded-full bg-[#FCE8E8] flex items-center justify-center shrink-0">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C42B30"
                  strokeWidth="2.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0 pt-1">
                <h3 className="font-display font-extrabold text-lg sm:text-[19px] leading-tight text-[#17152E]">
                  Deseja mesmo encerrar sua conta?
                </h3>
                <p className="text-xs sm:text-[13px] text-[#17152E] font-medium mt-1">
                  Todos os seus dados e progresso serão apagados.
                </p>
              </div>
            </div>

            {/* Warning Details Box (456px x 134px in SVG, rounded 12px, bg-[#FCE8E8]) */}
            <div className="w-full bg-[#FCE8E8] rounded-[12px] p-4 sm:p-5 mt-4 sm:mt-5">
              <h4 className="text-sm font-bold text-[#C42B30] mb-2.5">
                Você vai perder:
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-[#17152E] font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#17152E] shrink-0" />
                  <span>12 tópicos concluídos (38%)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#17152E] shrink-0" />
                  <span>86 questões respondidas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#17152E] shrink-0" />
                  <span>Revisões agendadas</span>
                </li>
              </ul>
            </div>

            {/* Buttons Row (222px Cancelar, 220.5px Encerrar conta) */}
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5 mt-4 sm:mt-5">
              {/* Cancelar Button */}
              <button
                type="button"
                onClick={() => setShowDeleteAccountModal(false)}
                className="w-full h-[46.5px] sm:h-[48px] rounded-[23.25px] sm:rounded-full border-[1.5px] border-[#8C88AA] bg-white text-[#17152E] font-bold text-sm flex items-center justify-center hover:bg-[#F7F6FC] transition cursor-pointer"
              >
                Cancelar
              </button>

              {/* Encerrar conta Button */}
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="w-full h-[46.5px] sm:h-[48px] rounded-[23.25px] sm:rounded-full bg-[#C42B30] hover:bg-[#A82227] text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-xs"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.67"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                <span>Encerrar conta</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE CONFIRMAÇÃO: REMOVER MATÉRIA (520px x 356px)                     */}
      {/* ========================================================================= */}
      {subjectToRemove && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#17152E]/55 animate-in fade-in duration-200"
          onClick={() => setSubjectToRemove(null)}
        >
          <div
            className="w-full max-w-[520px] bg-white rounded-[20px] p-6 sm:p-8 shadow-[0_8px_24px_rgba(79,60,240,0.25),0_2px_6px_rgba(23,21,46,0.12)] border border-[#E2DFF1]/60 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top row: 60px circle icon + text info */}
            <div className="flex items-start gap-4 sm:gap-4.5">
              {/* Warning Icon Circle (60px) */}
              <div className="w-[60px] h-[60px] rounded-full bg-[#FCE8E8] flex items-center justify-center shrink-0">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C42B30"
                  strokeWidth="2.33"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0 pt-1">
                <h3 className="font-display font-extrabold text-lg sm:text-[20px] leading-tight text-[#17152E]">
                  Remover matéria?
                </h3>
                <p className="text-xs sm:text-[13px] text-[#5F5B7D] font-medium mt-1.5 leading-relaxed">
                  Todo o progresso nesta matéria será perdido e ela voltará para
                  a lista de matérias disponíveis.
                </p>
              </div>
            </div>

            {/* Warning Details Box (456px x 134px in SVG, rounded 12px, bg-[#FCE8E8]) */}
            <div className="w-full bg-[#FCE8E8] rounded-[12px] p-4 sm:p-5 mt-5">
              <h4 className="text-sm font-bold text-[#C42B30] mb-2.5">
                Você vai perder:
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-[13px] text-[#17152E] font-medium">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#17152E] shrink-0" />
                  <span>
                    {subjectToRemove.progress > 0
                      ? `12 tópicos concluídos (${subjectToRemove.progress}%)`
                      : "12 tópicos concluídos (38%)"}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#17152E] shrink-0" />
                  <span>84 questões respondidas</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#17152E] shrink-0" />
                  <span>Histórico de revisões agendadas</span>
                </li>
              </ul>
            </div>

            {/* Buttons Row */}
            <div className="grid grid-cols-2 gap-3 sm:gap-3.5 mt-5">
              {/* Cancelar Button */}
              <button
                type="button"
                onClick={() => setSubjectToRemove(null)}
                className="w-full h-[46.5px] sm:h-[48px] rounded-[23.25px] sm:rounded-full border-[1.5px] border-[#8C88AA] bg-white text-[#17152E] font-bold text-sm flex items-center justify-center hover:bg-[#F7F6FC] transition cursor-pointer"
              >
                Cancelar
              </button>

              {/* Remover matéria Button */}
              <button
                type="button"
                onClick={() => {
                  handleRemoveSubject(subjectToRemove.id)
                  setSubjectToRemove(null)
                }}
                className="w-full h-[46.5px] sm:h-[48px] rounded-[23.25px] sm:rounded-full bg-[#C42B30] hover:bg-[#A82227] text-white font-bold text-sm flex items-center justify-center transition cursor-pointer shadow-xs"
              >
                Remover matéria
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ========================================================================= */}
      {/* TELA COMPLETA: ESCREVER REDAÇÃO (TREINO OFICIAL ENEM 1440x920)            */}
      {/* ========================================================================= */}
      {isWritingEssay && (
        <div className="fixed inset-0 z-50 bg-[#F7F6FC] overflow-y-auto flex flex-col min-h-screen text-[#17152E]">
          {/* Top Bar (Exatamente 76px de altura fixa com flexShrink: 0) */}
          <header
            style={{
              height: "76px",
              minHeight: "76px",
              maxHeight: "76px",
              flexShrink: 0,
            }}
            className="sticky top-0 z-40 w-full h-[76px] min-h-[76px] max-h-[76px] shrink-0 bg-white border-b border-[#E2DFF1] shadow-2xs flex items-center"
          >
            <div
              style={{ height: "76px" }}
              className="w-full max-w-[1440px] h-[76px] mx-auto px-6 sm:px-10 lg:px-12 flex items-center justify-between"
            >
              {/* Left: Botão Sair (altura 24px conforme SVG transform="translate(48 26)") */}
              <div className="flex items-center min-w-[70px]">
                <button
                  type="button"
                  onClick={() => {
                    try {
                      if (newEssayText)
                        localStorage.setItem(
                          "sherlock_essay_draft",
                          newEssayText,
                        )
                    } catch {
                      // ignore
                    }
                    setIsWritingEssay(false)
                  }}
                  className="h-[24px] flex items-center gap-3 text-[#17152E] hover:opacity-80 transition cursor-pointer active:scale-95"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="#17152E"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <path d="M11 1L1 11" />
                    <path d="M1 1L11 11" />
                  </svg>
                  <span className="font-semibold text-[15px] leading-none tracking-tight text-[#17152E]">
                    Sair
                  </span>
                </button>
              </div>

              {/* Center: Redação: Treino / Tema da semana (bloco de 46px conforme SVG translate 479 15) */}
              <div className="flex flex-col items-center justify-center text-center h-[46px]">
                <span className="text-[16px] font-bold text-[#17152E] leading-[22px] tracking-tight">
                  Redação: Treino
                </span>
                <span className="text-[13px] font-medium text-[#5F5B7D] leading-[18px]">
                  Tema da semana
                </span>
              </div>

              {/* Right: Cronômetro (173x51) e Botão Enviar (228x48) */}
              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                {/* Timer Pill (173x51 conforme SVG) */}
                <div
                  style={{ width: "173px", height: "51px" }}
                  className="w-[173px] h-[51px] rounded-[25.5px] border border-[#8C88AA] bg-white flex items-center justify-center gap-2.5 shadow-2xs select-none shrink-0"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="shrink-0"
                  >
                    <circle
                      cx="9"
                      cy="9"
                      r="7.5"
                      stroke="#17152E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 4.5V9L12 10.5"
                      stroke="#17152E"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[17px] font-bold text-[#17152E] font-mono tracking-tight leading-none">
                    {formatTimer(essaySeconds)}
                  </span>
                </div>

                {/* Botão Enviar para Correção (228x48 conforme SVG) */}
                <button
                  type="button"
                  onClick={handleSendEssayForCorrection}
                  style={{ width: "228px", height: "48px" }}
                  className="w-[228px] h-[48px] rounded-[24px] bg-[#4F3CF0] hover:bg-[#3D2CD8] text-white font-bold text-[14px] flex items-center justify-center gap-2.5 transition cursor-pointer shadow-xs active:scale-95 shrink-0"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.66667"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0"
                  >
                    <path d="M8 1L9.6 6.3L15 8L9.6 9.7L8 15L6.4 9.7L1 8L6.4 6.3L8 1Z" />
                  </svg>
                  <span>Enviar para correção</span>
                </button>
              </div>
            </div>
          </header>

          {/* Main Body */}
          <main className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            {/* ================================================================= */}
            {/* COLUNA ESQUERDA (400px x 692px conforme SVG oficial)               */}
            {/* ================================================================= */}
            <div className="w-full lg:w-[400px] shrink-0 flex flex-col space-y-6">
              {/* Card 1: Tema da Redação (400x218) */}
              <div className="w-full h-auto lg:h-[218px] bg-white rounded-[20px] border border-[#E2DFF1] p-6 shadow-2xs flex flex-col justify-between shrink-0">
                <div>
                  <span className="text-[12px] font-black text-[#4F3CF0] tracking-[0.1em] uppercase block">
                    TEMA
                  </span>
                  <h2 className="text-[18px] sm:text-[19px] font-black text-[#17152E] mt-2.5 leading-snug tracking-tight line-clamp-2">
                    {newEssayTheme}
                  </h2>
                </div>
                <div className="mt-3 pt-3 border-t border-[#E2DFF1]/70">
                  <p className="text-[12px] text-[#5F5B7D] leading-relaxed line-clamp-3">
                    A partir da leitura dos textos motivadores e com base nos
                    conhecimentos construídos ao longo de sua formação, redija
                    um texto dissertativo-argumentativo em modalidade escrita
                    formal da língua portuguesa sobre o tema{" "}
                    <strong>"{newEssayTheme}"</strong>.
                  </p>
                </div>
              </div>

              {/* Card 2: Textos Motivadores (Accordion conforme SVG 400x216/228) */}
              <div
                className={`w-full bg-white rounded-[20px] border border-[#E2DFF1] px-7 py-6 shadow-2xs shrink-0 flex flex-col transition-all duration-200 ${
                  openMotivatorIndex === null
                    ? "h-auto lg:h-[216px] justify-between"
                    : "h-auto gap-4"
                }`}
              >
                <div>
                  <h3 className="text-[17px] font-black text-[#17152E] tracking-tight">
                    Textos Motivadores
                  </h3>
                </div>

                <div
                  className={
                    openMotivatorIndex === null ? "space-y-6 pb-2" : "space-y-4"
                  }
                >
                  {/* Item 1 */}
                  <div className="w-full">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMotivatorIndex(
                          openMotivatorIndex === 1 ? null : 1,
                        )
                      }
                      className="w-full flex items-center justify-between text-left group cursor-pointer transition select-none"
                    >
                      <span className="text-[13.5px] sm:text-[14px] font-bold text-[#17152E] group-hover:text-[#4F3CF0] transition-colors pr-3 truncate">
                        Texto I · Investimento em pesquisa
                      </span>
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        stroke="#5F5B7D"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`shrink-0 transition-transform duration-200 ${
                          openMotivatorIndex === 1
                            ? "rotate-180 stroke-[#4F3CF0]"
                            : ""
                        }`}
                      >
                        <path d="M1 1.25L5 4.75L9 1.25" />
                      </svg>
                    </button>
                    {openMotivatorIndex === 1 && (
                      <div className="mt-2.5 p-3.5 rounded-xl bg-[#FAF9FE] border border-[#E2DFF1]/70 text-[11.5px] leading-relaxed text-[#5F5B7D] space-y-2 animate-fadeIn">
                        <blockquote className="italic border-l-2 border-[#4F3CF0] pl-2.5 text-[#17152E]">
                          "Art. 231. São reconhecidos aos povos originários e
                          comunidades tradicionais sua organização social,
                          costumes, línguas, crenças e tradições, e os direitos
                          originários sobre as terras que tradicionalmente
                          ocupam..."
                        </blockquote>
                        <p>
                          Pesquisas socioambientais e demográficas do IPEA e
                          instituições científicas apontam que o investimento
                          contínuo em pesquisa etnográfica, monitoramento
                          territorial e inovação tecnológica é indispensável
                          para preservar o patrimônio cultural e ambiental
                          brasileiro.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Item 2 */}
                  <div className="w-full">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMotivatorIndex(
                          openMotivatorIndex === 2 ? null : 2,
                        )
                      }
                      className="w-full flex items-center justify-between text-left group cursor-pointer transition select-none"
                    >
                      <span className="text-[13.5px] sm:text-[14px] font-bold text-[#17152E] group-hover:text-[#4F3CF0] transition-colors pr-3 truncate">
                        Texto II · Gráfico de dados sobre o tema
                      </span>
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        stroke="#5F5B7D"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`shrink-0 transition-transform duration-200 ${
                          openMotivatorIndex === 2
                            ? "rotate-180 stroke-[#4F3CF0]"
                            : ""
                        }`}
                      >
                        <path d="M1 1.25L5 4.75L9 1.25" />
                      </svg>
                    </button>
                    {openMotivatorIndex === 2 && (
                      <div className="mt-2.5 p-3.5 rounded-xl bg-[#FAF9FE] border border-[#E2DFF1]/70 text-[11.5px] leading-relaxed text-[#5F5B7D] space-y-2 animate-fadeIn">
                        <p className="font-bold text-[#17152E]">
                          Distribuição Demográfica e Proteção dos Biomas (Censo
                          IBGE / FUNAI):
                        </p>
                        <p>
                          O Brasil registra mais de 1,7 milhão de indígenas e
                          1,3 milhão de quilombolas, além de ribeirinhos e
                          extrativistas. Dados estatísticos comprovam que
                          territórios devidamente delimitados e com suporte
                          socioeconômico apresentam índices de devastação até
                          80% menores que a média nacional.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Item 3 */}
                  <div className="w-full">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMotivatorIndex(
                          openMotivatorIndex === 3 ? null : 3,
                        )
                      }
                      className="w-full flex items-center justify-between text-left group cursor-pointer transition select-none"
                    >
                      <span className="text-[13.5px] sm:text-[14px] font-bold text-[#17152E] group-hover:text-[#4F3CF0] transition-colors pr-3 truncate">
                        Texto III · Charge sobre a importância do tema
                      </span>
                      <svg
                        width="10"
                        height="6"
                        viewBox="0 0 10 6"
                        fill="none"
                        stroke="#5F5B7D"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`shrink-0 transition-transform duration-200 ${
                          openMotivatorIndex === 3
                            ? "rotate-180 stroke-[#4F3CF0]"
                            : ""
                        }`}
                      >
                        <path d="M1 1.25L5 4.75L9 1.25" />
                      </svg>
                    </button>
                    {openMotivatorIndex === 3 && (
                      <div className="mt-2.5 p-3.5 rounded-xl bg-[#FAF9FE] border border-[#E2DFF1]/70 text-[11.5px] leading-relaxed text-[#5F5B7D] space-y-2 animate-fadeIn">
                        <p className="font-bold text-[#17152E]">
                          Reflexão Crítica e Patrimônio Imaterial:
                        </p>
                        <p>
                          A charge ilustra o avanço desordenado da exploração
                          econômica sobre ecossistemas ancestrais, contrastando
                          com a harmonia e as tecnologias sociais milenares
                          mantidas pelas populações tradicionais. Ignorar esses
                          saberes fragiliza a segurança climática e a própria
                          identidade do país.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card 3: Estrutura (400x210 conforme SVG oficial) */}
              <div className="w-full h-auto lg:h-[210px] bg-white rounded-[20px] border border-[#E2DFF1] px-7 py-6 shadow-2xs flex flex-col justify-between shrink-0">
                <div>
                  <h3 className="text-[17px] font-black text-[#17152E] tracking-tight">
                    Estrutura
                  </h3>
                </div>

                <div className="space-y-3.5 pb-0.5">
                  {[
                    {
                      id: "intro",
                      label: "Introdução",
                      done: essayStructureStatus.intro,
                    },
                    {
                      id: "dev1",
                      label: "Desenvolvimento 1",
                      done: essayStructureStatus.dev1,
                    },
                    {
                      id: "dev2",
                      label: "Desenvolvimento 2",
                      done: essayStructureStatus.dev2,
                    },
                    {
                      id: "concl",
                      label: "Conclusão com proposta de intervenção",
                      done: essayStructureStatus.concl,
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3.5 select-none transition-colors"
                    >
                      {item.done ? (
                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="shrink-0 animate-fadeIn"
                          >
                            <path
                              d="M3.5 8.2L6.2 10.9L12.5 4.6"
                              stroke="#137A51"
                              strokeWidth="1.67"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-4 h-4 flex items-center justify-center shrink-0">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="shrink-0"
                          >
                            <circle
                              cx="8"
                              cy="8"
                              r="6.2"
                              stroke="#8C88AA"
                              strokeWidth="1.5"
                            />
                          </svg>
                        </div>
                      )}
                      <span
                        className={`text-[13.5px] sm:text-[14px] transition-colors truncate ${
                          item.done
                            ? "font-bold text-[#17152E]"
                            : "font-medium text-[#5F5B7D]"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ================================================================= */}
            {/* COLUNA DIREITA: FOLHA DE REDAÇÃO PAUTADA OFICIAL (ENEM)            */}
            {/* ================================================================= */}
            <div className="flex-1 min-w-0 w-full flex flex-col space-y-4">
              <div className="bg-white rounded-[24px] border border-[#E2DFF1] p-5 sm:p-7 shadow-xs flex flex-col">
                {/* Header da Folha de Redação */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E2DFF1]/70">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#17152E]">
                      Folha de Redação
                    </h3>
                    <p className="text-xs text-[#5F5B7D] mt-0.5">
                      Texto definitivo · Prova de Redação do ENEM
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setNewEssayText(DEFAULT_MODEL_ESSAY)
                        try {
                          localStorage.setItem(
                            "sherlock_essay_draft",
                            DEFAULT_MODEL_ESSAY,
                          )
                        } catch {
                          // ignore
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-[#E9E6FF] hover:bg-[#DCD6FF] text-[#4F3CF0] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                      title="Preencher com redação exemplar nota 1000"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      <span>Modelo Nota 1000</span>
                    </button>

                    {newEssayText && (
                      <button
                        type="button"
                        onClick={() => {
                          setNewEssayText("")
                          try {
                            localStorage.removeItem("sherlock_essay_draft")
                          } catch {
                            // ignore
                          }
                        }}
                        className="px-3 py-1.5 rounded-full border border-[#8C88AA]/40 text-[#5F5B7D] hover:text-[#C42B30] hover:border-[#C42B30]/40 font-bold text-xs transition cursor-pointer"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                </div>

                {/* Métricas e Contadores */}
                <div className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-[#E2DFF1]/70 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Linhas */}
                    <span
                      className={`px-3 py-1 rounded-full font-bold transition-colors ${
                        computedLinesCount > 30
                          ? "bg-[#FFE8E8] text-[#C42B30]"
                          : computedLinesCount >= 20
                            ? "bg-[#E9F9EE] text-[#1C8A43]"
                            : computedLinesCount >= 7
                              ? "bg-[#FFF8E7] text-[#B27B00]"
                              : "bg-[#F7F6FC] text-[#5F5B7D]"
                      }`}
                    >
                      {computedLinesCount} / 30 linhas
                    </span>

                    {/* Palavras */}
                    <span className="px-3 py-1 rounded-full bg-[#F7F6FC] text-[#5F5B7D] font-medium">
                      {computedWordsCount} palavras
                    </span>

                    {/* Parágrafos */}
                    <span className="px-3 py-1 rounded-full bg-[#F7F6FC] text-[#5F5B7D] font-medium">
                      {computedParagraphsCount} parágrafos
                    </span>
                  </div>

                  {/* Status Rascunho */}
                  <div className="flex items-center gap-1.5 text-[11px] text-[#1C8A43] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#1C8A43] animate-pulse" />
                    <span>Rascunho salvo</span>
                  </div>
                </div>

                {/* Grade Pautada Oficial (30 Linhas / 32px por linha = 960px) */}
                <div className="mt-4 border border-[#E2DFF1] rounded-2xl bg-white overflow-hidden shadow-2xs">
                  {/* Top bar da folha */}
                  <div className="bg-[#FAF9FE] px-4 py-2 border-b border-[#E2DFF1] flex items-center justify-between text-xs text-[#5F5B7D]">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-[#4F3CF0]">
                      Texto Definitivo
                    </span>
                    <span className="font-mono text-[11px]">
                      30 Linhas Pautadas · Grade Oficial ENEM
                    </span>
                  </div>

                  {/* Números à esquerda + Linhas à direita */}
                  <div className="flex relative" style={{ minHeight: "960px" }}>
                    {/* Coluna com numeração 01..30 */}
                    <div className="w-10 sm:w-12 shrink-0 bg-[#F7F6FC] border-r border-[#E2DFF1] select-none py-2 flex flex-col font-mono text-[11px] font-semibold text-[#8C88AA] text-center">
                      {Array.from({ length: 30 }, (_, i) => (
                        <div
                          key={i}
                          className={`h-[32px] flex items-center justify-center transition-colors ${
                            computedLinesCount > i
                              ? "text-[#4F3CF0] font-bold bg-[#E9E6FF]/40"
                              : ""
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </div>
                      ))}
                    </div>

                    {/* Linhas horizontais e Textarea */}
                    <div className="flex-1 relative py-2">
                      {/* Linhas pautadas horizontais */}
                      <div
                        className="absolute inset-0 pt-2 pointer-events-none select-none flex flex-col"
                        aria-hidden="true"
                      >
                        {Array.from({ length: 30 }, (_, i) => (
                          <div
                            key={i}
                            className={`h-[32px] border-b border-[#E2DFF1]/70 w-full transition-colors ${
                              computedLinesCount === i + 1
                                ? "border-b-[#4F3CF0]/40"
                                : ""
                            }`}
                          />
                        ))}
                      </div>

                      {/* Textarea sobreposta com lineHeight sincronizado em 32px */}
                      <textarea
                        value={newEssayText}
                        onChange={(e) => {
                          setNewEssayText(e.target.value)
                          try {
                            localStorage.setItem(
                              "sherlock_essay_draft",
                              e.target.value,
                            )
                          } catch {
                            // ignore
                          }
                        }}
                        placeholder="Inicie aqui o seu texto dissertativo-argumentativo..."
                        style={{
                          lineHeight: "32px",
                          minHeight: "960px",
                        }}
                        className="relative z-10 w-full h-full bg-transparent px-4 py-0 font-serif text-[15px] sm:text-[16px] text-[#17152E] outline-none resize-none overflow-hidden"
                        spellCheck={false}
                      />
                    </div>
                  </div>
                </div>

                {/* Alerta de Extensão do Texto */}
                <div className="mt-4">
                  {computedLinesCount < 7 && computedLinesCount > 0 && (
                    <div className="p-3 rounded-xl bg-[#FFE8E8] border border-[#C42B30]/30 text-xs text-[#C42B30] flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>
                        Atenção: redações com até 7 linhas recebem nota zero no
                        ENEM.
                      </span>
                    </div>
                  )}

                  {computedLinesCount >= 7 && computedLinesCount < 20 && (
                    <div className="p-3 rounded-xl bg-[#FFF8E7] border border-[#FFC700]/40 text-xs text-[#B27B00] flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                      <span>
                        Você escreveu {computedLinesCount} linhas. Para nota
                        máxima, recomenda-se entre 20 e 30 linhas.
                      </span>
                    </div>
                  )}

                  {computedLinesCount >= 20 && computedLinesCount <= 30 && (
                    <div className="p-3 rounded-xl bg-[#E9F9EE] border border-[#27AE60]/30 text-xs text-[#1C8A43] flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                        <polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                      <span>
                        Extensão excelente! {computedLinesCount} linhas escritas
                        dentro da faixa de pontuação máxima.
                      </span>
                    </div>
                  )}

                  {computedLinesCount > 30 && (
                    <div className="p-3 rounded-xl bg-[#FFE8E8] border border-[#C42B30]/30 text-xs text-[#C42B30] flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span>
                        Você ultrapassou 30 linhas ({computedLinesCount}{" "}
                        linhas). Linhas além da 30ª são desconsideradas no ENEM.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TELA DE SIMULADO EM EXECUÇÃO (Modo Prova - 1440x900 Conforme SVG Oficial)   */}
      {/* ========================================================================= */}
      {activeExam && (
        <div className="fixed inset-0 z-50 bg-[#F7F6FC] text-[#17152E] flex flex-col overflow-y-auto min-h-screen select-text font-sans animate-in fade-in duration-200">
          {/* CABEÇALHO SUPERIOR (1440x76 conforme SVG) */}
          <header className="w-full h-[76px] bg-white border-b border-[#E2DFF1] px-6 lg:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-2xs">
            {/* Lado Esquerdo: Botão Sair */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  setActiveExam(null)
                  setShowSubmitModal(false)
                  setExamDelivered(false)
                }}
                className="inline-flex items-center gap-2.5 text-[#17152E] hover:text-[#4F3CF0] transition cursor-pointer select-none py-1.5 px-1 group"
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="shrink-0 group-hover:scale-110 transition-transform"
                >
                  <path
                    d="M11 1L1 11M1 11L11 11"
                    stroke="#17152E"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-bold text-[15px] leading-none text-[#17152E]">
                  Sair
                </span>
              </button>
            </div>

            {/* Centro: Título do Simulado e Progresso */}
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-[17px] font-black text-[#17152E] tracking-tight leading-tight">
                {activeExam.title}
              </h2>
              <p className="text-[12px] font-semibold text-[#5F5B7D] mt-0.5">
                Questão {String(examQuestionIndex + 1).padStart(2, "0")} de{" "}
                {activeExam.totalQuestions}
              </p>
            </div>

            {/* Lado Direito: Cronômetro e Botão Entregar */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Cronômetro (173x51px, rx=25.5, border #8C88AA) */}
              <div className="w-[173px] h-[51px] rounded-[25.5px] border border-[#8C88AA] bg-white flex items-center justify-center gap-2.5 px-4 select-none shadow-2xs">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-[#17152E] shrink-0"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 7V12L15 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-mono font-bold text-[16px] text-[#17152E] tracking-wider">
                  {formatExamTimer(examSecondsLeft)}
                </span>
              </div>

              {/* Botão Entregar simulado (185x48px, rx=24, fill #4F3CF0) */}
              <button
                type="button"
                onClick={handleDeliverExam}
                className="w-[185px] h-[48px] rounded-[24px] bg-[#4F3CF0] hover:bg-[#3D2DC9] transition-colors text-white font-bold text-[14px] flex items-center justify-center cursor-pointer shadow-xs active:scale-[0.99]"
              >
                Entregar simulado
              </button>
            </div>
          </header>

          {/* CONTEÚDO PRINCIPAL (1012px Questão + 340px Navegação da Prova) */}
          <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start flex-1">
            {/* CARD DA ESQUERDA: QUESTÃO (1012x564px, rx=20) */}
            {(() => {
              const currentQ =
                SIMULADO_90_QUESTIONS[examQuestionIndex] ||
                SIMULADO_90_QUESTIONS[0]
              return (
                <div className="w-full lg:w-[1012px] flex-1 bg-white rounded-[20px] p-6 sm:p-8 border border-[#E2DFF1] shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)] flex flex-col justify-between min-h-[564px]">
                  <div>
                    {/* Badge da Questão */}
                    <div className="mb-4">
                      <span className="font-extrabold text-[12px] tracking-[0.08em] text-[#4F3CF0] uppercase">
                        {currentQ.badge}
                      </span>
                    </div>

                    {/* Enunciado */}
                    <div className="space-y-4 mb-6">
                      {currentQ.context.split("\n\n").map((paragraph, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-[15.5px] text-[#17152E] leading-relaxed font-normal"
                        >
                          {paragraph}
                        </p>
                      ))}
                      {currentQ.intro && (
                        <p className="text-[15px] font-semibold text-[#17152E] pt-1">
                          {currentQ.intro}
                        </p>
                      )}
                    </div>

                    {/* Lista de Alternativas (A a E) */}
                    <div className="space-y-3 mb-8">
                      {currentQ.alternatives.map((alt) => {
                        const isSelected =
                          examAnswers[examQuestionIndex] === alt.letter
                        return (
                          <button
                            key={alt.letter}
                            type="button"
                            onClick={() => {
                              setExamAnswers((prev) => ({
                                ...prev,
                                [examQuestionIndex]: alt.letter,
                              }))
                            }}
                            className={`
                              w-full text-left p-3.5 sm:p-4 rounded-[14px] flex items-center gap-3.5 sm:gap-4 transition cursor-pointer
                              ${
                                isSelected
                                  ? "bg-[#F7F6FC] border-2 border-[#4F3CF0] shadow-2xs font-semibold"
                                  : "bg-white border border-[#E2DFF1] hover:border-[#4F3CF0]/60 hover:bg-[#FDFDFF]"
                              }
                            `}
                          >
                            <div
                              className={`
                                w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition
                                ${
                                  isSelected
                                    ? "bg-[#4F3CF0] text-white"
                                    : "bg-[#F7F6FC] text-[#5F5B7D] border border-[#E2DFF1]"
                                }
                              `}
                            >
                              {alt.letter}
                            </div>
                            <span className="text-[15px] text-[#17152E] leading-snug">
                              {alt.text}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Controles de Navegação da Questão (Anterior / Próxima questão) */}
                  <div className="w-full flex items-center justify-between pt-6 border-t border-[#F0EDF9] mt-auto">
                    <button
                      type="button"
                      disabled={examQuestionIndex <= 0}
                      onClick={() =>
                        setExamQuestionIndex((prev) => Math.max(0, prev - 1))
                      }
                      className="h-[48px] px-6 rounded-full border border-[#8C88AA] bg-white text-[#17152E] font-bold text-sm flex items-center gap-2 hover:bg-[#F7F6FC] disabled:opacity-35 disabled:cursor-not-allowed transition cursor-pointer"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                      <span>Anterior</span>
                    </button>

                    <button
                      type="button"
                      disabled={
                        examQuestionIndex >= activeExam.totalQuestions - 1
                      }
                      onClick={() =>
                        setExamQuestionIndex((prev) =>
                          Math.min(activeExam.totalQuestions - 1, prev + 1),
                        )
                      }
                      className="h-[48px] px-7 rounded-full bg-[#4F3CF0] hover:bg-[#3D2DC9] text-white font-bold text-sm flex items-center gap-2 transition cursor-pointer shadow-xs"
                    >
                      <span>Próxima questão</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )
            })()}

            {/* CARD DA DIREITA: NAVEGAÇÃO DA PROVA (340x744px, rx=20) */}
            <div className="w-full lg:w-[340px] shrink-0 bg-white rounded-[20px] p-6 border border-[#E2DFF1] shadow-[0_1px_2px_rgba(23,21,46,0.08),0_2px_6px_rgba(23,21,46,0.06)] flex flex-col">
              {/* Cabeçalho da Navegação */}
              <div className="w-full flex items-center justify-between pb-3 border-b border-[#F0EDF9]">
                <div>
                  <h3 className="text-[17px] font-black text-[#17152E] tracking-tight">
                    Navegação da prova
                  </h3>
                  <p className="text-[12px] font-semibold text-[#5F5B7D] mt-0.5">
                    Respondidas: {Object.keys(examAnswers).length} de{" "}
                    {activeExam.totalQuestions}
                  </p>
                </div>
              </div>

              {/* Legenda de Status */}
              <div className="flex items-center justify-between py-3 border-b border-[#F0EDF9] text-[11px] font-semibold text-[#5F5B7D]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4F3CF0] inline-block" />
                  <span>Atual</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E9E6FF] border border-[#4F3CF0]/40 inline-block" />
                  <span>Respondida</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F7F6FC] border border-[#E2DFF1] inline-block" />
                  <span>Pendente</span>
                </div>
              </div>

              {/* Grade de 90 Questões (6 colunas x 15 linhas) */}
              <div className="grid grid-cols-6 gap-2 pt-4">
                {Array.from({ length: activeExam.totalQuestions }, (_, i) => {
                  const isCurrent = examQuestionIndex === i
                  const isAnswered = examAnswers[i] !== undefined
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setExamQuestionIndex(i)}
                      className={`
                        h-9 rounded-[10px] text-[12px] flex items-center justify-center font-bold transition cursor-pointer
                        ${
                          isCurrent
                            ? "bg-[#4F3CF0] text-white shadow-xs scale-105 ring-2 ring-[#4F3CF0]/30"
                            : isAnswered
                              ? "bg-[#E9E6FF] text-[#4F3CF0] border border-[#4F3CF0]/30 hover:bg-[#DDD8FE]"
                              : "bg-[#F7F6FC] text-[#5F5B7D] border border-[#E2DFF1] hover:border-[#4F3CF0] hover:text-[#17152E]"
                        }
                      `}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* MODAL DE CONFIRMAÇÃO / RESULTADO DA ENTREGA */}
          {showSubmitModal && (
            <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
              <div className="w-full max-w-md bg-white rounded-[24px] p-6 sm:p-8 border border-[#E2DFF1] shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
                {!examDelivered ? (
                  <>
                    <div className="text-center space-y-2">
                      <div className="w-14 h-14 rounded-full bg-[#E9E6FF] text-[#4F3CF0] flex items-center justify-center mx-auto mb-3">
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-black text-[#17152E]">
                        Entregar simulado?
                      </h3>
                      <p className="text-sm text-[#5F5B7D] leading-relaxed">
                        Você respondeu{" "}
                        <strong className="text-[#17152E]">
                          {Object.keys(examAnswers).length}
                        </strong>{" "}
                        de <strong>{activeExam.totalQuestions}</strong>{" "}
                        questões.
                        {activeExam.totalQuestions -
                          Object.keys(examAnswers).length >
                          0 && (
                          <span className="block mt-1 text-amber-600 font-semibold">
                            Ainda restam{" "}
                            {activeExam.totalQuestions -
                              Object.keys(examAnswers).length}{" "}
                            questões em branco.
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowSubmitModal(false)}
                        className="flex-1 h-12 rounded-full border border-[#8C88AA] hover:bg-[#F7F6FC] transition text-[#17152E] font-bold text-sm cursor-pointer"
                      >
                        Continuar prova
                      </button>
                      <button
                        type="button"
                        onClick={handleDeliverExam}
                        className="flex-1 h-12 rounded-full bg-[#4F3CF0] hover:bg-[#3D2DC9] transition text-white font-bold text-sm cursor-pointer shadow-xs"
                      >
                        Confirmar entrega
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center space-y-3">
                      <div className="w-16 h-16 rounded-full bg-[#C6F432]/30 text-[#17152E] flex items-center justify-center mx-auto mb-2">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#137A51"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-black text-[#17152E]">
                        Simulado Entregue!
                      </h3>
                      <p className="text-sm text-[#5F5B7D]">
                        Parabéns por completar o Simulado Completo do ENEM.
                      </p>

                      {/* Card de Estatísticas */}
                      <div className="bg-[#F7F6FC] rounded-2xl p-4 border border-[#E2DFF1] space-y-2 mt-4 text-left">
                        <div className="flex justify-between text-sm">
                          <span className="text-[#5F5B7D] font-medium">
                            Questões respondidas:
                          </span>
                          <span className="font-bold text-[#17152E]">
                            {Object.keys(examAnswers).length} /{" "}
                            {activeExam.totalQuestions}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#5F5B7D] font-medium">
                            Tempo decorrido:
                          </span>
                          <span className="font-bold text-[#17152E]">
                            {formatExamTimer(19800 - examSecondsLeft)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-[#5F5B7D] font-medium">
                            Status:
                          </span>
                          <span className="font-bold text-[#137A51]">
                            Gabarito processado
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveExam(null)
                          setShowSubmitModal(false)
                          setExamDelivered(false)
                        }}
                        className="w-full h-12 rounded-full bg-[#4F3CF0] hover:bg-[#3D2DC9] transition text-white font-bold text-sm cursor-pointer shadow-xs"
                      >
                        Voltar para Simulados
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL DE TERMOS DE USO E POLÍTICA DE PRIVACIDADE                           */}
      {/* ========================================================================= */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
      />
    </div>
  )
}
