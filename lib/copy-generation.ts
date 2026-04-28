import { buildCompactTextPrompt, generateTextCopy, parseAiJson } from "@/lib/ai/text-generation";
import {
  defaultCopyModel,
  estimateCopyCost,
  estimateTokens,
  getModePolicy,
  shouldBlockForDailyLimit
} from "@/lib/cost-control";
import { assertValidGeneratedContent } from "@/lib/content-validation";
import type { EditorialPlanItem } from "@/types/content";
import type { CopyBrief, GeneratedCopy, GenerateCopyRequest, GenerateCopyResult } from "@/types/copy";

const copySystemPrompt =
  "Você é o motor de copy do Astral Pessoal. Gere conteúdo em PT-BR para redes sociais. Linguagem direta, emocionalmente inteligente, acessível, sem promessa absoluta, sem diagnóstico, sem esoterismo exagerado. Retorne apenas JSON válido.";

export function generateCopyBrief(planItem: EditorialPlanItem): CopyBrief {
  return {
    format: planItem.format,
    cards: getCardCount(planItem.format),
    objective: planItem.objective,
    scienceBase: planItem.scienceBase,
    theme: planItem.theme,
    hookType: planItem.hookType,
    moment: planItem.moment,
    ctaType: planItem.ctaType,
    tone: "direto, emocionalmente inteligente, acessível",
    imageTextLimit: "título até 9 palavras, subtítulo até 14 palavras",
    wordLimit: getWordLimit(planItem.format)
  };
}

export function buildCompactCopyPrompt(brief: CopyBrief, mode = "padrao") {
  return buildCompactTextPrompt({
    format: brief.format,
    objective: brief.objective,
    scienceBase: brief.scienceBase,
    theme: brief.theme,
    hookType: brief.hookType,
    moment: brief.moment,
    cards: brief.cards,
    ctaType: brief.ctaType,
    tone: `direto, EI, acessível, ${mode}`,
    limits: {
      titleMaxWords: 12,
      subtitleMaxWords: 18
    }
  });
}

export async function generateCopy(request: GenerateCopyRequest): Promise<GenerateCopyResult> {
  const brief = generateCopyBrief(request.planItem);
  const modePolicy = getModePolicy(request.automationMode);
  const userPrompt = buildCompactCopyPrompt(brief, modePolicy.mode);
  const promptTokensEstimate = estimateTokens(`${copySystemPrompt}\n${userPrompt}`);
  const completionTokensEstimate = getCompletionTokenEstimate(brief.cards, modePolicy.copyCompleteness);
  const estimatedCost = estimateCopyCost(promptTokensEstimate, completionTokensEstimate);
  const limit = shouldBlockForDailyLimit(request.currentDailyCost ?? 0, estimatedCost, request.intensity ?? modePolicy.intensity);

  const baseCost = {
    model: defaultCopyModel,
    promptTokensEstimate,
    completionTokensEstimate,
    totalTokensEstimate: promptTokensEstimate + completionTokensEstimate,
    estimatedCost,
    dailyLimit: limit.dailyLimit,
    blocked: limit.blocked,
    reason: limit.reason,
    mode: modePolicy.mode
  };

  if (limit.blocked) {
    return {
      brief,
      copy: createEmptyCopy(brief.cards),
      cost: baseCost,
      source: "fallback"
    };
  }

  if (request.forceMock) {
    return {
      brief,
      copy: validateGeneratedCopy(generateFallbackCopy(brief, modePolicy.copyCompleteness), brief.cards),
      cost: baseCost,
      source: "mock"
    };
  }

  try {
    const aiResult = await generateTextCopy({
      planItemId: request.planItemId,
      format: request.planItem.format,
      objective: request.planItem.objective,
      scienceBase: request.planItem.scienceBase,
      theme: request.planItem.theme,
      hookType: request.planItem.hookType,
      moment: request.planItem.moment,
      cards: brief.cards,
      ctaType: request.planItem.ctaType,
      tone: brief.tone,
      limits: {
        titleMaxWords: 12,
        subtitleMaxWords: 18
      },
      userId: request.userId,
      provider: request.provider
    });

    return {
      brief,
      copy: validateGeneratedCopy(aiResult.copy, brief.cards),
      cost: { ...baseCost, model: aiResult.model },
      source: aiResult.provider
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return {
      brief,
      copy: validateGeneratedCopy(generateFallbackCopy(brief, modePolicy.copyCompleteness), brief.cards),
      cost: {
        ...baseCost,
        reason: `Fallback local usado porque a IA falhou: ${message}`,
      },
      source: "fallback"
    };
  }
}

export function parseGeneratedCopyJson(outputText: string): GeneratedCopy {
  return parseAiJson(outputText);
}

function validateGeneratedCopy(copy: GeneratedCopy, cards: number): GeneratedCopy {
  const normalizedCopy: GeneratedCopy = {
    ...copy,
    slides: Array.isArray(copy.slides) ? copy.slides : [],
    hashtags: normalizeHashtags(copy.hashtags),
    cta: trimWords(copy.cta || fallbackCtaFromCaption(copy.caption), 12),
    pinnedComment: copy.pinnedComment || "Qual parte fez sentido para você?",
    qualityNotes: copy.qualityNotes ?? {
      scrollStop: "Gancho direto para interromper o scroll.",
      identification: "Tema conectado a uma sensação cotidiana.",
      action: "CTA simples e executável."
    }
  };

  const slides = normalizedCopy.slides.slice(0, cards).map((slide, index) => ({
    number: index + 1,
    title: trimWords(slide.title, 12),
    subtitle: trimWords(slide.subtitle, 18),
    visualCue: slide.visualCue
  }));

  const trimmedCopy = {
    title: trimWords(normalizedCopy.title, 12),
    subtitle: trimWords(normalizedCopy.subtitle, 18),
    slides,
    caption: normalizedCopy.caption,
    hashtags: normalizedCopy.hashtags,
    cta: normalizedCopy.cta,
    pinnedComment: normalizedCopy.pinnedComment,
    qualityNotes: normalizedCopy.qualityNotes
  };

  assertValidGeneratedContent({ copy: trimmedCopy });

  return trimmedCopy;
}

function generateFallbackCopy(brief: CopyBrief, completeness: "minimal" | "complete" | "variations" = "complete"): GeneratedCopy {
  const title = trimWords(`${brief.theme.split(":")[0]} para ${brief.moment}`, 12);
  const subtitle = trimWords(`Um sinal prático de ${brief.scienceBase} para decidir melhor.`, 18);
  const caption =
    completeness === "minimal"
      ? `${title}\n\nObserve o sinal do dia e escolha um passo simples.\n\n${ctaText(brief.ctaType)}`
      : `${title}\n\nÀs vezes, clareza não chega como resposta pronta. Ela aparece quando você observa o que está se repetindo e escolhe um próximo passo menor.\n\n${ctaText(brief.ctaType)}`;

  return {
    title,
    subtitle,
    slides: Array.from({ length: brief.cards }, (_, index) => ({
      number: index + 1,
      title: index === 0 ? title : trimWords(`Passo ${index + 1}: observe o sinal`, 12),
      subtitle: index === 0 ? subtitle : trimWords("Transforme a percepção em uma escolha simples hoje.", 18),
      visualCue: `${brief.scienceBase}, ${brief.moment}, visual dark premium com texto curto`
    })),
    caption,
    hashtags: ["#AstralPessoal", "#Autoconhecimento", "#Astrologia", "#ClarezaEmocional", "#EnergiaDoDia"],
    cta: ctaText(brief.ctaType),
    pinnedComment: "Qual sinal apareceu para você hoje?",
    qualityNotes: {
      scrollStop: "Título curto e conectado ao momento do dia.",
      identification: "Fala sobre repetição emocional sem diagnosticar.",
      action: "CTA simples e alinhado ao objetivo."
    }
  };
}

function getCompletionTokenEstimate(cards: number, completeness: "minimal" | "complete" | "variations") {
  if (completeness === "minimal") return Math.max(120, cards * 35);
  if (completeness === "variations") return Math.max(420, cards * 95);
  return Math.max(260, cards * 70);
}

function createEmptyCopy(cards: number): GeneratedCopy {
  return {
    title: "",
    subtitle: "",
    slides: Array.from({ length: cards }, (_, index) => ({ number: index + 1, title: "", subtitle: "", visualCue: "" })),
    caption: "",
    hashtags: [],
    cta: "",
    pinnedComment: "",
    qualityNotes: {
      scrollStop: "",
      identification: "",
      action: ""
    }
  };
}

function ctaText(ctaType: CopyBrief["ctaType"]) {
  const ctas: Record<CopyBrief["ctaType"], string> = {
    "seguir página": "Siga para receber sua direção do dia.",
    salvar: "Salve para consultar depois.",
    compartilhar: "Compartilhe com quem precisa desse sinal.",
    comentar: "Comente sua palavra do dia.",
    "acessar link na bio": "Acesse o link na bio.",
    "gerar relatório no app": "Gere seu relatório no app."
  };

  return ctas[ctaType];
}

function normalizeHashtags(hashtags: string[] | undefined) {
  const clean = (hashtags ?? []).filter((tag) => tag.startsWith("#")).slice(0, 8);
  if (clean.length >= 5) return clean;

  return unique([
    ...clean,
    "#AstralPessoal",
    "#Autoconhecimento",
    "#Astrologia",
    "#ClarezaEmocional",
    "#EnergiaDoDia",
    "#TikTokBrasil",
    "#ReelsBrasil"
  ]).slice(0, 8);
}

function fallbackCtaFromCaption(caption: string) {
  if (/bio|app/i.test(caption)) return "Acesse o link na bio.";
  if (/comenta|comentário/i.test(caption)) return "Comente sua palavra do dia.";
  return "Siga para receber sua direção do dia.";
}

function getCardCount(format: EditorialPlanItem["format"]) {
  const counts: Record<EditorialPlanItem["format"], number> = {
    feed: 1,
    carrossel: 6,
    stories: 5,
    reels: 1,
    tiktok: 1
  };

  return counts[format];
}

function getWordLimit(format: EditorialPlanItem["format"]) {
  const limits: Record<EditorialPlanItem["format"], number> = {
    feed: 110,
    carrossel: 90,
    stories: 45,
    reels: 80,
    tiktok: 70
  };

  return limits[format];
}

function trimWords(text: string | null | undefined, maxWords: number) {
  return String(text ?? "").split(/\s+/).filter(Boolean).slice(0, maxWords).join(" ");
}

function unique(items: string[]) {
  return Array.from(new Set(items));
}
