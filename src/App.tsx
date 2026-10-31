import { useState, useEffect } from "react"
import type {
  FormEvent,
  InputHTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from "react"
import {
  authApi,
  coursesApi,
  onboardingApi,
  tokenStorage,
} from "./services/api"
import type { CourseOption } from "./services/api"
import LandingPage from "./components/LandingPage"

import TermsModal from "./TermsModal"

type Screen = "landing" | "login" | "signup" | "recovery" | "reset" | "course" | "start" | "quiz" | "subjects" | "goal" | "done"

/**
 * Componente do Logo completo da marca EduMentor AI.
 * Utilizado nas telas de autenticação (Login/Cadastro) e no cabeçalho do Onboarding.
 */

function BrandLogo({
  go,
  className = "",
}: {
  go?: (screen: Screen) => void
  className?: string
}) {
  return (
    <a
      href="#hero"
      onClick={(e) => {
        if (go) {
          e.preventDefault()
          go("landing")
        }
      }}
      className={`flex items-center gap-[10px] w-[219px] h-[39px] group cursor-pointer transition-all duration-300 ease-out hover:scale-105 active:scale-95 origin-left ${className}`}
      aria-label="EduMentor AI - Início"
    >
      <svg
        width="219"
        height="39"
        viewBox="0 0 220 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-[219px] h-[39px] transition-all duration-300 ease-out group-hover:brightness-110 group-hover:drop-shadow-[0_0_12px_rgba(198,244,50,0.35)]"
      >
        <path
          d="M10.1999 2.40039H25.7999C30.1199 2.40039 33.5999 5.88039 33.5999 10.2004V22.2004C33.5999 26.5204 30.1199 30.0004 25.7999 30.0004H14.3999L7.7999 34.8004C6.8999 35.4604 5.6999 34.8004 5.6999 33.7204V29.8204C3.7799 28.5004 2.3999 25.5004 2.3999 22.2004V10.2004C2.3999 5.88039 5.8799 2.40039 10.1999 2.40039Z"
          fill="#4F3CF0"
        />
        <path
          d="M9 24.0004H14.4V19.2004H19.8V14.4004H27"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          stroke="white"
        />
        <path
          d="M28.2 5.40039C28.56 7.38039 29.22 8.04039 31.2 8.40039C29.22 8.76039 28.56 9.42039 28.2 11.4004C27.84 9.42039 27.18 8.76039 25.2 8.40039C27.18 8.04039 27.84 7.38039 28.2 5.40039Z"
          fill="#C6F432"
        />
        <path
          d="M26.9999 16.4998C28.1597 16.4998 29.0999 15.5596 29.0999 14.3998C29.0999 13.24 28.1597 12.2998 26.9999 12.2998C25.8401 12.2998 24.8999 13.24 24.8999 14.3998C24.8999 15.5596 25.8401 16.4998 26.9999 16.4998Z"
          fill="#C6F432"
        />
        <path
          d="M48.4848 26.5V9.3928H52.6839V26.5H48.4848ZM51.5434 26.5V23.1045H61.8596V26.5H51.5434ZM51.5434 19.3979V16.3653H60.5636V19.3979H51.5434ZM51.5434 12.7624V9.3928H61.8077V12.7624H51.5434ZM68.5066 26.8629C67.3834 26.8629 66.3985 26.5778 65.5518 26.0075C64.705 25.4373 64.0398 24.6165 63.5559 23.5451C63.0721 22.4565 62.8302 21.1432 62.8302 19.6053C62.8302 18.1883 63.0375 16.9528 63.4522 15.8987C63.867 14.8274 64.4804 13.9979 65.2926 13.4104C66.1047 12.8056 67.107 12.5032 68.2993 12.5032C69.146 12.5032 69.8718 12.6587 70.4766 12.9698C71.0814 13.2808 71.5825 13.756 71.9799 14.3954C72.3774 15.0347 72.6884 15.8382 72.913 16.8059H73.4833C73.3623 16.2184 73.25 15.6654 73.1463 15.147C73.0599 14.6114 72.9822 14.1102 72.913 13.6437C72.8612 13.1598 72.8353 12.7365 72.8353 12.3736V7.91536H77.0343V20.0718V26.5H73.587L73.5351 22.4306H73.0167C72.8266 23.4674 72.5329 24.3141 72.1354 24.9707C71.738 25.6101 71.2282 26.0853 70.6062 26.3963C70.0014 26.7074 69.3015 26.8629 68.5066 26.8629ZM69.9841 23.4933C70.4852 23.4933 70.9172 23.3896 71.2801 23.1822C71.643 22.9576 71.9367 22.6725 72.1614 22.3269C72.4033 21.964 72.5761 21.5752 72.6798 21.1605C72.7834 20.7285 72.8353 20.3051 72.8353 19.8904V19.3979C72.8353 19.0523 72.7921 18.7067 72.7057 18.3611C72.6193 18.0155 72.4897 17.6958 72.3169 17.4021C72.1614 17.091 71.9626 16.8232 71.7207 16.5986C71.4788 16.3566 71.2023 16.1752 70.8913 16.0542C70.5975 15.916 70.2692 15.8469 69.9063 15.8469C69.3361 15.8469 68.8522 16.011 68.4548 16.3394C68.0574 16.6504 67.7463 17.091 67.5217 17.6613C67.3143 18.2315 67.2106 18.8968 67.2106 19.6571C67.2106 20.4174 67.323 21.0914 67.5476 21.6789C67.7722 22.2491 68.0919 22.6984 68.5066 23.0267C68.9386 23.3378 69.4311 23.4933 69.9841 23.4933ZM84.1797 26.8629C82.5727 26.8629 81.3631 26.3186 80.5509 25.2299C79.756 24.1413 79.3586 22.4824 79.3586 20.2533V12.8142H83.5576V19.7608C83.5576 21.0222 83.7391 21.9467 84.102 22.5342C84.4648 23.1218 85.0178 23.4155 85.7608 23.4155C86.2101 23.4155 86.5989 23.3032 86.9272 23.0786C87.2728 22.8539 87.558 22.5342 87.7826 22.1195C88.0245 21.6875 88.1973 21.195 88.301 20.6421C88.422 20.0718 88.4824 19.4411 88.4824 18.7499V12.8142H92.6556V20.8754V26.5H89.3119L89.2341 22.1195H88.7676C88.5429 23.2254 88.2319 24.1326 87.8344 24.8411C87.4543 25.5323 86.9618 26.0421 86.357 26.3704C85.7695 26.6987 85.0437 26.8629 84.1797 26.8629ZM95.3525 26.5V9.3928H101.599L105.928 21.6789H106.057L110.256 9.3928H116.218V26.5H112.278L112.486 13.6437H112.226L107.431 26.5H103.984L99.2923 13.6437H99.0331L99.2405 26.5H95.3525ZM125.409 26.8629C124.233 26.8629 123.197 26.7074 122.298 26.3963C121.417 26.0853 120.665 25.636 120.043 25.0485C119.421 24.4437 118.946 23.7093 118.617 22.8453C118.306 21.9813 118.151 21.005 118.151 19.9163C118.151 18.845 118.306 17.8514 118.617 16.9355C118.929 16.0197 119.378 15.2334 119.965 14.5768C120.57 13.9029 121.305 13.3845 122.169 13.0216C123.033 12.6414 124.017 12.4514 125.123 12.4514C126.229 12.4514 127.197 12.6328 128.026 12.9957C128.873 13.3586 129.564 13.8942 130.1 14.6027C130.653 15.2939 131.042 16.132 131.266 17.117C131.508 18.1019 131.577 19.2165 131.474 20.4606L120.898 20.5643V18.3611L128.985 18.2834L127.638 19.3461C127.759 18.4821 127.715 17.7822 127.508 17.2466C127.301 16.6936 126.981 16.2962 126.549 16.0542C126.134 15.795 125.668 15.6654 125.149 15.6654C124.545 15.6654 124.017 15.8296 123.568 16.1579C123.119 16.4862 122.773 16.9614 122.531 17.5835C122.289 18.1883 122.169 18.9314 122.169 19.8126C122.169 21.2296 122.462 22.2578 123.05 22.8971C123.655 23.5365 124.432 23.8562 125.383 23.8562C125.832 23.8562 126.212 23.7957 126.523 23.6747C126.834 23.5538 127.085 23.3982 127.275 23.2082C127.465 23.0008 127.612 22.7762 127.715 22.5342C127.819 22.275 127.905 22.0245 127.975 21.7826L131.629 22.4824C131.526 23.1045 131.327 23.6834 131.033 24.219C130.757 24.7547 130.368 25.2213 129.867 25.6187C129.366 26.0162 128.744 26.3186 128.001 26.5259C127.275 26.7506 126.411 26.8629 125.409 26.8629ZM133.42 26.5V18.3352V12.8142H136.789L136.841 17.0651H137.308C137.515 16.0283 137.818 15.173 138.215 14.499C138.63 13.8078 139.157 13.2981 139.796 12.9698C140.436 12.6242 141.196 12.4514 142.077 12.4514C143.667 12.4514 144.868 13.0043 145.68 14.1102C146.509 15.1989 146.924 16.9355 146.924 19.3202V26.5H142.725V19.8126C142.725 18.4648 142.535 17.4798 142.155 16.8578C141.775 16.2357 141.196 15.9246 140.418 15.9246C139.796 15.9246 139.269 16.1234 138.837 16.5208C138.422 16.901 138.111 17.4366 137.904 18.1278C137.697 18.8018 137.593 19.588 137.593 20.4866V26.5H133.42ZM154.542 26.837C152.935 26.837 151.751 26.4136 150.991 25.5669C150.231 24.7029 149.851 23.3464 149.851 21.4974V16.0802H147.959L148.01 12.9179H149.229C149.868 12.9006 150.335 12.7797 150.628 12.555C150.939 12.3304 151.129 11.9502 151.199 11.4146L151.51 9.75568H153.868V12.8142H157.16V16.2098H153.868V21.2901C153.868 21.8776 154.015 22.3096 154.309 22.5861C154.603 22.8626 155.035 23.0008 155.605 23.0008C155.916 23.0008 156.218 22.9662 156.512 22.8971C156.806 22.828 157.048 22.733 157.238 22.612V26.4482C156.685 26.621 156.184 26.7246 155.735 26.7592C155.285 26.811 154.888 26.837 154.542 26.837ZM165.285 26.8629C163.903 26.8629 162.684 26.595 161.63 26.0594C160.576 25.5237 159.747 24.7202 159.142 23.6488C158.537 22.5774 158.235 21.2382 158.235 19.6312C158.235 18.0242 158.537 16.6936 159.142 15.6395C159.747 14.5682 160.576 13.7733 161.63 13.2549C162.702 12.7192 163.929 12.4514 165.311 12.4514C166.693 12.4514 167.912 12.7192 168.966 13.2549C170.037 13.7906 170.866 14.5941 171.454 15.6654C172.059 16.7195 172.361 18.0501 172.361 19.6571C172.361 21.2987 172.05 22.6552 171.428 23.7266C170.823 24.7979 169.985 25.5928 168.914 26.1112C167.842 26.6123 166.633 26.8629 165.285 26.8629ZM165.415 23.8302C166.019 23.8302 166.521 23.6834 166.918 23.3896C167.333 23.0958 167.644 22.6552 167.851 22.0677C168.058 21.4802 168.162 20.763 168.162 19.9163C168.162 19.0005 168.05 18.2315 167.825 17.6094C167.601 16.9701 167.272 16.4862 166.84 16.1579C166.408 15.8123 165.855 15.6395 165.181 15.6395C164.594 15.6395 164.093 15.7864 163.678 16.0802C163.263 16.3739 162.952 16.8146 162.745 17.4021C162.555 17.9896 162.46 18.7154 162.46 19.5794C162.46 20.979 162.71 22.0418 163.211 22.7675C163.73 23.476 164.464 23.8302 165.415 23.8302ZM174.162 26.5V19.9941V12.8142H177.583L177.661 17.5576H178.128C178.249 16.3307 178.473 15.3458 178.801 14.6027C179.147 13.8597 179.614 13.324 180.201 12.9957C180.806 12.6674 181.558 12.5032 182.456 12.5032C182.612 12.5032 182.785 12.5118 182.975 12.5291C183.182 12.5464 183.407 12.5896 183.649 12.6587L183.467 17.117C183.173 16.9787 182.862 16.8837 182.534 16.8318C182.206 16.78 181.921 16.7541 181.679 16.7541C181.022 16.7541 180.452 16.8923 179.968 17.1688C179.501 17.428 179.13 17.8341 178.853 18.387C178.594 18.9227 178.421 19.5966 178.335 20.4088V26.5H174.162Z"
          fill="white"
        />
        <rect
          x="190.8"
          y="9.5"
          width="29"
          height="17"
          rx="8.5"
          fill="#C6F432"
        />
        <path
          d="M198.971 22.5L201.713 14.4216H204.614L207.356 22.5H205.202L203.268 15.9638H203.072L201.126 22.5H198.971ZM200.599 20.9822V19.6603H206.022V20.9822H200.599ZM208.383 22.5V14.4216H210.39V22.5H208.383Z"
          fill="#17152E"
        />
      </svg>
    </a>
  )
}

function BrandPanel({ go }: { go?: (screen: Screen) => void }) {
  return (
    <aside className="brand-panel">
      <BrandLogo go={go} />
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
    <AuthLayout go={go}>
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

const UNDER_13_ERROR_MESSAGE =
  "Sua data de nascimento esta correta? Essa plataforma não é recomendada para menores de 13 anos, por isso não podemos permitir seu cadastro."

function getBirthDateError(value: string) {
  if (!value) return ""

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    return "Use o formato dd/mm/aaaa."
  }

  if (!parseBirthDate(value)) {
    return "Informe uma data válida, que não seja futura."
  }

  const age = getAge(value)
  if (age !== null && age < 13) {
    return UNDER_13_ERROR_MESSAGE
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

  const isUnder13 = age !== null && age < 13

  const minor = age !== null && age >= 13 && age < 18

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

    const currentAge = getAge(birthDate)

    if (currentAge !== null && currentAge < 13) {
      setErrorMessage(UNDER_13_ERROR_MESSAGE)
      return
    }

    const birthDateError = getBirthDateError(birthDate)
    if (birthDateError) {
      setErrorMessage(birthDateError)
      return
    }

    if (currentAge === null) {
      setErrorMessage("Informe uma data de nascimento válida.")
      return
    }

    if (!accepted) {
      setErrorMessage("Você precisa aceitar os Termos de uso para continuar.")
      return
    }

    if (minor && !isValidCpf(guardianCpf)) {
      setErrorMessage("Informe um CPF válido para o responsável legal.")
      return
    }

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

    // Regras alinhadas ao backend (CadastroDto): 8–20 caracteres.
    if (password.length < 8 || password.length > 20) {
      setErrorMessage("A senha deve ter entre 8 e 20 caracteres.")
      return
    }

    // Maiúscula, minúscula, número e especial (!@#$%&*), sem espaços.
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&*])\S+$/
    if (!passwordRegex.test(password)) {
      setErrorMessage(
        "A senha deve conter maiúscula, minúscula, número e caractere especial (!@#$%&*), sem espaços.",
      )

      return
    }

    // Sem números sequenciais (ex.: 123, 321) — regra do backend.
    if (
      /(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/.test(
        password,
      )
    ) {
      setErrorMessage("A senha não pode conter números sequenciais.")
      return
    }

    // O e-mail de recuperação precisa existir e ser diferente do principal.
    const recovery = recoveryEmail.trim().toLowerCase()
    if (!recovery) {
      setErrorMessage("Informe um e-mail de recuperação.")
      return
    }
    if (recovery === email.trim().toLowerCase()) {
      setErrorMessage(
        "O e-mail de recuperação deve ser diferente do e-mail principal.",
      )
      return
    }

    if (!education) {
      setErrorMessage("Selecione sua escolaridade.")
      return
    }

    setLoading(true)

    setErrorMessage(null)

    // Converte dd/mm/aaaa -> YYYY-MM-DD (ISO) exigido pelo backend.
    const [dd, mm, yyyy] = birthDate.split("/")
    const dataNascimento = `${yyyy}-${mm}-${dd}`

    // Mapeia os valores do select para o enum Escolaridade do backend.
    const escolaridadeMap: Record<string, string> = {
      "fundamental-incompleto": "ENSINO_FUNDAMENTAL",
      "fundamental-completo": "ENSINO_FUNDAMENTAL",
      "medio-incompleto": "ENSINO_MEDIO",
      "medio-completo": "ENSINO_MEDIO",
      "superior-incompleto": "ENSINO_SUPERIOR",
      "superior-completo": "ENSINO_SUPERIOR",
      "pos-graduacao": "POS_GRADUACAO",
    }

    try {
      await authApi.cadastrar({
        nomeCompleto: fullName.trim().replace(/\s+/g, " "),
        dataNascimento,
        escolaridade: escolaridadeMap[education] ?? "ENSINO_MEDIO",
        celular: phone,
        email: email.trim().toLowerCase(),
        emailRecuperacao: recovery,
        senha: password,
        confirmarSenha: confirmPassword,
        termosAceitos: accepted,
        ...(minor
          ? {
              responsavelLegal: {
                nomeCompleto: guardianName.trim(),
                cpf: guardianCpf.replace(/\D/g, ""),
              },
            }
          : {}),
      })

      // Login automático: o cadastro criou a conta, então o login funciona.
      await authApi.login(email, password)

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
    <AuthLayout go={go}>
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
          onInvalidCapture={() => {
            setFormAttempted(true)
            const currentAge = getAge(birthDate)
            if (currentAge !== null && currentAge < 13) {
              setErrorMessage(UNDER_13_ERROR_MESSAGE)
            }
          }}
          onSubmit={submit}
        >
          {errorMessage && (
            <div className="form-alert error" role="alert">
              {errorMessage}
              {!errorMessage.includes("menores de 13 anos") && (
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
              )}
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

                    const err = getBirthDateError(value)
                    event.currentTarget.setCustomValidity(err)
                    if (err === UNDER_13_ERROR_MESSAGE) {
                      setErrorMessage(UNDER_13_ERROR_MESSAGE)
                    } else if (errorMessage === UNDER_13_ERROR_MESSAGE) {
                      setErrorMessage(null)
                    }
                  }}
                  onBlur={(event) => {
                    const err = getBirthDateError(birthDate)
                    event.currentTarget.setCustomValidity(err)
                    if (err === UNDER_13_ERROR_MESSAGE) {
                      setErrorMessage(UNDER_13_ERROR_MESSAGE)
                    } else if (errorMessage === UNDER_13_ERROR_MESSAGE) {
                      setErrorMessage(null)
                    }
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
          {isUnder13 && (
            <small
              className="field-help"
              style={{
                color: "#b42318",
                marginTop: "-8px",
                marginBottom: "8px",
                fontWeight: 600,
                display: "block",
              }}
              role="alert"
            >
              {UNDER_13_ERROR_MESSAGE}
            </small>
          )}
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
            Mínimo 8 e no máximo 20 caracteres, com letra maiúscula, minúscula,
            número e símbolo (@#$%).
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

  const validLength = password.length >= 8 && password.length <= 20

  const validMix = /[a-zA-Z]/.test(password) && /\d/.test(password)

  const same = password.length > 0 && password === confirmation

  return (
    <AuthLayout go={go}>
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
                Entre 8 e 20 caracteres
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

function AuthLayout({
  children,
  go,
}: {
  children: ReactNode
  go?: (screen: Screen) => void
}) {
  return (
    <div className="auth-screen-wrapper">
      <main className="auth-screen">
        <div className="brand-panel-wrapper">
          <BrandPanel go={go} />
        </div>
        <section className="auth-content">{children}</section>
      </main>
    </div>
  )
}

interface StepperProps {
  step: number

  back: () => void
}

function Stepper({ step, back }: StepperProps) {
  const labels = ["Curso-alvo", "Como começar", "Meta semanal"]

  return (
    <div className="onboarding-header-wrapper">
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
    </div>
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
    <div className="onboarding-screen-wrapper">
      <main className="onboarding">
        <Stepper step={step} back={back} />
        <section className="onboarding-content">{children}</section>
      </main>
    </div>
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
