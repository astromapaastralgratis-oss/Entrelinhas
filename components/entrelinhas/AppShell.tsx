"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, History, Library, LogOut, ShieldCheck, User, WandSparkles } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { hasActiveExecutivePresence } from "@/src/lib/entrelinhas";
import { BrandAvatar, BrandLogo } from "@/components/entrelinhas/BrandAssets";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Direcionamento", href: "/mentor", icon: WandSparkles },
  { label: "Repertorio", href: "/scripts", icon: Library },
  { label: "Jornada", href: "/history", icon: History },
  { label: "Contexto", href: "/profile", icon: User }
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingRaioX, setCheckingRaioX] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

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
    if (pathname === "/raio-x" || pathname === "/admin") {
      setCheckingRaioX(false);
      return;
    }
    if (!supabase || !user) return;

    let active = true;
    const client = supabase;
    setCheckingRaioX(true);

    client
      .from("profiles")
      .select("active_executive_presence_result_id, executive_presence_profile_id, executive_presence_completed_at, account_status")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return;
        setCheckingRaioX(false);
        if (!error && data?.account_status === "disabled") {
          client.auth.signOut();
          router.replace("/login");
          return;
        }
        if (!error && !hasActiveExecutivePresence(data)) {
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

  useEffect(() => {
    if (!supabase || !user) return;

    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      const token = data.session?.access_token;
      if (!token) return;
      try {
        const response = await fetch("/api/admin/me", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!active) return;
        setIsAdmin(response.ok);
      } catch {
        if (active) setIsAdmin(false);
      }
    });

    return () => {
      active = false;
    };
  }, [user]);

  if (loading || checkingRaioX) {
    return (
      <div className="brand-surface flex min-h-screen items-center justify-center px-6 text-center text-entrelinhas-ivory">
        <div className="editorial-panel brand-fade-in max-w-sm rounded-3xl p-6">
          <BrandAvatar className="mx-auto h-16 w-16" size={96} priority />
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Entrelinhas</p>
          <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">Preparando sua jornada de evolucao.</p>
        </div>
      </div>
    );
  }

  if (!isSupabaseConfigured) {
    return (
      <main className="brand-surface flex min-h-screen items-center justify-center p-5 text-entrelinhas-ivory">
        <div className="editorial-panel max-w-lg rounded-3xl p-6">
          <h1 className="text-2xl font-semibold text-white">Ambiente indisponivel</h1>
          <p className="mt-3 leading-7 text-entrelinhas-muted">
            Nao conseguimos abrir sua area agora. Tente novamente em alguns instantes.
          </p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const visibleNavItems = isAdmin ? [...navItems, { label: "Admin", href: "/admin", icon: ShieldCheck }] : navItems;

  return (
    <main className="min-h-screen bg-entrelinhas-void text-entrelinhas-ivory">
      <div className="brand-surface fixed inset-0 -z-10" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r border-entrelinhas-gold/15 bg-[#071525]/78 px-5 py-6 backdrop-blur-xl lg:block">
          <Link href="/dashboard" className="block">
            <BrandLogo className="max-w-[13.5rem]" priority />
          </Link>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-entrelinhas-gold/15 bg-[#08182A]/70 p-3">
            <BrandAvatar className="h-12 w-12" size={96} />
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-entrelinhas-gold">Presenca</p>
              <p className="text-sm font-semibold text-white">Estrategia e evolucao</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition duration-300 ${
                    active
                      ? "border border-entrelinhas-gold/25 bg-[#123A5D] text-entrelinhas-pearl shadow-bronze"
                      : "text-entrelinhas-muted hover:bg-[#0B2742]/70 hover:text-white"
                  }`}
                >
                  <Icon size={19} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button onClick={signOut} className="mt-8 flex w-full items-center gap-3 rounded-xl border border-entrelinhas-gold/15 px-4 py-3 text-sm font-semibold text-entrelinhas-muted transition duration-300 hover:border-entrelinhas-gold/35 hover:bg-[#0B2742]/50 hover:text-white">
            <LogOut size={18} /> Sair
          </button>
        </aside>

        <section className="w-full px-5 pb-28 pt-6 sm:px-8 lg:px-10 lg:pb-10">
          <header className="mb-7 flex items-center justify-between lg:hidden">
            <Link href="/dashboard" className="flex items-center gap-3">
              <BrandAvatar className="h-10 w-10" size={80} />
              <span className="text-sm font-semibold tracking-[0.08em] text-white">Entrelinhas</span>
            </Link>
          </header>
          <div className="brand-fade-in">{children}</div>
        </section>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-entrelinhas-gold/15 bg-[#050A12]/94 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-lg" style={{ gridTemplateColumns: `repeat(${visibleNavItems.length}, minmax(0, 1fr))` }}>
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-semibold transition duration-300 ${active ? "text-entrelinhas-gold" : "text-entrelinhas-muted"}`}>
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
