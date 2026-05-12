import { executivePresenceProfiles } from "@/src/data/executivePresenceProfiles";
import {
  EXECUTIVE_PRESENCE_METHODOLOGY_VERSION,
  executiveDynamicLabels,
  executivePresenceSubdimensionLabels,
  getExecutivePresenceMethodologyOption
} from "@/src/data/executivePresenceMethodology";
import { executivePresenceQuestions } from "@/src/data/executivePresenceQuestions";
import type {
  ConfidenceLevel,
  ExecutivePresenceAnswer,
  ExecutivePresenceBehaviorSignal,
  ExecutivePresenceConditionalInsight,
  ExecutivePresenceContextSnapshot,
  ExecutiveDynamic,
  ExecutiveDynamicIntensities,
  ExecutiveDynamicScores,
  ExecutivePresenceProfileId,
  ExecutivePresenceResult,
  ExecutivePresenceScores,
  ExecutivePresenceSubdimension,
  ExecutivePresenceSubdimensionIntensities,
  ExecutivePresenceSubdimensionScores,
  ExecutivePresenceTraitIntensities,
  InvalidExecutivePresenceAnswer,
  IntensityLevel,
  TraitKey
} from "@/src/types/executivePresence";

const traitPriority: TraitKey[] = ["direction", "influence", "diplomacy", "precision"];
const subdimensionKeys = Object.keys(executivePresenceSubdimensionLabels) as ExecutivePresenceSubdimension[];
const executiveDynamicKeys = Object.keys(executiveDynamicLabels) as ExecutiveDynamic[];

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
  questions = executivePresenceQuestions,
  contextSnapshot?: ExecutivePresenceContextSnapshot | null
): ExecutivePresenceResult {
  const questionById = new Map(questions.map((question) => [question.id, question]));
  const validAnswerByQuestion = new Map<string, TraitKey>();
  const validOptionByQuestion = new Map<string, { optionId: string; traitKey: TraitKey }>();
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
    validOptionByQuestion.set(answer.questionId, { optionId: answer.optionId, traitKey: option.traitKey });
  }

  const scores = createEmptyScores();
  const subdimensionScores = createEmptySubdimensionScores();
  const executiveDynamicScores = createEmptyExecutiveDynamicScores();
  const behaviorSignals: ExecutivePresenceBehaviorSignal[] = [];

  for (const [questionId, answer] of Array.from(validOptionByQuestion.entries())) {
    const traitKey = answer.traitKey;
    scores[traitKey] += 1;
    const methodologyOption = getExecutivePresenceMethodologyOption(questionId, answer.optionId);

    if (methodologyOption) {
      subdimensionScores[methodologyOption.subdimension] += 1;
      executiveDynamicScores[methodologyOption.executiveDynamic] += 1;
      behaviorSignals.push({
        questionId,
        optionId: answer.optionId,
        traitKey,
        subdimension: methodologyOption.subdimension,
        executiveDynamic: methodologyOption.executiveDynamic,
        signal: methodologyOption.behaviorSignal,
        interpretation: methodologyOption.interpretation
      });
    }
  }

  const rankedTraits = rankTraits(scores);
  const primaryTrait = rankedTraits[0].trait;
  const secondaryTrait = rankedTraits[1].trait;
  const scoreDifference = rankedTraits[0].score - rankedTraits[1].score;
  const isCombined = scoreDifference <= 2;
  const profileId = isCombined ? getCombinedProfileId(primaryTrait, secondaryTrait) : primaryProfileByTrait[primaryTrait];
  const confidenceLevel = getConfidenceLevel(scoreDifference);
  const traitIntensities = getTraitIntensities(scores);
  const subdimensionIntensities = getGenericIntensities(subdimensionScores) as ExecutivePresenceSubdimensionIntensities;
  const executiveDynamicIntensities = getGenericIntensities(executiveDynamicScores) as ExecutiveDynamicIntensities;
  const contextualModifiers = buildContextualModifiers(contextSnapshot ?? null);
  const conditionalInsights = buildConditionalInsights({
    profileId,
    primaryTrait,
    secondaryTrait,
    scores,
    subdimensionScores,
    executiveDynamicScores,
    contextSnapshot: contextSnapshot ?? null
  });

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
    invalidAnswers,
    methodologyVersion: EXECUTIVE_PRESENCE_METHODOLOGY_VERSION,
    subdimensionScores,
    executiveDynamicScores,
    traitIntensities,
    subdimensionIntensities,
    executiveDynamicIntensities,
    behaviorSignals,
    conditionalInsights,
    contextualModifiers,
    contextSnapshot: contextSnapshot ?? undefined
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

function createEmptySubdimensionScores(): ExecutivePresenceSubdimensionScores {
  return subdimensionKeys.reduce((accumulator, key) => {
    accumulator[key] = 0;
    return accumulator;
  }, {} as ExecutivePresenceSubdimensionScores);
}

function createEmptyExecutiveDynamicScores(): ExecutiveDynamicScores {
  return executiveDynamicKeys.reduce((accumulator, key) => {
    accumulator[key] = 0;
    return accumulator;
  }, {} as ExecutiveDynamicScores);
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

function getTraitIntensities(scores: ExecutivePresenceScores): ExecutivePresenceTraitIntensities {
  return traitPriority.reduce((accumulator, trait) => {
    accumulator[trait] = getTraitIntensity(scores[trait]);
    return accumulator;
  }, {} as ExecutivePresenceTraitIntensities);
}

function getTraitIntensity(score: number): IntensityLevel {
  if (score >= 8) return "high";
  if (score >= 4) return "medium";
  return "low";
}

function getGenericIntensities<T extends string>(scores: Record<T, number>) {
  return (Object.keys(scores) as T[]).reduce((accumulator, key) => {
    const score = scores[key];
    accumulator[key] = score >= 3 ? "high" : score >= 2 ? "medium" : "low";
    return accumulator;
  }, {} as Record<T, IntensityLevel>);
}

function buildContextualModifiers(contextSnapshot: ExecutivePresenceContextSnapshot | null) {
  if (!contextSnapshot) {
    return {
      seniorityLens: null,
      challengeLens: null,
      goalLens: null
    };
  }

  const seniority = contextSnapshot.seniority?.toLowerCase() ?? "";
  const seniorityLens = seniority.includes("lider") || seniority.includes("dire") || seniority.includes("ger")
    ? "A devolutiva prioriza influencia, decisao, leitura politica e conducao de contextos complexos."
    : seniority
      ? "A devolutiva prioriza clareza, repertorio, sustentacao de limites e construcao de autoridade."
      : null;

  return {
    seniorityLens,
    challengeLens: contextSnapshot.mainChallenge
      ? `O desafio declarado pede foco pratico em ${contextSnapshot.mainChallenge}.`
      : null,
    goalLens: contextSnapshot.careerGoal
      ? `O objetivo profissional declarado orienta o plano para ${contextSnapshot.careerGoal}.`
      : null
  };
}

function buildConditionalInsights({
  primaryTrait,
  secondaryTrait,
  scores,
  subdimensionScores,
  executiveDynamicScores,
  contextSnapshot
}: {
  profileId: ExecutivePresenceProfileId;
  primaryTrait: TraitKey;
  secondaryTrait: TraitKey;
  scores: ExecutivePresenceScores;
  subdimensionScores: ExecutivePresenceSubdimensionScores;
  executiveDynamicScores: ExecutiveDynamicScores;
  contextSnapshot: ExecutivePresenceContextSnapshot | null;
}): ExecutivePresenceConditionalInsight[] {
  const insights: ExecutivePresenceConditionalInsight[] = [];

  addDynamicInsight(insights, executiveDynamicScores, "hipercompetencia_silenciosa", 3, {
    title: "Hipercompetencia silenciosa",
    description: "Seu padrao sugere alta entrega, preparo e consistencia, mas com risco de deixar impacto pouco visivel.",
    recommendation: "Transforme entrega em narrativa executiva: impacto, decisao apoiada e proximo movimento."
  });
  addDynamicInsight(insights, executiveDynamicScores, "lideranca_invisivel", 2, {
    title: "Lideranca invisivel",
    description: "Voce tende a sustentar temas relevantes, mas pode nao ocupar explicitamente autoria, escopo e credito.",
    recommendation: "Nomeie sua contribuicao e proponha liderar o proximo passo quando sua participacao estruturou o caminho."
  });
  addDynamicInsight(insights, executiveDynamicScores, "diplomacia_defensiva", 3, {
    title: "Diplomacia defensiva",
    description: "Ha sinais de cuidado relacional forte, com risco de suavizar demais pedidos e limites.",
    recommendation: "Preserve elegancia, mas abra conversas sensiveis com fato, posicao e pedido em frases curtas."
  });
  addDynamicInsight(insights, executiveDynamicScores, "influencia_sem_ocupacao_de_espaco", 3, {
    title: "Influencia sem ocupacao de espaco",
    description: "Voce tende a criar adesao, mas pode deixar a propria posicao menos explicita do que o contexto exige.",
    recommendation: "Use influencia para conduzir decisao: tese central, criterio e pedido claro."
  });
  addDynamicInsight(insights, executiveDynamicScores, "controle_como_mecanismo_de_seguranca", 3, {
    title: "Controle como mecanismo de seguranca",
    description: "Ha preferencia por reduzir ambiguidade por dados e criterios, o que fortalece qualidade, mas pode atrasar exposicao.",
    recommendation: "Declare nivel de confianca e recomende o melhor caminho com a informacao disponivel."
  });
  addDynamicInsight(insights, executiveDynamicScores, "presenca_forte_com_desgaste_interno", 2, {
    title: "Presenca forte com desgaste interno",
    description: "Sua presenca pode aparecer como firmeza externa enquanto voce absorve tensao demais internamente.",
    recommendation: "Distribua responsabilidade, nomeie limites e evite sustentar sozinha o custo emocional da decisao."
  });
  addDynamicInsight(insights, executiveDynamicScores, "validacao_por_performance", 2, {
    title: "Validacao por performance",
    description: "Existe tendencia a provar valor por entrega, evidencia ou preparo antes de pedir reconhecimento.",
    recommendation: "Apresente impacto antes de assumir novas demandas e conecte resultado a escopo, reconhecimento e decisao."
  });

  if (subdimensionScores.limites >= 3 && scores.diplomacy >= scores.direction) {
    insights.push({
      id: "limites_com_cuidado_relacional",
      title: "Limites com cuidado relacional",
      description: "O tema limites aparece com forte preocupacao relacional.",
      recommendation: "Defina o limite primeiro e use o cuidado apenas para calibrar tom, nao para reduzir a mensagem."
    });
  }

  if (scores[primaryTrait] - scores[secondaryTrait] <= 2) {
    insights.push({
      id: "perfil_combinado",
      title: "Padrao combinado",
      description: "Seu resultado nao esta concentrado em um unico eixo; ha uma tensao produtiva entre dois modos de presenca.",
      recommendation: "Use o eixo dominante para conduzir e o secundario para calibrar risco, timing e adesao."
    });
  }

  if (contextSnapshot?.mainChallenge) {
    insights.push({
      id: "desafio_declarado",
      title: "Desafio declarado",
      description: `O desafio informado foi: ${contextSnapshot.mainChallenge}.`,
      recommendation: "Use esse tema como laboratorio principal dos proximos 30 dias de evolucao executiva."
    });
  }

  return insights.slice(0, 6);
}

function addDynamicInsight(
  insights: ExecutivePresenceConditionalInsight[],
  scores: ExecutiveDynamicScores,
  key: ExecutiveDynamic,
  threshold: number,
  insight: Omit<ExecutivePresenceConditionalInsight, "id">
) {
  if (scores[key] >= threshold) {
    insights.push({ id: key, ...insight });
  }
}
