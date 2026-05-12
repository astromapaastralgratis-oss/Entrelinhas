import type {
  ExecutiveDynamic,
  ExecutivePresenceQuestionCriticality,
  ExecutivePresenceSubdimension,
  TraitKey
} from "@/src/types/executivePresence";

export const EXECUTIVE_PRESENCE_METHODOLOGY_VERSION = "2026-05-12-v2-weighted";

export const executivePresenceCriticalityWeights: Record<ExecutivePresenceQuestionCriticality, number> = {
  standard: 1,
  elevated: 1.25,
  critical: 1.5
};

export const executivePresenceSubdimensionLabels: Record<ExecutivePresenceSubdimension, string> = {
  assertividade: "Assertividade",
  influencia: "Influencia",
  leitura_politica: "Leitura politica",
  regulacao_emocional: "Regulacao emocional",
  clareza_de_posicionamento: "Clareza de posicionamento",
  gestao_de_conflito: "Gestao de conflito",
  limites: "Limites",
  tomada_de_decisao: "Tomada de decisao",
  presenca_executiva: "Presenca executiva",
  seguranca_relacional: "Seguranca relacional"
};

export const executiveDynamicLabels: Record<ExecutiveDynamic, string> = {
  hipercompetencia_silenciosa: "Hipercompetencia silenciosa",
  excesso_de_sustentacao_emocional: "Excesso de sustentacao emocional",
  lideranca_invisivel: "Lideranca invisivel",
  diplomacia_defensiva: "Diplomacia defensiva",
  firmeza_situacional: "Firmeza situacional",
  influencia_sem_ocupacao_de_espaco: "Influencia sem ocupacao de espaco",
  autocensura_estrategica: "Autocensura estrategica",
  excesso_de_adaptacao: "Excesso de adaptacao",
  sobrecarga_por_confiabilidade: "Sobrecarga por confiabilidade",
  validacao_por_performance: "Validacao por performance",
  controle_como_mecanismo_de_seguranca: "Controle como mecanismo de seguranca",
  evitacao_de_conflito_politico: "Evitacao de conflito politico",
  presenca_forte_com_desgaste_interno: "Presenca forte com desgaste interno"
};

export type ExecutivePresenceMethodologyOption = {
  optionId: string;
  traitKey: TraitKey;
  subdimension: ExecutivePresenceSubdimension;
  executiveDynamic: ExecutiveDynamic;
  behaviorSignal: string;
  interpretation: string;
  risk: string;
  feedback: string;
};

export type ExecutivePresenceMethodologyEntry = {
  questionId: string;
  observedSituation: string;
  evaluatedBehavior: string;
  criticality: ExecutivePresenceQuestionCriticality;
  weight: number;
  weightRationale: string;
  options: ExecutivePresenceMethodologyOption[];
};

const optionBlueprint: Record<TraitKey, Omit<ExecutivePresenceMethodologyOption, "optionId" | "traitKey">> = {
  direction: {
    subdimension: "assertividade",
    executiveDynamic: "firmeza_situacional",
    behaviorSignal: "Escolhe agir, delimitar e conduzir o proximo passo.",
    interpretation: "Indica preferencia por direcao, decisao e responsabilizacao visivel.",
    risk: "Pode acelerar antes de mapear sensibilidades politicas ou relacionais.",
    feedback: "Manter firmeza, incluindo criterio e leitura de ambiente antes do fechamento."
  },
  influence: {
    subdimension: "influencia",
    executiveDynamic: "influencia_sem_ocupacao_de_espaco",
    behaviorSignal: "Busca adesao, narrativa e mobilizacao de pessoas.",
    interpretation: "Indica preferencia por construir tracao e tornar a mensagem mais influente.",
    risk: "Pode buscar receptividade antes de declarar uma posicao suficientemente clara.",
    feedback: "Converter narrativa em pedido explicito, decisao e autoria visivel."
  },
  diplomacy: {
    subdimension: "seguranca_relacional",
    executiveDynamic: "diplomacia_defensiva",
    behaviorSignal: "Prioriza clima, relacao, timing e reducao de tensao.",
    interpretation: "Indica sensibilidade relacional e capacidade de preservar confianca em temas sensiveis.",
    risk: "Pode suavizar limites, atrasar confronto necessario ou carregar custo emocional excessivo.",
    feedback: "Preservar elegancia sem diluir pedido, limite ou recomendacao."
  },
  precision: {
    subdimension: "tomada_de_decisao",
    executiveDynamic: "controle_como_mecanismo_de_seguranca",
    behaviorSignal: "Busca dados, criterios, riscos e estrutura antes de avancar.",
    interpretation: "Indica preferencia por consistencia, preparo e reducao de ambiguidade.",
    risk: "Pode explicar demais, adiar posicao ou usar controle como forma de seguranca.",
    feedback: "Transformar analise em recomendacao executiva, com nivel de confianca e proximo passo."
  }
};

const overrides: Record<string, Partial<Omit<ExecutivePresenceMethodologyOption, "optionId" | "traitKey">>> = {
  q02_o1: { subdimension: "presenca_executiva", executiveDynamic: "presenca_forte_com_desgaste_interno" },
  q02_o2: { subdimension: "presenca_executiva" },
  q02_o3: { subdimension: "regulacao_emocional", executiveDynamic: "autocensura_estrategica" },
  q03_o3: { subdimension: "gestao_de_conflito", executiveDynamic: "evitacao_de_conflito_politico" },
  q04_o2: { subdimension: "presenca_executiva", executiveDynamic: "validacao_por_performance" },
  q04_o4: { subdimension: "clareza_de_posicionamento", executiveDynamic: "hipercompetencia_silenciosa" },
  q05_o1: { subdimension: "clareza_de_posicionamento", executiveDynamic: "lideranca_invisivel" },
  q05_o2: { subdimension: "presenca_executiva", executiveDynamic: "lideranca_invisivel" },
  q05_o3: { subdimension: "leitura_politica", executiveDynamic: "diplomacia_defensiva" },
  q05_o4: { subdimension: "leitura_politica", executiveDynamic: "hipercompetencia_silenciosa" },
  q06_o1: { subdimension: "limites" },
  q06_o2: { subdimension: "limites" },
  q06_o3: { subdimension: "limites", executiveDynamic: "excesso_de_adaptacao" },
  q07_o3: { subdimension: "regulacao_emocional", executiveDynamic: "excesso_de_sustentacao_emocional" },
  q08_o3: { subdimension: "gestao_de_conflito", executiveDynamic: "excesso_de_sustentacao_emocional" },
  q09_o3: { subdimension: "leitura_politica", executiveDynamic: "evitacao_de_conflito_politico" },
  q10_o1: { subdimension: "regulacao_emocional", executiveDynamic: "presenca_forte_com_desgaste_interno" },
  q10_o3: { subdimension: "regulacao_emocional", executiveDynamic: "excesso_de_sustentacao_emocional" },
  q11_o3: { subdimension: "leitura_politica", executiveDynamic: "excesso_de_sustentacao_emocional" },
  q12_o4: { subdimension: "clareza_de_posicionamento", executiveDynamic: "validacao_por_performance" },
  q13_o3: { subdimension: "seguranca_relacional", executiveDynamic: "excesso_de_adaptacao" },
  q14_o1: { subdimension: "presenca_executiva" },
  q14_o3: { subdimension: "leitura_politica" },
  q15_o3: { subdimension: "gestao_de_conflito", executiveDynamic: "excesso_de_sustentacao_emocional" },
  q16_o3: { subdimension: "seguranca_relacional", executiveDynamic: "diplomacia_defensiva" },
  q17_o1: { subdimension: "leitura_politica" },
  q17_o2: { subdimension: "leitura_politica" },
  q17_o3: { subdimension: "leitura_politica", executiveDynamic: "evitacao_de_conflito_politico" },
  q18_o1: { subdimension: "limites" },
  q18_o3: { subdimension: "seguranca_relacional", executiveDynamic: "excesso_de_adaptacao" },
  q19_o1: { subdimension: "presenca_executiva" },
  q19_o2: { subdimension: "presenca_executiva", executiveDynamic: "lideranca_invisivel" },
  q19_o4: { subdimension: "clareza_de_posicionamento", executiveDynamic: "validacao_por_performance" },
  q20_o1: { subdimension: "limites" },
  q20_o2: { subdimension: "presenca_executiva" },
  q20_o3: { subdimension: "leitura_politica", executiveDynamic: "evitacao_de_conflito_politico" }
};

const questionBlueprints = [
  ["q01", "Reuniao sem foco", "Como a usuaria reorganiza energia coletiva, decisao e criterios quando a conversa perde direcao.", "standard", "Situacao recorrente, mas menos reveladora de risco politico ou exposicao direta."],
  ["q02", "Interrupcao", "Como recupera espaco, autoria e presenca sem perder maturidade executiva.", "critical", "Revela ocupacao de espaco, autoria e resposta sob exposicao publica imediata."],
  ["q03", "Discordancia com lideranca", "Como sustenta divergencia, criterio politico e seguranca relacional.", "critical", "Mostra capacidade de sustentar posicao quando ha assimetria de poder."],
  ["q04", "Negociacao salarial", "Como traduz entrega em valor, pedido e posicao profissional.", "elevated", "Evidencia relacao com valor, reconhecimento e pedido explicito."],
  ["q05", "Apropriacao de ideia", "Como protege autoria, credito e lideranca sem escalar tensao desnecessaria.", "critical", "Expõe padroes de autoria, visibilidade e protecao de contribuicao estrategica."],
  ["q06", "Definicao de limites", "Como delimita capacidade, prioridade e combinados.", "critical", "Revela sustentacao de limite quando ha risco de sobrecarga ou desagrado."],
  ["q07", "Pressao", "Qual recurso de presenca aparece primeiro em ambiente de urgencia.", "elevated", "Mostra resposta inicial em tensao, mas com menor especificidade contextual."],
  ["q08", "Feedback injusto", "Como separa percepcao, fato, imagem e resposta executiva.", "elevated", "Indica regulacao, defesa de imagem e capacidade de resposta sem reatividade."],
  ["q09", "Apresentacao senior", "Como prepara mensagem, politica, evidencia e pedido de decisao.", "elevated", "Revela preparo de influencia e leitura de audiencia executiva."],
  ["q10", "Conversa carregada", "Como regula tensao, ambiguidade e necessidade de fechamento.", "critical", "Mostra padrao de regulacao emocional em conversa de alto custo relacional."],
  ["q11", "Comite divergente", "Como cria caminho entre interesses, criterios e responsabilidades.", "elevated", "Evidencia conducao entre interesses e maturidade politica."],
  ["q12", "Defesa de trabalho", "Como transforma entrega em reconhecimento, autoria e valor percebido.", "standard", "Importante para visibilidade, mas menos tensionada que situacoes de confronto direto."],
  ["q13", "Decisao dificil", "Como escolhe entre velocidade, consenso, impacto humano e risco.", "elevated", "Revela criterios de decisao em ambiguidade e trade-offs."],
  ["q14", "Posicionamento publico", "Qual base de sustentacao usa quando esta visivel.", "elevated", "Mostra sustentacao de presenca em exposicao profissional."],
  ["q15", "Entrega critica atrasada", "Como conduz responsabilidade, urgencia, bloqueios e recuperacao.", "elevated", "Evidencia responsabilidade executiva sob risco de entrega."],
  ["q16", "Questionamento", "Como responde a objecao sem perder posicao ou relacao.", "elevated", "Revela resposta a contestacao e capacidade de manter eixo."],
  ["q17", "Ambiente politico", "O que observa primeiro quando poder, influencia e narrativa estao em jogo.", "critical", "Mapeia leitura politica, uma das variaveis mais sensiveis de presenca executiva."],
  ["q18", "Pedido de apoio", "Como formula necessidade, impacto, contexto e expectativa.", "standard", "Relevante para comunicacao, mas com menor exposicao de conflito ou poder."],
  ["q19", "Subestimacao", "Como reage quando precisa reposicionar percepcao de valor.", "critical", "Revela resposta a desvalorizacao, visibilidade e reposicionamento de autoridade."],
  ["q20", "Proximo nivel", "Qual capacidade a usuaria reconhece como alavanca de evolucao profissional.", "elevated", "Mostra direcao de desenvolvimento percebida e tensao dominante de crescimento."]
] as const;

const traitOptionOrder: TraitKey[] = ["direction", "influence", "diplomacy", "precision"];

export const executivePresenceMethodology: ExecutivePresenceMethodologyEntry[] = questionBlueprints.map(
  ([questionId, observedSituation, evaluatedBehavior, criticality, weightRationale]) => ({
    questionId,
    observedSituation,
    evaluatedBehavior,
    criticality,
    weight: executivePresenceCriticalityWeights[criticality],
    weightRationale,
    options: traitOptionOrder.map((traitKey, index) => {
      const optionId = `${questionId}_o${index + 1}`;
      return {
        optionId,
        traitKey,
        ...optionBlueprint[traitKey],
        ...overrides[optionId]
      };
    })
  })
);

export function getExecutivePresenceMethodologyEntry(questionId: string) {
  return executivePresenceMethodology.find((entry) => entry.questionId === questionId);
}

export function getExecutivePresenceMethodologyOption(questionId: string, optionId: string) {
  return getExecutivePresenceMethodologyEntry(questionId)?.options.find((option) => option.optionId === optionId);
}
