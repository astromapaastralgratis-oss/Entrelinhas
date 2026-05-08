"use client";

import { useSearchParams } from "next/navigation";
import { Clipboard, Copy, Loader2, Save, WandSparkles } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { parseExecutiveScriptSections, situationOptions, toneOptions } from "@/lib/entrelinhas";
import { supabase } from "@/lib/supabase";

export function MentorPage() {
  const searchParams = useSearchParams();
  const [situation, setSituation] = useState(situationOptions[0]);
  const [context, setContext] = useState("");
  const [desiredOutcome, setDesiredOutcome] = useState("");
  const [peopleInvolved, setPeopleInvolved] = useState("");
  const [tone, setTone] = useState("Executivo");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const selected = searchParams.get("situation");
    if (selected) setSituation(selected);
  }, [searchParams]);

  async function generate(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);
    const result = await fetch("/api/generate-executive-script", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ situation, context, desiredOutcome, peopleInvolved, tone })
    });
    const data = await result.json();
    setResponse(data.response);
    setLoading(false);

    const user = (await supabase?.auth.getUser())?.data.user;
    if (user && data.response) {
      await supabase?.from("generated_scripts").insert({
        user_id: user.id,
        situation,
        context,
        desired_outcome: desiredOutcome,
        people_involved: peopleInvolved,
        tone,
        ai_response: data.response
      });
    }
  }

  async function copyResponse() {
    await navigator.clipboard.writeText(response);
    setStatus("Script copiado.");
  }

  async function saveResponse() {
    const user = (await supabase?.auth.getUser())?.data.user;
    if (!user || !response) return;
    await supabase?.from("saved_scripts").insert({
      user_id: user.id,
      title: `${situation} - ${tone}`,
      situation,
      tone,
      content: response
    });
    setStatus("Script salvo.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Mentora</p>
        <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">Gerar script executivo</h1>
        <p className="mt-3 max-w-2xl text-entrelinhas-muted">Descreva a situação real. A resposta será estruturada para posicionamento executivo, não para conversa genérica.</p>

        <form onSubmit={generate} className="glass-panel mt-6 space-y-4 p-5">
          <label className="block">
            <span className="text-sm font-semibold text-white/85">Tipo de situação</span>
            <select value={situation} onChange={(event) => setSituation(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#0c111d] px-4 py-3 text-white outline-none focus:border-entrelinhas-gold/60">
              {situationOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-white/85">O que aconteceu? / contexto</span>
            <textarea required value={context} onChange={(event) => setContext(event.target.value)} rows={5} className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/60" placeholder="Conte os fatos principais, sem se preocupar em escrever bonito." />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-white/85">Qual resultado deseja?</span>
            <input value={desiredOutcome} onChange={(event) => setDesiredOutcome(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/60" placeholder="Ex: recuperar crédito, alinhar limites, negociar salário" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-white/85">Quem está envolvido?</span>
            <input value={peopleInvolved} onChange={(event) => setPeopleInvolved(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-white outline-none placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/60" placeholder="Líder, pares, cliente, diretoria..." />
          </label>
          <div>
            <span className="text-sm font-semibold text-white/85">Tom desejado</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {toneOptions.map((option) => (
                <button type="button" key={option} onClick={() => setTone(option)} className={`rounded-xl border px-3 py-3 text-sm font-bold transition ${tone === option ? "border-entrelinhas-gold bg-entrelinhas-gold text-entrelinhas-ink shadow-gold" : "border-white/10 bg-white/[0.05] text-entrelinhas-muted hover:text-white"}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:bg-entrelinhas-goldLight disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <WandSparkles size={18} />}
            Gerar meu script
          </button>
        </form>
      </section>

      <section className="glass-panel min-h-[38rem] p-5">
        <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">Resposta da IA</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{response ? situation : "Seu script aparecerá aqui"}</h2>
          </div>
          <div className="flex gap-2">
            <button disabled={!response} onClick={copyResponse} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-entrelinhas-gold/50 disabled:opacity-40">
              <Copy size={17} /> Copiar
            </button>
            <button disabled={!response} onClick={saveResponse} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:border-entrelinhas-gold/50 disabled:opacity-40">
              <Save size={17} /> Salvar
            </button>
          </div>
        </div>
        {status ? <p className="mt-4 rounded-xl border border-entrelinhas-gold/25 bg-entrelinhas-gold/10 px-4 py-3 text-sm text-entrelinhas-goldLight">{status}</p> : null}
        {response ? (
          <div className="mt-5 space-y-3">
            {parseExecutiveScriptSections(response).map((section) => (
              <article key={section.title} className="rounded-xl border border-white/10 bg-white/[0.045] p-4">
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-entrelinhas-gold">{section.title}</h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/88">{section.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[28rem] flex-col items-center justify-center text-center text-entrelinhas-muted">
            <Clipboard className="mb-4 text-entrelinhas-gold" size={38} />
            <p className="max-w-sm leading-7">Preencha o contexto e gere uma resposta estruturada para usar em reunião, WhatsApp ou Teams.</p>
          </div>
        )}
      </section>
    </div>
  );
}
