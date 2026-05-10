"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw, Save, ShieldOff, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";

type AdminUser = {
  id: string;
  email: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  fullName: string | null;
  accountStatus: string;
  disabledReason: string | null;
  executivePresenceProfileId: string | null;
  executivePresenceCompletedAt: string | null;
  dailyAiScriptLimit: number | null;
  totalScripts: number;
  aiToday: number;
  totalTokensEstimate: number;
  dailyTokensEstimate: number;
  recentScripts: Array<{ situation: string; generationMode: string | null; totalTokensEstimate: number | null; createdAt: string }>;
};

type AdminSettings = {
  signupLimits: { max_active_users?: number | null };
  activeUsers: number;
};

export function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [settings, setSettings] = useState<AdminSettings | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [globalLimit, setGlobalLimit] = useState("");

  const activeUsers = useMemo(() => users.filter((user) => user.accountStatus !== "disabled").length, [users]);

  const getToken = useCallback(async () => {
    return (await supabase?.auth.getSession())?.data.session?.access_token;
  }, []);

  const adminFetch = useCallback(async (path: string, init?: RequestInit) => {
    const token = await getToken();
    if (!token) throw new Error("Sessao indisponivel.");
    const response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(init?.headers ?? {})
      }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error ?? "Nao conseguimos concluir esta acao.");
    return data;
  }, [getToken]);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    setStatus(null);
    try {
      const [usersData, settingsData] = await Promise.all([
        adminFetch("/api/admin/users"),
        adminFetch("/api/admin/settings")
      ]);
      setUsers(usersData.users ?? []);
      setSettings(settingsData);
      const limit = settingsData.signupLimits?.max_active_users;
      setGlobalLimit(limit ? String(limit) : "");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Nao conseguimos carregar a administracao.");
    } finally {
      setLoading(false);
    }
  }, [adminFetch]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  async function saveGlobalLimit() {
    try {
      await adminFetch("/api/admin/settings", {
        method: "PATCH",
        body: JSON.stringify({ maxActiveUsers: globalLimit || null })
      });
      setStatus("Limite global atualizado.");
      await loadAdminData();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Nao conseguimos salvar o limite.");
    }
  }

  async function updateUser(user: AdminUser, body: Record<string, unknown>, successMessage: string) {
    try {
      await adminFetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        body: JSON.stringify(body)
      });
      setStatus(successMessage);
      await loadAdminData();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Nao conseguimos concluir esta acao.");
    }
  }

  async function setDailyLimit(user: AdminUser) {
    const value = window.prompt("Novo limite diario de scripts com IA para esta usuaria:", user.dailyAiScriptLimit?.toString() ?? "");
    if (value === null) return;
    await updateUser(user, { action: "set_limit", dailyAiScriptLimit: value }, "Limite da usuaria atualizado.");
  }

  async function setTemporaryPassword(user: AdminUser) {
    const password = window.prompt("Digite uma senha temporaria com pelo menos 6 caracteres:");
    if (!password) return;
    await updateUser(user, { action: "set_password", password }, "Senha temporaria atualizada.");
  }

  return (
    <div className="brand-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Administracao</p>
          <h1 className="mt-3 text-3xl font-semibold text-white sm:text-5xl">Operacao do Entrelinhas</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-entrelinhas-muted">
            Acompanhe usuarias, acesso, uso estimado e limites operacionais do MVP.
          </p>
        </div>
        <button onClick={loadAdminData} className="inline-flex items-center justify-center gap-2 rounded-xl border border-entrelinhas-gold/18 bg-entrelinhas-navy/55 px-4 py-3 text-sm font-semibold text-white transition hover:border-entrelinhas-gold/45">
          <RefreshCw size={17} /> Atualizar
        </button>
      </div>

      {status ? <p className="mt-5 rounded-xl border border-entrelinhas-gold/22 bg-entrelinhas-gold/[0.08] px-4 py-3 text-sm text-entrelinhas-goldLight">{status}</p> : null}

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="editorial-panel p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">Usuarias ativas</p>
          <p className="mt-3 text-4xl font-semibold text-white">{settings?.activeUsers ?? activeUsers}</p>
        </div>
        <div className="editorial-panel p-5 lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">Limite global de cadastros</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input value={globalLimit} onChange={(event) => setGlobalLimit(event.target.value)} type="number" min={1} placeholder="Sem limite" className="w-full rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/65 px-4 py-3 text-white outline-none focus:border-entrelinhas-gold/55" />
            <button onClick={saveGlobalLimit} className="inline-flex items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-3 text-sm font-bold text-entrelinhas-ink shadow-gold">
              <Save size={17} /> Salvar
            </button>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-4">
        {loading ? (
          <div className="editorial-panel p-6 text-center text-entrelinhas-muted">Carregando administracao.</div>
        ) : users.map((user) => (
          <article key={user.id} className="editorial-panel p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-semibold text-white">{user.fullName || "Usuaria sem nome"}</h2>
                  <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${user.accountStatus === "disabled" ? "border-red-400/30 bg-red-500/10 text-red-100" : "border-entrelinhas-gold/25 bg-entrelinhas-gold/[0.08] text-entrelinhas-goldLight"}`}>
                    {user.accountStatus === "disabled" ? "desativada" : "ativa"}
                  </span>
                </div>
                <p className="mt-1 break-all text-sm text-entrelinhas-muted">{user.email}</p>
                <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 xl:grid-cols-5">
                  <Metric label="scripts" value={user.totalScripts} />
                  <Metric label="IA hoje" value={user.aiToday} />
                  <Metric label="tokens hoje" value={user.dailyTokensEstimate} />
                  <Metric label="tokens totais" value={user.totalTokensEstimate} />
                  <Metric label="limite diario" value={user.dailyAiScriptLimit ?? "padrao"} />
                </div>
                <p className="mt-3 text-xs text-entrelinhas-muted">
                  Raio-X: {user.executivePresenceProfileId ? user.executivePresenceProfileId : "pendente"} · cadastro: {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </p>
                {user.recentScripts.length ? (
                  <div className="mt-4 rounded-xl border border-entrelinhas-gold/10 bg-entrelinhas-navy/35 p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-entrelinhas-muted">Historico recente</p>
                    <div className="mt-2 space-y-2">
                      {user.recentScripts.map((script) => (
                        <p key={`${script.createdAt}-${script.situation}`} className="text-xs leading-5 text-white/75">
                          {new Date(script.createdAt).toLocaleDateString("pt-BR")} · {script.situation} · {script.generationMode ?? "sem modo"} · {script.totalTokensEstimate ?? 0} tokens
                        </p>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="grid gap-2 sm:grid-cols-2 xl:min-w-72">
                <button onClick={() => setDailyLimit(user)} className="rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/45 px-3 py-2 text-sm font-semibold text-white hover:border-entrelinhas-gold/45">Limite</button>
                <button onClick={() => updateUser(user, { action: "send_reset", email: user.email }, "Email de reset enviado.")} className="rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/45 px-3 py-2 text-sm font-semibold text-white hover:border-entrelinhas-gold/45">Reset senha</button>
                <button onClick={() => setTemporaryPassword(user)} className="rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/45 px-3 py-2 text-sm font-semibold text-white hover:border-entrelinhas-gold/45">Senha temp.</button>
                {user.accountStatus === "disabled" ? (
                  <button onClick={() => updateUser(user, { action: "reactivate" }, "Usuaria reativada.")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-entrelinhas-gold/18 bg-entrelinhas-gold/[0.08] px-3 py-2 text-sm font-semibold text-entrelinhas-goldLight">
                    <ShieldCheck size={16} /> Reativar
                  </button>
                ) : (
                  <button onClick={() => updateUser(user, { action: "disable", disabledReason: "Desativada pelo admin." }, "Usuaria desativada.")} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-400/25 bg-red-500/10 px-3 py-2 text-sm font-semibold text-red-100">
                    <ShieldOff size={16} /> Desativar
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-entrelinhas-gold/10 bg-entrelinhas-navy/45 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.14em] text-entrelinhas-muted">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  );
}
