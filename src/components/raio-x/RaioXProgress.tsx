type RaioXProgressProps = {
  current: number;
  total: number;
};

export function RaioXProgress({ current, total }: RaioXProgressProps) {
  const progress = Math.min(100, Math.max(0, (current / total) * 100));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-entrelinhas-muted">
        <span>Raio-X em andamento</span>
        <span>
          {current}/{total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full border border-entrelinhas-champagne/10 bg-white/[0.045]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-entrelinhas-gold via-entrelinhas-bronzeLight to-entrelinhas-wineLight transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
