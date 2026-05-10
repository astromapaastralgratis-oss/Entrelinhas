export type MentorGenerationMode = "ai_compact" | "deterministic_fallback";

export type MentorEconomicsMetadata = {
  generationMode: MentorGenerationMode;
  fallbackUsed: boolean;
  promptTokensEstimate: number;
  completionTokensEstimate: number;
  totalTokensEstimate: number;
  dailyAiLimitReached: boolean;
};

export function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export function getUtcDayStart(date = new Date()) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function getDailyAiScriptLimit() {
  const configuredLimit = Number(process.env.ENTRELINHAS_DAILY_AI_SCRIPT_LIMIT);
  return Number.isFinite(configuredLimit) && configuredLimit > 0 ? configuredLimit : 5;
}

export function hasReachedDailyAiLimit(usedToday: number, limit = getDailyAiScriptLimit()) {
  return usedToday >= limit;
}

export function buildMentorEconomicsMetadata(input: {
  generationMode: MentorGenerationMode;
  fallbackUsed: boolean;
  promptText: string;
  responseText: string;
  dailyAiLimitReached?: boolean;
}): MentorEconomicsMetadata {
  const promptTokensEstimate = estimateTokens(input.promptText);
  const completionTokensEstimate = estimateTokens(input.responseText);

  return {
    generationMode: input.generationMode,
    fallbackUsed: input.fallbackUsed,
    promptTokensEstimate,
    completionTokensEstimate,
    totalTokensEstimate: promptTokensEstimate + completionTokensEstimate,
    dailyAiLimitReached: Boolean(input.dailyAiLimitReached)
  };
}
