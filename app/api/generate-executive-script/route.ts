import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import type { ExecutiveScriptInput } from "@/lib/entrelinhas";
import {
  buildCompactExecutivePresenceContext,
  buildCompactExecutivePrompt,
  buildDeterministicExecutiveSections,
  buildMentorEconomicsMetadata,
  composeExecutiveScript,
  getDailyAiScriptLimit,
  getUtcDayStart,
  hasReachedDailyAiLimit,
  mergeAiExecutiveJsonWithFallback
} from "@/src/lib/entrelinhas";

const systemPrompt =
  "Voce e a mentora executiva do Entrelinhas. Retorne apenas JSON valido com as chaves strategicReading, avoid, bestPosture, suggestedScript e shortVersion. Seja executiva, clara, humana, elegante, firme sem agressividade e pratica. Nao escreva markdown, nao escreva texto fora do JSON.";

const aiResponseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["strategicReading", "avoid", "bestPosture", "suggestedScript", "shortVersion"],
  properties: {
    strategicReading: { type: "string" },
    avoid: { type: "string" },
    bestPosture: { type: "string" },
    suggestedScript: { type: "string" },
    shortVersion: { type: "string" }
  }
} as const;

export async function POST(request: Request) {
  const input = (await request.json()) as ExecutiveScriptInput;
  const authContext = await loadAuthContext(request);
  const executivePresence = authContext?.executivePresence ?? null;
  const fallbackSections = buildDeterministicExecutiveSections(input, executivePresence);
  const fallbackResponse = composeExecutiveScript(fallbackSections);
  const fallbackPromptText = "deterministic_fallback";
  const dailyAiLimitReached = authContext ? hasReachedDailyAiLimit(authContext.dailyAiUsage, getDailyAiScriptLimit()) : false;

  if (dailyAiLimitReached || !process.env.OPENAI_API_KEY) {
    const metadata = buildMentorEconomicsMetadata({
      generationMode: "deterministic_fallback",
      fallbackUsed: true,
      promptText: fallbackPromptText,
      responseText: fallbackResponse,
      dailyAiLimitReached
    });

    return NextResponse.json({
      response: fallbackResponse,
      fallback: true,
      generationMode: metadata.generationMode,
      usedExecutivePresence: Boolean(executivePresence),
      promptTokensEstimate: metadata.promptTokensEstimate,
      completionTokensEstimate: metadata.completionTokensEstimate,
      totalTokensEstimate: metadata.totalTokensEstimate,
      dailyAiLimitReached: metadata.dailyAiLimitReached
    });
  }

  try {
    const prompt = buildCompactExecutivePrompt(input, fallbackSections, executivePresence);
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_COPY_MODEL ?? "gpt-5.2",
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt }
        ],
        text: {
          format: {
            type: "json_schema",
            name: "entrelinhas_executive_script",
            strict: true,
            schema: aiResponseSchema
          }
        }
      })
    });

    if (!response.ok) {
      const metadata = buildMentorEconomicsMetadata({
        generationMode: "deterministic_fallback",
        fallbackUsed: true,
        promptText: prompt,
        responseText: fallbackResponse
      });

      return NextResponse.json({
        response: fallbackResponse,
        fallback: true,
        generationMode: metadata.generationMode,
        usedExecutivePresence: Boolean(executivePresence),
        promptTokensEstimate: metadata.promptTokensEstimate,
        completionTokensEstimate: metadata.completionTokensEstimate,
        totalTokensEstimate: metadata.totalTokensEstimate,
        dailyAiLimitReached: metadata.dailyAiLimitReached
      });
    }

    const data = await response.json();
    const output = extractOpenAiOutputText(data);
    const merged = mergeAiExecutiveJsonWithFallback(output, fallbackSections);
    const finalResponse = composeExecutiveScript(merged.sections);
    const generationMode = merged.usedAiFields ? "ai_compact" : "deterministic_fallback";
    const metadata = buildMentorEconomicsMetadata({
      generationMode,
      fallbackUsed: !merged.usedAiFields,
      promptText: prompt,
      responseText: finalResponse
    });

    return NextResponse.json({
      response: finalResponse,
      fallback: metadata.fallbackUsed,
      generationMode: metadata.generationMode,
      usedExecutivePresence: Boolean(executivePresence),
      promptTokensEstimate: metadata.promptTokensEstimate,
      completionTokensEstimate: metadata.completionTokensEstimate,
      totalTokensEstimate: metadata.totalTokensEstimate,
      dailyAiLimitReached: metadata.dailyAiLimitReached
    });
  } catch {
    const metadata = buildMentorEconomicsMetadata({
      generationMode: "deterministic_fallback",
      fallbackUsed: true,
      promptText: fallbackPromptText,
      responseText: fallbackResponse
    });

    return NextResponse.json({
      response: fallbackResponse,
      fallback: true,
      generationMode: metadata.generationMode,
      usedExecutivePresence: Boolean(executivePresence),
      promptTokensEstimate: metadata.promptTokensEstimate,
      completionTokensEstimate: metadata.completionTokensEstimate,
      totalTokensEstimate: metadata.totalTokensEstimate,
      dailyAiLimitReached: metadata.dailyAiLimitReached
    });
  }
}

async function loadAuthContext(request: Request) {
  const token = getBearerToken(request);
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!token || !supabaseUrl || !supabaseAnonKey) return null;

  try {
    const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } }
    });

    const { data: userData } = await client.auth.getUser(token);
    const user = userData.user;
    if (!user) return null;

    const [{ data: executivePresenceRow }, { count }] = await Promise.all([
      client
      .from("executive_presence_results")
      .select("profile_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
        .maybeSingle(),
      client
        .from("generated_scripts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("generation_mode", "ai_compact")
        .gte("created_at", getUtcDayStart().toISOString())
    ]);

    return {
      userId: user.id,
      dailyAiUsage: count ?? 0,
      executivePresence: buildCompactExecutivePresenceContext(executivePresenceRow)
    };
  } catch {
    return null;
  }
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization");
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? null;
}

function extractOpenAiOutputText(data: any) {
  const outputText =
    data.output_text ??
    data.output?.flatMap((item: any) => item.content ?? []).find((content: any) => content.type === "output_text")?.text;

  return typeof outputText === "string" ? outputText : "";
}
