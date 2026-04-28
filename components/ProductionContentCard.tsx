"use client";

import { CheckCircle2, Clipboard, Download, FileText, ImageDown, RefreshCw, Send } from "lucide-react";
import { VisualPromptPreview } from "@/components/VisualPromptPreview";
import {
  buildCaptionTxt,
  downloadBlob,
  downloadTextFile,
  getSafePngBlob
} from "@/lib/export-utils";
import { validateGeneratedContent } from "@/lib/content-validation";
import { getAverageQualityScore, getQualitySuggestions, needsAdjustment } from "@/lib/quality-score";
import type { ProductionContent, ProductionStatus } from "@/types/production";

type ProductionContentCardProps = {
  content: ProductionContent;
  isGenerating?: boolean;
  generatingImageIndex?: number | null;
  onRegenerateCopy: () => void;
  onRegenerateVisual: () => void;
  onGenerateImage: (promptIndex: number) => void;
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
  const qualityAverage = getAverageQualityScore(content.qualityScore);
  const needsFix = needsAdjustment(content.qualityScore);
  const validation = validateGeneratedContent({
    copy,
    visualPrompts: content.visualPrompts,
    theme: content.plan.theme,
    repetitionRisk: content.plan.score.repetitionRisk
  });
  const hasGeneratedImage = content.visualPrompts.some((prompt) => Boolean(prompt.imageUrl));
  const canApprove = Boolean(copy?.caption && copy.cta && copy.hashtags.length >= 5 && hasGeneratedImage && validation.valid);

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
  }

  async function downloadPng(promptIndex = 0) {
    const blob = await getSafePngBlob(content, promptIndex);
    downloadBlob(`${content.plan.date}-${content.plan.format}-${promptIndex + 1}.png`, blob);
  }

  return (
    <article className="rounded-lg border border-astral-line bg-[#151520]/92 p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge>{content.plan.moment}</Badge>
            <Badge>{content.plan.format}</Badge>
            <Badge>{content.plan.objective}</Badge>
            <Badge>{content.plan.scienceBase}</Badge>
          </div>
          <h3 className="mt-3 text-lg font-semibold text-stone-50">{content.plan.theme}</h3>
          <p className="mt-2 text-sm leading-6 text-stone-400">{content.plan.strategicReason}</p>
        </div>
        <div className="rounded-md border border-astral-gold/30 bg-astral-gold/10 px-3 py-2 text-right">
          <p className="text-xs uppercase tracking-[0.16em] text-astral-gold">Status</p>
          <p className="mt-1 text-sm font-semibold text-stone-50">{content.status}</p>
        </div>
      </div>

      <section className="mt-4 rounded-md border border-white/5 bg-white/[0.035] p-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-[0.18em] text-astral-teal">Preview textual</p>
          <span className={needsFix ? "text-xs text-astral-rose" : "text-xs text-astral-teal"}>
            Qualidade {qualityAverage}/10 {needsFix ? "· precisa ajuste" : "· pronto para revisar"}
          </span>
        </div>
        <h4 className="mt-2 text-base font-semibold text-stone-50">{copy?.title ?? "Copy ainda não gerada"}</h4>
        <p className="mt-1 text-sm text-stone-300">{copy?.subtitle ?? "Clique em gerar/regenerar copy para preencher este conteúdo."}</p>
        <p className="mt-3 whitespace-pre-line text-sm leading-6 text-stone-300">{copy?.caption ?? ""}</p>
        <p className="mt-3 text-xs text-astral-gold">{copy?.hashtags.join(" ") ?? ""}</p>
        <p className="mt-2 text-sm text-stone-200">CTA: {copy?.cta ?? content.plan.ctaType}</p>
        <p className="mt-1 text-sm text-stone-400">Comentário fixado: {copy?.pinnedComment ?? "-"}</p>
      </section>

      <QualityChecklist content={content} />

      {needsFix ? (
        <div className="mt-3 rounded-md border border-astral-rose/25 bg-astral-rose/10 p-3 text-sm text-stone-200">
          <p className="font-semibold text-astral-rose">Precisa ajuste</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {getQualitySuggestions(content.qualityScore).map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {copy && !validation.valid ? (
        <div className="mt-3 rounded-md border border-astral-gold/25 bg-astral-gold/10 p-3 text-sm text-stone-200">
          <p className="font-semibold text-astral-gold">
            Validação de conteúdo {validation.blocked ? "bloqueou aprovação" : "pediu revisão"}
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {validation.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <VisualPromptPreview
        prompts={content.visualPrompts}
        generatingImageIndex={generatingImageIndex}
        onGenerateImage={onGenerateImage}
        onDownloadImage={(index) => downloadPng(index)}
      />

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <ActionButton onClick={() => copyText(copy?.caption ?? "")} label="Copiar legenda" icon={<Clipboard />} />
        <ActionButton onClick={() => copyText(copy?.hashtags.join(" ") ?? "")} label="Copiar hashtags" icon={<Clipboard />} />
        <ActionButton onClick={() => copyText(copy?.pinnedComment ?? "")} label="Copiar comentário" icon={<Clipboard />} />
        <ActionButton onClick={() => copyText(content.visualPrompts[0]?.prompt ?? "")} label="Copiar prompt" icon={<Clipboard />} />
        <ActionButton onClick={onRegenerateCopy} label={isGenerating ? "Gerando..." : "Regenerar copy"} icon={<RefreshCw />} />
        <ActionButton onClick={onRegenerateVisual} label="Regenerar prompt visual" icon={<RefreshCw />} />
        <ActionButton disabled={!canApprove} onClick={() => onStatusChange("aprovado")} label="Aprovar" icon={<CheckCircle2 />} />
        <ActionButton disabled={content.status !== "aprovado"} onClick={() => onStatusChange("publicado")} label="Marcar publicado" icon={<Send />} />
        <ActionButton onClick={() => downloadPng(0)} label="Baixar PNG" icon={<ImageDown />} />
        <ActionButton onClick={() => downloadTextFile(`${content.plan.date}-${content.plan.format}.txt`, buildCaptionTxt(content))} label="Legenda TXT" icon={<FileText />} />
      </div>
    </article>
  );
}

function QualityChecklist({ content }: { content: ProductionContent }) {
  const items = [
    ["Faz parar o scroll?", content.qualityScore.scrollStop],
    ["Gera identificação?", content.qualityScore.identification],
    ["Leva à ação?", content.qualityScore.action],
    ["Texto cabe na imagem?", content.qualityScore.clarity],
    ["Não está repetitivo?", content.qualityScore.nonRepetition]
  ] as const;

  return (
    <div className="mt-4 grid gap-2 md:grid-cols-5">
      {items.map(([label, score]) => (
        <div key={label} className="rounded-md border border-white/5 bg-astral-void/35 p-2">
          <p className="text-xs text-stone-400">{label}</p>
          <p className={score < 7 ? "mt-1 font-semibold text-astral-rose" : "mt-1 font-semibold text-astral-teal"}>
            {score}/10
          </p>
        </div>
      ))}
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded border border-astral-violet/25 bg-astral-violet/10 px-2 py-1 text-violet-200">{children}</span>;
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
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-astral-line bg-astral-night px-3 text-sm text-stone-100 transition hover:border-astral-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
    >
      {icon}
      {label}
    </button>
  );
}
