"use server";

import { parse, InferInput } from "valibot";
import { RegisterState } from "../types";
import { registerSchema } from "../lib/schemas/registerSchema";
import { cookies } from "next/headers";

type RegisterInput = InferInput<typeof registerSchema>;

export async function RegisterUser(
  prevStare: RegisterState<Partial<RegisterInput>>,
  FormData: FormData,
): Promise<RegisterState<Partial<RegisterInput>>> {
  const rawData = {
    name: FormData.get("name"),
    surname: FormData.get("surname"),
    email: FormData.get("email"),
    generatePassword: FormData.get("generatePassword") === "on",
    password: FormData.get("password")?.toString() || "",
  } as Partial<RegisterInput>;

  try {
    const validData = parse(registerSchema, rawData);

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/user/register",
      {
        method: "POST",
        body: JSON.stringify(validData),
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        cache: "no-store",
      },
    );

    let apiData;
    try {
      apiData = await response.json();
    } catch (err) {
      return {
        success: false,
        message: "Erro de comunicação com o servidor (Resposta inválida).",
        inputs: rawData,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        message: apiData.message,
        inputs: rawData,
        errors: apiData.errors,
      };
    }

    return {
      success: true,
      message: apiData.message,
      tempPassword: apiData.data?.tempPassword || null,
      inputs: {},
    };
  } catch (err: unknown) {
    let errorMessage = "Erro de validação";
    
    if (err instanceof Error) {
      errorMessage = err.message;
    }

    return {
      success: false,
      message: errorMessage,
      inputs: rawData,
    };
  }
}