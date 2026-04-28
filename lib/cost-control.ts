import type {
  AutomationMode,
  AutomationModePolicy,
  AutomationSettings,
  AutomationUsage,
  BudgetDecision,
  TokenBudget
} from "@/types/automation";

export const defaultCopyModel = process.env.OPENAI_COPY_MODEL ?? "gpt-5.2";

const estimatedPricePerMillionTokens = {
  input: Number(process.env.OPENAI_COPY_INPUT_USD_PER_1M ?? 1.25),
  output: Number(process.env.OPENAI_COPY_OUTPUT_USD_PER_1M ?? 10)
};

export function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export function estimateCopyCost(inputTokens: number, outputTokens: number) {
  const inputCost = (inputTokens / 1_000_000) * estimatedPricePerMillionTokens.input;
  const outputCost = (outputTokens / 1_000_000) * estimatedPricePerMillionTokens.output;
  return Number((inputCost + outputCost).toFixed(6));
}

export function getDailyAiCostLimit() {
  return Number(process.env.AI_DAILY_COST_LIMIT_USD ?? process.env.NEXT_PUBLIC_AI_DAILY_COST_LIMIT_USD ?? 1);
}

export function shouldBlockForDailyLimit(currentDailyCost: number, nextCost: number, intensity?: string) {
  const dailyLimit = getDailyAiCostLimit();
  const projected = currentDailyCost + nextCost;

  return {
    blocked: intensity === "intensa" && projected > dailyLimit,
    dailyLimit,
    projected,
    reason:
      intensity === "intensa" && projected > dailyLimit
        ? `Geração intensa bloqueada: custo projetado ${projected.toFixed(4)} excede limite diário ${dailyLimit.toFixed(4)}.`
        : undefined
  };
}

export const defaultAutomationSettings: AutomationSettings = {
  dailyGenerationLimit: 12,
  weeklyGenerationLimit: 60,
  monthlyCostLimit: 50,
  mode: "economico",
  automaticGenerationEnabled: false,
  lockedWeeklyThemes: []
};

export const defaultAutomationUsage: AutomationUsage = {
  dailyGenerations: 0,
  weeklyGenerations: 0,
  monthlyEstimatedCost: 0,
  dailyTokens: 0,
  weeklyTokens: 0
};

export const modePolicies: Record<AutomationMode, AutomationModePolicy> = {
  economico: {
    mode: "economico",
    label: "Modo economico",
    intensity: "leve",
    aiFields: ["hook", "caption"],
    variationLimit: 1,
    allowAbTest: false,
    reuseCarouselStructure: true,
    useTemplateHashtags: true,
    useTemplateCtas: true,
    copyCompleteness: "minimal"
  },
  padrao: {
    mode: "padrao",
    label: "Modo padrao",
    intensity: "padrão",
    aiFields: ["hook", "copy", "caption", "visual_prompt"],
    variationLimit: 1,
    allowAbTest: false,
    reuseCarouselStructure: true,
    useTemplateHashtags: true,
    useTemplateCtas: true,
    copyCompleteness: "complete"
  },
  crescimento: {
    mode: "crescimento",
    label: "Modo crescimento",
    intensity: "intensa",
    aiFields: ["hook", "copy", "caption", "creative_variation", "visual_prompt"],
    variationLimit: 2,
    allowAbTest: true,
    reuseCarouselStructure: false,
    useTemplateHashtags: true,
    useTemplateCtas: true,
    copyCompleteness: "variations"
  }
};

export function getModePolicy(mode: AutomationMode = defaultAutomationSettings.mode) {
  return modePolicies[mode];
}

export function buildTokenBudget(
  settings: AutomationSettings = defaultAutomationSettings,
  usage: AutomationUsage = defaultAutomationUsage
): TokenBudget {
  return {
    dailyLimit: Number(process.env.NEXT_PUBLIC_AI_DAILY_TOKEN_LIMIT ?? 10000),
    weeklyLimit: Number(process.env.NEXT_PUBLIC_AI_WEEKLY_TOKEN_LIMIT ?? 50000),
    monthlyCostLimit: settings.monthlyCostLimit,
    currentUsage: usage.dailyTokens,
    mode: settings.mode
  };
}

export function decideBudget(input: {
  estimatedTokens: number;
  estimatedCost: number;
  settings?: AutomationSettings;
  usage?: AutomationUsage;
  isBulkRegeneration?: boolean;
}): BudgetDecision {
  const settings = input.settings ?? defaultAutomationSettings;
  const usage = input.usage ?? defaultAutomationUsage;
  const budget = buildTokenBudget(settings, usage);
  const projectedTokens = usage.dailyTokens + input.estimatedTokens;
  const projectedWeeklyTokens = usage.weeklyTokens + input.estimatedTokens;
  const projectedMonthlyCost = usage.monthlyEstimatedCost + input.estimatedCost;
  const alerts = getAutomationAlerts({ ...usage, dailyTokens: projectedTokens }, settings);

  if (input.isBulkRegeneration) {
    return {
      allowed: false,
      alerts: [{ level: "danger", message: "Regere apenas este conteúdo." }],
      projectedTokens,
      projectedMonthlyCost,
      reason: "Regeneracao em massa exige confirmacao manual."
    };
  }

  if (usage.dailyGenerations >= settings.dailyGenerationLimit) {
    return {
      allowed: false,
      alerts,
      projectedTokens,
      projectedMonthlyCost,
      reason: "Limite diario de geracoes atingido."
    };
  }

  if (usage.weeklyGenerations >= settings.weeklyGenerationLimit) {
    return {
      allowed: false,
      alerts,
      projectedTokens,
      projectedMonthlyCost,
      reason: "Limite semanal de geracoes atingido."
    };
  }

  if (projectedTokens > budget.dailyLimit || projectedWeeklyTokens > budget.weeklyLimit) {
    return {
      allowed: false,
      alerts: [...alerts, { level: "warning", message: "Use modo econômico para continuar." }],
      projectedTokens,
      projectedMonthlyCost,
      reason: "Limite de tokens projetado excedido."
    };
  }

  if (projectedMonthlyCost > settings.monthlyCostLimit) {
    return {
      allowed: false,
      alerts,
      projectedTokens,
      projectedMonthlyCost,
      reason: "Limite mensal estimado de custo excedido."
    };
  }

  return {
    allowed: true,
    alerts,
    projectedTokens,
    projectedMonthlyCost
  };
}

export function getAutomationAlerts(
  usage: AutomationUsage = defaultAutomationUsage,
  settings: AutomationSettings = defaultAutomationSettings
) {
  const budget = buildTokenBudget(settings, usage);
  const alerts = [];

  if (usage.dailyTokens >= budget.dailyLimit * 0.8) {
    alerts.push({ level: "warning" as const, message: "Você está perto do limite diário." });
  }

  if (settings.mode !== "economico" && usage.monthlyEstimatedCost >= settings.monthlyCostLimit * 0.75) {
    alerts.push({ level: "warning" as const, message: "Use modo econômico para continuar." });
  }

  alerts.push({ level: "info" as const, message: "Regere apenas este conteúdo." });
  return alerts;
}
