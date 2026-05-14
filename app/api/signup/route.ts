import { createServiceClient } from "@/lib/admin";

type SignupBody = {
  fullName?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SignupBody;
    const fullName = body.fullName?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const password = body.password ?? "";

    if (!email || !email.includes("@")) {
      return signupError("Confira o email informado. Ele precisa estar em um formato valido.", 400);
    }

    if (password.length < 6) {
      return signupError("Use uma senha mais forte, com pelo menos 6 caracteres.", 400);
    }

    const serviceClient = createServiceClient();

    const [{ data: setting }, { count }] = await Promise.all([
      serviceClient.from("app_settings").select("value").eq("key", "signup_limits").maybeSingle(),
      serviceClient.from("profiles").select("id", { count: "exact", head: true }).eq("account_status", "active")
    ]);

    const maxActiveUsers = Number((setting?.value as { max_active_users?: number | null } | null)?.max_active_users);
    const limit = Number.isFinite(maxActiveUsers) && maxActiveUsers > 0 ? maxActiveUsers : null;
    const activeUsers = count ?? 0;

    if (limit !== null && activeUsers >= limit) {
      return signupError("As vagas de acesso estao temporariamente fechadas.", 403);
    }

    const { data, error } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName || null }
    });

    if (error) {
      return signupError(getSignupAdminErrorMessage(error.message), 400);
    }

    const user = data.user;
    if (!user) {
      return signupError("Não conseguimos criar sua conta agora. Tente novamente em instantes.", 500);
    }

    const { error: profileError } = await serviceClient.from("profiles").upsert({
      id: user.id,
      full_name: fullName || user.user_metadata?.full_name || null,
      account_status: "active",
      disabled_at: null,
      disabled_reason: null,
      updated_at: new Date().toISOString()
    });

    if (profileError) {
      return signupError("Sua conta foi criada, mas não conseguimos preparar sua área agora. Tente entrar novamente em instantes.", 500);
    }

    return Response.json({ ok: true });
  } catch {
    return signupError("Não conseguimos criar sua conta agora. Tente novamente em instantes.", 500);
  }
}

function signupError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function getSignupAdminErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("already") || normalized.includes("exists") || normalized.includes("registered")) {
    return "Este email já está cadastrado. Entre com sua senha ou use a recuperação de acesso.";
  }

  if (normalized.includes("password") && (normalized.includes("weak") || normalized.includes("short") || normalized.includes("6"))) {
    return "Use uma senha mais forte, com pelo menos 6 caracteres.";
  }

  if (normalized.includes("invalid") && normalized.includes("email")) {
    return "Confira o email informado. Ele precisa estar em um formato valido.";
  }

  if (normalized.includes("rate limit") || normalized.includes("too many")) {
    return "O cadastro ficou temporariamente limitado. Aguarde alguns minutos e tente novamente.";
  }

  return "Não conseguimos criar sua conta agora. Confira os dados e tente novamente.";
}
