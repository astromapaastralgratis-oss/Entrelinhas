import { executivePresenceProfiles } from "@/src/data/executivePresenceProfiles";
import { executivePresenceQuestions } from "@/src/data/executivePresenceQuestions";
import type {
  ConfidenceLevel,
  ExecutivePresenceAnswer,
  ExecutivePresenceProfileId,
  ExecutivePresenceResult,
  ExecutivePresenceScores,
  InvalidExecutivePresenceAnswer,
  TraitKey
} from "@/src/types/executivePresence";

const traitPriority: TraitKey[] = ["direction", "influence", "diplomacy", "precision"];

const primaryProfileByTrait: Record<TraitKey, ExecutivePresenceProfileId> = {
  direction: "assertive_executor",
  influence: "strategic_influencer",
  diplomacy: "relational_diplomat",
  precision: "analytical_advisor"
};

const combinedProfileByTraits: Record<string, ExecutivePresenceProfileId> = {
  "direction+influence": "leader_mobilizer",
  "direction+precision": "decision_strategist",
  "influence+diplomacy": "diplomatic_articulator",
  "diplomacy+precision": "careful_counselor",
  "direction+diplomacy": "firmness_builder",
  "influence+precision": "analytical_influencer"
};

export function calculateExecutivePresenceResult(
  answers: ExecutivePresenceAnswer[],
  questions = executivePresenceQuestions
): ExecutivePresenceResult {
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const validAnswerByQuestion = new Map<string, TraitKey>();
  const invalidAnswers: InvalidExecutivePresenceAnswer[] = [];

  for (const answer of answers) {
    const question = questionById.get(answer.questionId);

    if (!question) {
      invalidAnswers.push({ ...answer, reason: "question_not_found" });
      continue;
    }

    const option = question.options.find((item) => item.id === answer.optionId);

    if (!option) {
      invalidAnswers.push({ ...answer, reason: "option_not_found" });
      continue;
    }

    validAnswerByQuestion.set(answer.questionId, option.traitKey);
  }

  const scores = createEmptyScores();

  for (const traitKey of Array.from(validAnswerByQuestion.values())) {
    scores[traitKey] += 1;
  }

  const rankedTraits = rankTraits(scores);
  const primaryTrait = rankedTraits[0].trait;
  const secondaryTrait = rankedTraits[1].trait;
  const scoreDifference = rankedTraits[0].score - rankedTraits[1].score;
  const isCombined = scoreDifference <= 2;
  const profileId = isCombined ? getCombinedProfileId(primaryTrait, secondaryTrait) : primaryProfileByTrait[primaryTrait];
  const confidenceLevel = getConfidenceLevel(scoreDifference);

  return {
    profileId,
    profile: executivePresenceProfiles[profileId],
    primaryTrait,
    secondaryTrait,
    scores,
    answeredQuestions: validAnswerByQuestion.size,
    totalQuestions: questions.length,
    completed: validAnswerByQuestion.size === questions.length,
    isCombined,
    confidenceLevel,
    invalidAnswers
  };
}

function createEmptyScores(): ExecutivePresenceScores {
  return {
    direction: 0,
    influence: 0,
    diplomacy: 0,
    precision: 0
  };
}

function rankTraits(scores: ExecutivePresenceScores) {
  return traitPriority
    .map((trait, priority) => ({ trait, score: scores[trait], priority }))
    .sort((first, second) => second.score - first.score || first.priority - second.priority);
}

function getCombinedProfileId(primaryTrait: TraitKey, secondaryTrait: TraitKey) {
  const pairKey = [primaryTrait, secondaryTrait]
    .sort((first, second) => traitPriority.indexOf(first) - traitPriority.indexOf(second))
    .join("+");

  return combinedProfileByTraits[pairKey];
}

function getConfidenceLevel(scoreDifference: number): ConfidenceLevel {
  if (scoreDifference >= 5) return "high";
  if (scoreDifference >= 3) return "medium";
  return "low";
}
