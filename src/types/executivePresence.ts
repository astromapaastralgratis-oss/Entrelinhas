export type TraitKey = "direction" | "influence" | "diplomacy" | "precision";

export type ExecutivePresenceProfileId =
  | "assertive_executor"
  | "strategic_influencer"
  | "relational_diplomat"
  | "analytical_advisor"
  | "leader_mobilizer"
  | "decision_strategist"
  | "diplomatic_articulator"
  | "careful_counselor"
  | "firmness_builder"
  | "analytical_influencer";

export type ConfidenceLevel = "low" | "medium" | "high";

export type ExecutivePresenceOption = {
  id: string;
  text: string;
  traitKey: TraitKey;
};

export type ExecutivePresenceQuestion = {
  id: string;
  text: string;
  options: ExecutivePresenceOption[];
};

export type ExecutivePresenceAnswer = {
  questionId: string;
  optionId: string;
};

export type ExecutivePresenceProfile = {
  id: ExecutivePresenceProfileId;
  name: string;
  shortDescription: string;
  executiveReading: string;
  communicationPattern: string;
  strengths: string[];
  risks: string[];
  evolutionPoint: string;
  avoidPhrases: string[];
  startUsingPhrases: string[];
  recommendedPractices: string[];
  recommendedReadings: string[];
  recommendedTrainings: string[];
  firstScriptSuggestions: string[];
  perceivedByOthers: string;
  pressurePattern: string;
  executiveSabotage: string;
  corporateExpectation: string;
  presenceMicroAdjustments: string[];
  internalScriptsToChange: {
    from: string;
    to: string;
  }[];
  thirtyDayEvolutionPlan: string[];
};

export type ExecutivePresenceScores = Record<TraitKey, number>;

export type InvalidExecutivePresenceAnswer = ExecutivePresenceAnswer & {
  reason: "question_not_found" | "option_not_found";
};

export type ExecutivePresenceResult = {
  profileId: ExecutivePresenceProfileId;
  profile: ExecutivePresenceProfile;
  primaryTrait: TraitKey;
  secondaryTrait: TraitKey;
  scores: ExecutivePresenceScores;
  answeredQuestions: number;
  totalQuestions: number;
  completed: boolean;
  isCombined: boolean;
  confidenceLevel: ConfidenceLevel;
  invalidAnswers: InvalidExecutivePresenceAnswer[];
};
