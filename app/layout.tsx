import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astral Content Studio",
  description: "Planejamento editorial automatizado para a marca Astral Pessoal."
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
