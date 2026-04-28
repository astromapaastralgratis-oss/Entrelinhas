import { defaultCopyModel } from "@/lib/cost-control";
import type { CompactGenerateCopyRequest, GeneratedCopy, TextProvider } from "@/types/copy";

export type TextGenerationOutput = {
  provider: TextProvider;
  model: string;
  copy: GeneratedCopy;
};

const outputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "subtitle", "slides", "caption", "hashtags", "cta", "pinnedComment", "qualityNotes"],
  properties: {
    title: { type: "string" },
    subtitle: { type: "string" },
    slides: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["number", "title", "subtitle", "visualCue"],
        properties: {
          number: { type: "integer" },
          title: { type: "string" },
          subtitle: { type: "string" },
          visualCue: { type: "string" }
        }
      }
    },
    caption: { type: "string" },
    hashtags: {
      type: "array",
      items: { type: "string" }
    },
    cta: { type: "string" },
    pinnedComment: { type: "string" },
    qualityNotes: {
      type: "object",
      additionalProperties: false,
      required: ["scrollStop", "identification", "action"],
      properties: {
        scrollStop: { type: "string" },
        identification: { type: "string" },
        action: { type: "string" }
      }
    }
  }
} as const;

const systemPrompt =
  "Você é o motor de copy do Astral Pessoal. Gere conteúdo em português do Brasil para Instagram e TikTok. Linguagem direta, emocionalmente inteligente, acessível e com apelo de crescimento orgânico. Não use promessa médica, cura garantida, diagnóstico psicológico ou previsão absoluta. Não use linguagem esotérica exagerada. Retorne apenas JSON válido.";

export function buildCompactTextPrompt(input: CompactGenerateCopyRequest) {
  const titleMaxWords = input.limits?.titleMaxWords ?? 12;
  const subtitleMaxWords = input.limits?.subtitleMaxWords ?? 18;
  const tone = input.tone ?? "direto, emocionalmente inteligente, acessível";

  return [
    `F:${input.format};cards:${input.cards};obj:${input.objective};base:${input.scienceBase}.`,
    `Tema:${input.theme};hook:${input.hookType};${input.moment};CTA:${input.ctaType}.`,
    `Tom:${tone};title<=${titleMaxWords}w;subtitle<=${subtitleMaxWords}w;tags5-8.`,
    "Curto, claro, retenção/ação. Carrossel progride; stories C/M/F; vídeo hook3s.",
    "JSON keys: title,subtitle,slides,caption,hashtags,cta,pinnedComment,qualityNotes."
  ].join(" ");
}

export async function generateTextCopy(input: CompactGenerateCopyRequest): Promise<TextGenerationOutput> {
  const preferredProvider = input.provider ?? normalizeProvider(process.env.AI_TEXT_PROVIDER);

  if (preferredProvider === "gemini") {
    if (process.env.GEMINI_API_KEY) return generateWithGemini(input);
    if (process.env.OPENAI_API_KEY) return generateWithOpenAi(input);
  }

  if (process.env.OPENAI_API_KEY) {
    return generateWithOpenAi(input);
  }

  if (process.env.GEMINI_API_KEY) {
    return generateWithGemini(input);
  }

  throw new Error("Nenhum provedor de IA configurado.");
}

function normalizeProvider(provider: string | undefined): TextProvider | undefined {
  return provider === "openai" || provider === "gemini" ? provider : undefined;
}

async function generateWithOpenAi(input: CompactGenerateCopyRequest): Promise<TextGenerationOutput> {
  const model = process.env.OPENAI_COPY_MODEL ?? defaultCopyModel;
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: buildCompactTextPrompt(input) }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "astral_copy",
          strict: true,
          schema: outputSchema
        }
      }
    })
  });

  if (!response.ok) throw new Error(`OpenAI copy generation failed: ${response.status}`);

  const data = await response.json();
  const outputText = extractOpenAiOutputText(data);
  return { provider: "openai", model, copy: parseAiJson(outputText) };
}

async function generateWithGemini(input: CompactGenerateCopyRequest): Promise<TextGenerationOutput> {
  const model = process.env.GEMINI_COPY_MODEL ?? "gemini-2.5-flash";
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\n${buildCompactTextPrompt(input)}` }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7
        }
      })
    }
  );

  if (!response.ok) throw new Error(`Gemini copy generation failed: ${response.status}`);

  const data = await response.json();
  const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!outputText || typeof outputText !== "string") throw new Error("Gemini response did not include JSON text.");

  return { provider: "gemini", model, copy: parseAiJson(outputText) };
}

export function parseAiJson(outputText: string): GeneratedCopy {
  try {
    return JSON.parse(stripJsonFences(outputText)) as GeneratedCopy;
  } catch {
    throw new Error("IA retornou JSON inválido para copy.");
  }
}

function extractOpenAiOutputText(data: any) {
  const outputText =
    data.output_text ??
    data.output?.flatMap((item: any) => item.content ?? []).find((content: any) => content.type === "output_text")?.text;

  if (!outputText || typeof outputText !== "string") {
    throw new Error("OpenAI response did not include output_text.");
  }

  return outputText;
}

function stripJsonFences(text: string) {
  return text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");
}
