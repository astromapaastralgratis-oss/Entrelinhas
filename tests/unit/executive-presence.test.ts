import { describe, expect, it } from "vitest";
import { executivePresenceProfiles } from "@/src/data/executivePresenceProfiles";
import { executivePresenceQuestions } from "@/src/data/executivePresenceQuestions";
import { calculateExecutivePresenceResult } from "@/src/utils/calculateExecutivePresenceResult";
import { shuffleArray } from "@/src/utils/shuffleArray";
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

    expect(result.profileId).toBe("assertive_executor");
    expect(result.profile).toBe(executivePresenceProfiles[result.profileId]);
    expect(result.primaryTrait).toBe("direction");
    expect(result.secondaryTrait).toBe("influence");
    expect(result.isCombined).toBe(false);
    expect(result.confidenceLevel).toBe("high");
    expect(result.answeredQuestions).toBe(20);
    expect(result.totalQuestions).toBe(20);
    expect(result.completed).toBe(true);
    expect(result.invalidAnswers).toEqual([]);
  });

  it("returns a combined profile when top and second scores are close", () => {
    const result = calculateExecutivePresenceResult(mixedAnswers("direction", 11, "influence", 9));

    expect(result.profileId).toBe("leader_mobilizer");
    expect(result.profile).toBe(executivePresenceProfiles[result.profileId]);
    expect(result.primaryTrait).toBe("direction");
    expect(result.secondaryTrait).toBe("influence");
    expect(result.isCombined).toBe(true);
    expect(result.confidenceLevel).toBe("low");
    expect(result.scores.direction).toBe(11);
    expect(result.scores.influence).toBe(9);
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
