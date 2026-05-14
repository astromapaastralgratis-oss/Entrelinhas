export type BetaPersonalizationRating = "sim_muito" | "em_partes" | "pouco" | "nao";
export type BetaDepthRating = "superficial" | "adequado" | "profundo" | "profundo_demais_confuso";
export type BetaIntentRating = "sim" | "talvez" | "nao";
export type BetaToneRating = "humano_sofisticado" | "um_pouco_generico" | "muito_tecnico" | "muito_emocional";

export type RaioXBetaFeedbackDraft = {
  personalizationRating: BetaPersonalizationRating | null;
  depthRating: BetaDepthRating | null;
  wouldShare: BetaIntentRating | null;
  wouldReturn: BetaIntentRating | null;
  toneRating: BetaToneRating | null;
  mostRealPart: string;
  genericPart: string;
  improvementSuggestion: string;
};

export type RaioXBetaFeedbackPayload = {
  result_id: string;
  user_id: string;
  profile_id: string;
  methodology_version: string | null;
  personalization_rating: BetaPersonalizationRating | null;
  depth_rating: BetaDepthRating | null;
  tone_rating: BetaToneRating | null;
  most_real_part: string | null;
  generic_part: string | null;
  improvement_suggestion: string | null;
  would_share: BetaIntentRating | null;
  would_return: BetaIntentRating | null;
};

export function hasRaioXBetaFeedback(draft: RaioXBetaFeedbackDraft) {
  return Boolean(
    draft.personalizationRating ||
      draft.depthRating ||
      draft.wouldShare ||
      draft.wouldReturn ||
      draft.toneRating ||
      draft.mostRealPart.trim() ||
      draft.genericPart.trim() ||
      draft.improvementSuggestion.trim()
  );
}

export function buildRaioXBetaFeedbackPayload({
  resultId,
  userId,
  profileId,
  methodologyVersion,
  draft
}: {
  resultId?: string;
  userId?: string;
  profileId?: string;
  methodologyVersion?: string;
  draft: RaioXBetaFeedbackDraft;
}): RaioXBetaFeedbackPayload | null {
  if (!resultId || !userId || !profileId || !hasRaioXBetaFeedback(draft)) {
    return null;
  }

  return {
    result_id: resultId,
    user_id: userId,
    profile_id: profileId,
    methodology_version: methodologyVersion ?? null,
    personalization_rating: draft.personalizationRating,
    depth_rating: draft.depthRating,
    tone_rating: draft.toneRating,
    most_real_part: normalizeOptionalText(draft.mostRealPart),
    generic_part: normalizeOptionalText(draft.genericPart),
    improvement_suggestion: normalizeOptionalText(draft.improvementSuggestion),
    would_share: draft.wouldShare,
    would_return: draft.wouldReturn
  };
}

function normalizeOptionalText(value: string) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}
