import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { generateImage } from "@/lib/ai/image-generation";
import type { Database } from "@/types/database";
import type { GenerateImagesBatchRequest } from "@/types/image-generation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateImagesBatchRequest;
    const { userId, client } = await getAuthenticatedClient(request, body.userId);

    const results = [];
    for (let index = 0; index < body.images.length; index += 1) {
      const image = body.images[index];
      const result = await generateImage(
        {
          ...image,
          generatedPostId: image.generatedPostId ?? body.generatedPostId,
          userId: image.userId ?? body.userId ?? userId,
          cardIndex: image.cardIndex ?? index + 1
        },
        { client }
      );
      results.push(result);
    }

    const hasMissingUrl = results.some((result) => !result.imageUrl);
    if (hasMissingUrl) {
      return NextResponse.json({ error: "Uma ou mais imagens não geraram image_url.", results }, { status: 422 });
    }

    return NextResponse.json({ results });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate image batch.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function getAuthenticatedClient(request: Request, fallbackUserId?: string) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!token || !url || !key) return { userId: fallbackUserId, client: null };

  const client = createClient<Database>(url, key, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  const {
    data: { user }
  } = await client.auth.getUser(token);

  return { userId: fallbackUserId ?? user?.id, client };
}
