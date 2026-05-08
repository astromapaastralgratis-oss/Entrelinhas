import { AppShell } from "@/components/entrelinhas/AppShell";
import { ReactNode } from "react";

export function ProtectedPage({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
