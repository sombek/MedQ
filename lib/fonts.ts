import {
  IBM_Plex_Sans_Arabic,
  Lato,
  Merriweather,
  Roboto_Mono,
} from "next/font/google";

import { cn } from "@/lib/utils";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-merriweather",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-roboto-mono",
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
});

export const fontVariables = cn(
  lato.variable,
  merriweather.variable,
  robotoMono.variable,
  ibmPlexArabic.variable,
  "h-full antialiased"
);
