import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entrelinhas",
  description: "Mentora executiva com IA para conversas corporativas difíceis."
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
