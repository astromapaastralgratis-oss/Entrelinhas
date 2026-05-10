"use client";

import { Copy, History } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type GeneratedScript = {
  id: string;
  situation: string;
  tone: string;
  ai_response: string;
  created_at: string;
};

export function HistoryPage() {
  const [items, setItems] = useState<GeneratedScript[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    client.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: scripts } = await client
        .from("generated_scripts")
        .select("id, situation, tone, ai_response, created_at")
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });
      setItems((scripts as GeneratedScript[]) ?? []);
    });
  }, []);

  async function copy(item: GeneratedScript) {
    await navigator.clipboard.writeText(item.ai_response);
    setCopiedId(item.id);
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Histórico</p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">Conversas preparadas</h1>
      <div className="mt-6 space-y-4">
        {items.length ? items.map((item) => (
          <article key={item.id} className="glass-panel p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm text-entrelinhas-muted">{new Date(item.created_at).toLocaleString("pt-BR")}</p>
                <h2 className="mt-2 text-xl font-semibold leading-snug text-white sm:text-2xl">{item.situation}</h2>
                <p className="mt-1 text-sm font-semibold text-entrelinhas-gold">{item.tone}</p>
              </div>
              <button onClick={() => copy(item)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-entrelinhas-gold/50">
                <Copy size={17} /> {copiedId === item.id ? "Copiado" : "Copiar"}
              </button>
            </div>
            <p className="mt-4 line-clamp-5 whitespace-pre-line text-sm leading-6 text-white/80 sm:leading-7">{item.ai_response}</p>
          </article>
        )) : (
          <div className="glass-panel flex min-h-72 flex-col items-center justify-center p-6 text-center text-entrelinhas-muted">
            <History className="mb-4 text-entrelinhas-gold" size={38} />
            <p className="max-w-xs leading-7">Suas conversas preparadas aparecerão aqui depois do primeiro script.</p>
          </div>
        )}
      </div>
    </div>
  );
}
