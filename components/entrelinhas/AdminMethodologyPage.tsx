import { executivePresenceMethodology, executiveDynamicLabels, executivePresenceSubdimensionLabels } from "@/src/data/executivePresenceMethodology";
import { executivePresenceQuestions } from "@/src/data/executivePresenceQuestions";

export function AdminMethodologyPage() {
  const questionById = new Map(executivePresenceQuestions.map((question) => [question.id, question]));

  return (
    <div className="brand-fade-in">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-entrelinhas-gold">Metodologia interna</p>
      <h1 className="mt-3 text-3xl font-semibold text-white sm:text-5xl">Raio-X Executivo</h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-entrelinhas-muted sm:text-base">
        Leitura estrategica proprietaria baseada em comportamentos observaveis em situacoes corporativas. Nao e diagnostico psicologico,
        nao mede personalidade clinica e nao substitui avaliacao profissional especializada.
      </p>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        <InfoCard title="Dimensoes" items={["Direcao", "Influencia", "Diplomacia", "Precisao"]} />
        <InfoCard title="Subdimensoes" items={Object.values(executivePresenceSubdimensionLabels)} />
        <InfoCard title="Dinamicas executivas" items={Object.values(executiveDynamicLabels)} />
      </section>

      <section className="editorial-panel mt-6 overflow-hidden">
        <div className="border-b border-entrelinhas-gold/12 p-5">
          <h2 className="text-xl font-semibold text-white">Matriz de rastreabilidade</h2>
          <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">
            Pergunta {"->"} comportamento observado {"->"} dimensao {"->"} subdimensao {"->"} dinamica {"->"} interpretacao {"->"} devolutiva.
          </p>
        </div>
        <div className="divide-y divide-entrelinhas-gold/10">
          {executivePresenceMethodology.map((entry) => {
            const question = questionById.get(entry.questionId);
            return (
              <article key={entry.questionId} className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-entrelinhas-gold">{entry.questionId} · {entry.observedSituation}</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{question?.text ?? entry.evaluatedBehavior}</h3>
                <p className="mt-2 text-sm leading-6 text-entrelinhas-muted">{entry.evaluatedBehavior}</p>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  {entry.options.map((option) => (
                    <div key={option.optionId} className="rounded-2xl border border-entrelinhas-gold/10 bg-entrelinhas-navy/45 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-entrelinhas-muted">
                        {option.traitKey} · {executivePresenceSubdimensionLabels[option.subdimension]}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-entrelinhas-goldLight">{executiveDynamicLabels[option.executiveDynamic]}</p>
                      <p className="mt-2 text-sm leading-6 text-white/82">{option.interpretation}</p>
                      <p className="mt-2 text-xs leading-5 text-entrelinhas-muted">Risco: {option.risk}</p>
                      <p className="mt-2 text-xs leading-5 text-entrelinhas-muted">Devolutiva: {option.feedback}</p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="editorial-panel mt-6 p-5">
        <h2 className="text-xl font-semibold text-white">Referencias conceituais</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-entrelinhas-muted">
          Comunicacao Nao Violenta, inteligencia emocional, presenca executiva, seguranca psicologica, influencia,
          feedback, gestao de conflitos, tomada de decisao e lideranca feminina sao usadas como referencias de desenho
          conceitual. Elas nao representam validacao cientifica do instrumento.
        </p>
      </section>
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="editorial-panel p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full border border-entrelinhas-gold/14 bg-entrelinhas-navy/50 px-3 py-1 text-xs font-semibold text-entrelinhas-muted">
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}
