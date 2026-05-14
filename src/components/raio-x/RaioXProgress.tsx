type RaioXProgressProps = {
  current: number;
  total: number;
};

export function RaioXProgress({ current, total }: RaioXProgressProps) {
  const progress = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">
        <span>Pergunta {current} de {total}</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full border border-entrelinhas-gold/12 bg-entrelinhas-navy/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-entrelinhas-blueLight via-entrelinhas-gold to-entrelinhas-goldLight transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
