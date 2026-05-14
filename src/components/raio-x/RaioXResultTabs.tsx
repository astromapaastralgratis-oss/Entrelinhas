import { BookOpenText, ClipboardList, Sparkles } from "lucide-react";

export type RaioXResultView = "summary" | "reading" | "plan";

type RaioXResultTabsProps = {
  activeView: RaioXResultView;
  onChange: (view: RaioXResultView) => void;
};

const tabs = [
  { id: "summary", label: "Resumo", icon: Sparkles },
  { id: "reading", label: "Direção", icon: BookOpenText },
  { id: "plan", label: "Evolução", icon: ClipboardList }
] satisfies Array<{ id: RaioXResultView; label: string; icon: typeof Sparkles }>;

export function RaioXResultTabs({ activeView, onChange }: RaioXResultTabsProps) {
  return (
    <div className="mx-auto mb-5 flex max-w-md rounded-2xl border border-entrelinhas-gold/12 bg-entrelinhas-navy/62 p-1.5 backdrop-blur-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeView === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 py-3 text-xs font-bold transition duration-300 sm:text-sm ${
              isActive ? "bg-entrelinhas-gold/90 text-entrelinhas-ink shadow-gold" : "text-entrelinhas-muted hover:bg-entrelinhas-blue/35 hover:text-white"
            }`}
          >
            <Icon size={15} />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
