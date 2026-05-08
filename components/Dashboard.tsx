"use client";

import { Download, MoonStar, Settings, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AutomationSettingsPanel } from "@/components/AutomationSettingsPanel";
import { OperationLogPanel } from "@/components/OperationLogPanel";
import { PerformanceManual } from "@/components/PerformanceManual";
import { ProductionContentCard } from "@/components/ProductionContentCard";
import { ProductionToolbar } from "@/components/ProductionToolbar";
import { ReadyToPost } from "@/components/ReadyToPost";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
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
import { createLearningRecommendation } from "@/lib/performance-learning";
import { calculateQualityScore, needsAdjustment } from "@/lib/quality-score";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";
import { generateVisualPromptsForContent } from "@/lib/visual-prompts";
import { createOperationLog, friendlyErrorMessage, logOperation, type OperationLog } from "@/lib/operation-logger";
import type { AutomationMode, AutomationSettings } from "@/types/automation";
import type { EditorialHistoryItem, EditorialPlanItem } from "@/types/content";
import type { GenerateCopyResult } from "@/types/copy";
import type { PerformanceMetrics } from "@/types/performance";
import type { ProductionContent, ProductionStatus } from "@/types/production";

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

type Screen = "production" | "ready" | "performance" | "settings";

export function Dashboard() {
  const [remoteHistory, setRemoteHistory] = useState<EditorialHistoryItem[]>([]);
  const [contents, setContents] = useState<ProductionContent[]>(() =>
    createProductionContents(generateEditorialPlan(new Date(), "padrão", "ganhar seguidores", editorialMockHistory))
  );
  const [weeklyPlan, setWeeklyPlan] = useState<EditorialPlanItem[] | null>(null);
  const [weeklyContents, setWeeklyContents] = useState<ProductionContent[]>([]);
  const [activeScreen, setActiveScreen] = useState<Screen>("production");
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [generatingKey, setGeneratingKey] = useState<string | null>(null);
  const [generatingImageKey, setGeneratingImageKey] = useState<string | null>(null);
  const [isGeneratingDay, setIsGeneratingDay] = useState(false);
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
      }
    }

    loadHistory();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("entrelinhas-performance-metrics");
      if (saved) setPerformanceMetrics(JSON.parse(saved) as PerformanceMetrics[]);
    } catch {
      // Local persistence is only a convenience.
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem("entrelinhas-performance-metrics", JSON.stringify(performanceMetrics));
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
    setIsGeneratingDay(true);
    setBudgetMessage(null);
    const history = getLearningAwareHistory();
    const intensity = getModeContentIntensity(automationSettings.mode);
    const plan = applyLockedThemes(
      generateEditorialPlan(new Date(), intensity, "ganhar seguidores", history),
      automationSettings.lockedWeeklyThemes
    );
    let nextContents = createProductionContents(plan);
    setContents(nextContents);
    addLog("generation_started", "Plano do dia gerado por regras.", { count: plan.length });

    try {
      if (supabase) {
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (user) {
          try {
            const savedRows = await saveEditorialPlan(user.id, plan);
            nextContents = attachCalendarIds(nextContents, savedRows);
            setContents(nextContents);
            setPersistenceStatus("synced");
            addLog("generation_completed", "Plano do dia salvo no banco.", { count: plan.length });
          } catch (error) {
            setPersistenceStatus("error");
            addLog("supabase_error", friendlyErrorMessage(error), { context: "save_today_plan" }, "error");
          }
        }
      }

      for (const content of nextContents) {
        const contentWithCopy = await generateCopyForContent(content);
        if (contentWithCopy) {
          await generatePostsForContent(contentWithCopy);
        }
      }
      addLog("generation_completed", "Conteudos e posts do dia prontos para revisao.", { count: nextContents.length });
    } finally {
      setIsGeneratingDay(false);
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
      addLog("generation_completed", "Plano semanal salvo no banco.", { count: plan.length });
    } catch (error) {
      setPersistenceStatus("error");
      addLog("supabase_error", friendlyErrorMessage(error), { context: "save_week_plan" }, "error");
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

    return [...baseHistory, learnedHistoryItem];
  }

  async function handleRegenerateCopy(content: ProductionContent) {
    const contentWithCopy = await generateCopyForContent(content);
    if (contentWithCopy) await generatePostsForContent(contentWithCopy);
  }

  async function generateCopyForContent(content: ProductionContent): Promise<ProductionContent | null> {
    setGeneratingKey(content.id);
    setBudgetMessage(null);
    addLog("generation_started", "Geracao de texto iniciada.", {
      format: content.plan.format,
      theme: content.plan.theme
    });

    try {
      const cacheKey = createGenerationCacheKey(content.plan, automationSettings.mode, content.regeneratedCount);
      const cachedCopy = generationCache[cacheKey];

      if (cachedCopy) {
        const nextContent = withCopy(content, { ...cachedCopy, cost: { ...cachedCopy.cost, cached: true } });
        updateContent(content.id, (current) => withCopy(current, { ...cachedCopy, cost: { ...cachedCopy.cost, cached: true } }));
        return nextContent;
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
        return null;
      }

      const session = supabase ? await supabase.auth.getSession() : null;
      const accessToken = session?.data.session?.access_token;
      const response = await fetch("/api/generate-executive-script", {
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
          provider: automationSettings.aiProviderPreference
        })
      });

      const result = (await response.json()) as GenerateCopyResult & { savedPostId?: string | null; error?: string };
      if (!response.ok) {
        const message = friendlyErrorMessage(
          result.cost?.reason ?? result.error ?? "Nao consegui gerar agora. Tente novamente ou revise suas configuracoes avancadas."
        );
        setBudgetMessage(message);
        addLog("ai_error", message, { status: response.status }, "error");
        return null;
      }

      const savedPostId = result.savedPostId ?? (await persistGeneratedCopy(content, result));
      const nextContent = withCopy(content, result, savedPostId);
      updateContent(content.id, (current) => withCopy(current, result, savedPostId));
      setGenerationCache((current) => ({ ...current, [cacheKey]: result }));
      addLog(
        "generation_completed",
        result.cost.fallbackUsed
          ? "Uma alternativa foi usada automaticamente para concluir sua geracao."
          : "Conteudo gerado com a melhor IA disponivel.",
        {
          source: result.source,
          provider: result.cost.providerUsed ?? "auto",
          estimatedCost: result.cost.estimatedCost
        }
      );
      addLog("estimated_cost", "Custo estimado registrado.", { estimatedCost: result.cost.estimatedCost });
      return nextContent;
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

  async function generatePostsForContent(content: ProductionContent): Promise<ProductionContent> {
    let nextContent = content;
    for (let index = 0; index < nextContent.visualPrompts.length; index += 1) {
      if (nextContent.visualPrompts[index]?.imageUrl) continue;
      const generated = await generatePostForPrompt(nextContent, index, { automatic: true });
      if (generated) nextContent = generated;
    }
    return nextContent;
  }

  async function handleGenerateImage(content: ProductionContent, promptIndex: number) {
    await generatePostForPrompt(content, promptIndex);
  }

  async function generatePostForPrompt(
    content: ProductionContent,
    promptIndex: number,
    options: { automatic?: boolean } = {}
  ): Promise<ProductionContent | null> {
    const prompt = content.visualPrompts[promptIndex];
    if (!prompt) return null;

    setGeneratingImageKey(`${content.id}-${promptIndex}`);
    setBudgetMessage(null);

    try {
      let generatedPostId = content.generatedPostId;

      if (!generatedPostId && content.copy) {
        generatedPostId = await persistGeneratedCopy(content, content.copy);
        if (generatedPostId) {
          updateContent(content.id, (current) => ({ ...current, generatedPostId }));
          content = { ...content, generatedPostId };
        }
      }

      const session = supabase ? await supabase.auth.getSession() : null;
      const accessToken = session?.data.session?.access_token;
      const response = await fetch("/api/generate-executive-script", {
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
        const message = "Post ainda nao foi gerado. Clique em Gerar post para tentar novamente.";
        setBudgetMessage(message);
        addLog("image_error", message, { status: response.status, error: result.error }, "warning");
        return null;
      }

      let updatedContent: ProductionContent | null = null;
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
        updatedContent = { ...next, qualityScore: calculateQualityScore(next) };
        return updatedContent;
      });
      const nextVisualPrompts = content.visualPrompts.map((item, index) =>
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
      const fallbackUpdatedContent = {
        ...content,
        visualPrompts: nextVisualPrompts,
        status: "imagem gerada" as const
      };
      const finalContent = updatedContent ?? {
        ...fallbackUpdatedContent,
        qualityScore: calculateQualityScore(fallbackUpdatedContent)
      };
      addLog("generation_completed", options.automatic ? "Post gerado automaticamente." : "Post individual gerado.", {
        format: result.format,
        cardIndex: result.cardIndex,
        estimatedCost: result.estimatedCost
      });
      if (result.persistenceWarning) {
        addLog(
          "supabase_error",
          "Post gerado, mas nao consegui salvar no historico.",
          { warning: result.persistenceWarning, cardIndex: result.cardIndex },
          "warning"
        );
      }
      return finalContent;
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

    addLog(status === "publicado" ? "content_published" : "content_approved", `Conteudo marcado como ${status}.`, {
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
        <aside className="hidden rounded-lg border border-entrelinhas-line bg-entrelinhas-panel/70 p-3 lg:flex lg:flex-col lg:items-center lg:justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-entrelinhas-gold/45 bg-entrelinhas-gold/10">
            <MoonStar className="h-6 w-6 text-entrelinhas-gold" />
          </div>
          <div className="flex flex-col gap-4 text-stone-500">
            <Sparkles className="h-5 w-5" />
            <Download className="h-5 w-5" />
            <Settings className="h-5 w-5" />
          </div>
          <div className="h-2 w-2 rounded-full bg-entrelinhas-teal shadow-[0_0_20px_rgba(107,212,200,0.8)]" />
        </aside>

        <div className="space-y-5">
          <nav className="flex flex-wrap gap-2" aria-label="Telas principais">
            <NavButton active={activeScreen === "production"} onClick={() => setActiveScreen("production")}>
              Conteudos de Hoje
            </NavButton>
            <NavButton active={activeScreen === "ready"} onClick={() => setActiveScreen("ready")}>
              Pronto para postar
            </NavButton>
            <NavButton active={activeScreen === "performance"} onClick={() => setActiveScreen("performance")}>
              Resultados dos Posts
            </NavButton>
            <NavButton active={activeScreen === "settings"} onClick={() => setActiveScreen("settings")}>
              Configuracoes avancadas
            </NavButton>
          </nav>

          {activeScreen === "ready" ? (
            <ReadyToPost contents={contents} onStatusChange={handleStatusChange} />
          ) : activeScreen === "performance" ? (
            <PerformanceManual
              metrics={performanceMetrics}
              onAddMetric={(metric) => setPerformanceMetrics((current) => [metric, ...current])}
            />
          ) : activeScreen === "settings" ? (
            <>
              <AutomationSettingsPanel settings={automationSettings} usage={automationUsage} onChange={setAutomationSettings} />

              <section className="rounded-lg border border-entrelinhas-line bg-entrelinhas-panel/72 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-entrelinhas-gold">Operacao</p>
                <div className="mt-4 grid gap-3 md:grid-cols-5">
                  <Metric label="conteudos" value={summary.total} />
                  <Metric label="texto gerado" value={summary.generated} />
                  <Metric label="aprovados" value={summary.approved} />
                  <Metric label="publicados" value={summary.published} />
                  <Metric label="ajustes" value={summary.needsAdjustment} />
                </div>
                <p className="mt-4 text-sm text-stone-400">
                  Banco de dados: {persistenceStatus === "offline" ? "aguardando configuracao" : persistenceStatus}
                </p>
                {budgetMessage ? (
                  <p className="mt-2 rounded-md border border-entrelinhas-gold/30 bg-entrelinhas-gold/10 px-3 py-2 text-sm text-entrelinhas-gold">
                    {budgetMessage}
                  </p>
                ) : null}
              </section>

              <OperationLogPanel logs={operationLogs} />
            </>
          ) : (
            <>
              <ProductionToolbar
                contents={contents}
                weeklyContents={weeklyContents}
                intensity={automationSettings.mode}
                isGenerating={isGeneratingDay}
                onIntensityChange={(mode: AutomationMode) => setAutomationSettings((current) => ({ ...current, mode }))}
                onGenerateToday={handleGenerateToday}
                onGenerateWeek={handleGenerateWeek}
              />

              <section className="rounded-lg border border-entrelinhas-line bg-entrelinhas-panel/72 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-entrelinhas-gold">IA automatica</p>
                <p className="mt-2 text-sm text-stone-400">
                  {isGeneratingDay
                    ? "Gerando textos e posts com IA automatica..."
                    : budgetMessage ?? "Conteudos e posts prontos para revisar quando voce gerar o dia."}
                </p>
              </section>

              <section className="space-y-4">
                {contents.map((content) => (
                  <ProductionContentCard
                    key={content.id}
                    content={content}
                    isGenerating={generatingKey === content.id}
                    generatingImageIndex={
                      generatingImageKey?.startsWith(`${content.id}-`)
                        ? Number(generatingImageKey.split("-").at(-1))
                        : null
                    }
                    onRegenerateCopy={() => handleRegenerateCopy(content)}
                    onRegenerateVisual={() => handleRegenerateVisual(content)}
                    onGenerateImage={(promptIndex) => handleGenerateImage(content, promptIndex)}
                    onStatusChange={(status) => handleStatusChange(content.id, status)}
                  />
                ))}
              </section>

              <details className="rounded-lg border border-entrelinhas-line bg-entrelinhas-panel/72 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-stone-100">Ver planejamento da semana</summary>
                <div className="mt-4">
                  <WeeklyCalendar plan={weeklyPlan} />
                </div>
              </details>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function createProductionContents(plan: EditorialPlanItem[]): ProductionContent[] {
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
    <div className="rounded-md border border-entrelinhas-line bg-entrelinhas-void/40 px-3 py-2 text-center">
      <p className="text-xl font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}

function NavButton({
  active,
  children,
  onClick
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "toolbar-button border-entrelinhas-gold bg-entrelinhas-gold/10 text-stone-50"
          : "toolbar-button text-stone-300"
      }
    >
      {children}
    </button>
  );
}
