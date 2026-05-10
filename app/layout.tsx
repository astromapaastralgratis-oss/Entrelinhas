import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entrelinhas",
  description: "Plataforma premium de mentoria executiva feminina para presenca, estrategia e evolucao profissional.",
  icons: {
    icon: "/brand/entrelinhas-app-icon.png",
    apple: "/brand/entrelinhas-app-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
