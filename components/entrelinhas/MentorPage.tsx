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

    try {
      const session = (await supabase?.auth.getSession())?.data.session;
      const result = await fetch("/api/generate-executive-script", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({ situation, context, desiredOutcome, peopleInvolved, tone })
      });
      const data = await result.json();

      if (!data.response) {
        setStatus("Não conseguimos preparar sua orientação agora. Tente novamente em alguns instantes.");
        return;
      }

      setResponse(data.response);

      try {
        const user = (await supabase?.auth.getUser())?.data.user;
        if (user && data.response) {
          await supabase?.from("generated_scripts").insert({
            user_id: user.id,
            situation,
            context,
            desired_outcome: desiredOutcome,
            people_involved: peopleInvolved,
            tone,
            ai_response: data.response,
            generation_mode: data.generationMode ?? null,
            fallback_used: Boolean(data.fallback),
            prompt_tokens_estimate: data.promptTokensEstimate ?? null,
            completion_tokens_estimate: data.completionTokensEstimate ?? null,
            total_tokens_estimate: data.totalTokensEstimate ?? null
          });
        }
      } catch {
        // Manter a experiência fluida mesmo se o registro não for salvo.
      }
    } catch {
      setStatus("Não conseguimos preparar sua orientação agora. Tente novamente em alguns instantes.");
    } finally {
      setLoading(false);
    }
  }

  async function copyResponse() {
    await navigator.clipboard.writeText(response);
    setStatus("Pronto. Sua fala foi copiada.");
  }

  async function saveResponse() {
    if (!supabase) {
      setStatus("Não conseguimos salvar agora. Sua orientação continua disponível aqui.");
      return;
    }

    const user = (await supabase.auth.getUser()).data.user;
    if (!user || !response) {
      setStatus("Entre na sua conta para guardar esta orientação.");
      return;
    }

    const { error } = await supabase.from("saved_scripts").insert({
      user_id: user.id,
      title: `${situation} - ${tone}`,
      situation,
      tone,
      content: response
    });

    setStatus(error ? "Não conseguimos salvar agora. Sua orientação continua disponível aqui." : "Orientação salva para consultar depois.");
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Mentoria aplicada</p>
        <h1 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-5xl">Trabalhar uma situação real</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-entrelinhas-muted sm:text-base">
          Traga o contexto. O Entrelinhas transforma tensão corporativa em postura, fala e próximo passo.
        </p>

        <form onSubmit={generate} className="glass-panel mt-6 space-y-4 p-5">
          <label className="block">
            <span className="text-sm font-semibold text-white/85">Situação</span>
            <select value={situation} onChange={(event) => setSituation(event.target.value)} className="mt-2 w-full rounded-xl border border-entrelinhas-champagne/10 bg-[#0a0d14] px-4 py-3 text-white outline-none transition focus:border-entrelinhas-gold/55">
              {situationOptions.map((option) => <option key={option}>{option}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-white/85">O que aconteceu?</span>
            <textarea required value={context} onChange={(event) => setContext(event.target.value)} rows={4} className="mt-2 w-full resize-none rounded-xl border border-entrelinhas-champagne/10 bg-white/[0.045] px-4 py-3 text-white outline-none transition placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/55" placeholder="Conte os fatos principais, sem se explicar demais." />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-white/85">Que posição você quer sustentar?</span>
            <input value={desiredOutcome} onChange={(event) => setDesiredOutcome(event.target.value)} className="mt-2 w-full rounded-xl border border-entrelinhas-champagne/10 bg-white/[0.045] px-4 py-3 text-white outline-none transition placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/55" placeholder="Ex: recuperar crédito, estabelecer limite, negociar reconhecimento" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-white/85">Quem está na conversa?</span>
            <input value={peopleInvolved} onChange={(event) => setPeopleInvolved(event.target.value)} className="mt-2 w-full rounded-xl border border-entrelinhas-champagne/10 bg-white/[0.045] px-4 py-3 text-white outline-none transition placeholder:text-entrelinhas-muted/55 focus:border-entrelinhas-gold/55" placeholder="Líder, pares, cliente, diretoria..." />
          </label>
          <div>
            <span className="text-sm font-semibold text-white/85">Tom</span>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {toneOptions.map((option) => (
                <button type="button" key={option} onClick={() => setTone(option)} className={`rounded-xl border px-2 py-3 text-sm font-bold transition ${tone === option ? "border-entrelinhas-gold/70 bg-entrelinhas-gold/90 text-entrelinhas-ink shadow-gold" : "border-entrelinhas-champagne/10 bg-white/[0.04] text-entrelinhas-muted hover:border-entrelinhas-bronze/35 hover:text-white"}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
          <button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:bg-entrelinhas-goldLight disabled:opacity-70">
            {loading ? <Loader2 className="animate-spin" size={18} /> : <WandSparkles size={18} />}
            {loading ? "Preparando sua orientação" : "Receber orientação executiva"}
          </button>
        </form>
      </section>

      <section className="glass-panel min-h-[34rem] p-5">
        <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">Orientação executiva</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{response ? situation : "Sua fala estratégica aparece aqui"}</h2>
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
        {loading ? (
          <div className="flex min-h-[24rem] flex-col items-center justify-center text-center text-entrelinhas-muted">
            <WandSparkles className="mb-4 animate-pulse text-entrelinhas-gold" size={38} />
            <p className="max-w-xs leading-7">Organizando postura, fala e próximo passo.</p>
          </div>
        ) : response ? (
          <div className="mt-5 space-y-3">
            {parseExecutiveScriptSections(response).map((section) => (
              <article key={section.title} className="rounded-xl border border-entrelinhas-champagne/10 bg-white/[0.035] p-4">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-entrelinhas-gold sm:text-sm">{section.title}</h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-white/88 sm:leading-7">{section.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[24rem] flex-col items-center justify-center text-center text-entrelinhas-muted">
            <Clipboard className="mb-4 text-entrelinhas-gold" size={38} />
            <p className="max-w-xs leading-7">Traga uma situação concreta. A mentoria devolve uma fala com presença, limite e maturidade.</p>
          </div>
        )}
      </section>
    </div>
  );
}
