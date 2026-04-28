import { assertNoSequentialRepeats, historyFromPlan } from "@/lib/algorithm-rules";
import { generateDailyPlan, mockHistory } from "@/lib/content-strategy";
import type { GenerationSettings, WeeklyPlan } from "@/types/content";

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function generateWeeklyPlan(settings: GenerationSettings, startDate = new Date()): WeeklyPlan {
  let rollingHistory = [...mockHistory];
  const days = Array.from({ length: 7 }, (_, dayIndex) => {
    const date = addDays(startDate, dayIndex);
    const items = generateDailyPlan(settings, date, rollingHistory);
    rollingHistory = [...rollingHistory, ...historyFromPlan(items)];
    return {
      date: date.toISOString().slice(0, 10),
      items
    };
  });

  const allItems = days.flatMap((day) => day.items);
  assertNoSequentialRepeats(allItems);

  return {
    startDate: startDate.toISOString().slice(0, 10),
    days
  };
}

export function getTodayLabel(date = new Date()) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long"
  }).format(date);
}
