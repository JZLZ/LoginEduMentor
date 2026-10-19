import { useState, useEffect } from "react"

interface MascotMorpherProps {
  size?: number
  className?: string
  autoPlay?: boolean
  intervalMs?: number
}

export default function MascotMorpher({
  size = 230,
  className = "",
  autoPlay = true,
  intervalMs = 3000,
}: MascotMorpherProps) {
  const [currentVersion, setCurrentVersion] = useState<number>(6) // Começa na v6 oficial
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentVersion((prev) => (prev % 6) + 1)
        setIsTransitioning(false)
      }, 250)
    }, intervalMs)

    return () => clearInterval(timer)
  }, [autoPlay, intervalMs])

  function handleNext() {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentVersion((prev) => (prev % 6) + 1)
      setIsTransitioning(false)
    }, 200)
  }

  const versionNames = [
    "v1 · Robô Clássico",
    "v2 · Traço Costurado",
    "v3 · Estelar & Pesponto",
    "v4 · Dupla Espiral",
    "v5 · Festa & Confetes",
    "v6 · Oficial 2026",
  ]

  return (
    <div
      className={`relative select-none flex flex-col items-center justify-center cursor-pointer group ${className}`}
      onClick={handleNext}
      title="Clique para mudar a forma da Mentorina!"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          handleNext()
        }
      }}
      aria-label={`Mentorina ${versionNames[currentVersion - 1]} - Clique para mudar a forma`}
    >
      {/* Container da mascote com transição suave de escala e opacidade */}
      <div
        className={`transition-all duration-300 ease-out transform ${
          isTransitioning
            ? "opacity-0 scale-90 rotate-3"
            : "opacity-100 scale-100 rotate-0"
        } group-hover:scale-105 active:scale-95`}
        style={{ width: size, height: size }}
      >
        {/* Renderiza a versão ativa de acordo com o CSS do Figma */}
        {currentVersion === 1 && <MascotV1 />}
        {currentVersion === 2 && <MascotV2 />}
        {currentVersion === 3 && <MascotV3 />}
        {currentVersion === 4 && <MascotV4 />}
        {currentVersion === 5 && <MascotV5 />}
        {currentVersion === 6 && <MascotV6 />}
      </div>

      {/* Indicadores sutis de versão (dots) */}
      <div className="flex items-center gap-1.5 mt-1 pt-1 opacity-60 group-hover:opacity-100 transition-opacity">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <button
            key={num}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsTransitioning(true)
              setTimeout(() => {
                setCurrentVersion(num)
                setIsTransitioning(false)
              }, 200)
            }}
            className={`transition-all rounded-full ${
              currentVersion === num
                ? "w-4 h-1.5 bg-[#C6F432]"
                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
            }`}
            aria-label={`Ver ${versionNames[num - 1]}`}
          />
        ))}
      </div>
    </div>
  )
}

/* =========================================================================
   VERSÃO 1: Mentorina (mascote v1, robô)
   ========================================================================= */
function MascotV1() {
  return (
    <svg
      viewBox="0 0 230 230"
      fill="none"
      className="w-full h-full drop-shadow-lg"
    >
      {/* Partículas comemorativas da v1 */}
      <rect
        x="18"
        y="40"
        width="12"
        height="12"
        rx="3"
        fill="#C6F432"
        transform="rotate(-20 18 40)"
      />
      <rect
        x="195"
        y="60"
        width="12"
        height="12"
        rx="3"
        fill="#FF6B57"
        transform="rotate(25 195 60)"
      />
      <circle cx="28" cy="85" r="5" fill="#3CC8F0" />
      <circle cx="205" cy="110" r="6" fill="#C6F432" />

      {/* Orelhas / Antenas laterais do robô (border 10px #4F3CF0) */}
      <circle
        cx="46"
        cy="115"
        r="16"
        fill="#3420C2"
        stroke="#4F3CF0"
        strokeWidth="8"
      />
      <circle
        cx="184"
        cy="115"
        r="16"
        fill="#3420C2"
        stroke="#4F3CF0"
        strokeWidth="8"
      />

      {/* Cabeça cúbica / arredondada roxa */}
      <rect x="52" y="70" width="126" height="110" rx="36" fill="#4F3CF0" />

      {/* Brilho superior translúcido */}
      <rect
        x="66"
        y="80"
        width="98"
        height="24"
        rx="10"
        fill="#FFFFFF"
        opacity="0.18"
      />

      {/* Estrela brilhante no topo direito da cabeça */}
      <path
        d="M 160 48 L 163 56 L 171 59 L 163 62 L 160 70 L 157 62 L 149 59 L 157 56 Z"
        fill="#C6F432"
      />

      {/* Bochechas coradas */}
      <ellipse cx="76" cy="135" rx="9" ry="5.5" fill="#FF6B57" opacity="0.55" />
      <ellipse
        cx="154"
        cy="135"
        rx="9"
        ry="5.5"
        fill="#FF6B57"
        opacity="0.55"
      />

      {/* Olhos redondos de robô com borda branca grossa */}
      <circle cx="88" cy="115" r="14" fill="#FFFFFF" />
      <circle cx="89" cy="115" r="8" fill="#17152E" />
      <circle cx="86" cy="112" r="3" fill="#FFFFFF" />

      <circle cx="142" cy="115" r="14" fill="#FFFFFF" />
      <circle cx="141" cy="115" r="8" fill="#17152E" />
      <circle cx="138" cy="112" r="3" fill="#FFFFFF" />

      {/* Sorriso com língua */}
      <path
        d="M 103 138 Q 115 150 127 138"
        fill="none"
        stroke="#17152E"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path d="M 110 142 Q 115 147 120 142 Z" fill="#FF6B57" />
    </svg>
  )
}

/* =========================================================================
   VERSÃO 2: Minhoquinha v2 (costura branca e pesponto)
   ========================================================================= */
function MascotV2() {
  return (
    <svg
      viewBox="0 0 230 230"
      fill="none"
      className="w-full h-full drop-shadow-lg"
    >
      <defs>
        <radialGradient id="gradV2" cx="38%" cy="32%" r="70%" fx="38%" fy="32%">
          <stop offset="0%" stopColor="#E4FF8A" />
          <stop offset="55%" stopColor="#C6F432" />
          <stop offset="100%" stopColor="#A3D11A" />
        </radialGradient>
      </defs>

      {/* Partículas comemorativas da v2 */}
      <rect
        x="25"
        y="35"
        width="11"
        height="11"
        rx="2"
        fill="#C6F432"
        transform="rotate(-20 25 35)"
      />
      <rect
        x="185"
        y="45"
        width="11"
        height="11"
        rx="2"
        fill="#FF6B57"
        transform="rotate(25 185 45)"
      />
      <circle cx="56" cy="80" r="5" fill="#3CC8F0" />
      <circle cx="190" cy="110" r="5" fill="#FF6B57" />
      <rect
        x="88"
        y="24"
        width="9"
        height="9"
        rx="2"
        fill="#3CC8F0"
        transform="rotate(30 88 24)"
      />

      {/* Corpo com traço branco sólido grosso (border 24.9px solid #FFFFFF) */}
      <path
        d="M 52 165 C 40 195, 75 210, 115 210 C 165 210, 190 185, 180 145 C 170 110, 140 105, 115 120"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="24.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pesponto tracejado em lavanda (border 24.9px dashed #E9E6FF, opacity 0.5) */}
      <path
        d="M 52 165 C 40 195, 75 210, 115 210 C 165 210, 190 185, 180 145 C 170 110, 140 105, 115 120"
        fill="none"
        stroke="#E9E6FF"
        strokeWidth="15"
        strokeDasharray="10 8"
        strokeLinecap="round"
        opacity="0.65"
      />

      {/* Cabeça verde com gradiente radial */}
      <circle cx="132" cy="95" r="44" fill="url(#gradV2)" />

      {/* Brilho estrela no topo */}
      <path
        d="M 165 25 L 167 32 L 174 34 L 167 36 L 165 43 L 163 36 L 156 34 L 163 32 Z"
        fill="#C6F432"
      />

      {/* Bochechas */}
      <ellipse
        cx="102"
        cy="115"
        rx="8.5"
        ry="5.5"
        fill="#FF6B57"
        opacity="0.6"
      />
      <ellipse
        cx="162"
        cy="115"
        rx="8.5"
        ry="5.5"
        fill="#FF6B57"
        opacity="0.6"
      />

      {/* Óculos intelectuais com traço 3.3px */}
      <circle
        cx="114"
        cy="98"
        r="14"
        fill="rgba(255,255,255,0.2)"
        stroke="#17152E"
        strokeWidth="3.3"
      />
      <circle
        cx="150"
        cy="98"
        r="14"
        fill="rgba(255,255,255,0.2)"
        stroke="#17152E"
        strokeWidth="3.3"
      />
      <path
        d="M 128 96 Q 132 92 136 96"
        fill="none"
        stroke="#17152E"
        strokeWidth="3.3"
        strokeLinecap="round"
      />

      {/* Olhos e pupilas */}
      <circle cx="115" cy="98" r="5.5" fill="#17152E" />
      <circle cx="113" cy="96" r="2" fill="#FFFFFF" />
      <circle cx="151" cy="98" r="5.5" fill="#17152E" />
      <circle cx="149" cy="96" r="2" fill="#FFFFFF" />

      {/* Sorriso e língua */}
      <path
        d="M 124 116 Q 132 124 140 116"
        fill="none"
        stroke="#17152E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M 128 119 Q 132 123 136 119 Z" fill="#FF6B57" />
    </svg>
  )
}

/* =========================================================================
   VERSÃO 3: Minhoquinha v3 (estrelar com cauda e pesponto grosso)
   ========================================================================= */
function MascotV3() {
  return (
    <svg
      viewBox="0 0 230 230"
      fill="none"
      className="w-full h-full drop-shadow-lg"
    >
      <defs>
        <radialGradient id="gradV3" cx="38%" cy="32%" r="70%" fx="38%" fy="32%">
          <stop offset="0%" stopColor="#E4FF8A" />
          <stop offset="55%" stopColor="#C6F432" />
          <stop offset="100%" stopColor="#A3D11A" />
        </radialGradient>
      </defs>

      {/* Sombra suave no chão */}
      <ellipse cx="115" cy="216" rx="60" ry="8" fill="#000000" opacity="0.25" />

      {/* Partículas flutuantes */}
      <rect
        x="25"
        y="35"
        width="11"
        height="11"
        rx="2"
        fill="#C6F432"
        transform="rotate(-20 25 35)"
      />
      <rect
        x="186"
        y="47"
        width="11"
        height="11"
        rx="2"
        fill="#FF6B57"
        transform="rotate(25 186 47)"
      />
      <circle cx="56" cy="82" r="5" fill="#3CC8F0" />
      <circle cx="190" cy="112" r="5" fill="#FF6B57" />
      <circle cx="180" cy="24" r="6" fill="#C6F432" />

      {/* Detalhe da cauda com volta extra (border 16.8px solid #FFFFFF) */}
      <circle
        cx="34"
        cy="188"
        r="12"
        stroke="#FFFFFF"
        strokeWidth="16.8"
        fill="none"
      />

      {/* Corpo principal grosso (border 29.1px solid #FFFFFF) */}
      <path
        d="M 52 165 C 40 195, 75 210, 115 210 C 165 210, 190 185, 180 145 C 170 110, 140 105, 115 120"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="29.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Pesponto tracejado lavanda (border 29.1px dashed #D9D6EE) */}
      <path
        d="M 52 165 C 40 195, 75 210, 115 210 C 165 210, 190 185, 180 145 C 170 110, 140 105, 115 120"
        fill="none"
        stroke="#D9D6EE"
        strokeWidth="16"
        strokeDasharray="11 9"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Estrela brilhante destacada com borda branca */}
      <path
        d="M 160 18 L 163 26 L 171 28 L 163 31 L 160 39 L 157 31 L 149 28 L 157 26 Z"
        fill="#C6F432"
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />

      {/* Cabeça verde */}
      <circle cx="130" cy="92" r="46" fill="url(#gradV3)" />

      {/* Brilho 3D especular inclinado */}
      <ellipse
        cx="112"
        cy="70"
        rx="16"
        ry="8"
        fill="#FFFFFF"
        opacity="0.55"
        transform="rotate(-25 112 70)"
      />

      {/* Bochechas */}
      <ellipse cx="98" cy="112" rx="9" ry="6" fill="#FF6B57" opacity="0.65" />
      <ellipse cx="162" cy="112" rx="9" ry="6" fill="#FF6B57" opacity="0.65" />

      {/* Óculos com traço 3.83px */}
      <circle
        cx="112"
        cy="96"
        r="15"
        fill="rgba(255,255,255,0.2)"
        stroke="#17152E"
        strokeWidth="3.83"
      />
      <circle
        cx="150"
        cy="96"
        r="15"
        fill="rgba(255,255,255,0.2)"
        stroke="#17152E"
        strokeWidth="3.83"
      />
      <path
        d="M 127 94 Q 131 90 135 94"
        fill="none"
        stroke="#17152E"
        strokeWidth="3.83"
        strokeLinecap="round"
      />

      {/* Olhos e pupilas */}
      <circle cx="113" cy="96" r="6" fill="#17152E" />
      <circle cx="111" cy="94" r="2.2" fill="#FFFFFF" />
      <circle cx="151" cy="96" r="6" fill="#17152E" />
      <circle cx="149" cy="94" r="2.2" fill="#FFFFFF" />

      {/* Sorriso e língua */}
      <path
        d="M 122 114 Q 131 123 140 114"
        fill="none"
        stroke="#17152E"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path d="M 127 117 Q 131 122 135 117 Z" fill="#FF6B57" />
    </svg>
  )
}

/* =========================================================================
   VERSÃO 4: Minhoquinha v4 (duplo anel lilás sólido e óculos de reflexo duplo)
   ========================================================================= */
function MascotV4() {
  return (
    <svg
      viewBox="0 0 230 230"
      fill="none"
      className="w-full h-full drop-shadow-lg"
    >
      <defs>
        <radialGradient id="gradV4" cx="38%" cy="32%" r="70%" fx="38%" fy="32%">
          <stop offset="0%" stopColor="#E4FF8A" />
          <stop offset="55%" stopColor="#C6F432" />
          <stop offset="100%" stopColor="#A3D11A" />
        </radialGradient>
      </defs>

      {/* Sombra base */}
      <ellipse cx="115" cy="216" rx="60" ry="8" fill="#000000" opacity="0.25" />

      {/* Partículas */}
      <rect
        x="25"
        y="35"
        width="11"
        height="11"
        rx="2"
        fill="#C6F432"
        transform="rotate(-20 25 35)"
      />
      <rect
        x="186"
        y="47"
        width="11"
        height="11"
        rx="2"
        fill="#FF6B57"
        transform="rotate(25 186 47)"
      />
      <circle cx="56" cy="82" r="5" fill="#3CC8F0" />
      <circle cx="190" cy="112" r="5" fill="#FF6B57" />
      <circle cx="180" cy="24" r="6" fill="#C6F432" />

      {/* Anel externo lavanda grosso (border 29.1px solid #C9C3F2) */}
      <path
        d="M 52 165 C 40 195, 75 210, 115 210 C 165 210, 190 185, 180 145 C 170 110, 140 105, 115 120"
        fill="none"
        stroke="#C9C3F2"
        strokeWidth="29.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Anel interno branco grosso (border 29.1px solid #FFFFFF) */}
      <path
        d="M 52 165 C 40 195, 75 210, 115 210 C 165 210, 190 185, 180 145 C 170 110, 140 105, 115 120"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Estrela brilhante */}
      <path
        d="M 160 18 L 163 26 L 171 28 L 163 31 L 160 39 L 157 31 L 149 28 L 157 26 Z"
        fill="#C6F432"
        stroke="#FFFFFF"
        strokeWidth="2.5"
      />

      {/* Cabeça verde */}
      <circle cx="130" cy="92" r="46" fill="url(#gradV4)" />

      {/* Brilho 3D */}
      <ellipse
        cx="112"
        cy="70"
        rx="16"
        ry="8"
        fill="#FFFFFF"
        opacity="0.55"
        transform="rotate(-25 112 70)"
      />

      {/* Bochechas */}
      <ellipse cx="98" cy="112" rx="9" ry="6" fill="#FF6B57" opacity="0.65" />
      <ellipse cx="162" cy="112" rx="9" ry="6" fill="#FF6B57" opacity="0.65" />

      {/* Óculos intelectuais com lentes translúcidas e anel duplo de reflexo */}
      <circle
        cx="112"
        cy="96"
        r="16"
        fill="rgba(255,255,255,0.18)"
        stroke="#17152E"
        strokeWidth="3.45"
      />
      <circle
        cx="150"
        cy="96"
        r="16"
        fill="rgba(255,255,255,0.18)"
        stroke="#17152E"
        strokeWidth="3.45"
      />
      <circle
        cx="112"
        cy="96"
        r="11"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.3"
        opacity="0.8"
      />
      <circle
        cx="150"
        cy="96"
        r="11"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="2.3"
        opacity="0.8"
      />
      <path
        d="M 128 94 Q 131 90 134 94"
        fill="none"
        stroke="#17152E"
        strokeWidth="3.07"
        strokeLinecap="round"
      />

      {/* Olhos e pupilas */}
      <circle cx="113" cy="96" r="6" fill="#17152E" />
      <circle cx="111" cy="94" r="2.2" fill="#FFFFFF" />
      <circle cx="151" cy="96" r="6" fill="#17152E" />
      <circle cx="149" cy="94" r="2.2" fill="#FFFFFF" />

      {/* Sorriso e língua */}
      <path
        d="M 122 114 Q 131 123 140 114"
        fill="none"
        stroke="#17152E"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path d="M 127 117 Q 131 122 135 117 Z" fill="#FF6B57" />
    </svg>
  )
}

/* =========================================================================
   VERSÃO 5: Minhoquinha v5 (festa, partículas e expressão alegre)
   ========================================================================= */
function MascotV5() {
  return (
    <svg
      viewBox="0 0 230 230"
      fill="none"
      className="w-full h-full drop-shadow-lg"
    >
      <defs>
        <radialGradient id="gradV5" cx="38%" cy="32%" r="70%" fx="38%" fy="32%">
          <stop offset="0%" stopColor="#E4FF8A" />
          <stop offset="55%" stopColor="#C6F432" />
          <stop offset="100%" stopColor="#A3D11A" />
        </radialGradient>
      </defs>

      {/* Sombra base */}
      <ellipse cx="115" cy="216" rx="60" ry="8" fill="#000000" opacity="0.25" />

      {/* Mais partículas em festa! */}
      <rect
        x="25"
        y="35"
        width="12"
        height="12"
        rx="3"
        fill="#C6F432"
        transform="rotate(-20 25 35)"
      />
      <rect
        x="186"
        y="47"
        width="12"
        height="12"
        rx="3"
        fill="#FF6B57"
        transform="rotate(25 186 47)"
      />
      <circle cx="56" cy="82" r="6" fill="#3CC8F0" />
      <circle cx="190" cy="112" r="6" fill="#FF6B57" />
      <rect
        x="178"
        y="20"
        width="10"
        height="10"
        rx="2"
        fill="#3CC8F0"
        transform="rotate(15 178 20)"
      />
      <circle cx="38" cy="130" r="4" fill="#C6F432" />

      {/* Espiral dupla sólida */}
      <path
        d="M 52 165 C 40 195, 75 210, 115 210 C 165 210, 190 185, 180 145 C 170 110, 140 105, 115 120"
        fill="none"
        stroke="#C9C3F2"
        strokeWidth="29.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 52 165 C 40 195, 75 210, 115 210 C 165 210, 190 185, 180 145 C 170 110, 140 105, 115 120"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="21"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Cabeça verde */}
      <circle cx="130" cy="92" r="46" fill="url(#gradV5)" />

      {/* Brilho 3D */}
      <ellipse
        cx="112"
        cy="70"
        rx="16"
        ry="8"
        fill="#FFFFFF"
        opacity="0.55"
        transform="rotate(-25 112 70)"
      />

      {/* Bochechas bem rosadas */}
      <ellipse cx="96" cy="112" rx="10" ry="7" fill="#FF6B57" opacity="0.75" />
      <ellipse cx="164" cy="112" rx="10" ry="7" fill="#FF6B57" opacity="0.75" />

      {/* Óculos com olhos sorridentes piscando (^ ^) */}
      <circle
        cx="112"
        cy="96"
        r="16"
        fill="rgba(255,255,255,0.2)"
        stroke="#17152E"
        strokeWidth="3.45"
      />
      <circle
        cx="150"
        cy="96"
        r="16"
        fill="rgba(255,255,255,0.2)"
        stroke="#17152E"
        strokeWidth="3.45"
      />
      <path
        d="M 128 94 Q 131 90 134 94"
        fill="none"
        stroke="#17152E"
        strokeWidth="3.07"
        strokeLinecap="round"
      />

      {/* Olhos em formato de arco de alegria (^ ^) */}
      <path
        d="M 104 98 Q 112 88 120 98"
        fill="none"
        stroke="#17152E"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 142 98 Q 150 88 158 98"
        fill="none"
        stroke="#17152E"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Sorriso aberto bem feliz */}
      <path
        d="M 120 112 Q 131 128 142 112 Z"
        fill="#FF6B57"
        stroke="#17152E"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* =========================================================================
   VERSÃO 6: Minhoquinha v6 (oficial refinada)
   ========================================================================= */
function MascotV6() {
  return (
    <svg
      viewBox="0 0 230 230"
      fill="none"
      className="w-full h-full drop-shadow-lg"
    >
      <defs>
        <radialGradient id="gradV6" cx="38%" cy="32%" r="70%" fx="38%" fy="32%">
          <stop offset="0%" stopColor="#E4FF8A" />
          <stop offset="55%" stopColor="#C6F432" />
          <stop offset="100%" stopColor="#A3D11A" />
        </radialGradient>
      </defs>

      {/* Sombra base */}
      <ellipse cx="115" cy="216" rx="60" ry="8" fill="#000000" opacity="0.25" />

      {/* Partículas comemorativas da v6 do CSS */}
      <rect
        x="26"
        y="38"
        width="10"
        height="10"
        rx="2"
        fill="#C6F432"
        transform="rotate(-20 26 38)"
      />
      <rect
        x="184"
        y="52"
        width="10"
        height="10"
        rx="2"
        fill="#FF6B57"
        transform="rotate(25 184 52)"
      />
      <circle cx="60" cy="86" r="4.5" fill="#3CC8F0" />
      <circle cx="190" cy="110" r="5" fill="#FF6B57" />
      <circle cx="176" cy="27" r="5" fill="#3CC8F0" />

      {/* Espiral refinada (border 18.4px solid #C9C3F2 e #FFFFFF) */}
      <path
        d="M 52 165 C 40 195, 75 210, 115 210 C 165 210, 190 185, 180 145 C 170 110, 140 105, 115 120"
        fill="none"
        stroke="#C9C3F2"
        strokeWidth="18.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 52 165 C 40 195, 75 210, 115 210 C 165 210, 190 185, 180 145 C 170 110, 140 105, 115 120"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Detalhe coral na cauda (Figma CSS: top 12.17%, background #FF6B57) */}
      <circle cx="50" cy="162" r="7" fill="#FF6B57" />

      {/* Cabeça verde */}
      <circle cx="130" cy="92" r="46" fill="url(#gradV6)" />

      {/* Brilho 3D */}
      <ellipse
        cx="112"
        cy="70"
        rx="15"
        ry="7.5"
        fill="#FFFFFF"
        opacity="0.55"
        transform="rotate(-25 112 70)"
      />

      {/* Bochechas */}
      <ellipse cx="98" cy="112" rx="9" ry="6" fill="#FF6B57" opacity="0.65" />
      <ellipse cx="162" cy="112" rx="9" ry="6" fill="#FF6B57" opacity="0.65" />

      {/* Óculos intelectuais refinados (border 2.484px solid #17152E) */}
      <circle
        cx="112"
        cy="96"
        r="15"
        fill="rgba(255,255,255,0.18)"
        stroke="#17152E"
        strokeWidth="2.48"
      />
      <circle
        cx="150"
        cy="96"
        r="15"
        fill="rgba(255,255,255,0.18)"
        stroke="#17152E"
        strokeWidth="2.48"
      />
      {/* Reflexos brancos de lente (border 1.656px solid #FFFFFF) */}
      <circle
        cx="112"
        cy="96"
        r="10.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.66"
        opacity="0.8"
      />
      <circle
        cx="150"
        cy="96"
        r="10.5"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.66"
        opacity="0.8"
      />
      <path
        d="M 127 94 Q 131 90 135 94"
        fill="none"
        stroke="#17152E"
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Olhos e pupilas */}
      <circle cx="113" cy="96" r="5.5" fill="#17152E" />
      <circle cx="111" cy="94" r="2" fill="#FFFFFF" />
      <circle cx="151" cy="96" r="5.5" fill="#17152E" />
      <circle cx="149" cy="94" r="2" fill="#FFFFFF" />

      {/* Sorriso e língua */}
      <path
        d="M 122 114 Q 131 123 140 114"
        fill="none"
        stroke="#17152E"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path d="M 127 117 Q 131 122 135 117 Z" fill="#FF6B57" />
    </svg>
  )
}
