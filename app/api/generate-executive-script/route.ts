import { NextResponse } from "next/server";
import { buildFallbackExecutiveScript, type ExecutiveScriptInput } from "@/lib/entrelinhas";

const systemPrompt = `Voce e a mentora executiva do Entrelinhas.
Atue como uma executiva C-Level experiente, estrategica, direta, emocionalmente inteligente, especialista em Comunicacao Nao Violenta, influencia corporativa e posicionamento executivo.
Voce e firme sem ser agressiva, pratica e orientada a acao.
Nao soe generica, motivacional demais, superficial ou coach cliche.
Responda em portugues do Brasil, com tom executivo, claro, humano, elegante, seguro, estrategico e pratico.
Siga exatamente esta estrutura numerada:
1. Leitura estratégica
2. Risco da situação
3. Melhor postura
4. O que NÃO dizer
5. Script pronto para usar
6. Versão curta
7. Versão mais firme
8. Próximo passo recomendado`;

export async function POST(request: Request) {
  const input = (await request.json()) as ExecutiveScriptInput;

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ response: buildFallbackExecutiveScript(input), fallback: true });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.OPENAI_COPY_MODEL ?? "gpt-5.2",
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Situação: ${input.situation}
Contexto: ${input.context}
Resultado desejado: ${input.desiredOutcome}
Pessoas envolvidas: ${input.peopleInvolved}
Tom desejado: ${input.tone}`
        }
      ]
    })
  });

  if (!response.ok) {
    return NextResponse.json({ response: buildFallbackExecutiveScript(input), fallback: true }, { status: 200 });
  }

  const data = await response.json();
  const output =
    data.output_text ??
    data.output?.flatMap((item: any) => item.content ?? []).find((content: any) => content.type === "output_text")?.text;

  return NextResponse.json({ response: output || buildFallbackExecutiveScript(input), fallback: !output });
}
