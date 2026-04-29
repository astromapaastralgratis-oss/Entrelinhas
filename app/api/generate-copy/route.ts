import { NextResponse } from "next/server";
import { authErrorResponse, requireAuthenticatedRequest } from "@/lib/api-auth";
import { generateCopy } from "@/lib/copy-generation";
import { getAiUsageSummary, recordAiGenerationUsage, saveGeneratedPost } from "@/lib/content-persistence";
import type { EditorialPlanItem } from "@/types/content";
import type { CompactGenerateCopyRequest, GenerateCopyRequest, GenerateCopyResult } from "@/types/copy";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type DbClient = SupabaseClient<Database>;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateCopyRequest | CompactGenerateCopyRequest;
    const { userId, client } = await requireAuthenticatedRequest(request);
    const usage = await getAiUsageSummary(userId, client);
    const generateRequest = normalizeRequest(body, userId);
    generateRequest.currentDailyCost = usage.dailyCost;

    if (!generateRequest.planItem) {
      return NextResponse.json({ error: "planItem or compact generation fields are required" }, { status: 400 });
    }

    const result = await generateCopy(generateRequest);

    if (result.cost.blocked) {
      return NextResponse.json(result, { status: 402 });
    }

    const savedPostId = await persistResultIfPossible(userId, generateRequest, result, client);
    return NextResponse.json({ ...result, savedPostId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate copy.";
    if (message === "AUTH_REQUIRED" || message === "AUTH_INVALID" || message === "SUPABASE_NOT_CONFIGURED") {
      return NextResponse.json(authErrorResponse(message), { status: 401 });
    }

    const status = message.includes("JSON invalido") || message.includes("Conteudo gerado bloqueado") ? 422 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

function normalizeRequest(
  body: GenerateCopyRequest | CompactGenerateCopyRequest,
  userId: string
): GenerateCopyRequest {
  if ("planItem" in body && body.planItem) {
    return { ...body, userId };
  }

  const compact = body as CompactGenerateCopyRequest;
  const planItem: EditorialPlanItem = {
    date: new Date().toISOString().slice(0, 10),
    moment: compact.moment,
    platform: compact.format === "tiktok" ? "tiktok" : "instagram",
    format: compact.format,
    objective: compact.objective,
    scienceBase: compact.scienceBase,
    theme: compact.theme,
    hookType: compact.hookType,
    ctaType: compact.ctaType,
    strategicReason: `Copy gerada por IA para ${compact.format}, com objetivo de ${compact.objective} e gancho de ${compact.hookType}.`,
    score: {
      follow: compact.objective === "ganhar seguidores" ? 9 : 6,
      save: compact.format === "carrossel" ? 8 : 5,
      share: 7,
      comment: compact.ctaType === "comentar" ? 8 : 5,
      bioClick: compact.ctaType.includes("bio") || compact.ctaType.includes("app") ? 8 : 3,
      repetitionRisk: 2,
      emotionalIntensity: compact.hookType.includes("identificacao") ? 8 : 6
    }
  };

  return {
    planItem,
    planItemId: compact.planItemId,
    userId,
    provider: compact.provider
  };
}

async function persistResultIfPossible(
  userId: string,
  request: GenerateCopyRequest,
  result: GenerateCopyResult,
  client: DbClient
) {
  const post = await saveGeneratedPost({
    userId,
    calendarId: request.planItemId ?? null,
    item: request.planItem,
    title: result.copy.title,
    subtitle: result.copy.subtitle,
    body: result.copy.slides.map((slide) => `${slide.number}. ${slide.title} - ${slide.subtitle}`).join("\n"),
    caption: result.copy.caption,
    hashtags: result.copy.hashtags,
    cta: result.copy.cta,
    pinnedComment: result.copy.pinnedComment,
    promptTokensEstimate: result.cost.promptTokensEstimate,
    completionTokensEstimate: result.cost.completionTokensEstimate,
    totalTokensEstimate: result.cost.totalTokensEstimate,
    estimatedCost: result.cost.estimatedCost,
    generationSource: result.source,
    providerUsed: result.cost.providerUsed,
    modelUsed: result.cost.modelUsed ?? result.cost.model,
    fallbackUsed: result.cost.fallbackUsed,
    errorMessage: result.cost.errorMessage
  }, client);

  await recordAiGenerationUsage({
    userId,
    generatedPostId: post?.id,
    model: result.cost.model,
    providerUsed: result.cost.providerUsed,
    fallbackUsed: result.cost.fallbackUsed,
    errorMessage: result.cost.errorMessage,
    promptTokensEstimate: result.cost.promptTokensEstimate,
    completionTokensEstimate: result.cost.completionTokensEstimate,
    totalTokensEstimate: result.cost.totalTokensEstimate,
    estimatedCost: result.cost.estimatedCost
  }, client);

  return post?.id ?? null;
}
