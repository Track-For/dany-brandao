import type { Metadata, Viewport } from "next";
import { DM_Mono, DM_Sans, Newsreader } from "next/font/google";
import { CookieConsent } from "@/components/cookie-consent";
import "./globals.css";

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const utilityFont = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-utility",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Dany Brandão · DB Experience | Experiências corporativas",
    template: "%s | Dany Brandão · DB Experience",
  },
  description:
    "Experiências corporativas criadas a partir do entendimento da marca, do produto e de quem será recebido.",
  keywords: [
    "produção de eventos corporativos",
    "agência de eventos corporativos",
    "experiências corporativas",
    "produção de eventos São Paulo",
    "RSVP para eventos corporativos",
    "credenciamento para eventos",
    "hospitalidade corporativa",
    "experiências de marca",
  ],
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Dany Brandão · DB Experience",
    title: "Dany Brandão · DB Experience | Experiências corporativas",
    description:
      "A marca, traduzida em experiência. Estratégia, hospitalidade, produção e execução em São Paulo.",
  },
  icons: {
    icon: [{ url: "/images/Logo_Rosa_Fundo_Branco-removebg-preview.png", type: "image/png" }],
    shortcut: ["/images/Logo_Rosa_Fundo_Branco-removebg-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#F6F1EC",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${bodyFont.variable} ${displayFont.variable} ${utilityFont.variable}`}>
      <head>
        <link
          rel="preload"
          href="/images/Dany Profissional.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
      </head>
      <body>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
