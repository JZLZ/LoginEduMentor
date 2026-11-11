import { useState, useEffect, type FormEvent } from "react"
import { authApi } from "../../services/api"
import {
  validatePassword,
  evaluatePasswordRules,
  recordPreviousPassword,
  getStoredPreviousPassword,
} from "../../utils/passwordValidation"

function RequirementItem({ valid, label }: { valid: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      {valid ? (
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
        <svg
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          className="shrink-0"
        >
          <circle cx="9" cy="9" r="6" stroke="#8C88AA" strokeWidth="2" />
        </svg>
      )}
      <span
        className={`text-[13px] transition-colors ${
          valid ? "text-[#17152E] font-medium" : "text-[#5F5B7D] font-normal"
        }`}
      >
        {label}
      </span>
    </div>
  )
}

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
  token?: string
  tokenValid?: boolean | null
  tokenEmail?: string | null
  validatingToken?: boolean
  loading?: boolean
  error?: string | null
  successMessage?: string | null
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
  token: propToken,
  tokenValid: propTokenValid,
  tokenEmail: propTokenEmail,
  validatingToken: propValidatingToken,
  loading: propLoading,
  error: propError,
  successMessage: propSuccessMessage,
  onSubmitReset,
}: MobileResetPasswordProps) {
  // Local fallback states if not controlled from parent
  const [internalPassword, setInternalPassword] = useState("")
  const [internalConfirmation, setInternalConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [focusedField, setFocusedField] =
    useState<"password" | "confirmation" | null>("password")
  const [internalLoading, setInternalLoading] = useState(false)
  const [internalSuccess, setInternalSuccess] = useState(false)
  const [internalError, setInternalError] = useState<string | null>(null)
  const [internalTokenValid, setInternalTokenValid] = useState<boolean | null>(
    null,
  )
  const [internalTokenEmail, setInternalTokenEmail] = useState<string | null>(
    null,
  )
  const [internalValidating, setInternalValidating] = useState(false)

  // Resolve token from prop or URL
  const token =
    propToken ??
    (() => {
      if (typeof window !== "undefined") {
        const p = new URLSearchParams(window.location.search).get("token")
        if (p) return p
        const hash = window.location.hash
        if (hash.includes("token=")) {
          const queryPart = hash.includes("?")
            ? hash.substring(hash.indexOf("?") + 1)
            : hash
          return new URLSearchParams(queryPart).get("token") || ""
        }
      }
      return ""
    })()

  const password = propPassword !== undefined ? propPassword : internalPassword
  const setPassword = propSetPassword || setInternalPassword

  const confirmation =
    propConfirmation !== undefined ? propConfirmation : internalConfirmation
  const setConfirmation = propSetConfirmation || setInternalConfirmation

  const isShowPassword = propShow !== undefined ? propShow : showPassword
  const setPasswordVisibility = (val: boolean) => {
    if (propSetShow) {
      propSetShow(val)
    } else {
      setShowPassword(val)
    }
  }

  useEffect(() => {
    if (!isShowPassword && !showConfirmation) return
    const handleGlobalRelease = () => {
      setPasswordVisibility(false)
      setShowConfirmation(false)
    }
    window.addEventListener("mouseup", handleGlobalRelease)
    window.addEventListener("touchend", handleGlobalRelease)
    return () => {
      window.removeEventListener("mouseup", handleGlobalRelease)
      window.removeEventListener("touchend", handleGlobalRelease)
    }
  }, [isShowPassword, showConfirmation, propSetShow])

  const loading = propLoading ?? internalLoading
  const setLoading = setInternalLoading

  const error = propError ?? internalError
  const setError = setInternalError

  const tokenValid =
    propTokenValid !== undefined ? propTokenValid : internalTokenValid
  const tokenEmail = propTokenEmail ?? internalTokenEmail
  const validatingToken = propValidatingToken ?? internalValidating
  const success = internalSuccess

  // Auto-validate token on mount if token is provided and parent hasn't validated yet
  useEffect(() => {
    if (!token || propTokenValid !== undefined) return

    let active = true
    setInternalValidating(true)
    authApi
      .validarTokenRecuperacao(token)
      .then((res) => {
        if (active) {
          setInternalTokenValid(true)
          setInternalTokenEmail(res.data?.email || null)
          setInternalError(null)
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setInternalTokenValid(false)
          setInternalError(
            err instanceof Error
              ? err.message
              : "Token de recuperação inválido ou expirado.",
          )
        }
      })
      .finally(() => {
        if (active) setInternalValidating(false)
      })

    return () => {
      active = false
    }
  }, [token, propTokenValid])

  // Resolução de dados do usuário para aplicação das regras de negócio de senha
  const targetEmail =
    tokenEmail ||
    (typeof window !== "undefined"
      ? localStorage.getItem("sherlock_user_email") || undefined
      : undefined)

  let resolvedName =
    typeof window !== "undefined"
      ? localStorage.getItem("sherlock_user_fullname") ||
        localStorage.getItem("sherlock_user_name") ||
        undefined
      : undefined

  if (!resolvedName && targetEmail && typeof window !== "undefined") {
    try {
      const rawMap = localStorage.getItem("sherlock_user_names_by_email")
      if (rawMap) {
        const map = JSON.parse(rawMap)
        if (map[targetEmail.toLowerCase()]) {
          resolvedName = map[targetEmail.toLowerCase()]
        }
      }
    } catch {
      // ignore
    }
  }

  const prevPass = getStoredPreviousPassword(targetEmail)
  const hasPreviousPassword = !!prevPass

  const rulesContext = {
    userName: resolvedName,
    email: targetEmail,
    previousPassword: prevPass,
    confirmation,
  }

  const {
    ruleLength,
    ruleCase,
    ruleNumber,
    ruleSpecial,
    ruleNoSpaces,
    ruleNoSequentialNumbers,
    ruleNoSequentialLetters,
    ruleNoRepeated,
    ruleNoName,
    ruleNoEmail,
    ruleNotPrevious,
    ruleSame,
    isValid: canSubmit,
  } = evaluatePasswordRules(password, rulesContext)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    propSetFormAttempted?.(true)
    setError(null)

    const validation = validatePassword(password, rulesContext)
    if (!validation.valid) {
      setError(validation.error || "Senha inválida.")
      return
    }

    if (onSubmitReset) {
      onSubmitReset(e)
      return
    }

    if (!token) {
      // Standalone simulation fallback
      setLoading(true)
      recordPreviousPassword(password)
      setTimeout(() => {
        setLoading(false)
        setInternalSuccess(true)
        setTimeout(() => {
          go("login")
        }, 1200)
      }, 600)
      return
    }

    setLoading(true)
    try {
      await authApi.redefinirSenha(token, password, confirmation)
      recordPreviousPassword(password)
      setInternalSuccess(true)
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.history.replaceState({}, "", window.location.pathname)
        }
        go("login")
      }, 1500)
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Erro ao redefinir a senha."
      setError(msg)
    } finally {
      setLoading(false)
    }
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
                setPassword("SenhaForte@2026")
                setConfirmation("SenhaForte@2026")
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
          {validatingToken && (
            <div className="w-full rounded-[14px] bg-[#E9E6FF] p-3.5 text-[13px] text-[#4F3CF0] mb-4 flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4 text-[#4F3CF0]"
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
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span>Validando link de recuperação...</span>
            </div>
          )}

          {tokenValid === false && (
            <div className="w-full rounded-[14px] bg-[#FEE4E2] border border-[#FECDCA] p-4 text-[13px] text-[#B42318] mb-4 flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="shrink-0 mt-0.5"
                >
                  <circle
                    cx="8"
                    cy="8"
                    r="7"
                    stroke="#B42318"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 4.5V8.5M8 11.5H8.01"
                    stroke="#B42318"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <p className="font-bold text-[14px]">
                    Link inválido ou expirado
                  </p>
                  <p className="mt-1 text-[13px] text-[#17152E]">
                    {error ||
                      "O link de recuperação é inválido ou já expirou. Solicite um novo link."}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => go("recovery")}
                className="w-full h-[44px] rounded-[22px] bg-[#4F3CF0] text-white font-bold text-[14px] cursor-pointer"
              >
                Solicitar novo link
              </button>
            </div>
          )}

          {tokenEmail && tokenValid !== false && (
            <div className="w-full rounded-[12px] bg-[#E9E6FF]/50 border border-[#4F3CF0]/20 p-2.5 text-[13px] text-[#5F5B7D] mb-4">
              Redefinindo senha para:{" "}
              <strong className="text-[#17152E]">{tokenEmail}</strong>
            </div>
          )}

          {error && tokenValid !== false && (
            <div
              role="alert"
              className="w-full rounded-[14px] bg-[#FEE4E2] border border-[#FECDCA] p-3 text-[13px] text-[#B42318] leading-tight mb-4 flex items-start gap-2 animate-fadeIn"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0 mt-0.5"
              >
                <circle
                  cx="8"
                  cy="8"
                  r="7"
                  stroke="#B42318"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 4.5V8.5M8 11.5H8.01"
                  stroke="#B42318"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {internalSuccess && (
            <div className="w-full rounded-[14px] bg-[#E3F5EC] border border-[#BCE8D1] p-3.5 text-[13px] text-[#137A51] mb-4 flex items-start gap-2 animate-fadeIn">
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0 mt-0.5"
              >
                <path
                  d="M13.3334 4L6.00008 11.3333L2.66675 8"
                  stroke="#137A51"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div>
                <p className="font-bold text-[14px]">
                  Senha redefinida com sucesso!
                </p>
                <p className="mt-0.5 text-[12px] text-[#17152E]">
                  Redirecionando para o login...
                </p>
              </div>
            </div>
          )}

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
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setPasswordVisibility(true)
                  }}
                  onMouseUp={() => setPasswordVisibility(false)}
                  onMouseLeave={() => setPasswordVisibility(false)}
                  onTouchStart={() => setPasswordVisibility(true)}
                  onTouchEnd={() => setPasswordVisibility(false)}
                  onTouchCancel={() => setPasswordVisibility(false)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault()
                      setPasswordVisibility(true)
                    }
                  }}
                  onKeyUp={() => setPasswordVisibility(false)}
                  onBlur={() => setPasswordVisibility(false)}
                  onClick={(e) => e.preventDefault()}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors p-1.5 cursor-pointer select-none ${
                    isShowPassword ? "text-[#4F3CF0]" : "text-[#5F5B7D] hover:text-[#17152E]"
                  }`}
                  aria-label="Pressione e segure para visualizar a nova senha"
                >
                  <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                    <path
                      d="M0 7C0 7 3 0 10 0C17 0 20 7 20 7C20 7 17 14 10 14C3 14 0 7 0 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="10"
                      cy="7"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
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
                  onMouseDown={(e) => {
                    e.preventDefault()
                    setShowConfirmation(true)
                  }}
                  onMouseUp={() => setShowConfirmation(false)}
                  onMouseLeave={() => setShowConfirmation(false)}
                  onTouchStart={() => setShowConfirmation(true)}
                  onTouchEnd={() => setShowConfirmation(false)}
                  onTouchCancel={() => setShowConfirmation(false)}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.key === "Enter") {
                      e.preventDefault()
                      setShowConfirmation(true)
                    }
                  }}
                  onKeyUp={() => setShowConfirmation(false)}
                  onBlur={() => setShowConfirmation(false)}
                  onClick={(e) => e.preventDefault()}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors p-1.5 cursor-pointer select-none ${
                    showConfirmation ? "text-[#4F3CF0]" : "text-[#5F5B7D] hover:text-[#17152E]"
                  }`}
                  aria-label="Pressione e segure para visualizar a confirmação da nova senha"
                >
                  <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                    <path
                      d="M0 7C0 7 3 0 10 0C17 0 20 7 20 7C20 7 17 14 10 14C3 14 0 7 0 7Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <circle
                      cx="10"
                      cy="7"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Password Requirements Checklist (Standardized Business Rules) */}
            <div className="flex flex-col gap-2.5 mb-6">
              <RequirementItem
                valid={ruleLength}
                label="Entre 8 e 20 caracteres"
              />
              <RequirementItem
                valid={ruleCase}
                label="Letras maiúsculas e minúsculas"
              />
              <RequirementItem
                valid={ruleNumber}
                label="Pelo menos um número"
              />
              <RequirementItem
                valid={ruleSpecial}
                label="Caractere especial (!@#$%&*)"
              />
              <RequirementItem
                valid={ruleNoSpaces}
                label="Sem espaços"
              />
              <RequirementItem
                valid={ruleNoSequentialNumbers}
                label="Sem números sequenciais (ex.: 123)"
              />
              <RequirementItem
                valid={ruleNoSequentialLetters}
                label="Sem sequência alfabética (ex.: abc)"
              />
              <RequirementItem
                valid={ruleNoRepeated}
                label="Sem caracteres repetidos (ex.: aa, 11)"
              />
              {resolvedName && (
                <RequirementItem
                  valid={ruleNoName}
                  label="Sem o seu nome ou partes dele"
                />
              )}
              {targetEmail && (
                <RequirementItem
                  valid={ruleNoEmail}
                  label="Sem partes do seu e-mail"
                />
              )}
              {hasPreviousPassword && (
                <RequirementItem
                  valid={ruleNotPrevious}
                  label="Diferente da senha anterior"
                />
              )}
              <RequirementItem
                valid={ruleSame}
                label="As duas senhas são iguais"
              />
            </div>

            {/* CTA Button: Redefinir senha (Figma: x=24, y=492, w=345, h=56, rx=28, fill=#4F3CF0) */}
            <button
              type="submit"
              disabled={loading || success || tokenValid === false}
              className={`w-full h-[56px] rounded-[28px] font-bold text-[16px] transition-all flex items-center justify-center cursor-pointer shadow-sm ${
                canSubmit && tokenValid !== false
                  ? "bg-[#4F3CF0] hover:bg-[#4332D6] active:scale-[0.99] text-white"
                  : "bg-[#4F3CF0] text-white opacity-85 hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
