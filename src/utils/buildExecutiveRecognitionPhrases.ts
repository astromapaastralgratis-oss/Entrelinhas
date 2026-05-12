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
    "Nem toda entrega excelente vira influencia quando voce nao ocupa explicitamente a autoria dela.",
    "Quando o impacto fica silencioso, a competencia trabalha mais do que a reputacao."
  ],
  high_diplomacy_low_boundaries: [
    "Sua diplomacia protege relacoes, mas pode estar reduzindo sua presenca.",
    "Quando voce suaviza demais o que precisa ser dito, sua clareza perde forca."
  ],
  high_precision_low_decision: [
    "Voce talvez esteja esperando seguranca demais para ocupar um espaco que ja e seu.",
    "Criterio demais, sem decisao, pode fazer maturidade parecer hesitacao."
  ],
  high_influence_low_space_ownership: [
    "Influencia tambem precisa de autoria; alinhar pessoas nao substitui ocupar lugar.",
    "Sua capacidade de mobilizar perde potencia quando sua posicao fica implicita."
  ],
  strong_presence_internal_strain: [
    "Confiabilidade nao deveria significar carregar tudo sozinha.",
    "Presenca forte tambem precisa de limite para nao virar desgaste silencioso."
  ]
};

const phrasesByDynamic: Partial<Record<ExecutiveDynamic, string[]>> = {
  hipercompetencia_silenciosa: [
    "Alta entrega precisa de narrativa, nao apenas de mais esforco.",
    "Quem entrega muito em silencio pode virar referencia, mas nem sempre vira influencia."
  ],
  excesso_de_sustentacao_emocional: [
    "Sustentar o clima nao pode custar a sua posicao.",
    "Nem toda tensao precisa ser absorvida por voce para a conversa continuar madura."
  ],
  lideranca_invisivel: [
    "Liderar nos bastidores tambem exige nomear autoria no momento certo.",
    "Se voce organiza o caminho, tambem precisa aparecer na decisao."
  ],
  diplomacia_defensiva: [
    "Elegancia nao precisa diminuir a firmeza da sua mensagem.",
    "Preservar relacoes nao deve apagar o que precisa ser sustentado."
  ],
  firmeza_situacional: [
    "Firmeza executiva nao e dureza; e criterio sem excesso de justificativa.",
    "Sua posicao ganha forca quando vem acompanhada de criterio e proximo passo."
  ],
  influencia_sem_ocupacao_de_espaco: [
    "Criar adesao e importante, mas ocupar a decisao tambem faz parte da influencia.",
    "Influencia silenciosa pode mover contextos, mas nem sempre move sua carreira."
  ],
  autocensura_estrategica: [
    "Nem toda prudencia e estrategia; algumas vezes e autocensura bem vestida.",
    "O que voce evita dizer pode estar definindo como voce e percebida."
  ],
  excesso_de_adaptacao: [
    "Adaptar-se demais pode fazer o ambiente esquecer onde voce termina.",
    "Flexibilidade sem limite vira disponibilidade permanente."
  ],
  sobrecarga_por_confiabilidade: [
    "Ser confiavel nao deveria transformar voce no destino automatico de toda urgencia.",
    "Quando tudo chega em voce, talvez o problema nao seja capacidade; seja fronteira."
  ],
  validacao_por_performance: [
    "Performance sustenta reputacao, mas nao substitui pedido de reconhecimento.",
    "Entregar mais nem sempre corrige a falta de visibilidade."
  ],
  controle_como_mecanismo_de_seguranca: [
    "Controle pode proteger a qualidade, mas tambem atrasar sua presenca na decisao.",
    "Em ambientes executivos, seguranca suficiente costuma valer mais do que certeza total."
  ],
  evitacao_de_conflito_politico: [
    "Evitar conflito politico pode preservar o clima e reduzir sua influencia ao mesmo tempo.",
    "Alguns contextos nao pedem neutralidade; pedem posicao bem calculada."
  ],
  presenca_forte_com_desgaste_interno: [
    "Se por fora voce sustenta tudo, por dentro talvez esteja pagando caro demais.",
    "Presenca executiva tambem e saber distribuir tensao, nao apenas suportar melhor."
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
      text: "Crescer tambem exige tornar visivel o criterio por tras das suas entregas.",
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
      text: "Limite bem colocado nao reduz compromisso; protege a qualidade da sua contribuicao.",
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
