export const situationOptions = [
  "Reunião importante",
  "Negociação salarial",
  "Feedback difícil",
  "Fui interrompida",
  "Roubaram minha ideia",
  "Discordar do líder",
  "Definir limites",
  "Me posicionar em reunião"
];

export const toneOptions = ["Diplomático", "Firme", "Executivo"];

export type ExecutiveScriptInput = {
  situation: string;
  context: string;
  desiredOutcome: string;
  peopleInvolved: string;
  tone: string;
};

export type ProfileForm = {
  full_name: string;
  current_role: string;
  industry: string;
  career_goal: string;
  preferred_style: string;
};

export const quickScripts = [
  {
    title: "Fui interrompida",
    situation: "Interrupção em reunião",
    diplomatic: "Quero concluir meu raciocínio para que a equipe tenha o contexto completo. Em seguida, eu adoraria ouvir seu ponto.",
    firm: "Vou terminar meu ponto antes de abrirmos para comentários. Preciso de mais trinta segundos.",
    executive: "Para mantermos a qualidade da decisão, vou fechar a linha de raciocínio e depois conecto com a sua contribuição."
  },
  {
    title: "Roubaram minha ideia",
    situation: "Crédito por contribuição",
    diplomatic: "Fico feliz que a ideia esteja avançando. Só quero recuperar o ponto inicial que eu trouxe e contribuir com os próximos passos.",
    firm: "Essa proposta foi a linha que apresentei anteriormente. Quero garantir que o crédito e a execução fiquem claros daqui para frente.",
    executive: "Como essa iniciativa nasceu da análise que compartilhei, proponho que eu lidere a estruturação e alinhe responsabilidades com o grupo."
  },
  {
    title: "Preciso discordar diplomaticamente",
    situation: "Discordância com liderança",
    diplomatic: "Entendo a direção. Minha leitura traz um risco adicional: se seguirmos assim, podemos comprometer prazo ou adesão.",
    firm: "Tenho uma preocupação objetiva com esse caminho. Antes de decidirmos, preciso colocar os impactos que estou vendo.",
    executive: "Minha recomendação é ajustarmos a rota. O racional é risco, custo de reversão e efeito político da decisão."
  },
  {
    title: "Quero pedir aumento",
    situation: "Negociação salarial",
    diplomatic: "Gostaria de conversar sobre minha evolução de escopo, entregas recentes e uma revisão de remuneração compatível.",
    firm: "Meu escopo cresceu, os resultados sustentam a conversa e quero alinhar um plano concreto de revisão salarial.",
    executive: "Quero tratar minha remuneração como reflexo de impacto, escopo e retenção. Trago dados e uma proposta objetiva."
  },
  {
    title: "Preciso estabelecer limites",
    situation: "Limites de disponibilidade",
    diplomatic: "Consigo apoiar, mas preciso alinhar prioridade e prazo para entregar com qualidade sem comprometer o que já está combinado.",
    firm: "Não consigo absorver isso sem retirar outra entrega da fila. Vamos decidir o que será rebaixado em prioridade.",
    executive: "Para proteger qualidade e previsibilidade, preciso de uma decisão de prioridade antes de assumir esse novo escopo."
  },
  {
    title: "Preciso responder um feedback injusto",
    situation: "Feedback difícil",
    diplomatic: "Obrigada por trazer. Quero entender exemplos concretos para separar percepção, fato e ações de melhoria.",
    firm: "Quero responder com seriedade, mas preciso de evidências específicas. Sem exemplos, fica difícil transformar isso em ação justa.",
    executive: "Vamos qualificar esse feedback com fatos, impacto e expectativa. Assim conseguimos tratar a questão sem ruído ou julgamento amplo."
  }
];

export function buildFallbackExecutiveScript(input: ExecutiveScriptInput) {
  const situation = input.situation || "situação corporativa";
  const tone = input.tone || "Executivo";
  return [
    `1. Leitura estratégica\nVocê está diante de ${situation.toLowerCase()}, uma situação que pede clareza, controle emocional e uma frase de abertura que organize a conversa. O ponto central não é provar valor; é conduzir a percepção de valor com maturidade.`,
    `2. Risco da situação\nO risco é entrar reativa, justificar demais ou permitir que a conversa seja definida pela tensão do momento. Isso pode reduzir sua autoridade mesmo quando você tem razão.`,
    `3. Melhor postura\nUse tom ${tone.toLowerCase()}, fale em fatos observáveis, impacto no trabalho e próximo passo. Seja breve, específica e mantenha o eixo na decisão que precisa ser tomada.`,
    `4. O que NÃO dizer\nEvite: "você sempre", "isso é injusto", "ninguém me escuta" ou qualquer frase que coloque a outra pessoa na defensiva antes de você estabelecer o ponto.`,
    `5. Script pronto para usar\n"Quero trazer esse ponto com objetividade. O que aconteceu foi: ${input.context || "[descreva o fato principal em uma frase]"}. O impacto disso é que ${input.desiredOutcome || "precisamos alinhar expectativa e próximo passo"}. Minha proposta é seguirmos com clareza sobre responsabilidades, critérios e decisão. Para mim, o melhor encaminhamento agora é definirmos o combinado e quem fica responsável por cada parte."`,
    `6. Versão curta\n"Quero alinhar isso com clareza: aconteceu [fato], o impacto foi [impacto] e minha proposta é [próximo passo]."`,
    `7. Versão mais firme\n"Preciso ser direta: esse ponto afeta meu escopo, minha contribuição e a qualidade da decisão. Quero que alinhemos fatos, responsabilidades e próximos passos antes de seguir."`,
    `8. Próximo passo recomendado\nAntes da conversa, escreva três fatos objetivos, uma evidência de impacto e uma proposta concreta. Depois, registre o combinado por mensagem para reduzir ambiguidade.`
  ].join("\n\n");
}

export function parseExecutiveScriptSections(content: string) {
  const labels = [
    "Leitura estratégica",
    "Risco da situação",
    "Melhor postura",
    "O que NÃO dizer",
    "Script pronto para usar",
    "Versão curta",
    "Versão mais firme",
    "Próximo passo recomendado"
  ];

  return labels.map((label, index) => {
    const current = `${index + 1}. ${label}`;
    const next = labels[index + 1] ? `${index + 2}. ${labels[index + 1]}` : null;
    const start = content.indexOf(current);
    const end = next ? content.indexOf(next) : content.length;
    const body = start >= 0 ? content.slice(start + current.length, end >= 0 ? end : content.length).trim() : "";
    return { title: label, body: body || "Ainda não gerado." };
  });
}
