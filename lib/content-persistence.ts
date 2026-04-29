import { supabase } from "@/lib/supabase";
import type {
  ContentCalendarRow,
  Database,
  ExportStatus,
  GeneratedPostRow
} from "@/types/database";
import type {
  EditorialCtaType,
  EditorialHistoryItem,
  EditorialPlanItem
} from "@/types/content";
import type { SupabaseClient } from "@supabase/supabase-js";

type DbClient = SupabaseClient<Database>;

export type RepetitionRiskResult = {
  allowed: boolean;
  riskScore: number;
  violations: string[];
  warnings: string[];
};

export type SaveGeneratedPostInput = {
  calendarId?: string | null;
  userId: string;
  item: EditorialPlanItem;
  title?: string;
  subtitle?: string;
  body?: string;
  caption?: string;
  hashtags?: string[];
  cta?: string;
  pinnedComment?: string;
  imagePrompt?: string;
  visualStyleId?: string | null;
  imageUrl?: string | null;
  exportStatus?: ExportStatus;
  promptTokensEstimate?: number;
  completionTokensEstimate?: number;
  totalTokensEstimate?: number;
  estimatedCost?: number;
  generationSource?: string;
  providerUsed?: string;
  modelUsed?: string;
  fallbackUsed?: boolean;
  errorMessage?: string | null;
};

export async function saveEditorialPlan(
  userId: string,
  plan: EditorialPlanItem[],
  client: DbClient | null = supabase
) {
  if (!client || plan.length === 0) return [];

  const rows = plan.map((item) => ({
    user_id: userId,
    date: item.date,
    moment_of_day: item.moment,
    platform: item.platform,
    format: item.format,
    objective: item.objective,
    science_base: item.scienceBase,
    theme: item.theme,
    hook_type: item.hookType,
    cta_type: item.ctaType,
    strategic_reason: item.strategicReason,
    status: "planned" as const
  }));

  const query = client
    .from("content_calendar")
    .upsert(rows, { onConflict: "user_id,date,moment_of_day,platform" })
    .select("*");

  const { data, error } = await query;
  if (error && /unique|constraint|conflict/i.test(error.message)) {
    const fallback = await client.from("content_calendar").insert(rows).select("*");
    if (fallback.error) throw fallback.error;
    return fallback.data ?? [];
  }
  if (error) throw error;
  return data ?? [];
}

export async function getRecentHistory(
  userId: string,
  options: { days?: number; limit?: number } = {},
  client: DbClient | null = supabase
): Promise<EditorialHistoryItem[]> {
  if (!client) return [];

  const days = options.days ?? 7;
  const limit = options.limit ?? 80;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await client
    .from("generation_history")
    .select("created_at, format, objective, science_base, theme, hook_type, cta_type")
    .eq("user_id", userId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  const { data: calendarData, error: calendarError } = await client
    .from("content_calendar")
    .select("date, moment_of_day, platform, format, objective, science_base, theme, hook_type, cta_type, created_at")
    .eq("user_id", userId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: false })
    .limit(limit);

  if (calendarError) throw calendarError;

  const generatedHistory: EditorialHistoryItem[] = (data ?? []).map((row) => ({
      date: row.created_at.slice(0, 10),
      moment: "noite",
      platform: "instagram",
      format: row.format,
      objective: row.objective,
      scienceBase: row.science_base,
      theme: row.theme,
      hookType: row.hook_type,
      ctaType: row.cta_type
    }));

  const calendarHistory: EditorialHistoryItem[] = (calendarData ?? []).map((row) => ({
    date: row.date,
    moment: row.moment_of_day,
    platform: row.platform,
    format: row.format,
    objective: row.objective,
    scienceBase: row.science_base,
    theme: row.theme,
    hookType: row.hook_type,
    ctaType: row.cta_type
  }));

  return [...generatedHistory, ...calendarHistory].slice(0, limit).reverse();
}

export function checkRepetitionRisk(
  candidate: EditorialPlanItem,
  history: EditorialHistoryItem[],
  options: { recurringThemes?: string[] } = {}
): RepetitionRiskResult {
  const violations: string[] = [];
  const warnings: string[] = [];
  const sameDay = history.filter((item) => item.date === candidate.date);
  const last = history.at(-1);
  const lastSameDay = sameDay.at(-1);
  const recurringThemes = options.recurringThemes ?? [];
  const isRecurringTheme = recurringThemes.includes(candidate.theme) || candidate.theme.toLowerCase().includes("recorrente");

  if (lastSameDay?.format === candidate.format) {
    violations.push("Mesmo formato em sequência no mesmo dia.");
  }

  if (last?.scienceBase === candidate.scienceBase) {
    violations.push("Mesma ciência base em conteúdos consecutivos.");
  }

  const ctaUsesToday = sameDay.filter((item) => item.ctaType === candidate.ctaType).length;
  if (candidate.ctaType !== "seguir página" && ctaUsesToday >= 2) {
    violations.push("Mesmo CTA usado mais de 2 vezes no dia.");
  }

  if (candidate.ctaType === "seguir página" && ctaUsesToday >= 2) {
    warnings.push("CTA de seguir pode repetir, mas a frase deve variar.");
  }

  const weekHookUses = history.filter((item) => item.hookType === candidate.hookType).length;
  if (weekHookUses >= 2) {
    violations.push("Mesmo tipo de gancho usado mais de 2 vezes na semana.");
  }

  const themeUsedRecently = history.some((item) => item.theme === candidate.theme);
  if (themeUsedRecently && !isRecurringTheme) {
    violations.push("Mesmo tema usado nos últimos 7 dias.");
  }

  return {
    allowed: violations.length === 0,
    riskScore: Math.min(10, violations.length * 3 + warnings.length),
    violations,
    warnings
  };
}

export async function saveGeneratedPost(input: SaveGeneratedPostInput, client: DbClient | null = supabase) {
  if (!client) return null;

  const postRow = {
    user_id: input.userId,
    calendar_id: input.calendarId ?? null,
    date: input.item.date,
    moment_of_day: input.item.moment,
    platform: input.item.platform,
    format: input.item.format,
    objective: input.item.objective,
    science_base: input.item.scienceBase,
    theme: input.item.theme,
    hook_type: input.item.hookType,
    title: input.title ?? null,
    subtitle: input.subtitle ?? null,
    body: input.body ?? null,
    caption: input.caption ?? null,
    hashtags: input.hashtags ?? [],
    cta: input.cta ?? null,
    pinned_comment: input.pinnedComment ?? null,
    image_prompt: input.imagePrompt ?? null,
    visual_style_id: input.visualStyleId ?? null,
    image_url: input.imageUrl ?? null,
    export_status: input.exportStatus ?? "not_exported",
    prompt_tokens_estimate: input.promptTokensEstimate ?? 0,
    completion_tokens_estimate: input.completionTokensEstimate ?? 0,
    total_tokens_estimate: input.totalTokensEstimate ?? 0,
    estimated_cost: input.estimatedCost ?? 0
  };

  const { data: post, error: postError } = await client
    .from("generated_posts")
    .insert(postRow)
    .select("*")
    .single();

  if (postError) throw postError;
  if (!post) return null;

  const historyRow = {
    user_id: input.userId,
    generated_post_id: post.id,
    format: input.item.format,
    objective: input.item.objective,
    science_base: input.item.scienceBase,
    theme: input.item.theme,
    hook_type: input.item.hookType,
    cta_type: input.item.ctaType,
    prompt_tokens_estimate: input.promptTokensEstimate ?? 0,
    completion_tokens_estimate: input.completionTokensEstimate ?? 0,
    total_tokens_estimate: input.totalTokensEstimate ?? 0,
    estimated_cost: input.estimatedCost ?? 0,
    generation_source: input.generationSource ?? "unknown",
    provider_used: input.providerUsed ?? input.generationSource ?? "unknown",
    model_used: input.modelUsed ?? null,
    fallback_used: input.fallbackUsed ?? false,
    error_message: input.errorMessage ?? null
  };

  const { error: historyError } = await client.from("generation_history").insert(historyRow);

  if (historyError) {
    const fallbackRow = {
      user_id: historyRow.user_id,
      generated_post_id: historyRow.generated_post_id,
      format: historyRow.format,
      objective: historyRow.objective,
      science_base: historyRow.science_base,
      theme: historyRow.theme,
      hook_type: historyRow.hook_type,
      cta_type: historyRow.cta_type,
      prompt_tokens_estimate: historyRow.prompt_tokens_estimate,
      completion_tokens_estimate: historyRow.completion_tokens_estimate,
      total_tokens_estimate: historyRow.total_tokens_estimate,
      estimated_cost: historyRow.estimated_cost,
      generation_source: historyRow.generation_source
    };
    const retry = await client.from("generation_history").insert(fallbackRow);
    if (retry.error) throw retry.error;
  }
  return post;
}

export async function recordAiGenerationUsage(
  input: {
    userId: string;
    generatedPostId?: string | null;
    model: string;
    promptTokensEstimate: number;
    completionTokensEstimate: number;
    totalTokensEstimate: number;
    estimatedCost: number;
    providerUsed?: string;
    fallbackUsed?: boolean;
    errorMessage?: string | null;
  },
  client: DbClient | null = supabase
) {
  if (!client) return null;

  const usageRow = {
      user_id: input.userId,
      generated_post_id: input.generatedPostId ?? null,
      model: input.model,
      prompt_tokens_estimate: input.promptTokensEstimate,
      completion_tokens_estimate: input.completionTokensEstimate,
      total_tokens_estimate: input.totalTokensEstimate,
      estimated_cost: input.estimatedCost,
      provider_used: input.providerUsed ?? "unknown",
      fallback_used: input.fallbackUsed ?? false,
      error_message: input.errorMessage ?? null
    };

  const { data, error } = await client
    .from("ai_generation_usage")
    .insert(usageRow)
    .select("*")
    .single();

  if (error) {
    const retry = await client
      .from("ai_generation_usage")
      .insert({
        user_id: usageRow.user_id,
        generated_post_id: usageRow.generated_post_id,
        model: usageRow.model,
        prompt_tokens_estimate: usageRow.prompt_tokens_estimate,
        completion_tokens_estimate: usageRow.completion_tokens_estimate,
        total_tokens_estimate: usageRow.total_tokens_estimate,
        estimated_cost: usageRow.estimated_cost
      })
      .select("*")
      .single();
    if (retry.error) throw retry.error;
    return retry.data;
  }
  return data;
}

export async function updatePostStatus(
  postId: string,
  exportStatus: ExportStatus,
  client: DbClient | null = supabase
): Promise<GeneratedPostRow | null> {
  if (!client) return null;

  const { data, error } = await client
    .from("generated_posts")
    .update({ export_status: exportStatus })
    .eq("id", postId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function updateProductionStatus(
  input: {
    userId: string;
    generatedPostId?: string | null;
    calendarId?: string | null;
    status:
      | "aprovado"
      | "publicado"
      | "imagem gerada"
      | "imagem pendente"
      | "copy gerada"
      | "planejado"
      | "precisa ajuste";
  },
  client: DbClient | null = supabase
) {
  if (!client) return null;

  const calendarStatus = mapProductionStatusToCalendar(input.status);
  const exportStatus = mapProductionStatusToExport(input.status);
  const errors: unknown[] = [];

  if (input.generatedPostId) {
    const { error } = await client
      .from("generated_posts")
      .update({ export_status: exportStatus })
      .eq("id", input.generatedPostId)
      .eq("user_id", input.userId);
    if (error) errors.push(error);
  }

  if (input.calendarId) {
    const { error } = await client
      .from("content_calendar")
      .update({ status: calendarStatus })
      .eq("id", input.calendarId)
      .eq("user_id", input.userId);
    if (error) errors.push(error);
  }

  if (errors[0]) throw errors[0];

  return { calendarStatus, exportStatus };
}

export async function getAiUsageSummary(
  userId: string,
  client: DbClient | null = supabase,
  now = new Date()
) {
  if (!client) {
    return { dailyCost: 0, weeklyCost: 0, monthlyCost: 0, dailyTokens: 0, weeklyTokens: 0, monthlyTokens: 0 };
  }

  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);
  const weekStart = new Date(dayStart);
  weekStart.setDate(dayStart.getDate() - dayStart.getDay());
  const monthStart = new Date(dayStart.getFullYear(), dayStart.getMonth(), 1);

  const { data, error } = await client
    .from("ai_generation_usage")
    .select("created_at, total_tokens_estimate, estimated_cost")
    .eq("user_id", userId)
    .gte("created_at", monthStart.toISOString());

  if (error) throw error;

  return (data ?? []).reduce(
    (summary, row) => {
      const createdAt = new Date(row.created_at);
      if (createdAt >= dayStart) {
        summary.dailyCost += row.estimated_cost;
        summary.dailyTokens += row.total_tokens_estimate;
      }
      if (createdAt >= weekStart) {
        summary.weeklyCost += row.estimated_cost;
        summary.weeklyTokens += row.total_tokens_estimate;
      }
      summary.monthlyCost += row.estimated_cost;
      summary.monthlyTokens += row.total_tokens_estimate;
      return summary;
    },
    { dailyCost: 0, weeklyCost: 0, monthlyCost: 0, dailyTokens: 0, weeklyTokens: 0, monthlyTokens: 0 }
  );
}

export async function getWeeklyPlan(
  userId: string,
  weekStart: Date | string,
  client: DbClient | null = supabase
): Promise<ContentCalendarRow[]> {
  if (!client) return [];

  const start = toDate(weekStart);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  const { data, error } = await client
    .from("content_calendar")
    .select("*")
    .eq("user_id", userId)
    .gte("date", toIsoDate(start))
    .lte("date", toIsoDate(end))
    .order("date", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export function calendarRowToHistoryItem(row: ContentCalendarRow): EditorialHistoryItem {
  return {
    date: row.date,
    moment: row.moment_of_day,
    platform: row.platform,
    format: row.format,
    objective: row.objective,
    scienceBase: row.science_base,
    theme: row.theme,
    hookType: row.hook_type,
    ctaType: row.cta_type
  };
}

export function getCtaVariant(ctaType: EditorialCtaType, usedTexts: string[]) {
  const variants: Record<EditorialCtaType, string[]> = {
    "seguir página": [
      "Siga a Astral Pessoal para receber sua direção do dia.",
      "Acompanhe a Astral Pessoal para mais clareza prática.",
      "Siga para transformar sinais do dia em escolhas melhores."
    ],
    salvar: ["Salve para consultar quando precisar.", "Guarde este ritual para hoje.", "Salve este guia rápido."],
    compartilhar: ["Compartilhe com quem precisa desse sinal.", "Envie para alguém que sentiria isso.", "Compartilhe nos stories se fez sentido."],
    comentar: ["Comente sua palavra do dia.", "Me conta nos comentários: qual parte pegou?", "Comente o sinal que apareceu para você."],
    "acessar link na bio": ["Acesse o link na bio para ver sua leitura.", "Abra o app pelo link na bio.", "Veja seu direcionamento completo no link da bio."],
    "gerar relatório no app": ["Gere seu relatório no app.", "Crie seu relatório Astral Pessoal.", "Abra o app e gere seu mapa de clareza."]
  };

  return variants[ctaType].find((text) => !usedTexts.includes(text)) ?? variants[ctaType][0];
}

function toDate(date: Date | string) {
  return typeof date === "string" ? new Date(`${date}T12:00:00`) : date;
}

function toIsoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function mapProductionStatusToCalendar(status: Parameters<typeof updateProductionStatus>[0]["status"]) {
  if (status === "publicado") return "published" as const;
  if (status === "aprovado") return "approved" as const;
  if (status === "copy gerada" || status === "imagem gerada" || status === "precisa ajuste") return "drafted" as const;
  return "planned" as const;
}

function mapProductionStatusToExport(status: Parameters<typeof updateProductionStatus>[0]["status"]): ExportStatus {
  if (status === "publicado") return "exported";
  if (status === "aprovado") return "ready";
  if (status === "imagem gerada") return "image_generated";
  if (status === "precisa ajuste") return "failed";
  return "not_exported";
}
