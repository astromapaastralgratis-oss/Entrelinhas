"use client";

import { Activity, Archive, Database, MoonStar, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { LibraryPanel } from "@/components/LibraryPanel";
import { PerformanceManual } from "@/components/PerformanceManual";
import { ProductionContentCard } from "@/components/ProductionContentCard";
import { ProductionToolbar } from "@/components/ProductionToolbar";
import { ReadyToPost } from "@/components/ReadyToPost";
import { ShortVideoStudio } from "@/components/ShortVideoStudio";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { AutomationSettingsPanel } from "@/components/AutomationSettingsPanel";
import { OperationLogPanel } from "@/components/OperationLogPanel";
import { applyLockedThemes, createGenerationCacheKey, getModeContentIntensity } from "@/lib/automation-engine";
import {
  getRecentHistory,
  recordAiGenerationUsage,
  saveEditorialPlan,
  saveGeneratedPost,
  updateProductionStatus
} from "@/lib/content-persistence";
import { decideBudget, defaultAutomationSettings } from "@/lib/cost-control";
import { generateEditorialPlan, generateWeeklyEditorialPlan } from "@/lib/editorial-engine";
import { generateVisualPromptsForContent } from "@/lib/visual-prompts";
import { calculateQualityScore, needsAdjustment } from "@/lib/quality-score";
import { createLearningRecommendation } from "@/lib/performance-learning";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { createOperationLog, friendlyErrorMessage, logOperation, type OperationLog } from "@/lib/operation-logger";
import type { EditorialHistoryItem, EditorialPlanItem } from "@/types/content";
import type { GenerateCopyResult } from "@/types/copy";
import type { PerformanceMetrics } from "@/types/performance";
import type { ProductionContent, ProductionStatus } from "@/types/production";
import type { AutomationSettings } from "@/types/automation";

const editorialMockHistory: EditorialHistoryItem[] = [
  {
    date: "2026-04-24",
    moment: "noite",
    platform: "instagram",
    format: "stories",
    objective: "engajar",
    scienceBase: "cor",
    theme: "energia afetiva e social",
    hookType: "pergunta direta",
    ctaType: "comentar"
  },
  {
    date: "2026-04-25",
    moment: "tarde",
    platform: "instagram",
    format: "feed",
    objective: "levar para app",
    scienceBase: "cristal",
    theme: "autoconhecimento leve",
    hookType: "curiosidade",
    ctaType: "acessar link na bio"
  }
];

export function Dashboard() {
  const [remoteHistory, setRemoteHistory] = useState<EditorialHistoryItem[]>([]);
  const [contents, setContents] = useState<ProductionContent[]>(() =>
    createProductionContents(generateEditorialPlan(new Date(), "padrão", "ganhar seguidores", editorialMockHistory))
  );
  const [weeklyPlan, setWeeklyPlan] = useState<EditorialPlanItem[] | null>(null);
  const [weeklyContents, setWeeklyContents] = useState<ProductionContent[]>([]);
  const [libraryVisible, setLibraryVisible] = useState(false);
  const [activeScreen, setActiveScreen] = useState<"production" | "performance" | "shortVideos" | "ready">("production");
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);
  const [generatingImageKey, setGeneratingImageKey] = useState<string | null>(null);
  const [automationSettings, setAutomationSettings] = useState<AutomationSettings>(defaultAutomationSettings);
  const [generationCache, setGenerationCache] = useState<Record<string, GenerateCopyResult>>({});
  const [budgetMessage, setBudgetMessage] = useState<string | null>(null);
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([]);
  const [persistenceStatus, setPersistenceStatus] = useState<"offline" | "ready" | "synced" | "error">(
    isSupabaseConfigured ? "ready" : "offline"
  );

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      if (!supabase) return;
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (!user) return;

      try {
        const history = await getRecentHistory(user.id, { days: 7 });
        if (!isMounted) return;
        setRemoteHistory(history);
        setPersistenceStatus("synced");
      } catch (error) {
        if (isMounted) setPersistenceStatus("error");
        addLog("supabase_error", friendlyErrorMessage(error), { context: "load_recent_history" }, "error");
        addLog("supabase_error", "Falha ao carregar histórico do Supabase.", undefined, "error");
      }
    }

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("astral-performance-metrics");
      if (saved) setPerformanceMetrics(JSON.parse(saved) as PerformanceMetrics[]);
    } catch {
      // Local persistence is a convenience; Supabase remains the durable store once connected.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("astral-performance-metrics", JSON.stringify(performanceMetrics));
    } catch {
      // Ignore quota/privacy-mode failures without breaking the daily flow.
    }
  }, [performanceMetrics]);

  const summary = useMemo(
    () => ({
      total: contents.length,
      generated: contents.filter((content) => content.copy).length,
      approved: contents.filter((content) => content.status === "aprovado").length,
      published: contents.filter((content) => content.status === "publicado").length,
      needsAdjustment: contents.filter((content) => needsAdjustment(content.qualityScore)).length
    }),
    [contents]
  );

  const automationUsage = useMemo(() => {
    const allContents = [...contents, ...weeklyContents];
    const allCopies = allContents.map((content) => content.copy).filter(Boolean) as GenerateCopyResult[];
    const dailyCopies = contents.map((content) => content.copy).filter(Boolean) as GenerateCopyResult[];

    return {
      dailyGenerations: dailyCopies.length,
      weeklyGenerations: allCopies.length,
      monthlyEstimatedCost: allCopies.reduce((total, copy) => total + copy.cost.estimatedCost, 0),
      dailyTokens: dailyCopies.reduce((total, copy) => total + copy.cost.totalTokensEstimate, 0),
      weeklyTokens: allCopies.reduce((total, copy) => total + copy.cost.totalTokensEstimate, 0)
    };
  }, [contents, weeklyContents]);

  async function handleGenerateToday() {
    const history = getLearningAwareHistory();
    const intensity = getModeContentIntensity(automationSettings.mode);
    const plan = applyLockedThemes(
      generateEditorialPlan(new Date(), intensity, "ganhar seguidores", history),
      automationSettings.lockedWeeklyThemes
    );
    setContents(createProductionContents(plan));
    setLibraryVisible(false);
    addLog("generation_started", "Plano do dia gerado por regras.", { count: plan.length });

    if (!supabase) return;
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const savedRows = await saveEditorialPlan(user.id, plan);
      setContents((current) => attachCalendarIds(current, savedRows));
      setPersistenceStatus("synced");
      addLog("generation_completed", "Plano do dia salvo no Supabase.", { count: plan.length });
    } catch (error) {
      setPersistenceStatus("error");
      addLog("supabase_error", friendlyErrorMessage(error), { context: "save_today_plan" }, "error");
    }
  }

  async function handleGenerateWeek() {
    const history = getLearningAwareHistory();
    const intensity = getModeContentIntensity(automationSettings.mode);
    const plan = applyLockedThemes(
      generateWeeklyEditorialPlan(new Date(), intensity, "ganhar seguidores", history),
      automationSettings.lockedWeeklyThemes
    );
    const firstDate = plan[0]?.date;
    const dayPlan = firstDate ? plan.filter((item) => item.date === firstDate) : [];
    setWeeklyPlan(plan);
    setWeeklyContents(createProductionContents(plan));
    setContents(createProductionContents(dayPlan));

    if (!supabase) return;
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const savedRows = await saveEditorialPlan(user.id, plan);
      setContents((current) => attachCalendarIds(current, savedRows));
      setWeeklyContents((current) => attachCalendarIds(current, savedRows));
      setPersistenceStatus("synced");
      addLog("generation_completed", "Plano semanal salvo no Supabase.", { count: plan.length });
    } catch {
      setPersistenceStatus("error");
      addLog("supabase_error", "Falha ao salvar plano semanal no Supabase.", undefined, "error");
    }
  }

  function getLearningAwareHistory() {
    const baseHistory = remoteHistory.length > 0 ? remoteHistory : editorialMockHistory;
    const recommendation = createLearningRecommendation(performanceMetrics);

    if (!recommendation.format) return baseHistory;

    const learnedHistoryItem: EditorialHistoryItem = {
      date: new Date(Date.now() - 86_400_000).toISOString().slice(0, 10),
      moment: recommendation.moment ?? "noite",
      platform: "instagram",
      format: recommendation.format,
      objective: "ganhar seguidores",
      scienceBase: recommendation.scienceBase ?? "energia emocional",
      theme: recommendation.theme ?? "aprendizado da semana",
      hookType: recommendation.hookType ?? "curiosidade",
      ctaType: recommendation.ctaType ?? "seguir página"
    };

    return [
      ...baseHistory,
      learnedHistoryItem
    ];
  }

  async function handleRegenerateCopy(content: ProductionContent) {
    setGeneratingKey(content.id);
    setBudgetMessage(null);
    addLog("generation_started", "Geração de copy iniciada.", { format: content.plan.format, theme: content.plan.theme });

    try {
      const cacheKey = createGenerationCacheKey(content.plan, automationSettings.mode, content.regeneratedCount);
      const cachedCopy = generationCache[cacheKey];

      if (cachedCopy) {
        updateContent(content.id, (current) => withCopy(current, { ...cachedCopy, cost: { ...cachedCopy.cost, cached: true } }));
        return;
      }

      const budgetDecision = decideBudget({
        estimatedTokens: automationSettings.mode === "crescimento" ? 900 : automationSettings.mode === "padrao" ? 620 : 260,
        estimatedCost: automationSettings.mode === "crescimento" ? 0.012 : automationSettings.mode === "padrao" ? 0.007 : 0.003,
        settings: automationSettings,
        usage: automationUsage
      });

      if (!budgetDecision.allowed) {
        const message = friendlyErrorMessage(budgetDecision.reason ?? "Limite de custo atingido.");
        setBudgetMessage(message);
        addLog("estimated_cost", message, { projectedTokens: budgetDecision.projectedTokens }, "warning");
        return;
      }

      const session = supabase ? await supabase.auth.getSession() : null;
      const accessToken = session?.data.session?.access_token;
      const response = await fetch("/api/generate-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
          planItem: content.plan,
          planItemId: content.calendarId,
          intensity: getModeContentIntensity(automationSettings.mode),
          automationMode: automationSettings.mode,
          currentDailyCost: contents.reduce((total, item) => total + (item.copy?.cost.estimatedCost ?? 0), 0),
          provider: "auto"
        })
      });

      const result = (await response.json()) as GenerateCopyResult & { savedPostId?: string | null; error?: string };
      if (!response.ok) {
        const message = friendlyErrorMessage(result.cost?.reason ?? result.error ?? "Não foi possível gerar copy agora.");
        setBudgetMessage(message);
        addLog("ai_error", message, { status: response.status }, "error");
        return;
      }

      updateContent(content.id, (current) => withCopy(current, result, result.savedPostId));
      setGenerationCache((current) => ({ ...current, [cacheKey]: result }));
      if (!result.savedPostId) await persistGeneratedCopy(content, result);
      addLog("generation_completed", "Copy gerada e validada.", {
        source: result.source,
        provider: result.cost.providerUsed ?? "auto",
        estimatedCost: result.cost.estimatedCost
      });
      addLog("estimated_cost", "Custo estimado registrado.", { estimatedCost: result.cost.estimatedCost });
    } finally {
      setGeneratingKey(null);
    }
  }

  function handleRegenerateVisual(content: ProductionContent) {
    updateContent(content.id, (current) => {
      const visualPrompts = generateVisualPromptsForContent(current.plan, current.copy?.copy, current.regeneratedCount + 1);
      const next = {
        ...current,
        visualPrompts,
        regeneratedCount: current.regeneratedCount + 1,
        status: current.copy ? "imagem pendente" : current.status
      };
      return { ...next, qualityScore: calculateQualityScore(next) };
    });
  }

  async function handleGenerateImage(content: ProductionContent, promptIndex: number) {
    const prompt = content.visualPrompts[promptIndex];
    if (!prompt) return;

    setGeneratingImageKey(`${content.id}-${promptIndex}`);
    setBudgetMessage(null);

    try {
      let generatedPostId = content.generatedPostId;

      if (!generatedPostId && content.copy) {
        generatedPostId = await persistGeneratedCopy(content, content.copy);
        if (generatedPostId) {
          updateContent(content.id, (current) => ({ ...current, generatedPostId }));
        }
      }

      const session = supabase ? await supabase.auth.getSession() : null;
      const accessToken = session?.data.session?.access_token;
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({
          generatedPostId: generatedPostId ?? undefined,
          format: content.plan.format,
          ratio: prompt.ratio,
          title: prompt.textBlocks.find((block) => block.type === "title")?.text ?? content.copy?.copy.title ?? content.plan.theme,
          subtitle:
            prompt.textBlocks.find((block) => block.type === "subtitle")?.text ??
            content.copy?.copy.subtitle ??
            content.plan.strategicReason,
          cta: prompt.textBlocks.find((block) => block.type === "cta")?.text ?? content.copy?.copy.cta ?? content.plan.ctaType,
          scienceBase: content.plan.scienceBase,
          visualStyle: prompt.styleName,
          prompt: prompt.prompt,
          negativePrompt: prompt.negativePrompt,
          date: content.plan.date,
          moment: content.plan.moment,
          cardIndex: promptIndex + 1
        })
      });

      const result = await response.json();
      if (!response.ok) {
        const message = friendlyErrorMessage(result.error ?? "Não foi possível gerar a imagem agora.");
        setBudgetMessage(message);
        addLog("image_error", message, { status: response.status }, "error");
        return;
      }

      updateContent(content.id, (current) => {
        const visualPrompts = current.visualPrompts.map((item, index) =>
          index === promptIndex
            ? {
                ...item,
                imageUrl: result.imageUrl,
                storagePath: result.storagePath,
                exportStatus: result.exportStatus,
                estimatedCost: result.estimatedCost
              }
            : item
        );
        const next = { ...current, visualPrompts, status: "imagem gerada" as const };
        return { ...next, qualityScore: calculateQualityScore(next) };
      });
      addLog("generation_completed", "PNG individual gerado.", {
        format: result.format,
        cardIndex: result.cardIndex,
        estimatedCost: result.estimatedCost
      });
    } finally {
      setGeneratingImageKey(null);
    }
  }

  async function handleStatusChange(contentId: string, status: ProductionStatus) {
    const target = contents.find((content) => content.id === contentId);
    updateContent(contentId, (current) => ({
      ...current,
      status,
      publishedAt: status === "publicado" ? new Date().toISOString() : current.publishedAt
    }));

    if (supabase && target && (target.generatedPostId || target.calendarId)) {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) {
        try {
          await updateProductionStatus({
            userId: user.id,
            generatedPostId: target.generatedPostId,
            calendarId: target.calendarId,
            status
          });
          setPersistenceStatus("synced");
        } catch (error) {
          setPersistenceStatus("error");
          addLog("supabase_error", friendlyErrorMessage(error), { context: "update_status" }, "error");
        }
      }
    }

    addLog(status === "publicado" ? "content_published" : "content_approved", `Conteúdo marcado como ${status}.`, {
      contentId
    });
  }

  function updateContent(contentId: string, updater: (content: ProductionContent) => ProductionContent) {
    setContents((current) => current.map((content) => (content.id === contentId ? updater(content) : content)));
  }

  function addLog(
    event: Parameters<typeof createOperationLog>[0],
    message: string,
    metadata?: Record<string, string | number | boolean | null | undefined>,
    level?: OperationLog["level"]
  ) {
    const log = createOperationLog(event, message, metadata, level);
    logOperation(log);
    setOperationLogs((current) => [log, ...current].slice(0, 30));
  }

  async function persistGeneratedCopy(content: ProductionContent, result: GenerateCopyResult) {
    if (!supabase) return null;
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return null;

    const post = await saveGeneratedPost({
      userId: user.id,
      calendarId: content.calendarId ?? null,
      item: content.plan,
      title: result.copy.title,
      subtitle: result.copy.subtitle,
      body: result.copy.slides.map((slide) => `${slide.number}. ${slide.title} - ${slide.subtitle}`).join("\n"),
      caption: result.copy.caption,
      hashtags: result.copy.hashtags,
      cta: result.copy.cta,
      pinnedComment: result.copy.pinnedComment,
      promptTokensEstimate: result.cost.promptTokensEstimate,
      completionTokensEstimate: result.cost.completionTokensEstimate,
      totalTokensEstimate: result.cost.totalTokensEstimate,
      estimatedCost: result.cost.estimatedCost,
      generationSource: result.source,
      providerUsed: result.cost.providerUsed,
      modelUsed: result.cost.modelUsed ?? result.cost.model,
      fallbackUsed: result.cost.fallbackUsed,
      errorMessage: result.cost.errorMessage
    });

    await recordAiGenerationUsage({
      userId: user.id,
      generatedPostId: post?.id,
      model: result.cost.model,
      providerUsed: result.cost.providerUsed,
      fallbackUsed: result.cost.fallbackUsed,
      errorMessage: result.cost.errorMessage,
      promptTokensEstimate: result.cost.promptTokensEstimate,
      completionTokensEstimate: result.cost.completionTokensEstimate,
      totalTokensEstimate: result.cost.totalTokensEstimate,
      estimatedCost: result.cost.estimatedCost
    });

    return post?.id ?? null;
  }

  return (
    <main className="min-h-screen px-4 py-5 text-stone-100 md:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-5 lg:grid-cols-[88px_minmax(0,1fr)]">
        <aside className="hidden rounded-lg border border-astral-line bg-astral-panel/70 p-3 lg:flex lg:flex-col lg:items-center lg:justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-astral-gold/45 bg-astral-gold/10">
            <MoonStar className="h-6 w-6 text-astral-gold" />
          </div>
          <div className="flex flex-col gap-3">
            {[Activity, Archive, Database, ShieldCheck].map((Icon, index) => (
              <button
                key={index}
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-md border border-transparent text-stone-400 transition hover:border-astral-line hover:bg-white/[0.04] hover:text-stone-100"
                aria-label={`Atalho ${index + 1}`}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}
          </div>
          <div className="h-2 w-2 rounded-full bg-astral-teal shadow-[0_0_20px_rgba(107,212,200,0.8)]" />
        </aside>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveScreen("production")}
              className={activeScreen === "production" ? "toolbar-button border-astral-gold" : "toolbar-button"}
            >
              Conteúdos de Hoje
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen("performance")}
              className={activeScreen === "performance" ? "toolbar-button border-astral-gold" : "toolbar-button"}
            >
              Performance Manual
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen("shortVideos")}
              className={activeScreen === "shortVideos" ? "toolbar-button border-astral-gold" : "toolbar-button"}
            >
              Vídeos Curtos
            </button>
            <button
              type="button"
              onClick={() => setActiveScreen("ready")}
              className={activeScreen === "ready" ? "toolbar-button border-astral-gold" : "toolbar-button"}
            >
              Pronto para postar
            </button>
          </div>

          {activeScreen === "performance" ? (
            <PerformanceManual
              metrics={performanceMetrics}
              onAddMetric={(metric) => setPerformanceMetrics((current) => [metric, ...current])}
            />
          ) : activeScreen === "shortVideos" ? (
            <ShortVideoStudio />
          ) : activeScreen === "ready" ? (
            <ReadyToPost contents={contents} onStatusChange={handleStatusChange} />
          ) : (
            <>
          <AutomationSettingsPanel
            settings={automationSettings}
            usage={automationUsage}
            onChange={setAutomationSettings}
          />

          <section className="rounded-lg border border-astral-line bg-astral-panel/72 p-4">
            <p className="text-xs uppercase tracking-[0.22em] text-astral-gold">IA automática</p>
            <p className="mt-2 text-sm text-stone-400">
              O app usa a melhor IA disponível e troca automaticamente se alguma alternativa falhar.
            </p>
          </section>

          <ProductionToolbar
            contents={contents}
            weeklyContents={weeklyContents}
            onGenerateToday={handleGenerateToday}
            onGenerateWeek={handleGenerateWeek}
            onShowLibrary={() => setLibraryVisible((current) => !current)}
          />

          <section className="rounded-lg border border-astral-line bg-astral-panel/72 p-5">
            <div className="grid gap-3 md:grid-cols-5">
              <Metric label="conteúdos" value={summary.total} />
              <Metric label="copy gerada" value={summary.generated} />
              <Metric label="aprovados" value={summary.approved} />
              <Metric label="publicados" value={summary.published} />
              <Metric label="ajustes" value={summary.needsAdjustment} />
            </div>
            <p className="mt-4 text-sm text-stone-400">
              Supabase: {persistenceStatus === "offline" ? "aguardando env" : persistenceStatus}
            </p>
            {budgetMessage ? (
              <p className="mt-2 rounded-md border border-astral-gold/30 bg-astral-gold/10 px-3 py-2 text-sm text-astral-gold">
                {budgetMessage}
              </p>
            ) : null}
          </section>

          {libraryVisible ? <LibraryPanel contents={[...contents, ...weeklyContents]} /> : null}

          <OperationLogPanel logs={operationLogs} />

          <section className="space-y-4">
            {contents.map((content) => (
              <ProductionContentCard
                key={content.id}
                content={content}
                isGenerating={generatingKey === content.id}
                generatingImageIndex={
                  generatingImageKey?.startsWith(`${content.id}-`) ? Number(generatingImageKey.split("-").at(-1)) : null
                }
                onRegenerateCopy={() => handleRegenerateCopy(content)}
                onRegenerateVisual={() => handleRegenerateVisual(content)}
                onGenerateImage={(promptIndex) => handleGenerateImage(content, promptIndex)}
                onStatusChange={(status) => handleStatusChange(content.id, status)}
              />
            ))}
          </section>

          <WeeklyCalendar plan={weeklyPlan} />
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function createProductionContents(plan: EditorialPlanItem[]) {
  return plan.map((item, index) => {
    const base = {
      id: `${item.date}-${item.moment}-${item.platform}-${item.format}-${index}`,
      plan: item,
      visualPrompts: generateVisualPromptsForContent(item, undefined, index),
      status: "planejado" as const,
      regeneratedCount: 0
    };

    return {
      ...base,
      qualityScore: calculateQualityScore(base)
    };
  });
}

function withCopy(content: ProductionContent, copy: GenerateCopyResult, generatedPostId?: string | null): ProductionContent {
  const next = {
    ...content,
    copy,
    generatedPostId: generatedPostId ?? content.generatedPostId,
    visualPrompts: generateVisualPromptsForContent(content.plan, copy.copy, content.regeneratedCount),
    status: "copy gerada" as const,
    regeneratedCount: content.regeneratedCount + 1
  };

  return {
    ...next,
    qualityScore: calculateQualityScore(next)
  };
}

function attachCalendarIds(
  contents: ProductionContent[],
  rows: { id: string; date: string; moment_of_day: string; platform: string; format: string; theme: string }[]
) {
  return contents.map((content) => {
    const row = rows.find(
      (item) =>
        item.date === content.plan.date &&
        item.moment_of_day === content.plan.moment &&
        item.platform === content.plan.platform &&
        item.format === content.plan.format &&
        item.theme === content.plan.theme
    );
    return row ? { ...content, calendarId: row.id } : content;
  });
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-astral-line bg-astral-void/40 px-3 py-2 text-center">
      <p className="text-xl font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}
