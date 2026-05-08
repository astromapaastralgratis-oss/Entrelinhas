"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, History, Library, LogOut, Sparkles, User, WandSparkles } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Mentora", href: "/mentor", icon: WandSparkles },
  { label: "Scripts", href: "/scripts", icon: Library },
  { label: "Histórico", href: "/history", icon: History },
  { label: "Perfil", href: "/profile", icon: User }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
      if (!data.user) router.replace("/login");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) router.replace("/login");
    });

    return () => listener.subscription.unsubscribe();
  }, [router]);

  async function signOut() {
    await supabase?.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-entrelinhas-void text-entrelinhas-muted">Carregando Entrelinhas...</div>;
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-entrelinhas-void p-5 text-entrelinhas-ivory">
        <div className="glass-panel max-w-lg p-6">
          <h1 className="text-2xl font-semibold text-white">Configure o Supabase</h1>
          <p className="mt-3 leading-7 text-entrelinhas-muted">
            Para usar autenticação, perfil e histórico, preencha as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
          </p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-entrelinhas-void text-entrelinhas-ivory">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_82%_10%,rgba(139,92,246,0.2),transparent_26rem),radial-gradient(circle_at_12%_0%,rgba(224,194,126,0.14),transparent_24rem),linear-gradient(135deg,#070a12,#0d1322_58%,#090910)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r border-white/10 bg-white/[0.035] px-5 py-6 backdrop-blur lg:block">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-entrelinhas-gold/35 bg-entrelinhas-gold/10 text-entrelinhas-gold shadow-gold">
              <Sparkles size={20} />
            </span>
            <span className="text-sm font-semibold tracking-[0.08em] text-white">ENTRELINHAS</span>
          </Link>
          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "bg-entrelinhas-gold text-entrelinhas-ink shadow-gold" : "text-entrelinhas-muted hover:bg-white/8 hover:text-white"}`}>
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button onClick={signOut} className="mt-8 flex w-full items-center gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-entrelinhas-muted transition hover:border-entrelinhas-gold/40 hover:text-white">
            <LogOut size={18} /> Sair
          </button>
        </aside>

        <section className="w-full px-5 pb-28 pt-6 sm:px-8 lg:px-10 lg:pb-10">
          <header className="mb-7 flex items-center justify-between lg:hidden">
            <Link href="/dashboard" className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-entrelinhas-gold/35 bg-entrelinhas-gold/10 text-entrelinhas-gold">
                <Sparkles size={19} />
              </span>
              <span className="text-sm font-semibold tracking-[0.08em] text-white">ENTRELINHAS</span>
            </Link>
          </header>
          {children}
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#090d17]/92 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition ${active ? "text-entrelinhas-gold" : "text-entrelinhas-muted"}`}>
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </main>
  );
}
