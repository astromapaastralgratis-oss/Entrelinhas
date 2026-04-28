import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type AuthenticatedRequestContext = {
  userId: string;
  client: SupabaseClient<Database>;
};

export async function requireAuthenticatedRequest(request: Request): Promise<AuthenticatedRequestContext> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!token) {
    throw new Error("AUTH_REQUIRED");
  }

  if (!url || !key) {
    throw new Error("SUPABASE_NOT_CONFIGURED");
  }

  const client = createClient<Database>(url, key, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  const {
    data: { user },
    error
  } = await client.auth.getUser(token);

  if (error || !user) {
    throw new Error("AUTH_INVALID");
  }

  return { userId: user.id, client };
}

export function authErrorResponse(message: string) {
  if (message === "AUTH_REQUIRED") return { error: "Login obrigatorio para gerar conteudo." };
  if (message === "AUTH_INVALID") return { error: "Sessao invalida. Entre novamente." };
  if (message === "SUPABASE_NOT_CONFIGURED") return { error: "Supabase nao configurado." };
  return { error: message };
}
