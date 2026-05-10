"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { executivePresenceQuestions } from "@/src/data/executivePresenceQuestions";
import { calculateExecutivePresenceResult } from "@/src/utils/calculateExecutivePresenceResult";
import { shuffleArray } from "@/src/utils/shuffleArray";
import type {
  ExecutivePresenceAnswer,
  ExecutivePresenceOption,
  ExecutivePresenceResult
} from "@/src/types/executivePresence";
import { hasActiveExecutivePresence, restoreExecutivePresenceResult } from "@/src/lib/entrelinhas";
import { RaioXIntro } from "@/src/components/raio-x/RaioXIntro";
import { RaioXLoading } from "@/src/components/raio-x/RaioXLoading";
import { RaioXQuestion } from "@/src/components/raio-x/RaioXQuestion";
import { RaioXDevelopmentPlan } from "@/src/components/raio-x/RaioXDevelopmentPlan";
import { RaioXFullReading } from "@/src/components/raio-x/RaioXFullReading";
import { RaioXResultSummary } from "@/src/components/raio-x/RaioXResultSummary";
import { RaioXResultTabs, type RaioXResultView } from "@/src/components/raio-x/RaioXResultTabs";

type FlowStage = "intro" | "question" | "loading" | "summary";

function createShuffledOptionsByQuestion() {
  return executivePresenceQuestions.reduce<Record<string, ExecutivePresenceOption[]>>((accumulator, question) => {
    accumulator[question.id] = shuffleArray(question.options);
    return accumulator;
  }, {});
}

export function RaioXFlow() {
  const [stage, setStage] = useState<FlowStage>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<ExecutivePresenceAnswer[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [result, setResult] = useState<ExecutivePresenceResult | null>(null);
  const [resultView, setResultView] = useState<RaioXResultView>("summary");
  const [checkingSavedResult, setCheckingSavedResult] = useState(true);
  const [savedResultError, setSavedResultError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [shuffledOptionsByQuestion, setShuffledOptionsByQuestion] = useState(createShuffledOptionsByQuestion);
  const timers = useRef<number[]>([]);

  const currentQuestion = executivePresenceQuestions[currentIndex];
  const savedOptionId = answers.find((answer) => answer.questionId === currentQuestion?.id)?.optionId ?? null;

  function clearTimers() {
    for (const timer of timers.current) {
      window.clearTimeout(timer);
    }
    timers.current = [];
  }

  useEffect(() => {
    loadActiveSavedResult();
    return () => clearTimers();
  }, []);

  async function loadActiveSavedResult() {
    if (!supabase) {
      setCheckingSavedResult(false);
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setCheckingSavedResult(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("active_executive_presence_result_id, executive_presence_profile_id, executive_presence_completed_at")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        setSavedResultError("Nao conseguimos recuperar seu ultimo direcionamento. Voce pode refazer o Raio-X agora.");
        setCheckingSavedResult(false);
        return;
      }

      if (!profile || !hasActiveExecutivePresence(profile)) {
        setCheckingSavedResult(false);
        return;
      }

      const activeResultId = profile.active_executive_presence_result_id;
      if (!activeResultId) {
        setCheckingSavedResult(false);
        return;
      }

      const { data, error } = await supabase
        .from("executive_presence_results")
        .select("*")
        .eq("id", activeResultId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        setSavedResultError("Nao conseguimos recuperar seu ultimo direcionamento. Voce pode refazer o Raio-X agora.");
        setCheckingSavedResult(false);
        return;
      }

      const restoredResult = restoreExecutivePresenceResult(data);

      if (!restoredResult) {
        setSavedResultError("Seu direcionamento anterior precisa ser atualizado. Refaca o Raio-X para receber um resultado novo.");
        setCheckingSavedResult(false);
        return;
      }

      setResult(restoredResult);
      setResultView("summary");
      setStage("summary");
      setCheckingSavedResult(false);
    } catch {
      setSavedResultError("Nao conseguimos recuperar seu ultimo direcionamento. Voce pode refazer o Raio-X agora.");
      setCheckingSavedResult(false);
    }
  }

  function start() {
    clearTimers();
    setStage("question");
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedOptionId(null);
    setIsAdvancing(false);
    setResult(null);
    setResultView("summary");
    setSaveNotice(null);
    setSavedResultError(null);
    setShuffledOptionsByQuestion(createShuffledOptionsByQuestion());
  }

  function restart() {
    start();
  }

  function goBack() {
    if (currentIndex === 0 || isAdvancing) return;
    clearTimers();
    setCurrentIndex(currentIndex - 1);
    setSelectedOptionId(null);
    setIsAdvancing(false);
  }

  function selectOption(optionId: string) {
    if (isAdvancing || !currentQuestion) return;

    const nextAnswers = [
      ...answers.filter((answer) => answer.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, optionId }
    ];

    setAnswers(nextAnswers);
    setSelectedOptionId(optionId);
    setIsAdvancing(true);

    const advanceTimer = window.setTimeout(() => {
      setSelectedOptionId(null);
      setIsAdvancing(false);

      if (currentIndex >= executivePresenceQuestions.length - 1) {
        completeTest(nextAnswers);
        return;
      }

      setCurrentIndex((index) => index + 1);
    }, 300);

    timers.current.push(advanceTimer);
  }

  async function completeTest(currentAnswers: ExecutivePresenceAnswer[]) {
    const calculatedResult = calculateExecutivePresenceResult(currentAnswers);
    setStage("loading");
    setResultView("summary");
    setSaveNotice(null);
    setSavedResultError(null);

    try {
      await persistResult(calculatedResult, currentAnswers);
      setResult(calculatedResult);
      const loadingTimer = window.setTimeout(() => {
        setStage("summary");
      }, 1200);
      timers.current.push(loadingTimer);
    } catch {
      setResult(null);
      setSavedResultError("Nao conseguimos gravar seu direcionamento com seguranca. Refaca o Raio-X para concluir sua entrada.");
      setStage("summary");
    }
  }

  if (checkingSavedResult) return <RaioXLoading />;
  if (savedResultError && !result) return <SavedResultFallback message={savedResultError} onRestart={restart} />;
  if (stage === "intro") return <RaioXIntro onStart={start} />;
  if (stage === "loading") return <RaioXLoading />;
  if (stage === "summary" && result) {
    return (
      <div>
        {saveNotice ? (
          <div className="mx-auto mb-5 max-w-4xl rounded-2xl border border-entrelinhas-gold/25 bg-entrelinhas-gold/10 px-4 py-3 text-sm font-semibold leading-6 text-entrelinhas-goldLight">
            {saveNotice}
          </div>
        ) : null}
        <RaioXResultTabs activeView={resultView} onChange={setResultView} />
        {resultView === "summary" && (
          <RaioXResultSummary
            result={result}
            onRestart={restart}
            onViewReading={() => setResultView("reading")}
            onViewPlan={() => setResultView("plan")}
          />
        )}
        {resultView === "reading" && <RaioXFullReading result={result} />}
        {resultView === "plan" && <RaioXDevelopmentPlan result={result} />}
      </div>
    );
  }

  return (
    <RaioXQuestion
      question={currentQuestion}
      options={shuffledOptionsByQuestion[currentQuestion.id]}
      currentIndex={currentIndex}
      totalQuestions={executivePresenceQuestions.length}
      selectedOptionId={selectedOptionId}
      savedOptionId={savedOptionId}
      onSelect={selectOption}
      onBack={goBack}
      canGoBack={currentIndex > 0}
      isAdvancing={isAdvancing}
    />
  );
}

async function persistResult(result: ExecutivePresenceResult, answers: ExecutivePresenceAnswer[]) {
  if (!supabase) throw new Error("supabase_unavailable");

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) throw new Error("user_unavailable");

  const minimalAnswers = answers.map(({ questionId, optionId }) => ({ questionId, optionId }));
  const { data, error } = await supabase
    .from("executive_presence_results")
    .insert({
      user_id: user.id,
      profile_id: result.profileId,
      primary_trait: result.primaryTrait,
      secondary_trait: result.secondaryTrait,
      confidence_level: result.confidenceLevel,
      scores: result.scores,
      answers: minimalAnswers
    })
    .select("id, created_at")
    .single();

  if (error || !data?.id) throw error ?? new Error("missing_result_id");

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    full_name: user.user_metadata?.full_name ?? null,
    active_executive_presence_result_id: data.id,
    executive_presence_profile_id: result.profileId,
    executive_presence_completed_at: data.created_at ?? new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  if (profileError) throw profileError;
}

function SavedResultFallback({ message, onRestart }: { message: string; onRestart: () => void }) {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center justify-center text-center">
      <div className="glass-panel w-full p-8">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-entrelinhas-gold/35 bg-entrelinhas-gold/10 text-entrelinhas-gold">
          <AlertTriangle size={25} />
        </div>
        <h1 className="mt-5 text-2xl font-semibold text-white">Vamos atualizar seu Raio-X.</h1>
        <p className="mt-3 leading-7 text-entrelinhas-muted">{message}</p>
        <button
          onClick={onRestart}
          className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-entrelinhas-gold px-5 py-4 text-sm font-bold text-entrelinhas-ink shadow-gold transition hover:bg-entrelinhas-goldLight"
        >
          Refazer Raio-X
        </button>
      </div>
    </section>
  );
}
