import { describe, expect, it } from "vitest";
import { executivePresenceProfiles } from "@/src/data/executivePresenceProfiles";
import {
  executivePresenceCriticalityWeights,
  executivePresenceMethodology
} from "@/src/data/executivePresenceMethodology";
import { executivePresenceQuestions } from "@/src/data/executivePresenceQuestions";
import { restoreExecutivePresenceResult } from "@/src/lib/entrelinhas";
import { buildExecutivePresenceEvolution } from "@/src/utils/buildExecutivePresenceEvolution";
import { buildExecutiveRecognitionPhrases } from "@/src/utils/buildExecutiveRecognitionPhrases";
import { calculateExecutivePresenceResult } from "@/src/utils/calculateExecutivePresenceResult";
import {
  buildExecutivePresenceFeedbackPayload,
  hasExecutivePresenceFeedback
} from "@/src/utils/executivePresenceFeedback";
import { shuffleArray } from "@/src/utils/shuffleArray";
import type { ExecutivePresenceResultRow } from "@/types/database";
import type { ExecutivePresenceAnswer, ExecutivePresenceProfile, TraitKey } from "@/src/types/executivePresence";

const traitKeys: TraitKey[] = ["direction", "influence", "diplomacy", "precision"];

function answersForTrait(traitKey: TraitKey, limit = executivePresenceQuestions.length): ExecutivePresenceAnswer[] {
  return executivePresenceQuestions.slice(0, limit).map((question) => {
    const option = question.options.find((item) => item.traitKey === traitKey);
    if (!option) throw new Error(`Missing ${traitKey} option for ${question.id}`);
    return { questionId: question.id, optionId: option.id };
  });
}

function mixedAnswers(firstTrait: TraitKey, firstCount: number, secondTrait: TraitKey, secondCount: number) {
  const answers: ExecutivePresenceAnswer[] = [];

  for (let index = 0; index < firstCount; index += 1) {
    const question = executivePresenceQuestions[index];
    const option = question.options.find((item) => item.traitKey === firstTrait);
    if (!option) throw new Error(`Missing ${firstTrait} option for ${question.id}`);
    answers.push({ questionId: question.id, optionId: option.id });
  }

  for (let index = firstCount; index < firstCount + secondCount; index += 1) {
    const question = executivePresenceQuestions[index];
    const option = question.options.find((item) => item.traitKey === secondTrait);
    if (!option) throw new Error(`Missing ${secondTrait} option for ${question.id}`);
    answers.push({ questionId: question.id, optionId: option.id });
  }

  return answers;
}

function answerFor(questionId: string, traitKey: TraitKey): ExecutivePresenceAnswer {
  const question = executivePresenceQuestions.find((item) => item.id === questionId);
  const option = question?.options.find((item) => item.traitKey === traitKey);
  if (!question || !option) throw new Error(`Missing ${traitKey} option for ${questionId}`);
  return { questionId, optionId: option.id };
}

function methodologyEntryForQuestion(questionId: string) {
  const entry = executivePresenceMethodology.find((item) => item.questionId === questionId);
  if (!entry) throw new Error(`Missing methodology entry for ${questionId}`);
  return entry;
}

function totalWeightForQuestions(questions = executivePresenceQuestions) {
  return questions.reduce((total, question) => total + methodologyEntryForQuestion(question.id).weight, 0);
}

function weightedScoreForSlice(startIndex: number, count: number) {
  return executivePresenceQuestions
    .slice(startIndex, startIndex + count)
    .reduce((total, question) => total + methodologyEntryForQuestion(question.id).weight, 0);
}

function resultFromAnswers(answers: ExecutivePresenceAnswer[], resultId: string, createdAt: string) {
  return {
    ...calculateExecutivePresenceResult(answers),
    resultId,
    createdAt
  };
}

describe("executive presence questions", () => {
  it("defines exactly 20 questions with four internal options each", () => {
    expect(executivePresenceQuestions).toHaveLength(20);

    for (const question of executivePresenceQuestions) {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options.map((option) => option.id)).size).toBe(4);
      expect(new Set(question.options.map((option) => option.traitKey))).toEqual(new Set(traitKeys));
    }
  });

  it("keeps internal trait keys out of user-facing question text", () => {
    const userFacingText = executivePresenceQuestions
      .flatMap((question) => [question.text, ...question.options.map((option) => option.text)])
      .join(" ")
      .toLowerCase();

    for (const traitKey of traitKeys) {
      expect(userFacingText).not.toContain(traitKey);
    }
  });
});

describe("executive presence methodology", () => {
  it("maps every question and option to traceable behavioral metadata", () => {
    expect(executivePresenceMethodology).toHaveLength(20);

    for (const question of executivePresenceQuestions) {
      const entry = executivePresenceMethodology.find((item) => item.questionId === question.id);
      expect(entry).toBeTruthy();
      expect(entry?.observedSituation).toBeTruthy();
      expect(entry?.evaluatedBehavior).toBeTruthy();
      expect(entry?.criticality).toMatch(/^(standard|elevated|critical)$/);
      expect(entry?.weight).toBe(executivePresenceCriticalityWeights[entry?.criticality ?? "standard"]);
      expect([1, 1.25, 1.5]).toContain(entry?.weight);
      expect(entry?.weightRationale).toBeTruthy();
      expect(entry?.options).toHaveLength(4);

      for (const option of question.options) {
        const methodologyOption = entry?.options.find((item) => item.optionId === option.id);
        expect(methodologyOption).toBeTruthy();
        expect(methodologyOption?.traitKey).toBe(option.traitKey);
        expect(methodologyOption?.subdimension).toBeTruthy();
        expect(methodologyOption?.executiveDynamic).toBeTruthy();
        expect(methodologyOption?.behaviorSignal).toBeTruthy();
        expect(methodologyOption?.interpretation).toBeTruthy();
        expect(methodologyOption?.risk).toBeTruthy();
        expect(methodologyOption?.feedback).toBeTruthy();
      }
    }
  });
});

describe("executive presence profiles", () => {
  it("defines the ten proprietary profiles with complete content blocks", () => {
    expect(Object.keys(executivePresenceProfiles).sort()).toEqual(
      [
        "analytical_advisor",
        "analytical_influencer",
        "assertive_executor",
        "careful_counselor",
        "decision_strategist",
        "diplomatic_articulator",
        "firmness_builder",
        "leader_mobilizer",
        "relational_diplomat",
        "strategic_influencer"
      ].sort()
    );

    for (const profile of Object.values(executivePresenceProfiles)) {
      expectProfileContent(profile);
    }
  });
});

describe("shuffleArray", () => {
  it("returns a shuffled copy without mutating the original array", () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original, () => 0);

    expect(original).toEqual([1, 2, 3, 4, 5]);
    expect(shuffled).not.toBe(original);
    expect(shuffled).not.toEqual(original);
    expect([...shuffled].sort()).toEqual(original);
  });
});

describe("calculateExecutivePresenceResult", () => {
  it("returns a primary profile when one trait is clearly dominant", () => {
    const result = calculateExecutivePresenceResult(answersForTrait("direction"));
    const totalWeightedScore = totalWeightForQuestions();

    expect(result.profileId).toBe("assertive_executor");
    expect(result.profile).toBe(executivePresenceProfiles[result.profileId]);
    expect(result.primaryTrait).toBe("direction");
    expect(result.secondaryTrait).toBe("influence");
    expect(result.isCombined).toBe(false);
    expect(result.confidenceLevel).toBe("high");
    expect(result.scores.direction).toBe(totalWeightedScore);
    expect(result.answeredQuestions).toBe(20);
    expect(result.totalQuestions).toBe(20);
    expect(result.completed).toBe(true);
    expect(result.invalidAnswers).toEqual([]);
    expect(result.subdimensionScores?.assertividade).toBeGreaterThan(0);
    expect(result.executiveDynamicScores?.firmeza_situacional).toBeGreaterThan(0);
    expect(result.traitIntensities?.direction).toBe("high");
    expect(result.behaviorSignals).toHaveLength(20);
    expect(result.behaviorSignals?.every((signal) => signal.weight > 0)).toBe(true);
    expect(result.behaviorSignals?.every((signal) => signal.criticality)).toBe(true);
  });

  it("returns a combined profile when top and second scores are close", () => {
    const result = calculateExecutivePresenceResult(mixedAnswers("direction", 10, "influence", 10));

    expect(result.profileId).toBe("leader_mobilizer");
    expect(result.profile).toBe(executivePresenceProfiles[result.profileId]);
    expect(result.primaryTrait).toBe("direction");
    expect(result.secondaryTrait).toBe("influence");
    expect(result.isCombined).toBe(true);
    expect(result.confidenceLevel).toBe("low");
    expect(result.scores.direction).toBe(weightedScoreForSlice(0, 10));
    expect(result.scores.influence).toBe(weightedScoreForSlice(10, 10));
    expect(result.conditionalInsights?.some((insight) => insight.id === "perfil_combinado")).toBe(true);
  });

  it("weights critical questions more heavily across trait, subdimension and dynamic scores", () => {
    const standardQuestion = executivePresenceQuestions.find((question) => methodologyEntryForQuestion(question.id).criticality === "standard");
    const criticalQuestion = executivePresenceQuestions.find((question) => methodologyEntryForQuestion(question.id).criticality === "critical");

    if (!standardQuestion || !criticalQuestion) throw new Error("Missing weighted questions for test");

    const standardOption = standardQuestion.options.find((option) => option.traitKey === "direction");
    const criticalOption = criticalQuestion.options.find((option) => option.traitKey === "influence");

    if (!standardOption || !criticalOption) throw new Error("Missing weighted options for test");

    const result = calculateExecutivePresenceResult([
      { questionId: standardQuestion.id, optionId: standardOption.id },
      { questionId: criticalQuestion.id, optionId: criticalOption.id }
    ]);
    const criticalMethodologyOption = methodologyEntryForQuestion(criticalQuestion.id).options.find(
      (option) => option.optionId === criticalOption.id
    );

    expect(result.scores.direction).toBe(1);
    expect(result.scores.influence).toBe(1.5);
    expect(result.behaviorSignals?.find((signal) => signal.questionId === criticalQuestion.id)?.weight).toBe(1.5);
    expect(result.behaviorSignals?.find((signal) => signal.questionId === criticalQuestion.id)?.criticality).toBe("critical");
    expect(result.subdimensionScores?.[criticalMethodologyOption!.subdimension]).toBeGreaterThanOrEqual(1.5);
    expect(result.executiveDynamicScores?.[criticalMethodologyOption!.executiveDynamic]).toBeGreaterThanOrEqual(1.5);
  });

  it("detects high delivery with low visibility as an executive tension", () => {
    const result = calculateExecutivePresenceResult([
      answerFor("q04", "precision"),
      answerFor("q05", "precision"),
      answerFor("q12", "precision"),
      answerFor("q19", "precision")
    ]);

    expect(result.executiveContradictions?.some((contradiction) => contradiction.id === "high_delivery_low_visibility")).toBe(true);
    expect(result.executiveContradictions).toEqual(
      [...(result.executiveContradictions ?? [])].sort((first, second) => second.severity - first.severity)
    );
  });

  it("detects high diplomacy with low boundaries as an executive tension", () => {
    const result = calculateExecutivePresenceResult([
      answerFor("q01", "diplomacy"),
      answerFor("q04", "diplomacy"),
      answerFor("q08", "diplomacy"),
      answerFor("q10", "diplomacy"),
      answerFor("q12", "diplomacy"),
      answerFor("q13", "diplomacy"),
      answerFor("q16", "diplomacy"),
      answerFor("q18", "diplomacy")
    ]);

    expect(result.executiveContradictions?.[0]?.id).toBe("high_diplomacy_low_boundaries");
    expect(result.executiveContradictions?.[0]?.risk).toContain("disponibilidade ilimitada");
  });

  it("detects high influence with low space ownership as an executive tension", () => {
    const result = calculateExecutivePresenceResult([
      answerFor("q01", "influence"),
      answerFor("q03", "influence"),
      answerFor("q07", "influence"),
      answerFor("q08", "influence"),
      answerFor("q09", "influence"),
      answerFor("q10", "influence"),
      answerFor("q11", "influence"),
      answerFor("q12", "influence"),
      answerFor("q13", "influence"),
      answerFor("q15", "influence"),
      answerFor("q16", "influence"),
      answerFor("q17", "influence")
    ]);

    expect(result.executiveContradictions?.some((contradiction) => contradiction.id === "high_influence_low_space_ownership")).toBe(true);
  });

  it("uses context without changing the base profile calculation", () => {
    const result = calculateExecutivePresenceResult(answersForTrait("precision"), executivePresenceQuestions, {
      currentRole: "Especialista financeira",
      seniority: "Senior",
      industry: "Financas",
      mainChallenge: "ganhar visibilidade em comites",
      careerGoal: "assumir lideranca"
    });

    expect(result.profileId).toBe("analytical_advisor");
    expect(result.contextSnapshot?.mainChallenge).toBe("ganhar visibilidade em comites");
    expect(result.contextualModifiers?.challengeLens).toContain("ganhar visibilidade");
    expect(result.conditionalInsights?.some((insight) => insight.id === "desafio_declarado")).toBe(true);
  });

  it("maps every primary trait to the expected primary profile", () => {
    expect(calculateExecutivePresenceResult(answersForTrait("direction")).profileId).toBe("assertive_executor");
    expect(calculateExecutivePresenceResult(answersForTrait("influence")).profileId).toBe("strategic_influencer");
    expect(calculateExecutivePresenceResult(answersForTrait("diplomacy")).profileId).toBe("relational_diplomat");
    expect(calculateExecutivePresenceResult(answersForTrait("precision")).profileId).toBe("analytical_advisor");
  });

  it("maps close trait pairs to the expected combined profiles", () => {
    expect(calculateExecutivePresenceResult(mixedAnswers("direction", 10, "precision", 10)).profileId).toBe("decision_strategist");
    expect(calculateExecutivePresenceResult(mixedAnswers("influence", 10, "diplomacy", 10)).profileId).toBe("diplomatic_articulator");
    expect(calculateExecutivePresenceResult(mixedAnswers("diplomacy", 10, "precision", 10)).profileId).toBe("careful_counselor");
    expect(calculateExecutivePresenceResult(mixedAnswers("direction", 10, "diplomacy", 10)).profileId).toBe("firmness_builder");
    expect(calculateExecutivePresenceResult(mixedAnswers("influence", 10, "precision", 10)).profileId).toBe("analytical_influencer");
  });

  it("ignores invalid answers and reports them separately", () => {
    const [validAnswer] = answersForTrait("precision", 1);
    const result = calculateExecutivePresenceResult([
      validAnswer,
      { questionId: "missing_question", optionId: "q01_o1" },
      { questionId: "q01", optionId: "missing_option" }
    ]);

    expect(result.answeredQuestions).toBe(1);
    expect(result.completed).toBe(false);
    expect(result.invalidAnswers).toEqual([
      { questionId: "missing_question", optionId: "q01_o1", reason: "question_not_found" },
      { questionId: "q01", optionId: "missing_option", reason: "option_not_found" }
    ]);
  });

  it("restores old saved results without stored contradictions", () => {
    const answers = answersForTrait("precision");
    const calculated = calculateExecutivePresenceResult(answers);
    const restored = restoreExecutivePresenceResult({
      id: "result-id",
      user_id: "user-id",
      profile_id: calculated.profileId,
      primary_trait: calculated.primaryTrait,
      secondary_trait: calculated.secondaryTrait,
      confidence_level: calculated.confidenceLevel,
      scores: calculated.scores,
      answers,
      methodology_version: "2026-05-11-v1",
      subdimension_scores: null,
      executive_dynamic_scores: null,
      trait_intensities: null,
      behavior_signals: null,
      conditional_insights: null,
      context_snapshot: null,
      created_at: "2026-05-12T00:00:00.000Z"
    } satisfies ExecutivePresenceResultRow);

    expect(restored?.profileId).toBe(calculated.profileId);
    expect(restored?.executiveContradictions).toEqual(expect.any(Array));
  });
});

describe("buildExecutivePresenceEvolution", () => {
  it("returns no evolution when there is no previous result", () => {
    const current = resultFromAnswers(answersForTrait("direction"), "current", "2026-05-12T00:00:00.000Z");

    expect(buildExecutivePresenceEvolution(current, null)).toBeUndefined();
  });

  it("detects increase signals and generates a short narrative", () => {
    const previous = resultFromAnswers([
      answerFor("q01", "diplomacy"),
      answerFor("q04", "diplomacy"),
      answerFor("q08", "diplomacy")
    ], "previous", "2026-05-01T00:00:00.000Z");
    const current = resultFromAnswers([
      answerFor("q01", "direction"),
      answerFor("q02", "direction"),
      answerFor("q03", "direction"),
      answerFor("q06", "direction"),
      answerFor("q18", "direction")
    ], "current", "2026-05-12T00:00:00.000Z");

    const evolution = buildExecutivePresenceEvolution(current, previous);

    expect(evolution?.signals.some((signal) => signal.id === "assertiveness_increased")).toBe(true);
    expect(evolution?.signals.some((signal) => signal.id === "boundaries_improved")).toBe(true);
    expect(evolution?.narrative).toContain("Em comparacao com sua leitura anterior");
  });

  it("detects reduction signals", () => {
    const previous = resultFromAnswers([
      answerFor("q01", "diplomacy"),
      answerFor("q04", "diplomacy"),
      answerFor("q08", "diplomacy"),
      answerFor("q10", "diplomacy"),
      answerFor("q12", "precision"),
      answerFor("q19", "precision")
    ], "previous", "2026-05-01T00:00:00.000Z");
    const current = resultFromAnswers([
      answerFor("q01", "direction"),
      answerFor("q02", "direction"),
      answerFor("q03", "direction"),
      answerFor("q06", "direction")
    ], "current", "2026-05-12T00:00:00.000Z");

    const evolution = buildExecutivePresenceEvolution(current, previous);

    expect(evolution?.signals.some((signal) => signal.id === "defensive_diplomacy_reduced")).toBe(true);
    expect(evolution?.signals.some((signal) => signal.id === "performance_validation_reduced")).toBe(true);
  });

  it("detects persistence signals", () => {
    const previous = resultFromAnswers([
      answerFor("q07", "diplomacy"),
      answerFor("q08", "diplomacy"),
      answerFor("q10", "diplomacy"),
      answerFor("q11", "diplomacy")
    ], "previous", "2026-05-01T00:00:00.000Z");
    const current = resultFromAnswers([
      answerFor("q07", "diplomacy"),
      answerFor("q08", "diplomacy"),
      answerFor("q10", "diplomacy"),
      answerFor("q11", "diplomacy")
    ], "current", "2026-05-12T00:00:00.000Z");

    const evolution = buildExecutivePresenceEvolution(current, previous);

    expect(evolution?.signals.some((signal) => signal.id === "reliability_overload_persisted")).toBe(true);
  });

  it("uses silent fallback when old data is incomplete", () => {
    const current = resultFromAnswers(answersForTrait("direction"), "current", "2026-05-12T00:00:00.000Z");
    const previous = {
      ...resultFromAnswers(answersForTrait("diplomacy"), "previous", "2026-05-01T00:00:00.000Z"),
      subdimensionScores: undefined,
      executiveDynamicScores: undefined,
      executiveContradictions: undefined
    };

    const evolution = buildExecutivePresenceEvolution(current, previous);

    expect(evolution).toBeUndefined();
  });
});

describe("buildExecutiveRecognitionPhrases", () => {
  it("prioritizes phrases from the main executive tension", () => {
    const result = calculateExecutivePresenceResult([
      answerFor("q04", "precision"),
      answerFor("q05", "precision"),
      answerFor("q12", "precision"),
      answerFor("q19", "precision")
    ]);

    expect(result.recognitionPhrases?.[0]?.source).toBe("contradiction");
    expect(result.recognitionPhrases?.[0]?.text).toContain("entrega excelente");
  });

  it("selects phrases from the dominant executive dynamic", () => {
    const result = calculateExecutivePresenceResult([
      answerFor("q01", "direction"),
      answerFor("q03", "direction"),
      answerFor("q06", "direction")
    ]);

    expect(result.recognitionPhrases?.some((phrase) => phrase.source === "dynamic")).toBe(true);
  });

  it("selects context phrases by seniority and challenge", () => {
    const result = calculateExecutivePresenceResult([
      answerFor("q01", "direction")
    ], executivePresenceQuestions, {
      currentRole: "Gerente",
      seniority: "Lideranca",
      industry: "Tecnologia",
      mainChallenge: "ganhar visibilidade",
      careerGoal: "diretoria"
    });

    expect(result.recognitionPhrases?.some((phrase) => phrase.source === "context")).toBe(true);
    expect(result.recognitionPhrases?.some((phrase) => phrase.text.includes("senioridade"))).toBe(true);
  });

  it("limits recognition phrases to three and removes duplicate text", () => {
    const result = calculateExecutivePresenceResult(answersForTrait("diplomacy"), executivePresenceQuestions, {
      currentRole: "Coordenadora",
      seniority: "Coordenacao",
      industry: "Servicos",
      mainChallenge: "limites e sobrecarga",
      careerGoal: "lideranca"
    });

    const phrases = result.recognitionPhrases ?? [];
    const normalized = phrases.map((phrase) => phrase.text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim());

    expect(phrases.length).toBeLessThanOrEqual(3);
    expect(new Set(normalized).size).toBe(normalized.length);
  });

  it("uses silent fallback when old data is incomplete", () => {
    const result = calculateExecutivePresenceResult(answersForTrait("direction"));
    const phrases = buildExecutiveRecognitionPhrases({
      ...result,
      executiveDynamicScores: undefined,
      executiveContradictions: undefined,
      contextSnapshot: undefined
    });

    expect(Array.isArray(phrases)).toBe(true);
    expect(phrases.length).toBe(0);
  });
});

describe("executive presence feedback", () => {
  it("keeps feedback optional and skips empty drafts", () => {
    const draft = {
      mostRealPart: "   ",
      genericPart: "",
      wouldShare: null,
      wouldReturn: null
    };

    expect(hasExecutivePresenceFeedback(draft)).toBe(false);
    expect(buildExecutivePresenceFeedbackPayload({ resultId: "result-id", userId: "user-id", draft })).toBeNull();
  });

  it("builds a sanitized payload associated to the active result and user", () => {
    const payload = buildExecutivePresenceFeedbackPayload({
      resultId: "result-id",
      userId: "user-id",
      draft: {
        mostRealPart: "  A parte sobre limite.  ",
        genericPart: " ",
        wouldShare: true,
        wouldReturn: false
      }
    });

    expect(payload).toEqual({
      result_id: "result-id",
      user_id: "user-id",
      most_real_part: "A parte sobre limite.",
      generic_part: null,
      would_share: true,
      would_return: false
    });
  });

  it("treats negative choices as valid feedback", () => {
    const draft = {
      mostRealPart: "",
      genericPart: "",
      wouldShare: false,
      wouldReturn: false
    };

    expect(hasExecutivePresenceFeedback(draft)).toBe(true);
    expect(buildExecutivePresenceFeedbackPayload({ resultId: "result-id", userId: "user-id", draft })?.would_share).toBe(false);
  });
});

function expectProfileContent(profile: ExecutivePresenceProfile) {
  expect(profile.id).toBeTruthy();
  expect(profile.name).toBeTruthy();
  expect(profile.shortDescription).toBeTruthy();
  expect(profile.executiveReading).toBeTruthy();
  expect(profile.communicationPattern).toBeTruthy();
  expect(profile.evolutionPoint).toBeTruthy();
  expect(profile.strengths.length).toBeGreaterThan(0);
  expect(profile.risks.length).toBeGreaterThan(0);
  expect(profile.avoidPhrases.length).toBeGreaterThan(0);
  expect(profile.startUsingPhrases.length).toBeGreaterThan(0);
  expect(profile.recommendedPractices.length).toBeGreaterThan(0);
  expect(profile.recommendedReadings.length).toBeGreaterThan(0);
  expect(profile.recommendedTrainings.length).toBeGreaterThan(0);
  expect(profile.firstScriptSuggestions.length).toBeGreaterThan(0);
}
