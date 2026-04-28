import { NextResponse } from "next/server";
import { generateCopy } from "@/lib/copy-generation";
import { recordAiGenerationUsage, saveGeneratedPost } from "@/lib/content-persistence";
import { supabase } from "@/lib/supabase";
import type { EditorialPlanItem } from "@/types/content";
import type { CompactGenerateCopyRequest, GenerateCopyRequest, GenerateCopyResult } from "@/types/copy";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateCopyRequest | CompactGenerateCopyRequest;
    const userId = await resolveUserId(request, body);
    const generateRequest = normalizeRequest(body, userId);

    if (!generateRequest.planItem) {
      return NextResponse.json({ error: "planItem or compact generation fields are required" }, { status: 400 });
    }

    const result = await generateCopy(generateRequest);

    if (result.cost.blocked) {
      return NextResponse.json(result, { status: 402 });
    }

    const savedPostId = await persistResultIfPossible(userId, generateRequest, result);

    return NextResponse.json({ ...result, savedPostId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate copy.";
    const status =
      message.includes("JSON inválido") || message.includes("Conteúdo gerado bloqueado") ? 422 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

function normalizeRequest(
  body: GenerateCopyRequest | CompactGenerateCopyRequest,
  userId?: string
): GenerateCopyRequest {
  if ("planItem" in body && body.planItem) {
    return { ...body, userId: body.userId ?? userId };
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
      emotionalIntensity: compact.hookType.includes("identificação") ? 8 : 6
    }
  };

  return {
    planItem,
    planItemId: compact.planItemId,
    userId: compact.userId ?? userId,
    provider: compact.provider
  };
}

async function persistResultIfPossible(
  userId: string | undefined,
  request: GenerateCopyRequest,
  result: GenerateCopyResult
) {
  if (!userId || !supabase) return null;

  try {
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
      generationSource: result.source
    });

    await recordAiGenerationUsage({
      userId,
      generatedPostId: post?.id,
      model: result.cost.model,
      promptTokensEstimate: result.cost.promptTokensEstimate,
      completionTokensEstimate: result.cost.completionTokensEstimate,
      totalTokensEstimate: result.cost.totalTokensEstimate,
      estimatedCost: result.cost.estimatedCost
    });

    return post?.id ?? null;
  } catch {
    return null;
  }
}

async function resolveUserId(request: Request, body: GenerateCopyRequest | CompactGenerateCopyRequest) {
  if ("userId" in body && body.userId) return body.userId;
  if (!supabase) return undefined;

  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return undefined;

  const {
    data: { user }
  } = await supabase.auth.getUser(token);

  return user?.id;
}
