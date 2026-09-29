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
      `${apiUrl}/auth/login`,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      return {
        success: false,
        error: errorData.message,
      };
    }

    const successData = data as ApiSuccessResponse;
    const token = successData.data.token;
    const userDecoded = jwtDecode<UserPayload>(token);

    (await cookies()).set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return { success: true, user: userDecoded };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Falha na conexão com o servidor." };
  }
}

export async function logoutAction() {
  (await cookies()).delete("auth_token");
  redirect("/login");
}
