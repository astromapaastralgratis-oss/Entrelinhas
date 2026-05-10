"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { executivePresenceProfiles } from "@/src/data/executivePresenceProfiles";
import { executivePresenceQuestions } from "@/src/data/executivePresenceQuestions";
import { calculateExecutivePresenceResult } from "@/src/utils/calculateExecutivePresenceResult";
import { shuffleArray } from "@/src/utils/shuffleArray";
import type {
  ConfidenceLevel,
  ExecutivePresenceAnswer,
  ExecutivePresenceOption,
  ExecutivePresenceProfileId,
  ExecutivePresenceResult,
  ExecutivePresenceScores,
  TraitKey
} from "@/src/types/executivePresence";
import type { ExecutivePresenceResultRow } from "@/types/database";
import { RaioXIntro } from "@/src/components/raio-x/RaioXIntro";
import { RaioXLoading } from "@/src/components/raio-x/RaioXLoading";
import { RaioXQuestion } from "@/src/components/raio-x/RaioXQuestion";
import { RaioXDevelopmentPlan } from "@/src/components/raio-x/RaioXDevelopmentPlan";
import { RaioXFullReading } from "@/src/components/raio-x/RaioXFullReading";
import { RaioXResultSummary } from "@/src/components/raio-x/RaioXResultSummary";
import { RaioXResultTabs, type RaioXResultView } from "@/src/components/raio-x/RaioXResultTabs";

type FlowStage = "intro" | "question" | "loading" | "summary";
const traitKeys: TraitKey[] = ["direction", "influence", "diplomacy", "precision"];
const confidenceLevels: ConfidenceLevel[] = ["low", "medium", "high"];

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
    loadLatestSavedResult();
    return () => clearTimers();
  }, []);

  async function loadLatestSavedResult() {
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

      const { data, error } = await supabase
        .from("executive_presence_results")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        setSavedResultError("Não conseguimos recuperar sua última leitura. Você pode refazer o Raio-X agora.");
        setCheckingSavedResult(false);
        return;
      }

      if (!data) {
        setCheckingSavedResult(false);
        return;
      }

      const restoredResult = restoreSavedResult(data);

      if (!restoredResult) {
        setSavedResultError("Sua leitura anterior precisa ser atualizada. Refaça o Raio-X para receber um resultado novo.");
        setCheckingSavedResult(false);
        return;
      }

      setResult(restoredResult);
      setResultView("summary");
      setStage("summary");
      setCheckingSavedResult(false);
    } catch {
      setSavedResultError("Não conseguimos recuperar sua última leitura. Você pode refazer o Raio-X agora.");
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
        const calculatedResult = calculateExecutivePresenceResult(nextAnswers);
        setResult(calculatedResult);
        setResultView("summary");
        saveResult(calculatedResult, nextAnswers);
        setStage("loading");

        const loadingTimer = window.setTimeout(() => {
          setStage("summary");
        }, 1200);

        timers.current.push(loadingTimer);
        return;
      }

      setCurrentIndex((index) => index + 1);
    }, 300);

    timers.current.push(advanceTimer);
  }

  async function saveResult(calculatedResult: ExecutivePresenceResult, currentAnswers: ExecutivePresenceAnswer[]) {
    try {
      await persistResult(calculatedResult, currentAnswers);
      setSaveNotice(null);
    } catch {
      setSaveNotice("Sua leitura está pronta. Ela fica disponível aqui enquanto você estiver nesta sessão.");
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
  if (!supabase) return;

  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return;

  const minimalAnswers = answers.map(({ questionId, optionId }) => ({ questionId, optionId }));
  const { error } = await supabase.from("executive_presence_results").insert({
    user_id: user.id,
    profile_id: result.profileId,
    primary_trait: result.primaryTrait,
    secondary_trait: result.secondaryTrait,
    confidence_level: result.confidenceLevel,
    scores: result.scores,
    answers: minimalAnswers
  });

  if (error) {
    throw error;
  }
}

function restoreSavedResult(row: ExecutivePresenceResultRow): ExecutivePresenceResult | null {
  if (!isProfileId(row.profile_id)) return null;
  if (!isTraitKey(row.primary_trait)) return null;
  const secondaryTrait = isTraitKey(row.secondary_trait) ? row.secondary_trait : row.primary_trait;
  const confidenceLevel = isConfidenceLevel(row.confidence_level) ? row.confidence_level : "low";
  const scores = isScores(row.scores) ? row.scores : null;
  const answers = Array.isArray(row.answers) ? row.answers.filter(isAnswer) : [];

  if (!scores) return null;

  const topScore = scores[row.primary_trait] ?? 0;
  const secondScore = scores[secondaryTrait] ?? 0;

  return {
    profileId: row.profile_id,
    profile: executivePresenceProfiles[row.profile_id],
    primaryTrait: row.primary_trait,
    secondaryTrait,
    scores,
    answeredQuestions: answers.length,
    totalQuestions: executivePresenceQuestions.length,
    completed: answers.length >= executivePresenceQuestions.length,
    isCombined: topScore - secondScore <= 2,
    confidenceLevel,
    invalidAnswers: []
  };
}

function isProfileId(value: unknown): value is ExecutivePresenceProfileId {
  return typeof value === "string" && value in executivePresenceProfiles;
}

function isTraitKey(value: unknown): value is TraitKey {
  return typeof value === "string" && traitKeys.includes(value as TraitKey);
}

function isConfidenceLevel(value: unknown): value is ConfidenceLevel {
  return typeof value === "string" && confidenceLevels.includes(value as ConfidenceLevel);
}

function isAnswer(value: unknown): value is ExecutivePresenceAnswer {
  if (!value || typeof value !== "object") return false;
  const answer = value as Partial<ExecutivePresenceAnswer>;
  return typeof answer.questionId === "string" && typeof answer.optionId === "string";
}

function isScores(value: unknown): value is ExecutivePresenceScores {
  if (!value || typeof value !== "object") return false;
  const scores = value as Partial<Record<TraitKey, unknown>>;
  return traitKeys.every((trait) => typeof scores[trait] === "number");
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
