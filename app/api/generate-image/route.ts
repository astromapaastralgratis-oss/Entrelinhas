import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { generateImage } from "@/lib/ai/image-generation";
import type { Database } from "@/types/database";
import type { GenerateImageRequest } from "@/types/image-generation";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateImageRequest;
    const { userId, client } = await getAuthenticatedClient(request, body.userId);
    const result = await generateImage({ ...body, userId: body.userId ?? userId }, { client });

    if (!result.imageUrl) {
      return NextResponse.json({ error: "image_url não foi criada." }, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate image.";
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
