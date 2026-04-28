"use client";

import { Clipboard, Film, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { generateWeeklyShortVideoPlan, shortVideoSeries } from "@/lib/short-video-engine";
import type { ShortVideoScript } from "@/types/short-video";

type ShortVideoStudioProps = {
  initialDate?: Date;
};

export function ShortVideoStudio({ initialDate = new Date() }: ShortVideoStudioProps) {
  const [startDate, setStartDate] = useState(() => initialDate.toISOString().slice(0, 10));
  const videos = useMemo(() => generateWeeklyShortVideoPlan(startDate), [startDate]);

  async function copyText(text: string) {
    await navigator.clipboard.writeText(text);
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-astral-line bg-astral-panel/86 p-5 shadow-astral">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-astral-gold">
              <Film className="h-4 w-4" />
              Reels e TikTok
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-stone-50 md:text-3xl">Vídeos Curtos</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-300">
              Roteiros graváveis com hook de até 3 segundos, virada clara, CTA e séries recorrentes para retenção.
            </p>
          </div>

          <label className="block min-w-56">
            <span className="text-xs uppercase tracking-[0.16em] text-stone-500">início da semana</span>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="mt-2 w-full rounded-md border border-astral-line bg-black/25 px-3 py-2 text-sm text-stone-100 outline-none focus:border-astral-gold"
            />
          </label>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-4">
          <Metric label="identificação" value="3 vídeos" />
          <Metric label="educativos" value="2 vídeos" />
          <Metric label="CTA app" value="1 vídeo" />
          <Metric label="fechamento" value="1 vídeo" />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {shortVideoSeries.map((series) => (
            <span key={series} className="rounded border border-astral-violet/25 bg-astral-violet/10 px-2 py-1 text-xs text-violet-200">
              {series}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {videos.map((video, index) => (
          <VideoCard key={`${video.videoTitle}-${index}`} video={video} index={index} onCopy={copyText} />
        ))}
      </div>
    </section>
  );
}

function VideoCard({
  video,
  index,
  onCopy
}: {
  video: ShortVideoScript;
  index: number;
  onCopy: (text: string) => void;
}) {
  return (
    <article className="rounded-lg border border-astral-line bg-[#151520]/92 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge>dia {index + 1}</Badge>
            <Badge>{video.intent.replace("_", " ")}</Badge>
            <Badge>{video.series}</Badge>
          </div>
          <h2 className="mt-3 text-lg font-semibold text-stone-50">{video.videoTitle}</h2>
          <p className="mt-2 text-sm leading-6 text-stone-400">{video.strategicReason}</p>
        </div>
        <span className="rounded-md border border-astral-teal/30 bg-astral-teal/10 px-3 py-2 text-xs text-astral-teal">
          hook 3s
        </span>
      </div>

      <section className="mt-4 rounded-md border border-white/5 bg-white/[0.035] p-3">
        <p className="text-xs uppercase tracking-[0.18em] text-astral-teal">Hook</p>
        <p className="mt-2 text-base font-semibold text-stone-50">{video.hook}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.18em] text-astral-gold">Roteiro</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-stone-300">{video.script}</p>
      </section>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ScriptBlock title="Cenas" items={video.sceneList} />
        <ScriptBlock title="Textos de tela" items={video.screenTexts} />
      </div>

      <section className="mt-4 rounded-md border border-white/5 bg-astral-void/35 p-3">
        <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Legenda</p>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-stone-300">{video.caption}</p>
        <p className="mt-3 text-xs text-astral-gold">{video.hashtags.join(" ")}</p>
        <p className="mt-2 text-sm text-stone-200">CTA: {video.cta}</p>
        <p className="mt-1 text-sm text-stone-400">Comentário fixado: {video.pinnedComment}</p>
      </section>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        <ActionButton onClick={() => onCopy(video.hook)} label="Copiar hook" icon={<Clipboard />} />
        <ActionButton onClick={() => onCopy(video.script)} label="Copiar roteiro" icon={<Clipboard />} />
        <ActionButton onClick={() => onCopy(video.caption)} label="Copiar legenda" icon={<Clipboard />} />
        <ActionButton onClick={() => onCopy(video.pinnedComment)} label="Copiar comentário" icon={<Clipboard />} />
      </div>
    </article>
  );
}

function ScriptBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-white/5 bg-astral-void/35 p-3">
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{title}</p>
      <ul className="mt-2 space-y-2 text-sm leading-5 text-stone-300">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0 text-astral-teal" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-astral-line bg-astral-void/40 px-3 py-2">
      <p className="text-lg font-semibold text-stone-50">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-stone-500">{label}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded border border-astral-violet/25 bg-astral-violet/10 px-2 py-1 text-violet-200">{children}</span>;
}

function ActionButton({
  onClick,
  label,
  icon
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactElement;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-astral-line bg-astral-night px-3 text-sm text-stone-100 transition hover:border-astral-gold hover:text-white"
    >
      {icon}
      {label}
    </button>
  );
}
