import {
  bricolageGrotesque,
  dynapuff,
  nunito,
  nunitoSans,
} from "@/src/lib/fonts";
import { AuthProvider } from "../context/AuthContext";
import { UserPayload } from "../types";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import "./globals.css";


async function getUserFromCookie(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");

  if (!token) return null;

  try {
    const user = jwtDecode<UserPayload>(token.value);

    if (user.exp < Date.now() / 1000) return null;

    return user;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUserFromCookie();
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${dynapuff.variable} ${bricolageGrotesque.variable} ${nunitoSans.variable}`}
    >
      <body className="bg-secondary-700 min-h-screen">
        <AuthProvider initialUser={user}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
