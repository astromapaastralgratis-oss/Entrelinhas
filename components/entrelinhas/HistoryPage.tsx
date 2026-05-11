"use client";

import { Copy, History } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { parseExecutiveScriptSections } from "@/lib/entrelinhas";

type GeneratedScript = {
  id: string;
  source: "generated" | "saved";
  title: string | null;
  situation: string;
  tone: string | null;
  content: string;
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
      const [{ data: generatedScripts }, { data: savedScripts }] = await Promise.all([
        client
          .from("generated_scripts")
          .select("id, situation, tone, ai_response, created_at")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false }),
        client
          .from("saved_scripts")
          .select("id, title, situation, tone, content, created_at")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
      ]);

      const generatedItems = (generatedScripts ?? []).map((script) => ({
        id: `generated-${script.id}`,
        source: "generated" as const,
        title: null,
        situation: script.situation,
        tone: script.tone,
        content: script.ai_response,
        created_at: script.created_at
      }));

      const savedItems = (savedScripts ?? []).map((script) => ({
        id: `saved-${script.id}`,
        source: "saved" as const,
        title: script.title,
        situation: script.situation ?? script.title,
        tone: script.tone,
        content: script.content,
        created_at: script.created_at
      }));

      setItems([...generatedItems, ...savedItems].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
    });
  }, []);

  async function copy(item: GeneratedScript) {
    await navigator.clipboard.writeText(formatResponseForDisplay(item.content));
    setCopiedId(item.id);
  }

  return (
    <div className="brand-fade-in">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Jornada</p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">Direcionamentos anteriores</h1>
      <div className="mt-6 space-y-4">
        {items.length ? items.map((item) => (
          <article key={item.id} className="editorial-panel p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm text-entrelinhas-muted">{new Date(item.created_at).toLocaleString("pt-BR")}</p>
                <h2 className="mt-2 text-xl font-semibold leading-snug text-white sm:text-2xl">{item.title ?? item.situation}</h2>
                <p className="mt-1 text-sm font-semibold text-entrelinhas-gold">
                  {item.source === "saved" ? "Salvo" : "Gerado"}{item.tone ? ` • ${item.tone}` : ""}
                </p>
              </div>
              <button onClick={() => copy(item)} className="inline-flex items-center justify-center gap-2 rounded-xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/35 px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:border-entrelinhas-gold/45">
                <Copy size={17} /> {copiedId === item.id ? "Copiado" : "Copiar"}
              </button>
            </div>
            <p className="mt-4 line-clamp-5 whitespace-pre-line text-sm leading-6 text-white/80 sm:leading-7">{formatResponseForDisplay(item.content)}</p>
          </article>
        )) : (
          <div className="editorial-panel flex min-h-72 flex-col items-center justify-center p-6 text-center text-entrelinhas-muted">
            <History className="mb-4 text-entrelinhas-gold" size={38} />
            <p className="max-w-xs leading-7">Seus direcionamentos aparecerao aqui depois da primeira situacao trabalhada.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function formatResponseForDisplay(content: string) {
  return parseExecutiveScriptSections(content)
    .filter((section) => section.body && section.body !== "Ainda nao gerado.")
    .map((section, index) => `${index + 1}. ${section.title}\n${section.body}`)
    .join("\n\n");
}
