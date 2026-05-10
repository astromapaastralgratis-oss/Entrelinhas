import type { ExecutivePresenceProfile, ExecutivePresenceProfileId } from "@/src/types/executivePresence";

export const executivePresenceProfiles: Record<ExecutivePresenceProfileId, ExecutivePresenceProfile> = {
  assertive_executor: {
    id: "assertive_executor",
    name: "Executora Assertiva",
    shortDescription: "Voce tende a avancar com clareza, decisao e senso de responsabilidade.",
    executiveReading:
      "Sua presenca cresce quando existe uma decisao em jogo. Voce identifica o ponto central, organiza prioridade e tende a assumir o encaminhamento com firmeza.",
    communicationPattern:
      "Comunicacao direta, objetiva e orientada a acao. Funciona bem quando ha urgencia, mas precisa de calibragem para nao soar dura em ambientes sensiveis.",
    strengths: ["Clareza de decisao", "Coragem para se posicionar", "Capacidade de destravar impasses"],
    risks: ["Acelerar antes de ler o contexto politico", "Ser percebida como inflexivel", "Reduzir espaco para contribuicoes do grupo"],
    evolutionPoint: "Aprender a combinar firmeza com leitura de ambiente antes de definir a rota.",
    avoidPhrases: ["Isso e obvio.", "Vamos decidir logo.", "Nao vejo por que discutir tanto."],
    startUsingPhrases: [
      "Minha recomendacao e esta, considerando impacto e prazo.",
      "Vejo dois caminhos possiveis e sugiro avancarmos com o mais seguro.",
      "Para destravar, proponho definirmos responsavel, prazo e criterio de sucesso."
    ],
    recommendedPractices: ["Preparar uma frase de abertura firme", "Mapear possiveis resistencias antes da reuniao", "Fechar conversas com combinados claros"],
    recommendedReadings: ["Comunicacao assertiva em ambientes executivos", "Tomada de decisao sob pressao", "Influencia sem agressividade"],
    recommendedTrainings: ["Treino de limites", "Treino de discordancia com lideranca", "Treino de negociacao objetiva"],
    firstScriptSuggestions: ["Definir limites", "Discordar do lider", "Negociacao salarial"],
    perceivedByOthers:
      "Voce costuma ser percebida como alguem que assume responsabilidade e tira assuntos do campo da indefinicao. Quando calibra escuta e ritmo, sua firmeza vira referencia de lideranca, nao apenas velocidade de execucao.",
    pressurePattern:
      "Sob pressao, voce tende a reduzir o problema ao essencial e buscar decisao rapida. Esse movimento e valioso, mas pode deixar sinais politicos e emocionais importantes fora da mesa.",
    executiveSabotage:
      "O risco e transformar competencia em controle. Quando voce decide rapido demais, pessoas podem concordar por conveniencia e nao por alinhamento real.",
    corporateExpectation:
      "Sua proxima versao precisa manter a firmeza, mas mostrar mais leitura de contexto. O corporativo espera que voce conduza decisoes dificeis com direcao, escuta e criterio de adesao.",
    presenceMicroAdjustments: [
      "Antes de defender uma rota, nomeie o criterio que sustenta sua recomendacao.",
      "Inclua uma pergunta de alinhamento antes de fechar a decisao.",
      "Troque urgencia por prioridade: isso preserva firmeza sem transmitir impaciencia."
    ],
    internalScriptsToChange: [
      { from: "Se eu nao conduzir, isso nao anda.", to: "Eu posso conduzir melhor quando crio alinhamento antes da execucao." },
      { from: "Preciso resolver rapido.", to: "Preciso decidir bem, com clareza de impacto e responsabilidade." },
      { from: "Escutar demais atrasa.", to: "Escuta estrategica evita retrabalho politico depois." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: pratique abrir reunioes com criterio, impacto e proposta em ate tres frases.",
      "Semana 2: antes de discordar, valide o objetivo comum e depois apresente sua recomendacao.",
      "Semana 3: conduza uma conversa dificil usando pergunta de alinhamento antes do fechamento.",
      "Semana 4: revise uma decisao recente e identifique onde faltou leitura politica, nao tecnica."
    ]
  },
  strategic_influencer: {
    id: "strategic_influencer",
    name: "Influenciadora Estrategica",
    shortDescription: "Voce tende a criar adesao conectando pessoas, narrativa e impacto.",
    executiveReading:
      "Sua presenca aparece quando precisa mobilizar atencao e transformar uma ideia em movimento. Voce le o publico e ajusta a mensagem para gerar tracao.",
    communicationPattern:
      "Comunicacao envolvente, contextual e persuasiva. Ganha forca quando apoiada por foco e criterios objetivos.",
    strengths: ["Construcao de narrativa", "Visibilidade positiva", "Capacidade de mobilizacao"],
    risks: ["Alongar demais a argumentacao", "Buscar adesao antes de definir posicao", "Depender excessivamente da reacao externa"],
    evolutionPoint: "Aumentar precisao e fechamento para que influencia se converta em decisao.",
    avoidPhrases: ["Acho que todo mundo vai gostar.", "Talvez possamos tentar.", "Queria so compartilhar uma ideia."],
    startUsingPhrases: [
      "A tese central e esta e o impacto esperado e claro.",
      "Para gerar adesao, sugiro conectarmos essa proposta ao objetivo do trimestre.",
      "Minha proposta e simples: alinhar mensagem, dono e proximo passo."
    ],
    recommendedPractices: ["Sintetizar argumentos em uma tese", "Fechar apresentacoes com pedido explicito", "Separar narrativa de evidencia"],
    recommendedReadings: ["Storytelling executivo", "Influencia corporativa", "Presenca em apresentacoes seniores"],
    recommendedTrainings: ["Treino de apresentacao executiva", "Treino de pitch interno", "Treino de influencia em reunioes"],
    firstScriptSuggestions: ["Me posicionar em reuniao", "Roubaram minha ideia", "Reuniao importante"],
    perceivedByOthers:
      "Voce tende a ser percebida como alguem que cria energia, aproxima pessoas e torna ideias mais desejaveis. Quando sustenta uma posicao clara, sua influencia ganha peso executivo.",
    pressurePattern:
      "Sob pressao, voce pode tentar recuperar controle pela narrativa e pela adesao do grupo. Isso ajuda a mobilizar, mas pode atrasar uma posicao mais objetiva.",
    executiveSabotage:
      "O ponto de sabotagem aparece quando voce suaviza o pedido para manter receptividade. O resultado pode ser uma boa percepcao social sem uma decisao concreta.",
    corporateExpectation:
      "Sua proxima versao precisa transformar presenca e narrativa em fechamento. O corporativo espera que voce influencie com clareza de tese, impacto e pedido.",
    presenceMicroAdjustments: [
      "Abra sua fala pela tese antes de contextualizar.",
      "Finalize toda apresentacao com pedido, dono e proximo passo.",
      "Use menos explicacao preparatoria e mais afirmacao de direcao."
    ],
    internalScriptsToChange: [
      { from: "Preciso fazer todos gostarem da ideia.", to: "Preciso deixar claro por que esta ideia importa e qual decisao ela pede." },
      { from: "Se eu for direta, posso perder adesao.", to: "Direcao clara aumenta confianca quando vem com criterio." },
      { from: "Ainda preciso vender melhor.", to: "Preciso pedir com mais precisao." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: transforme tres ideias importantes em teses de uma frase.",
      "Semana 2: treine encerrar reunioes com uma solicitacao explicita.",
      "Semana 3: reduza pela metade o contexto antes de apresentar uma recomendacao.",
      "Semana 4: escolha uma conversa de influencia e prepare mensagem, evidencia e pedido."
    ]
  },
  relational_diplomat: {
    id: "relational_diplomat",
    name: "Diplomatica Relacional",
    shortDescription: "Voce tende a preservar confianca, ler nuances e conduzir conversas sensiveis.",
    executiveReading:
      "Sua presenca e percebida na forma como reduz ruidos e cria espaco para alinhamentos dificeis. Voce entende relacoes, timing e contexto emocional.",
    communicationPattern:
      "Comunicacao cuidadosa, mediadora e empatica. Precisa cuidar para que diplomacia nao vire adiamento de posicionamento.",
    strengths: ["Leitura politica", "Mediacao de tensao", "Construcao de confianca"],
    risks: ["Evitar confronto necessario", "Suavizar demais pedidos importantes", "Assumir custo emocional que nao e seu"],
    evolutionPoint: "Transformar sensibilidade em posicionamento claro, sem perder elegancia.",
    avoidPhrases: ["Desculpa incomodar.", "Nao sei se faz sentido.", "Talvez eu esteja exagerando."],
    startUsingPhrases: [
      "Quero trazer esse ponto com cuidado e clareza.",
      "Vejo uma tensao aqui que vale enderecarmos diretamente.",
      "Para preservar a relacao e o resultado, precisamos alinhar expectativas."
    ],
    recommendedPractices: ["Nomear fatos antes de sentimentos", "Preparar limites por escrito", "Usar perguntas que conduzem decisao"],
    recommendedReadings: ["Comunicacao nao violenta no trabalho", "Negociacao em contextos sensiveis", "Leitura politica corporativa"],
    recommendedTrainings: ["Treino de conversas dificeis", "Treino de limites com elegancia", "Treino de feedback assertivo"],
    firstScriptSuggestions: ["Feedback dificil", "Definir limites", "Responder feedback injusto"],
    perceivedByOthers:
      "Voce costuma ser percebida como alguem confiavel, sensivel ao ambiente e capaz de reduzir tensoes. Quando explicita sua posicao, essa qualidade deixa de ser apenas apoio e passa a ser autoridade relacional.",
    pressurePattern:
      "Sob pressao, voce tende a proteger a relacao antes de proteger sua posicao. Isso evita rupturas, mas pode deslocar sua necessidade para segundo plano.",
    executiveSabotage:
      "Voce pode se sabotar quando espera o momento perfeito para falar. Em ambientes executivos, a ausencia de posicao tambem comunica uma posicao.",
    corporateExpectation:
      "Sua proxima versao precisa sustentar conversas sensiveis sem reduzir a propria clareza. O corporativo espera cuidado, mas tambem direcao.",
    presenceMicroAdjustments: [
      "Troque pedidos de desculpa por declaracoes de alinhamento.",
      "Nomeie o fato central antes de explicar sua preocupacao.",
      "Prepare uma frase curta de limite antes de entrar em conversas sensiveis."
    ],
    internalScriptsToChange: [
      { from: "Nao quero gerar desconforto.", to: "Posso conduzir desconforto com respeito e clareza." },
      { from: "Talvez eu esteja exagerando.", to: "Se esse ponto afeta o resultado, ele merece ser nomeado." },
      { from: "Preciso preservar a relacao.", to: "Preservar a relacao tambem exige expectativa clara." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: substitua desculpas por frases de abertura objetivas.",
      "Semana 2: pratique nomear fatos sem suavizar demais o impacto.",
      "Semana 3: escolha uma conversa pendente e defina limite, pedido e consequencia pratica.",
      "Semana 4: revise onde voce assumiu custo emocional e redesenhe o acordo."
    ]
  },
  analytical_advisor: {
    id: "analytical_advisor",
    name: "Analitica Criteriosa",
    shortDescription: "Voce tende a construir autoridade com preparo, dados e pensamento estruturado.",
    executiveReading:
      "Sua presenca se apoia em consistencia. Voce busca premissas, riscos e evidencias antes de recomendar um caminho.",
    communicationPattern:
      "Comunicacao estruturada, precisa e criteriosa. Funciona melhor quando nao se perde em excesso de detalhe.",
    strengths: ["Rigor analitico", "Credibilidade tecnica", "Antecipacao de riscos"],
    risks: ["Demorar a se posicionar", "Explicar demais", "Parecer distante em conversas emocionais"],
    evolutionPoint: "Converter analise em recomendacao clara e acionavel.",
    avoidPhrases: ["Ainda preciso analisar mais.", "Depende de muitas variaveis.", "Nao tenho certeza suficiente."],
    startUsingPhrases: [
      "Com os dados disponiveis, minha recomendacao e esta.",
      "O principal risco e este; o plano de mitigacao seria aquele.",
      "Ha tres criterios relevantes para decidir com seguranca."
    ],
    recommendedPractices: ["Fechar analises com recomendacao", "Preparar resumo executivo em tres pontos", "Separar detalhe tecnico de mensagem central"],
    recommendedReadings: ["Pensamento estruturado para lideranca", "Tomada de decisao baseada em dados", "Comunicacao executiva para especialistas"],
    recommendedTrainings: ["Treino de sintese executiva", "Treino de recomendacao objetiva", "Treino de defesa de analise"],
    firstScriptSuggestions: ["Discordar do lider", "Reuniao importante", "Negociacao salarial"],
    perceivedByOthers:
      "Voce tende a ser percebida como uma pessoa confiavel, preparada e tecnicamente consistente. Quando transforma criterio em recomendacao, sua autoridade deixa de depender apenas do detalhe.",
    pressurePattern:
      "Sob pressao, voce pode buscar mais informacao para se sentir segura. Esse movimento protege a qualidade, mas pode reduzir sua velocidade de influencia.",
    executiveSabotage:
      "A sabotagem aparece quando voce confunde rigor com permissao para falar. No ambiente executivo, uma recomendacao bem delimitada vale mais que uma explicacao completa.",
    corporateExpectation:
      "Sua proxima versao precisa assumir recomendacoes com os dados disponiveis. O corporativo espera criterio, mas tambem direcao.",
    presenceMicroAdjustments: [
      "Abra pela conclusao e deixe o detalhe como suporte.",
      "Use tres criterios para sustentar sua recomendacao.",
      "Troque excesso de ressalvas por nivel de confianca e proximo passo."
    ],
    internalScriptsToChange: [
      { from: "Preciso ter certeza antes de falar.", to: "Posso recomendar com clareza dentro do nivel de informacao disponivel." },
      { from: "Se eu explicar tudo, vao entender.", to: "Se eu sintetizar bem, vao decidir melhor." },
      { from: "Ainda falta analisar.", to: "Ja existe base suficiente para propor um caminho." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: escreva suas recomendacoes no formato conclusao, criterio e risco.",
      "Semana 2: reduza uma explicacao tecnica a tres pontos executivos.",
      "Semana 3: apresente uma recomendacao antes de mostrar todos os detalhes.",
      "Semana 4: pratique responder objecoes com criterio, nao com excesso de informacao."
    ]
  },
  leader_mobilizer: {
    id: "leader_mobilizer",
    name: "Lider Mobilizadora",
    shortDescription: "Voce combina firmeza de direcao com capacidade de engajar pessoas.",
    executiveReading:
      "Seu padrao sugere presenca de lideranca em movimento: voce tende a propor caminho e criar energia para que outras pessoas avancem junto.",
    communicationPattern:
      "Comunicacao assertiva e inspiradora, com bom potencial para conduzir grupos. Precisa equilibrar velocidade com escuta.",
    strengths: ["Mobilizacao de times", "Clareza de encaminhamento", "Energia para transformar ideia em acao"],
    risks: ["Atropelar nuances", "Confundir entusiasmo com alinhamento real", "Assumir protagonismo demais"],
    evolutionPoint: "Aumentar escuta estrategica antes de mobilizar.",
    avoidPhrases: ["Vamos comigo que vai dar certo.", "Depois ajustamos.", "O importante e avancar."],
    startUsingPhrases: [
      "Minha proposta e avancarmos com clareza e alinhamento.",
      "Antes de mobilizar o time, quero validar riscos e responsabilidades.",
      "Se concordarmos com a direcao, eu posso conduzir os proximos passos."
    ],
    recommendedPractices: ["Validar alinhamento antes da execucao", "Definir donos claros", "Checar resistencias silenciosas"],
    recommendedReadings: ["Lideranca influente", "Mobilizacao sem autoridade formal", "Comunicacao de direcao"],
    recommendedTrainings: ["Treino de reuniao importante", "Treino de conducao de decisao", "Treino de alinhamento executivo"],
    firstScriptSuggestions: ["Reuniao importante", "Me posicionar em reuniao", "Definir limites"],
    perceivedByOthers:
      "Voce tende a ser percebida como alguem que cria movimento e assume a frente sem esperar permissao. Quando escuta antes de mobilizar, sua lideranca ganha maturidade e adesao real.",
    pressurePattern:
      "Sob pressao, voce pode acelerar a energia do grupo para sair da paralisia. O risco e interpretar movimento como alinhamento.",
    executiveSabotage:
      "Voce pode se sabotar quando ocupa tanto espaco que reduz a participacao estrategica de outras pessoas. Lideranca forte tambem sabe criar protagonismo ao redor.",
    corporateExpectation:
      "Sua proxima versao precisa mobilizar com mais leitura de poder, resistencia e timing. O corporativo espera direcao com capacidade de construir coalizao.",
    presenceMicroAdjustments: [
      "Antes de propor acao, pergunte qual risco ainda nao foi dito.",
      "Nomeie o objetivo comum antes de assumir a conducao.",
      "Transforme energia em acordo explicito, nao apenas entusiasmo."
    ],
    internalScriptsToChange: [
      { from: "Eu preciso puxar o time.", to: "Eu preciso criar condicoes para o time assumir junto." },
      { from: "Se todos parecem animados, estamos alinhados.", to: "Alinhamento exige responsabilidade clara, nao so energia positiva." },
      { from: "Avancar e melhor que discutir.", to: "Avancar bem exige escutar resistencias relevantes." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: inclua uma rodada curta de riscos antes de fechar uma decisao.",
      "Semana 2: delegue um proximo passo visivel em vez de concentrar a conducao.",
      "Semana 3: valide alinhamento por responsabilidade, prazo e criterio de sucesso.",
      "Semana 4: conduza uma reuniao equilibrando direcao, escuta e fechamento."
    ]
  },
  decision_strategist: {
    id: "decision_strategist",
    name: "Estrategista de Decisao",
    shortDescription: "Voce combina firmeza com analise para sustentar decisoes dificeis.",
    executiveReading:
      "Seu padrao indica uma presenca orientada a decisao qualificada. Voce tende a querer clareza, criterios e responsabilidade antes de avancar.",
    communicationPattern:
      "Comunicacao objetiva e estruturada. Ganha impacto quando traduz analise em decisao sem excesso de justificativa.",
    strengths: ["Criterio para decidir", "Firmeza com racional", "Capacidade de reduzir ambiguidade"],
    risks: ["Soar rigida", "Demorar quando busca seguranca total", "Subestimar fatores relacionais"],
    evolutionPoint: "Incluir leitura politica e timing na mesma qualidade da analise.",
    avoidPhrases: ["Os dados provam que este e o unico caminho.", "Nao faz sentido considerar outra opcao.", "Eu ja analisei isso."],
    startUsingPhrases: [
      "Minha recomendacao considera impacto, risco e custo de reversao.",
      "Podemos decidir com seguranca se alinharmos estes criterios.",
      "Vejo esta rota como a mais consistente para o momento."
    ],
    recommendedPractices: ["Criar matriz simples de decisao", "Antecipar objecoes politicas", "Fechar recomendacoes com trade-offs"],
    recommendedReadings: ["Decisao executiva", "Gestao de riscos", "Comunicacao de trade-offs"],
    recommendedTrainings: ["Treino de discordancia com lideranca", "Treino de defesa de recomendacao", "Treino de sintese para diretoria"],
    firstScriptSuggestions: ["Discordar do lider", "Reuniao importante", "Feedback dificil"],
    perceivedByOthers:
      "Voce tende a ser percebida como alguem segura, criteriosa e capaz de sustentar decisoes complexas. Quando inclui leitura humana na decisao, sua firmeza parece estrategia, nao rigidez.",
    pressurePattern:
      "Sob pressao, voce busca reduzir ambiguidade por criterio e controle de risco. Isso protege a decisao, mas pode deixar pouco espaco para percepcoes menos mensuraveis.",
    executiveSabotage:
      "O risco e usar analise como blindagem contra vulnerabilidade politica. Nem toda resistencia sera vencida por logica; algumas precisam de timing e articulacao.",
    corporateExpectation:
      "Sua proxima versao precisa decidir considerando dados, pessoas e consequencias. O corporativo espera recomendacoes que combinem rigor e navegacao institucional.",
    presenceMicroAdjustments: [
      "Inclua impacto politico junto ao impacto operacional.",
      "Apresente trade-offs sem transformar a conversa em defesa tecnica.",
      "Use frases que convidem decisao, nao apenas validem sua analise."
    ],
    internalScriptsToChange: [
      { from: "A melhor resposta esta nos dados.", to: "A melhor decisao combina dados, contexto e adesao possivel." },
      { from: "Se a logica esta certa, basta sustentar.", to: "Mesmo uma decisao correta precisa ser conduzida." },
      { from: "Nao posso abrir margem para questionamento.", to: "Questionamentos bem conduzidos fortalecem a recomendacao." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: acrescente leitura de stakeholders a uma recomendacao importante.",
      "Semana 2: pratique apresentar uma decisao com dois trade-offs claros.",
      "Semana 3: antecipe uma objecao politica e prepare resposta curta.",
      "Semana 4: conduza uma conversa em que voce recomenda sem tentar provar demais."
    ]
  },
  diplomatic_articulator: {
    id: "diplomatic_articulator",
    name: "Articuladora Diplomatica",
    shortDescription: "Voce combina influencia com leitura relacional para criar alinhamento.",
    executiveReading:
      "Seu padrao sugere habilidade para circular entre interesses diferentes, ajustar mensagem e construir adesao sem confronto desnecessario.",
    communicationPattern:
      "Comunicacao persuasiva, sensivel e contextual. Precisa garantir que articulacao nao substitua posicionamento explicito.",
    strengths: ["Articulacao politica", "Construcao de confianca", "Influencia em conversas sensiveis"],
    risks: ["Evitar uma posicao clara", "Priorizar harmonia sobre decisao", "Carregar expectativas de todos"],
    evolutionPoint: "Ser mais explicita sobre pedido, limite e recomendacao.",
    avoidPhrases: ["Queria ver como todo mundo se sente.", "Talvez seja melhor nao tensionar.", "Posso me adaptar ao que preferirem."],
    startUsingPhrases: [
      "Quero conciliar os interesses, mas tambem precisamos decidir.",
      "Vejo um caminho que preserva a relacao e protege o resultado.",
      "Minha recomendacao e esta, considerando o contexto das partes envolvidas."
    ],
    recommendedPractices: ["Mapear stakeholders", "Definir pedido antes da conversa", "Separar conciliacao de concessao"],
    recommendedReadings: ["Influencia politica no trabalho", "Negociacao diplomatica", "Comunicacao em ambientes complexos"],
    recommendedTrainings: ["Treino de negociacao sensivel", "Treino de alinhamento com pares", "Treino de recuperacao de credito"],
    firstScriptSuggestions: ["Roubaram minha ideia", "Feedback dificil", "Me posicionar em reuniao"],
    perceivedByOthers:
      "Voce tende a ser percebida como alguem habilidosa para ler interesses, criar pontes e reduzir atrito. Quando deixa sua recomendacao explicita, sua diplomacia se torna poder de articulacao.",
    pressurePattern:
      "Sob pressao, voce pode tentar manter todos dentro da conversa antes de assumir uma direcao. Isso preserva acesso, mas pode enfraquecer o fechamento.",
    executiveSabotage:
      "A sabotagem aparece quando voce negocia antes de declarar o que realmente recomenda. A busca por harmonia pode esconder sua autoridade.",
    corporateExpectation:
      "Sua proxima versao precisa articular sem desaparecer. O corporativo espera alguem capaz de conciliar interesses e ainda assim conduzir uma decisao.",
    presenceMicroAdjustments: [
      "Declare sua recomendacao antes de abrir concessoes.",
      "Diferencie preservar relacao de evitar tensao.",
      "Entre em conversas sensiveis com pedido minimo e limite claro."
    ],
    internalScriptsToChange: [
      { from: "Preciso manter todos confortaveis.", to: "Posso sustentar uma tensao produtiva sem romper confianca." },
      { from: "Melhor nao me posicionar agora.", to: "Uma posicao bem colocada organiza a conversa." },
      { from: "Eu me adapto ao que for melhor.", to: "Eu posso negociar sem apagar minha recomendacao." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: antes de uma conversa, escreva sua recomendacao em uma frase.",
      "Semana 2: pratique dizer o pedido antes de justificar o contexto.",
      "Semana 3: conduza uma tensao pequena sem suavizar sua posicao.",
      "Semana 4: faca um mapa de interesses e defina onde voce nao vai ceder."
    ]
  },
  careful_counselor: {
    id: "careful_counselor",
    name: "Conselheira Criteriosa",
    shortDescription: "Voce combina cuidado relacional com analise criteriosa.",
    executiveReading:
      "Seu padrao indica uma presenca consultiva: voce escuta, organiza nuances e tende a oferecer recomendacoes ponderadas.",
    communicationPattern:
      "Comunicacao cuidadosa, fundamentada e confiavel. Precisa evitar excesso de cautela quando a situacao pede decisao.",
    strengths: ["Escuta qualificada", "Analise de contexto", "Conselho confiavel"],
    risks: ["Suavizar demais recomendacoes", "Demorar para se posicionar", "Assumir papel de apoio mesmo quando deveria liderar"],
    evolutionPoint: "Transformar ponderacao em autoridade visivel.",
    avoidPhrases: ["Posso estar errada, mas...", "So queria trazer um ponto.", "Talvez valha refletir depois."],
    startUsingPhrases: [
      "Minha leitura e cuidadosa, mas objetiva.",
      "Considerando fatos e contexto, recomendo este caminho.",
      "Vejo um risco relacional e um risco operacional que precisamos enderecar."
    ],
    recommendedPractices: ["Fechar toda analise com recomendacao", "Nomear riscos sem pedir desculpas", "Praticar frases de autoridade calma"],
    recommendedReadings: ["Autoridade consultiva", "Comunicacao criteriosa", "CNV em decisoes corporativas"],
    recommendedTrainings: ["Treino de feedback dificil", "Treino de recomendacao executiva", "Treino de limites cuidadosos"],
    firstScriptSuggestions: ["Feedback dificil", "Responder feedback injusto", "Discordar diplomaticamente"],
    perceivedByOthers:
      "Voce tende a ser percebida como alguem confiavel, ponderada e segura para temas delicados. Quando transforma cuidado em recomendacao, sua presenca deixa de ser bastidor e vira referencia.",
    pressurePattern:
      "Sob pressao, voce busca considerar variaveis e impactos antes de falar. Isso protege a qualidade, mas pode atrasar sua entrada em conversas onde sua leitura e necessaria.",
    executiveSabotage:
      "Voce pode se sabotar quando se coloca como apoio mesmo tendo leitura suficiente para liderar. Sua cautela precisa servir a decisao, nao substituir sua voz.",
    corporateExpectation:
      "Sua proxima versao precisa mostrar autoridade calma. O corporativo espera que voce preserve cuidado, mas assuma recomendacoes com mais visibilidade.",
    presenceMicroAdjustments: [
      "Use a palavra recomendo quando sua analise ja sustenta um caminho.",
      "Nomeie riscos sem reduzir sua seguranca verbal.",
      "Troque cautela excessiva por clareza de condicoes."
    ],
    internalScriptsToChange: [
      { from: "Nao quero parecer incisiva demais.", to: "Autoridade calma tambem pode ser direta." },
      { from: "Preciso pensar mais para nao errar.", to: "Minha leitura ja tem valor suficiente para orientar o proximo passo." },
      { from: "Sou melhor apoiando.", to: "Posso apoiar e liderar a qualidade da decisao." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: finalize cada analise com uma recomendacao explicita.",
      "Semana 2: pratique nomear um risco sem usar desculpas ou diminuidores.",
      "Semana 3: assuma a conducao de uma conversa em que voce normalmente ficaria em apoio.",
      "Semana 4: revise onde sua cautela protegeu qualidade e onde reduziu visibilidade."
    ]
  },
  firmness_builder: {
    id: "firmness_builder",
    name: "Firmeza em Construcao",
    shortDescription: "Voce equilibra intencao de se posicionar com cuidado para preservar relacoes.",
    executiveReading:
      "Seu padrao mostra potencial de firmeza, mas tambem uma preocupacao relevante com impacto relacional. O desenvolvimento central e ocupar espaco sem pedir licenca.",
    communicationPattern:
      "Comunicacao cuidadosa com momentos de assertividade. Precisa reduzir justificativas e tornar limites mais explicitos.",
    strengths: ["Consciencia de impacto", "Desejo de se posicionar melhor", "Capacidade de ajustar tom"],
    risks: ["Retardar conversas necessarias", "Transformar firmeza em explicacao longa", "Ceder para evitar desconforto"],
    evolutionPoint: "Praticar frases curtas, diretas e elegantes para sustentar limites.",
    avoidPhrases: ["Desculpa, mas...", "Nao queria causar problema.", "Se nao for incomodo."],
    startUsingPhrases: [
      "Preciso alinhar este ponto com clareza.",
      "Neste formato, nao consigo assumir com qualidade.",
      "Quero preservar a relacao, mas o limite precisa ficar explicito."
    ],
    recommendedPractices: ["Treinar frases de limite em voz alta", "Reduzir pedidos de desculpa", "Registrar combinados apos conversas sensiveis"],
    recommendedReadings: ["Assertividade elegante", "Limites no trabalho", "Presenca executiva feminina"],
    recommendedTrainings: ["Treino de definicao de limites", "Treino de interrupcao em reuniao", "Treino de pedido objetivo"],
    firstScriptSuggestions: ["Definir limites", "Fui interrompida", "Negociacao salarial"],
    perceivedByOthers:
      "Voce pode ser percebida como cuidadosa, responsavel e facil de trabalhar. Quando nao explicita limites, essa disponibilidade pode ser confundida com permissao para absorver mais do que deveria.",
    pressurePattern:
      "Sob pressao, voce tende a justificar, suavizar ou esperar mais um pouco antes de sustentar um limite. O desconforto da conversa pode parecer maior que o custo de nao falar.",
    executiveSabotage:
      "A sabotagem esta em pedir licenca para ocupar um espaco que sua entrega ja justifica. Excesso de explicacao pode reduzir a forca da sua mensagem.",
    corporateExpectation:
      "Sua proxima versao precisa transformar cuidado em presenca. O corporativo espera que voce sustente limites com clareza, sem perder elegancia.",
    presenceMicroAdjustments: [
      "Comece pelo limite, depois explique apenas o necessario.",
      "Substitua desculpas por criterios de qualidade e capacidade.",
      "Use frases curtas quando estiver em situacoes de pressao."
    ],
    internalScriptsToChange: [
      { from: "Nao quero causar problema.", to: "Clareza evita problemas maiores depois." },
      { from: "Preciso justificar para aceitarem.", to: "Um limite bem colocado nao precisa de excesso de defesa." },
      { from: "Se eu disser nao, vou decepcionar.", to: "Dizer nao com criterio preserva qualidade e respeito." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: escolha tres frases de limite e pratique em voz alta.",
      "Semana 2: reduza uma justificativa longa para uma frase objetiva.",
      "Semana 3: use um limite real em uma conversa de baixo risco.",
      "Semana 4: registre um combinado por escrito apos uma conversa sensivel."
    ]
  },
  analytical_influencer: {
    id: "analytical_influencer",
    name: "Influencia Analitica",
    shortDescription: "Voce combina capacidade de persuasao com raciocinio estruturado.",
    executiveReading:
      "Seu padrao sugere uma presenca que convence melhor quando une narrativa e evidencia. Voce pode traduzir complexidade em mensagem com alto valor executivo.",
    communicationPattern:
      "Comunicacao argumentativa, estruturada e persuasiva. Precisa cuidar para que a mensagem nao fique longa ou excessivamente elaborada.",
    strengths: ["Argumentacao forte", "Sintese de complexidade", "Credibilidade com capacidade de engajar"],
    risks: ["Sobrecarregar a audiencia", "Tentar convencer por excesso de informacao", "Demorar a chegar ao pedido"],
    evolutionPoint: "Transformar analise em mensagem memoravel e pedido claro.",
    avoidPhrases: ["Tenho varios pontos para explicar.", "Para contextualizar desde o comeco...", "A analise e complexa."],
    startUsingPhrases: [
      "A mensagem central e simples.",
      "A evidencia mais importante e esta.",
      "Minha recomendacao combina impacto, dados e adesao possivel."
    ],
    recommendedPractices: ["Abrir apresentacoes pela conclusao", "Usar uma evidencia principal", "Finalizar com pedido claro"],
    recommendedReadings: ["Storytelling com dados", "Comunicacao executiva", "Influencia baseada em evidencias"],
    recommendedTrainings: ["Treino de pitch com dados", "Treino de sintese executiva", "Treino de reuniao com lideranca"],
    firstScriptSuggestions: ["Reuniao importante", "Negociacao salarial", "Me posicionar em reuniao"],
    perceivedByOthers:
      "Voce tende a ser percebida como alguem inteligente, preparada e capaz de construir argumentos consistentes. Quando simplifica a mensagem, sua influencia fica mais executiva e menos dependente de explicacao.",
    pressurePattern:
      "Sob pressao, voce pode tentar convencer aumentando contexto, dados e justificativas. Isso fortalece o racional, mas pode diluir o pedido central.",
    executiveSabotage:
      "A sabotagem aparece quando voce acredita que mais informacao gera mais influencia. Em conversas executivas, excesso de detalhe pode reduzir memorabilidade.",
    corporateExpectation:
      "Sua proxima versao precisa unir evidencia e sintese. O corporativo espera que voce traduza complexidade em decisao, nao em uma explicacao longa.",
    presenceMicroAdjustments: [
      "Abra pela conclusao antes de apresentar dados.",
      "Escolha uma evidencia principal e deixe as demais como suporte.",
      "Finalize com uma pergunta de decisao ou pedido claro."
    ],
    internalScriptsToChange: [
      { from: "Preciso explicar tudo para convencer.", to: "Preciso destacar o que muda a decisao." },
      { from: "A complexidade justifica uma fala longa.", to: "Minha autoridade aparece quando simplifico sem empobrecer." },
      { from: "Se trouxer mais dados, vao concordar.", to: "Dados precisam servir a uma tese clara." }
    ],
    thirtyDayEvolutionPlan: [
      "Semana 1: transforme uma analise em mensagem central de uma frase.",
      "Semana 2: apresente uma recomendacao usando apenas uma evidencia principal.",
      "Semana 3: pratique encerrar reunioes com pedido claro.",
      "Semana 4: revise uma apresentacao e corte tudo que nao sustenta a decisao."
    ]
  }
};
