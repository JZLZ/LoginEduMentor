import { useId, useState, useEffect } from "react"

/**
 * ============================================================================
 * 🐛 MENTORINA · SISTEMA UNIFICADO DE MASCOTE & POSES (FIGMA COMPONENT SYSTEM)
 * ============================================================================
 * Componente canônico unificado da mascote oficial do EduMentor AI.
 *
 * ESPECIFICAÇÃO DE USO NO FIGMA:
 * "Use em momentos de emoção (boas-vindas, escolhas, conquistas, dúvidas e
 * alertas), nunca em telas de prova ou leitura longa."
 *
 * POSES OFICIAIS:
 * 1. acenando     · Acenando · boas-vindas
 * 2. pensando     · Pensando · escolhas
 * 3. lendo        · Lendo · estudo
 * 4. pulando      · Pulando · progresso
 * 5. interrogacao · Interrogação · dúvida
 * 6. surpresa     · Surpresa · alertas
 * 7. foco         · Foco · simulados
 * 8. comemorando  · Comemorando · conquistas
 * 9. avatar       · Avatar · perfil circular
 * 10. stairs      · Escadaria institucional (cards de passos / onboarding)
 * 11. coiled      · Espiral clássica oficial
 */

export type MascotPose =
  | "acenando" // 👋 Boas-vindas, introdução, onboarding
  | "pensando" // 🤔 Escolhas, reflexão, tomada de decisão
  | "lendo" // 📖 Estudo, resumos, leitura, teoria
  | "pulando" // 🚀 Progresso, evolução, salto de nível
  | "interrogacao" // ❓ Dúvidas, FAQ, suporte, central de ajuda
  | "surpresa" // ⚡ Alertas, avisos, prazos, novidades
  | "foco" // 🎯 Simulados, resolução de questões, cronômetro
  | "comemorando" // 🎉 Conquistas, aprovação, parabéns, nota alta
  | "avatar" // 👤 Foto de perfil, cabeçalho de chat, ícone circular
  | "stairs" // 🪜 Escadaria institucional (cards de passos / onboarding)
  | "coiled" // 🌀 Espiral clássica para fundos escuros e hero
  | "v6" // ⭐ Variante oficial v6 refinada

export type MascotPoseAlias =
  | MascotPose
  | "boas-vindas"
  | "escolhas"
  | "estudo"
  | "progresso"
  | "duvida"
  | "alerta"
  | "simulados"
  | "conquistas"
  | "waving"
  | "thinking"
  | "reading"
  | "jumping"
  | "question"
  | "surprise"
  | "focus"
  | "celebrating"
  | "escadaria"
  | "espiral"

export interface MascotProps {
  /** Nome ou alias da pose oficial */
  pose?: MascotPoseAlias
  /** Compatibilidade retroativa com código existente */
  variant?: MascotPoseAlias
  /** Tamanho em pixels (largura e altura). Padrão: 220 */
  size?: number
  /** Classes CSS adicionais do Tailwind */
  className?: string
  /** Humor ou expressão facial (quando aplicável) */
  mood?: "happy" | "thinking" | "smart" | "waving" | "joy"
  /** Cor da espiral/escadaria ('purple' | 'white') */
  coilColor?: "purple" | "white"
  /** Rótulo de acessibilidade customizado */
  ariaLabel?: string
}

export interface MascotMorpherProps {
  /** Tamanho em pixels da mascote em transição. Padrão: 220 */
  size?: number
  /** Classes CSS adicionais */
  className?: string
  /** Se deve alternar as poses automaticamente. Padrão: true */
  autoPlay?: boolean
  /** Intervalo em milissegundos para troca de pose. Padrão: 3500 */
  intervalMs?: number
  /** Lista customizada de poses para alternar (padrão: todas as 8 poses oficiais) */
  poses?: MascotPose[]
  /** Cor da espiral ('purple' | 'white') */
  coilColor?: "purple" | "white"
}

/**
 * Metadados de cada pose para auxiliar designers e desenvolvedores
 * a posicionar a pose certa na tela certa.
 */
export const MASCOT_POSES = {
  acenando: {
    id: "acenando",
    title: "Acenando",
    subtitle: "Boas-vindas",
    description:
      "Acolhimento amigável. Ideal para telas de login, boas-vindas, introdução e início de jornada.",
    aliases: ["boas-vindas", "waving"],
    defaultSize: 220,
    context: "Entrada e recepção do aluno",
  },
  pensando: {
    id: "pensando",
    title: "Pensando",
    subtitle: "Escolhas",
    description:
      "Mentorina com olhar reflexivo e balões de ideias verdes. Ideal para tela de seleção de curso, metas e dúvidas.",
    aliases: ["escolhas", "thinking"],
    defaultSize: 220,
    context: "Momentos de reflexão e escolha de trilha",
  },
  lendo: {
    id: "lendo",
    title: "Lendo",
    subtitle: "Estudo",
    description:
      "Mentorina debruçada lendo um livro/caderno verde. Perfeita para módulos de conteúdo, materiais teóricos e resumos.",
    aliases: ["estudo", "reading"],
    defaultSize: 220,
    context: "Aulas teóricas e biblioteca",
  },
  pulando: {
    id: "pulando",
    title: "Pulando",
    subtitle: "Progresso",
    description:
      "Salto dinâmico com partículas de impulso. Ideal para indicar avanço de etapa, XP ganho e subida de nível.",
    aliases: ["progresso", "jumping"],
    defaultSize: 220,
    context: "Feedback positivo e avanço",
  },
  interrogacao: {
    id: "interrogacao",
    title: "Interrogação",
    subtitle: "Dúvida",
    description:
      "Corpo em formato de interrogação com ponto verde na base. Essencial para FAQ, suporte e 'Não entendi'.",
    aliases: ["duvida", "question"],
    defaultSize: 220,
    context: "Ajuda, suporte e perguntas frequentes",
  },
  surpresa: {
    id: "surpresa",
    title: "Surpresa",
    subtitle: "Alertas",
    description:
      "Olhos arregalados e ponto de exclamação coral. Perfeita para lembretes de prazos, novidades e alertas importantes.",
    aliases: ["alerta", "surprise"],
    defaultSize: 220,
    context: "Avisos e notificações cruciais",
  },
  foco: {
    id: "foco",
    title: "Foco",
    subtitle: "Simulados",
    description:
      "Olhar focado com prancheta de simulado ENEM. Excelente para a central de simulados, cronômetro e ranking.",
    aliases: ["simulados", "focus"],
    defaultSize: 220,
    context: "Treinamento intensivo de questões",
  },
  comemorando: {
    id: "comemorando",
    title: "Comemorando",
    subtitle: "Conquistas",
    description:
      "Expressão radiante e chuva de confetes multicoloridos. Usada em notas altas, aprovação e conclusão de simulados.",
    aliases: ["conquistas", "celebrating", "joy"],
    defaultSize: 220,
    context: "Sucesso, conclusão de metas e aprovação",
  },
  avatar: {
    id: "avatar",
    title: "Avatar",
    subtitle: "Foto de perfil",
    description:
      "Enquadramento circular de 120px ou mini para balões de chat, cabeçalho de mensagens e perfil da tutora.",
    aliases: [],
    defaultSize: 120,
    context: "Chat e interface de conversa",
  },
  stairs: {
    id: "stairs",
    title: "Escadaria",
    subtitle: "Passos da jornada",
    description:
      "Minhoquinha sobre os degraus da marca EduMentor AI. Usada nos cards de passos 01 a 04 e banner final.",
    aliases: ["escadaria"],
    defaultSize: 220,
    context: "Onboarding e passos metodológicos",
  },
  coiled: {
    id: "coiled",
    title: "Espiral Clássica",
    subtitle: "Oficial",
    description:
      "Formato sinuoso original em espiral roxa ou branca, com acabamento institucional refinado.",
    aliases: ["espiral", "v6"],
    defaultSize: 220,
    context: "Hero institucional e cartões de destaque",
  },
} as const

/** Normaliza qualquer pose ou alias para a chave canônica */
export function normalizePose(input?: MascotPoseAlias): MascotPose {
  if (!input) return "stairs"
  const val = input.toLowerCase().trim()

  switch (val) {
    case "acenando":
    case "boas-vindas":
    case "waving":
      return "acenando"

    case "pensando":
    case "escolhas":
    case "thinking":
      return "pensando"

    case "lendo":
    case "estudo":
    case "reading":
      return "lendo"

    case "pulando":
    case "progresso":
    case "jumping":
      return "pulando"

    case "interrogacao":
    case "duvida":
    case "question":
      return "interrogacao"

    case "surpresa":
    case "alerta":
    case "alertas":
    case "surprise":
      return "surpresa"

    case "foco":
    case "simulados":
    case "focus":
      return "foco"

    case "comemorando":
    case "conquistas":
    case "celebrating":
    case "joy":
      return "comemorando"

    case "avatar":
      return "avatar"

    case "stairs":
    case "escadaria":
      return "stairs"

    case "coiled":
    case "espiral":
      return "coiled"

    case "v6":
      return "v6"

    default:
      return "stairs"
  }
}

/** Definições SVG compartilhadas (gradiente radial da cabeça e pontos) */
function MascotDefs({ idPrefix }: { idPrefix: string }) {
  return (
    <defs>
      {/* Gradiente radial oficial da cabeça da Mentorina (Figma: #EEFFA8 -> #C6F432 -> #A6D11A) */}
      <radialGradient
        id={`${idPrefix}-headGrad`}
        cx="38%"
        cy="32%"
        r="75%"
        fx="38%"
        fy="32%"
      >
        <stop offset="0%" stopColor="#EEFFA8" />
        <stop offset="55%" stopColor="#C6F432" />
        <stop offset="100%" stopColor="#A6D11A" />
      </radialGradient>

      {/* Gradiente do ponto da interrogação */}
      <radialGradient
        id={`${idPrefix}-dotGrad`}
        cx="38%"
        cy="32%"
        r="75%"
        fx="38%"
        fy="32%"
      >
        <stop offset="0%" stopColor="#EEFFA8" />
        <stop offset="55%" stopColor="#C6F432" />
        <stop offset="100%" stopColor="#A6D11A" />
      </radialGradient>
    </defs>
  )
}

/**
 * ============================================================================
 * POSE 1: ACENANDO · BOAS-VINDAS
 * ============================================================================
 */
export function PoseAcenando({
  coilColor = "purple",
  idPrefix,
}: {
  coilColor?: "purple" | "white"
  idPrefix: string
}) {
  const isWhite = coilColor === "white"

  return (
    <g id="pose-acenando">
      {/* Sombra suave no chão (Figma: left 26.67%, top 80.33%, opacity 0.1) */}
      <ellipse cx="110" cy="186" rx="51" ry="7" fill="#17152E" opacity="0.10" />

      {/* Traços corais de aceno na lateral esquerda (Figma: border 3.67px solid #FF6B57) */}
      <path
        d="M 32 82 C 28 92, 28 100, 32 110"
        fill="none"
        stroke="#FF6B57"
        strokeWidth="3.67"
        strokeLinecap="round"
      />
      <path
        d="M 20 76 C 16 86, 16 94, 20 104"
        fill="none"
        stroke="#FF6B57"
        strokeWidth="3.67"
        strokeLinecap="round"
      />

      {/* Corpo curvo - Sombra profunda */}
      <path
        d="M 54 162 C 44 190, 80 202, 118 202 C 160 202, 182 178, 172 142 C 162 110, 138 106, 118 120"
        fill="none"
        stroke={isWhite ? "#C9C3F2" : "#3420C2"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Corpo curvo - Principal (Roxo vibrante ou Branco) */}
      <path
        d="M 54 160 C 44 188, 80 200, 118 200 C 160 200, 182 176, 172 140 C 162 108, 138 104, 118 118"
        fill="none"
        stroke={isWhite ? "#FFFFFF" : "#4F3CF0"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Brilho lavanda interno (Figma: border 2.2px solid #8E82FF, opacity 0.45) */}
      <path
        d="M 62 165 C 56 182, 85 192, 118 192 C 150 192, 170 172, 163 145"
        fill="none"
        stroke={isWhite ? "#E9E6FF" : "#8E82FF"}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Cabeça rotacionada 8deg (Figma: rotate 8deg) */}
      <g transform="rotate(8 145 84)">
        <circle cx="145" cy="84" r="25.5" fill={`url(#${idPrefix}-headGrad)`} />

        <ellipse
          cx="137"
          cy="73"
          rx="9.5"
          ry="4.5"
          fill="#FFFFFF"
          opacity="0.45"
          transform="rotate(-12 137 73)"
        />

        <ellipse cx="133" cy="93" rx="5" ry="3.5" fill="#FF6B57" opacity="0.45" />
        <ellipse cx="157" cy="95" rx="5" ry="3.5" fill="#FF6B57" opacity="0.45" />

        <circle
          cx="137"
          cy="84"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />
        <circle
          cx="155"
          cy="86"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />

        <path
          d="M 145.5 84.5 Q 146.5 81.5 147.5 84.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />
        <path
          d="M 128.5 83.5 L 123 82.5 M 163.5 86.5 L 169 85.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />

        <circle cx="138" cy="84" r="3.4" fill="#17152E" />
        <circle cx="137" cy="82.6" r="1.3" fill="#FFFFFF" />
        <circle cx="156" cy="86" r="3.4" fill="#17152E" />
        <circle cx="155" cy="84.6" r="1.3" fill="#FFFFFF" />

        <path
          d="M 142 93 Q 146 98 150 93"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.38"
          strokeLinecap="round"
        />
        <path d="M 144 95 Q 146 98 148 95 Z" fill="#FF6B57" />
      </g>
    </g>
  )
}

/**
 * ============================================================================
 * POSE 2: PENSANDO · ESCOLHAS
 * ============================================================================
 */
export function PosePensando({
  coilColor = "purple",
  idPrefix,
}: {
  coilColor?: "purple" | "white"
  idPrefix: string
}) {
  const isWhite = coilColor === "white"

  return (
    <g id="pose-pensando">
      <ellipse cx="110" cy="192" rx="51" ry="7" fill="#17152E" opacity="0.10" />

      {/* Balões de ideias verdes (Figma: background #C6F432 em 21% e 11.67%) */}
      <circle cx="180" cy="46" r="6" fill="#C6F432" />
      <circle cx="190" cy="26" r="8.5" fill="#C6F432" />

      <path
        d="M 54 162 C 44 190, 80 202, 118 202 C 160 202, 182 178, 172 142 C 162 110, 138 106, 118 120"
        fill="none"
        stroke={isWhite ? "#C9C3F2" : "#3420C2"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 54 160 C 44 188, 80 200, 118 200 C 160 200, 182 176, 172 140 C 162 108, 138 104, 118 118"
        fill="none"
        stroke={isWhite ? "#FFFFFF" : "#4F3CF0"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 62 165 C 56 182, 85 192, 118 192 C 150 192, 170 172, 163 145"
        fill="none"
        stroke={isWhite ? "#E9E6FF" : "#8E82FF"}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.45"
      />

      <g transform="rotate(-10 138 96)">
        <circle cx="138" cy="96" r="25.5" fill={`url(#${idPrefix}-headGrad)`} />

        <ellipse
          cx="131"
          cy="85"
          rx="9.5"
          ry="4.5"
          fill="#FFFFFF"
          opacity="0.45"
          transform="rotate(-30 131 85)"
        />

        <ellipse cx="127" cy="105" rx="5" ry="3.5" fill="#FF6B57" opacity="0.45" />
        <ellipse cx="151" cy="103" rx="5" ry="3.5" fill="#FF6B57" opacity="0.45" />

        <circle
          cx="131"
          cy="95"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />
        <circle
          cx="149"
          cy="92"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />

        <path
          d="M 139.5 93 Q 140.5 90 141.5 93"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />
        <path
          d="M 122.5 94.5 L 117 93.5 M 157.5 91.5 L 163 90.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />

        {/* Olhos pensativos voltados para cima e à direita */}
        <circle cx="133" cy="92" r="3.4" fill="#17152E" />
        <circle cx="132" cy="90.5" r="1.3" fill="#FFFFFF" />

        <circle cx="151" cy="89" r="3.4" fill="#17152E" />
        <circle cx="150" cy="87.5" r="1.3" fill="#FFFFFF" />

        <path
          d="M 136 104 Q 140 106 144 103"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.38"
          strokeLinecap="round"
        />
      </g>
    </g>
  )
}

/**
 * ============================================================================
 * POSE 3: LENDO · ESTUDO
 * ============================================================================
 */
export function PoseLendo({
  coilColor = "purple",
  idPrefix,
}: {
  coilColor?: "purple" | "white"
  idPrefix: string
}) {
  const isWhite = coilColor === "white"

  return (
    <g id="pose-lendo">
      <ellipse cx="110" cy="192" rx="66" ry="7" fill="#17152E" opacity="0.10" />

      <path
        d="M 46 162 C 38 190, 72 202, 108 202 C 148 202, 172 178, 162 142 C 152 110, 128 106, 110 120"
        fill="none"
        stroke={isWhite ? "#C9C3F2" : "#3420C2"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 46 160 C 38 188, 72 200, 108 200 C 148 200, 172 176, 162 140 C 152 108, 128 104, 110 118"
        fill="none"
        stroke={isWhite ? "#FFFFFF" : "#4F3CF0"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 54 165 C 48 182, 75 192, 108 192 C 140 192, 160 172, 153 145"
        fill="none"
        stroke={isWhite ? "#E9E6FF" : "#8E82FF"}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* Cabeça inclinada para a leitura (Figma: rotate 6deg) */}
      <g transform="rotate(6 128 96)">
        <circle cx="128" cy="96" r="25.5" fill={`url(#${idPrefix}-headGrad)`} />

        <ellipse
          cx="120"
          cy="85"
          rx="9.5"
          ry="4.5"
          fill="#FFFFFF"
          opacity="0.45"
          transform="rotate(-14 120 85)"
        />

        <ellipse cx="116" cy="105" rx="5" ry="3.5" fill="#FF6B57" opacity="0.45" />
        <ellipse cx="140" cy="107" rx="5" ry="3.5" fill="#FF6B57" opacity="0.45" />

        <circle
          cx="120"
          cy="96"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />
        <circle
          cx="138"
          cy="98"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />

        <path
          d="M 128.5 96.5 Q 129.5 93.5 130.5 96.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />
        <path
          d="M 111.5 95.5 L 106 94.5 M 146.5 98.5 L 152 97.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />

        {/* Olhos focados no livro abaixo */}
        <circle cx="121" cy="98" r="3.4" fill="#17152E" />
        <circle cx="120.2" cy="96.8" r="1.3" fill="#FFFFFF" />

        <circle cx="139" cy="100" r="3.4" fill="#17152E" />
        <circle cx="138.2" cy="98.8" r="1.3" fill="#FFFFFF" />

        <path
          d="M 125 106 Q 129 110 133 107"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.38"
          strokeLinecap="round"
        />
      </g>

      {/* Livro verde aberto (Figma: rotate -10deg, background #C6F432, border 2.93px #17152E) */}
      <g transform="rotate(-10 140 144)">
        <path
          d="M 115 128 L 140 136 L 165 128 L 165 156 L 140 164 L 115 156 Z"
          fill="#C6F432"
          stroke="#17152E"
          strokeWidth="2.93"
          strokeLinejoin="round"
        />
        <line
          x1="140"
          y1="136"
          x2="140"
          y2="164"
          stroke="#17152E"
          strokeWidth="2.2"
        />
        <line
          x1="121"
          y1="139"
          x2="134"
          y2="143"
          stroke="#17152E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="121"
          y1="146"
          x2="134"
          y2="150"
          stroke="#17152E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="146"
          y1="143"
          x2="159"
          y2="139"
          stroke="#17152E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="146"
          y1="150"
          x2="159"
          y2="146"
          stroke="#17152E"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </g>
    </g>
  )
}

/**
 * ============================================================================
 * POSE 4: PULANDO · PROGRESSO
 * ============================================================================
 */
export function PosePulando({
  coilColor = "purple",
  idPrefix,
}: {
  coilColor?: "purple" | "white"
  idPrefix: string
}) {
  const isWhite = coilColor === "white"

  return (
    <g id="pose-pulando">
      <ellipse cx="110" cy="204" rx="36" ry="5.5" fill="#17152E" opacity="0.10" />

      {/* Linhas de impulso verdes */}
      <path
        d="M 41 62 C 37 70, 39 76, 45 82"
        fill="none"
        stroke="#C6F432"
        strokeWidth="3.67"
        strokeLinecap="round"
      />
      <path
        d="M 53 40 C 49 48, 51 54, 57 60"
        fill="none"
        stroke="#C6F432"
        strokeWidth="3.67"
        strokeLinecap="round"
      />
      <path
        d="M 173 110 C 177 116, 175 122, 169 128"
        fill="none"
        stroke="#C6F432"
        strokeWidth="3.67"
        strokeLinecap="round"
      />
      <path
        d="M 168 132 C 172 138, 170 144, 164 150"
        fill="none"
        stroke="#C6F432"
        strokeWidth="3.67"
        strokeLinecap="round"
      />

      <circle cx="31" cy="110" r="4.5" fill="#C6F432" />
      <circle cx="175" cy="36" r="5" fill="#3CC8F0" />
      <rect
        x="160"
        y="148"
        width="9"
        height="9"
        rx="2"
        fill="#FF6B57"
        transform="rotate(20 160 148)"
      />

      {/* Corpo elevado no ar */}
      <path
        d="M 70 142 C 60 170, 96 182, 134 182 C 176 182, 198 158, 188 122 C 178 90, 154 86, 134 100"
        fill="none"
        stroke={isWhite ? "#C9C3F2" : "#3420C2"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 70 140 C 60 168, 96 180, 134 180 C 176 180, 198 156, 188 120 C 178 88, 154 84, 134 98"
        fill="none"
        stroke={isWhite ? "#FFFFFF" : "#4F3CF0"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 78 145 C 72 162, 101 172, 134 172 C 166 172, 186 152, 179 125"
        fill="none"
        stroke={isWhite ? "#E9E6FF" : "#8E82FF"}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.45"
      />

      <g transform="rotate(10 140 74)">
        <circle cx="140" cy="74" r="25.5" fill={`url(#${idPrefix}-headGrad)`} />

        <ellipse
          cx="132"
          cy="63"
          rx="9.5"
          ry="4.5"
          fill="#FFFFFF"
          opacity="0.45"
          transform="rotate(-10 132 63)"
        />

        <ellipse cx="128" cy="83" rx="5" ry="3.5" fill="#FF6B57" opacity="0.55" />
        <ellipse cx="152" cy="85" rx="5" ry="3.5" fill="#FF6B57" opacity="0.55" />

        <circle
          cx="132"
          cy="74"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />
        <circle
          cx="150"
          cy="76"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />

        <path
          d="M 140.5 74.5 Q 141.5 71.5 142.5 74.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />
        <path
          d="M 123.5 73.5 L 118 72.5 M 158.5 76.5 L 164 75.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />

        {/* Olhos em arco (^ ^) */}
        <path
          d="M 128 75.5 Q 132 69 136 75.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M 146 77.5 Q 150 71 154 77.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        {/* Sorriso aberto com língua coral */}
        <path
          d="M 134.5 82.5 Q 140.5 93 146.5 82.5 Z"
          fill="#17152E"
          stroke="#17152E"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M 136.5 86.5 Q 140.5 92.5 144.5 86.5 Z" fill="#FF6B57" />
      </g>
    </g>
  )
}

/**
 * ============================================================================
 * POSE 5: INTERROGAÇÃO · DÚVIDA
 * ============================================================================
 */
export function PoseInterrogacao({
  coilColor = "purple",
  idPrefix,
}: {
  coilColor?: "purple" | "white"
  idPrefix: string
}) {
  const isWhite = coilColor === "white"

  return (
    <g id="pose-interrogacao">
      <ellipse cx="119" cy="207" rx="34" ry="6.5" fill="#17152E" opacity="0.10" />

      {/* Ponto inferior da interrogação */}
      <circle cx="119" cy="180" r="13" fill={`url(#${idPrefix}-dotGrad)`} />
      <ellipse
        cx="115"
        cy="176"
        rx="5.5"
        ry="2.8"
        fill="#FFFFFF"
        opacity="0.6"
        transform="rotate(-25 115 176)"
      />

      {/* Arco da interrogação (sem ponto coral na ponta) */}
      <path
        d="M 68 88 C 65 52, 105 32, 135 42 C 165 52, 168 85, 142 110 C 124 128, 120 142, 120 160"
        fill="none"
        stroke={isWhite ? "#C9C3F2" : "#3420C2"}
        strokeWidth="17.6"
        strokeLinecap="round"
      />
      <path
        d="M 68 86 C 65 50, 105 30, 135 40 C 165 50, 168 83, 142 108 C 124 126, 120 140, 120 158"
        fill="none"
        stroke={isWhite ? "#FFFFFF" : "#4F3CF0"}
        strokeWidth="17.6"
        strokeLinecap="round"
      />
      <path
        d="M 78 82 C 75 56, 105 40, 132 48 C 158 56, 158 82, 136 104 C 122 120, 118 134, 118 152"
        fill="none"
        stroke={isWhite ? "#E9E6FF" : "#8E82FF"}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.45"
      />

      <g transform="rotate(-8 68 86)">
        <circle cx="68" cy="86" r="24" fill={`url(#${idPrefix}-headGrad)`} />

        <ellipse
          cx="60"
          cy="74"
          rx="9.5"
          ry="4.8"
          fill="#FFFFFF"
          opacity="0.45"
          transform="rotate(-28 60 74)"
        />

        <ellipse cx="56" cy="94" rx="4.8" ry="3.2" fill="#FF6B57" opacity="0.45" />
        <ellipse cx="79" cy="94" rx="4.8" ry="3.2" fill="#FF6B57" opacity="0.45" />

        <circle
          cx="60"
          cy="86"
          r="8"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />
        <circle
          cx="76"
          cy="86"
          r="8"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />

        <path
          d="M 68 85 Q 68.5 82 69 85"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />
        <path
          d="M 52 86 L 47 85.5 M 84 86 L 89 85.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />

        <circle cx="61" cy="85.5" r="3.2" fill="#17152E" />
        <circle cx="60" cy="84.2" r="1.2" fill="#FFFFFF" />
        <circle cx="77" cy="85.5" r="3.2" fill="#17152E" />
        <circle cx="76" cy="84.2" r="1.2" fill="#FFFFFF" />

        <path
          d="M 65 96 Q 68 100 71 96"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.38"
          strokeLinecap="round"
        />
      </g>
    </g>
  )
}

/**
 * ============================================================================
 * POSE 6: SURPRESA · ALERTAS
 * ============================================================================
 */
export function PoseSurpresa({
  coilColor = "purple",
  idPrefix,
}: {
  coilColor?: "purple" | "white"
  idPrefix: string
}) {
  const isWhite = coilColor === "white"

  return (
    <g id="pose-surpresa">
      <ellipse cx="110" cy="192" rx="51" ry="7" fill="#17152E" opacity="0.10" />

      {/* Ponto de exclamação coral */}
      <line
        x1="175"
        y1="46"
        x2="175"
        y2="64"
        stroke="#FF6B57"
        strokeWidth="5.87"
        strokeLinecap="round"
      />
      <circle cx="175" cy="74" r="3.5" fill="#FF6B57" />

      <path
        d="M 54 162 C 44 190, 80 202, 118 202 C 160 202, 182 178, 172 142 C 162 110, 138 106, 118 120"
        fill="none"
        stroke={isWhite ? "#C9C3F2" : "#3420C2"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 54 160 C 44 188, 80 200, 118 200 C 160 200, 182 176, 172 140 C 162 108, 138 104, 118 118"
        fill="none"
        stroke={isWhite ? "#FFFFFF" : "#4F3CF0"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 62 165 C 56 182, 85 192, 118 192 C 150 192, 170 172, 163 145"
        fill="none"
        stroke={isWhite ? "#E9E6FF" : "#8E82FF"}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.45"
      />

      <g transform="rotate(-4 135 96)">
        <circle cx="135" cy="96" r="25.5" fill={`url(#${idPrefix}-headGrad)`} />

        <ellipse
          cx="128"
          cy="85"
          rx="9.5"
          ry="4.5"
          fill="#FFFFFF"
          opacity="0.45"
          transform="rotate(-24 128 85)"
        />

        <ellipse cx="123" cy="105" rx="5" ry="3.5" fill="#FF6B57" opacity="0.45" />
        <ellipse cx="147" cy="104" rx="5" ry="3.5" fill="#FF6B57" opacity="0.45" />

        <circle
          cx="127"
          cy="95"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />
        <circle
          cx="145"
          cy="94"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />

        <path
          d="M 135.5 94 Q 136.5 91 137.5 94"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />
        <path
          d="M 118.5 94.5 L 113 93.5 M 153.5 93.5 L 159 92.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />

        <circle cx="128" cy="95" r="3.6" fill="#17152E" />
        <circle cx="127" cy="93.6" r="1.4" fill="#FFFFFF" />

        <circle cx="146" cy="94" r="3.6" fill="#17152E" />
        <circle cx="145" cy="92.6" r="1.4" fill="#FFFFFF" />

        <ellipse cx="136" cy="106" rx="3.5" ry="4.8" fill="#17152E" />
      </g>
    </g>
  )
}

/**
 * ============================================================================
 * POSE 7: FOCO · SIMULADOS
 * ============================================================================
 */
export function PoseFoco({
  coilColor = "purple",
  idPrefix,
}: {
  coilColor?: "purple" | "white"
  idPrefix: string
}) {
  const isWhite = coilColor === "white"

  return (
    <g id="pose-foco">
      <ellipse cx="110" cy="192" rx="66" ry="7" fill="#17152E" opacity="0.10" />

      <path
        d="M 50 162 C 40 190, 76 202, 114 202 C 154 202, 178 178, 168 142 C 158 110, 134 106, 116 120"
        fill="none"
        stroke={isWhite ? "#C9C3F2" : "#3420C2"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 50 160 C 40 188, 76 200, 114 200 C 154 200, 178 176, 168 140 C 158 108, 134 104, 116 118"
        fill="none"
        stroke={isWhite ? "#FFFFFF" : "#4F3CF0"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 58 165 C 52 182, 81 192, 114 192 C 146 192, 166 172, 159 145"
        fill="none"
        stroke={isWhite ? "#E9E6FF" : "#8E82FF"}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.45"
      />

      <g>
        <circle cx="130" cy="94" r="25.5" fill={`url(#${idPrefix}-headGrad)`} />

        <ellipse
          cx="122"
          cy="83"
          rx="9.5"
          ry="4.5"
          fill="#FFFFFF"
          opacity="0.45"
          transform="rotate(-20 122 83)"
        />

        <ellipse cx="118" cy="103" rx="5" ry="3.5" fill="#FF6B57" opacity="0.45" />
        <ellipse cx="142" cy="103" rx="5" ry="3.5" fill="#FF6B57" opacity="0.45" />

        <circle
          cx="122"
          cy="94"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />
        <circle
          cx="140"
          cy="94"
          r="8.5"
          fill="rgba(255, 255, 255, 0.18)"
          stroke="#17152E"
          strokeWidth="2.38"
        />

        <path
          d="M 130.5 93 Q 131.5 90 132.5 93"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />
        <path
          d="M 113.5 93.5 L 108 93 M 148.5 93.5 L 154 93"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />

        <circle cx="123" cy="94" r="3.4" fill="#17152E" />
        <circle cx="122" cy="92.6" r="1.3" fill="#FFFFFF" />

        <circle cx="141" cy="94" r="3.4" fill="#17152E" />
        <circle cx="140" cy="92.6" r="1.3" fill="#FFFFFF" />

        <path
          d="M 127 105 Q 131 109 135 105"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.38"
          strokeLinecap="round"
        />
      </g>

      {/* Prancheta de simulados ENEM */}
      <g>
        <rect
          x="151"
          y="122"
          width="36"
          height="46"
          rx="4"
          fill="#FFFFFF"
          stroke="#17152E"
          strokeWidth="2.93"
        />
        <rect
          x="163"
          y="118"
          width="12"
          height="5"
          rx="1.5"
          fill="#17152E"
        />
        <line
          x1="158"
          y1="133"
          x2="178"
          y2="133"
          stroke="#4F3CF0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="158"
          y1="141"
          x2="175"
          y2="141"
          stroke="#4F3CF0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="158"
          y1="149"
          x2="180"
          y2="149"
          stroke="#4F3CF0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="158"
          y1="157"
          x2="170"
          y2="157"
          stroke="#4F3CF0"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </g>
  )
}

/**
 * ============================================================================
 * POSE 8: COMEMORANDO · CONQUISTAS
 * ============================================================================
 */
export function PoseComemorando({
  coilColor = "purple",
  idPrefix,
}: {
  coilColor?: "purple" | "white"
  idPrefix: string
}) {
  const isWhite = coilColor === "white"

  return (
    <g id="pose-comemorando">
      <ellipse cx="110" cy="192" rx="51" ry="7" fill="#17152E" opacity="0.10" />

      {/* Confetes festivos coloridos da Figma */}
      <circle cx="150" cy="29" r="5" fill="#C6F432" />
      <circle cx="66" cy="84" r="4.5" fill="#3CC8F0" />
      <rect
        x="55"
        y="48"
        width="10"
        height="10"
        rx="2"
        fill="#FF6B57"
        transform="rotate(30 55 48)"
      />
      <circle cx="188" cy="76" r="4.5" fill="#FF6B57" />
      <circle cx="77" cy="67" r="4" fill="#C6F432" />

      <path
        d="M 54 162 C 44 190, 80 202, 118 202 C 160 202, 182 178, 172 142 C 162 110, 138 106, 118 120"
        fill="none"
        stroke={isWhite ? "#C9C3F2" : "#3420C2"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 54 160 C 44 188, 80 200, 118 200 C 160 200, 182 176, 172 140 C 162 108, 138 104, 118 118"
        fill="none"
        stroke={isWhite ? "#FFFFFF" : "#4F3CF0"}
        strokeWidth="17.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 62 165 C 56 182, 85 192, 118 192 C 150 192, 170 172, 163 145"
        fill="none"
        stroke={isWhite ? "#E9E6FF" : "#8E82FF"}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.45"
      />

      <g transform="rotate(6 142 94)">
        <circle cx="142" cy="94" r="25.5" fill={`url(#${idPrefix}-headGrad)`} />

        <ellipse
          cx="134"
          cy="83"
          rx="9.5"
          ry="4.5"
          fill="#FFFFFF"
          opacity="0.45"
          transform="rotate(-14 134 83)"
        />

        <ellipse cx="130" cy="103" rx="5" ry="3.5" fill="#FF6B57" opacity="0.65" />
        <ellipse cx="154" cy="104" rx="5" ry="3.5" fill="#FF6B57" opacity="0.65" />

        <circle
          cx="134"
          cy="94"
          r="8.5"
          fill="rgba(255, 255, 255, 0.22)"
          stroke="#17152E"
          strokeWidth="2.38"
        />
        <circle
          cx="152"
          cy="95"
          r="8.5"
          fill="rgba(255, 255, 255, 0.22)"
          stroke="#17152E"
          strokeWidth="2.38"
        />

        <path
          d="M 142.5 94.5 Q 143.5 91.5 144.5 94.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />
        <path
          d="M 125.5 93.5 L 120 92.5 M 160.5 95.5 L 166 94.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.11"
          strokeLinecap="round"
        />

        {/* Olhos felizes fechados em arco (^ ^) */}
        <path
          d="M 130 95.5 Q 134 89 138 95.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <path
          d="M 148 96.5 Q 152 90 156 96.5"
          fill="none"
          stroke="#17152E"
          strokeWidth="2.6"
          strokeLinecap="round"
        />

        <path
          d="M 136.5 102.5 Q 142.5 113 148.5 102.5 Z"
          fill="#17152E"
          stroke="#17152E"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path d="M 138.5 106.5 Q 142.5 112.5 146.5 106.5 Z" fill="#FF6B57" />
      </g>
    </g>
  )
}

/**
 * ============================================================================
 * POSE 9: AVATAR · PERFIL CIRCULAR
 * ============================================================================
 */
export function PoseAvatar({
  size = 120,
  className = "",
  idPrefix,
}: {
  size?: number
  className?: string
  idPrefix: string
}) {
  return (
    <div
      className={`relative select-none inline-block rounded-full overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Avatar da Mentorina"
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <radialGradient
            id={`${idPrefix}-avatarGrad`}
            cx="38%"
            cy="32%"
            r="75%"
            fx="38%"
            fy="32%"
          >
            <stop offset="0%" stopColor="#EEFFA8" />
            <stop offset="55%" stopColor="#C6F432" />
            <stop offset="100%" stopColor="#A6D11A" />
          </radialGradient>
        </defs>

        <circle cx="60" cy="60" r="60" fill="#4F3CF0" />

        <path
          d="M 18 116 C 30 92, 90 92, 102 116"
          fill="none"
          stroke="#3420C2"
          strokeWidth="24"
          strokeLinecap="round"
        />
        <path
          d="M 22 116 C 34 96, 86 96, 98 116"
          fill="none"
          stroke="#6A5AF5"
          strokeWidth="16"
          strokeLinecap="round"
        />

        <circle cx="60" cy="52" r="35" fill={`url(#${idPrefix}-avatarGrad)`} />

        <ellipse
          cx="48"
          cy="36"
          rx="14"
          ry="7"
          fill="#FFFFFF"
          opacity="0.45"
          transform="rotate(-20 48 36)"
        />

        <ellipse cx="40" cy="64" rx="7" ry="5" fill="#FF6B57" opacity="0.55" />
        <ellipse cx="80" cy="64" rx="7" ry="5" fill="#FF6B57" opacity="0.55" />

        <circle
          cx="48"
          cy="50"
          r="12"
          fill="rgba(255, 255, 255, 0.22)"
          stroke="#17152E"
          strokeWidth="3.6"
        />
        <circle
          cx="72"
          cy="50"
          r="12"
          fill="rgba(255, 255, 255, 0.22)"
          stroke="#17152E"
          strokeWidth="3.6"
        />

        <path
          d="M 58 49 Q 60 46 62 49"
          fill="none"
          stroke="#17152E"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M 36 50 L 30 49 M 84 50 L 90 49"
          fill="none"
          stroke="#17152E"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        <circle cx="49" cy="50" r="4.8" fill="#17152E" />
        <circle cx="47.5" cy="48" r="1.8" fill="#FFFFFF" />

        <circle cx="73" cy="50" r="4.8" fill="#17152E" />
        <circle cx="71.5" cy="48" r="1.8" fill="#FFFFFF" />

        <path
          d="M 54 66 Q 60 72 66 66"
          fill="none"
          stroke="#17152E"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

/**
 * ============================================================================
 * POSE 10: ESCADARIA (INSTITUCIONAL DOS CARDS DE PASSOS)
 * ============================================================================
 */
export function PoseEscadaria({
  coilColor = "purple",
  mood = "happy",
  idPrefix,
}: {
  coilColor?: "purple" | "white"
  mood?: "happy" | "thinking" | "smart" | "waving" | "joy"
  idPrefix: string
}) {
  const isWhite = coilColor === "white"

  return (
    <g id="pose-escadaria">
      <ellipse cx="96" cy="196" rx="68" ry="6" fill="#17152E" opacity="0.08" />

      {isWhite ? (
        <>
          <path
            d="M 25 188 L 65 188 L 65 151 L 105 151 L 105 113 L 146 113"
            fill="none"
            stroke="#C9C3F2"
            strokeWidth="18.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 25 185 L 65 185 L 65 148 L 105 148 L 105 110 L 146 110"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="17.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 30 180 L 61 180 M 69 143 L 101 143 M 109 105 L 142 105"
            fill="none"
            stroke="#E9E6FF"
            strokeWidth="2.93"
            strokeLinecap="round"
            opacity="0.65"
          />
        </>
      ) : (
        <>
          <path
            d="M 25 188 L 65 188 L 65 151 L 105 151 L 105 113 L 146 113"
            fill="none"
            stroke="#3420C2"
            strokeWidth="17.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 25 185 L 65 185 L 65 148 L 105 148 L 105 110 L 146 110"
            fill="none"
            stroke="#4F3CF0"
            strokeWidth="17.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 30 180 L 61 180 M 69 143 L 101 143 M 109 105 L 142 105"
            fill="none"
            stroke="#8E82FF"
            strokeWidth="2.93"
            strokeLinecap="round"
            opacity="0.55"
          />
        </>
      )}

      {/* Grupo da Cabeça e Expressão (Figma: left: 61.81%, right: 15.15%, top: 35.15%, bottom: 41.81%) */}
      <g id="escadaria-rosto">
        {/* Estrela de brilho coral (#FF6B57) */}
        <path
          d="M 193 56 L 195 61 L 200 63 L 195 65 L 193 70 L 191 65 L 186 63 L 191 61 Z"
          fill="#FF6B57"
          opacity="0.9"
        />

        {/* Cabeça verde com gradiente radial (Figma: radial-gradient(70% 70% at 38% 32%, #E4FF8A 0%, #C6F432 55%, #A3D11A 100%)) */}
        <circle cx="161.3" cy="102.7" r="25.4" fill={`url(#${idPrefix}-headGrad)`} />

        {/* Brilho 3D especular na cabeça (Figma: left 65.05%, top 37.05%, rotate -25deg, opacity 0.55) */}
        <ellipse
          cx="149"
          cy="85"
          rx="9.5"
          ry="4.8"
          fill="#FFFFFF"
          opacity="0.55"
          transform="rotate(-25 149 85)"
        />

        {/* Bochecha esquerda (Figma: left: 63.97%, top: 49.31%, #FF6B57, opacity: 0.65) */}
        <ellipse
          cx="145"
          cy="111"
          rx="4.3"
          ry="2.7"
          fill="#FF6B57"
          opacity={mood === "joy" ? 0.75 : 0.65}
        />

        {/* Bochecha direita (Figma: left: 78.85%, top: 49.31%, #FF6B57, opacity: 0.65) */}
        <ellipse
          cx="177.7"
          cy="111"
          rx="4.3"
          ry="2.7"
          fill="#FF6B57"
          opacity={mood === "joy" ? 0.75 : 0.65}
        />

        {mood === "joy" ? (
          <>
            {/* Lente esquerda dos óculos */}
            <circle
              cx="152.4"
              cy="100.6"
              r="8.5"
              fill="rgba(255, 255, 255, 0.18)"
              stroke="#17152E"
              strokeWidth="2.376"
            />
            {/* Lente direita dos óculos */}
            <circle
              cx="170.3"
              cy="100.6"
              r="8.5"
              fill="rgba(255, 255, 255, 0.18)"
              stroke="#17152E"
              strokeWidth="2.376"
            />

            {/* Ponte dos óculos (Figma: border 2.112px solid #17152E) */}
            <path
              d="M 160.9 99.5 Q 161.4 97 161.8 99.5"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.112"
              strokeLinecap="round"
            />
            {/* Hastes laterais */}
            <path
              d="M 137 99 L 143.9 99.5 M 178.8 99.5 L 185.6 99"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.112"
              strokeLinecap="round"
            />

            {/* Olhos fechados em arco (^ ^) */}
            <path
              d="M 148 101.5 Q 152 95 156 101.5"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.64"
              strokeLinecap="round"
            />
            <path
              d="M 166 101.5 Q 170 95 174 101.5"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.64"
              strokeLinecap="round"
            />

            {/* Sorriso aberto com língua coral */}
            <path
              d="M 155.5 109 Q 161.3 118 167 109 Z"
              fill="#17152E"
              stroke="#17152E"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <path d="M 157.5 112 Q 161.3 117.5 165 112 Z" fill="#FF6B57" />
          </>
        ) : (
          <>
            {/* Base esclera branca dos olhos (Figma: top 43.07%, background #FFFFFF) */}
            <ellipse cx="152.4" cy="100.5" rx="4.8" ry="5.8" fill="#FFFFFF" />
            <ellipse cx="170.3" cy="100.5" rx="4.8" ry="5.8" fill="#FFFFFF" />

            {/* Pupila preta (Figma: top 44.63%, background #17152E) */}
            <circle cx="152.4" cy="101.6" r="3.5" fill="#17152E" />
            <circle cx="170.3" cy="101.6" r="3.5" fill="#17152E" />

            {/* Brilho na pupila (Figma: top 45.03%, background #FFFFFF) */}
            <circle cx="153.7" cy="100.2" r="1.2" fill="#FFFFFF" />
            <circle cx="171.6" cy="100.2" r="1.2" fill="#FFFFFF" />

            {/* Lente esquerda dos óculos (Figma: border 2.376px solid #17152E, bg rgba(255,255,255,0.18)) */}
            <circle
              cx="152.4"
              cy="100.6"
              r="8.5"
              fill="rgba(255, 255, 255, 0.18)"
              stroke="#17152E"
              strokeWidth="2.376"
            />
            {/* Lente direita dos óculos (Figma: border 2.376px solid #17152E, bg rgba(255,255,255,0.18)) */}
            <circle
              cx="170.3"
              cy="100.6"
              r="8.5"
              fill="rgba(255, 255, 255, 0.18)"
              stroke="#17152E"
              strokeWidth="2.376"
            />

            {/* Ponte dos óculos (Figma: left 72.37%, border 2.112px solid #17152E) */}
            <path
              d="M 160.9 99.5 Q 161.4 97 161.8 99.5"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.112"
              strokeLinecap="round"
            />

            {/* Haste esquerda dos óculos (Figma: left 62.29%, border 2.112px solid #17152E) */}
            <path
              d="M 137 99 L 143.9 99.5"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.112"
              strokeLinecap="round"
            />

            {/* Haste direita dos óculos (Figma: left 81.25%, border 2.112px solid #17152E) */}
            <path
              d="M 178.8 99.5 L 185.6 99"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.112"
              strokeLinecap="round"
            />

            {/* Reflexo na lente esquerda (Figma: left 67.33%, opacity 0.8, border 1.584px solid #FFFFFF) */}
            <path
              d="M 148 95.5 C 151 94.2, 154.5 95.5, 156 98"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.584"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Reflexo na lente direita (Figma: left 75.49%, opacity 0.8, border 1.584px solid #FFFFFF) */}
            <path
              d="M 166 95.5 C 169 94.2, 172.5 95.5, 174 98"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1.584"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Sorriso padrão (Figma: left 70.45%, top 50.75%, border 2.64px solid #17152E) */}
            <path
              d="M 156 111.6 Q 161.3 115.5 166.6 111.6"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.64"
              strokeLinecap="round"
            />
          </>
        )}
      </g>
    </g>
  )
}

/**
 * ============================================================================
 * POSE 11: ESPIRAL CLÁSSICA (HERO E TELAS PRINCIPAIS)
 * ============================================================================
 */
export function PoseEspiral({
  coilColor = "purple",
  mood = "happy",
  idPrefix,
}: {
  coilColor?: "purple" | "white"
  mood?: "happy" | "thinking" | "smart" | "waving" | "joy"
  idPrefix: string
}) {
  const isWhite = coilColor === "white"

  return (
    <g id="pose-espiral">
      <ellipse cx="120" cy="216" rx="68" ry="12" fill="#17152E" opacity="0.22" />

      {isWhite ? (
        <>
          <path
            d="M 60 160 C 50 190, 80 205, 120 205 C 170 205, 195 180, 185 140 C 175 105, 140 100, 110 115"
            fill="none"
            stroke="#C9C3F2"
            strokeWidth="22"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 60 160 C 50 190, 80 205, 120 205 C 170 205, 195 180, 185 140 C 175 105, 140 100, 110 115"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M 60 160 C 50 190, 80 205, 120 205 C 170 205, 195 180, 185 140 C 175 105, 140 100, 110 115"
            fill="none"
            stroke="#3420C2"
            strokeWidth="24"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 60 160 C 50 190, 80 205, 120 205 C 170 205, 195 180, 185 140 C 175 105, 140 100, 110 115"
            fill="none"
            stroke="#4F3CF0"
            strokeWidth="20"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 70 165 C 65 185, 90 195, 120 195 C 160 195, 180 175, 172 145"
            fill="none"
            stroke="#C9C3F2"
            strokeWidth="4"
            strokeLinecap="round"
            opacity="0.8"
          />
        </>
      )}

      {/* Brilho estrela verde */}
      <path
        d="M 198 32 L 201 39 L 208 42 L 201 45 L 198 52 L 195 45 L 188 42 L 195 39 Z"
        fill="#C6F432"
        opacity="0.9"
      />

      <circle cx="128" cy="92" r="48" fill={`url(#${idPrefix}-headGrad)`} />

      <ellipse
        cx="110"
        cy="68"
        rx="18"
        ry="9"
        fill="#FFFFFF"
        opacity="0.55"
        transform="rotate(-25 110 68)"
      />

      <ellipse cx="96" cy="112" rx="9" ry="6" fill="#FF6B57" opacity="0.65" />
      <ellipse cx="160" cy="112" rx="9" ry="6" fill="#FF6B57" opacity="0.65" />

      <circle
        cx="108"
        cy="96"
        r="16"
        fill="rgba(255, 255, 255, 0.25)"
        stroke="#17152E"
        strokeWidth="3.5"
      />
      <circle
        cx="148"
        cy="96"
        r="16"
        fill="rgba(255, 255, 255, 0.25)"
        stroke="#17152E"
        strokeWidth="3.5"
      />

      <path
        d="M 124 93 Q 128 88 132 93"
        fill="none"
        stroke="#17152E"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 92 95 L 83 94 M 164 95 L 173 94"
        fill="none"
        stroke="#17152E"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {mood === "thinking" ? (
        <>
          <circle cx="110" cy="92" r="6" fill="#17152E" />
          <circle cx="108" cy="90" r="2.2" fill="#FFFFFF" />
          <circle cx="150" cy="92" r="6" fill="#17152E" />
          <circle cx="148" cy="90" r="2.2" fill="#FFFFFF" />
        </>
      ) : (
        <>
          <circle cx="110" cy="96" r="6.5" fill="#17152E" />
          <circle cx="108" cy="94" r="2.5" fill="#FFFFFF" />
          <circle cx="112" cy="98" r="1.2" fill="#FFFFFF" />

          <circle cx="150" cy="96" r="6.5" fill="#17152E" />
          <circle cx="148" cy="94" r="2.5" fill="#FFFFFF" />
          <circle cx="152" cy="98" r="1.2" fill="#FFFFFF" />
        </>
      )}

      <path
        d="M 122 114 Q 128 122 134 114"
        fill="none"
        stroke="#17152E"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <path d="M 125 116 Q 128 120 131 116 Z" fill="#FF6B57" opacity="0.8" />
    </g>
  )
}

/**
 * ============================================================================
 * COMPONENTE PRINCIPAL: Mascot (Mentorina)
 * ============================================================================
 * Renderizador mestre de poses da Mentorina.
 */
export default function Mascot({
  pose,
  variant,
  size,
  className = "",
  mood = "happy",
  coilColor = "purple",
  ariaLabel,
}: MascotProps) {
  const rawId = useId().replace(/:/g, "")
  const idPrefix = `mascot-${rawId}`

  const activePose = normalizePose(pose ?? variant)

  if (activePose === "avatar") {
    return (
      <PoseAvatar
        size={size ?? 120}
        className={className}
        idPrefix={idPrefix}
      />
    )
  }

  const defaultSize = activePose === "v6" || activePose === "coiled" ? 240 : 220
  const finalSize = size ?? defaultSize
  const viewBox =
    activePose === "v6" || activePose === "coiled"
      ? "0 0 240 240"
      : "0 0 220 220"

  const label =
    ariaLabel ??
    `Mentorina, pose ${MASCOT_POSES[activePose as keyof typeof MASCOT_POSES]?.title ?? activePose}`

  return (
    <div
      className={`relative select-none inline-block shrink-0 ${className}`}
      style={{ width: finalSize, height: finalSize }}
      role="img"
      aria-label={label}
    >
      <svg
        viewBox={viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <MascotDefs idPrefix={idPrefix} />

        {activePose === "acenando" && (
          <PoseAcenando coilColor={coilColor} idPrefix={idPrefix} />
        )}

        {activePose === "pensando" && (
          <PosePensando coilColor={coilColor} idPrefix={idPrefix} />
        )}

        {activePose === "lendo" && (
          <PoseLendo coilColor={coilColor} idPrefix={idPrefix} />
        )}

        {activePose === "pulando" && (
          <PosePulando coilColor={coilColor} idPrefix={idPrefix} />
        )}

        {activePose === "interrogacao" && (
          <PoseInterrogacao coilColor={coilColor} idPrefix={idPrefix} />
        )}

        {activePose === "surpresa" && (
          <PoseSurpresa coilColor={coilColor} idPrefix={idPrefix} />
        )}

        {activePose === "foco" && (
          <PoseFoco coilColor={coilColor} idPrefix={idPrefix} />
        )}

        {activePose === "comemorando" && (
          <PoseComemorando coilColor={coilColor} idPrefix={idPrefix} />
        )}

        {activePose === "stairs" && (
          <PoseEscadaria
            coilColor={coilColor}
            mood={mood}
            idPrefix={idPrefix}
          />
        )}

        {(activePose === "coiled" || activePose === "v6") && (
          <PoseEspiral
            coilColor={coilColor}
            mood={mood}
            idPrefix={idPrefix}
          />
        )}
      </svg>
    </div>
  )
}

/**
 * ============================================================================
 * COMPONENTE INTERATIVO: MascotMorpher
 * ============================================================================
 * Alternador animado de poses com transição suave, autoplay e seletor.
 */
export function MascotMorpher({
  size = 220,
  className = "",
  autoPlay = true,
  intervalMs = 3500,
  poses = [
    "acenando",
    "pensando",
    "lendo",
    "pulando",
    "interrogacao",
    "surpresa",
    "foco",
    "comemorando",
  ],
  coilColor = "purple",
}: MascotMorpherProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!autoPlay || poses.length <= 1) return

    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % poses.length)
        setIsTransitioning(false)
      }, 200)
    }, intervalMs)

    return () => clearInterval(timer)
  }, [autoPlay, intervalMs, poses.length])

  function handleNext() {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % poses.length)
      setIsTransitioning(false)
    }, 180)
  }

  const currentPose = poses[currentIndex]
  const currentMeta = MASCOT_POSES[currentPose as keyof typeof MASCOT_POSES]

  return (
    <div
      className={`relative select-none flex flex-col items-center justify-center cursor-pointer group ${className}`}
      onClick={handleNext}
      title="Clique para alternar a pose da Mentorina!"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleNext()
        }
      }}
      aria-label={`Mentorina pose ${currentMeta?.title ?? currentPose} - Clique para mudar a pose`}
    >
      <div
        className={`transition-all duration-300 ease-out transform ${isTransitioning
          ? "opacity-0 scale-90 rotate-2"
          : "opacity-100 scale-100 rotate-0"
          } group-hover:scale-105 active:scale-95`}
      >
        <Mascot pose={currentPose} size={size} coilColor={coilColor} />
      </div>

      {/* Indicadores sutis de pose */}
      <div className="flex items-center gap-1.5 mt-2 opacity-60 group-hover:opacity-100 transition-opacity">
        {poses.map((poseItem, index) => (
          <button
            key={poseItem}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentIndex(index)
                setIsTransitioning(false)
              }, 180)
            }}
            className={`transition-all rounded-full ${currentIndex === index
              ? "w-4 h-1.5 bg-[#C6F432]"
              : "w-1.5 h-1.5 bg-black/20 hover:bg-black/50"
              }`}
            aria-label={`Ver pose ${poseItem}`}
          />
        ))}
      </div>
    </div>
  )
}

// Subcomponentes diretos anexados ao objeto Mascot
Mascot.Acenando = function MascotAcenando(
  props: Omit<MascotProps, "pose" | "variant">,
) {
  return <Mascot {...props} pose="acenando" />
}

Mascot.Pensando = function MascotPensando(
  props: Omit<MascotProps, "pose" | "variant">,
) {
  return <Mascot {...props} pose="pensando" />
}

Mascot.Lendo = function MascotLendo(
  props: Omit<MascotProps, "pose" | "variant">,
) {
  return <Mascot {...props} pose="lendo" />
}

Mascot.Pulando = function MascotPulando(
  props: Omit<MascotProps, "pose" | "variant">,
) {
  return <Mascot {...props} pose="pulando" />
}

Mascot.Interrogacao = function MascotInterrogacao(
  props: Omit<MascotProps, "pose" | "variant">,
) {
  return <Mascot {...props} pose="interrogacao" />
}

Mascot.Surpresa = function MascotSurpresa(
  props: Omit<MascotProps, "pose" | "variant">,
) {
  return <Mascot {...props} pose="surpresa" />
}

Mascot.Foco = function MascotFoco(
  props: Omit<MascotProps, "pose" | "variant">,
) {
  return <Mascot {...props} pose="foco" />
}

Mascot.Comemorando = function MascotComemorando(
  props: Omit<MascotProps, "pose" | "variant">,
) {
  return <Mascot {...props} pose="comemorando" />
}

Mascot.Avatar = function MascotAvatar(
  props: Omit<MascotProps, "pose" | "variant">,
) {
  return <Mascot {...props} pose="avatar" />
}

Mascot.Escadaria = function MascotEscadaria(
  props: Omit<MascotProps, "pose" | "variant">,
) {
  return <Mascot {...props} pose="stairs" />
}

Mascot.Espiral = function MascotEspiral(
  props: Omit<MascotProps, "pose" | "variant">,
) {
  return <Mascot {...props} pose="coiled" />
}

Mascot.Morpher = MascotMorpher

// Alias para retrocompatibilidade
export const MascotMinhoquinha = Mascot
