interface MascotProps {
  size?: number
  className?: string
  mood?: "happy" | "thinking" | "smart" | "waving" | "joy"
  variant?: "stairs" | "coiled" | "avatar" | "question" | "soundwave" | "v6"
  coilColor?: "purple" | "white"
}

export default function MascotMinhoquinha({
  size = 200,
  className = "",
  mood = "happy",
  variant = "stairs",
  coilColor = "purple",
}: MascotProps) {
  if (variant === "v6") {
    return (
      <div
        className={`relative select-none shrink-0 ${className}`}
        style={{
          width: size,
          height: size,
          order: 7,
          zIndex: 7,
        }}
        role="img"
        aria-label="Mentorina, Minhoquinha v6"
      >
        {/* Sombra base (Vector - left: 4.67%, right: 31.33%, top: 92.33%, bottom: 3%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "4.67%",
            right: "31.33%",
            top: "92.33%",
            bottom: "3%",
            background: "#000000",
            opacity: 0.25,
          }}
        />

        {/* Partícula Verde (Vector - left: 12.52%, right: 84.14%, top: 16.26%, bottom: 78.08%) */}
        <div
          className="absolute rounded-[2px] pointer-events-none"
          style={{
            left: "12.52%",
            right: "84.14%",
            top: "16.26%",
            bottom: "78.08%",
            background: "#C6F432",
            transform: "rotate(-20deg)",
          }}
        />

        {/* Partícula Coral 1 (Vector - left: 81.55%, right: 15.11%, top: 22.88%, bottom: 71.45%) */}
        <div
          className="absolute rounded-[2px] pointer-events-none"
          style={{
            left: "81.55%",
            right: "15.11%",
            top: "22.88%",
            bottom: "71.45%",
            background: "#FF6B57",
            transform: "rotate(25deg)",
          }}
        />

        {/* Partícula Azul 1 (Vector - left: 26%, right: 70%, top: 37.33%, bottom: 58.67%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "26%",
            right: "70%",
            top: "37.33%",
            bottom: "58.67%",
            background: "#3CC8F0",
          }}
        />

        {/* Partícula Coral 2 (Vector - left: 83.33%, right: 12.67%, top: 48%, bottom: 48%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "83.33%",
            right: "12.67%",
            top: "48%",
            bottom: "48%",
            background: "#FF6B57",
          }}
        />

        {/* Partícula Azul 2 (Vector - left: 77%, right: 19.67%, top: 11.67%, bottom: 85%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "77%",
            right: "19.67%",
            top: "11.67%",
            bottom: "85%",
            background: "#3CC8F0",
          }}
        />

        {/* Detalhe coral de adorno (Vector - left: 40.87%, right: 53.04%, top: 12.17%, bottom: 81.74%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "40.87%",
            right: "53.04%",
            top: "12.17%",
            bottom: "81.74%",
            background: "#FF6B57",
          }}
        />

        {/* SVG para o Corpo Espiral curvado (Vectors em 10% / 38.67% / 41.33% com borda 18.4px) */}
        <svg
          viewBox="0 0 230 230"
          fill="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {/* Vector sombra lavanda (border: 18.4px solid #C9C3F2, top: 42.67%) */}
          <path
            d="M 50 165 C 38 195, 75 208, 115 208 C 165 208, 188 183, 178 145 C 168 112, 140 108, 115 122"
            fill="none"
            stroke="#C9C3F2"
            strokeWidth="18.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Vector corpo branco (border: 18.4px solid #FFFFFF, top: 41.33%) */}
          <path
            d="M 50 162 C 38 192, 75 205, 115 205 C 165 205, 188 180, 178 142 C 168 109, 140 105, 115 119"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="18.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Grupo da Cabeça (Group/Vector - left: 50.48%, right: 26.48%, top: 21.15%, bottom: 55.81%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "50.48%",
            right: "26.48%",
            top: "21.15%",
            bottom: "55.81%",
            background:
              "radial-gradient(70% 70% at 38% 32%, #E4FF8A 0%, #C6F432 55%, #A3D11A 100%)",
          }}
        />

        {/* Brilho na cabeça (Vector - left: 53.72%, right: 41%, top: 23.05%, bottom: 74.07%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "53.72%",
            right: "41%",
            top: "23.05%",
            bottom: "74.07%",
            background: "#FFFFFF",
            opacity: 0.55,
            transform: "rotate(-25deg)",
          }}
        />

        {/* Bochecha esquerda (Vector - left: 52.64%, right: 43.52%, top: 35.31%, bottom: 62.29%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "52.64%",
            right: "43.52%",
            top: "35.31%",
            bottom: "62.29%",
            background: "#FF6B57",
            opacity: 0.65,
          }}
        />

        {/* Bochecha direita (Vector - left: 67.52%, right: 28.64%, top: 35.31%, bottom: 62.29%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "67.52%",
            right: "28.64%",
            top: "35.31%",
            bottom: "62.29%",
            background: "#FF6B57",
            opacity: 0.65,
          }}
        />

        {/* Lente esquerda dos óculos (Vector - left: 54.08%, right: 38.24%, top: 27.87%, bottom: 64.45%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "54.08%",
            right: "38.24%",
            top: "27.87%",
            bottom: "64.45%",
            background: "rgba(255, 255, 255, 0.18)",
            border: "2.484px solid #17152E",
          }}
        />

        {/* Lente direita dos óculos (Vector - left: 62.24%, right: 30.08%, top: 27.87%, bottom: 64.45%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "62.24%",
            right: "30.08%",
            top: "27.87%",
            bottom: "64.45%",
            background: "rgba(255, 255, 255, 0.18)",
            border: "2.484px solid #17152E",
          }}
        />

        {/* Olho esquerdo (Vector - left: 56%, right: 40.16%, top: 31.35%, bottom: 67.33%) */}
        <div
          className="absolute rounded-full pointer-events-none bg-[#17152E]"
          style={{
            left: "56%",
            right: "40.16%",
            top: "31.35%",
            bottom: "67.33%",
            border: "2.484px solid #17152E",
          }}
        >
          <span className="absolute left-[20%] top-[20%] w-[35%] h-[35%] bg-white rounded-full" />
        </div>

        {/* Olho direito (Vector - left: 64.16%, right: 32%, top: 31.35%, bottom: 67.33%) */}
        <div
          className="absolute rounded-full pointer-events-none bg-[#17152E]"
          style={{
            left: "64.16%",
            right: "32%",
            top: "31.35%",
            bottom: "67.33%",
            border: "2.484px solid #17152E",
          }}
        >
          <span className="absolute left-[20%] top-[20%] w-[35%] h-[35%] bg-white rounded-full" />
        </div>

        {/* Ponte dos óculos (Vector - left: 61.04%, right: 37.04%, top: 30.51%, bottom: 69.01%) */}
        <div
          className="absolute pointer-events-none border-t-[2.208px] border-[#17152E]"
          style={{
            left: "61.04%",
            right: "37.04%",
            top: "30.51%",
            bottom: "69.01%",
          }}
        />

        {/* Haste esquerda (Vector - left: 50.96%, right: 45.92%, top: 30.03%, bottom: 69.01%) */}
        <div
          className="absolute pointer-events-none border-t-[2.208px] border-[#17152E]"
          style={{
            left: "50.96%",
            right: "45.92%",
            top: "30.03%",
            bottom: "69.01%",
          }}
        />

        {/* Haste direita (Vector - left: 69.92%, right: 26.96%, top: 30.03%, bottom: 69.01%) */}
        <div
          className="absolute pointer-events-none border-t-[2.208px] border-[#17152E]"
          style={{
            left: "69.92%",
            right: "26.96%",
            top: "30.03%",
            bottom: "69.01%",
          }}
        />

        {/* Reflexo na lente esquerda (Vector - left: 56%, right: 42.56%, top: 28.83%, bottom: 70.45%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "56%",
            right: "42.56%",
            top: "28.83%",
            bottom: "70.45%",
            opacity: 0.8,
            border: "1.656px solid #FFFFFF",
          }}
        />

        {/* Reflexo na lente direita (Vector - left: 64.16%, right: 34.4%, top: 28.83%, bottom: 70.45%) */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            left: "64.16%",
            right: "34.4%",
            top: "28.83%",
            bottom: "70.45%",
            opacity: 0.8,
            border: "1.656px solid #FFFFFF",
          }}
        />

        {/* Sorriso e língua (Vectors - left: 58.88% e 60.32%) */}
        <div
          className="absolute rounded-b-full overflow-hidden pointer-events-none"
          style={{
            left: "58.88%",
            right: "34.88%",
            top: "36.27%",
            bottom: "60.73%",
            background: "#17152E",
          }}
        >
          <div
            className="absolute rounded-t-full bottom-0 left-[12%] right-[12%] h-[60%]"
            style={{
              background: "#FF6B57",
            }}
          />
        </div>
      </div>
    )
  }

  if (variant === "question") {
    return (
      <div
        className={`relative select-none inline-block ${className}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label="Mentorina em formato de interrogação"
      >
        <svg
          viewBox="0 0 230 230"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            <radialGradient
              id="mascotQuestionHeadGrad"
              cx="38%"
              cy="32%"
              r="70%"
              fx="38%"
              fy="32%"
            >
              <stop offset="0%" stopColor="#E4FF8A" />
              <stop offset="55%" stopColor="#C6F432" />
              <stop offset="100%" stopColor="#A3D11A" />
            </radialGradient>
            <radialGradient
              id="mascotQuestionDotGrad"
              cx="38%"
              cy="32%"
              r="70%"
              fx="38%"
              fy="32%"
            >
              <stop offset="0%" stopColor="#E4FF8A" />
              <stop offset="55%" stopColor="#C6F432" />
              <stop offset="100%" stopColor="#A3D11A" />
            </radialGradient>
          </defs>

          {/* Sombra suave na base (Vector - left: 41.33%, top: 90%) */}
          <ellipse
            cx="120"
            cy="212"
            rx="28"
            ry="6"
            fill="#17152E"
            opacity="0.08"
          />

          {/* Ponto inferior da interrogação (esfera verde com gradiente radial) */}
          <circle cx="119" cy="190" r="13" fill="url(#mascotQuestionDotGrad)" />
          {/* Brilho no ponto inferior */}
          <ellipse
            cx="115"
            cy="186"
            rx="5.5"
            ry="2.8"
            fill="#FFFFFF"
            opacity="0.6"
            transform="rotate(-25 115 186)"
          />

          {/* Arco da interrogação - Sombra profunda (border: 18.4px solid #3420C2) */}
          <path
            d="M 68 88 C 65 52, 105 32, 135 42 C 165 52, 168 85, 142 110 C 124 128, 120 142, 120 160"
            fill="none"
            stroke="#3420C2"
            strokeWidth="18.4"
            strokeLinecap="round"
          />

          {/* Arco da interrogação - Roxo vibrante (border: 18.4px solid #4F3CF0) */}
          <path
            d="M 68 86 C 65 50, 105 30, 135 40 C 165 50, 168 83, 142 108 C 124 126, 120 140, 120 158"
            fill="none"
            stroke="#4F3CF0"
            strokeWidth="18.4"
            strokeLinecap="round"
          />

          {/* Linha de brilho lavanda (border: 3.07px solid #8E82FF, opacity: 0.55) */}
          <path
            d="M 78 82 C 75 56, 105 40, 132 48 C 158 56, 158 82, 136 104 C 122 120, 118 134, 118 152"
            fill="none"
            stroke="#8E82FF"
            strokeWidth="3.07"
            strokeLinecap="round"
            opacity="0.55"
          />

          {/* Detalhe coral na ponta */}
          <circle cx="120" cy="158" r="5" fill="#FF6B57" />

          {/* Cabeça da Mentorina no topo da interrogação (inclinada -8deg) */}
          <g transform="rotate(-8 68 86)">
            {/* Cabeça verde com gradiente radial */}
            <circle
              cx="68"
              cy="86"
              r="24"
              fill="url(#mascotQuestionHeadGrad)"
            />

            {/* Brilho 3D especular na cabeça */}
            <ellipse
              cx="60"
              cy="74"
              rx="9.5"
              ry="4.8"
              fill="#FFFFFF"
              opacity="0.55"
              transform="rotate(-33 60 74)"
            />

            {/* Bochechas coradas (#FF6B57, opacity 0.65) */}
            <ellipse
              cx="56"
              cy="94"
              rx="4.8"
              ry="3.2"
              fill="#FF6B57"
              opacity="0.65"
            />
            <ellipse
              cx="79"
              cy="94"
              rx="4.8"
              ry="3.2"
              fill="#FF6B57"
              opacity="0.65"
            />

            {/* Óculos intelectuais redondos */}
            <circle
              cx="60"
              cy="86"
              r="8"
              fill="rgba(255, 255, 255, 0.18)"
              stroke="#17152E"
              strokeWidth="2.2"
            />
            <circle
              cx="76"
              cy="86"
              r="8"
              fill="rgba(255, 255, 255, 0.18)"
              stroke="#17152E"
              strokeWidth="2.2"
            />
            {/* Ponte dos óculos */}
            <path
              d="M 68 85 Q 68.5 82 69 85"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Hastes dos óculos */}
            <path
              d="M 52 86 L 47 85.5 M 84 86 L 89 85.5"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.2"
              strokeLinecap="round"
            />

            {/* Olhos e pupilas curiosos */}
            <circle cx="61" cy="85.5" r="3.2" fill="#17152E" />
            <circle cx="60" cy="84.2" r="1.2" fill="#FFFFFF" />
            <circle cx="77" cy="85.5" r="3.2" fill="#17152E" />
            <circle cx="76" cy="84.2" r="1.2" fill="#FFFFFF" />

            {/* Sorriso expressivo/curioso */}
            <path
              d="M 65 96 Q 68 100 71 96"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.76"
              strokeLinecap="round"
            />

            {/* Detalhe coral de adorno */}
            <circle cx="45" cy="74" r="4" fill="#FF6B57" />
          </g>
        </svg>
      </div>
    )
  }
  if (variant === "soundwave") {
    // Pose oficial da tela "Curso-alvo": U roxo com ondas sonoras coral à
    // esquerda e a cabeça verde (óculos, sorriso) na ponta direita.
    return (
      <div
        className={`relative select-none inline-block ${className}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label="Mentorina, a tutora mascote do EduMentor AI"
      >
        <svg
          viewBox="0 0 230 230"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <radialGradient
              id="mascotSoundwaveHeadGrad"
              cx="40%"
              cy="28%"
              r="75%"
              fx="40%"
              fy="28%"
            >
              <stop offset="0%" stopColor="#E4FF8A" />
              <stop offset="52%" stopColor="#C6F432" />
              <stop offset="100%" stopColor="#9FCC18" />
            </radialGradient>
          </defs>

          {/* Sombra no chão */}
          <ellipse
            cx="120"
            cy="206"
            rx="60"
            ry="10"
            fill="#17152E"
            opacity="0.10"
          />

          {/* Ondas sonoras coral (2 arcos) à esquerda */}
          <path
            d="M 40 66 Q 24 102 40 138"
            fill="none"
            stroke="#FF6B57"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 58 78 Q 47 102 58 126"
            fill="none"
            stroke="#FF6B57"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Corpo (gancho/vírgula alongado inclinado) — sombra profunda */}
          <path
            d="M 78 74 C 70 104, 92 150, 120 168 C 150 188, 182 176, 190 142 C 196 116, 190 96, 184 82"
            fill="none"
            stroke="#3420C2"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Corpo — roxo vibrante */}
          <path
            d="M 78 72 C 70 102, 92 148, 120 166 C 150 186, 182 174, 190 140 C 196 114, 190 94, 184 80"
            fill="none"
            stroke="#4F3CF0"
            strokeWidth="34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Brilho lavanda sutil ao longo da curva interna */}
          <path
            d="M 90 78 C 83 106, 101 146, 126 162"
            fill="none"
            stroke="#8E82FF"
            strokeWidth="5"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Cabeça verde grande na ponta direita (acima) */}
          <g>
            <circle
              cx="186"
              cy="70"
              r="42"
              fill="url(#mascotSoundwaveHeadGrad)"
            />
            {/* Brilho 3D especular (grande, topo) */}
            <ellipse
              cx="170"
              cy="48"
              rx="17"
              ry="8.5"
              fill="#FFFFFF"
              opacity="0.6"
              transform="rotate(-28 170 48)"
            />
            {/* Bochechas coradas */}
            <ellipse
              cx="164"
              cy="84"
              rx="8"
              ry="5"
              fill="#FF8A6B"
              opacity="0.75"
            />
            <ellipse
              cx="208"
              cy="84"
              rx="8"
              ry="5"
              fill="#FF8A6B"
              opacity="0.75"
            />
            {/* Óculos grandes redondos */}
            <circle
              cx="172"
              cy="68"
              r="15.5"
              fill="rgba(255,255,255,0.14)"
              stroke="#17152E"
              strokeWidth="3.4"
            />
            <circle
              cx="202"
              cy="68"
              r="15.5"
              fill="rgba(255,255,255,0.14)"
              stroke="#17152E"
              strokeWidth="3.4"
            />
            {/* Ponte dos óculos */}
            <path
              d="M 186.5 66 Q 187 62 187.5 66"
              fill="none"
              stroke="#17152E"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            {/* Hastes dos óculos */}
            <path
              d="M 157 66 L 149 63 M 217 66 L 225 63"
              fill="none"
              stroke="#17152E"
              strokeWidth="3.4"
              strokeLinecap="round"
            />
            {/* Olhos fechados e felizes (arcos sorrindo) */}
            <path
              d="M 165 70 Q 172 62 179 70"
              fill="none"
              stroke="#17152E"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            <path
              d="M 195 70 Q 202 62 209 70"
              fill="none"
              stroke="#17152E"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Boca aberta sorrindo com língua coral */}
            <path
              d="M 178 86 Q 187 98 196 86 Q 187 90 178 86 Z"
              fill="#17152E"
            />
            <path
              d="M 184 90 Q 187 95 190 90 Z"
              fill="#FF6B57"
            />
          </g>
        </svg>
      </div>
    )
  }
  if (variant === "avatar") {
    return (
      <div
        className={`relative select-none inline-block rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label="Foto de perfil da Mentorina"
      >
        <svg
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <radialGradient
              id="mascotAvatarHeadGrad"
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

          {/* Fundo circular índigo (Figma CSS: #4F3CF0) */}
          <circle cx="22" cy="22" r="22" fill="#4F3CF0" />

          {/* Curva roxa da gola na base (Figma: border 26px solid #3420C2 e 22px solid #6A5AF5, top 75%) */}
          <path
            d="M 6 43 C 10 34, 34 34, 38 43"
            fill="none"
            stroke="#3420C2"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M 8 43 C 12 36, 32 36, 36 43"
            fill="none"
            stroke="#6A5AF5"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Rosto/Cabeça verde (Figma: radial gradient #EEFFA8 -> #C6F432 -> #A6D11A) */}
          <circle cx="22" cy="19" r="13" fill="url(#mascotAvatarHeadGrad)" />

          {/* Brilho 3D na cabeça (Vector - left: 30%, top: 18.5%, rotate -20deg, opacity 0.45) */}
          <ellipse
            cx="17.5"
            cy="12.5"
            rx="5.5"
            ry="2.8"
            fill="#FFFFFF"
            opacity="0.45"
            transform="rotate(-20 17.5 12.5)"
          />

          {/* Bochechas coradas (Figma: #FF6B57, opacity 0.45) */}
          <ellipse
            cx="14.5"
            cy="22.5"
            rx="2.5"
            ry="1.8"
            fill="#FF6B57"
            opacity="0.55"
          />
          <ellipse
            cx="29.5"
            cy="22.5"
            rx="2.5"
            ry="1.8"
            fill="#FF6B57"
            opacity="0.55"
          />

          {/* Óculos intelectuais redondos (Figma: border 1px solid #17152E, bg: rgba(255,255,255,0.18)) */}
          <circle
            cx="17.5"
            cy="18"
            r="4.4"
            fill="rgba(255, 255, 255, 0.22)"
            stroke="#17152E"
            strokeWidth="1.2"
          />
          <circle
            cx="26.5"
            cy="18"
            r="4.4"
            fill="rgba(255, 255, 255, 0.22)"
            stroke="#17152E"
            strokeWidth="1.2"
          />
          {/* Ponte dos óculos (Figma: top 41.33%, border 1px solid #17152E) */}
          <path
            d="M 21 17.5 Q 22 16.5 23 17.5"
            fill="none"
            stroke="#17152E"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          {/* Hastes laterais dos óculos */}
          <path
            d="M 13.1 18 L 11 17.6 M 30.9 18 L 33 17.6"
            fill="none"
            stroke="#17152E"
            strokeWidth="1.1"
            strokeLinecap="round"
          />

          {/* Olhos e pupilas (Figma: #17152E com reflexo #FFFFFF) */}
          <circle cx="17.8" cy="18" r="1.8" fill="#17152E" />
          <circle cx="17.2" cy="17.3" r="0.65" fill="#FFFFFF" />

          <circle cx="26.2" cy="18" r="1.8" fill="#17152E" />
          <circle cx="25.6" cy="17.3" r="0.65" fill="#FFFFFF" />

          {/* Sorriso simpático (Figma: top 56.67%, border 1px solid #17152E) */}
          <path
            d="M 20.2 23.2 Q 22 25.4 23.8 23.2"
            fill="none"
            stroke="#17152E"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    )
  }

  if (variant === "stairs") {
    return (
      <div
        className={`relative select-none inline-block ${className}`}
        style={{ width: size, height: size }}
        role="img"
        aria-label="Mentorina, a tutora mascote do EduMentor AI em formato de escadaria"
      >
        <svg
          viewBox="0 0 220 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-md"
        >
          <defs>
            <radialGradient
              id="mascotHeadGradStairs"
              cx="38%"
              cy="32%"
              r="70%"
              fx="38%"
              fy="32%"
            >
              <stop offset="0%" stopColor="#E4FF8A" />
              <stop offset="55%" stopColor="#C6F432" />
              <stop offset="100%" stopColor="#A3D11A" />
            </radialGradient>
          </defs>

          {/* Sombra suave na base da escadaria (Vector - left: 11.33%, top: 88.33%, opacity: 0.08) */}
          <ellipse
            cx="96"
            cy="194"
            rx="68"
            ry="7"
            fill="#17152E"
            opacity="0.10"
          />

          {coilColor === "white" ? (
            <>
              {/* Corpo em formato de Escadaria - Sombra profunda com pescoço estendido */}
              <path
                d="M 25 183 L 72 183 L 72 148 L 112 148 L 112 113 L 148 113 L 148 79"
                fill="none"
                stroke="#C9C3F2"
                strokeWidth="18.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Corpo em formato de Escadaria - Principal Branco com pescoço aumentado */}
              <path
                d="M 25 180 L 72 180 L 72 144 L 112 144 L 112 109 L 148 109 L 148 76"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="17.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Linha de brilho nos degraus e no pescoço */}
              <path
                d="M 30 176 L 68 176 M 76 140 L 108 140 M 116 105 L 144 105 M 144 105 L 144 78"
                fill="none"
                stroke="#E9E6FF"
                strokeWidth="2.93"
                strokeLinecap="round"
                opacity="0.65"
              />
            </>
          ) : (
            <>
              {/* Corpo em formato de Escadaria - Sombra profunda com pescoço estendido */}
              <path
                d="M 25 183 L 72 183 L 72 148 L 112 148 L 112 113 L 148 113 L 148 79"
                fill="none"
                stroke="#3420C2"
                strokeWidth="17.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Corpo em formato de Escadaria - Principal Roxo com pescoço aumentado */}
              <path
                d="M 25 180 L 72 180 L 72 144 L 112 144 L 112 109 L 148 109 L 148 76"
                fill="none"
                stroke="#4F3CF0"
                strokeWidth="17.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Linha de brilho lavanda nos degraus da escada e no pescoço */}
              <path
                d="M 30 176 L 68 176 M 76 140 L 108 140 M 116 105 L 144 105 M 144 105 L 144 78"
                fill="none"
                stroke="#8E82FF"
                strokeWidth="2.93"
                strokeLinecap="round"
                opacity="0.55"
              />
            </>
          )}

          {/* Detalhe coral na cauda/base */}
          <circle cx="25" cy="180" r="5" fill="#FF6B57" />

          {/* Grupo da Cabeça e Expressão (elevada sobre o pescoço estendido) */}
          <g transform="translate(0, -24)">
            {/* Brilho estrela acima da cabeça */}
            <path
              d="M 198 56 L 200 61 L 205 63 L 200 65 L 198 70 L 196 65 L 191 63 L 196 61 Z"
              fill="#C6F432"
              opacity="0.9"
            />

            {/* Cabeça verde com gradiente radial (Group/Vector - left: 61.81%, top: 35.15%) */}
            <circle
              cx="160"
              cy="100"
              r="25.5"
              fill="url(#mascotHeadGradStairs)"
            />

            {/* Brilho especular 3D na cabeça (Vector - left: 65.05%, top: 37.05%, rotate -25deg) */}
            <ellipse
              cx="152"
              cy="88"
              rx="10"
              ry="5"
              fill="#FFFFFF"
              opacity="0.55"
              transform="rotate(-25 152 88)"
            />

            {/* Bochechas coradas (Vectors - left: 63.97% e 78.85%, background: #FF6B57, opacity: 0.65) */}
            <ellipse
              cx="148"
              cy="108"
              rx="5"
              ry="3.5"
              fill="#FF6B57"
              opacity={mood === "joy" ? 0.75 : 0.65}
            />
            <ellipse
              cx="172"
              cy="108"
              rx="5"
              ry="3.5"
              fill="#FF6B57"
              opacity={mood === "joy" ? 0.75 : 0.65}
            />

            {/* Óculos redondos intelectuais (Vectors - left: 65.41% e 73.57%, border: 2.376px solid #17152E) */}
            <circle
              cx="152"
              cy="99"
              r="8.5"
              fill="rgba(255, 255, 255, 0.22)"
              stroke="#17152E"
              strokeWidth="2.38"
            />
            <circle
              cx="168"
              cy="99"
              r="8.5"
              fill="rgba(255, 255, 255, 0.22)"
              stroke="#17152E"
              strokeWidth="2.38"
            />
            {/* Ponte dos óculos (Vector - left: 72.37%, border: 2.112px solid #17152E) */}
            <path
              d="M 160.5 98 Q 161.5 95 162.5 98"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.11"
              strokeLinecap="round"
            />
            {/* Hastes laterais dos óculos (Vectors - left: 62.29% e 81.25%) */}
            <path
              d="M 143.5 99 L 138 98.5 M 176.5 99 L 182 98.5"
              fill="none"
              stroke="#17152E"
              strokeWidth="2.11"
              strokeLinecap="round"
            />

            {mood === "joy" ? (
              <>
                {/* Olhos fechados em arco expressando alegria e entusiasmo (^ ^) */}
                <path
                  d="M 148 100.5 Q 152 94 156 100.5"
                  fill="none"
                  stroke="#17152E"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <path
                  d="M 164 100.5 Q 168 94 172 100.5"
                  fill="none"
                  stroke="#17152E"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />

                {/* Sorriso aberto demonstrando alegria com língua coral */}
                <path
                  d="M 154.5 107.5 Q 160.5 118 166.5 107.5 Z"
                  fill="#17152E"
                  stroke="#17152E"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <path
                  d="M 156.5 111.5 Q 160.5 117.5 164.5 111.5 Z"
                  fill="#FF6B57"
                />
              </>
            ) : (
              <>
                {/* Olhos e pupilas padrão (Vectors - left: 67.09%, 67.69%, 75.25%, 75.85%) */}
                <circle cx="153" cy="99" r="3.4" fill="#17152E" />
                <circle cx="152" cy="97.6" r="1.3" fill="#FFFFFF" />
                <circle cx="169" cy="99" r="3.4" fill="#17152E" />
                <circle cx="168" cy="97.6" r="1.3" fill="#FFFFFF" />

                {/* Sorriso padrão (Vector - left: 70.45%, top: 50.75%, border: 2.64px solid #17152E) */}
                <path
                  d="M 158 109 Q 161 113.5 164 109"
                  fill="none"
                  stroke="#17152E"
                  strokeWidth="2.64"
                  strokeLinecap="round"
                />
              </>
            )}
          </g>
        </svg>
      </div>
    )
  }

  return (
    <div
      className={`relative select-none inline-block ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Mentorina, a tutora mascote do EduMentor AI"
    >
      <svg
        viewBox="0 0 240 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          <radialGradient
            id="mascotHeadGrad"
            cx="38%"
            cy="32%"
            r="70%"
            fx="38%"
            fy="32%"
          >
            <stop offset="0%" stopColor="#E4FF8A" />
            <stop offset="55%" stopColor="#C6F432" />
            <stop offset="100%" stopColor="#A3D11A" />
          </radialGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Soft shadow under mascot */}
        <ellipse
          cx="120"
          cy="216"
          rx="68"
          ry="12"
          fill="#17152E"
          opacity="0.22"
        />

        {/* Coiled Body */}
        {coilColor === "white" ? (
          <>
            {/* White/lavender coil for dark backgrounds (Figma spec: border 14.4px #C9C3F2 and #FFFFFF) */}
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
            {/* Outer deep purple coil */}
            <path
              d="M 60 160 C 50 190, 80 205, 120 205 C 170 205, 195 180, 185 140 C 175 105, 140 100, 110 115"
              fill="none"
              stroke="#3420C2"
              strokeWidth="24"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main purple coil with gradient vibe */}
            <path
              d="M 60 160 C 50 190, 80 205, 120 205 C 170 205, 195 180, 185 140 C 175 105, 140 100, 110 115"
              fill="none"
              stroke="#4F3CF0"
              strokeWidth="20"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Lavender inner highlight line */}
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

        {/* Coral tail accessory / sparkles */}
        <circle cx="56" cy="158" r="7" fill="#FF6B57" />

        {/* Sparkle star near head */}
        <path
          d="M 198 32 L 201 39 L 208 42 L 201 45 L 198 52 L 195 45 L 188 42 L 195 39 Z"
          fill="#C6F432"
          opacity="0.9"
        />

        {/* Green Head with Radial Gradient */}
        <circle cx="128" cy="92" r="48" fill="url(#mascotHeadGrad)" />

        {/* Head 3D Specular Highlight */}
        <ellipse
          cx="110"
          cy="68"
          rx="18"
          ry="9"
          fill="#FFFFFF"
          opacity="0.55"
          transform="rotate(-25 110 68)"
        />

        {/* Cute Coral Blush on Cheeks */}
        <ellipse cx="96" cy="112" rx="9" ry="6" fill="#FF6B57" opacity="0.65" />
        <ellipse
          cx="160"
          cy="112"
          rx="9"
          ry="6"
          fill="#FF6B57"
          opacity="0.65"
        />

        {/* Smart Round Glasses */}
        {/* Left lens */}
        <circle
          cx="108"
          cy="96"
          r="16"
          fill="rgba(255, 255, 255, 0.25)"
          stroke="#17152E"
          strokeWidth="3.5"
        />
        {/* Right lens */}
        <circle
          cx="148"
          cy="96"
          r="16"
          fill="rgba(255, 255, 255, 0.25)"
          stroke="#17152E"
          strokeWidth="3.5"
        />
        {/* Bridge */}
        <path
          d="M 124 93 Q 128 88 132 93"
          fill="none"
          stroke="#17152E"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Temples */}
        <path
          d="M 92 95 L 83 94"
          fill="none"
          stroke="#17152E"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 164 95 L 173 94"
          fill="none"
          stroke="#17152E"
          strokeWidth="3"
        />

        {/* Eyes inside glasses */}
        {mood === "thinking" ? (
          <>
            {/* Thinking / Looking up */}
            <circle cx="110" cy="92" r="6" fill="#17152E" />
            <circle cx="108" cy="90" r="2.2" fill="#FFFFFF" />
            <circle cx="150" cy="92" r="6" fill="#17152E" />
            <circle cx="148" cy="90" r="2.2" fill="#FFFFFF" />
          </>
        ) : (
          <>
            {/* Friendly Big Pupils */}
            <circle cx="110" cy="96" r="6.5" fill="#17152E" />
            <circle cx="108" cy="94" r="2.5" fill="#FFFFFF" />
            <circle cx="112" cy="98" r="1.2" fill="#FFFFFF" />

            <circle cx="150" cy="96" r="6.5" fill="#17152E" />
            <circle cx="148" cy="94" r="2.5" fill="#FFFFFF" />
            <circle cx="152" cy="98" r="1.2" fill="#FFFFFF" />
          </>
        )}

        {/* Smile */}
        <path
          d="M 122 114 Q 128 122 134 114"
          fill="none"
          stroke="#17152E"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* Tiny tongue / happy detail */}
        <path d="M 125 116 Q 128 120 131 116 Z" fill="#FF6B57" opacity="0.8" />
      </svg>
    </div>
  )
}
