import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { generatePostArtwork, validatePostArtworkInput } from "@/lib/post-artwork";
import type {
  GeneratedImageResult,
  GenerateImageRequest,
  ImageGenerationProvider
} from "@/types/image-generation";

const mandatoryPostDirection =
  "Arte final postavel do Entrelinhas. O sistema renderiza o texto na arte final; a IA de imagem nao deve escrever palavras. Design premium mistico moderno, alto contraste, margens seguras, composicao editorial, uma unica tela independente por post.";

const mandatoryNegativePrompt =
  "texto pequeno, frase cortada, palavras aleatorias, erro ortografico, grid, colagem, multiplos cards, multiplas telas, baixa legibilidade, excesso de elementos, fonte distorcida, texto fora da margem, layout poluido, borda branca";

type StorageClient = SupabaseClient<Database>;

export function buildFinalImagePrompt(input: GenerateImageRequest) {
  return [
    mandatoryPostDirection,
    `Formato: ${input.format}. Proporcao: ${input.ratio}. Estilo do post: ${input.visualStyle}.`,
    `Ciencia base: ${input.scienceBase}.`,
    `Titulo renderizado pelo sistema: "${trimWords(input.title, 12)}".`,
    `Subtitulo renderizado pelo sistema: "${trimWords(input.subtitle, 18)}".`,
    `Chamada renderizada pelo sistema: "${trimWords(input.cta, 14)}".`,
    input.prompt
  ].join(" ");
}

export function buildFinalNegativePrompt(input: Pick<GenerateImageRequest, "negativePrompt">) {
  return uniqueTerms(`${mandatoryNegativePrompt}, ${input.negativePrompt}`);
}

export function validateImageGenerationInput(input: GenerateImageRequest) {
  const errors: string[] = [];

  if (!input.ratio) errors.push("Proporcao obrigatoria ausente.");
  if (!input.prompt) errors.push("Estilo do post obrigatorio ausente.");
  if (asksForForbiddenMultiImageLayout(input.prompt)) {
    errors.push("Estilo do post nao pode pedir grid, colagem ou multiplas telas.");
  }
  errors.push(...validatePostArtworkInput(input).errors);

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function generateImage(input: GenerateImageRequest, options: { client?: StorageClient | null } = {}) {
  const validation = validateImageGenerationInput(input);
  if (!validation.valid) {
    throw new Error(`Post rejeitado: ${validation.errors.join(" ")}`);
  }

  const provider: ImageGenerationProvider = "renderer";
  const artwork = generatePostArtwork(input);
  const imageBytes = artwork.bytes;
  const bucket = getBucketForFormat(input.format);
  const filename = buildImageFilename(input, provider);
  const storagePath = input.userId ? `${input.userId}/${filename}` : filename;
  const estimatedCost = 0;
  let imageUrl = artwork.dataUrl;
  let finalStoragePath = storagePath;
  let persistenceStatus: GeneratedImageResult["persistenceStatus"] = options.client && input.userId ? "saved" : "skipped";
  let persistenceWarning: string | undefined;

  if (options.client && input.userId) {
    try {
      imageUrl = await uploadPostArtwork({
        client: options.client,
        bucket,
        storagePath,
        imageBytes,
        contentType: artwork.contentType
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
    } catch (error) {
      persistenceStatus = "warning";
      persistenceWarning = readablePersistenceError(error);
      imageUrl = artwork.dataUrl;
      finalStoragePath = "";
    }
  }

  return {
    imageUrl,
    storagePath: finalStoragePath,
    bucket,
    filename,
    format: normalizeFormat(input.format),
    ratio: input.ratio,
    cardIndex: input.cardIndex ?? 1,
    provider,
    estimatedCost,
    exportStatus: "image_generated",
    source: "renderer",
    persistenceStatus,
    persistenceWarning
  } satisfies GeneratedImageResult;
}

async function uploadPostArtwork(input: {
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

  const imageRecord = {
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
    export_status: "image_generated" as const
  };

  const { error: updateExistingError } = await client
    .from("generated_post_images")
    .update(imageRecord)
    .eq("user_id", input.userId)
    .eq("generated_post_id", input.generatedPostId)
    .eq("card_index", input.cardIndex ?? 1);

  if (updateExistingError) throw updateExistingError;

  const { data: existingRecord, error: existingRecordError } = await client
    .from("generated_post_images")
    .select("id")
    .eq("user_id", input.userId)
    .eq("generated_post_id", input.generatedPostId)
    .eq("card_index", input.cardIndex ?? 1)
    .maybeSingle();

  if (existingRecordError) throw existingRecordError;

  if (!existingRecord) {
    const { error: insertError } = await client.from("generated_post_images").insert({
      user_id: input.userId,
      ...imageRecord
    });
    if (insertError) throw insertError;
  }

  const { error: postUpdateError } = await client
    .from("generated_posts")
    .update({
      image_url: result.imageUrl,
      image_prompt: buildFinalImagePrompt(input),
      export_status: "image_generated"
    })
    .eq("id", input.generatedPostId)
    .eq("user_id", input.userId);

  if (postUpdateError) throw postUpdateError;
}

export function buildImageFilename(input: GenerateImageRequest, _provider: ImageGenerationProvider = "renderer") {
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

function uniqueTerms(text: string) {
  return Array.from(new Set(text.split(",").map((item) => item.trim()).filter(Boolean))).join(", ");
}

function asksForForbiddenMultiImageLayout(prompt: string) {
  const normalized = prompt.toLowerCase();
  const forbidden = ["grid", "colagem", "multiplos cards", "multiplas telas"];
  return forbidden.some((term) => {
    const index = normalized.indexOf(term);
    if (index === -1) return false;
    const prefix = normalized.slice(Math.max(0, index - 8), index);
    return !/(no |sem |nao )$/.test(prefix);
  });
}

function readablePersistenceError(error: unknown) {
  if (error instanceof Error) return error.message;
  if (!error) return "Nao foi possivel salvar o post no historico.";
  if (typeof error === "string") return error;
  if (typeof error === "object") {
    const record = error as Record<string, unknown>;
    return [record.message, record.code, record.details, record.hint].filter(Boolean).map(String).join(" | ");
  }
  return String(error);
}
