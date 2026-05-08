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

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Histórico</p>
      <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Respostas anteriores</h1>
      <div className="mt-6 space-y-4">
        {items.length ? items.map((item) => (
          <article key={item.id} className="glass-panel p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm text-entrelinhas-muted">{new Date(item.created_at).toLocaleString("pt-BR")}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{item.situation}</h2>
                <p className="mt-1 text-sm font-semibold text-entrelinhas-gold">{item.tone}</p>
              </div>
              <button onClick={() => navigator.clipboard.writeText(item.ai_response)} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-entrelinhas-gold/50">
                <Copy size={17} /> Copiar
              </button>
            </div>
            <p className="mt-4 line-clamp-6 whitespace-pre-line text-sm leading-7 text-white/80">{item.ai_response}</p>
          </article>
        )) : (
          <div className="glass-panel flex min-h-80 flex-col items-center justify-center p-6 text-center text-entrelinhas-muted">
            <History className="mb-4 text-entrelinhas-gold" size={38} />
            <p>Scripts gerados aparecerão aqui depois do primeiro script executivo.</p>
          </div>
        )}
      </div>
    </div>
  );
}
