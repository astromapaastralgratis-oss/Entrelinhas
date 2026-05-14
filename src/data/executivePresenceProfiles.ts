import type { ExecutivePresenceProfile, ExecutivePresenceProfileId } from "@/src/types/executivePresence";

export const executivePresenceProfiles: Record<ExecutivePresenceProfileId, ExecutivePresenceProfile> = {
  assertive_executor: {
    id: "assertive_executor",
    name: "Executora Assertiva",
    shortDescription: "Você tende a avançar com clareza, decisão e senso de responsabilidade.",
    executiveReading:
      "Sua presença cresce quando existe uma decisão em jogo. Você identifica o ponto central, organiza prioridade e tende a assumir o encaminhamento com firmeza.",
    communicationPattern:
      "Comunicação direta, objetiva e orientada a ação. Funciona bem quando há urgência, mas precisa de calibragem para não soar dura em ambientes sensíveis.",
    strengths: ["Clareza de decisão", "Coragem para se posicionar", "Capacidade de destravar impasses"],
    risks: ["Acelerar antes de ler o contexto político", "Ser percebida como inflexivel", "Reduzir espaço para contribuições do grupo"],
    evolutionPoint: "Aprender a combinar firmeza com percepção de ambiente antes de definir a rota.",
    avoidPhrases: ["Isso e óbvio.", "Vamos decidir logo.", "Não vejo por que discutir tanto."],
    startUsingPhrases: [
      "Minha recomendação e está, considerando impacto e prazo.",
      "Vejo dois caminhos possíveis e sugiro avançarmos com o mais seguro.",
      "Para destravar, proponho definirmos responsável, prazo e critério de sucesso."
    ],
    recommendedPractices: ["Preparar uma frase de abertura firme", "Mapear possíveis resistências antes da reunião", "Fechar conversas com combinados claros"],
    recommendedReadings: ["Comunicação assertiva em ambientes executivos", "Tomada de decisão sob pressão", "Influência sem agressividade"],
    recommendedTrainings: ["Treino de limites", "Treino de discordancia com liderança", "Treino de negociação objetiva"],
    firstScriptSuggestions: ["Definir limites", "Discordar do lider", "Negociação salarial"],
    perceivedByOthers:
      "Você costuma ser percebida como alguém que assume responsabilidade e tira assuntos do campo da indefinição. Quando calibra escuta e ritmo, sua firmeza vira referência de liderança, não apenas velocidade de execucao.",
    pressurePattern:
      "Sob pressão, você tende a reduzir o problema ao essencial e buscar decisão rápida. Esse movimento é valioso, mas pode deixar sinais politicos e emocionais importantes fora da mesa.",
    executiveSabotage:
      "O risco é transformar competencia em controle. Quando você decide rápido demais, pessoas podem concordar por conveniência e não por alinhamento real.",
    corporateExpectation:
      "Sua próxima versão precisa manter a firmeza, mas mostrar mais visão de contexto. O corporativo espera que você conduza decisões difíceis com direção, escuta e critério de adesão.",
    presenceMicroAdjustments: [
      "Antes de defender uma rota, nomeie o critério que sustenta sua recomendação.",
      "Inclua uma pergunta de alinhamento antes de fechar a decisão.",
      "Troque urgência por prioridade: isso preserva firmeza sem transmitir impaciência."
    ],
    internalScriptsToChange: [
      { from: "Se eu não conduzir, isso não anda.", to: "Eu posso conduzir melhor quando crio alinhamento antes da execucao." },
      { from: "Preciso resolver rápido.", to: "Preciso decidir bem, com clareza de impacto e responsabilidade." },
      { from: "Escutar demais atrasa.", to: "Escuta estratégica evita retrabalho político depois." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: pratique abrir reuniões com critério, impacto e proposta em até tres frases.",
      "Semana 2: antes de discordar, valide o objetivo comum e depois apresente sua recomendação.",
      "Semana 3: conduza uma conversa difícil usando pergunta de alinhamento antes do fechamento.",
      "Semana 4: revise uma decisão recente e identifique onde faltou critério político, não técnica."
    ]
  },
  strategic_influencer: {
    id: "strategic_influencer",
    name: "Influenciadora Estratégica",
    shortDescription: "Você tende a criar adesão conectando pessoas, narrativa e impacto.",
    executiveReading:
      "Sua presença aparece quando precisa mobilizar atenção e transformar uma ideia em movimento. Você le o público e ajusta a mensagem para gerar tração.",
    communicationPattern:
      "Comunicação envolvente, contextual e persuasiva. Ganha força quando apoiada por foco e critérios objetivos.",
    strengths: ["Construcao de narrativa", "Visibilidade positiva", "Capacidade de mobilizacao"],
    risks: ["Alongar demais a argumentação", "Buscar adesão antes de definir posição", "Depender excessivamente da reação externa"],
    evolutionPoint: "Aumentar precisão e fechamento para que influência se converta em decisão.",
    avoidPhrases: ["Acho que todo mundo vai gostar.", "Talvez possamos tentar.", "Queria so compartilhar uma ideia."],
    startUsingPhrases: [
      "A tese central e está e o impacto esperado e claro.",
      "Para gerar adesão, sugiro conectarmos essa proposta ao objetivo do trimestre.",
      "Minha proposta é simples: alinhar mensagem, dono e próximo passo."
    ],
    recommendedPractices: ["Sintetizar argumentos em uma tese", "Fechar apresentações com pedido explícito", "Separar narrativa de evidência"],
    recommendedReadings: ["Storytelling executivo", "Influência corporativa", "Presença em apresentações seniores"],
    recommendedTrainings: ["Treino de apresentação executiva", "Treino de pitch interno", "Treino de influência em reuniões"],
    firstScriptSuggestions: ["Me posicionar em reunião", "Roubaram minha ideia", "Reunião importante"],
    perceivedByOthers:
      "Você tende a ser percebida como alguém que cria energia, aproxima pessoas e torna ideias mais desejaveis. Quando sustenta uma posição clara, sua influência ganha peso executivo.",
    pressurePattern:
      "Sob pressão, você pode tentar recuperar controle pela narrativa e pela adesão do grupo. Isso ajuda a mobilizar, mas pode atrasar uma posição mais objetiva.",
    executiveSabotage:
      "O ponto de sabotagem aparece quando você suaviza o pedido para manter receptividade. O resultado pode ser uma boa percepção social sem uma decisão concreta.",
    corporateExpectation:
      "Sua próxima versão precisa transformar presença e narrativa em fechamento. O corporativo espera que você influencie com clareza de tese, impacto e pedido.",
    presenceMicroAdjustments: [
      "Abra sua posição pela tese antes de contextualizar.",
      "Finalize toda apresentação com pedido, dono e próximo passo.",
      "Use menos explicação preparatória e mais afirmação de direção."
    ],
    internalScriptsToChange: [
      { from: "Preciso fazer todos gostarem da ideia.", to: "Preciso deixar claro por que esta ideia importa e qual decisão ela pede." },
      { from: "Se eu for direta, posso perder adesão.", to: "Direção clara aumenta confiança quando vem com critério." },
      { from: "Ainda preciso vender melhor.", to: "Preciso pedir com mais precisão." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: transforme tres ideias importantes em teses de uma frase.",
      "Semana 2: treine encerrar reuniões com uma solicitação explícita.",
      "Semana 3: reduza pela metade o contexto antes de apresentar uma recomendação.",
      "Semana 4: escolha uma conversa de influência e prepare mensagem, evidência e pedido."
    ]
  },
  relational_diplomat: {
    id: "relational_diplomat",
    name: "Diplomatica Relacional",
    shortDescription: "Você tende a preservar confiança, ler nuances e conduzir conversas sensíveis.",
    executiveReading:
      "Sua presença é percebida na forma como reduz ruidos e cria espaço para alinhamentos difíceis. Você entende relações, timing e contexto emocional.",
    communicationPattern:
      "Comunicação cuidadosa, mediadora e empática. Precisa cuidar para que diplomacia não vire adiamento de posicionamento.",
    strengths: ["Critério político", "Mediacao de tensão", "Construcao de confiança"],
    risks: ["Evitar confronto necessário", "Suavizar demais pedidos importantes", "Assumir custo emocional que não é seu"],
    evolutionPoint: "Transformar sensibilidade em posicionamento claro, sem perder elegancia.",
    avoidPhrases: ["Desculpa incomodar.", "Não sei se faz sentido.", "Talvez eu esteja exagerando."],
    startUsingPhrases: [
      "Quero trazer esse ponto com cuidado e clareza.",
      "Vejo uma tensão aqui que vale enderecarmos diretamente.",
      "Para preservar a relação e o resultado, precisamos alinhar expectativas."
    ],
    recommendedPractices: ["Nomear fatos antes de sentimentos", "Preparar limites por escrito", "Usar perguntas que conduzem decisão"],
    recommendedReadings: ["Comunicação não violenta no trabalho", "Negociação em contextos sensíveis", "Critério político corporativa"],
    recommendedTrainings: ["Treino de conversas difíceis", "Treino de limites com elegancia", "Treino de feedback assertivo"],
    firstScriptSuggestions: ["Feedback difícil", "Definir limites", "Responder feedback injusto"],
    perceivedByOthers:
      "Você costuma ser percebida como alguém confiável, sensível ao ambiente e capaz de reduzir tensões. Quando explícita sua posição, essa qualidade deixa de ser apenas apoio e passa a ser autoridade relacional.",
    pressurePattern:
      "Sob pressão, você tende a proteger a relação antes de proteger sua posição. Isso evita rupturas, mas pode deslocar sua necessidade para segundo plano.",
    executiveSabotage:
      "Você pode se sabotar quando espera o momento perfeito para se posicionar. Em ambientes executivos, a ausência de posição também comunica uma posição.",
    corporateExpectation:
      "Sua próxima versão precisa sustentar conversas sensíveis sem reduzir a própria clareza. O corporativo espera cuidado, mas também direção.",
    presenceMicroAdjustments: [
      "Troque pedidos de desculpa por declarações de alinhamento.",
      "Nomeie o fato central antes de explicar sua preocupação.",
      "Prepare uma frase curta de limite antes de entrar em conversas sensíveis."
    ],
    internalScriptsToChange: [
      { from: "Não quero gerar desconforto.", to: "Posso conduzir desconforto com respeito e clareza." },
      { from: "Talvez eu esteja exagerando.", to: "Se esse ponto afeta o resultado, ele merece ser nomeado." },
      { from: "Preciso preservar a relação.", to: "Preservar a relação também exige expectativa clara." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: substitua desculpas por frases de abertura objetivas.",
      "Semana 2: pratique nomear fatos sem suavizar demais o impacto.",
      "Semana 3: escolha uma conversa pendente e defina limite, pedido e consequência prática.",
      "Semana 4: revise onde você assumiu custo emocional e redesenhe o acordo."
    ]
  },
  analytical_advisor: {
    id: "analytical_advisor",
    name: "Analítica Criteriosa",
    shortDescription: "Você tende a construir autoridade com preparo, dados e pensamento estruturado.",
    executiveReading:
      "Sua presença se apoia em consistência. Você busca premissas, riscos e evidências antes de recomendar um caminho.",
    communicationPattern:
      "Comunicação estruturada, precisa e criteriosa. Funciona melhor quando não se perde em excesso de detalhe.",
    strengths: ["Rigor analítico", "Credibilidade técnica", "Antecipacao de riscos"],
    risks: ["Demorar a se posicionar", "Explicar demais", "Parecer distante em conversas emocionais"],
    evolutionPoint: "Converter análise em recomendação clara e acionável.",
    avoidPhrases: ["Ainda preciso analisar mais.", "Depende de muitas variáveis.", "Não tenho certeza suficiente."],
    startUsingPhrases: [
      "Com os dados disponíveis, minha recomendação e está.",
      "O principal risco é este; o plano de mitigação seria aquele.",
      "Há tres critérios relevantes para decidir com seguranca."
    ],
    recommendedPractices: ["Fechar analises com recomendação", "Preparar resumo executivo em tres pontos", "Separar detalhe técnico de mensagem central"],
    recommendedReadings: ["Pensamento estruturado para liderança", "Tomada de decisão baseada em dados", "Comunicação executiva para especialistas"],
    recommendedTrainings: ["Treino de síntese executiva", "Treino de recomendação objetiva", "Treino de defesa de análise"],
    firstScriptSuggestions: ["Discordar do lider", "Reunião importante", "Negociação salarial"],
    perceivedByOthers:
      "Você tende a ser percebida como uma pessoa confiável, preparada e tecnicamente consistente. Quando transforma critério em recomendação, sua autoridade deixa de depender apenas do detalhe.",
    pressurePattern:
      "Sob pressão, você pode buscar mais informação para se sentir segura. Esse movimento protege a qualidade, mas pode reduzir sua velocidade de influência.",
    executiveSabotage:
      "A sabotagem aparece quando você confunde rigor com permissão para se posicionar. No ambiente executivo, uma recomendação bem delimitada vale mais que uma explicação completa.",
    corporateExpectation:
      "Sua próxima versão precisa assumir recomendações com os dados disponíveis. O corporativo espera critério, mas também direção.",
    presenceMicroAdjustments: [
      "Abra pela conclusão e deixe o detalhe como suporte.",
      "Use tres critérios para sustentar sua recomendação.",
      "Troque excesso de ressalvas por nível de confiança e próximo passo."
    ],
    internalScriptsToChange: [
      { from: "Preciso ter certeza antes de se posicionar.", to: "Posso recomendar com clareza dentro do nível de informação disponível." },
      { from: "Se eu explicar tudo, vao entender.", to: "Se eu sintetizar bem, vao decidir melhor." },
      { from: "Ainda falta analisar.", to: "Ja existe base suficiente para propor um caminho." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: escreva suas recomendações no formato conclusão, critério e risco.",
      "Semana 2: reduza uma explicação técnica a tres pontos executivos.",
      "Semana 3: apresente uma recomendação antes de mostrar todos os detalhes.",
      "Semana 4: pratique responder objecoes com critério, não com excesso de informação."
    ]
  },
  leader_mobilizer: {
    id: "leader_mobilizer",
    name: "Lider Mobilizadora",
    shortDescription: "Você combina firmeza de direção com capacidade de engajar pessoas.",
    executiveReading:
      "Seu padrao sugere presença de liderança em movimento: você tende a propor caminho e criar energia para que outras pessoas avancem junto.",
    communicationPattern:
      "Comunicação assertiva e inspiradora, com bom potencial para conduzir grupos. Precisa equilibrar velocidade com escuta.",
    strengths: ["Mobilizacao de times", "Clareza de encaminhamento", "Energia para transformar ideia em ação"],
    risks: ["Atropelar nuances", "Confundir entusiasmo com alinhamento real", "Assumir protagonismo demais"],
    evolutionPoint: "Aumentar escuta estratégica antes de mobilizar.",
    avoidPhrases: ["Vamos comigo que vai dar certo.", "Depois ajustamos.", "O importante é avançar."],
    startUsingPhrases: [
      "Minha proposta é avançarmos com clareza e alinhamento.",
      "Antes de mobilizar o time, quero validar riscos e responsabilidades.",
      "Se concordarmos com a direção, eu posso conduzir os próximos passos."
    ],
    recommendedPractices: ["Validar alinhamento antes da execucao", "Definir donos claros", "Checar resistências silenciosas"],
    recommendedReadings: ["Liderança influente", "Mobilizacao sem autoridade formal", "Comunicação de direção"],
    recommendedTrainings: ["Treino de reunião importante", "Treino de condução de decisão", "Treino de alinhamento executivo"],
    firstScriptSuggestions: ["Reunião importante", "Me posicionar em reunião", "Definir limites"],
    perceivedByOthers:
      "Você tende a ser percebida como alguém que cria movimento e assume a frente sem esperar permissão. Quando escuta antes de mobilizar, sua liderança ganha maturidade e adesão real.",
    pressurePattern:
      "Sob pressão, você pode acelerar a energia do grupo para sair da paralisia. O risco é interpretar movimento como alinhamento.",
    executiveSabotage:
      "Você pode se sabotar quando ocupa tanto espaço que reduz a participacao estratégica de outras pessoas. Liderança forte também sabe criar protagonismo ao redor.",
    corporateExpectation:
      "Sua próxima versão precisa mobilizar com mais critério sobre poder, resistência e timing. O corporativo espera direção com capacidade de construir coalizão.",
    presenceMicroAdjustments: [
      "Antes de propor ação, pergunte qual risco ainda não foi dito.",
      "Nomeie o objetivo comum antes de assumir a condução.",
      "Transforme energia em acordo explícito, não apenas entusiasmo."
    ],
    internalScriptsToChange: [
      { from: "Eu preciso puxar o time.", to: "Eu preciso criar condicoes para o time assumir junto." },
      { from: "Se todos parecem animados, estamos alinhados.", to: "Alinhamento exige responsabilidade clara, não so energia positiva." },
      { from: "Avancar e melhor que discutir.", to: "Avancar bem exige escutar resistências relevantes." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: inclua uma rodada curta de riscos antes de fechar uma decisão.",
      "Semana 2: delegue um próximo passo visivel em vez de concentrar a condução.",
      "Semana 3: valide alinhamento por responsabilidade, prazo e critério de sucesso.",
      "Semana 4: conduza uma reunião equilibrando direção, escuta e fechamento."
    ]
  },
  decision_strategist: {
    id: "decision_strategist",
    name: "Estrategista de Decisão",
    shortDescription: "Você combina firmeza com análise para sustentar decisões difíceis.",
    executiveReading:
      "Seu padrao indica uma presença orientada a decisão qualificada. Você tende a querer clareza, critérios e responsabilidade antes de avançar.",
    communicationPattern:
      "Comunicação objetiva e estruturada. Ganha impacto quando traduz análise em decisão sem excesso de justificativa.",
    strengths: ["Critério para decidir", "Firmeza com racional", "Capacidade de reduzir ambiguidade"],
    risks: ["Soar rigida", "Demorar quando busca seguranca total", "Subestimar fatores relacionais"],
    evolutionPoint: "Incluir critério político e timing na mesma qualidade da análise.",
    avoidPhrases: ["Os dados provam que este é o único caminho.", "Não faz sentido considerar outra opção.", "Eu já analisei isso."],
    startUsingPhrases: [
      "Minha recomendação considera impacto, risco e custo de reversão.",
      "Podemos decidir com seguranca se alinharmos estes critérios.",
      "Vejo esta rota como a mais consistente para o momento."
    ],
    recommendedPractices: ["Criar matriz simples de decisão", "Antecipar objecoes políticas", "Fechar recomendações com trade-offs"],
    recommendedReadings: ["Decisão executiva", "Gestao de riscos", "Comunicação de trade-offs"],
    recommendedTrainings: ["Treino de discordancia com liderança", "Treino de defesa de recomendação", "Treino de síntese para diretoria"],
    firstScriptSuggestions: ["Discordar do lider", "Reunião importante", "Feedback difícil"],
    perceivedByOthers:
      "Você tende a ser percebida como alguém segura, criteriosa e capaz de sustentar decisões complexas. Quando inclui percepção humana na decisão, sua firmeza parece estratégia, não rigidez.",
    pressurePattern:
      "Sob pressão, você busca reduzir ambiguidade por critério e controle de risco. Isso protege a decisão, mas pode deixar pouco espaço para percepcoes menos mensuráveis.",
    executiveSabotage:
      "O risco é usar análise como blindagem contra vulnerabilidade política. Nem toda resistência será vencida por lógica; algumas precisam de timing e articulação.",
    corporateExpectation:
      "Sua próxima versão precisa decidir considerando dados, pessoas e consequências. O corporativo espera recomendações que combinem rigor e navegação institucional.",
    presenceMicroAdjustments: [
      "Inclua impacto político junto ao impacto operacional.",
      "Apresente trade-offs sem transformar a conversa em defesa técnica.",
      "Use frases que convidem decisão, não apenas validem sua análise."
    ],
    internalScriptsToChange: [
      { from: "A melhor resposta está nos dados.", to: "A melhor decisão combina dados, contexto e adesão possível." },
      { from: "Se a lógica está certa, basta sustentar.", to: "Mesmo uma decisão correta precisa ser conduzida." },
      { from: "Não posso abrir margem para questionamento.", to: "Questionamentos bem conduzidos fortalecem a recomendação." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: acrescente mapeamento de stakeholders a uma recomendação importante.",
      "Semana 2: pratique apresentar uma decisão com dois trade-offs claros.",
      "Semana 3: antecipe uma objeção política e prepare resposta curta.",
      "Semana 4: conduza uma conversa em que você recomenda sem tentar provar demais."
    ]
  },
  diplomatic_articulator: {
    id: "diplomatic_articulator",
    name: "Articuladora Diplomatica",
    shortDescription: "Você combina influência com inteligencia relacional para criar alinhamento.",
    executiveReading:
      "Seu padrao sugere habilidade para circular entre interesses diferentes, ajustar mensagem e construir adesão sem confronto desnecessário.",
    communicationPattern:
      "Comunicação persuasiva, sensível e contextual. Precisa garantir que articulação não substitua posicionamento explícito.",
    strengths: ["Articulacao política", "Construcao de confiança", "Influência em conversas sensíveis"],
    risks: ["Evitar uma posição clara", "Priorizar harmonia sobre decisão", "Carregar expectativas de todos"],
    evolutionPoint: "Ser mais explícita sobre pedido, limite e recomendação.",
    avoidPhrases: ["Queria ver como todo mundo se sente.", "Talvez seja melhor não tensionar.", "Posso me adaptar ao que preferirem."],
    startUsingPhrases: [
      "Quero conciliar os interesses, mas também precisamos decidir.",
      "Vejo um caminho que preserva a relação e protege o resultado.",
      "Minha recomendação e está, considerando o contexto das partes envolvidas."
    ],
    recommendedPractices: ["Mapear stakeholders", "Definir pedido antes da conversa", "Separar conciliacao de concessao"],
    recommendedReadings: ["Influência política no trabalho", "Negociação diplomatica", "Comunicação em ambientes complexos"],
    recommendedTrainings: ["Treino de negociação sensível", "Treino de alinhamento com pares", "Treino de recuperação de credito"],
    firstScriptSuggestions: ["Roubaram minha ideia", "Feedback difícil", "Me posicionar em reunião"],
    perceivedByOthers:
      "Você tende a ser percebida como alguém habilidosa para ler interesses, criar pontes e reduzir atrito. Quando deixa sua recomendação explícita, sua diplomacia se torna poder de articulação.",
    pressurePattern:
      "Sob pressão, você pode tentar manter todos dentro da conversa antes de assumir uma direção. Isso preserva acesso, mas pode enfraquecer o fechamento.",
    executiveSabotage:
      "A sabotagem aparece quando você negocia antes de declarar o que realmente recomenda. A busca por harmonia pode esconder sua autoridade.",
    corporateExpectation:
      "Sua próxima versão precisa articular sem desaparecer. O corporativo espera alguém capaz de conciliar interesses e ainda assim conduzir uma decisão.",
    presenceMicroAdjustments: [
      "Declare sua recomendação antes de abrir concessoes.",
      "Diferencie preservar relação de evitar tensão.",
      "Entre em conversas sensíveis com pedido mínimo e limite claro."
    ],
    internalScriptsToChange: [
      { from: "Preciso manter todos confortaveis.", to: "Posso sustentar uma tensão produtiva sem romper confiança." },
      { from: "Melhor não me posicionar agora.", to: "Uma posição bem colocada organiza a conversa." },
      { from: "Eu me adapto ao que for melhor.", to: "Eu posso negociar sem apagar minha recomendação." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: antes de uma conversa, escreva sua recomendação em uma frase.",
      "Semana 2: pratique dizer o pedido antes de justificar o contexto.",
      "Semana 3: conduza uma tensão pequena sem suavizar sua posição.",
      "Semana 4: faça um mapa de interesses e defina onde você não vai ceder."
    ]
  },
  careful_counselor: {
    id: "careful_counselor",
    name: "Conselheira Criteriosa",
    shortDescription: "Você combina cuidado relacional com análise criteriosa.",
    executiveReading:
      "Seu padrao indica uma presença consultiva: você escuta, organiza nuances e tende a oferecer recomendações ponderadas.",
    communicationPattern:
      "Comunicação cuidadosa, fundamentada e confiável. Precisa evitar excesso de cautela quando a situação pede decisão.",
    strengths: ["Escuta qualificada", "Análise de contexto", "Direção confiável"],
    risks: ["Suavizar demais recomendações", "Demorar para se posicionar", "Assumir papel de apoio mesmo quando deveria liderar"],
    evolutionPoint: "Transformar ponderacao em autoridade visivel.",
    avoidPhrases: ["Posso estar errada, mas...", "So queria trazer um ponto.", "Talvez valha refletir depois."],
    startUsingPhrases: [
      "Minha avaliacao e cuidadosa, mas objetiva.",
      "Considerando fatos e contexto, recomendo este caminho.",
      "Vejo um risco relacional e um risco operacional que precisamos enderecar."
    ],
    recommendedPractices: ["Fechar toda análise com recomendação", "Nomear riscos sem pedir desculpas", "Praticar frases de autoridade calma"],
    recommendedReadings: ["Autoridade consultiva", "Comunicação criteriosa", "CNV em decisões corporativas"],
    recommendedTrainings: ["Treino de feedback difícil", "Treino de recomendação executiva", "Treino de limites cuidadosos"],
    firstScriptSuggestions: ["Feedback difícil", "Responder feedback injusto", "Discordar diplomaticamente"],
    perceivedByOthers:
      "Você tende a ser percebida como alguém confiável, ponderada e segura para temas delicados. Quando transforma cuidado em recomendação, sua presença deixa de ser bastidor e vira referência.",
    pressurePattern:
      "Sob pressão, você busca considerar variáveis e impactos antes de se posicionar. Isso protege a qualidade, mas pode atrasar sua entrada em conversas onde seu direcionamento é necessário.",
    executiveSabotage:
      "Você pode se sabotar quando se coloca como apoio mesmo tendo critério suficiente para liderar. Sua cautela precisa servir a decisão, não substituir sua voz.",
    corporateExpectation:
      "Sua próxima versão precisa mostrar autoridade calma. O corporativo espera que você preserve cuidado, mas assuma recomendações com mais visibilidade.",
    presenceMicroAdjustments: [
      "Use a palavra recomendo quando sua análise já sustenta um caminho.",
      "Nomeie riscos sem reduzir sua seguranca verbal.",
      "Troque cautela excessiva por clareza de condicoes."
    ],
    internalScriptsToChange: [
      { from: "Não quero parecer incisiva demais.", to: "Autoridade calma também pode ser direta." },
      { from: "Preciso pensar mais para não errar.", to: "Minha avaliacao já tem valor suficiente para orientar o próximo passo." },
      { from: "Sou melhor apoiando.", to: "Posso apoiar e liderar a qualidade da decisão." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: finalize cada análise com uma recomendação explícita.",
      "Semana 2: pratique nomear um risco sem usar desculpas ou diminuidores.",
      "Semana 3: assuma a condução de uma conversa em que você normalmente ficaria em apoio.",
      "Semana 4: revise onde sua cautela protegeu qualidade e onde reduziu visibilidade."
    ]
  },
  firmness_builder: {
    id: "firmness_builder",
    name: "Firmeza em Construcao",
    shortDescription: "Você equilibra intencao de se posicionar com cuidado para preservar relações.",
    executiveReading:
      "Seu padrao mostra potencial de firmeza, mas também uma preocupação relevante com impacto relacional. O desenvolvimento central e ocupar espaço sem pedir licença.",
    communicationPattern:
      "Comunicação cuidadosa com momentos de assertividade. Precisa reduzir justificativas e tornar limites mais explicitos.",
    strengths: ["Consciencia de impacto", "Desejo de se posicionar melhor", "Capacidade de ajustar tom"],
    risks: ["Retardar conversas necessarias", "Transformar firmeza em explicação longa", "Ceder para evitar desconforto"],
    evolutionPoint: "Praticar frases curtas, diretas e elegantes para sustentar limites.",
    avoidPhrases: ["Desculpa, mas...", "Não queria causar problema.", "Se não for incomodo."],
    startUsingPhrases: [
      "Preciso alinhar este ponto com clareza.",
      "Neste formato, não consigo assumir com qualidade.",
      "Quero preservar a relação, mas o limite precisa ficar explícito."
    ],
    recommendedPractices: ["Treinar frases de limite em voz alta", "Reduzir pedidos de desculpa", "Registrar combinados apos conversas sensíveis"],
    recommendedReadings: ["Assertividade elegante", "Limites no trabalho", "Presença executiva feminina"],
    recommendedTrainings: ["Treino de definição de limites", "Treino de interrupcao em reunião", "Treino de pedido objetivo"],
    firstScriptSuggestions: ["Definir limites", "Fui interrompida", "Negociação salarial"],
    perceivedByOthers:
      "Você pode ser percebida como cuidadosa, responsável e fácil de trabalhar. Quando não explícita limites, essa disponibilidade pode ser confundida com permissão para absorver mais do que deveria.",
    pressurePattern:
      "Sob pressão, você tende a justificar, suavizar ou esperar mais um pouco antes de sustentar um limite. O desconforto da conversa pode parecer maior que o custo de não se posicionar.",
    executiveSabotage:
      "A sabotagem está em pedir licença para ocupar um espaço que sua entrega já justifica. Excesso de explicação pode reduzir a força da sua mensagem.",
    corporateExpectation:
      "Sua próxima versão precisa transformar cuidado em presença. O corporativo espera que você sustente limites com clareza, sem perder elegancia.",
    presenceMicroAdjustments: [
      "Comece pelo limite, depois explique apenas o necessário.",
      "Substitua desculpas por critérios de qualidade e capacidade.",
      "Use frases curtas quando estiver em situações de pressão."
    ],
    internalScriptsToChange: [
      { from: "Não quero causar problema.", to: "Clareza evita problemas maiores depois." },
      { from: "Preciso justificar para aceitarem.", to: "Um limite bem colocado não precisa de excesso de defesa." },
      { from: "Se eu disser não, vou decepcionar.", to: "Dizer não com critério preserva qualidade e respeito." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: escolha tres frases de limite e pratique em voz alta.",
      "Semana 2: reduza uma justificativa longa para uma frase objetiva.",
      "Semana 3: use um limite real em uma conversa de baixo risco.",
      "Semana 4: registre um combinado por escrito apos uma conversa sensível."
    ]
  },
  analytical_influencer: {
    id: "analytical_influencer",
    name: "Influência Analítica",
    shortDescription: "Você combina capacidade de persuasao com raciocínio estruturado.",
    executiveReading:
      "Seu padrao sugere uma presença que convence melhor quando une narrativa e evidência. Você pode traduzir complexidade em mensagem com alto valor executivo.",
    communicationPattern:
      "Comunicação argumentativa, estruturada e persuasiva. Precisa cuidar para que a mensagem não fique longa ou excessivamente elaborada.",
    strengths: ["Argumentação forte", "Sintese de complexidade", "Credibilidade com capacidade de engajar"],
    risks: ["Sobrecarregar a audiencia", "Tentar convencer por excesso de informação", "Demorar a chegar ao pedido"],
    evolutionPoint: "Transformar análise em mensagem memorável e pedido claro.",
    avoidPhrases: ["Tenho vários pontos para explicar.", "Para contextualizar desde o começo...", "A análise é complexa."],
    startUsingPhrases: [
      "A mensagem central é simples.",
      "A evidência mais importante e está.",
      "Minha recomendação combina impacto, dados e adesão possível."
    ],
    recommendedPractices: ["Abrir apresentações pela conclusão", "Usar uma evidência principal", "Finalizar com pedido claro"],
    recommendedReadings: ["Storytelling com dados", "Comunicação executiva", "Influência baseada em evidências"],
    recommendedTrainings: ["Treino de pitch com dados", "Treino de síntese executiva", "Treino de reunião com liderança"],
    firstScriptSuggestions: ["Reunião importante", "Negociação salarial", "Me posicionar em reunião"],
    perceivedByOthers:
      "Você tende a ser percebida como alguém inteligente, preparada e capaz de construir argumentos consistentes. Quando simplifica a mensagem, sua influência fica mais executiva e menos dependente de explicação.",
    pressurePattern:
      "Sob pressão, você pode tentar convencer aumentando contexto, dados e justificativas. Isso fortalece o racional, mas pode diluir o pedido central.",
    executiveSabotage:
      "A sabotagem aparece quando você acredita que mais informação gera mais influência. Em conversas executivas, excesso de detalhe pode reduzir memorabilidade.",
    corporateExpectation:
      "Sua próxima versão precisa unir evidência e síntese. O corporativo espera que você traduza complexidade em decisão, não em uma explicação longa.",
    presenceMicroAdjustments: [
      "Abra pela conclusão antes de apresentar dados.",
      "Escolha uma evidência principal e deixe as demais como suporte.",
      "Finalize com uma pergunta de decisão ou pedido claro."
    ],
    internalScriptsToChange: [
      { from: "Preciso explicar tudo para convencer.", to: "Preciso destacar o que muda a decisão." },
      { from: "A complexidade justifica uma exposição longa.", to: "Minha autoridade aparece quando simplifico sem empobrecer." },
      { from: "Se trouxer mais dados, vao concordar.", to: "Dados precisam servir a uma tese clara." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: transforme uma análise em mensagem central de uma frase.",
      "Semana 2: apresente uma recomendação usando apenas uma evidência principal.",
      "Semana 3: pratique encerrar reuniões com pedido claro.",
      "Semana 4: revise uma apresentação e corte tudo que não sustenta a decisão."
    ]
  }
};
