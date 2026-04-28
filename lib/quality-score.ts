import type { ProductionContent, QualityScore } from "@/types/production";

export function calculateQualityScore(content: Pick<ProductionContent, "plan" | "copy" | "visualPrompts">): QualityScore {
  const copy = content.copy?.copy;
  const firstPrompt = content.visualPrompts[0];
  const caption = copy?.caption ?? "";
  const title = copy?.title ?? content.plan.theme;
  const cta = copy?.cta ?? content.plan.ctaType;

  return {
    scrollStop: clamp(Math.round((content.plan.score.follow + content.plan.score.share + content.plan.score.emotionalIntensity) / 3)),
    identification: clamp(
      content.plan.hookType.includes("identificação") || caption.length > 80
        ? content.plan.score.emotionalIntensity + 1
        : content.plan.score.emotionalIntensity
    ),
    action: clamp(cta.length > 0 ? content.plan.score.bioClick + content.plan.score.comment / 3 : 4),
    clarity: clamp(title.split(/\s+/).length <= 12 && firstPrompt?.safeArea ? 9 : 6),
    nonRepetition: clamp(10 - content.plan.score.repetitionRisk)
  };
}

export function getAverageQualityScore(score: QualityScore) {
  const values = Object.values(score);
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

export function needsAdjustment(score: QualityScore) {
  return getAverageQualityScore(score) < 7 || Object.values(score).some((value) => value < 7);
}

export function getQualitySuggestions(score: QualityScore) {
  const suggestions: string[] = [];

  if (score.scrollStop < 7) suggestions.push("Reforce o gancho visual ou a primeira linha.");
  if (score.identification < 7) suggestions.push("Aumente a identificação emocional sem exagerar no drama.");
  if (score.action < 7) suggestions.push("Deixe o CTA mais direto e fácil de executar.");
  if (score.clarity < 7) suggestions.push("Reduza texto de imagem e simplifique a hierarquia.");
  if (score.nonRepetition < 7) suggestions.push("Regere tema, gancho ou ciência base para reduzir repetição.");

  return suggestions;
}

function clamp(value: number) {
  return Math.max(0, Math.min(10, Math.round(value)));
}
