export type TraitKey = "direction" | "influence" | "diplomacy" | "precision";

export type ExecutivePresenceSubdimension =
  | "assertividade"
  | "influencia"
  | "leitura_politica"
  | "regulacao_emocional"
  | "clareza_de_posicionamento"
  | "gestao_de_conflito"
  | "limites"
  | "tomada_de_decisao"
  | "presenca_executiva"
  | "seguranca_relacional";

export type ExecutiveDynamic =
  | "hipercompetencia_silenciosa"
  | "excesso_de_sustentacao_emocional"
  | "lideranca_invisivel"
  | "diplomacia_defensiva"
  | "firmeza_situacional"
  | "influencia_sem_ocupacao_de_espaco"
  | "autocensura_estrategica"
  | "excesso_de_adaptacao"
  | "sobrecarga_por_confiabilidade"
  | "validacao_por_performance"
  | "controle_como_mecanismo_de_seguranca"
  | "evitacao_de_conflito_politico"
  | "presenca_forte_com_desgaste_interno";

export type IntensityLevel = "low" | "medium" | "high";

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
export type ExecutivePresenceSubdimensionScores = Record<ExecutivePresenceSubdimension, number>;
export type ExecutiveDynamicScores = Record<ExecutiveDynamic, number>;
export type ExecutivePresenceTraitIntensities = Record<TraitKey, IntensityLevel>;
export type ExecutivePresenceSubdimensionIntensities = Record<ExecutivePresenceSubdimension, IntensityLevel>;
export type ExecutiveDynamicIntensities = Record<ExecutiveDynamic, IntensityLevel>;

export type ExecutivePresenceContextSnapshot = {
  currentRole: string | null;
  seniority: string | null;
  industry: string | null;
  mainChallenge: string | null;
  careerGoal: string | null;
};

export type ExecutivePresenceBehaviorSignal = {
  questionId: string;
  optionId: string;
  traitKey: TraitKey;
  subdimension: ExecutivePresenceSubdimension;
  executiveDynamic: ExecutiveDynamic;
  signal: string;
  interpretation: string;
};

export type ExecutivePresenceConditionalInsight = {
  id: string;
  title: string;
  description: string;
  recommendation: string;
};

export type ExecutivePresenceContextualModifiers = {
  seniorityLens: string | null;
  challengeLens: string | null;
  goalLens: string | null;
};

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
  methodologyVersion?: string;
  subdimensionScores?: ExecutivePresenceSubdimensionScores;
  executiveDynamicScores?: ExecutiveDynamicScores;
  traitIntensities?: ExecutivePresenceTraitIntensities;
  subdimensionIntensities?: ExecutivePresenceSubdimensionIntensities;
  executiveDynamicIntensities?: ExecutiveDynamicIntensities;
  behaviorSignals?: ExecutivePresenceBehaviorSignal[];
  conditionalInsights?: ExecutivePresenceConditionalInsight[];
  contextualModifiers?: ExecutivePresenceContextualModifiers;
  contextSnapshot?: ExecutivePresenceContextSnapshot;
};
