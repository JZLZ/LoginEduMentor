import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
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
      `${apiUrl.replace(/\/$/, "")}/termos/download`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return NextResponse.json(
        {
          message:
            errorData?.message || "Não foi possível obter o termo em PDF.",
        },
        { status: response.status },
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Termo_de_Adesao.pdf"',
      },
    });
  } catch (error) {
    console.error("Erro ao baixar termo em PDF:", error);
    return NextResponse.json(
      { message: "Falha na comunicação com o servidor." },
      { status: 502 },
    );
  }
}

