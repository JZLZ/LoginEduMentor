/**
 * Ilustração oficial da Mentorina usada na tela "Curso-alvo", exportada do
 * Figma (SVG vetorial). Mantém fidelidade 1:1 ao design.
 *
 * O export do Figma inclui, abaixo do mascote, o texto da legenda do frame;
 * aqui recortamos o viewBox apenas na área do mascote (ondas + corpo + cabeça)
 * para exibir somente a ilustração.
 */
interface MentorinaCursoAlvoProps {
  size?: number
  className?: string
}

export default function MentorinaCursoAlvo({
  size = 170,
  className = "",
}: MentorinaCursoAlvoProps) {
  return (
    <div
      className={`relative select-none inline-block ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Mentorina, a tutora mascote do EduMentor AI"
    >
      {/* viewBox recortado na área do mascote (x:10..200, y:45..195) */}
      <svg
        width="100%"
        height="100%"
        viewBox="10 45 190 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          opacity="0.1"
          d="M110 189.933C138.351 189.933 161.333 186.978 161.333 183.333C161.333 179.688 138.351 176.733 110 176.733C81.6494 176.733 58.6667 179.688 58.6667 183.333C58.6667 186.978 81.6494 189.933 110 189.933Z"
          fill="#17152E"
        />
        <path
          d="M35.2002 82.1333C31.289 88 30.8002 94.3555 33.7335 101.2"
          strokeWidth="3.66667"
          strokeLinecap="round"
          stroke="#FF6B57"
        />
        <path
          d="M24.9334 76.2666C19.0668 86.0444 18.5779 96.311 23.4668 107.067"
          strokeWidth="3.66667"
          strokeLinecap="round"
          stroke="#FF6B57"
        />
        <path
          d="M57.1999 90.9331C48.3999 112.933 63.0665 132 82.1332 149.6C102.667 168.666 129.067 183.333 143.733 159.866C155.467 140.8 146.667 120.266 151.067 99.7331"
          strokeWidth="17.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#3420C2"
        />
        <path
          d="M57.1999 88C48.3999 110 63.0665 129.067 82.1332 146.667C102.667 165.733 129.067 180.4 143.733 156.933C155.467 137.867 146.667 117.333 151.067 96.8"
          strokeWidth="17.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#4F3CF0"
        />
        <path
          opacity="0.45"
          d="M55.7332 83.6001C46.9332 105.6 61.5999 124.667 80.6665 142.267C101.2 161.333 127.6 176 142.267 152.533C154 133.467 145.2 112.933 149.6 92.4001"
          strokeWidth="2.2"
          strokeLinecap="round"
          stroke="#8E82FF"
        />
        <path
          d="M150.473 101.364C164.334 103.312 177.149 93.6547 179.097 79.7939C181.045 65.933 171.388 53.1173 157.527 51.1693C143.666 49.2213 130.851 58.8786 128.902 72.7394C126.954 86.6003 136.612 99.416 150.473 101.364Z"
          fill="url(#paint0_radial_mentorina)"
        />
        <path
          opacity="0.45"
          d="M149.763 63.6835C153.756 62.8347 156.6 60.2968 156.115 58.015C155.63 55.7331 151.999 54.5714 148.006 55.4201C144.013 56.2689 141.169 58.8069 141.654 61.0887C142.139 63.3706 145.769 64.5323 149.763 63.6835Z"
          fill="white"
        />
        <path
          opacity="0.45"
          d="M136.321 84.4459C138.632 84.7705 140.669 83.8633 140.872 82.4194C141.075 80.9756 139.366 79.5419 137.056 79.2173C134.746 78.8926 132.709 79.7999 132.506 81.2437C132.303 82.6875 134.011 84.1212 136.321 84.4459Z"
          fill="#FF6B57"
        />
        <path
          opacity="0.45"
          d="M168.739 89.002C171.049 89.3267 173.086 88.4194 173.289 86.9756C173.492 85.5317 171.784 84.0981 169.474 83.7734C167.164 83.4487 165.126 84.356 164.923 85.7999C164.72 87.2437 166.429 88.6774 168.739 89.002Z"
          fill="#FF6B57"
        />
        <path
          d="M142.121 73.5309C144.604 71.0362 146.696 71.3302 148.395 74.4127"
          strokeWidth="2.112"
          strokeLinecap="round"
          stroke="#17152E"
        />
        <path
          d="M159.898 76.0294C162.382 73.5348 164.473 73.8287 166.173 76.9112"
          strokeWidth="2.112"
          strokeLinecap="round"
          stroke="#17152E"
        />
        <path
          d="M144.229 81.2916C148.85 81.9409 153.122 78.7218 153.771 74.1015C154.42 69.4812 151.201 65.2094 146.581 64.56C141.961 63.9107 137.689 67.1298 137.039 71.7501C136.39 76.3704 139.609 80.6422 144.229 81.2916Z"
          fill="white"
          fillOpacity="0.18"
          strokeWidth="2.376"
          stroke="#17152E"
        />
        <path
          d="M162.007 83.7901C166.627 84.4395 170.899 81.2204 171.548 76.6001C172.197 71.9798 168.978 67.7079 164.358 67.0585C159.738 66.4092 155.466 69.6283 154.817 74.2486C154.167 78.8689 157.386 83.1408 162.007 83.7901Z"
          fill="white"
          fillOpacity="0.18"
          strokeWidth="2.376"
          stroke="#17152E"
        />
        <path
          d="M152.872 72.909C154.114 71.6617 155.16 71.8086 156.009 73.3499"
          strokeWidth="2.112"
          stroke="#17152E"
        />
        <path
          d="M137.186 70.7044L130.683 67.6577M171.695 75.5543L178.786 74.4182"
          strokeWidth="2.112"
          strokeLinecap="round"
          stroke="#17152E"
        />
        <path
          d="M146.247 82.1084C149.848 89.3682 154.38 90.005 159.842 84.019L146.247 82.1084Z"
          fill="#17152E"
        />
        <path
          d="M149.246 87.3286C151.092 89.3654 153.184 89.6594 155.52 88.2104"
          strokeWidth="2.112"
          strokeLinecap="round"
          stroke="#FF6B57"
        />
        <defs>
          <radialGradient
            id="paint0_radial_mentorina"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(149.246 66.3851) rotate(8) scale(38.016)"
          >
            <stop stopColor="#EEFFA8" />
            <stop offset="0.55" stopColor="#C6F432" />
            <stop offset="1" stopColor="#A6D11A" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  )
}
