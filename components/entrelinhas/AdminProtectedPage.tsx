"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { AppShell } from "@/components/entrelinhas/AppShell";

export function AdminProtectedPage({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setLoading(false);
      router.replace("/login");
      return;
    }

    supabase.auth.getSession().then(async ({ data }) => {
      const token = data.session?.access_token;
      if (!token) {
        router.replace("/login");
        return;
      }

      const response = await fetch("/api/admin/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        router.replace("/dashboard");
        return;
      }

      setAllowed(true);
      setLoading(false);
    });
  }, [router]);

  if (loading) {
    return (
      <main className="brand-surface flex min-h-screen items-center justify-center px-5 text-entrelinhas-ivory">
        <div className="editorial-panel max-w-sm rounded-3xl p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Entrelinhas</p>
          <p className="mt-2 text-sm text-entrelinhas-muted">Validando acesso administrativo.</p>
        </div>
      </main>
    );
  }

  if (!allowed) return null;

  return <AppShell>{children}</AppShell>;
}
