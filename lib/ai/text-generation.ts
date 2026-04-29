import { defaultCopyModel } from "@/lib/cost-control";
import type { CompactGenerateCopyRequest, GeneratedCopy, TextProvider } from "@/types/copy";

export type TextGenerationOutput = {
  provider: Exclude<TextProvider, "auto">;
  model: string;
  copy: GeneratedCopy;
  fallbackUsed: boolean;
  attemptedProviders: Array<{
    provider: Exclude<TextProvider, "auto">;
    model: string;
    ok: boolean;
    errorMessage?: string;
  }>;
  errorMessage?: string | null;
};

type ConcreteProvider = Exclude<TextProvider, "auto">;

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
    hashtags: { type: "array", items: { type: "string" } },
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
  "Voce e o motor de copy do Astral Pessoal. Gere conteudo em portugues do Brasil para Instagram e TikTok. Linguagem direta, emocionalmente inteligente, acessivel e com apelo de crescimento organico. Nao use promessa medica, cura garantida, diagnostico psicologico ou previsao absoluta. Nao use linguagem esoterica exagerada. Retorne apenas JSON valido.";

export function buildCompactTextPrompt(input: CompactGenerateCopyRequest) {
  const titleMaxWords = input.limits?.titleMaxWords ?? 12;
  const subtitleMaxWords = input.limits?.subtitleMaxWords ?? 18;
  const tone = input.tone ?? "direto, emocionalmente inteligente, acessivel";

  return [
    `F:${input.format};cards:${input.cards};obj:${input.objective};base:${input.scienceBase}.`,
    `Tema:${input.theme};hook:${input.hookType};${input.moment};CTA:${input.ctaType}.`,
    `Tom:${tone};title<=${titleMaxWords}w;subtitle<=${subtitleMaxWords}w;tags5-8.`,
    "Curto, claro, retencao/acao. Carrossel progride; stories C/M/F; video hook3s.",
    "JSON keys: title,subtitle,slides,caption,hashtags,cta,pinnedComment,qualityNotes."
  ].join(" ");
}

export async function generateTextCopy(input: CompactGenerateCopyRequest): Promise<TextGenerationOutput> {
  const route = getProviderRoute(input.provider);
  const attempts: TextGenerationOutput["attemptedProviders"] = [];

  for (const provider of route) {
    const model = getProviderModel(provider);
    if (!isProviderConfigured(provider)) continue;

    try {
      const copy = await callProvider(provider, input, model);
      attempts.push({ provider, model, ok: true });
      return {
        provider,
        model,
        copy,
        fallbackUsed: attempts.length > 1,
        attemptedProviders: attempts,
        errorMessage: attempts.find((attempt) => !attempt.ok)?.errorMessage ?? null
      };
    } catch (error) {
      const message = normalizeAiError(provider, error);
      attempts.push({ provider, model, ok: false, errorMessage: message });
      continue;
    }
  }

  throw new Error(
    attempts.length
      ? `Todos os provedores de IA falharam: ${attempts.map((item) => `${item.provider}=${item.errorMessage}`).join("; ")}`
      : "Nenhum provedor de IA configurado."
  );
}

function getProviderRoute(provider: TextProvider | undefined): ConcreteProvider[] {
  if (provider && provider !== "auto") {
    const rest = ["openai", "gemini", "openrouter"].filter((item) => item !== provider) as ConcreteProvider[];
    return [provider, ...rest];
  }

  const configured = normalizeProvider(process.env.AI_TEXT_PROVIDER);
  if (configured && configured !== "auto") {
    const rest = ["openai", "gemini", "openrouter"].filter((item) => item !== configured) as ConcreteProvider[];
    return [configured, ...rest];
  }

  return ["openai", "gemini", "openrouter"];
}

function normalizeProvider(provider: string | undefined): TextProvider | undefined {
  if (provider === "openai" || provider === "gemini" || provider === "openrouter" || provider === "auto") return provider;
  return undefined;
}

function isProviderConfigured(provider: ConcreteProvider) {
  if (provider === "openai") return Boolean(process.env.OPENAI_API_KEY);
  if (provider === "gemini") return Boolean(process.env.GEMINI_API_KEY);
  return Boolean(process.env.OPENROUTER_API_KEY);
}

function getProviderModel(provider: ConcreteProvider) {
  if (provider === "openai") return process.env.OPENAI_COPY_MODEL ?? defaultCopyModel;
  if (provider === "gemini") return process.env.GEMINI_COPY_MODEL ?? "gemini-2.5-flash";
  return process.env.OPENROUTER_COPY_MODEL ?? "google/gemini-2.5-flash";
}

async function callProvider(provider: ConcreteProvider, input: CompactGenerateCopyRequest, model: string) {
  if (provider === "openai") return generateWithOpenAi(input, model);
  if (provider === "gemini") return generateWithGemini(input, model);
  return generateWithOpenRouter(input, model);
}

async function generateWithOpenAi(input: CompactGenerateCopyRequest, model: string): Promise<GeneratedCopy> {
  const response = await fetchWithTimeout("https://api.openai.com/v1/responses", {
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

  if (!response.ok) throw new Error(`status_${response.status}`);
  const data = await response.json();
  return parseAiJson(extractOpenAiOutputText(data));
}

async function generateWithGemini(input: CompactGenerateCopyRequest, model: string): Promise<GeneratedCopy> {
  const response = await fetchWithTimeout(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: `${systemPrompt}\n\n${buildCompactTextPrompt(input)}` }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.7 }
      })
    }
  );

  if (!response.ok) throw new Error(`status_${response.status}`);
  const data = await response.json();
  const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!outputText || typeof outputText !== "string") throw new Error("missing_json_text");
  return parseAiJson(outputText);
}

async function generateWithOpenRouter(input: CompactGenerateCopyRequest, model: string): Promise<GeneratedCopy> {
  const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "https://astral-content-studio.onrender.com",
      "X-Title": "Astral Content Studio"
    },
    body: JSON.stringify({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: buildCompactTextPrompt(input) }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) throw new Error(`status_${response.status}`);
  const data = await response.json();
  const outputText = data.choices?.[0]?.message?.content;
  if (!outputText || typeof outputText !== "string") throw new Error("missing_json_text");
  return parseAiJson(outputText);
}

export function parseAiJson(outputText: string): GeneratedCopy {
  try {
    return JSON.parse(stripJsonFences(outputText)) as GeneratedCopy;
  } catch {
    throw new Error("IA retornou JSON inválido para copy.");
  }
}

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = 20_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

function normalizeAiError(provider: ConcreteProvider, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (/AbortError|aborted|timeout/i.test(message)) return `${provider}: timeout`;
  if (/status_(401|403)/.test(message)) return `${provider}: credencial, permissao ou billing indisponivel`;
  if (/status_429/.test(message)) return `${provider}: limite ou billing atingido`;
  return `${provider}: ${message}`;
}

function extractOpenAiOutputText(data: any) {
  const outputText =
    data.output_text ??
    data.output?.flatMap((item: any) => item.content ?? []).find((content: any) => content.type === "output_text")?.text;

  if (!outputText || typeof outputText !== "string") throw new Error("missing_output_text");
  return outputText;
}

function stripJsonFences(text: string) {
  return text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "");
}
