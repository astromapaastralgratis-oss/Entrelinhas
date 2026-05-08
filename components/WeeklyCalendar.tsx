import type { EditorialPlanItem } from "@/types/content";

type WeeklyCalendarProps = {
  plan: EditorialPlanItem[] | null;
};

export function WeeklyCalendar({ plan }: WeeklyCalendarProps) {
  if (!plan) {
    return (
      <section className="rounded-lg border border-entrelinhas-line bg-entrelinhas-panel/70 p-5">
        <h2 className="text-lg font-semibold text-stone-50">Calendário semanal</h2>
        <p className="mt-2 text-sm leading-6 text-stone-400">
          Gere o plano da semana para ver a distribuição por dia, momento, formato, objetivo e ciência base.
        </p>
      </section>
    );
  }

  const days = groupByDate(plan);

  return (
    <section className="rounded-lg border border-entrelinhas-line bg-entrelinhas-panel/80 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-stone-50">Calendário semanal</h2>
          <p className="mt-1 text-sm text-stone-400">Motor editorial inteligente sem IA</p>
        </div>
        <span className="rounded border border-entrelinhas-teal/30 bg-entrelinhas-teal/10 px-3 py-1 text-xs text-entrelinhas-teal">
          {plan.length} peças
        </span>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-7">
        {days.map((day) => (
          <div key={day.date} className="min-h-40 rounded-md border border-entrelinhas-line bg-entrelinhas-void/35 p-3">
            <p className="text-xs uppercase tracking-[0.18em] text-entrelinhas-gold">{formatWeekday(day.date)}</p>
            <p className="mt-1 text-sm text-stone-300">{formatDate(day.date)}</p>
            <div className="mt-3 space-y-2">
              {day.items.map((item, index) => (
                <div key={`${item.date}-${item.moment}-${item.format}-${index}`} className="rounded border border-white/5 bg-white/[0.035] p-2">
                  <p className="text-xs font-medium text-stone-100">
                    {item.moment} · {item.format}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-stone-400">{item.theme}</p>
                  <p className="mt-1 text-[11px] text-entrelinhas-teal">{item.scienceBase}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function groupByDate(plan: EditorialPlanItem[]) {
  return Array.from(
    plan.reduce((map, item) => {
      const current = map.get(item.date) ?? [];
      current.push(item);
      map.set(item.date, current);
      return map;
    }, new Map<string, EditorialPlanItem[]>())
  ).map(([date, items]) => ({ date, items }));
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short"
  }).format(new Date(`${date}T12:00:00`));
}

function formatWeekday(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "short"
  }).format(new Date(`${date}T12:00:00`));
}
