"use client";

import { Clipboard, ImageDown, Send } from "lucide-react";
import { buildCaptionTxt, createPlaceholderPng, downloadBlob } from "@/lib/export-utils";
import type { ProductionContent, ProductionStatus } from "@/types/production";

type ReadyToPostProps = {
  contents: ProductionContent[];
  onStatusChange: (contentId: string, status: ProductionStatus) => void;
};

export function ReadyToPost({ contents, onStatusChange }: ReadyToPostProps) {
  const approved = contents.filter((content) => content.status === "aprovado");

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
  }

  async function downloadPng(content: ProductionContent, promptIndex = 0) {
    const imageUrl = content.visualPrompts[promptIndex]?.imageUrl;
    const blob = imageUrl
      ? await fetch(imageUrl).then((response) => response.blob())
      : await createPlaceholderPng(content, promptIndex);
    downloadBlob(`${content.plan.date}-${content.plan.format}-${promptIndex + 1}.png`, blob);
  }

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-astral-line bg-astral-panel/86 p-5 shadow-astral">
        <p className="text-xs uppercase tracking-[0.22em] text-astral-gold">Operação assistida</p>
        <h1 className="mt-2 text-2xl font-semibold text-stone-50 md:text-3xl">Pronto para postar</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">
          Conteúdos aprovados, com imagem, legenda, hashtags, CTA e comentário fixado em uma fila simples para publicação manual.
        </p>
      </div>

      {approved.length === 0 ? (
        <div className="rounded-lg border border-astral-line bg-astral-panel/72 p-5 text-sm text-stone-300">
          Nenhum conteúdo aprovado ainda. Gere copy, gere imagem, revise e clique em Aprovar.
        </div>
      ) : (
        approved.map((content) => (
          <article key={content.id} className="rounded-lg border border-astral-line bg-[#151520]/92 p-4">
            <div className="grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="overflow-hidden rounded-md border border-white/10 bg-black/30">
                {content.visualPrompts[0]?.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={content.visualPrompts[0].imageUrl} alt={`Imagem ${content.plan.theme}`} className="h-72 w-full object-contain" />
                ) : (
                  <div className="flex h-72 items-center justify-center px-4 text-center text-sm text-stone-500">
                    PNG ainda não gerado. O download usará placeholder.
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge>{content.plan.moment}</Badge>
                  <Badge>{content.plan.format}</Badge>
                  <Badge>{content.plan.objective}</Badge>
                </div>
                <h2 className="mt-3 text-lg font-semibold text-stone-50">{content.copy?.copy.title ?? content.plan.theme}</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 text-stone-300">{content.copy?.copy.caption}</p>
                <p className="mt-3 text-xs text-astral-gold">{content.copy?.copy.hashtags.join(" ")}</p>
                <p className="mt-2 text-sm text-stone-200">CTA: {content.copy?.copy.cta}</p>
                <p className="mt-1 text-sm text-stone-400">Comentário fixado: {content.copy?.copy.pinnedComment}</p>

                <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                  <ActionButton onClick={() => downloadPng(content)} label="Baixar PNG" icon={<ImageDown />} />
                  <ActionButton onClick={() => copyText(buildCaptionTxt(content))} label="Copiar legenda" icon={<Clipboard />} />
                  <ActionButton onClick={() => copyText(content.copy?.copy.hashtags.join(" ") ?? "")} label="Copiar hashtags" icon={<Clipboard />} />
                  <ActionButton onClick={() => onStatusChange(content.id, "publicado")} label="Publicado" icon={<Send />} />
                </div>
              </div>
            </div>
          </article>
        ))
      )}
    </section>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded border border-astral-violet/25 bg-astral-violet/10 px-2 py-1 text-violet-200">{children}</span>;
}

function ActionButton({
  onClick,
  label,
  icon
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactElement;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-astral-line bg-astral-night px-3 text-sm text-stone-100 transition hover:border-astral-gold hover:text-white"
    >
      {icon}
      {label}
    </button>
  );
}
