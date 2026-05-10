import { adminErrorResponse, requireAdminRequest } from "@/lib/admin";
import { getUtcDayStart } from "@/src/lib/entrelinhas";

export async function GET(request: Request) {
  try {
    const { serviceClient } = await requireAdminRequest(request);
    const todayStart = getUtcDayStart().toISOString();

    const [{ data: usersData, error: usersError }, { data: profiles }, { data: scripts }, { data: limits }] = await Promise.all([
      serviceClient.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      serviceClient
        .from("profiles")
        .select("id, full_name, account_status, disabled_at, disabled_reason, executive_presence_profile_id, executive_presence_completed_at, created_at"),
      serviceClient
        .from("generated_scripts")
        .select("user_id, situation, generation_mode, total_tokens_estimate, created_at"),
      serviceClient.from("user_script_limits").select("user_id, daily_ai_script_limit")
    ]);

    if (usersError) throw usersError;

    const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));
    const limitByUserId = new Map((limits ?? []).map((limit) => [limit.user_id, limit.daily_ai_script_limit]));
    const usageByUserId = new Map<
      string,
      {
        totalScripts: number;
        aiToday: number;
        totalTokensEstimate: number;
        dailyTokensEstimate: number;
        recentScripts: Array<{ situation: string; generationMode: string | null; totalTokensEstimate: number | null; createdAt: string }>;
      }
    >();

    for (const script of scripts ?? []) {
      const current = usageByUserId.get(script.user_id) ?? {
        totalScripts: 0,
        aiToday: 0,
        totalTokensEstimate: 0,
        dailyTokensEstimate: 0,
        recentScripts: []
      };
      const tokens = script.total_tokens_estimate ?? 0;
      current.totalScripts += 1;
      current.totalTokensEstimate += tokens;
      current.recentScripts.push({
        situation: script.situation,
        generationMode: script.generation_mode,
        totalTokensEstimate: script.total_tokens_estimate,
        createdAt: script.created_at
      });
      if (script.generation_mode === "ai_compact" && script.created_at >= todayStart) {
        current.aiToday += 1;
        current.dailyTokensEstimate += tokens;
      }
      usageByUserId.set(script.user_id, current);
    }

    const users = usersData.users.map((user) => {
      const profile = profileById.get(user.id);
      const usage = usageByUserId.get(user.id) ?? {
        totalScripts: 0,
        aiToday: 0,
        totalTokensEstimate: 0,
        dailyTokensEstimate: 0,
        recentScripts: []
      };

      return {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
        fullName: profile?.full_name ?? user.user_metadata?.full_name ?? null,
        accountStatus: profile?.account_status ?? "active",
        disabledAt: profile?.disabled_at ?? null,
        disabledReason: profile?.disabled_reason ?? null,
        executivePresenceProfileId: profile?.executive_presence_profile_id ?? null,
        executivePresenceCompletedAt: profile?.executive_presence_completed_at ?? null,
        dailyAiScriptLimit: limitByUserId.get(user.id) ?? null,
        ...usage,
        recentScripts: usage.recentScripts
          .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
          .slice(0, 5)
      };
    });

    return Response.json({ users });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
