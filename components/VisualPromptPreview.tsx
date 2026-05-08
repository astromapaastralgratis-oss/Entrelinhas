"use client";

import { ChevronDown, Copy, ImageIcon } from "lucide-react";
import { useState } from "react";
import type { VisualPromptResult } from "@/types/visual";

type VisualPromptPreviewProps = {
  prompts: VisualPromptResult[];
  onGenerateImage?: (index: number) => void;
  onDownloadImage?: (index: number) => void;
  generatingImageIndex?: number | null;
};

export function VisualPromptPreview({
  prompts,
  onGenerateImage,
  onDownloadImage,
  generatingImageIndex
}: VisualPromptPreviewProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  async function handleCopy(prompt: string, index: number) {
    await navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 1500);
  }

  if (!prompts[0]) return null;
  const firstPrompt = prompts[0];

  return (
    <div className="mt-4 rounded-md border border-entrelinhas-violet/25 bg-entrelinhas-violet/10 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-entrelinhas-violet" />
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-violet-200">Post</p>
            <p className="mt-1 text-sm text-stone-300">
              {prompts.length} post(s) independente(s). {firstPrompt.styleName} · modo{" "}
              {firstPrompt.visualMode === "light" ? "claro" : "escuro"} · {firstPrompt.width}x{firstPrompt.height}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDetailsOpen((current) => !current)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-entrelinhas-line px-3 text-sm text-stone-300 transition hover:border-entrelinhas-gold"
          >
            Detalhes
            <ChevronDown className={detailsOpen ? "h-4 w-4 rotate-180" : "h-4 w-4"} />
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {prompts.map((prompt, index) => (
          <div key={`${prompt.styleName}-preview-${index}`} className="rounded-md border border-white/10 bg-black/30 p-2">
            <p className="mb-2 text-xs uppercase tracking-[0.14em] text-stone-500">
              {prompts.length > 1 ? `Card ${index + 1} de ${prompts.length}` : "Post"}
            </p>
            {prompt.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={prompt.imageUrl} alt={`Preview do post ${index + 1}`} className="h-64 w-full object-contain" />
            ) : (
              <div className="flex h-64 flex-col items-center justify-center text-center text-stone-500">
                <ImageIcon className="h-7 w-7 text-entrelinhas-violet" />
                <p className="mt-2 text-xs">Post ainda nao gerado</p>
              </div>
            )}
            <div className="mt-2 grid gap-2">
              {onGenerateImage ? (
                <button
                  type="button"
                  onClick={() => onGenerateImage(index)}
                  className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-entrelinhas-line px-2 text-xs text-stone-100 transition hover:border-entrelinhas-gold"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                  {generatingImageIndex === index ? "Gerando..." : prompt.imageUrl ? "Refazer post" : "Gerar post"}
                </button>
              ) : null}
              {prompt.imageUrl && onDownloadImage ? (
                <button
                  type="button"
                  onClick={() => onDownloadImage(index)}
                  className="inline-flex h-8 items-center justify-center rounded-md border border-entrelinhas-line px-2 text-xs text-stone-100 transition hover:border-entrelinhas-gold"
                >
                  Baixar post
                </button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {detailsOpen ? (
        <div className="mt-3 space-y-3">
          {prompts.map((prompt, index) => (
            <div key={`${prompt.styleName}-${index}`} className="rounded-md border border-white/5 bg-entrelinhas-void/45 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-stone-50">
                  {index + 1}. {prompt.styleName} · modo {prompt.visualMode === "light" ? "claro" : "escuro"} ·{" "}
                  {prompt.ratio}
                </p>
                <button
                  type="button"
                  onClick={() => handleCopy(prompt.prompt, index)}
                  className="inline-flex h-8 items-center gap-2 rounded-md border border-entrelinhas-line px-2 text-xs text-stone-200 transition hover:border-entrelinhas-gold"
                >
                  <Copy className="h-3.5 w-3.5" />
                  {copiedIndex === index ? "Copiado" : "Copiar direcao"}
                </button>
              </div>

              <div className="mt-3 grid gap-2 text-xs sm:grid-cols-3">
                {prompt.textBlocks.map((block) => (
                  <div key={block.type} className="rounded border border-white/5 bg-white/[0.035] p-2">
                    <p className="uppercase tracking-[0.14em] text-stone-500">{block.type}</p>
                    <p className="mt-1 line-clamp-2 text-stone-200">{block.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 grid gap-2 text-xs text-stone-300 sm:grid-cols-3">
                <p>Formato final: {prompt.width}x{prompt.height}</p>
                <p>Area segura: {prompt.safeArea ? "sim" : "revisar"}</p>
                <p>{prompt.isPostReady ? "Arte pronta para post" : "Precisa ajuste"}</p>
              </div>
              {prompt.validationNotes.length ? (
                <ul className="mt-2 list-inside list-disc text-xs text-entrelinhas-rose">
                  {prompt.validationNotes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
