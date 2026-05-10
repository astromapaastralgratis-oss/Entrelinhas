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
  const [checkingRaioX, setCheckingRaioX] = useState(false);

  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    let settled = false;
    const fallbackTimer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      setLoading(false);
      router.replace("/login");
    }, 3500);

    supabase.auth.getUser().then(({ data }) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(fallbackTimer);
      setUser(data.user);
      setLoading(false);
      if (!data.user) router.replace("/login");
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!settled) {
        settled = true;
        window.clearTimeout(fallbackTimer);
        setLoading(false);
      }
      setUser(session?.user ?? null);
      if (!session?.user) router.replace("/login");
    });

    return () => {
      settled = true;
      window.clearTimeout(fallbackTimer);
      listener.subscription.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (!supabase || !user || pathname === "/raio-x") return;

    let active = true;
    setCheckingRaioX(true);

    supabase
      .from("executive_presence_results")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .then(({ count, error }) => {
        if (!active) return;
        setCheckingRaioX(false);
        if (!error && (count ?? 0) === 0) {
          router.replace("/raio-x");
        }
      });

    return () => {
      active = false;
    };
  }, [pathname, router, user]);

  async function signOut() {
    await supabase?.auth.signOut();
    router.push("/");
  }

  if (loading || checkingRaioX) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-entrelinhas-void px-6 text-center text-entrelinhas-ivory">
        <div className="glass-panel max-w-sm p-6">
          <Sparkles className="mx-auto text-entrelinhas-gold" size={28} />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Entrelinhas</p>
          <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">Preparando seu espaço de decisão.</p>
        </div>
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-entrelinhas-void p-5 text-entrelinhas-ivory">
        <div className="glass-panel max-w-lg p-6">
          <h1 className="text-2xl font-semibold text-white">Ambiente indisponível</h1>
          <p className="mt-3 leading-7 text-entrelinhas-muted">
            Não conseguimos abrir sua área agora. Tente novamente em alguns instantes.
          </p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-entrelinhas-void text-entrelinhas-ivory">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_82%_10%,rgba(59,23,32,0.24),transparent_26rem),radial-gradient(circle_at_12%_0%,rgba(184,135,79,0.12),transparent_24rem),linear-gradient(135deg,#050609,#0b0f18_58%,#07080d)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r border-entrelinhas-champagne/10 bg-black/[0.18] px-5 py-6 backdrop-blur-xl lg:block">
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
                <Link key={item.href} href={item.href} className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${active ? "border border-entrelinhas-gold/25 bg-entrelinhas-gold/90 text-entrelinhas-ink shadow-gold" : "text-entrelinhas-muted hover:bg-white/[0.055] hover:text-white"}`}>
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

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-entrelinhas-champagne/10 bg-[#07080d]/94 px-2 py-2 backdrop-blur-xl lg:hidden">
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
