import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!token) {
    return NextResponse.json(
      { message: "Não autorizado. Faça login novamente." },
      { status: 401 },
    );
  }

  if (!apiUrl) {
    return NextResponse.json(
      { message: "A API não está configurada." },
      { status: 500 },
    );
  }

  try {
    const response = await fetch(
      `${apiUrl.replace(/\/$/, "")}/termos/enviar-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
        cache: "no-store",
      },
    );

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        {
          message:
            data?.message || "Não foi possível reenviar o termo por e-mail.",
        },
        { status: response.status },
      );
    }

    return NextResponse.json(
      data || {
        message: "Termo de adesão gerado e enviado por e-mail com sucesso.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao reenviar termo por e-mail:", error);
    return NextResponse.json(
      { message: "Falha na comunicação com o servidor." },
      { status: 502 },
    );
  }
}

