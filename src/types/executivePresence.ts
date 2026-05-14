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
export type ExecutivePresenceQuestionCriticality = "standard" | "elevated" | "critical";

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

export type ExecutivePresenceQuestionFormat = "situational" | "frequency" | "agreement";

export type ExecutivePresenceQuestion = {
  id: string;
  format: ExecutivePresenceQuestionFormat;
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
  criticality: ExecutivePresenceQuestionCriticality;
  weight: number;
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

export type ExecutiveContradictionId =
  | "high_delivery_low_visibility"
  | "high_diplomacy_low_boundaries"
  | "high_precision_low_decision"
  | "high_influence_low_space_ownership"
  | "strong_presence_internal_strain";

export type ExecutiveContradiction = {
  id: ExecutiveContradictionId;
  title: string;
  summary: string;
  risk: string;
  microAdjustment: string;
  thirtyDayAction: string;
  severity: number;
};

export type ExecutivePresenceEvolutionSignalId =
  | "assertiveness_increased"
  | "positioning_clarity_increased"
  | "defensive_diplomacy_reduced"
  | "performance_validation_reduced"
  | "reliability_overload_persisted"
  | "space_ownership_increased"
  | "presence_strain_increased"
  | "boundaries_improved"
  | "dominant_dynamic_shifted";

export type ExecutivePresenceEvolutionSignalKind = "increase" | "reduction" | "persistence" | "shift";

export type ExecutivePresenceEvolutionSignal = {
  id: ExecutivePresenceEvolutionSignalId;
  kind: ExecutivePresenceEvolutionSignalKind;
  title: string;
  summary: string;
  previousValue: number | string | null;
  currentValue: number | string | null;
};

export type ExecutivePresenceEvolution = {
  previousResultId?: string;
  previousCreatedAt?: string;
  currentResultId?: string;
  currentCreatedAt?: string;
  narrative: string;
  signals: ExecutivePresenceEvolutionSignal[];
};

export type ExecutiveRecognitionPhraseSource = "contradiction" | "dynamic" | "context";

export type ExecutiveRecognitionPhrase = {
  id: string;
  text: string;
  source: ExecutiveRecognitionPhraseSource;
  priority: number;
};

export type InvalidExecutivePresenceAnswer = ExecutivePresenceAnswer & {
  reason: "question_not_found" | "option_not_found";
};

export type ExecutivePresenceResult = {
  resultId?: string;
  createdAt?: string;
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
  executiveContradictions?: ExecutiveContradiction[];
  evolution?: ExecutivePresenceEvolution;
  recognitionPhrases?: ExecutiveRecognitionPhrase[];
};

