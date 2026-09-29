import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/"];

export default async function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;
  const isPublicRoute = publicRoutes.includes(pathname);

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (token) {
    const isValid = await validateToken(token);

    if (!isValid) {
      if (isPublicRoute) {
        const response = NextResponse.next();
        response.cookies.delete("auth_token");
        return response;
      }

      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth_token");
      return response;
    }

    if (isPublicRoute && isValid) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }

  return NextResponse.next();
}

async function validateToken(token: string): Promise<boolean> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!token || !apiUrl) return false;

  try {
    const response = await fetch(`${apiUrl}/auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return response.ok;
  } catch (error) {
    console.error("Erro no Proxy:", error);
    return false;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.webp$|.*\\.svg$|.*\\.pdf$|favicon.ico).*)",
  ],
};
