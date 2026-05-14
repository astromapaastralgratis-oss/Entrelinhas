import { adminErrorResponse, requireAdminRequest } from "@/lib/admin";

export async function PATCH(request: Request, { params }: { params: { userId: string } }) {
  try {
    const { userId: adminUserId, serviceClient } = await requireAdminRequest(request);
    const body = await request.json();
    const userId = params.userId;

    if (body.action === "set_limit") {
      const dailyAiScriptLimit = body.dailyAiScriptLimit === "" || body.dailyAiScriptLimit == null ? null : Number(body.dailyAiScriptLimit);
      if (dailyAiScriptLimit !== null && (!Number.isInteger(dailyAiScriptLimit) || dailyAiScriptLimit < 0)) {
        return Response.json({ error: "Informe um limite valido." }, { status: 400 });
      }

      const { error } = await serviceClient.from("user_script_limits").upsert({
        user_id: userId,
        daily_ai_script_limit: dailyAiScriptLimit,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      return Response.json({ ok: true });
    }

    if (body.action === "disable" || body.action === "reactivate") {
      const disabled = body.action === "disable";
      const { error } = await serviceClient.from("profiles").upsert({
        id: userId,
        account_status: disabled ? "disabled" : "active",
        disabled_at: disabled ? new Date().toISOString() : null,
        disabled_reason: disabled ? String(body.disabledReason ?? "Desativada pelo admin.") : null,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      return Response.json({ ok: true });
    }

    if (body.action === "set_password") {
      const password = String(body.password ?? "");
      if (password.length < 6) return Response.json({ error: "A senha precisa ter pelo menos 6 caracteres." }, { status: 400 });
      const { error } = await serviceClient.auth.admin.updateUserById(userId, { password });
      if (error) throw error;
      return Response.json({ ok: true });
    }

    if (body.action === "send_reset") {
      const email = String(body.email ?? "");
      if (!email) return Response.json({ error: "Email indisponivel." }, { status: 400 });
      const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin}/update-password`;
      const { error } = await serviceClient.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      return Response.json({ ok: true });
    }

    if (body.action === "delete_user") {
      if (userId === adminUserId) {
        return Response.json({ error: "Você não pode excluir sua própria conta administrativa." }, { status: 400 });
      }

      await Promise.all([
        serviceClient.from("user_script_limits").delete().eq("user_id", userId),
        serviceClient.from("profiles").delete().eq("id", userId)
      ]);

      const { error } = await serviceClient.auth.admin.deleteUser(userId);
      if (error) throw error;

      return Response.json({ ok: true });
    }

    return Response.json({ error: "Acao invalida." }, { status: 400 });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
