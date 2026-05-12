import { executiveDynamicLabels, executivePresenceSubdimensionLabels } from "@/src/data/executivePresenceMethodology";
import type {
  ExecutiveDynamic,
  ExecutivePresenceEvolution,
  ExecutivePresenceEvolutionSignal,
  ExecutivePresenceResult,
  ExecutivePresenceSubdimension
} from "@/src/types/executivePresence";

const SIGNIFICANT_DELTA = 1.25;
const PERSISTENCE_THRESHOLD = 2;

export function buildExecutivePresenceEvolution(
  current: ExecutivePresenceResult,
  previous: ExecutivePresenceResult | null | undefined
): ExecutivePresenceEvolution | undefined {
  if (!previous) return undefined;

  const signals = [
    buildIncreaseSignal(
      "assertiveness_increased",
      "Mais assertividade",
      "aparece mais assertividade na forma de sustentar posicoes e conduzir proximos passos",
      previous.subdimensionScores?.assertividade,
      current.subdimensionScores?.assertividade
    ),
    buildIncreaseSignal(
      "positioning_clarity_increased",
      "Mais clareza de posicionamento",
      "aparece mais clareza para nomear posicao, impacto e proximo movimento",
      previous.subdimensionScores?.clareza_de_posicionamento,
      current.subdimensionScores?.clareza_de_posicionamento
    ),
    buildReductionSignal(
      "defensive_diplomacy_reduced",
      "Menos diplomacia defensiva",
      "a diplomacia defensiva aparece menos intensa, abrindo espaco para conversas mais diretas",
      previous.executiveDynamicScores?.diplomacia_defensiva,
      current.executiveDynamicScores?.diplomacia_defensiva
    ),
    buildReductionSignal(
      "performance_validation_reduced",
      "Menos validacao por performance",
      "a necessidade de provar valor por excesso de entrega aparece menos central",
      previous.executiveDynamicScores?.validacao_por_performance,
      current.executiveDynamicScores?.validacao_por_performance
    ),
    buildPersistenceSignal(
      "reliability_overload_persisted",
      "Sobrecarga por confiabilidade ainda presente",
      "a sobrecarga por confiabilidade segue como um padrao recorrente",
      getReliabilityOverloadScore(previous),
      getReliabilityOverloadScore(current)
    ),
    buildIncreaseSignal(
      "space_ownership_increased",
      "Mais ocupacao de espaco",
      "aparece mais presenca para ocupar espaco, autoria e lugar de conducao",
      previous.subdimensionScores?.presenca_executiva,
      current.subdimensionScores?.presenca_executiva
    ),
    buildIncreaseSignal(
      "presence_strain_increased",
      "Mais presenca com desgaste interno",
      "a presenca forte com desgaste interno aparece mais intensa e pede distribuicao de tensao",
      previous.executiveDynamicScores?.presenca_forte_com_desgaste_interno,
      current.executiveDynamicScores?.presenca_forte_com_desgaste_interno
    ),
    buildIncreaseSignal(
      "boundaries_improved",
      "Mais sustentacao de limites",
      "aparece mais capacidade de sustentar limites com criterio e menos excesso de justificativa",
      previous.subdimensionScores?.limites,
      current.subdimensionScores?.limites
    ),
    buildDominantDynamicShiftSignal(previous, current)
  ].filter((signal): signal is ExecutivePresenceEvolutionSignal => Boolean(signal));

  if (!signals.length) return undefined;

  return {
    previousResultId: previous.resultId,
    previousCreatedAt: previous.createdAt,
    currentResultId: current.resultId,
    currentCreatedAt: current.createdAt,
    narrative: buildNarrative(signals),
    signals
  };
}

function buildIncreaseSignal(
  id: ExecutivePresenceEvolutionSignal["id"],
  title: string,
  summary: string,
  previousValue: number | undefined,
  currentValue: number | undefined
): ExecutivePresenceEvolutionSignal | null {
  if (!isMeaningfulIncrease(previousValue, currentValue)) return null;
  return { id, kind: "increase", title, summary, previousValue: previousValue ?? null, currentValue: currentValue ?? null };
}

function buildReductionSignal(
  id: ExecutivePresenceEvolutionSignal["id"],
  title: string,
  summary: string,
  previousValue: number | undefined,
  currentValue: number | undefined
): ExecutivePresenceEvolutionSignal | null {
  if (!isMeaningfulReduction(previousValue, currentValue)) return null;
  return { id, kind: "reduction", title, summary, previousValue: previousValue ?? null, currentValue: currentValue ?? null };
}

function buildPersistenceSignal(
  id: ExecutivePresenceEvolutionSignal["id"],
  title: string,
  summary: string,
  previousValue: number | undefined,
  currentValue: number | undefined
): ExecutivePresenceEvolutionSignal | null {
  if (typeof previousValue !== "number" || typeof currentValue !== "number") return null;
  if (previousValue < PERSISTENCE_THRESHOLD || currentValue < PERSISTENCE_THRESHOLD) return null;
  return { id, kind: "persistence", title, summary, previousValue, currentValue };
}

function buildDominantDynamicShiftSignal(
  previous: ExecutivePresenceResult,
  current: ExecutivePresenceResult
): ExecutivePresenceEvolutionSignal | null {
  const previousDominant = getDominantEntry(previous.executiveDynamicScores, executiveDynamicLabels);
  const currentDominant = getDominantEntry(current.executiveDynamicScores, executiveDynamicLabels);
  if (!previousDominant || !currentDominant || previousDominant.key === currentDominant.key) return null;

  return {
    id: "dominant_dynamic_shifted",
    kind: "shift",
    title: "Mudanca de dinamica dominante",
    summary: `a dinamica dominante saiu de ${previousDominant.label} e passou a apontar mais para ${currentDominant.label}`,
    previousValue: previousDominant.label,
    currentValue: currentDominant.label
  } satisfies ExecutivePresenceEvolutionSignal;
}

function isMeaningfulIncrease(previousValue: number | undefined, currentValue: number | undefined) {
  return typeof previousValue === "number" && typeof currentValue === "number" && currentValue - previousValue >= SIGNIFICANT_DELTA;
}

function isMeaningfulReduction(previousValue: number | undefined, currentValue: number | undefined) {
  return typeof previousValue === "number" && typeof currentValue === "number" && previousValue - currentValue >= SIGNIFICANT_DELTA;
}

function getDominantEntry<T extends ExecutiveDynamic | ExecutivePresenceSubdimension>(
  scores: Record<T, number> | undefined,
  labels: Record<T, string>
) {
  if (!scores) return null;
  const entries = Object.entries(scores) as Array<[T, number]>;
  const [key, score] = entries.sort((first, second) => second[1] - first[1])[0] ?? [];
  if (!key || !score || score <= 0) return null;
  return { key, score, label: labels[key] };
}

function getReliabilityOverloadScore(result: ExecutivePresenceResult) {
  const directScore = result.executiveDynamicScores?.sobrecarga_por_confiabilidade ?? 0;
  const emotionalSustainScore = result.executiveDynamicScores?.excesso_de_sustentacao_emocional ?? 0;
  return Math.max(directScore, emotionalSustainScore);
}

function buildNarrative(signals: ExecutivePresenceEvolutionSignal[]) {
  const [first, second] = signals;
  if (!second) {
    return `Em comparacao com sua leitura anterior, ${first.summary}.`;
  }

  const connector = second.kind === "persistence" ? "Ao mesmo tempo" : "Tambem";
  return `Em comparacao com sua leitura anterior, ${first.summary}. ${connector}, ${second.summary}.`;
}
