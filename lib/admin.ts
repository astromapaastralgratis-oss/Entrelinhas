import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export type AdminContext = {
  userId: string;
  email: string;
  serviceClient: SupabaseClient<Database>;
};

export function getAdminEmails() {
  return (process.env.ENTRELINHAS_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email?: string | null) {
  if (!email) return false;
  return getAdminEmails().includes(email.toLowerCase());
}

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error("ADMIN_SUPABASE_NOT_CONFIGURED");
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

export async function requireAdminRequest(request: Request): Promise<AdminContext> {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!token) throw new Error("AUTH_REQUIRED");
  if (!url || !anonKey) throw new Error("SUPABASE_NOT_CONFIGURED");

  const authClient = createClient<Database>(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } }
  });

  const { data, error } = await authClient.auth.getUser(token);
  const email = data.user?.email ?? null;

  if (error || !data.user || !email) throw new Error("AUTH_INVALID");
  if (!isAdminEmail(email)) throw new Error("ADMIN_FORBIDDEN");

  return {
    userId: data.user.id,
    email,
    serviceClient: createServiceClient()
  };
}

export function adminErrorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "ADMIN_ERROR";

  if (message === "AUTH_REQUIRED") return Response.json({ error: "Entre para continuar." }, { status: 401 });
  if (message === "AUTH_INVALID") return Response.json({ error: "Sessao expirada. Entre novamente." }, { status: 401 });
  if (message === "ADMIN_FORBIDDEN") return Response.json({ error: "Acesso administrativo restrito." }, { status: 403 });
  if (message === "ADMIN_SUPABASE_NOT_CONFIGURED" || message === "SUPABASE_NOT_CONFIGURED") {
    return Response.json({ error: "Ambiente administrativo indisponivel." }, { status: 500 });
  }

  return Response.json({ error: "Nao conseguimos concluir esta acao agora." }, { status: 500 });
}
