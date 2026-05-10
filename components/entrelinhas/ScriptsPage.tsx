"use client";

import { Copy } from "lucide-react";
import { useState } from "react";
import { quickScripts } from "@/lib/entrelinhas";

const variants = [
  ["Diplomatica", "diplomatic"],
  ["Firme", "firm"],
  ["Executiva", "executive"]
] as const;

export function ScriptsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setCopied(label);
  }

  return (
    <div className="brand-fade-in">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Scripts executivos</p>
      <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">Repertorio rapido</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-entrelinhas-muted sm:text-base">
        Frases para momentos em que clareza, limite e elegancia precisam aparecer juntas.
      </p>
      {copied ? <p className="mt-5 rounded-xl border border-entrelinhas-gold/22 bg-entrelinhas-gold/[0.08] px-4 py-3 text-sm text-entrelinhas-goldLight">Pronto. {copied} foi copiado.</p> : null}

      <section className="mt-6 grid gap-4 xl:grid-cols-2">
        {quickScripts.map((script) => (
          <article key={script.title} className="editorial-panel p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">{script.situation}</p>
            <h2 className="mt-2 text-xl font-semibold leading-snug text-white sm:text-2xl">{script.title}</h2>
            <div className="mt-5 space-y-3">
              {variants.map(([label, key]) => {
                const content = script[key];
                return (
                  <div key={key} className="rounded-xl border border-entrelinhas-gold/10 bg-entrelinhas-navy/45 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-entrelinhas-gold sm:text-sm">{label}</h3>
                      <button onClick={() => copy(content, `${script.title} (${label})`)} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-entrelinhas-gold/12 bg-entrelinhas-navy/35 text-entrelinhas-muted transition duration-300 hover:border-entrelinhas-gold/45 hover:text-white" aria-label={`Copiar versao ${label}`}>
                        <Copy size={16} />
                      </button>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-white/88 sm:leading-7">{content}</p>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
