import type { SupabaseClient } from "@supabase/supabase-js";
import { deflateSync } from "node:zlib";
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
  const contentType = "image/png";
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
  const extension = "png";

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
  return createFallbackPng(width, height);
}

function trimWords(text: string | null | undefined, maxWords: number) {
  return String(text ?? "").split(/\s+/).filter(Boolean).slice(0, maxWords).join(" ");
}

function slug(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function createFallbackPng(width: number, height: number) {
  const raw = Buffer.alloc((width * 3 + 1) * height);

  for (let y = 0; y < height; y += 1) {
    const rowStart = y * (width * 3 + 1);
    raw[rowStart] = 0;
    for (let x = 0; x < width; x += 1) {
      const offset = rowStart + 1 + x * 3;
      const fx = x / width;
      const fy = y / height;
      const glow = Math.max(0, 1 - Math.hypot(fx - 0.76, fy - 0.16) * 4);
      const centerGlow = Math.max(0, 1 - Math.hypot(fx - 0.5, fy - 0.48) * 2.2);
      raw[offset] = Math.min(255, Math.round(6 + fx * 28 + glow * 180 + centerGlow * 42));
      raw[offset + 1] = Math.min(255, Math.round(5 + fy * 20 + glow * 145 + centerGlow * 18));
      raw[offset + 2] = Math.min(255, Math.round(13 + fx * 58 + fy * 42 + glow * 40 + centerGlow * 90));
    }
  }

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr(width, height)),
    pngChunk("IDAT", deflateSync(raw)),
    pngChunk("IEND", Buffer.alloc(0))
  ]);
}

function ihdr(width: number, height: number) {
  const buffer = Buffer.alloc(13);
  buffer.writeUInt32BE(width, 0);
  buffer.writeUInt32BE(height, 4);
  buffer[8] = 8;
  buffer[9] = 2;
  buffer[10] = 0;
  buffer[11] = 0;
  buffer[12] = 0;
  return buffer;
}

function pngChunk(type: string, data: Buffer) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (let index = 0; index < buffer.length; index += 1) {
    const byte = buffer[index];
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
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
