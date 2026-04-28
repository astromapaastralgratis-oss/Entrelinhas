import { NextResponse } from "next/server";
import { authErrorResponse, requireAuthenticatedRequest } from "@/lib/api-auth";
import { generateImage } from "@/lib/ai/image-generation";
import type { GenerateImagesBatchRequest } from "@/types/image-generation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateImagesBatchRequest;
    const { userId, client } = await requireAuthenticatedRequest(request);

    const results = [];
    for (let index = 0; index < body.images.length; index += 1) {
      const image = body.images[index];
      const result = await generateImage(
        {
          ...image,
          generatedPostId: image.generatedPostId ?? body.generatedPostId,
          userId,
          cardIndex: image.cardIndex ?? index + 1
        },
        { client }
      );
      results.push(result);
    }

    const hasMissingUrl = results.some((result) => !result.imageUrl);
    if (hasMissingUrl) {
      return NextResponse.json({ error: "Uma ou mais imagens nao geraram image_url.", results }, { status: 422 });
    }

    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate image batch.";
    if (message === "AUTH_REQUIRED" || message === "AUTH_INVALID" || message === "SUPABASE_NOT_CONFIGURED") {
      return NextResponse.json(authErrorResponse(message), { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
