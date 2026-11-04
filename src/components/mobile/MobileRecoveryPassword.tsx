import { useState, type FormEvent } from "react"
import MobileResetPassword from "./MobileResetPassword"

interface MobileRecoveryPasswordProps {
  reset?: boolean
  go: (screen: any) => void
  email?: string
  setEmail?: (email: string) => void
  sent?: boolean
  setSent?: (sent: boolean) => void
  password?: string
  setPassword?: (password: string) => void
  confirmation?: string
  setConfirmation?: (confirmation: string) => void
  show?: boolean
  setShow?: (show: boolean) => void
  formAttempted?: boolean
  setFormAttempted?: (attempted: boolean) => void
  onSubmitRecovery?: (e: FormEvent<HTMLFormElement>) => void
  onSubmitReset?: (e: FormEvent<HTMLFormElement>) => void
}

/**
 * Question Mark 3D Mascot Illustration with Mentorina Face
 * Exact vector paths and gradients extracted from Figma Artboard (393 x 802 px)
 */
function MascotQuestionIllustration() {
  return (
    <div className="w-full flex justify-center py-2">
      <svg
        width="100%"
        height="130"
        viewBox="0 50 393 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full max-w-[393px] mx-auto select-none pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <radialGradient
            id="paint0_radial_recovery_mascot"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(167.057 85.628) rotate(-8) scale(22.464)"
          >
            <stop stopColor="#EEFFA8" />
            <stop offset="0.55" stopColor="#C6F432" />
            <stop offset="1" stopColor="#A6D11A" />
          </radialGradient>
        </defs>

        {/* Shadow underneath question mark dot */}
        <path
          opacity="0.1"
          d="M199.967 171.5C209.54 171.5 217.3 169.754 217.3 167.6C217.3 165.446 209.54 163.7 199.967 163.7C190.394 163.7 182.633 165.446 182.633 167.6C182.633 169.754 190.394 171.5 199.967 171.5Z"
          fill="#17152E"
        />

        {/* Question mark 3D depth path (dark indigo/purple) */}
        <path
          d="M180.033 82.6666C188.7 67.0666 219.9 64.4666 225.1 86.9999C229.433 104.333 204.3 108.667 199.967 123.4V136.4"
          strokeWidth="10.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#3420C2"
        />

        {/* Question mark main path (brand indigo #4F3CF0) */}
        <path
          d="M180.033 80.9333C188.7 65.3333 219.9 62.7333 225.1 85.2667C229.433 102.6 204.3 106.933 199.967 121.667V134.667"
          strokeWidth="10.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="#4F3CF0"
        />

        {/* Question mark upper highlight stroke */}
        <path
          opacity="0.45"
          d="M179.167 78.3334C187.833 62.7334 219.033 60.1334 224.233 82.6667C228.566 100 203.433 104.333 199.1 119.067V132.067"
          strokeWidth="1.3"
          strokeLinecap="round"
          stroke="#8E82FF"
        />

        {/* Question mark dot (neon lime #C6F432) */}
        <path
          d="M199.967 163.267C204.274 163.267 207.767 159.774 207.767 155.467C207.767 151.159 204.274 147.667 199.967 147.667C195.659 147.667 192.167 151.159 192.167 155.467C192.167 159.774 195.659 163.267 199.967 163.267Z"
          fill="#C6F432"
        />

        {/* Mentorina face head with lime radial gradient */}
        <path
          d="M173.451 105.297C181.641 104.146 187.348 96.573 186.197 88.3824C185.046 80.1919 177.473 74.4853 169.282 75.6364C161.092 76.7875 155.385 84.3604 156.536 92.551C157.688 100.741 165.26 106.448 173.451 105.297Z"
          fill="url(#paint0_radial_recovery_mascot)"
        />

        {/* Forehead light highlight */}
        <path
          opacity="0.45"
          d="M166.91 84.0095C169.04 82.8769 170.242 80.9721 169.595 79.755C168.948 78.5379 166.697 78.4693 164.567 79.6018C162.437 80.7344 161.235 82.6392 161.882 83.8563C162.529 85.0734 164.78 85.142 166.91 84.0095Z"
          fill="white"
        />

        {/* Left blush cheek */}
        <path
          opacity="0.45"
          d="M162.657 97.992C164.022 97.8002 165.032 96.953 164.912 96.0998C164.792 95.2466 163.588 94.7105 162.223 94.9024C160.858 95.0942 159.849 95.9414 159.969 96.7946C160.088 97.6478 161.292 98.1839 162.657 97.992Z"
          fill="#FF6B57"
        />

        {/* Right blush cheek */}
        <path
          opacity="0.45"
          d="M181.813 95.2998C183.178 95.1079 184.188 94.2607 184.068 93.4076C183.948 92.5544 182.744 92.0183 181.379 92.2101C180.014 92.402 179.004 93.2491 179.124 94.1023C179.244 94.9555 180.448 95.4916 181.813 95.2998Z"
          fill="#FF6B57"
        />

        {/* Left pupil */}
        <path
          d="M166.245 92.1317C167.183 91.9998 167.808 90.9246 167.64 89.7301C167.472 88.5357 166.575 87.6743 165.637 87.8062C164.698 87.9381 164.074 89.0133 164.241 90.2078C164.409 91.4022 165.306 92.2636 166.245 92.1317Z"
          fill="#17152E"
        />

        {/* Left pupil catchlight */}
        <path
          d="M166.515 89.5732C166.857 89.5252 167.094 89.2097 167.046 88.8684C166.998 88.5272 166.683 88.2894 166.342 88.3374C166 88.3853 165.763 88.7008 165.81 89.0421C165.858 89.3834 166.174 89.6212 166.515 89.5732Z"
          fill="white"
        />

        {/* Right pupil */}
        <path
          d="M176.749 90.6553C177.688 90.5234 178.312 89.4482 178.144 88.2537C177.977 87.0593 177.08 86.1979 176.141 86.3298C175.203 86.4617 174.578 87.5369 174.746 88.7313C174.914 89.9258 175.811 90.7872 176.749 90.6553Z"
          fill="#17152E"
        />

        {/* Right pupil catchlight */}
        <path
          d="M177.02 88.0968C177.361 88.0488 177.599 87.7333 177.551 87.392C177.503 87.0507 177.187 86.8129 176.846 86.8609C176.505 86.9089 176.267 87.2244 176.315 87.5657C176.363 87.907 176.678 88.1447 177.02 88.0968Z"
          fill="white"
        />

        {/* Left glasses rim */}
        <path
          d="M166.636 94.9124C169.366 94.5287 171.268 92.0044 170.884 89.2743C170.501 86.5441 167.976 84.6419 165.246 85.0256C162.516 85.4093 160.614 87.9336 160.997 90.6638C161.381 93.3939 163.905 95.2961 166.636 94.9124Z"
          fill="white"
          fillOpacity="0.18"
          stroke="#17152E"
        />

        {/* Right glasses rim */}
        <path
          d="M177.14 93.436C179.87 93.0523 181.772 90.528 181.389 87.7978C181.005 85.0676 178.481 83.1654 175.751 83.5491C173.02 83.9328 171.118 86.4571 171.502 89.1873C171.886 91.9175 174.41 93.8197 177.14 93.436Z"
          fill="white"
          fillOpacity="0.18"
          stroke="#17152E"
        />

        {/* Glasses bridge */}
        <path
          d="M170.179 88.7432C170.681 87.8324 171.299 87.7456 172.033 88.4826"
          stroke="#17152E"
        />

        {/* Glasses arms */}
        <path
          d="M160.91 90.0458L156.72 89.3744ZM181.302 87.1799L185.145 85.3796Z"
          fill="#17152E"
        />
        <path
          d="M160.91 90.0458L156.72 89.3744M181.302 87.1799L185.145 85.3796"
          strokeLinecap="round"
          stroke="#17152E"
        />

        {/* Eyebrows */}
        <path
          d="M161.722 82.3701C163.373 80.6678 165.198 80.2013 167.197 80.9706"
          strokeLinecap="round"
          stroke="#17152E"
        />
        <path
          d="M172.671 79.571C174.322 77.8686 176.176 77.6081 178.232 78.7894"
          strokeLinecap="round"
          stroke="#17152E"
        />

        {/* Smiling mouth */}
        <path
          d="M169.411 96.7278C170.737 95.7013 172.062 95.4101 173.384 95.8544C174.707 96.2986 175.516 96.0798 175.813 95.198"
          strokeLinecap="round"
          stroke="#17152E"
        />
      </svg>
    </div>
  )
}

export default function MobileRecoveryPassword({
  reset = false,
  go,
  email: propEmail,
  setEmail: propSetEmail,
  sent: propSent,
  setSent: propSetSent,
  password: propPassword,
  setPassword: propSetPassword,
  confirmation: propConfirmation,
  setConfirmation: propSetConfirmation,
  show: propShow,
  setShow: propSetShow,
  formAttempted: propFormAttempted,
  setFormAttempted: propSetFormAttempted,
  onSubmitRecovery,
  onSubmitReset,
}: MobileRecoveryPasswordProps) {
  // Local state fallbacks if parent does not control them
  const [localEmail, setLocalEmail] = useState("")
  const [localSent, setLocalSent] = useState(false)
  const [localPassword, setLocalPassword] = useState("")
  const [localConfirmation, setLocalConfirmation] = useState("")
  const [localShow, setLocalShow] = useState(false)
  const [localAttempted, setLocalAttempted] = useState(false)
  const [loading, setLoading] = useState(false)

  const email = propEmail ?? localEmail
  const setEmail = propSetEmail ?? setLocalEmail

  const sent = propSent ?? localSent
  const setSent = propSetSent ?? setLocalSent

  const password = propPassword ?? localPassword
  const setPassword = propSetPassword ?? setLocalPassword

  const confirmation = propConfirmation ?? localConfirmation
  const setConfirmation = propSetConfirmation ?? setLocalConfirmation

  const show = propShow ?? localShow
  const setShow = propSetShow ?? setLocalShow

  const formAttempted = propFormAttempted ?? localAttempted
  const setFormAttempted = propSetFormAttempted ?? setLocalAttempted

  // Validation rules for Reset Password mode
  const validLength = password.length >= 8 && password.length <= 20
  const validMix = /[a-zA-Z]/.test(password) && /\d/.test(password)
  const same = password.length > 0 && password === confirmation
  const canReset = validLength && validMix && same

  const handleRecoverySubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormAttempted(true)
    if (onSubmitRecovery) {
      onSubmitRecovery(e)
    } else {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setSent(true)
      }, 400)
    }
  }

  const handleResetSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormAttempted(true)
    if (onSubmitReset) {
      onSubmitReset(e)
    } else {
      if (canReset) {
        setLoading(true)
        setTimeout(() => {
          setLoading(false)
          go("login")
        }, 500)
      }
    }
  }

  // When in reset password mode, render the dedicated 393 x 580 px mobile screen from Figma
  if (reset) {
    return (
      <MobileResetPassword
        go={go}
        password={password}
        setPassword={setPassword}
        confirmation={confirmation}
        setConfirmation={setConfirmation}
        show={show}
        setShow={setShow}
        formAttempted={formAttempted}
        setFormAttempted={setFormAttempted}
        onSubmitReset={onSubmitReset}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F6FC] flex flex-col items-center justify-start text-[#17152E] font-sans antialiased selection:bg-[#4F3CF0] selection:text-white">
      {/* 393px width Artboard Container */}
      <div className="w-full max-w-[393px] px-6 pt-6 pb-8 flex flex-col min-h-screen justify-between">
        <div>
          {/* Top Bar with Back Button (Figma clip0_2448_5247 x=24, y=8) */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={() => go("login")}
              className="inline-flex items-center gap-2 text-[#17152E] font-semibold text-[15px] hover:opacity-80 active:scale-95 transition-all cursor-pointer py-1 select-none"
              aria-label="Voltar para a página de login"
            >
              {/* Vector Arrow Path from Figma: M37.75 25.5L32.25 20L37.75 14.5 */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 19L8 12L15 5"
                  stroke="#17152E"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Voltar{reset ? " ao login" : ""}</span>
            </button>

            {/* Test Simulation Helper Toggle */}
            {!reset ? (
              <button
                type="button"
                onClick={() => setSent(!sent)}
                className="text-[11px] font-bold text-[#4F3CF0] bg-[#E9E6FF] hover:bg-[#DDD8FF] px-2.5 py-1 rounded-full transition-colors active:scale-95 cursor-pointer"
                title="Alternar estado de envio de link"
              >
                {sent ? "↺ Resetar envio" : "⚡ Simular envio"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setPassword("SenhaForte123")
                  setConfirmation("SenhaForte123")
                }}
                className="text-[11px] font-bold text-[#4F3CF0] bg-[#E9E6FF] hover:bg-[#DDD8FF] px-2.5 py-1 rounded-full transition-colors active:scale-95 cursor-pointer"
                title="Preencher senha válida de teste"
              >
                ⚡ Preencher
              </button>
            )}
          </div>

          {/* 3D Mascot Question Mark with Mentorina Character */}
          <MascotQuestionIllustration />

          {/* Headings & Subtitles */}
          {!reset ? (
            <div className="mt-3 mb-6">
              <h1 className="text-[25px] font-bold text-[#17152E] tracking-tight leading-snug">
                Esqueceu a senha?
              </h1>
              <p className="text-[14px] text-[#5F5B7D] mt-2 leading-relaxed font-normal">
                Digite seu e-mail cadastrado ou e-mail de recuperação para
                enviarmos um link de redefinição.
              </p>
            </div>
          ) : (
            <div className="mt-3 mb-6">
              <h1 className="text-[25px] font-bold text-[#17152E] tracking-tight leading-snug">
                Crie uma nova senha
              </h1>
              <p className="text-[14px] text-[#5F5B7D] mt-2 leading-relaxed font-normal">
                Escolha uma senha que você não use em outros sites.
              </p>
            </div>
          )}

          {/* Form Content */}
          {!reset ? (
            /* Mode 1: Recovery Email Request */
            <form
              onSubmit={handleRecoverySubmit}
              onInvalidCapture={() => setFormAttempted(true)}
              className={`flex flex-col gap-4 ${
                formAttempted ? "required-check" : ""
              }`}
            >
              {/* Input Field (Figma clip2_2448_5247: w=352, h=55, rx=11.5, border=#8C88AA) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-semibold text-[#17152E]">
                  E-mail de recuperação
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nome@email.com"
                  className="w-full h-[55px] px-4 rounded-[12px] bg-white border border-[#8C88AA] focus:border-[#4F3CF0] focus:ring-2 focus:ring-[#4F3CF0]/20 text-[15px] text-[#17152E] placeholder-[#8C88AA] outline-none transition-all"
                />
              </div>

              {/* CTA Button (Figma: w=353, h=56, rx=28, fill=#4F3CF0, text=Enviar link) */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[56px] rounded-[28px] bg-[#4F3CF0] hover:bg-[#4332D6] active:scale-[0.99] text-white font-bold text-[16px] shadow-sm transition-all flex items-center justify-center cursor-pointer mt-3 disabled:opacity-60"
              >
                {loading ? "Enviando link..." : "Enviar link"}
              </button>

              {/* Feedback Success Box (Figma clip3_2448_5247: w=353, h=78, rx=20, fill=#E3F5EC) */}
              {sent && (
                <div className="w-full rounded-[20px] bg-[#E3F5EC] border border-[#BCE8D1] p-4 mt-4 flex items-start gap-3 transition-all animate-fadeIn">
                  {/* Green Check Icon from Figma: M51 575.5L42.75 583.75L39 580 */}
                  <div className="w-7 h-7 rounded-full bg-[#137A51]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.3334 4L6.00008 11.3333L2.66675 8"
                        stroke="#137A51"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[15px] font-bold text-[#137A51] leading-none">
                      Link enviado!
                    </h3>
                    <p className="text-[13px] text-[#17152E] mt-1.5 leading-snug">
                      Confira sua caixa de entrada e siga as instruções para
                      criar uma nova senha.
                    </p>
                    <button
                      type="button"
                      onClick={() => go("reset")}
                      className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#4F3CF0] hover:underline mt-2.5 cursor-pointer"
                    >
                      <span>Abrir link recebido</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </div>
              )}
            </form>
          ) : (
            /* Mode 2: Reset / Create New Password */
            <form
              onSubmit={handleResetSubmit}
              onInvalidCapture={() => setFormAttempted(true)}
              className={`flex flex-col gap-4 ${
                formAttempted ? "required-check" : ""
              }`}
            >
              {/* Field: Nova Senha */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-semibold text-[#17152E]">
                  Nova senha
                </label>
                <div className="relative w-full">
                  <input
                    type={show ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua nova senha"
                    className="w-full h-[55px] pl-4 pr-12 rounded-[12px] bg-white border border-[#8C88AA] focus:border-[#4F3CF0] focus:ring-2 focus:ring-[#4F3CF0]/20 text-[15px] text-[#17152E] placeholder-[#8C88AA] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C88AA] hover:text-[#17152E] transition-colors p-1"
                    aria-label={show ? "Ocultar senha" : "Exibir senha"}
                  >
                    {show ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Field: Confirmar Nova Senha */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[14px] font-semibold text-[#17152E]">
                  Confirmar nova senha
                </label>
                <div className="relative w-full">
                  <input
                    type={show ? "text" : "password"}
                    required
                    value={confirmation}
                    onChange={(e) => setConfirmation(e.target.value)}
                    placeholder="Repita sua nova senha"
                    className="w-full h-[55px] pl-4 pr-12 rounded-[12px] bg-white border border-[#8C88AA] focus:border-[#4F3CF0] focus:ring-2 focus:ring-[#4F3CF0]/20 text-[15px] text-[#17152E] placeholder-[#8C88AA] outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C88AA] hover:text-[#17152E] transition-colors p-1"
                    aria-label={show ? "Ocultar senha" : "Exibir senha"}
                  >
                    {show ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Password Requirements Checklist */}
              <div className="bg-[#E9E6FF]/50 rounded-[14px] p-3.5 mt-1 border border-[#DDD8FF]">
                <span className="text-[12px] font-semibold text-[#17152E] block mb-2">
                  Requisitos para a nova senha:
                </span>
                <ul className="space-y-1.5 text-[12px]">
                  <li
                    className={`flex items-center gap-2 ${
                      validLength
                        ? "text-[#137A51] font-medium"
                        : "text-[#5F5B7D]"
                    }`}
                  >
                    <span className="text-[13px]">
                      {validLength ? "✓" : "○"}
                    </span>
                    <span>Entre 8 e 20 caracteres</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      validMix ? "text-[#137A51] font-medium" : "text-[#5F5B7D]"
                    }`}
                  >
                    <span className="text-[13px]">{validMix ? "✓" : "○"}</span>
                    <span>Letras e números</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      same ? "text-[#137A51] font-medium" : "text-[#5F5B7D]"
                    }`}
                  >
                    <span className="text-[13px]">{same ? "✓" : "○"}</span>
                    <span>As duas senhas são iguais</span>
                  </li>
                </ul>
              </div>

              {/* CTA Button: Redefinir senha */}
              <button
                type="submit"
                disabled={!canReset || loading}
                className="w-full h-[56px] rounded-[28px] bg-[#4F3CF0] hover:bg-[#4332D6] active:scale-[0.99] text-white font-bold text-[16px] shadow-sm transition-all flex items-center justify-center cursor-pointer mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Redefinindo..." : "Redefinir senha"}
              </button>
            </form>
          )}
        </div>

        {/* Footer / Copyright or Brand Note */}
        <div className="mt-8 text-center">
          <p className="text-[12px] text-[#8C88AA]">
            EduMentor AI © 2026 • Todos os direitos reservados
          </p>
        </div>
      </div>
    </div>
  )
}
