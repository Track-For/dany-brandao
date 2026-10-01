import type { Metadata, Viewport } from "next";
import "./globals.css";

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
    icon: [{ url: "/images/Logo_Fundo_Branco-removebg-preview.png", type: "image/png" }],
    shortcut: ["/images/Logo_Fundo_Branco-removebg-preview.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#418A90",
  colorScheme: "light dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          rel="preload"
          href="/images/Dany Profissional.png"
          as="image"
          type="image/png"
          fetchPriority="high"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
