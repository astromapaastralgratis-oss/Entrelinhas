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

  const { data, error } = await client
    .from("content_calendar")
    .insert(rows)
    .select("*");

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

  return (data ?? [])
    .reverse()
    .map((row) => ({
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

  const { error: historyError } = await client.from("generation_history").insert({
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
    generation_source: input.generationSource ?? "unknown"
  });

  if (historyError) throw historyError;
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
  },
  client: DbClient | null = supabase
) {
  if (!client) return null;

  const { data, error } = await client
    .from("ai_generation_usage")
    .insert({
      user_id: input.userId,
      generated_post_id: input.generatedPostId ?? null,
      model: input.model,
      prompt_tokens_estimate: input.promptTokensEstimate,
      completion_tokens_estimate: input.completionTokensEstimate,
      total_tokens_estimate: input.totalTokensEstimate,
      estimated_cost: input.estimatedCost
    })
    .select("*")
    .single();

  if (error) throw error;
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
