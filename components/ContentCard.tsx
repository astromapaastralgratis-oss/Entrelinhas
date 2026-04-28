import { BadgeCheck, Brain, ChevronRight, Flame, Instagram, Layers3, MousePointerClick, Wand2 } from "lucide-react";
import { VisualPromptPreview } from "@/components/VisualPromptPreview";
import { generateVisualPromptsForContent } from "@/lib/visual-prompts";
import type { EditorialPlanItem } from "@/types/content";
import type { GenerateCopyResult } from "@/types/copy";

const formatLabel: Record<EditorialPlanItem["format"], string> = {
  feed: "Feed",
  carrossel: "Carrossel",
  stories: "Stories",
  reels: "Reels",
  tiktok: "TikTok"
};

type ContentCardProps = {
  item: EditorialPlanItem;
  generatedCopy?: GenerateCopyResult;
  isGenerating?: boolean;
  onGenerateCopy?: () => void;
};

export function ContentCard({ item, generatedCopy, isGenerating, onGenerateCopy }: ContentCardProps) {
  const visualPrompts = generateVisualPromptsForContent(item, generatedCopy?.copy);

  return (
    <article className="group rounded-lg border border-astral-line bg-[#151520]/92 p-4 transition hover:border-astral-gold/70 hover:bg-[#191926]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded border border-astral-gold/35 bg-astral-gold/10 px-2 py-1 text-astral-gold">
              <Instagram className="h-3.5 w-3.5" />
              {formatLabel[item.format]}
            </span>
            <span className="rounded border border-astral-violet/30 bg-astral-violet/10 px-2 py-1 text-violet-200">
              {item.platform}
            </span>
            <span className="rounded border border-astral-teal/30 bg-astral-teal/10 px-2 py-1 text-astral-teal">
              {item.moment}
            </span>
          </div>
          <h3 className="mt-3 text-lg font-semibold leading-6 text-stone-50">{item.theme}</h3>
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-stone-500 transition group-hover:translate-x-0.5 group-hover:text-astral-gold" />
      </div>

      <p className="mt-3 text-sm leading-6 text-stone-300">{item.strategicReason}</p>

      <div className="mt-4 grid gap-2 text-xs text-stone-300 sm:grid-cols-2">
        <span className="inline-flex items-center gap-2 rounded-md bg-white/[0.035] px-3 py-2">
          <Layers3 className="h-4 w-4 text-astral-teal" />
          {item.hookType}
        </span>
        <span className="inline-flex items-center gap-2 rounded-md bg-white/[0.035] px-3 py-2">
          <Brain className="h-4 w-4 text-astral-rose" />
          {item.scienceBase}
        </span>
        <span className="inline-flex items-center gap-2 rounded-md bg-white/[0.035] px-3 py-2">
          <BadgeCheck className="h-4 w-4 text-astral-gold" />
          {item.objective}
        </span>
        <span className="inline-flex items-center gap-2 rounded-md bg-white/[0.035] px-3 py-2">
          <MousePointerClick className="h-4 w-4 text-astral-violet" />
          {item.ctaType}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs md:grid-cols-6">
        <Score label="seguir" value={item.score.follow} />
        <Score label="salvar" value={item.score.save} />
        <Score label="compart." value={item.score.share} />
        <Score label="coment." value={item.score.comment} />
        <Score label="bio" value={item.score.bioClick} />
        <Score label="risco" value={item.score.repetitionRisk} />
      </div>

      <div className="mt-4 flex items-center gap-2 border-t border-astral-line pt-3 text-sm text-stone-200">
        <Flame className="h-4 w-4 text-astral-rose" />
        Intensidade emocional {item.score.emotionalIntensity}/10
      </div>

      {generatedCopy ? (
        <div className="mt-4 rounded-md border border-astral-teal/25 bg-astral-teal/10 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs uppercase tracking-[0.18em] text-astral-teal">Copy gerada</p>
            <span className="text-xs text-stone-400">
              ${generatedCopy.cost.estimatedCost.toFixed(6)} · {generatedCopy.cost.totalTokensEstimate} tokens est.
            </span>
          </div>
          <h4 className="mt-2 text-sm font-semibold text-stone-50">{generatedCopy.copy.title}</h4>
          <p className="mt-1 text-sm leading-6 text-stone-300">{generatedCopy.copy.caption}</p>
          <p className="mt-2 text-xs text-astral-gold">{generatedCopy.copy.hashtags.join(" ")}</p>
        </div>
      ) : null}

      {onGenerateCopy ? (
        <button
          type="button"
          onClick={onGenerateCopy}
          disabled={isGenerating}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-md border border-astral-line bg-astral-night px-3 text-sm font-semibold text-stone-100 transition hover:border-astral-gold hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Wand2 className="h-4 w-4" />
          {generatedCopy ? "Regenerar só este item" : isGenerating ? "Gerando copy..." : "Gerar copy com IA"}
        </button>
      ) : null}

      <VisualPromptPreview prompts={visualPrompts} />
    </article>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-white/5 bg-astral-void/35 px-2 py-2">
      <p className="font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-stone-500">{label}</p>
    </div>
  );
}
