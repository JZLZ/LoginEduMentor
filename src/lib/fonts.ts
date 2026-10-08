import {
  Bricolage_Grotesque,
  DynaPuff,
  Nunito,
  Nunito_Sans,
} from "next/font/google";

export const nunito = Nunito({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-nunito",
});

export const dynapuff = DynaPuff({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-dynapuff",
});

export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
});

export const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});
