"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { OperationLog } from "@/lib/operation-logger";

type OperationLogPanelProps = {
  logs: OperationLog[];
};

export function OperationLogPanel({ logs }: OperationLogPanelProps) {
  const [open, setOpen] = useState(false);
  const latest = logs.slice(0, 6);

  return (
    <section className="rounded-lg border border-entrelinhas-line bg-entrelinhas-panel/72 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-entrelinhas-gold">Operacao</p>
          <h2 className="mt-1 text-base font-semibold text-stone-50">Logs recentes</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex items-center gap-2 rounded border border-entrelinhas-teal/30 bg-entrelinhas-teal/10 px-3 py-1 text-xs text-entrelinhas-teal"
        >
          {open ? "Ocultar" : "Ver logs"} · {logs.length}
          <ChevronDown className={open ? "h-3.5 w-3.5 rotate-180" : "h-3.5 w-3.5"} />
        </button>
      </div>

      {open ? (
        <div className="mt-4 space-y-2">
          {latest.length === 0 ? (
            <p className="text-sm text-stone-400">Nenhum evento operacional registrado nesta sessao.</p>
          ) : (
            latest.map((log) => (
              <div key={log.id} className="rounded-md border border-white/5 bg-entrelinhas-void/35 p-3">
                <p className={log.level === "error" ? "text-sm font-semibold text-entrelinhas-rose" : "text-sm font-semibold text-stone-100"}>
                  {log.message}
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-stone-500">{log.event}</p>
              </div>
            ))
          )}
        </div>
      ) : null}
    </section>
  );
}
