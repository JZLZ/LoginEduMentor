export type SignupFormValues = {
  fullName: string;
  birthDate: string;
  phone: string;
  email: string;
  recoveryEmail: string;
  password: string;
  confirmPassword: string;
  education: string;
  guardianName: string;
  guardianCpf: string;
  acceptedTerms: boolean;
};

export type SignupErrors = Partial<Record<keyof SignupFormValues, string>>;

export type SignupEducation =
  | "ENSINO_FUNDAMENTAL"
  | "ENSINO_MEDIO"
  | "ENSINO_SUPERIOR"
  | "POS_GRADUACAO";

const signupEducationValues: SignupEducation[] = [
  "ENSINO_FUNDAMENTAL",
  "ENSINO_MEDIO",
  "ENSINO_SUPERIOR",
  "POS_GRADUACAO",
];

export const initialSignupValues: SignupFormValues = {
  fullName: "",
  birthDate: "",
  phone: "",
  email: "",
  recoveryEmail: "",
  password: "",
  confirmPassword: "",
  education: "",
  guardianName: "",
  guardianCpf: "",
  acceptedTerms: false,
};

export function onlyNumbers(value: string) {
  return value.replace(/\D/g, "");
}

export function formatBirthDate(value: string) {
  const numbers = onlyNumbers(value).slice(0, 8);

  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;

  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
}

export function formatPhone(value: string) {
  const numbers = onlyNumbers(value).slice(0, 11);

  if (numbers.length <= 2) return numbers ? `(${numbers}` : "";
  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }

  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
}

export function formatCpf(value: string) {
  const numbers = onlyNumbers(value).slice(0, 11);

  return numbers
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

export function calculateAge(value: string): number | null {
  const [day, month, year] = value.split("/").map(Number);

  if (!day || !month || !year || year < 1900 || value.length !== 10) {
    return null;
  }

  const birthDate = new Date(year, month - 1, day);
  if (
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() !== month - 1 ||
    birthDate.getDate() !== day
  ) {
    return null;
  }

  const today = new Date();
  if (birthDate > today) return null;

  let age = today.getFullYear() - year;
  const hasNotHadBirthday =
    today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() < day);

  if (hasNotHadBirthday) age -= 1;

  return age;
}

export function birthDateToIso(value: string) {
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
}

function isValidFullName(value: string) {
  const name = value.trim().replace(/\s+/g, " ");
  return (
    name.length >= 3 &&
    name.length <= 100 &&
    /^\p{L}+(?: \p{L}+)+$/u.test(name)
  );
}

function isValidEmail(value: string) {
  const email = value.trim();
  return (
    email.length <= 254 && /^[^\s@]+@[^\s@]+\.com(?:\.br)?$/i.test(email)
  );
}

function isValidPhone(value: string) {
  return /^[1-9]{2}9\d{8}$/.test(onlyNumbers(value));
}

function hasIdentityPart(password: string, fullName: string, email: string) {
  const normalizedPassword = password.toLocaleLowerCase("pt-BR");
  const nameParts = fullName
    .toLocaleLowerCase("pt-BR")
    .split(/\s+/)
    .filter((part) => part.length >= 3);
  const normalizedEmail = email.trim().toLocaleLowerCase("pt-BR");
  const emailLocalPart = normalizedEmail.split("@")[0] ?? "";

  return (
    nameParts.some((part) => normalizedPassword.includes(part)) ||
    Boolean(normalizedEmail && normalizedPassword.includes(normalizedEmail)) ||
    Boolean(emailLocalPart && normalizedPassword.includes(emailLocalPart))
  );
}

function hasSequentialNumbers(value: string) {
  return /(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/.test(
    value,
  );
}

function isValidPassword(value: string, fullName: string, email: string) {
  return (
    value.length >= 8 &&
    value.length <= 20 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[!@#$%&*]/.test(value) &&
    /^\S+$/.test(value) &&
    !hasIdentityPart(value, fullName, email) &&
    !hasSequentialNumbers(value)
  );
}

function isValidCpf(value: string) {
  const cpf = onlyNumbers(value);
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(cpf[index]) * (length + 1 - index);
    }

    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return (
    calculateDigit(9) === Number(cpf[9]) &&
    calculateDigit(10) === Number(cpf[10])
  );
}

export function validateSignup(values: SignupFormValues): SignupErrors {
  const errors: SignupErrors = {};
  const age = calculateAge(values.birthDate);

  if (!values.fullName.trim()) {
    errors.fullName = "Nome completo é obrigatório.";
  } else if (!isValidFullName(values.fullName)) {
    errors.fullName = "Informe nome e sobrenome usando apenas letras.";
  }

  if (!values.birthDate) {
    errors.birthDate = "Data de nascimento é obrigatória.";
  } else if (age === null) {
    errors.birthDate = "Informe uma data de nascimento válida.";
  }

  if (!values.phone) {
    errors.phone = "Celular é obrigatório.";
  } else if (!isValidPhone(values.phone)) {
    errors.phone = "Informe um celular válido com DDD.";
  }

  if (!values.email.trim()) {
    errors.email = "E-mail é obrigatório.";
  } else if (!isValidEmail(values.email)) {
    errors.email = "Informe um e-mail válido.";
  }

  if (!values.recoveryEmail.trim()) {
    errors.recoveryEmail = "E-mail de recuperação é obrigatório.";
  } else if (!isValidEmail(values.recoveryEmail)) {
    errors.recoveryEmail = "Informe um e-mail de recuperação válido.";
  } else if (
    values.email.trim() &&
    values.email.trim().toLowerCase() ===
      values.recoveryEmail.trim().toLowerCase()
  ) {
    errors.recoveryEmail = "Os e-mails devem ser diferentes.";
  }

  if (!values.password) {
    errors.password = "Senha é obrigatória.";
  } else if (
    !isValidPassword(values.password, values.fullName, values.email)
  ) {
    errors.password =
      "Use de 8 a 20 caracteres, com maiúscula, minúscula, número e !@#$%&*, sem dados pessoais ou sequências numéricas.";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Confirmação de senha é obrigatória.";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "As senhas devem ser iguais.";
  }

  if (!values.education) {
    errors.education = "Escolaridade é obrigatória.";
  } else if (
    !signupEducationValues.includes(values.education as SignupEducation)
  ) {
    errors.education = "Informe uma escolaridade válida.";
  }

  if (age !== null && age < 18) {
    if (!values.guardianName.trim()) {
      errors.guardianName = "Nome do responsável legal é obrigatório.";
    } else if (!isValidFullName(values.guardianName)) {
      errors.guardianName = "Informe o nome completo do responsável legal.";
    }

    if (!values.guardianCpf) {
      errors.guardianCpf = "CPF do responsável é obrigatório.";
    } else if (!isValidCpf(values.guardianCpf)) {
      errors.guardianCpf = "Informe um CPF válido.";
    }
  }

  if (!values.acceptedTerms) {
    errors.acceptedTerms = "Termo de Uso obrigatório.";
  }

  return errors;
}
