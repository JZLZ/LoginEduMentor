/**
 * Regras de validação e segurança de senha do Sherlock / EduMentor AI.
 *
 * Implementa as regras de negócio para impedimento de senhas que contenham:
 * 1. O nome do usuário ou partes dele
 * 2. Informação ou partes do e-mail
 * 3. Espaços
 * 4. Nova senha idêntica à anterior
 * 5. Sequência alfabética previsível (ex.: abc, cba)
 * 6. Caracteres repetidos (ex.: aa, 11)
 *
 * Além das regras estruturais padrão:
 * - Entre 8 e 20 caracteres
 * - Letras maiúsculas e minúsculas
 * - Pelo menos um número
 * - Pelo menos um caractere especial (!@#$%&*)
 * - Sem números sequenciais (012, 123, 321, etc.)
 */

/**
 * Normaliza uma string removendo acentos e convertendo para minúsculas.
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
}

/**
 * Regra: Não pode conter espaço.
 */
export function containsWhitespace(password: string): boolean {
  return /\s/.test(password)
}

/**
 * Regra: Não pode conter sequência alfabética previsível.
 * Verifica 3 ou mais letras consecutivas em ordem crescente (ex.: abc) ou decrescente (ex.: cba).
 */
export function hasAlphabeticalSequence(password: string): boolean {
  if (!password || password.length < 3) return false
  const clean = normalizeText(password)

  for (let i = 0; i < clean.length - 2; i++) {
    const c1 = clean.charCodeAt(i)
    const c2 = clean.charCodeAt(i + 1)
    const c3 = clean.charCodeAt(i + 2)

    // Apenas letras minúsculas a-z (97 a 122)
    if (
      c1 >= 97 &&
      c1 <= 122 &&
      c2 >= 97 &&
      c2 <= 122 &&
      c3 >= 97 &&
      c3 <= 122
    ) {
      if (
        (c2 === c1 + 1 && c3 === c2 + 1) ||
        (c2 === c1 - 1 && c3 === c2 - 1)
      ) {
        return true
      }
    }
  }

  return false
}

/**
 * Regra: Não pode conter sequência numérica previsível (ex.: 123, 321).
 */
export function hasSequentialNumbers(password: string): boolean {
  return /(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/.test(
    password,
  )
}

/**
 * Regra: Não pode conter caracteres repetidos.
 * Detecta 2 ou mais caracteres consecutivos iguais (case-insensitive para letras, ex.: aa, 11, @@).
 */
export function hasRepeatedChars(password: string): boolean {
  if (!password || password.length < 2) return false
  for (let i = 0; i < password.length - 1; i++) {
    if (password[i].toLowerCase() === password[i + 1].toLowerCase()) {
      return true
    }
  }
  return false
}

/**
 * Regra: Não pode conter o nome do usuário ou partes dele (palavras com 3 ou mais caracteres ou fatias de 3+ caracteres).
 */
export function containsUserName(password: string, userName?: string): boolean {
  if (!userName || !password) return false
  const cleanPass = normalizeText(password)
  const cleanName = normalizeText(userName)

  // Nome completo sem espaços (se >= 3 letras)
  const fullNoSpaces = cleanName.replace(/\s+/g, "")
  if (fullNoSpaces.length >= 3 && cleanPass.includes(fullNoSpaces)) {
    return true
  }

  // Palavras individuais do nome com 3 ou mais letras (ex.: "Júlia", "Andrade")
  const tokens = cleanName.split(/\s+/).filter((t) => t.length >= 3)
  for (const token of tokens) {
    if (cleanPass.includes(token)) {
      return true
    }
    // Qualquer fatia contígua de 3 ou mais caracteres do token
    for (let i = 0; i <= token.length - 3; i++) {
      const sub = token.substring(i, i + 3)
      if (cleanPass.includes(sub)) {
        return true
      }
    }
  }

  return false
}

/**
 * Regra: Não pode conter informação ou partes do e-mail.
 * Extrai a parte local do e-mail (antes do @) e rejeita qualquer substring com 3 ou mais caracteres.
 */
export function containsEmailInfo(password: string, email?: string): boolean {
  if (!email || !password) return false
  const cleanPass = normalizeText(password)
  const cleanEmail = normalizeText(email)

  const localPart = cleanEmail.split("@")[0] || ""
  if (!localPart || localPart.length < 3) return false

  // 1. Parte local inteira
  if (cleanPass.includes(localPart)) {
    return true
  }

  // 2. Tokens separados por delimitadores usuais (. _ - + etc.)
  const tokens = localPart.split(/[^a-z0-9]+/).filter((t) => t.length >= 3)
  for (const token of tokens) {
    if (cleanPass.includes(token)) {
      return true
    }
    for (let i = 0; i <= token.length - 3; i++) {
      const sub = token.substring(i, i + 3)
      if (cleanPass.includes(sub)) {
        return true
      }
    }
  }

  // 3. Qualquer fatia contígua de 3 caracteres da versão alfanumérica limpa
  const cleanLocal = localPart.replace(/[^a-z0-9]/g, "")
  if (cleanLocal.length >= 3) {
    if (cleanPass.includes(cleanLocal)) {
      return true
    }
    for (let i = 0; i <= cleanLocal.length - 3; i++) {
      const sub = cleanLocal.substring(i, i + 3)
      if (cleanPass.includes(sub)) {
        return true
      }
    }
  }

  return false
}

/**
 * Regra: Nova senha não pode ser idêntica à senha anterior.
 */
export function isIdenticalToPrevious(
  password: string,
  previousPassword?: string | null,
): boolean {
  if (!password || !previousPassword) return false
  return password === previousPassword
}

/**
 * Busca a senha anterior armazenada no localStorage (se houver).
 */
export function getStoredPreviousPassword(email?: string): string | null {
  try {
    if (typeof window === "undefined") return null

    // 1. Senha gravada explicitamente no histórico de senhas
    const prev = localStorage.getItem("sherlock_user_previous_password")
    if (prev) return prev

    // 2. Senha do login lembrado
    const remembered = localStorage.getItem("sherlock_remembered_login")
    if (remembered) {
      const parsed = JSON.parse(remembered)
      if (parsed.password) {
        if (
          !email ||
          !parsed.email ||
          parsed.email.toLowerCase() === email.toLowerCase()
        ) {
          return parsed.password
        }
      }
    }
  } catch {
    // ignore
  }
  return null
}

/**
 * Grava a senha criada/atualizada no histórico local para impedir reutilização idêntica.
 */
export function recordPreviousPassword(password: string): void {
  try {
    if (typeof window !== "undefined" && password) {
      localStorage.setItem("sherlock_user_previous_password", password)
    }
  } catch {
    // ignore
  }
}

export interface PasswordValidationContext {
  userName?: string
  email?: string
  previousPassword?: string | null
  confirmation?: string
  isSignup?: boolean
}

/**
 * Validação completa da senha retornando se é válida e a mensagem de erro específica.
 */
export function validatePassword(
  password: string,
  context?: PasswordValidationContext,
): { valid: boolean; error: string | null } {
  if (!password) {
    return { valid: false, error: "A senha é obrigatória." }
  }

  // 1. Espaços
  if (containsWhitespace(password)) {
    return { valid: false, error: "A senha não pode conter espaços." }
  }

  // 2. Comprimento (8 a 20 caracteres)
  if (password.length < 8 || password.length > 20) {
    return { valid: false, error: "A senha deve ter entre 8 e 20 caracteres." }
  }

  // 3. Maiúscula, minúscula, número e caractere especial
  const hasLower = /[a-z]/.test(password)
  const hasUpper = /[A-Z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%&*]/.test(password)

  if (!hasLower || !hasUpper || !hasNumber || !hasSpecial) {
    return {
      valid: false,
      error:
        "A senha deve conter letras maiúsculas e minúsculas, número e caractere especial (!@#$%&*).",
    }
  }

  // 4. Sequência numérica previsível
  if (hasSequentialNumbers(password)) {
    return {
      valid: false,
      error:
        "A senha não pode conter sequência numérica previsível (ex.: 123, 321).",
    }
  }

  // 5. Sequência alfabética previsível
  if (hasAlphabeticalSequence(password)) {
    return {
      valid: false,
      error:
        "A senha não pode conter sequência alfabética previsível (ex.: abc, cba).",
    }
  }

  // 6. Caracteres repetidos
  if (hasRepeatedChars(password)) {
    return {
      valid: false,
      error: "A senha não pode conter caracteres repetidos (ex.: aa, 11).",
    }
  }

  // 7. Nome do usuário
  if (context?.userName && containsUserName(password, context.userName)) {
    return {
      valid: false,
      error: "A senha não pode conter o seu nome ou partes dele.",
    }
  }

  // 8. Informação ou partes do e-mail
  if (context?.email && containsEmailInfo(password, context.email)) {
    return {
      valid: false,
      error: "A senha não pode conter informações ou partes do seu e-mail.",
    }
  }

  // 9. Nova senha idêntica à anterior (não se aplica na tela de cadastro)
  if (!context?.isSignup) {
    const prevPass =
      context?.previousPassword ?? getStoredPreviousPassword(context?.email)
    if (prevPass && isIdenticalToPrevious(password, prevPass)) {
      return {
        valid: false,
        error: "A nova senha não pode ser idêntica à senha anterior.",
      }
    }
  }

  // 10. Confirmação de senha (se fornecida)
  if (
    context?.confirmation !== undefined &&
    password !== context.confirmation
  ) {
    return {
      valid: false,
      error: "As duas senhas informadas não são iguais.",
    }
  }

  return { valid: true, error: null }
}

/**
 * Avalia o status individual de cada uma das regras de negócio para exibição em checklists de interface.
 */
export function evaluatePasswordRules(
  password: string,
  context?: PasswordValidationContext,
) {
  const ruleLength = password.length >= 8 && password.length <= 20
  const ruleCase = /[a-z]/.test(password) && /[A-Z]/.test(password)
  const ruleNumber = /\d/.test(password)
  const ruleSpecial = /[!@#$%&*]/.test(password)
  const ruleNoSpaces = password.length > 0 && !containsWhitespace(password)

  const ruleNoSequentialNumbers =
    password.length >= 3 ? !hasSequentialNumbers(password) : false
  const ruleNoSequentialLetters =
    password.length >= 3 ? !hasAlphabeticalSequence(password) : false
  const ruleNoRepeated =
    password.length >= 2 ? !hasRepeatedChars(password) : false

  const ruleNoName = context?.userName
    ? password.length >= 3
      ? !containsUserName(password, context.userName)
      : false
    : true

  const ruleNoEmail = context?.email
    ? password.length >= 3
      ? !containsEmailInfo(password, context.email)
      : false
    : true

  const prevPass = context?.isSignup
    ? null
    : (context?.previousPassword ?? getStoredPreviousPassword(context?.email))
  const ruleNotPrevious = prevPass
    ? password.length >= 8
      ? !isIdenticalToPrevious(password, prevPass)
      : false
    : true

  const ruleSame =
    context?.confirmation !== undefined
      ? password.length > 0 && password === context.confirmation
      : true

  const validation = validatePassword(password, context)

  return {
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
    isValid: validation.valid,
    validationError: validation.error,
  }
}
