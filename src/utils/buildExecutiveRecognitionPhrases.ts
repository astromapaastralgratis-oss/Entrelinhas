import type {
  ExecutiveContradictionId,
  ExecutiveDynamic,
  ExecutiveRecognitionPhrase,
  ExecutivePresenceContextSnapshot,
  ExecutivePresenceResult
} from "@/src/types/executivePresence";

const MAX_PHRASES = 3;

const phrasesByContradiction: Record<ExecutiveContradictionId, string[]> = {
  high_delivery_low_visibility: [
    "Nem toda entrega excelente vira influência quando você não ocupa explicitamente a autoria dela.",
    "Quando o impacto fica silencioso, a competencia trabalha mais do que a reputação."
  ],
  high_diplomacy_low_boundaries: [
    "Sua diplomacia protege relações, mas pode estar reduzindo sua presença.",
    "Quando você suaviza demais o que precisa ser dito, sua clareza perde força."
  ],
  high_precision_low_decision: [
    "Você talvez esteja esperando segurança demais para ocupar um espaço que já é seu.",
    "Criterio demais, sem decisão, pode fazer maturidade parecer hesitacao."
  ],
  high_influence_low_space_ownership: [
    "Influência também precisa de autoria; alinhar pessoas não substitui ocupar lugar.",
    "Sua capacidade de mobilizar perde potencia quando sua posição fica implicita."
  ],
  strong_presence_internal_strain: [
    "Confiabilidade não deveria significar carregar tudo sozinha.",
    "Presença forte também precisa de limite para não virar desgaste silencioso."
  ]
};

const phrasesByDynamic: Partial<Record<ExecutiveDynamic, string[]>> = {
  hipercompetencia_silenciosa: [
    "Alta entrega precisa de narrativa, não apenas de mais esforço.",
    "Quem entrega muito em silencio pode virar referencia, mas nem sempre vira influência."
  ],
  excesso_de_sustentacao_emocional: [
    "Sustentar o clima não pode custar a sua posição.",
    "Nem toda tensão precisa ser absorvida por você para a conversa continuar madura."
  ],
  lideranca_invisivel: [
    "Liderar nos bastidores também exige nomear autoria no momento certo.",
    "Se você organiza o caminho, também precisa aparecer na decisão."
  ],
  diplomacia_defensiva: [
    "Elegancia não precisa diminuir a firmeza da sua mensagem.",
    "Preservar relações não deve apagar o que precisa ser sustentado."
  ],
  firmeza_situacional: [
    "Firmeza executiva não e dureza; e criterio sem excesso de justificativa.",
    "Sua posição ganha força quando vem acompanhada de criterio e proximo passo."
  ],
  influencia_sem_ocupacao_de_espaco: [
    "Criar adesao e importante, mas ocupar a decisão também faz parte da influência.",
    "Influência silenciosa pode mover contextos, mas nem sempre move sua carreira."
  ],
  autocensura_estrategica: [
    "Nem toda prudência e estratégia; algumas vezes e autocensura bem vestida.",
    "O que você evita dizer pode estar definindo como você e percebida."
  ],
  excesso_de_adaptacao: [
    "Adaptar-se demais pode fazer o ambiente esquecer onde você termina.",
    "Flexibilidade sem limite vira disponibilidade permanente."
  ],
  sobrecarga_por_confiabilidade: [
    "Ser confiável não deveria transformar você no destino automatico de toda urgência.",
    "Quando tudo chega em você, talvez o problema não seja capacidade; seja fronteira."
  ],
  validacao_por_performance: [
    "Performance sustenta reputação, mas não substitui pedido de reconhecimento.",
    "Entregar mais nem sempre corrige a falta de visibilidade."
  ],
  controle_como_mecanismo_de_seguranca: [
    "Controle pode proteger a qualidade, mas também atrasar sua presença na decisão.",
    "Em ambientes executivos, segurança suficiente costuma valer mais do que certeza total."
  ],
  evitacao_de_conflito_politico: [
    "Evitar conflito político pode preservar o clima e reduzir sua influência ao mesmo tempo.",
    "Alguns contextos não pedem neutralidade; pedem posição bem calculada."
  ],
  presenca_forte_com_desgaste_interno: [
    "Se por fora você sustenta tudo, por dentro talvez esteja pagando caro demais.",
    "Presença executiva também é saber distribuir tensão, não apenas suportar melhor."
  ]
};

export function buildExecutiveRecognitionPhrases(result: ExecutivePresenceResult): ExecutiveRecognitionPhrase[] {
  const candidates: ExecutiveRecognitionPhrase[] = [
    ...buildContradictionPhrases(result),
    ...buildDynamicPhrases(result),
    ...buildContextPhrases(result.contextSnapshot)
  ];

  return dedupePhrases(candidates)
    .sort((first, second) => first.priority - second.priority)
    .slice(0, MAX_PHRASES);
}

function buildContradictionPhrases(result: ExecutivePresenceResult) {
  const mainContradiction = result.executiveContradictions?.[0];
  if (!mainContradiction) return [];

  return (phrasesByContradiction[mainContradiction.id] ?? []).map((text, index) => ({
    id: `${mainContradiction.id}_${index}`,
    text,
    source: "contradiction" as const,
    priority: 10 + index
  }));
}

function buildDynamicPhrases(result: ExecutivePresenceResult) {
  const dominantDynamic = getDominantDynamic(result);
  if (!dominantDynamic) return [];

  return (phrasesByDynamic[dominantDynamic] ?? []).map((text, index) => ({
    id: `${dominantDynamic}_${index}`,
    text,
    source: "dynamic" as const,
    priority: 30 + index
  }));
}

function buildContextPhrases(context: ExecutivePresenceContextSnapshot | undefined) {
  if (!context) return [];

  const phrases: ExecutiveRecognitionPhrase[] = [];
  const seniority = context.seniority?.toLowerCase() ?? "";
  const challenge = context.mainChallenge?.toLowerCase() ?? "";

  if (seniority.includes("lider") || seniority.includes("ger") || seniority.includes("dire")) {
    phrases.push({
      id: "context_seniority_leadership",
      text: "Quanto maior sua senioridade, menos basta entregar; e preciso conduzir contexto.",
      source: "context",
      priority: 50
    });
  } else if (seniority) {
    phrases.push({
      id: "context_seniority_growth",
      text: "Crescer também exige tornar visivel o criterio por tras das suas entregas.",
      source: "context",
      priority: 50
    });
  }

  if (challenge.includes("visibilidade") || challenge.includes("reconhecimento")) {
    phrases.push({
      id: "context_visibility_challenge",
      text: "Reconhecimento raramente nasce apenas da entrega; ele cresce quando o impacto fica legivel.",
      source: "context",
      priority: 51
    });
  }

  if (challenge.includes("limite") || challenge.includes("sobrecarga")) {
    phrases.push({
      id: "context_boundaries_challenge",
      text: "Limite bem colocado não reduz compromisso; protege a qualidade da sua contribuição.",
      source: "context",
      priority: 51
    });
  }

  return phrases;
}

function getDominantDynamic(result: ExecutivePresenceResult) {
  if (!result.executiveDynamicScores) return null;
  const entries = Object.entries(result.executiveDynamicScores) as Array<[ExecutiveDynamic, number]>;
  const [key, score] = entries.sort((first, second) => second[1] - first[1])[0] ?? [];
  return key && score > 0 ? key : null;
}

function dedupePhrases(phrases: ExecutiveRecognitionPhrase[]) {
  const seen = new Set<string>();
  return phrases.filter((phrase) => {
    const key = normalizePhrase(phrase.text);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizePhrase(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
