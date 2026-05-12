export type ExecutivePresenceFeedbackDraft = {
  mostRealPart: string;
  genericPart: string;
  wouldShare: boolean | null;
  wouldReturn: boolean | null;
};

export type ExecutivePresenceFeedbackPayload = {
  result_id: string;
  user_id: string;
  most_real_part: string | null;
  generic_part: string | null;
  would_share: boolean | null;
  would_return: boolean | null;
};

export function hasExecutivePresenceFeedback(draft: ExecutivePresenceFeedbackDraft) {
  return Boolean(
    draft.mostRealPart.trim() ||
      draft.genericPart.trim() ||
      draft.wouldShare !== null ||
      draft.wouldReturn !== null
  );
}

export function buildExecutivePresenceFeedbackPayload({
  resultId,
  userId,
  draft
}: {
  resultId?: string;
  userId?: string;
  draft: ExecutivePresenceFeedbackDraft;
}): ExecutivePresenceFeedbackPayload | null {
  if (!resultId || !userId || !hasExecutivePresenceFeedback(draft)) {
    return null;
  }

  return {
    result_id: resultId,
    user_id: userId,
    most_real_part: normalizeOptionalText(draft.mostRealPart),
    generic_part: normalizeOptionalText(draft.genericPart),
    would_share: draft.wouldShare,
    would_return: draft.wouldReturn
  };
}

function normalizeOptionalText(value: string) {
  const normalized = value.trim();
  return normalized ? normalized : null;
}
