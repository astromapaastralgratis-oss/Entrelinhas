import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type {
  GeneratedImageResult,
  GenerateImageRequest,
  ImageGenerationProvider
} from "@/types/image-generation";

const mandatoryVisualPrompt =
  "Imagem premium mística moderna para redes sociais, fundo escuro em preto/roxo profundo/azul noite, gradiente cósmico, elementos dourados, glow suave, lua, estrelas e energia sutil, composição elegante, alto contraste, tipografia grande e legível no celular, texto centralizado, margens seguras, sem frase cortada, sem palavras aleatórias, sem grid, sem colagem, uma única tela por imagem.";

const mandatoryNegativePrompt =
  "texto pequeno, frase cortada, palavras aleatórias, erro ortográfico, grid, colagem, múltiplos cards, múltiplas telas, baixa legibilidade, excesso de elementos, fonte distorcida, texto fora da margem, layout poluído.";

type StorageClient = SupabaseClient<Database>;

export function buildFinalImagePrompt(input: GenerateImageRequest) {
  return [
    mandatoryVisualPrompt,
    `Formato: ${input.format}. Proporção: ${input.ratio}. Estilo visual: ${input.visualStyle}.`,
    `Ciência base: ${input.scienceBase}.`,
    `Texto principal: "${trimWords(input.title, 12)}".`,
    `Subtítulo: "${trimWords(input.subtitle, 18)}".`,
    `CTA curto: "${trimWords(input.cta, 8)}".`,
    input.prompt
  ].join(" ");
}

export function buildFinalNegativePrompt(input: Pick<GenerateImageRequest, "negativePrompt">) {
  return uniqueTerms(`${mandatoryNegativePrompt}, ${input.negativePrompt}`);
}

export function validateImageGenerationInput(input: GenerateImageRequest) {
  const errors: string[] = [];

  if (!input.ratio) errors.push("Proporção obrigatória ausente.");
  if (!input.prompt) errors.push("Prompt visual obrigatório ausente.");
  if (asksForForbiddenMultiImageLayout(input.prompt)) {
    errors.push("Prompt visual não pode pedir grid, colagem ou múltiplas telas.");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function generateImage(input: GenerateImageRequest, options: { client?: StorageClient | null } = {}) {
  const validation = validateImageGenerationInput(input);
  if (!validation.valid) {
    throw new Error(`Imagem rejeitada: ${validation.errors.join(" ")}`);
  }

  const provider = getImageProvider();
  const imageBytes = await generateImageBytes(input, provider);
  const bucket = getBucketForFormat(input.format);
  const filename = buildImageFilename(input, provider);
  const storagePath = input.userId ? `${input.userId}/${filename}` : filename;
  const estimatedCost = provider === "fallback" ? 0 : Number(process.env.IMAGE_GENERATION_ESTIMATED_COST ?? 0.04);
  const contentType = provider === "fallback" ? "image/svg+xml" : "image/png";
  let imageUrl = `data:${contentType};base64,${Buffer.from(imageBytes).toString("base64")}`;

  if (options.client && input.userId) {
    imageUrl = await uploadImage({
      client: options.client,
      bucket,
      storagePath,
      imageBytes,
      contentType
    });

    if (input.generatedPostId) {
      await persistImageRecord(options.client, input, {
        bucket,
        storagePath,
        imageUrl,
        provider,
        estimatedCost
      });
    }
  }

  return {
    imageUrl,
    storagePath,
    bucket,
    filename,
    format: normalizeFormat(input.format),
    ratio: input.ratio,
    cardIndex: input.cardIndex ?? 1,
    provider,
    estimatedCost,
    exportStatus: "image_generated",
    source: provider === "fallback" ? "fallback" : "provider"
  } satisfies GeneratedImageResult;
}

async function generateImageBytes(input: GenerateImageRequest, provider: ImageGenerationProvider) {
  if (provider === "openai") {
    try {
      return await generateWithOpenAiImages(input);
    } catch {
      return fallbackImageBytes(input);
    }
  }

  return fallbackImageBytes(input);
}

async function generateWithOpenAiImages(input: GenerateImageRequest) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.IMAGE_GENERATION_TIMEOUT_MS ?? 3500));
  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    signal: controller.signal,
    headers: {
      Authorization: `Bearer ${process.env.IMAGE_GENERATION_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.IMAGE_GENERATION_MODEL ?? "gpt-image-1",
      prompt: buildFinalImagePrompt(input),
      size: input.ratio === "9:16" ? "1024x1792" : "1024x1024",
      n: 1
    })
  }).finally(() => clearTimeout(timeout));

  if (!response.ok) throw new Error(`OpenAI image generation failed: ${response.status}`);

  const data = await response.json();
  const base64 = data.data?.[0]?.b64_json;
  if (!base64 || typeof base64 !== "string") throw new Error("Image provider did not return b64_json.");

  return Buffer.from(base64, "base64");
}

async function uploadImage(input: {
  client: StorageClient;
  bucket: string;
  storagePath: string;
  imageBytes: Buffer;
  contentType: string;
}) {
  const { error } = await input.client.storage
    .from(input.bucket)
    .upload(input.storagePath, input.imageBytes, {
      contentType: input.contentType,
      upsert: true
    });

  if (error) throw error;

  const { data } = input.client.storage.from(input.bucket).getPublicUrl(input.storagePath);
  return data.publicUrl;
}

async function persistImageRecord(
  client: StorageClient,
  input: GenerateImageRequest,
  result: {
    bucket: string;
    storagePath: string;
    imageUrl: string;
    provider: ImageGenerationProvider;
    estimatedCost: number;
  }
) {
  if (!input.userId || !input.generatedPostId) return;

  const { error } = await client.from("generated_post_images").insert({
    user_id: input.userId,
    generated_post_id: input.generatedPostId,
    format: normalizeFormat(input.format),
    ratio: input.ratio,
    card_index: input.cardIndex ?? 1,
    bucket: result.bucket,
    storage_path: result.storagePath,
    image_url: result.imageUrl,
    prompt: buildFinalImagePrompt(input),
    negative_prompt: buildFinalNegativePrompt(input),
    provider: result.provider,
    estimated_cost: result.estimatedCost,
    export_status: "image_generated"
  });

  if (error) throw error;

  await client
    .from("generated_posts")
    .update({
      image_url: result.imageUrl,
      image_prompt: buildFinalImagePrompt(input),
      export_status: "image_generated"
    })
    .eq("id", input.generatedPostId)
    .eq("user_id", input.userId);
}

export function buildImageFilename(input: GenerateImageRequest, provider: ImageGenerationProvider = getImageProvider()) {
  const date = input.date ?? new Date().toISOString().slice(0, 10);
  const moment = slug(input.moment ?? "dia");
  const index = String(input.cardIndex ?? 1).padStart(2, "0");
  const format = normalizeFormat(input.format);
  const extension = provider === "fallback" ? "svg" : "png";

  if (format === "reels" || format === "tiktok") return `${date}_reels-cover.${extension}`;
  if (format === "stories") return `${date}_${moment}_story-${index}.${extension}`;
  return `${date}_${moment}_${format}_card-${index}.${extension}`;
}

export function getBucketForFormat(format: GenerateImageRequest["format"]) {
  const normalized = normalizeFormat(format);
  if (normalized === "stories") return "stories";
  if (normalized === "carrossel") return "carousels";
  if (normalized === "reels" || normalized === "tiktok") return "reels-covers";
  return "posts";
}

function normalizeFormat(format: GenerateImageRequest["format"]) {
  return format === "story" ? "stories" : format;
}

function getImageProvider(): ImageGenerationProvider {
  const configured = (process.env.IMAGE_GENERATION_PROVIDER ?? "openai").toLowerCase();
  if (!process.env.IMAGE_GENERATION_API_KEY) return "fallback";
  if (["openai", "ideogram", "leonardo", "replicate", "canva"].includes(configured)) {
    return configured as ImageGenerationProvider;
  }
  return "openai";
}

function fallbackImageBytes(input: GenerateImageRequest) {
  const width = input.ratio === "9:16" ? 1080 : 1080;
  const height = input.ratio === "9:16" ? 1920 : 1080;
  const titleFont = input.ratio === "9:16" ? 86 : 64;
  const subtitleFont = input.ratio === "9:16" ? 46 : 34;
  const ctaFont = input.ratio === "9:16" ? 38 : 28;
  const safeX = Math.round(width * 0.1);
  const titleLines = wrapSvgText(trimWords(input.title, 12), input.ratio === "9:16" ? 18 : 22);
  const subtitleLines = wrapSvgText(trimWords(input.subtitle, 18), input.ratio === "9:16" ? 26 : 34);
  const cta = trimWords(input.cta, 8);

  const titleStart = Math.round(height * 0.39);
  const subtitleStart = titleStart + titleLines.length * Math.round(titleFont * 1.15) + Math.round(height * 0.055);
  const ctaY = Math.round(height * 0.82);

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#05050a"/>
      <stop offset="48%" stop-color="#24124b"/>
      <stop offset="100%" stop-color="#06172a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#d9b66d" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#d9b66d" stop-opacity="0"/>
    </radialGradient>
    <filter id="softGlow">
      <feGaussianBlur stdDeviation="18" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <circle cx="${Math.round(width * 0.78)}" cy="${Math.round(height * 0.16)}" r="${Math.round(width * 0.2)}" fill="url(#glow)"/>
  <circle cx="${Math.round(width * 0.78)}" cy="${Math.round(height * 0.16)}" r="${Math.round(width * 0.075)}" fill="#d9b66d" opacity="0.92" filter="url(#softGlow)"/>
  <circle cx="${Math.round(width * 0.81)}" cy="${Math.round(height * 0.14)}" r="${Math.round(width * 0.072)}" fill="#171025"/>
  ${starField(width, height)}
  <text x="${safeX}" y="${Math.round(height * 0.18)}" fill="#d9b66d" font-family="Arial, Helvetica, sans-serif" font-size="${ctaFont}" letter-spacing="8">ASTRAL PESSOAL</text>
  ${svgTextBlock(titleLines, safeX, titleStart, titleFont, "#fff7e8", 800)}
  ${svgTextBlock(subtitleLines, safeX, subtitleStart, subtitleFont, "#d8c8ff", 500)}
  <rect x="${safeX}" y="${ctaY - Math.round(ctaFont * 1.15)}" width="${Math.round(width * 0.8)}" height="${Math.round(ctaFont * 2.25)}" rx="18" fill="#090812" opacity="0.55" stroke="#d9b66d" stroke-opacity="0.38"/>
  <text x="${safeX + 32}" y="${ctaY}" fill="#6bd4c8" font-family="Arial, Helvetica, sans-serif" font-size="${ctaFont}" font-weight="700">${escapeSvg(cta)}</text>
</svg>`.trim();

  return Buffer.from(svg);
}

function trimWords(text: string | null | undefined, maxWords: number) {
  return String(text ?? "").split(/\s+/).filter(Boolean).slice(0, maxWords).join(" ");
}

function wrapSvgText(text: string, maxChars: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (testLine.length > maxChars && line) {
      lines.push(line);
      line = word;
      return;
    }
    line = testLine;
  });

  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function svgTextBlock(lines: string[], x: number, y: number, size: number, fill: string, weight: number) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * Math.round(size * 1.16)}" fill="${fill}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}">${escapeSvg(line)}</text>`
    )
    .join("\n  ");
}

function starField(width: number, height: number) {
  return Array.from({ length: 42 }, (_, index) => {
    const x = (index * 197) % width;
    const y = (index * 113) % height;
    const r = index % 5 === 0 ? 2.4 : 1.3;
    const opacity = 0.32 + (index % 7) * 0.07;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff7e8" opacity="${opacity.toFixed(2)}"/>`;
  }).join("\n  ");
}

function escapeSvg(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function slug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function uniqueTerms(text: string) {
  return Array.from(new Set(text.split(",").map((item) => item.trim()).filter(Boolean))).join(", ");
}

function asksForForbiddenMultiImageLayout(prompt: string) {
  const normalized = prompt.toLowerCase();
  const forbidden = ["grid", "colagem", "múltiplos cards", "multiplos cards", "múltiplas telas", "multiplas telas"];
  return forbidden.some((term) => {
    const index = normalized.indexOf(term);
    if (index === -1) return false;
    const prefix = normalized.slice(Math.max(0, index - 8), index);
    return !/(no |sem |não |nao )$/.test(prefix);
  });
}
