import { useState, useEffect } from "react"
import type {
  FormEvent,
  InputHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from "react"
// ============================================================================
// PARTES DO LOGO (EduMentor AI) - Importação das camadas exportadas do Figma:
// ============================================================================
// 1. Ícone/Símbolo (Group): Balão roxo com escadaria branca e brilhos verdes
import logoMark from "./assets/logo/EduMentor AI — Plataforma Adaptativa de Estudos e Tutoria/Group.png"
// 2. Tipografia principal (Vector): Palavra "EduMentor"
import logoWord from "./assets/logo/EduMentor AI — Plataforma Adaptativa de Estudos e Tutoria/Vector.png"
// 3. Fundo do badge (Vector-1): Pílula verde-limão de destaque
import logoBadge from "./assets/logo/EduMentor AI — Plataforma Adaptativa de Estudos e Tutoria/Vector-1.png"
// 4. Texto do badge (Vector-2): Sigla "AI" em preto dentro da pílula
import logoAi from "./assets/logo/EduMentor AI — Plataforma Adaptativa de Estudos e Tutoria/Vector-2.png"
import { authApi, coursesApi, onboardingApi, tokenStorage } from "./services/api"
import type { CourseOption } from "./services/api"
import LandingPage from "./components/LandingPage"
import TermsModal from "./TermsModal"

type Screen = "landing" | "login" | "signup" | "recovery" | "reset" | "course" | "start" | "quiz" | "subjects" | "goal" | "done"

/**
 * Componente do Logo completo da marca EduMentor AI.
 * Utilizado nas telas de autenticação (Login/Cadastro) e no cabeçalho do Onboarding.
 */
function BrandLogo() {
  return (
    <div className="brand-logo" role="img" aria-label="EduMentor AI">
      {/* PARTE 1: Ícone / Símbolo da marca (balão roxo + escada + estrelas) */}
      <img className="brand-logo-mark" src={logoMark} alt="" />

      {/* PARTE 2: Texto com o nome "EduMentor" */}
      <img className="brand-logo-word" src={logoWord} alt="" />

      {/* PARTE 3: Pílula verde-limão de fundo para a sigla "AI" */}
      <img className="brand-logo-badge" src={logoBadge} alt="" />

      {/* PARTE 4: Texto "AI" em preto centralizado sobre o badge verde */}
      <img className="brand-logo-ai" src={logoAi} alt="" />
    </div>
  )
}

function BrandPanel() {
  return (
    <aside className="brand-panel">
      <BrandLogo />
      <div className="brand-copy">
        <h1>
          Sua trilha até o
          <br />
          ENEM, com uma
          <br />
          tutora 24h.
        </h1>
        <p>
          Trilhas personalizadas, simulados com questões reais e a Mentorina
          para tirar dúvidas a qualquer hora.
        </p>
      </div>
      <div className="brand-stairs" aria-hidden="true">
        <span />
        <span />
        <span />
        <i />
      </div>
    </aside>
  )
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  className?: string
  children?: ReactNode
}

function Field({
  label,
  type = "text",
  placeholder,
  children,
  className = "",
  required = true,
  ...rest
}: FieldProps) {
  return (
    <label className={`field ${className}`}>
      {label && <span>{label}</span>}
      <span className="input-shell">
        <input
          type={type}
          placeholder={placeholder ?? label}
          aria-label={label ?? placeholder}
          required={required}
          {...rest}
        />
        {children}
      </span>
    </label>
  )
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3}\.\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3}\.\d{3}\.\d{3})(\d{1,2})$/, "$1-$2")
}

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  if (digits.length <= 2) return digits ? `(${digits}` : ""

  const areaCode = digits.slice(0, 2)
  const subscriber = digits.slice(2)
  return `(${areaCode}) ${subscriber.slice(0, 5)}${
    subscriber.length > 5 ? `-${subscriber.slice(5)}` : ""
  }`
}

function PhoneField({
  label = "Celular",
  placeholder = "(11) 90000-0000",
  value,
  onChange,
}: {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
} = {}) {
  const [internalPhone, setInternalPhone] = useState("")
  const phone = value !== undefined ? value : internalPhone
  const setPhone = onChange ?? setInternalPhone

  return (
    <label className="field">
      {label && <span>{label}</span>}
      <span className="input-shell">
        <input
          type="tel"
          inputMode="numeric"
          placeholder={placeholder}
          aria-label={label ?? "Celular"}
          pattern="\(\d{2}\) \d{5}-\d{4}"
          maxLength={15}
          required
          value={phone}
          onChange={(event) => setPhone(formatPhone(event.currentTarget.value))}
        />
      </span>
    </label>
  )
}

function isValidCpf(value: string) {
  const digits = value.replace(/\D/g, "")
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false

  const calculateDigit = (length: number) => {
    const sum = [...digits.slice(0, length)].reduce(
      (total, digit, index) => total + Number(digit) * (length + 1 - index),
      0,
    )
    const remainder = sum % 11
    return remainder < 2 ? 0 : 11 - remainder
  }

  return (
    calculateDigit(9) === Number(digits[9]) &&
    calculateDigit(10) === Number(digits[10])
  )
}

function CpfField({
  label = "CPF do responsável",
  placeholder = "000.000.000-00",
  value,
  onChange,
}: {
  label?: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="field">
      {label && <span>{label}</span>}
      <span className="input-shell">
        <input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          aria-label={label ?? "CPF do responsável"}
          pattern="\d{3}\.\d{3}\.\d{3}-\d{2}"
          maxLength={14}
          required
          value={value}
          onChange={(event) => {
            const formattedValue = formatCpf(event.currentTarget.value)
            onChange(formattedValue)
            event.currentTarget.setCustomValidity(
              formattedValue.length === 14 && !isValidCpf(formattedValue)
                ? "Informe um CPF válido."
                : "",
            )
          }}
        />
      </span>
    </label>
  )
}

function PasswordVisibilityButton({
  visible,
  toggle,
}: {
  visible: boolean
  toggle: () => void
}) {
  return (
    <button
      className="input-action"
      type="button"
      onClick={toggle}
      aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
      aria-pressed={visible}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
        {visible && <path d="m4 4 16 16" />}
      </svg>
    </button>
  )
}

function AuthTabs({
  active,
  go,
}: {
  active: "login" | "signup"
  go: (screen: Screen) => void
}) {
  return (
    <nav className="auth-tabs" aria-label="Acesso">
      <button
        type="button"
        className={active === "signup" ? "active" : ""}
        onClick={() => go("signup")}
      >
        Criar conta
      </button>
      <button
        type="button"
        className={active === "login" ? "active" : ""}
        onClick={() => go("login")}
      >
        Fazer login
      </button>
    </nav>
  )
}

function AccountModal({
  close,
  continueFlow,
}: {
  close: () => void
  continueFlow: () => void
}) {
  const [account, setAccount] = useState("vestibulando")
  const user = tokenStorage.getUser()
  const accounts = [
    {
      id: "vestibulando",
      title: "Vestibulando",
      description: "Preparação para o ENEM · Medicina",
      icon: "◎",
    },
    {
      id: "universitario",
      title: "Universitário",
      description: "Graduação · Engenharia Civil",
      icon: "◇",
    },
  ]

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="account-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="account-title"
      >
        <span className="eyebrow">Passo de segurança</span>
        <h2 id="account-title">
          {user?.name
            ? `Olá, ${user.name}! Escolha seu perfil:`
            : "Com qual conta você quer entrar?"}
        </h2>
        <p>
          Encontramos mais de um perfil vinculado a{" "}
          {user?.email ? <strong>{user.email}</strong> : "sua conta"}. Escolha
          como quer navegar hoje:
        </p>
        <div className="account-list">
          {accounts.map(({ id, title, description, icon }) => (
            <button
              type="button"
              className={`account-option ${account === id ? "selected" : ""}`}
              onClick={() => setAccount(id)}
              key={id}
            >
              <i>{icon}</i>
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
              <b>{account === id ? "✓" : ""}</b>
            </button>
          ))}
        </div>
        <div className="token-note">
          Por segurança, faça sua escolha em alguns minutos. Se o tempo acabar,
          é só entrar de novo.
        </div>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={close}>
            Voltar ao login
          </button>
          <button
            type="button"
            className="primary-button"
            onClick={continueFlow}
          >
            Entrar com esta conta
          </button>
        </div>
      </section>
    </div>
  )
}

function Login({ go }: { go: (screen: Screen) => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [accounts, setAccounts] = useState(false)
  const [formAttempted, setFormAttempted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sherlock_remembered_login")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.email) setEmail(parsed.email)
        if (parsed.password) setPassword(parsed.password)
        setRememberMe(true)
      }
    } catch {
      // ignore
    }
  }, [])

  function handleRememberChange(checked: boolean) {
    setRememberMe(checked)
    if (!checked) {
      try {
        localStorage.removeItem("sherlock_remembered_login")
      } catch {
        // ignore
      }
    } else {
      try {
        if (email || password) {
          localStorage.setItem(
            "sherlock_remembered_login",
            JSON.stringify({ email, password }),
          )
        }
      } catch {
        // ignore
      }
    }
  }

  function fillAdminData() {
    setEmail("admin@admin.com")
    setPassword("Admin@123")
    setErrorMessage(null)
    if (rememberMe) {
      try {
        localStorage.setItem(
          "sherlock_remembered_login",
          JSON.stringify({ email: "admin@admin.com", password: "Admin@123" }),
        )
      } catch {
        // ignore
      }
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (rememberMe) {
      try {
        localStorage.setItem(
          "sherlock_remembered_login",
          JSON.stringify({ email, password }),
        )
      } catch {
        // ignore
      }
    } else {
      try {
        localStorage.removeItem("sherlock_remembered_login")
      } catch {
        // ignore
      }
    }

    setLoading(true)
    setErrorMessage(null)

    try {
      await authApi.login(email, password)
      setAccounts(true)
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao efetuar login"
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="auth-form login-form">
        <AuthTabs active="login" go={go} />
        <header className="form-heading">
          <h2>Que bom te ver de novo!</h2>
          <p>Entre para iniciar sua trilha até o ENEM.</p>
        </header>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "12px",
          }}
        >
          <button
            type="button"
            className="text-button"
            style={{
              color: "var(--indigo)",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              background: "var(--lavender)",
              borderRadius: "999px",
              cursor: "pointer",
              maxWidth: "100%",
              whiteSpace: "normal",
              textAlign: "right",
            }}
            onClick={fillAdminData}
          >
            ⚡ Preencher dados de teste (Admin)
          </button>
        </div>
        <form
          className={formAttempted ? "required-check" : ""}
          onInvalidCapture={() => setFormAttempted(true)}
          onSubmit={submit}
        >
          {errorMessage && (
            <div className="form-alert error" role="alert">
              {errorMessage}
            </div>
          )}
          <Field
            type="email"
            placeholder="nome@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            type={showPassword ? "text" : "password"}
            placeholder="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          >
            <PasswordVisibilityButton
              visible={showPassword}
              toggle={() => setShowPassword(!showPassword)}
            />
          </Field>
          <button
            className="text-button forgot"
            type="button"
            onClick={() => go("recovery")}
          >
            Esqueceu sua senha?
          </button>
          <label className="check-row">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => handleRememberChange(e.target.checked)}
            />
            <span>Manter conectado</span>
          </label>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="auth-switch">
          Não possui uma conta?{" "}
          <button type="button" onClick={() => go("signup")}>
            Criar conta
          </button>
        </p>
        <button className="support-link" type="button">
          Precisa de ajuda? <strong>Fale com o suporte</strong>
        </button>
      </div>
      {accounts && (
        <AccountModal
          close={() => setAccounts(false)}
          continueFlow={() => go("course")}
        />
      )}
    </AuthLayout>
  )
}

function formatBirthDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8)
  return digits
    .replace(/^(\d{2})(\d)/, "$1/$2")
    .replace(/^(\d{2}\/\d{2})(\d)/, "$1/$2")
}

function getBirthDateError(value: string) {
  if (!value) return ""
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return "Use o formato dd/mm/aaaa."
  }
  if (!parseBirthDate(value)) {
    return "Informe uma data válida, que não seja futura."
  }
  return ""
}

function parseBirthDate(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return null

  const [, day, month, year] = match
  const date = new Date(Number(year), Number(month) - 1, Number(day))
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day) ||
    date > today
  ) {
    return null
  }

  return date
}

function getAge(birthDate: string) {
  const date = parseBirthDate(birthDate)
  if (!date) return null

  const today = new Date()
  const hasHadBirthdayThisYear =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate())

  return (
    today.getFullYear() - date.getFullYear() - (hasHadBirthdayThisYear ? 0 : 1)
  )
}

function Signup({ go }: { go: (screen: Screen) => void }) {
  const [fullName, setFullName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [phone, setPhone] = useState("")
  const [education, setEducation] = useState("")
  const [guardianCpf, setGuardianCpf] = useState("")
  const [guardianName, setGuardianName] = useState("")
  const [email, setEmail] = useState("")
  const [recoveryEmail, setRecoveryEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [formAttempted, setFormAttempted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const age = getAge(birthDate)
  const minor = age !== null && age < 18

  function fillTestData() {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    setFullName("Júlia Andrade")
    setBirthDate("15/06/2004")
    setPhone("(11) 90000-0000")
    setEducation("medio-completo")
    setEmail(`julia.andrade${randomSuffix}@email.com`)
    setRecoveryEmail(`nome${randomSuffix}@email.com`)
    setPassword("EduMentor2026@")
    setConfirmPassword("EduMentor2026@")
    setAccepted(true)
    setErrorMessage(null)
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!accepted) return
    if (age === null) return
    if (minor && !isValidCpf(guardianCpf)) return

    const parts = fullName.trim().split(/\s+/)
    if (parts.length < 2 || !parts[1]) {
      setErrorMessage("Por favor, digite seu nome e sobrenome completo.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.(com|com\.br)$/.test(email.trim().toLowerCase())) {
      setErrorMessage(
        "O e-mail deve ter o formato válido (ex: nome@dominio.com ou .com.br).",
      )
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage("As duas senhas informadas não são iguais.")
      return
    }

    if (password.length < 6 || password.length > 30) {
      setErrorMessage("A senha deve ter entre 6 e 30 caracteres.")
      return
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "A senha precisa conter pelo menos: uma letra maiúscula, uma minúscula, um número e um caractere especial (@#$%).",
      )
      return
    }

    setLoading(true)
    setErrorMessage(null)

    const name = parts[0]
    const surname = parts.slice(1).join(" ")

    try {
      await authApi.register({
        name,
        surname,
        email,
        password,
      })

      // Realiza login automático com o novo usuário para obter o token JWT
      try {
        await authApi.login(email, password)
      } catch {
        // Se login falhar por algum motivo, prossegue normalmente
      }

      go("course")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao cadastrar usuário"
      setErrorMessage(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="auth-form signup-form">
        <AuthTabs active="signup" go={go} />
        <header className="form-heading">
          <h2>Bora criar sua conta?</h2>
          <p>Leva menos de 2 minutos.</p>
        </header>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "12px",
          }}
        >
          <button
            type="button"
            className="text-button"
            style={{
              color: "var(--indigo)",
              fontSize: "12px",
              fontWeight: 700,
              padding: "4px 10px",
              background: "var(--lavender)",
              borderRadius: "999px",
              cursor: "pointer",
              maxWidth: "100%",
              whiteSpace: "normal",
              textAlign: "right",
            }}
            onClick={fillTestData}
          >
            ⚡ Simular preenchimento com dados válidos
          </button>
        </div>
        <form
          className={formAttempted ? "required-check" : ""}
          onInvalidCapture={() => setFormAttempted(true)}
          onSubmit={submit}
        >
          {errorMessage && (
            <div className="form-alert error" role="alert">
              {errorMessage}
              <div style={{ marginTop: "8px" }}>
                <button
                  type="button"
                  className="text-button"
                  style={{
                    color: "var(--indigo)",
                    textDecoration: "underline",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                  onClick={() => go("course")}
                >
                  Continuar em modo demonstração →
                </button>
              </div>
            </div>
          )}
          <Field
            label="Nome completo"
            placeholder="Júlia Andrade"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <div className="field-row">
            <label className="field">
              <span>Data de nascimento</span>
              <span className="input-shell">
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="bday"
                  placeholder="dd/mm/aaaa"
                  aria-label="Data de nascimento"
                  pattern="[0-9]{2}/[0-9]{2}/[0-9]{4}"
                  maxLength={10}
                  required
                  value={birthDate}
                  onChange={(event) => {
                    const value = formatBirthDate(event.currentTarget.value)
                    setBirthDate(value)
                    event.currentTarget.setCustomValidity(
                      getBirthDateError(value),
                    )
                  }}
                  onBlur={(event) => {
                    event.currentTarget.setCustomValidity(
                      getBirthDateError(birthDate),
                    )
                  }}
                />
              </span>
            </label>
            <PhoneField
              label="Celular"
              placeholder="(11) 90000-0000"
              value={phone}
              onChange={setPhone}
            />
          </div>
          <Field
            label="E-mail"
            type="email"
            placeholder="julia@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            label="E-mail de recuperação"
            type="email"
            placeholder="nome@email.com"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
          />
          <small className="field-help">
            É para ele que enviamos o link de nova senha.
          </small>
          <div className="field-row">
            <Field
              label="Senha"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            >
              <PasswordVisibilityButton
                visible={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
            </Field>
            <Field
              label="Confirmar senha"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            >
              <PasswordVisibilityButton
                visible={showPassword}
                toggle={() => setShowPassword(!showPassword)}
              />
            </Field>
          </div>
          <small
            className="field-help"
            style={{ marginTop: "-6px", marginBottom: "8px" }}
          >
            Mínimo 6 caracteres, com letra maiúscula, minúscula, número e
            símbolo (@#$%).
          </small>
          <label className="field">
            <span>Escolaridade</span>
            <span className="input-shell">
              <select
                aria-label="Escolaridade"
                required
                value={education}
                onChange={(e) => setEducation(e.target.value)}
              >
                <option value="" disabled>
                  Selecione sua escolaridade
                </option>
                <option value="fundamental-incompleto">
                  Ensino fundamental incompleto
                </option>
                <option value="fundamental-completo">
                  Ensino fundamental completo
                </option>
                <option value="medio-incompleto">
                  Ensino médio incompleto
                </option>
                <option value="medio-completo">Ensino médio completo</option>
                <option value="superior-incompleto">
                  Ensino superior incompleto
                </option>
                <option value="superior-completo">
                  Ensino superior completo
                </option>
                <option value="pos-graduacao">Pós-graduação</option>
              </select>
            </span>
          </label>
          {minor && (
            <div className="guardian-card">
              <div className="guardian-header">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>SE VOCÊ TIVER MENOS DE 18 ANOS</span>
              </div>
              <p>Precisamos dos dados do seu responsável legal.</p>
              <div className="guardian-fields">
                <Field
                  label="Nome do responsável legal"
                  placeholder="Nome completo"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                />
                <CpfField
                  label="CPF do responsável"
                  placeholder="000.000.000-00"
                  value={guardianCpf}
                  onChange={setGuardianCpf}
                />
              </div>
            </div>
          )}
          <label className="check-row">
            <input
              type="checkbox"
              required
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>
              Li e concordo com os{" "}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setShowTermsModal(true)
                }}
                className="underline hover:opacity-80 font-bold cursor-pointer"
                style={{
                  color: "var(--indigo)",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  font: "inherit",
                }}
              >
                Termos de uso
              </button>
            </span>
          </label>
          <button
            className="primary-button"
            type="submit"
            disabled={!accepted || loading}
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
        <TermsModal
          isOpen={showTermsModal}
          onClose={() => setShowTermsModal(false)}
          isMinor={minor}
          onAccept={() => setAccepted(true)}
        />
      </div>
    </AuthLayout>
  )
}

function PasswordScreen({
  reset,
  go,
}: {
  reset?: boolean
  go: (screen: Screen) => void
}) {
  const [sent, setSent] = useState(false)
  const [show, setShow] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmation, setConfirmation] = useState("")
  const [formAttempted, setFormAttempted] = useState(false)

  const validLength = password.length >= 8
  const validMix = /[a-zA-Z]/.test(password) && /\d/.test(password)
  const same = password.length > 0 && password === confirmation

  return (
    <AuthLayout>
      <div className="auth-form password-form">
        <button className="back-link" type="button" onClick={() => go("login")}>
          ← Voltar{reset ? " ao login" : ""}
        </button>
        <header className="form-heading">
          <h2>{reset ? "Crie uma nova senha" : "Esqueceu a senha?"}</h2>
          <p>
            {reset
              ? "Escolha uma senha que você não use em outros sites."
              : "Digite seu e-mail de recuperação. Vamos enviar um link para você criar uma nova senha. Ele vale por 1 hora."}
          </p>
        </header>
        {!reset ? (
          <form
            className={formAttempted ? "required-check" : ""}
            onInvalidCapture={() => setFormAttempted(true)}
            onSubmit={(e) => {
              e.preventDefault()
              setSent(true)
            }}
          >
            <Field
              label="E-mail de recuperação"
              type="email"
              placeholder="nome@email.com"
            />
            <button className="primary-button" type="submit">
              Enviar link
            </button>
            {sent && (
              <div className="success-state">
                <strong>✓ Link enviado!</strong>
                <span>Confira sua caixa de entrada e o spam.</span>
                <button type="button" onClick={() => go("reset")}>
                  Abrir link recebido
                </button>
              </div>
            )}
          </form>
        ) : (
          <form
            className={formAttempted ? "required-check" : ""}
            onInvalidCapture={() => setFormAttempted(true)}
            onSubmit={(e) => {
              e.preventDefault()
              if (validLength && validMix && same) go("login")
            }}
          >
            <Field
              label="Nova senha"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            >
              <PasswordVisibilityButton
                visible={show}
                toggle={() => setShow(!show)}
              />
            </Field>
            <Field
              label="Confirmar nova senha"
              type={show ? "text" : "password"}
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
            >
              <PasswordVisibilityButton
                visible={show}
                toggle={() => setShow(!show)}
              />
            </Field>
            <ul className="password-rules">
              <li className={validLength ? "valid" : ""}>
                Pelo menos 8 caracteres
              </li>
              <li className={validMix ? "valid" : ""}>Letras e números</li>
              <li className={same ? "valid" : ""}>As duas senhas são iguais</li>
            </ul>
            <button
              className="primary-button"
              type="submit"
              disabled={!validLength || !validMix || !same}
            >
              Redefinir senha
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  )
}

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="auth-screen">
      <div className="brand-panel-wrapper">
        <BrandPanel />
      </div>
      <section className="auth-content">{children}</section>
    </main>
  )
}

interface StepperProps {
  step: number
  back: () => void
}

function Stepper({ step, back }: StepperProps) {
  const labels = ["Curso-alvo", "Como começar", "Meta semanal"]
  return (
    <header className="onboarding-header">
      <BrandLogo />
      <div className="stepper">
        {labels.map((label, index) => (
          <div className={index + 1 <= step ? "complete" : ""} key={label}>
            <i>{index + 1 < step ? "✓" : index + 1}</i>
            <span>{label}</span>
            {index < 2 && <b />}
          </div>
        ))}
      </div>
      <button className="back-link" type="button" onClick={back}>
        ← Voltar
      </button>
    </header>
  )
}

function OnboardingLayout({
  step,
  back,
  children,
}: {
  step: number
  back: () => void
  children: ReactNode
}) {
  return (
    <main className="onboarding">
      <Stepper step={step} back={back} />
      <section className="onboarding-content">{children}</section>
    </main>
  )
}

function Course({ go }: { go: (screen: Screen) => void }) {
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<CourseOption[]>([])
  const [selected, setSelected] = useState<CourseOption | null>(null)
  const [weightAreas, setWeightAreas] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // RN02: busca no servidor (ignora acento/caixa), com debounce.
  useEffect(() => {
    const term = query.trim()
    // Se o texto não corresponde mais ao curso selecionado, invalida a seleção (RN03).
    if (selected && term !== selected.name) {
      setSelected(null)
      setWeightAreas([])
    }
    if (term.length < 2) {
      setOptions([])
      return
    }
    let active = true
    setLoading(true)
    const timer = setTimeout(async () => {
      try {
        const items = await coursesApi.search(term)
        if (active) {
          setOptions(items)
          setHighlight(-1)
        }
      } catch {
        if (active) setOptions([])
      } finally {
        if (active) setLoading(false)
      }
    }, 300)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [query, selected])

  // RN07/RN11: ao selecionar um curso válido, carrega e exibe as áreas de peso.
  async function selectCourse(option: CourseOption) {
    setSelected(option)
    setQuery(option.name)
    setOptions([])
    setOpen(false)
    setErrorMessage(null)
    try {
      const areas = await coursesApi.getWeightAreas(option.id)
      setWeightAreas(areas)
    } catch {
      setWeightAreas([])
    }
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (!open || options.length === 0) return
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setHighlight((h) => Math.min(h + 1, options.length - 1))
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setHighlight((h) => Math.max(h - 1, 0))
    } else if (event.key === "Enter" && highlight >= 0) {
      event.preventDefault()
      void selectCourse(options[highlight])
    } else if (event.key === "Escape") {
      setOpen(false)
    }
  }

  // RN08/RN09: só avança com curso válido; persiste a escolha antes de seguir.
  async function handleContinue() {
    if (!selected) return
    setSaving(true)
    setErrorMessage(null)
    try {
      await onboardingApi.setTargetCourse(selected.id)
      go("start")
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erro ao registrar o curso."
      setErrorMessage(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <OnboardingLayout step={1} back={() => go("signup")}>
      <div className="center-heading">
        <h1>Qual curso você quer fazer?</h1>
        <p>
          Com isso, sua trilha dá mais peso às áreas que mais contam para o seu
          curso.
        </p>
      </div>
      <div className="course-single">
        <label className="field course-combobox">
          <span>Curso (obrigatório)</span>
          <span className="input-shell">
            <input
              type="text"
              role="combobox"
              aria-expanded={open && options.length > 0}
              aria-autocomplete="list"
              aria-controls="course-options"
              placeholder="Busque seu curso. Ex.: Medicina"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              onKeyDown={onKeyDown}
              autoComplete="off"
            />
          </span>
          {open && (loading || options.length > 0) && (
            <ul className="course-options" id="course-options" role="listbox">
              {loading && options.length === 0 ? (
                <li className="course-option muted">Buscando...</li>
              ) : (
                options.map((option, index) => (
                  <li
                    key={option.id}
                    role="option"
                    aria-selected={index === highlight}
                    className={`course-option ${
                      index === highlight ? "active" : ""
                    }`}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      void selectCourse(option)
                    }}
                    onMouseEnter={() => setHighlight(index)}
                  >
                    {option.name}
                  </li>
                ))
              )}
            </ul>
          )}
        </label>
      </div>
      {selected && weightAreas.length > 0 && (
        <div className="weight-card">
          <span>Áreas com mais peso para {selected.name}</span>
          <div>
            {weightAreas.map((area) => (
              <b key={area}>{area}</b>
            ))}
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="form-alert error" role="alert">
          {errorMessage}
        </div>
      )}
      <button
        className="primary-button narrow"
        type="button"
        disabled={!selected || saving}
        aria-disabled={!selected || saving}
        onClick={handleContinue}
      >
        {saving ? "Salvando..." : "Continuar"}
      </button>
    </OnboardingLayout>
  )
}

function StartChoice({ go }: { go: (screen: Screen) => void }) {
  return (
    <OnboardingLayout step={2} back={() => go("course")}>
      <div className="center-heading">
        <h1>Como você quer começar?</h1>
        <p>
          O nivelamento mostra seu nível em cada área e ajuda a IA a montar uma
          trilha no seu ritmo.
        </p>
      </div>
      <div className="choice-grid">
        <article className="choice-card recommended">
          <div>
            <i>◎</i>
            <span>Recomendado</span>
          </div>
          <h2>Fazer o nivelamento</h2>
          <p>
            6 questões · cerca de 10 min. Descubra o seu nível em cada área.
          </p>
          <button
            className="primary-button"
            type="button"
            onClick={() => go("quiz")}
          >
            Fazer nivelamento
          </button>
        </article>
        <article className="choice-card">
          <div>
            <i>▤</i>
          </div>
          <h2>Escolher as matérias</h2>
          <p>
            Você escolhe as matérias que quer focar e a IA gera a trilha delas.
          </p>
          <button
            className="secondary-button"
            type="button"
            onClick={() => go("subjects")}
          >
            Escolher matérias
          </button>
        </article>
      </div>
    </OnboardingLayout>
  )
}

const QUIZ_ANSWERS = [
  { letter: "A", text: "10%" },
  { letter: "B", text: "15%" },
  { letter: "C", text: "16,7%" },
  { letter: "D", text: "20%" },
  { letter: "E", text: "25%" },
]

const AREA_PROGRESS = [
  { label: "Linguagens", value: 100 },
  { label: "Humanas", value: 100 },
  { label: "Natureza", value: 50 },
  { label: "Matemática", value: 34 },
  { label: "Redação", value: 4 },
]

function Quiz({ go }: { go: (screen: Screen) => void }) {
  const [answer, setAnswer] = useState("C")

  return (
    <OnboardingLayout step={2} back={() => go("start")}>
      <div className="quiz-layout">
        <section className="quiz-main">
          <div className="quiz-meta">
            <span>Matemática</span>
            <b>Questão 3 de 6</b>
          </div>
          <div className="progress-segments">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <i className={n <= 3 ? "filled" : ""} key={n} />
            ))}
          </div>
          <div className="question-card">
            Uma loja vende camisetas por R$ 30,00 cada. Na promoção, quem leva 3
            paga R$ 75,00. Qual é o desconto por camiseta, em porcentagem?
          </div>
          <div className="answers">
            {QUIZ_ANSWERS.map(({ letter, text }) => (
              <button
                type="button"
                className={answer === letter ? "selected" : ""}
                onClick={() => setAnswer(letter)}
                key={letter}
              >
                <i>{letter}</i>
                {text}
              </button>
            ))}
          </div>
          <button
            className="primary-button quiz-next"
            type="button"
            onClick={() => go("subjects")}
          >
            Próxima
          </button>
        </section>
        <aside className="area-progress">
          <h2>Progresso por área</h2>
          {AREA_PROGRESS.map(({ label, value }) => (
            <div key={label}>
              <span>{label}</span>
              <small>{value === 100 ? "Concluída" : `${value}%`}</small>
              <i>
                <b style={{ width: `${value}%` }} />
              </i>
            </div>
          ))}
        </aside>
      </div>
    </OnboardingLayout>
  )
}

const SUBJECT_LIST = [
  "Matemática",
  "Ciências da Natureza",
  "Linguagens",
  "Ciências Humanas",
  "Redação",
]

function Subjects({ go }: { go: (screen: Screen) => void }) {
  const [selected, setSelected] = useState([
    "Matemática",
    "Ciências da Natureza",
  ])

  function toggle(subject: string) {
    setSelected((items) =>
      items.includes(subject)
        ? items.filter((item) => item !== subject)
        : [...items, subject],
    )
  }

  return (
    <OnboardingLayout step={2} back={() => go("start")}>
      <div className="center-heading">
        <h1>Quais matérias você quer focar?</h1>
        <p>Selecione uma ou mais. A IA gera uma trilha para cada matéria.</p>
      </div>
      <div className="subject-grid">
        {SUBJECT_LIST.map((subject, index) => {
          const isSelected = selected.includes(subject)
          return (
            <button
              type="button"
              className={isSelected ? "selected" : ""}
              onClick={() => toggle(subject)}
              key={subject}
            >
              <i>{isSelected ? "✓" : ""}</i>
              <b className={`subject-dot dot-${index}`} />
              <span>{subject}</span>
              {isSelected && <em>{selected.indexOf(subject) + 1}º</em>}
            </button>
          )
        })}
      </div>
      <div className="info-strip">
        ⓘ Uma trilha por vez: termine uma para liberar a próxima. A ordem da
        seleção define a prioridade.
      </div>
      <button
        className="primary-button narrow"
        type="button"
        disabled={!selected.length}
        onClick={() => go("goal")}
      >
        Continuar
      </button>
    </OnboardingLayout>
  )
}

function Goal({ go }: { go: (screen: Screen) => void }) {
  const [hours, setHours] = useState(25)
  const [days, setDays] = useState(["Seg", "Ter", "Qua", "Qui", "Sex"])
  const week = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]

  return (
    <OnboardingLayout step={3} back={() => go("subjects")}>
      <div className="center-heading">
        <h1>Quanto você quer estudar por semana?</h1>
        <p>Dá para mudar depois no seu perfil.</p>
      </div>
      <div className="goal-grid">
        <section className="goal-card">
          <div className="hours-control">
            <button
              type="button"
              aria-label="Diminuir horas"
              onClick={() => setHours(Math.max(5, hours - 5))}
            >
              −
            </button>
            <span>
              <strong>{hours}</strong>
              <small>horas por semana</small>
            </span>
            <button
              type="button"
              aria-label="Aumentar horas"
              onClick={() => setHours(Math.min(50, hours + 5))}
            >
              +
            </button>
          </div>
          <h3>Dias de estudo</h3>
          <div className="week-days">
            {week.map((day) => (
              <button
                type="button"
                className={days.includes(day) ? "selected" : ""}
                onClick={() =>
                  setDays((current) =>
                    current.includes(day)
                      ? current.filter((item) => item !== day)
                      : [...current, day],
                  )
                }
                key={day}
              >
                {day}
              </button>
            ))}
          </div>
          <p>
            {days.length} dias · cerca de{" "}
            {days.length ? Math.round(hours / days.length) : 0} horas por dia
          </p>
        </section>
        <aside className="exam-card">
          <span>ENEM · 1º dia em 08/11</span>
          <strong>39</strong>
          <h3>dias até a prova</h3>
          <p>Sua trilha será montada até essa data.</p>
        </aside>
      </div>
      <button
        className="primary-button narrow"
        type="button"
        onClick={() => go("done")}
      >
        ✦ Gerar minha trilha
      </button>
    </OnboardingLayout>
  )
}

function Done({ go }: { go: (screen: Screen) => void }) {
  return (
    <OnboardingLayout step={3} back={() => go("goal")}>
      <div className="done-card">
        <i>✓</i>
        <h1>Sua trilha está pronta!</h1>
        <p>
          Organizamos seus estudos de acordo com seu curso, suas prioridades e
          sua rotina semanal.
        </p>
        <button
          className="primary-button narrow"
          type="button"
          onClick={() => {
            authApi.logout()
            go("login")
          }}
        >
          Ir para o início
        </button>
      </div>
    </OnboardingLayout>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing")

  switch (screen) {
    case "landing":
      return <LandingPage onNavigate={(dest) => setScreen(dest)} />
    case "login":
      return <Login go={setScreen} />
    case "signup":
      return <Signup go={setScreen} />
    case "recovery":
      return <PasswordScreen go={setScreen} />
    case "reset":
      return <PasswordScreen reset go={setScreen} />
    case "course":
      return <Course go={setScreen} />
    case "start":
      return <StartChoice go={setScreen} />
    case "quiz":
      return <Quiz go={setScreen} />
    case "subjects":
      return <Subjects go={setScreen} />
    case "goal":
      return <Goal go={setScreen} />
    case "done":
      return <Done go={setScreen} />
  }
}
