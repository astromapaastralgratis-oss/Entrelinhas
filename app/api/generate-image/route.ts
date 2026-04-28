import { NextResponse } from "next/server";
import { authErrorResponse, requireAuthenticatedRequest } from "@/lib/api-auth";
import { generateImage } from "@/lib/ai/image-generation";
import type { GenerateImageRequest } from "@/types/image-generation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateImageRequest;
    const { userId, client } = await requireAuthenticatedRequest(request);
    const result = await generateImage({ ...body, userId }, { client });

    if (!result.imageUrl) {
      return NextResponse.json({ error: "image_url nao foi criada." }, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate image.";
    if (message === "AUTH_REQUIRED" || message === "AUTH_INVALID" || message === "SUPABASE_NOT_CONFIGURED") {
      return NextResponse.json(authErrorResponse(message), { status: 401 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
