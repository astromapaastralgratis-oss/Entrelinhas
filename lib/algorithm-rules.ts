import type { ContentHistoryItem, PlannedContent } from "@/types/content";

type ComparableKey = "format" | "objective" | "science" | "hookType" | "theme" | "cta";

export function rotateWithoutImmediateRepeat<T>(items: T[], index: number, previous?: T): T {
  if (items.length === 0) {
    throw new Error("Rotation needs at least one item.");
  }

  const candidate = items[index % items.length];
  if (candidate !== previous) {
    return candidate;
  }

  return items[(index + 1) % items.length];
}

export function getLastHistoryValue<K extends ComparableKey>(
  history: ContentHistoryItem[],
  key: K
): ContentHistoryItem[K] | undefined {
  return history.at(-1)?.[key];
}

export function assertNoSequentialRepeats(items: PlannedContent[]) {
  const invalid = items.some((item, index) => {
    const previous = items[index - 1];
    if (!previous) return false;

    return (
      item.format === previous.format ||
      item.objective === previous.objective ||
      item.science === previous.science
    );
  });

  if (invalid) {
    throw new Error("Generated plan contains sequential repetition in format, objective or science.");
  }
}

export function historyFromPlan(items: PlannedContent[]): ContentHistoryItem[] {
  return items.map(({ id, date, format, objective, science, hookType, theme, cta }) => ({
    id,
    date,
    format,
    objective,
    science,
    hookType,
    theme,
    cta
  }));
}
