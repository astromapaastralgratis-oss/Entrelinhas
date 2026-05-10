import { adminErrorResponse, requireAdminRequest } from "@/lib/admin";

export async function GET(request: Request) {
  try {
    const { serviceClient } = await requireAdminRequest(request);
    const [{ data: setting }, { count }] = await Promise.all([
      serviceClient.from("app_settings").select("value, updated_at").eq("key", "signup_limits").maybeSingle(),
      serviceClient.from("profiles").select("id", { count: "exact", head: true }).eq("account_status", "active")
    ]);

    return Response.json({
      signupLimits: setting?.value ?? { max_active_users: null },
      activeUsers: count ?? 0,
      updatedAt: setting?.updated_at ?? null
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const { serviceClient } = await requireAdminRequest(request);
    const body = await request.json();
    const maxActiveUsers = body.maxActiveUsers === "" || body.maxActiveUsers == null ? null : Number(body.maxActiveUsers);

    if (maxActiveUsers !== null && (!Number.isInteger(maxActiveUsers) || maxActiveUsers < 1)) {
      return Response.json({ error: "Informe um limite valido." }, { status: 400 });
    }

    const { error } = await serviceClient.from("app_settings").upsert({
      key: "signup_limits",
      value: { max_active_users: maxActiveUsers },
      updated_at: new Date().toISOString()
    });

    if (error) throw error;

    return Response.json({ ok: true, signupLimits: { max_active_users: maxActiveUsers } });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
