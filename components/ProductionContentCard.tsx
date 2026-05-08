"use client";

import { CheckCircle2, Clipboard, Download, FileText, ImageDown, RefreshCw, Send } from "lucide-react";
import { VisualPromptPreview } from "@/components/VisualPromptPreview";
import { buildCaptionTxt, downloadBlob, downloadTextFile, getSafePngBlob } from "@/lib/export-utils";
import { validateGeneratedContent } from "@/lib/content-validation";
import type { ProductionContent, ProductionStatus } from "@/types/production";

type ProductionContentCardProps = {
  content: ProductionContent;
  isGenerating?: boolean;
  generatingImageIndex?: number | null;
  onRegenerateCopy: () => void;
  onRegenerateVisual: () => void;
  onGenerateImage: (promptIndex: number) => void | Promise<void>;
  onStatusChange: (status: ProductionStatus) => void;
};

export function ProductionContentCard({
  content,
  isGenerating,
  generatingImageIndex,
  onRegenerateCopy,
  onRegenerateVisual,
  onGenerateImage,
  onStatusChange
}: ProductionContentCardProps) {
  const copy = content.copy?.copy;
  const validation = validateGeneratedContent({
    copy,
    visualPrompts: content.visualPrompts,
    theme: content.plan.theme,
    repetitionRisk: content.plan.score.repetitionRisk
  });
  const hasGeneratedPost =
    content.visualPrompts.length > 0 && content.visualPrompts.every((prompt) => Boolean(prompt.imageUrl));
  const canApprove = Boolean(copy?.caption && copy.cta && copy.hashtags.length >= 5 && hasGeneratedPost && validation.valid);
  const missingItems = getMissingApprovalItems(Boolean(copy?.caption), hasGeneratedPost, validation.valid);
  const aiLabel = content.copy?.aiStatus?.label ?? "IA automatica";
  const previewText = copy?.subtitle ?? content.plan.strategicReason;
  const isSequence = content.plan.format === "carrossel" || content.plan.format === "stories";

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
  }

  async function downloadPost(promptIndex = 0) {
    const blob = await getSafePngBlob(content, promptIndex);
    downloadBlob(`${content.plan.date}-${content.plan.format}-${promptIndex + 1}.png`, blob);
  }

  async function generateMissingPosts() {
    for (let index = 0; index < content.visualPrompts.length; index += 1) {
      if (!content.visualPrompts[index]?.imageUrl) {
        await onGenerateImage(index);
      }
    }
    if (hasGeneratedPost) await onGenerateImage(0);
  }

  return (
    <article className="rounded-lg border border-entrelinhas-line bg-[#151520]/92 p-4 shadow-entrelinhas">
      <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge>{content.plan.moment}</Badge>
            <Badge>{friendlyFormat(content.plan.format)}</Badge>
          </div>

          <PostGallery prompts={content.visualPrompts} format={content.plan.format} />

          <div className="mt-3 grid gap-2">
            <ActionButton
              onClick={generateMissingPosts}
              label={
                generatingImageIndex !== null && generatingImageIndex !== undefined
                  ? "Gerando post..."
                  : hasGeneratedPost
                    ? isSequence
                      ? "Refazer carrossel"
                      : "Refazer post"
                    : isSequence
                      ? "Gerar carrossel"
                      : "Gerar post"
              }
              icon={<ImageDown />}
            />
            {hasGeneratedPost ? <ActionButton onClick={() => downloadPost(0)} label="Baixar post" icon={<Download />} /> : null}
          </div>
        </div>

        <div>
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-entrelinhas-gold">Texto do post</p>
              <h3 className="mt-2 text-xl font-semibold text-stone-50">{copy?.title ?? content.plan.theme}</h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">{previewText}</p>
            </div>
            <div className="rounded-md border border-entrelinhas-gold/30 bg-entrelinhas-gold/10 px-3 py-2 text-right">
              <p className="text-xs uppercase tracking-[0.16em] text-entrelinhas-gold">Etapa</p>
              <p className="mt-1 text-sm font-semibold text-stone-50">{friendlyStatus(content.status)}</p>
            </div>
          </div>

          <section className="mt-4 rounded-md border border-white/5 bg-white/[0.035] p-3">
            {copy ? (
              <>
                <p className="whitespace-pre-line text-sm leading-6 text-stone-300">{copy.caption}</p>
                <p className="mt-3 text-xs text-entrelinhas-gold">{copy.hashtags.join(" ")}</p>
                <p className="mt-3 text-sm text-stone-200">
                  <span className="text-stone-500">Chamada para acao:</span> {copy.cta}
                </p>
                <p className="mt-1 text-sm text-stone-400">
                  <span className="text-stone-500">Comentario fixado:</span> {copy.pinnedComment}
                </p>
              </>
            ) : (
              <p className="text-sm text-stone-400">Clique em refazer texto caso queira preencher este card novamente.</p>
            )}
          </section>

          {!canApprove ? (
            <div className="mt-3 rounded-md border border-entrelinhas-rose/25 bg-entrelinhas-rose/10 p-3 text-sm text-stone-200">
              <p className="font-semibold text-entrelinhas-rose">Para aprovar, falta:</p>
              <ul className="mt-2 list-inside list-disc space-y-1">
                {missingItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <details className="mt-3 rounded-md border border-entrelinhas-line bg-entrelinhas-void/35 p-3 text-sm">
            <summary className="cursor-pointer text-stone-200">Ver estrategia</summary>
            <div className="mt-3 grid gap-2 text-stone-400 md:grid-cols-2">
              <p>Base do conteudo: {content.plan.scienceBase}</p>
              <p>Objetivo: {content.plan.objective}</p>
              <p>Chamada para acao: {copy?.cta ?? content.plan.ctaType}</p>
              <p>IA usada: {aiLabel}</p>
              <p className="md:col-span-2">Motivo: {content.plan.strategicReason}</p>
              {content.copy?.cost.fallbackUsed ? <p className="text-entrelinhas-gold">Alternativa usada automaticamente.</p> : null}
            </div>
          </details>

          <details className="mt-3 rounded-md border border-entrelinhas-line bg-entrelinhas-void/35 p-3 text-sm">
            <summary className="cursor-pointer text-stone-200">Estilo do post</summary>
            <VisualPromptPreview
              prompts={content.visualPrompts}
              generatingImageIndex={generatingImageIndex}
              onGenerateImage={onGenerateImage}
              onDownloadImage={(index) => downloadPost(index)}
            />
            <button type="button" onClick={onRegenerateVisual} className="mt-3 toolbar-button">
              <RefreshCw className="h-4 w-4" />
              Refazer estilo do post
            </button>
          </details>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <ActionButton onClick={onRegenerateCopy} label={isGenerating ? "Gerando..." : "Refazer texto"} icon={<RefreshCw />} />
            <ActionButton onClick={() => copyText(copy?.caption ?? "")} label="Copiar legenda" icon={<Clipboard />} />
            <ActionButton
              onClick={() => downloadTextFile(`${content.plan.date}-${content.plan.format}.txt`, buildCaptionTxt(content))}
              label="Baixar legenda"
              icon={<FileText />}
            />
            <ActionButton disabled={!canApprove} onClick={() => onStatusChange("aprovado")} label="Aprovar" icon={<CheckCircle2 />} />
            <ActionButton disabled={content.status !== "aprovado"} onClick={() => onStatusChange("publicado")} label="Marcar publicado" icon={<Send />} />
          </div>
        </div>
      </div>
    </article>
  );
}

function getMissingApprovalItems(hasCaption: boolean, hasImage: boolean, isValid: boolean) {
  const items: string[] = [];
  if (!hasCaption) items.push("gerar ou revisar legenda");
  if (!hasImage) items.push("gerar post");
  if (!isValid) items.push("corrigir texto sinalizado, como cards repetidos");
  return items.length ? items : ["revisar conteudo"];
}

function friendlyFormat(format: string) {
  const labels: Record<string, string> = {
    feed: "Feed",
    carrossel: "Carrossel",
    stories: "Story",
    reels: "Reels",
    tiktok: "TikTok"
  };
  return labels[format] ?? format;
}

function friendlyStatus(status: ProductionStatus) {
  const labels: Record<ProductionStatus, string> = {
    planejado: "Planejado",
    "copy gerada": "Texto gerado",
    "imagem pendente": "Post pendente",
    "imagem gerada": "Post gerado",
    "precisa ajuste": "Precisa ajuste",
    aprovado: "Aprovado",
    publicado: "Publicado"
  };
  return labels[status];
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded border border-entrelinhas-violet/25 bg-entrelinhas-violet/10 px-2 py-1 text-violet-200">{children}</span>;
}

function ActionButton({
  onClick,
  label,
  icon,
  disabled = false
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactElement;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-entrelinhas-line bg-entrelinhas-night px-3 text-sm text-stone-100 transition hover:border-entrelinhas-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
    >
      {icon}
      {label}
    </button>
  );
}

function PostGallery({ prompts, format }: { prompts: ProductionContent["visualPrompts"]; format: string }) {
  if (!prompts.length) {
    return (
      <div className="mt-4 flex h-72 flex-col items-center justify-center rounded-md border border-white/10 bg-black/30 px-6 text-center text-stone-500">
        <ImageDown className="h-8 w-8 text-entrelinhas-violet" />
        <p className="mt-3 text-sm">Post ainda nao gerado</p>
      </div>
    );
  }

  const label = format === "stories" ? "Tela" : format === "carrossel" ? "Card" : "Post";

  return (
    <div className="mt-4 grid max-h-[520px] gap-3 overflow-y-auto pr-1">
      {prompts.map((prompt, index) => (
        <div key={`${prompt.styleName}-${index}`} className="rounded-md border border-white/10 bg-black/30 p-2">
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-stone-500">
            {label} {index + 1} de {prompts.length}
          </p>
          {prompt.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={prompt.imageUrl} alt={`${label} ${index + 1} do conteudo`} className="h-72 w-full object-contain" />
          ) : (
            <div className="flex h-72 flex-col items-center justify-center px-6 text-center text-stone-500">
              <ImageDown className="h-8 w-8 text-entrelinhas-violet" />
              <p className="mt-3 text-sm">{label} ainda nao gerado</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
