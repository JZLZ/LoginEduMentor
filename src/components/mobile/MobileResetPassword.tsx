import { useState, type FormEvent } from "react"

interface MobileResetPasswordProps {
  go: (screen: any) => void
  password?: string
  setPassword?: (password: string) => void
  confirmation?: string
  setConfirmation?: (confirmation: string) => void
  show?: boolean
  setShow?: (show: boolean) => void
  formAttempted?: boolean
  setFormAttempted?: (attempted: boolean) => void
  onSubmitReset?: (e: FormEvent<HTMLFormElement>) => void
}

/**
 * Mobile Version of "Crie uma nova senha" (Reset Password Screen)
 * Pixel-accurate implementation matching Figma SVG artboard (393 x 580 px).
 */
export default function MobileResetPassword({
  go,
  password: propPassword,
  setPassword: propSetPassword,
  confirmation: propConfirmation,
  setConfirmation: propSetConfirmation,
  show: propShow,
  setShow: propSetShow,
  setFormAttempted: propSetFormAttempted,
  onSubmitReset,
}: MobileResetPasswordProps) {
  // Local fallback states if not controlled from parent
  const [internalPassword, setInternalPassword] = useState("")
  const [internalConfirmation, setInternalConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [focusedField, setFocusedField] =
    useState<"password" | "confirmation" | null>("password")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const password = propPassword !== undefined ? propPassword : internalPassword
  const setPassword = propSetPassword || setInternalPassword

  const confirmation =
    propConfirmation !== undefined ? propConfirmation : internalConfirmation
  const setConfirmation = propSetConfirmation || setInternalConfirmation

  const isShowPassword = propShow !== undefined ? propShow : showPassword
  const toggleShowPassword = () => {
    if (propSetShow) {
      propSetShow(!propShow)
    } else {
      setShowPassword(!showPassword)
    }
  }

  // Validation rules according to Figma specs
  const rule1Valid = password.length >= 8
  const rule2Valid = /[a-zA-Z]/.test(password) && /\d/.test(password)
  const rule3Valid = password.length > 0 && password === confirmation
  const canSubmit = rule1Valid && rule2Valid && rule3Valid

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    propSetFormAttempted?.(true)

    if (!canSubmit) return

    if (onSubmitReset) {
      onSubmitReset(e)
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        go("login")
      }, 1200)
    }, 600)
  }

  return (
    <div className="w-full min-h-screen bg-[#F7F6FC] text-[#17152E] flex justify-center selection:bg-[#4F3CF0] selection:text-white">
      <div className="w-full max-w-[393px] min-h-[580px] px-6 pt-4 pb-8 flex flex-col justify-between">
        <div>
          {/* Top Bar: Back to login link + Helper test button */}
          <div className="h-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => go("login")}
              className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#17152E] hover:text-[#4F3CF0] transition-colors cursor-pointer group"
              aria-label="Voltar ao login"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transform transition-transform group-hover:-translate-x-0.5"
                aria-hidden="true"
              >
                {/* Arrow extracted from Figma: M37.75 25.5L32.25 20L37.75 14.5 */}
                <path
                  d="M15 19L8 12L15 5"
                  stroke="#17152E"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Voltar ao login</span>
            </button>

            {/* Quick Fill helper for testing */}
            <button
              type="button"
              onClick={() => {
                setPassword("SenhaForte123")
                setConfirmation("SenhaForte123")
              }}
              className="text-[11px] font-bold text-[#4F3CF0] bg-[#E9E6FF] hover:bg-[#DDD8FF] px-2.5 py-1 rounded-full transition-colors active:scale-95 cursor-pointer"
              title="Preencher senha válida para teste"
            >
              ⚡ Preencher
            </button>
          </div>

          {/* Heading & Subtitle (Figma: clip1_2448_5284, translate 24 56, w=345, h=94) */}
          <div className="mt-8 mb-6">
            <h1 className="text-[24px] font-bold text-[#17152E] tracking-tight leading-tight">
              Crie uma nova senha
            </h1>
            <p className="text-[14px] text-[#5F5B7D] mt-2 font-normal leading-relaxed">
              Escolha uma senha que você não use em outros sites.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col">
            {/* Field 1: Nova senha (Figma: clip2_2448_5284, translate 24 174, w=345, h=88) */}
            <div className="flex flex-col mb-4">
              <label className="text-[14px] font-semibold text-[#17152E] mb-2">
                Nova senha
              </label>
              <div className="relative w-full">
                <input
                  type={isShowPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••••"
                  className={`w-full h-[54px] pl-4 pr-12 rounded-[11px] bg-white text-[15px] text-[#17152E] placeholder-[#8C88AA] outline-none transition-all ${
                    focusedField === "password"
                      ? "border-2 border-[#4F3CF0] shadow-sm"
                      : "border border-[#8C88AA] hover:border-[#17152E]/40"
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5F5B7D] hover:text-[#17152E] transition-colors p-1.5 cursor-pointer"
                  aria-label={isShowPassword ? "Ocultar senha" : "Exibir senha"}
                >
                  {/* Figma Eye Icon */}
                  {isShowPassword ? (
                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                      <path
                        d="M0 7C0 7 3 0 10 0C17 0 20 7 20 7C20 7 17 14 10 14C3 14 0 7 0 7Z"
                        stroke="#5F5B7D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="10"
                        cy="7"
                        r="3"
                        stroke="#5F5B7D"
                        strokeWidth="2"
                      />
                      <line
                        x1="2"
                        y1="1"
                        x2="18"
                        y2="13"
                        stroke="#5F5B7D"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                      <path
                        d="M0 7C0 7 3 0 10 0C17 0 20 7 20 7C20 7 17 14 10 14C3 14 0 7 0 7Z"
                        stroke="#5F5B7D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="10"
                        cy="7"
                        r="3"
                        stroke="#5F5B7D"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Field 2: Confirmar nova senha (Figma: clip3_2448_5284, translate 24 286, w=345, h=88) */}
            <div className="flex flex-col mb-6">
              <label className="text-[14px] font-semibold text-[#17152E] mb-2">
                Confirmar nova senha
              </label>
              <div className="relative w-full">
                <input
                  type={showConfirmation ? "text" : "password"}
                  required
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  onFocus={() => setFocusedField("confirmation")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••••"
                  className={`w-full h-[55px] pl-4 pr-12 rounded-[11.5px] bg-white text-[15px] text-[#17152E] placeholder-[#8C88AA] outline-none transition-all ${
                    focusedField === "confirmation"
                      ? "border-2 border-[#4F3CF0] shadow-sm"
                      : "border border-[#8C88AA] hover:border-[#17152E]/40"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmation(!showConfirmation)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5F5B7D] hover:text-[#17152E] transition-colors p-1.5 cursor-pointer"
                  aria-label={
                    showConfirmation
                      ? "Ocultar confirmação de senha"
                      : "Exibir confirmação de senha"
                  }
                >
                  {/* Figma Eye Icon */}
                  {showConfirmation ? (
                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                      <path
                        d="M0 7C0 7 3 0 10 0C17 0 20 7 20 7C20 7 17 14 10 14C3 14 0 7 0 7Z"
                        stroke="#5F5B7D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="10"
                        cy="7"
                        r="3"
                        stroke="#5F5B7D"
                        strokeWidth="2"
                      />
                      <line
                        x1="2"
                        y1="1"
                        x2="18"
                        y2="13"
                        stroke="#5F5B7D"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  ) : (
                    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                      <path
                        d="M0 7C0 7 3 0 10 0C17 0 20 7 20 7C20 7 17 14 10 14C3 14 0 7 0 7Z"
                        stroke="#5F5B7D"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="10"
                        cy="7"
                        r="3"
                        stroke="#5F5B7D"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements Checklist (Figma clips 4, 5, 6, y=398..470) */}
            <div className="flex flex-col gap-2.5 mb-6">
              {/* Requirement 1: Pelo menos 8 caracteres (Figma: clip4_2448_5284) */}
              <div className="flex items-center gap-3">
                {rule1Valid ? (
                  /* Green checkmark from Figma: M39 402.5L30.75 410.75L27 407 stroke="#137A51" */
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M15 5.5L6.75 13.75L3 10"
                      stroke="#137A51"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  /* Neutral gray circle: stroke="#8C88AA" */
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
                      r="6"
                      stroke="#8C88AA"
                      strokeWidth="2"
                    />
                  </svg>
                )}
                <span
                  className={`text-[13px] transition-colors ${
                    rule1Valid
                      ? "text-[#17152E] font-medium"
                      : "text-[#5F5B7D] font-normal"
                  }`}
                >
                  Pelo menos 8 caracteres
                </span>
              </div>

              {/* Requirement 2: Letras e números (Figma: clip5_2448_5284) */}
              <div className="flex items-center gap-3">
                {rule2Valid ? (
                  /* Green checkmark from Figma: stroke="#137A51" */
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M15 5.5L6.75 13.75L3 10"
                      stroke="#137A51"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  /* Neutral gray circle: stroke="#8C88AA" */
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
                      r="6"
                      stroke="#8C88AA"
                      strokeWidth="2"
                    />
                  </svg>
                )}
                <span
                  className={`text-[13px] transition-colors ${
                    rule2Valid
                      ? "text-[#17152E] font-medium"
                      : "text-[#5F5B7D] font-normal"
                  }`}
                >
                  Letras e números
                </span>
              </div>

              {/* Requirement 3: As duas senhas são iguais (Figma: clip6_2448_5284) */}
              <div className="flex items-center gap-3">
                {rule3Valid ? (
                  /* Green checkmark from Figma: stroke="#137A51" */
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="shrink-0"
                  >
                    <path
                      d="M15 5.5L6.75 13.75L3 10"
                      stroke="#137A51"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  /* Neutral gray circle: stroke="#8C88AA" */
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
                      r="6"
                      stroke="#8C88AA"
                      strokeWidth="2"
                    />
                  </svg>
                )}
                <span
                  className={`text-[13px] transition-colors ${
                    rule3Valid
                      ? "text-[#17152E] font-medium"
                      : "text-[#5F5B7D] font-normal"
                  }`}
                >
                  As duas senhas são iguais
                </span>
              </div>
            </div>

            {/* CTA Button: Redefinir senha (Figma: x=24, y=492, w=345, h=56, rx=28, fill=#4F3CF0) */}
            <button
              type="submit"
              disabled={loading || success}
              className={`w-full h-[56px] rounded-[28px] font-bold text-[16px] transition-all flex items-center justify-center cursor-pointer shadow-sm ${
                canSubmit
                  ? "bg-[#4F3CF0] hover:bg-[#4332D6] active:scale-[0.99] text-white"
                  : "bg-[#4F3CF0] text-white opacity-85 hover:opacity-100"
              }`}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Redefinindo...
                </span>
              ) : success ? (
                "Senha redefinida com sucesso! 🎉"
              ) : (
                "Redefinir senha"
              )}
            </button>
          </form>
        </div>

        {/* Success toast / notification if just reset */}
        {success && (
          <div className="mt-4 p-3 rounded-[12px] bg-[#E3F5EC] border border-[#BCE8D1] text-center text-[13px] font-semibold text-[#137A51] animate-fadeIn">
            Redirecionando para a tela de login...
          </div>
        )}
      </div>
    </div>
  )
}
