"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import {
  UserPayload,
  ApiErrorResponse,
  ApiSuccessResponse,
  LoginState,
} from "../types";
import { redirect } from "next/navigation";

export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    return { success: false, error: "A API não está configurada." };
  }

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({
          email: String(email ?? "").trim().toLowerCase(),
          senha: String(password ?? ""),
        }),
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage = Array.isArray(data?.message)
        ? data.message[0]
        : (data as ApiErrorResponse | null)?.message || "E-mail ou senha incorretos.";
      return {
        success: false,
        error: errorMessage,
      };
    }

    const headerAuth =
      response.headers.get("authorization") ||
      response.headers.get("Authorization");
    const token =
      (data as ApiSuccessResponse | null)?.data?.token ||
      (headerAuth ? headerAuth.replace(/^Bearer\s+/i, "") : null);

    if (!token) {
      return {
        success: false,
        error: "Token de autenticação não retornado pelo servidor.",
      };
    }

    const userDecoded = jwtDecode<UserPayload>(token);

    if (!userDecoded.email && email) {
      userDecoded.email = String(email);
    }
    if (!userDecoded.name) {
      userDecoded.name = userDecoded.email
        ? userDecoded.email.split("@")[0]
        : "Estudante";
    }

    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return { success: true, user: userDecoded };
  } catch (err) {
    console.error("Erro no loginAction:", err);
    return { success: false, error: "Falha na conexão com o servidor." };
  }
}

export async function logoutAction() {
  (await cookies()).delete("auth_token");
  redirect("/login");
}
