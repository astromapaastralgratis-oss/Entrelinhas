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
      summary: "Voce tende a sustentar qualidade, preparo e consistencia, mas pode deixar o impacto menos visivel do que ele precisa ser.",
      risk: "Sua contribuicao pode ser percebida como confiavel, mas nao necessariamente como lideranca, autoria ou influencia estrategica.",
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
      summary: "Voce tende a preservar relacoes e reduzir atrito, mesmo quando o contexto pede uma fronteira mais explicita.",
      risk: "A sua elegancia pode ser confundida com disponibilidade ilimitada, e o custo da harmonia pode cair sobre voce.",
      microAdjustment: "Abra conversas sensiveis pelo limite, nao pela justificativa: diga o que e possivel, o que nao e, e qual alternativa sustenta o objetivo.",
      thirtyDayAction: "Mapeie tres situacoes em que voce costuma acomodar demandas e pratique uma resposta com limite, criterio e alternativa objetiva.",
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
      title: "Alta precisao com baixa decisao",
      summary: "Voce tende a buscar criterio, dados e seguranca antes de se expor, mas pode demorar a transformar analise em posicao.",
      risk: "O excesso de preparo pode fazer sua maturidade parecer hesitacao quando o ambiente espera recomendacao, nao apenas diagnostico.",
      microAdjustment: "Declare uma recomendacao com nivel de confianca: 'com o que temos hoje, meu caminho recomendado e este'.",
      thirtyDayAction: "Em reunioes de decisao, pratique chegar com uma recomendacao, dois riscos e um criterio de revisao, sem tentar fechar todas as variaveis.",
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
      title: "Influencia alta com pouca ocupacao de espaco",
      summary: "Voce tende a construir adesao e ler pessoas, mas pode deixar sua posicao menos explicita do que a sua influencia permite.",
      risk: "Sua capacidade de mobilizar pode beneficiar a decisao sem consolidar sua autoria, autoridade ou lugar na conversa.",
      microAdjustment: "Depois de criar alinhamento, assuma a frase de conducao: 'minha recomendacao e esta, e proponho seguir por aqui'.",
      thirtyDayAction: "Escolha uma conversa por semana para sair do papel de articuladora e ocupar tambem o papel de autora da direcao.",
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
      title: "Presenca forte com desgaste interno",
      summary: "Por fora, voce pode sustentar firmeza e controle; por dentro, tende a absorver mais tensao do que distribui.",
      risk: "O ambiente pode ler solidez, enquanto voce paga o custo silencioso de carregar conflito, expectativa e responsabilidade demais.",
      microAdjustment: "Quando a tensao subir, nomeie responsabilidades compartilhadas e evite se colocar como unica sustentacao da conversa.",
      thirtyDayAction: "Revise semanalmente onde voce sustentou tensoes sozinha e transforme uma dessas situacoes em pedido, combinados ou redistribuicao clara.",
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
    description: "Seu padrao sugere alta entrega, preparo e consistencia, mas com risco de deixar impacto pouco visivel.",
    recommendation: "Transforme entrega em narrativa executiva: impacto, decisao apoiada e proximo movimento."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "lideranca_invisivel", "medium", {
    title: "Lideranca invisivel",
    description: "Voce tende a sustentar temas relevantes, mas pode nao ocupar explicitamente autoria, escopo e credito.",
    recommendation: "Nomeie sua contribuicao e proponha liderar o proximo passo quando sua participacao estruturou o caminho."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "diplomacia_defensiva", "high", {
    title: "Diplomacia defensiva",
    description: "Ha sinais de cuidado relacional forte, com risco de suavizar demais pedidos e limites.",
    recommendation: "Preserve elegancia, mas abra conversas sensiveis com fato, posicao e pedido em frases curtas."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "influencia_sem_ocupacao_de_espaco", "high", {
    title: "Influencia sem ocupacao de espaco",
    description: "Voce tende a criar adesao, mas pode deixar a propria posicao menos explicita do que o contexto exige.",
    recommendation: "Use influencia para conduzir decisao: tese central, criterio e pedido claro."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "controle_como_mecanismo_de_seguranca", "high", {
    title: "Controle como mecanismo de seguranca",
    description: "Ha preferencia por reduzir ambiguidade por dados e criterios, o que fortalece qualidade, mas pode atrasar exposicao.",
    recommendation: "Declare nivel de confianca e recomende o melhor caminho com a informacao disponivel."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "presenca_forte_com_desgaste_interno", "medium", {
    title: "Presenca forte com desgaste interno",
    description: "Sua presenca pode aparecer como firmeza externa enquanto voce absorve tensao demais internamente.",
    recommendation: "Distribua responsabilidade, nomeie limites e evite sustentar sozinha o custo emocional da decisao."
  });
  addDynamicInsight(insights, executiveDynamicIntensities, "validacao_por_performance", "medium", {
    title: "Validacao por performance",
    description: "Existe tendencia a provar valor por entrega, evidencia ou preparo antes de pedir reconhecimento.",
    recommendation: "Apresente impacto antes de assumir novas demandas e conecte resultado a escopo, reconhecimento e decisao."
  });

  if (subdimensionIntensities.limites !== "low" && scores.diplomacy >= scores.direction) {
    insights.push({
      id: "limites_com_cuidado_relacional",
      title: "Limites com cuidado relacional",
      description: "O tema limites aparece com forte preocupacao relacional.",
      recommendation: "Defina o limite primeiro e use o cuidado apenas para calibrar tom, nao para reduzir a mensagem."
    });
  }

  if (scores[primaryTrait] - scores[secondaryTrait] <= scoreContext.combinedThreshold) {
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
