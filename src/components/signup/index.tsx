"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";
import { FiInfo } from "react-icons/fi";

import { signupAction, type SignupPayload } from "@/src/actions/signupAction";
import {
  birthDateToIso,
  calculateAge,
  formatBirthDate,
  formatCpf,
  formatPhone,
  initialSignupValues,
  onlyNumbers,
  type SignupEducation,
  type SignupErrors,
  type SignupFormValues,
  validateSignup,
} from "@/src/lib/signupValidation";

type SignupTextField = Exclude<keyof SignupFormValues, "acceptedTerms">;

const inputClassName =
  "h-12 w-full rounded-xl border border-[#8C88AA] bg-white px-4 text-base text-[#17152E] outline-none transition placeholder:text-[#5F5B7D] focus:border-[#4F3CF0] focus:ring-3 focus:ring-[#4F3CF0]/15";

function getInputClassName(error?: string) {
  return `${inputClassName} ${error ? "border-red-600 focus:border-red-600 focus:ring-red-600/15" : ""}`;
}

const backendFieldNames: Record<string, keyof SignupFormValues> = {
  nomeCompleto: "fullName",
  dataNascimento: "birthDate",
  escolaridade: "education",
  email: "email",
  emailRecuperacao: "recoveryEmail",
  celular: "phone",
  senha: "password",
  confirmarSenha: "confirmPassword",
  "responsavelLegal.nomeCompleto": "guardianName",
  "responsavelLegal.cpf": "guardianCpf",
};

function mapBackendErrors(errors?: Record<string, string[]>) {
  if (!errors) return {};

  return Object.entries(errors).reduce<SignupErrors>(
    (mappedErrors, [field, messages]) => {
      const formField = backendFieldNames[field];
      const message = messages[0];

      if (formField && message) mappedErrors[formField] = message;
      return mappedErrors;
    },
    {},
  );
}

function BrandMark() {
  return (
    <div className="flex items-center gap-2.5" aria-label="EduMentor AI">
      <svg
        aria-hidden="true"
        className="h-[39px] w-[39px]"
        viewBox="0 0 39 39"
        fill="none"
      >
        <path
          d="M3 3h33v23.5c0 5.25-4.25 9.5-9.5 9.5H3V3Z"
          fill="#4F3CF0"
        />
        <path d="M10 24.5 19.5 15l9.5 9.5" stroke="white" strokeWidth="3" />
        <circle cx="31" cy="7" r="4" fill="#C6F432" />
        <circle cx="28" cy="15" r="2.3" fill="#C6F432" />
      </svg>
      <div className="flex items-start gap-1.5">
        <span className="font-bricolage text-[26px] leading-[31px] font-extrabold tracking-[-0.02em] text-white">
          EduMentor
        </span>
        <span className="mt-px rounded-full bg-[#C6F432] px-[7px] py-px font-bricolage text-[12px] leading-[14px] font-extrabold text-[#17152E]">
          AI
        </span>
      </div>
    </div>
  );
}

function GoalIllustration() {
  return (
    <div className="relative mt-9 h-[340px] w-full max-w-[510px]" aria-hidden="true">
      <div className="absolute top-[86px] left-[57.6%] h-[49px] w-[53%] rounded-[20px] bg-[#4F3CF0]" />
      <div className="absolute top-[172px] left-[33.5%] h-[49px] w-[53%] rounded-[20px] bg-[#4F3CF0]" />
      <div className="absolute top-[258px] left-[9.4%] h-[49px] w-[53%] rounded-[20px] bg-[#4F3CF0]" />
      <div className="absolute top-0 left-[86.5%] h-[69px] w-[69px] rounded-full bg-[#C6F432]" />
    </div>
  );
}

function Field({
  id,
  label,
  helper,
  dataCy,
  error,
  children,
}: {
  id: string;
  label: string;
  helper?: string;
  dataCy: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="text-base leading-6 font-bold text-[#17152E]">
        {label}
      </label>
      {children}
      {helper && (
        <p
          id={`${id}-helper`}
          className="text-[13px] leading-[18px] text-[#5F5B7D]"
        >
          {helper}
        </p>
      )}
      {error && (
        <p
          id={`${id}-error`}
          className="text-[13px] leading-[18px] font-bold text-red-600"
          data-cy={`${dataCy}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function Signup() {
  const router = useRouter();
  const [formValues, setFormValues] = useState<SignupFormValues>(
    initialSignupValues,
  );
  const [errors, setErrors] = useState<SignupErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const age = useMemo(
    () => calculateAge(formValues.birthDate ?? ""),
    [formValues.birthDate],
  );
  const needsGuardian = age !== null && age < 18;

  const setFieldValue = <FieldName extends keyof SignupFormValues>(
    field: FieldName,
    value: SignupFormValues[FieldName],
  ) => {
    setFormValues((current) => ({ ...current, [field]: value }));
    setFormMessage(null);
    setErrors((current) => {
      const next = { ...current };
      delete next[field];

      if (field === "email" || field === "recoveryEmail") {
        delete next.email;
        delete next.recoveryEmail;
      }

      if (field === "password" || field === "confirmPassword") {
        delete next.password;
        delete next.confirmPassword;
      }

      return next;
    });
  };

  const updateTextField =
    (field: SignupTextField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFieldValue(field, event.target.value);
    };

  const updateMaskedField =
    (
      field: "birthDate" | "phone" | "guardianCpf",
      formatter: (value: string) => string,
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setFieldValue(field, formatter(event.target.value));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationErrors = validateSignup({
      ...initialSignupValues,
      ...formValues,
    });
    setErrors(validationErrors);

    const firstInvalidField = Object.keys(validationErrors)[0] as
      | keyof SignupFormValues
      | undefined;

    if (firstInvalidField) {
      setFormMessage("Revise os campos indicados para continuar.");
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>(`[name="${firstInvalidField}"]`)
          ?.focus();
      });
      return;
    }

    const payload: SignupPayload = {
      nomeCompleto: formValues.fullName.trim().replace(/\s+/g, " "),
      dataNascimento: birthDateToIso(formValues.birthDate),
      escolaridade: formValues.education as SignupEducation,
      email: formValues.email.trim().toLowerCase(),
      emailRecuperacao: formValues.recoveryEmail.trim().toLowerCase(),
      celular: formValues.phone,
      senha: formValues.password,
      confirmarSenha: formValues.confirmPassword,
      ...(needsGuardian
        ? {
            responsavelLegal: {
              nomeCompleto: formValues.guardianName.trim(),
              cpf: onlyNumbers(formValues.guardianCpf),
            },
          }
        : {}),
    };

    setIsSubmitting(true);
    setFormMessage(null);

    try {
      const result = await signupAction(payload);

      if (result.success) {
        router.push("/login?cadastro=sucesso");
        return;
      }

      const backendErrors = mapBackendErrors(result.errors);
      setErrors(backendErrors);
      setFormMessage(result.message);

      const firstBackendField = Object.keys(backendErrors)[0] as
        | keyof SignupFormValues
        | undefined;

      if (firstBackendField) {
        requestAnimationFrame(() => {
          document
            .querySelector<HTMLElement>(`[name="${firstBackendField}"]`)
            ?.focus();
        });
      }
    } catch {
      setErrors({});
      setFormMessage("Falha na conexão com o servidor.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-[#F7F6FC] font-nunito-sans text-[#17152E] lg:grid lg:grid-cols-[minmax(420px,600px)_1fr]"
      data-cy="signup-page"
    >
      <aside className="relative overflow-hidden bg-[#17152E] px-6 py-8 sm:px-10 lg:min-h-screen lg:px-14 lg:py-14">
        <BrandMark />

        <div className="relative z-10 mt-16 max-w-[470px] lg:mt-[148px]">
          <h1 className="font-bricolage text-4xl leading-[1.08] font-extrabold tracking-[-0.02em] text-white sm:text-5xl">
            Sua trilha até o ENEM, com uma tutora 24h.
          </h1>
          <p className="mt-7 max-w-[440px] text-lg leading-7 text-[#E2DFF1]">
            Trilhas personalizadas, simulados com questões reais e a Mentorina
            para tirar dúvidas a qualquer hora.
          </p>
        </div>

        <div className="hidden lg:block">
          <GoalIllustration />
        </div>

        <div className="pointer-events-none absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-[#4F3CF0]/10 blur-3xl" />
      </aside>

      <section className="flex justify-center px-5 py-10 sm:px-8 lg:px-12 lg:py-[86px]">
        <div className="w-full max-w-[440px]">
          <nav className="flex h-14 rounded-full bg-[#E9E6FF] p-1" aria-label="Acesso à conta">
            <span
              className="flex flex-1 items-center justify-center rounded-full bg-white px-3 text-base font-bold text-[#4F3CF0] shadow-sm"
              data-cy="signup-tab"
            >
              Criar conta
            </span>
            <Link
              href="/login"
              className="flex flex-1 items-center justify-center rounded-full px-3 text-base font-bold text-[#5F5B7D] transition hover:bg-white/50 hover:text-[#4F3CF0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F3CF0]"
              data-cy="login-tab"
            >
              Fazer login
            </Link>
          </nav>

          <header className="mt-6">
            <h2 className="font-bricolage text-[32px] leading-[38px] font-extrabold tracking-[-0.015em]">
              Bora criar sua conta?
            </h2>
            <p className="mt-2 text-lg leading-7 text-[#5F5B7D]">
              Leva menos de 2 minutos.
            </p>
          </header>

          <form
            className="mt-6 flex flex-col gap-4"
            data-cy="signup-form"
            noValidate
            onSubmit={handleSubmit}
          >
            <Field
              id="fullName"
              label="Nome completo"
              dataCy="signup-full-name"
              error={errors.fullName}
            >
              <input
                className={getInputClassName(errors.fullName)}
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                data-cy="signup-full-name"
                value={formValues.fullName ?? ""}
                onChange={updateTextField("fullName")}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                aria-invalid={Boolean(errors.fullName)}
                maxLength={100}
                required
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                id="birthDate"
                label="Data de nascimento"
                dataCy="signup-birth-date"
                error={errors.birthDate}
              >
                <input
                  className={getInputClassName(errors.birthDate)}
                  id="birthDate"
                  name="birthDate"
                  type="text"
                  inputMode="numeric"
                  autoComplete="bday"
                  data-cy="signup-birth-date"
                  placeholder="dd/mm/aaaa"
                  value={formValues.birthDate ?? ""}
                  onChange={updateMaskedField("birthDate", formatBirthDate)}
                  aria-describedby={errors.birthDate ? "birthDate-error" : undefined}
                  aria-invalid={Boolean(errors.birthDate)}
                  maxLength={10}
                  required
                />
              </Field>

              <Field
                id="phone"
                label="Celular"
                dataCy="signup-phone"
                error={errors.phone}
              >
                <input
                  className={getInputClassName(errors.phone)}
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  data-cy="signup-phone"
                  placeholder="(00) 00000-0000"
                  value={formValues.phone ?? ""}
                  onChange={updateMaskedField("phone", formatPhone)}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  aria-invalid={Boolean(errors.phone)}
                  maxLength={15}
                  required
                />
              </Field>
            </div>

            <Field
              id="email"
              label="E-mail"
              dataCy="signup-email"
              error={errors.email}
            >
              <input
                className={getInputClassName(errors.email)}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                data-cy="signup-email"
                value={formValues.email ?? ""}
                onChange={updateTextField("email")}
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={Boolean(errors.email)}
                maxLength={254}
                required
              />
            </Field>

            <Field
              id="recoveryEmail"
              label="E-mail de recuperação"
              helper="É para ele que enviamos o link de nova senha."
              dataCy="signup-recovery-email"
              error={errors.recoveryEmail}
            >
              <input
                className={getInputClassName(errors.recoveryEmail)}
                id="recoveryEmail"
                name="recoveryEmail"
                type="email"
                autoComplete="email"
                data-cy="signup-recovery-email"
                value={formValues.recoveryEmail ?? ""}
                onChange={updateTextField("recoveryEmail")}
                aria-describedby={
                  errors.recoveryEmail
                    ? "recoveryEmail-helper recoveryEmail-error"
                    : "recoveryEmail-helper"
                }
                aria-invalid={Boolean(errors.recoveryEmail)}
                maxLength={254}
                required
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                id="password"
                label="Senha"
                dataCy="signup-password"
                error={errors.password}
              >
                <div className="relative">
                  <input
                    className={`${getInputClassName(errors.password)} pr-[84px]`}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    data-cy="signup-password"
                    value={formValues.password ?? ""}
                    onChange={updateTextField("password")}
                    aria-describedby={errors.password ? "password-error" : undefined}
                    aria-invalid={Boolean(errors.password)}
                    minLength={8}
                    maxLength={20}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-4 font-bold text-[#4F3CF0] transition hover:text-[#3F2DD5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F3CF0]"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    data-cy="signup-toggle-password"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </Field>

              <Field
                id="confirmPassword"
                label="Confirmar senha"
                dataCy="signup-confirm-password"
                error={errors.confirmPassword}
              >
                <div className="relative">
                  <input
                    className={`${getInputClassName(errors.confirmPassword)} pr-[84px]`}
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    data-cy="signup-confirm-password"
                    value={formValues.confirmPassword ?? ""}
                    onChange={updateTextField("confirmPassword")}
                    aria-describedby={
                      errors.confirmPassword ? "confirmPassword-error" : undefined
                    }
                    aria-invalid={Boolean(errors.confirmPassword)}
                    minLength={8}
                    maxLength={20}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-4 font-bold text-[#4F3CF0] transition hover:text-[#3F2DD5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F3CF0]"
                    onClick={() =>
                      setShowConfirmPassword((visible) => !visible)
                    }
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar confirmação de senha"
                        : "Mostrar confirmação de senha"
                    }
                    data-cy="signup-toggle-confirm-password"
                  >
                    {showConfirmPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </Field>
            </div>

            <Field
              id="education"
              label="Escolaridade"
              dataCy="signup-education"
              error={errors.education}
            >
              <select
                className={getInputClassName(errors.education)}
                id="education"
                name="education"
                data-cy="signup-education"
                value={formValues.education ?? ""}
                onChange={updateTextField("education")}
                aria-describedby={errors.education ? "education-error" : undefined}
                aria-invalid={Boolean(errors.education)}
                required
              >
                <option value="" disabled>
                  Selecione sua escolaridade
                </option>
                <option value="ENSINO_FUNDAMENTAL">Ensino Fundamental</option>
                <option value="ENSINO_MEDIO">Ensino Médio</option>
                <option value="ENSINO_SUPERIOR">Ensino Superior</option>
                <option value="POS_GRADUACAO">Pós-graduação</option>
              </select>
            </Field>

            {needsGuardian && (
              <fieldset
                className="flex flex-col gap-3 rounded-[20px] border border-dashed border-[#4F3CF0] bg-[#E9E6FF] p-4"
                data-cy="guardian-fields"
              >
                <legend className="sr-only">Dados do responsável legal</legend>
                <div className="flex items-center gap-2 text-xs leading-4 font-bold tracking-[0.06em] text-[#4F3CF0] uppercase">
                  <FiInfo aria-hidden="true" size={18} />
                  Se você tiver menos de 18 anos
                </div>
                <p className="text-[13px] leading-[18px]">
                  Precisamos dos dados do seu responsável legal.
                </p>

                <Field
                  id="guardianName"
                  label="Nome do responsável legal"
                  dataCy="signup-guardian-name"
                  error={errors.guardianName}
                >
                  <input
                    className={getInputClassName(errors.guardianName)}
                    id="guardianName"
                    name="guardianName"
                    type="text"
                    autoComplete="name"
                    data-cy="signup-guardian-name"
                    value={formValues.guardianName ?? ""}
                    onChange={updateTextField("guardianName")}
                    aria-describedby={
                      errors.guardianName ? "guardianName-error" : undefined
                    }
                    aria-invalid={Boolean(errors.guardianName)}
                    maxLength={100}
                    required
                  />
                </Field>

                <Field
                  id="guardianCpf"
                  label="CPF do responsável"
                  dataCy="signup-guardian-cpf"
                  error={errors.guardianCpf}
                >
                  <input
                    className={getInputClassName(errors.guardianCpf)}
                    id="guardianCpf"
                    name="guardianCpf"
                    type="text"
                    inputMode="numeric"
                    data-cy="signup-guardian-cpf"
                    value={formValues.guardianCpf ?? ""}
                    onChange={updateMaskedField("guardianCpf", formatCpf)}
                    aria-describedby={
                      errors.guardianCpf ? "guardianCpf-error" : undefined
                    }
                    aria-invalid={Boolean(errors.guardianCpf)}
                    maxLength={14}
                    required
                  />
                </Field>
              </fieldset>
            )}

            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-3">
                <input
                  className="mt-1 h-4 w-4 shrink-0 accent-[#4F3CF0]"
                  id="acceptedTerms"
                  name="acceptedTerms"
                  type="checkbox"
                  data-cy="signup-terms"
                  checked={Boolean(formValues.acceptedTerms)}
                  onChange={(event) =>
                    setFieldValue("acceptedTerms", event.target.checked)
                  }
                  aria-describedby={
                    errors.acceptedTerms ? "acceptedTerms-error" : undefined
                  }
                  aria-invalid={Boolean(errors.acceptedTerms)}
                  required
                />
                <label
                  htmlFor="acceptedTerms"
                  className="text-sm leading-5 text-[#17152E]"
                >
                  Li e aceito os{" "}
                  <span className="font-bold text-[#4F3CF0] underline underline-offset-2">
                    Termos de Uso
                  </span>
                  .
                </label>
              </div>
              {errors.acceptedTerms && (
                <p
                  id="acceptedTerms-error"
                  className="text-[13px] leading-[18px] font-bold text-red-600"
                  data-cy="signup-terms-error"
                  role="alert"
                >
                  {errors.acceptedTerms}
                </p>
              )}
            </div>

            {formMessage && (
              <p
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700"
                data-cy="signup-form-message"
                role="alert"
              >
                {formMessage}
              </p>
            )}

            <button
              type="submit"
              className="mx-auto mt-2 flex h-12 w-full max-w-[400px] items-center justify-center rounded-full bg-[#4F3CF0] px-8 text-base font-bold text-white transition hover:bg-[#3F2DD5] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#4F3CF0] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              data-cy="signup-submit"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? "Criando conta..." : "Criar conta"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
