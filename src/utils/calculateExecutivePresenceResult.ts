import { executivePresenceProfiles } from "@/src/data/executivePresenceProfiles";
import {
  EXECUTIVE_PRESENCE_METHODOLOGY_VERSION,
  executiveDynamicLabels,
  executivePresenceSubdimensionLabels,
  getExecutivePresenceMethodologyEntry,
  getExecutivePresenceMethodologyOption
} from "@/src/data/executivePresenceMethodology";
import { executivePresenceQuestions } from "@/src/data/executivePresenceQuestions";
import { buildExecutiveRecognitionPhrases } from "@/src/utils/buildExecutiveRecognitionPhrases";
import type {
  ConfidenceLevel,
  ExecutivePresenceAnswer,
  ExecutivePresenceBehaviorSignal,
  ExecutivePresenceConditionalInsight,
  ExecutivePresenceContextSnapshot,
  ExecutiveContradiction,
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
  const scoreContext = getWeightedScoreContext(questions);
  const subdimensionPotentialScores = getSubdimensionPotentialScores(questions);
  const executiveDynamicPotentialScores = getExecutiveDynamicPotentialScores(questions);

  for (const [questionId, answer] of Array.from(validOptionByQuestion.entries())) {
    const traitKey = answer.traitKey;
    const methodologyEntry = getExecutivePresenceMethodologyEntry(questionId);
    const questionWeight = methodologyEntry?.weight ?? 1;
    scores[traitKey] += questionWeight;
    const methodologyOption = getExecutivePresenceMethodologyOption(questionId, answer.optionId);

    if (methodologyOption) {
      subdimensionScores[methodologyOption.subdimension] += questionWeight;
      executiveDynamicScores[methodologyOption.executiveDynamic] += questionWeight;
      behaviorSignals.push({
        questionId,
        optionId: answer.optionId,
        traitKey,
        subdimension: methodologyOption.subdimension,
        executiveDynamic: methodologyOption.executiveDynamic,
        criticality: methodologyEntry?.criticality ?? "standard",
        weight: questionWeight,
        signal: methodologyOption.behaviorSignal,
        interpretation: methodologyOption.interpretation
      });
    }
  }

  const rankedTraits = rankTraits(scores);
  const primaryTrait = rankedTraits[0].trait;
  const secondaryTrait = rankedTraits[1].trait;
  const scoreDifference = rankedTraits[0].score - rankedTraits[1].score;
  const isCombined = scoreDifference <= scoreContext.combinedThreshold;
  const profileId = isCombined ? getCombinedProfileId(primaryTrait, secondaryTrait) : primaryProfileByTrait[primaryTrait];
  const confidenceLevel = getConfidenceLevel(scoreDifference, scoreContext);
  const traitIntensities = getTraitIntensities(scores, scoreContext);
  const subdimensionIntensities = getGenericIntensities(
    subdimensionScores,
    subdimensionPotentialScores
  ) as ExecutivePresenceSubdimensionIntensities;
  const executiveDynamicIntensities = getGenericIntensities(
    executiveDynamicScores,
    executiveDynamicPotentialScores
  ) as ExecutiveDynamicIntensities;
  const contextualModifiers = buildContextualModifiers(contextSnapshot ?? null);
  const executiveContradictions = buildExecutiveContradictions({
    scores,
    subdimensionScores,
    executiveDynamicScores,
    traitIntensities,
    subdimensionIntensities,
    executiveDynamicIntensities
  });
  const conditionalInsights = buildConditionalInsights({
    profileId,
    primaryTrait,
    secondaryTrait,
    scores,
    scoreContext,
    subdimensionIntensities,
    executiveDynamicIntensities,
    contextSnapshot: contextSnapshot ?? null
  });

  const result: ExecutivePresenceResult = {
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
    contextSnapshot: contextSnapshot ?? undefined,
    executiveContradictions,
    recognitionPhrases: []
  };

  return {
    ...result,
    recognitionPhrases: buildExecutiveRecognitionPhrases(result)
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

function getWeightedScoreContext(questions: typeof executivePresenceQuestions) {
  const totalPossibleWeight = questions.reduce((total, question) => {
    return total + (getExecutivePresenceMethodologyEntry(question.id)?.weight ?? 1);
  }, 0);

  return {
    totalPossibleWeight,
    combinedThreshold: Math.max(2, totalPossibleWeight * 0.11),
    mediumConfidenceThreshold: totalPossibleWeight * 0.12,
    highConfidenceThreshold: totalPossibleWeight * 0.22,
    mediumTraitThreshold: totalPossibleWeight * 0.2,
    highTraitThreshold: totalPossibleWeight * 0.38
  };
}

function getSubdimensionPotentialScores(questions: typeof executivePresenceQuestions) {
  const potentialScores = createEmptySubdimensionScores();

  for (const question of questions) {
    const methodologyEntry = getExecutivePresenceMethodologyEntry(question.id);
    const questionWeight = methodologyEntry?.weight ?? 1;
    const subdimensions = new Set(methodologyEntry?.options.map((option) => option.subdimension) ?? []);

    for (const subdimension of Array.from(subdimensions)) {
      potentialScores[subdimension] += questionWeight;
    }
  }

  return potentialScores;
}

function getExecutiveDynamicPotentialScores(questions: typeof executivePresenceQuestions) {
  const potentialScores = createEmptyExecutiveDynamicScores();

  for (const question of questions) {
    const methodologyEntry = getExecutivePresenceMethodologyEntry(question.id);
    const questionWeight = methodologyEntry?.weight ?? 1;
    const executiveDynamics = new Set(methodologyEntry?.options.map((option) => option.executiveDynamic) ?? []);

    for (const executiveDynamic of Array.from(executiveDynamics)) {
      potentialScores[executiveDynamic] += questionWeight;
    }
  }

  return potentialScores;
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

function getConfidenceLevel(scoreDifference: number, scoreContext: ReturnType<typeof getWeightedScoreContext>): ConfidenceLevel {
  if (scoreDifference >= scoreContext.highConfidenceThreshold) return "high";
  if (scoreDifference >= scoreContext.mediumConfidenceThreshold) return "medium";
  return "low";
}

function getTraitIntensities(
  scores: ExecutivePresenceScores,
  scoreContext: ReturnType<typeof getWeightedScoreContext>
): ExecutivePresenceTraitIntensities {
  return traitPriority.reduce((accumulator, trait) => {
    accumulator[trait] = getTraitIntensity(scores[trait], scoreContext);
    return accumulator;
  }, {} as ExecutivePresenceTraitIntensities);
}

function getTraitIntensity(score: number, scoreContext: ReturnType<typeof getWeightedScoreContext>): IntensityLevel {
  if (score >= scoreContext.highTraitThreshold) return "high";
  if (score >= scoreContext.mediumTraitThreshold) return "medium";
  return "low";
}

function getGenericIntensities<T extends string>(scores: Record<T, number>, potentialScores: Record<T, number>) {
  return (Object.keys(scores) as T[]).reduce((accumulator, key) => {
    const score = scores[key];
    const maxPossible = potentialScores[key];
    accumulator[key] =
      maxPossible > 0 && score >= maxPossible * 0.4
        ? "high"
        : maxPossible > 0 && score >= maxPossible * 0.2
          ? "medium"
          : "low";
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
    ? "A devolutiva prioriza influência, decisão, leitura política e condução de contextos complexos."
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

function buildExecutiveContradictions({
  scores,
  subdimensionScores,
  executiveDynamicScores,
  traitIntensities,
  subdimensionIntensities,
  executiveDynamicIntensities
}: {
  scores: ExecutivePresenceScores;
  subdimensionScores: ExecutivePresenceSubdimensionScores;
  executiveDynamicScores: ExecutiveDynamicScores;
  traitIntensities: ExecutivePresenceTraitIntensities;
  subdimensionIntensities: ExecutivePresenceSubdimensionIntensities;
  executiveDynamicIntensities: ExecutiveDynamicIntensities;
}): ExecutiveContradiction[] {
  const contradictions: ExecutiveContradiction[] = [];

  if (
    isAtLeast(executiveDynamicIntensities.hipercompetencia_silenciosa, "medium") &&
    isAtLeast(executiveDynamicIntensities.validacao_por_performance, "medium") &&
    subdimensionIntensities.presenca_executiva === "low"
  ) {
    contradictions.push({
      id: "high_delivery_low_visibility",
      title: "Alta entrega com baixa visibilidade",
      summary: "Você tende a sustentar qualidade, preparo e consistência, mas pode deixar o impacto menos visível do que ele precisa ser.",
      risk: "Sua contribuição pode ser percebida como confiável, mas não necessariamente como liderança, autoria ou influência estratégica.",
      microAdjustment: "Antes de assumir uma nova entrega, nomeie o impacto da entrega anterior e conecte sua contribuicao a uma decisao do negocio.",
      thirtyDayAction: "Escolha uma entrega relevante por semana e transforme resultado em narrativa executiva: contexto, impacto, decisao apoiada e proximo movimento.",
      severity: getSeverity([
        executiveDynamicScores.hipercompetencia_silenciosa,
        executiveDynamicScores.validacao_por_performance,
        Math.max(0, scores.precision - subdimensionScores.presenca_executiva)
      ])
    });
  }

  if (
    isAtLeast(traitIntensities.diplomacy, "medium") &&
    isAtLeast(subdimensionIntensities.seguranca_relacional, "medium") &&
    subdimensionIntensities.limites === "low"
  ) {
    contradictions.push({
      id: "high_diplomacy_low_boundaries",
      title: "Alta diplomacia com limite baixo",
      summary: "Você tende a preservar relações e reduzir atrito, mesmo quando o contexto pede uma fronteira mais explícita.",
      risk: "A sua elegância pode ser confundida com disponibilidade ilimitada, e o custo da harmonia pode cair sobre você.",
      microAdjustment: "Abra conversas sensíveis pelo limite, não pela justificativa: diga o que é possível, o que não é, e qual alternativa sustenta o objetivo.",
      thirtyDayAction: "Mapeie três situações em que você costuma acomodar demandas e pratique uma resposta com limite, critério e alternativa objetiva.",
      severity: getSeverity([
        scores.diplomacy,
        subdimensionScores.seguranca_relacional,
        Math.max(0, subdimensionScores.seguranca_relacional - subdimensionScores.limites)
      ])
    });
  }

  if (
    isAtLeast(traitIntensities.precision, "medium") &&
    subdimensionIntensities.tomada_de_decisao === "low"
  ) {
    contradictions.push({
      id: "high_precision_low_decision",
      title: "Alta precisão com baixa decisão",
      summary: "Você tende a buscar critério, dados e segurança antes de se expor, mas pode demorar a transformar análise em posição.",
      risk: "O excesso de preparo pode fazer sua maturidade parecer hesitação quando o ambiente espera recomendação, não apenas diagnóstico.",
      microAdjustment: "Declare uma recomendação com nível de confiança: 'com o que temos hoje, meu caminho recomendado é este'.",
      thirtyDayAction: "Em reuniões de decisão, pratique chegar com uma recomendação, dois riscos e um critério de revisão, sem tentar fechar todas as variáveis.",
      severity: getSeverity([
        scores.precision,
        executiveDynamicScores.controle_como_mecanismo_de_seguranca,
        Math.max(0, scores.precision - subdimensionScores.tomada_de_decisao)
      ])
    });
  }

  if (
    isAtLeast(traitIntensities.influence, "medium") &&
    isAtLeast(subdimensionIntensities.influencia, "medium") &&
    isAtLeast(executiveDynamicIntensities.influencia_sem_ocupacao_de_espaco, "medium") &&
    subdimensionIntensities.presenca_executiva === "low"
  ) {
    contradictions.push({
      id: "high_influence_low_space_ownership",
      title: "Influência alta com pouca ocupação de espaço",
      summary: "Você tende a construir adesão e ler pessoas, mas pode deixar sua posição menos explícita do que a sua influência permite.",
      risk: "Sua capacidade de mobilizar pode beneficiar a decisao sem consolidar sua autoria, autoridade ou lugar na conversa.",
      microAdjustment: "Depois de criar alinhamento, assuma a frase de condução: 'minha recomendação é esta, e proponho seguir por aqui'.",
      thirtyDayAction: "Escolha uma conversa por semana para sair do papel de articuladora e ocupar também o papel de autora da direção.",
      severity: getSeverity([
        scores.influence,
        subdimensionScores.influencia,
        executiveDynamicScores.influencia_sem_ocupacao_de_espaco
      ])
    });
  }

  if (
    isAtLeast(subdimensionIntensities.presenca_executiva, "medium") &&
    isAtLeast(executiveDynamicIntensities.presenca_forte_com_desgaste_interno, "medium")
  ) {
    contradictions.push({
      id: "strong_presence_internal_strain",
      title: "Presença forte com desgaste interno",
      summary: "Por fora, você pode sustentar firmeza e controle; por dentro, tende a absorver mais tensão do que distribui.",
      risk: "O ambiente pode ler solidez, enquanto você paga o custo silencioso de carregar conflito, expectativa e responsabilidade demais.",
      microAdjustment: "Quando a tensao subir, nomeie responsabilidades compartilhadas e evite se colocar como unica sustentacao da conversa.",
      thirtyDayAction: "Revise semanalmente onde você sustentou tensões sozinha e transforme uma dessas situações em pedido, combinados ou redistribuição clara.",
      severity: getSeverity([
        subdimensionScores.presenca_executiva,
        executiveDynamicScores.presenca_forte_com_desgaste_interno,
        executiveDynamicScores.excesso_de_sustentacao_emocional
      ])
    });
  }

  return contradictions.sort((first, second) => second.severity - first.severity);
}

function isAtLeast(intensity: IntensityLevel, threshold: "medium" | "high") {
  return threshold === "high" ? intensity === "high" : intensity === "medium" || intensity === "high";
}

function getSeverity(values: number[]) {
  return Number(values.reduce((total, value) => total + value, 0).toFixed(2));
}

function buildConditionalInsights({
  primaryTrait,
  secondaryTrait,
  scores,
  scoreContext,
  subdimensionIntensities,
  executiveDynamicIntensities,
  contextSnapshot
}: {
  profileId: ExecutivePresenceProfileId;
  primaryTrait: TraitKey;
  secondaryTrait: TraitKey;
  scores: ExecutivePresenceScores;
  scoreContext: ReturnType<typeof getWeightedScoreContext>;
  subdimensionIntensities: ExecutivePresenceSubdimensionIntensities;
  executiveDynamicIntensities: ExecutiveDynamicIntensities;
  contextSnapshot: ExecutivePresenceContextSnapshot | null;
}): ExecutivePresenceConditionalInsight[] {
  const insights: ExecutivePresenceConditionalInsight[] = [];

  addDynamicInsight(insights, executiveDynamicIntensities, "hipercompetencia_silenciosa", "high", {
    title: "Hipercompetencia silenciosa",
    description: "Seu padrão sugere alta entrega, preparo e consistência, mas com risco de deixar impacto pouco visível.",
    recommendation: "Transforme entrega em narrativa executiva: impacto, decisao apoiada e proximo movimento."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "lideranca_invisivel", "medium", {
    title: "Liderança invisível",
    description: "Você tende a sustentar temas relevantes, mas pode não ocupar explicitamente autoria, escopo e crédito.",
    recommendation: "Nomeie sua contribuicao e proponha liderar o proximo passo quando sua participacao estruturou o caminho."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "diplomacia_defensiva", "high", {
    title: "Diplomacia defensiva",
    description: "Ha sinais de cuidado relacional forte, com risco de suavizar demais pedidos e limites.",
    recommendation: "Preserve elegância, mas abra conversas sensíveis com fato, posição e pedido em frases curtas."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "influencia_sem_ocupacao_de_espaco", "high", {
    title: "Influência sem ocupação de espaço",
    description: "Você tende a criar adesão, mas pode deixar a própria posição menos explícita do que o contexto exige.",
    recommendation: "Use influência para conduzir decisão: tese central, critério e pedido claro."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "controle_como_mecanismo_de_seguranca", "high", {
    title: "Controle como mecanismo de seguranca",
    description: "Há preferência por reduzir ambiguidade por dados e critérios, o que fortalece qualidade, mas pode atrasar exposição.",
    recommendation: "Declare nível de confiança e recomende o melhor caminho com a informação disponível."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "presenca_forte_com_desgaste_interno", "medium", {
    title: "Presença forte com desgaste interno",
    description: "Sua presença pode aparecer como firmeza externa enquanto você absorve tensão demais internamente.",
    recommendation: "Distribua responsabilidade, nomeie limites e evite sustentar sozinha o custo emocional da decisao."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "validacao_por_performance", "medium", {
    title: "Validacao por performance",
    description: "Existe tendência a provar valor por entrega, evidência ou preparo antes de pedir reconhecimento.",
    recommendation: "Apresente impacto antes de assumir novas demandas e conecte resultado a escopo, reconhecimento e decisao."
  });

  if (subdimensionIntensities.limites !== "low" && scores.diplomacy >= scores.direction) {
    insights.push({
      id: "limites_com_cuidado_relacional",
      title: "Limites com cuidado relacional",
      description: "O tema limites aparece com forte preocupacao relacional.",
      recommendation: "Defina o limite primeiro e use o cuidado apenas para calibrar tom, não para reduzir a mensagem."
    });
  }

  if (scores[primaryTrait] - scores[secondaryTrait] <= scoreContext.combinedThreshold) {
    insights.push({
      id: "perfil_combinado",
      title: "Padrao combinado",
      description: "Seu resultado não está concentrado em um único eixo; há uma tensão produtiva entre dois modos de presença.",
      recommendation: "Use o eixo dominante para conduzir e o secundario para calibrar risco, timing e adesao."
    });
  }

  if (contextSnapshot?.mainChallenge) {
    insights.push({
      id: "desafio_declarado",
      title: "Desafio declarado",
      description: `O desafio informado foi: ${contextSnapshot.mainChallenge}.`,
      recommendation: "Use esse tema como laboratório principal dos próximos 30 dias de evolução executiva."
    });
  }

  return insights.slice(0, 6);
}

function addDynamicInsight(
  insights: ExecutivePresenceConditionalInsight[],
  intensities: ExecutiveDynamicIntensities,
  key: ExecutiveDynamic,
  threshold: "medium" | "high",
  insight: Omit<ExecutivePresenceConditionalInsight, "id">
) {
  const intensity = intensities[key];
  const meetsThreshold = threshold === "high" ? intensity === "high" : intensity === "medium" || intensity === "high";

  if (meetsThreshold) {
    insights.push({ id: key, ...insight });
  }
}
