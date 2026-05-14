import { adminErrorResponse, requireAdminRequest } from "@/lib/admin";

export async function GET(request: Request) {
  try {
    const { serviceClient } = await requireAdminRequest(request);

    const [{ data: feedbacks, error: feedbacksError }, { data: usersData, error: usersError }, { data: profiles }] =
      await Promise.all([
        serviceClient
          .from("feedback_ex")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(50),
        serviceClient.auth.admin.listUsers({ page: 1, perPage: 1000 }),
        serviceClient.from("profiles").select("id, full_name")
      ]);

    if (feedbacksError) throw feedbacksError;
    if (usersError) throw usersError;

    const userById = new Map(usersData.users.map((user) => [user.id, user]));
    const profileById = new Map((profiles ?? []).map((profile) => [profile.id, profile]));

    return Response.json({
      feedbacks: (feedbacks ?? []).map((feedback) => {
        const user = userById.get(feedback.user_id);
        const profile = profileById.get(feedback.user_id);

        return {
          id: feedback.id,
          userId: feedback.user_id,
          resultId: feedback.result_id,
          email: user?.email ?? null,
          fullName: profile?.full_name ?? user?.user_metadata?.full_name ?? null,
          profileId: feedback.profile_id,
          personalizationRating: feedback.personalization_rating,
          depthRating: feedback.depth_rating,
          wouldShare: feedback.would_share,
          wouldReturn: feedback.would_return,
          toneRating: feedback.tone_rating,
          mostRealPart: feedback.most_real_part,
          genericPart: feedback.generic_part,
          improvementSuggestion: feedback.improvement_suggestion,
          methodologyVersion: feedback.methodology_version,
          createdAt: feedback.created_at
        };
      })
    });
  } catch (error) {
    return adminErrorResponse(error);
  }
}
