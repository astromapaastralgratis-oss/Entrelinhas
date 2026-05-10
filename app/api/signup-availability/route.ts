import { createServiceClient } from "@/lib/admin";

export async function GET() {
  try {
    const serviceClient = createServiceClient();

    const [{ data: setting }, { count }] = await Promise.all([
      serviceClient.from("app_settings").select("value").eq("key", "signup_limits").maybeSingle(),
      serviceClient.from("profiles").select("id", { count: "exact", head: true }).eq("account_status", "active")
    ]);

    const maxActiveUsers = Number((setting?.value as { max_active_users?: number | null } | null)?.max_active_users);
    const limit = Number.isFinite(maxActiveUsers) && maxActiveUsers > 0 ? maxActiveUsers : null;
    const activeUsers = count ?? 0;

    return Response.json({
      allowed: limit === null || activeUsers < limit,
      activeUsers,
      maxActiveUsers: limit
    });
  } catch {
    return Response.json({ allowed: true, activeUsers: null, maxActiveUsers: null });
  }
}
