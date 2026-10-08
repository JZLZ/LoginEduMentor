"use server";

export type SignupPayload = {
  nomeCompleto: string;
  dataNascimento: string;
  escolaridade:
    | "ENSINO_FUNDAMENTAL"
    | "ENSINO_MEDIO"
    | "ENSINO_SUPERIOR"
    | "POS_GRADUACAO";
  email: string;
  emailRecuperacao: string;
  celular: string;
  senha: string;
  confirmarSenha: string;
  responsavelLegal?: {
    nomeCompleto: string;
    cpf: string;
  };
};

export type SignupActionResult =
  | { success: true }
  | {
      success: false;
      message: string;
      errors?: Record<string, string[]>;
    };

type ApiErrorResponse = {
  message?: string | string[];
  errors?: Record<string, string[]>;
};

function getErrorMessage(data: ApiErrorResponse | null, status: number) {
  if (status === 409) return "E-mail já cadastrado.";

  if (Array.isArray(data?.message)) {
    return data.message[0] ?? "Não foi possível criar a conta.";
  }

  if (typeof data?.message === "string") return data.message;

  return "Não foi possível criar a conta.";
}

export async function signupAction(
  payload: SignupPayload,
): Promise<SignupActionResult> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return {
      success: false,
      message: "A API não está configurada.",
    };
  }

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/auth/cadastro`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    if (response.ok) return { success: true };

    const data = (await response
      .json()
      .catch(() => null)) as ApiErrorResponse | null;

    return {
      success: false,
      message: getErrorMessage(data, response.status),
      errors: data?.errors,
    };
  } catch (error) {
    console.error("Falha ao criar conta:", error);
    return {
      success: false,
      message: "Falha na conexão com o servidor.",
    };
  }
}
