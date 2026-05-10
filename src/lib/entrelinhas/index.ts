export {
  buildCompactExecutivePresenceContext,
  buildCompactExecutivePrompt,
  buildDeterministicExecutiveScript,
  buildDeterministicExecutiveSections,
  composeExecutiveScript,
  mergeAiExecutiveJsonWithFallback
} from "@/src/lib/entrelinhas/economicMentor";
export type { CompactExecutivePresenceContext, ExecutiveScriptSections } from "@/src/lib/entrelinhas/economicMentor";
export {
  buildMentorEconomicsMetadata,
  estimateTokens,
  getDailyAiScriptLimit,
  getUtcDayStart,
  hasReachedDailyAiLimit
} from "@/src/lib/entrelinhas/mentorEconomics";
export type { MentorEconomicsMetadata, MentorGenerationMode } from "@/src/lib/entrelinhas/mentorEconomics";
