import { executivePresenceProfiles } from "@/src/data/executivePresenceProfiles";
import { executivePresenceQuestions } from "@/src/data/executivePresenceQuestions";
import type {
  ConfidenceLevel,
  ExecutivePresenceAnswer,
  ExecutivePresenceProfileId,
  ExecutivePresenceResult,
  ExecutivePresenceScores,
  TraitKey
} from "@/src/types/executivePresence";
import type { ExecutivePresenceResultRow } from "@/types/database";

const traitKeys: TraitKey[] = ["direction", "influence", "diplomacy", "precision"];
const confidenceLevels: ConfidenceLevel[] = ["low", "medium", "high"];

export type ActiveExecutivePresenceProfile = {
  resultId: string | null;
  profileId: ExecutivePresenceProfileId | null;
  completedAt: string | null;
  profileName: string | null;
};

export function isExecutivePresenceProfileId(value: unknown): value is ExecutivePresenceProfileId {
  return typeof value === "string" && value in executivePresenceProfiles;
}

export function hasActiveExecutivePresence(profile: {
  active_executive_presence_result_id?: string | null;
  executive_presence_profile_id?: string | null;
  executive_presence_completed_at?: string | null;
} | null | undefined) {
  return Boolean(
    profile?.active_executive_presence_result_id &&
      isExecutivePresenceProfileId(profile.executive_presence_profile_id) &&
      profile.executive_presence_completed_at
  );
}

export function getActiveExecutivePresenceProfile(profile: {
  active_executive_presence_result_id?: string | null;
  executive_presence_profile_id?: string | null;
  executive_presence_completed_at?: string | null;
} | null | undefined): ActiveExecutivePresenceProfile {
  const profileId = isExecutivePresenceProfileId(profile?.executive_presence_profile_id)
    ? profile.executive_presence_profile_id
    : null;

  return {
    resultId: profile?.active_executive_presence_result_id ?? null,
    profileId,
    completedAt: profile?.executive_presence_completed_at ?? null,
    profileName: profileId ? executivePresenceProfiles[profileId].name : null
  };
}

export function restoreExecutivePresenceResult(row: ExecutivePresenceResultRow | null | undefined): ExecutivePresenceResult | null {
  if (!row || !isExecutivePresenceProfileId(row.profile_id)) return null;
  if (!isTraitKey(row.primary_trait)) return null;

  const secondaryTrait = isTraitKey(row.secondary_trait) ? row.secondary_trait : row.primary_trait;
  const confidenceLevel = isConfidenceLevel(row.confidence_level) ? row.confidence_level : "low";
  const scores = isScores(row.scores) ? row.scores : null;
  const answers = Array.isArray(row.answers) ? row.answers.filter(isAnswer) : [];

  if (!scores) return null;

  const topScore = scores[row.primary_trait] ?? 0;
  const secondScore = scores[secondaryTrait] ?? 0;

  return {
    profileId: row.profile_id,
    profile: executivePresenceProfiles[row.profile_id],
    primaryTrait: row.primary_trait,
    secondaryTrait,
    scores,
    answeredQuestions: answers.length,
    totalQuestions: executivePresenceQuestions.length,
    completed: answers.length >= executivePresenceQuestions.length,
    isCombined: topScore - secondScore <= 2,
    confidenceLevel,
    invalidAnswers: []
  };
}

function isTraitKey(value: unknown): value is TraitKey {
  return typeof value === "string" && traitKeys.includes(value as TraitKey);
}

function isConfidenceLevel(value: unknown): value is ConfidenceLevel {
  return typeof value === "string" && confidenceLevels.includes(value as ConfidenceLevel);
}

function isAnswer(value: unknown): value is ExecutivePresenceAnswer {
  if (!value || typeof value !== "object") return false;
  const answer = value as Partial<ExecutivePresenceAnswer>;
  return typeof answer.questionId === "string" && typeof answer.optionId === "string";
}

function isScores(value: unknown): value is ExecutivePresenceScores {
  if (!value || typeof value !== "object") return false;
  const scores = value as Partial<Record<TraitKey, unknown>>;
  return traitKeys.every((trait) => typeof scores[trait] === "number");
}
