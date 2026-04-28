import type { ProductionContent } from "@/types/production";

export function buildCaptionTxt(content: ProductionContent) {
  const copy = content.copy?.copy;

  return [
    `Tema: ${content.plan.theme}`,
    `Formato: ${content.plan.format}`,
    "",
    "Legenda:",
    copy?.caption ?? "",
    "",
    "Hashtags:",
    copy?.hashtags.join(" ") ?? "",
    "",
    "CTA:",
    copy?.cta ?? content.plan.ctaType,
    "",
    "Comentário fixado:",
    copy?.pinnedComment ?? ""
  ].join("\n");
}

export function buildPlanningCsv(contents: ProductionContent[]) {
  const headers = [
    "date",
    "moment",
    "platform",
    "format",
    "objective",
    "science_base",
    "theme",
    "cta",
    "status",
    "quality_score"
  ];

  const rows = contents.map((content) => [
    content.plan.date,
    content.plan.moment,
    content.plan.platform,
    content.plan.format,
    content.plan.objective,
    content.plan.scienceBase,
    content.plan.theme,
    content.copy?.copy.cta ?? content.plan.ctaType,
    content.status,
    averageScore(content)
  ]);

  return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

export function downloadTextFile(filename: string, text: string, type = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type });
  downloadBlob(filename, blob);
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function createPlaceholderPng(content: ProductionContent, promptIndex = 0) {
  const ratio = content.visualPrompts[promptIndex]?.ratio ?? "1:1";
  const width = ratio === "9:16" ? 1080 : 1080;
  const height = ratio === "9:16" ? 1920 : 1080;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas not supported.");

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#07070b");
  gradient.addColorStop(0.48, "#241446");
  gradient.addColorStop(1, "#061625");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(217, 182, 109, 0.88)";
  ctx.beginPath();
  ctx.arc(width * 0.78, height * 0.16, width * 0.08, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#f7f0df";
  ctx.font = `700 ${ratio === "9:16" ? 76 : 58}px Arial`;
  wrapText(ctx, content.copy?.copy.title ?? content.plan.theme, width * 0.1, height * 0.42, width * 0.8, ratio === "9:16" ? 92 : 72);

  ctx.fillStyle = "#d9b66d";
  ctx.font = `400 ${ratio === "9:16" ? 42 : 32}px Arial`;
  wrapText(ctx, content.copy?.copy.subtitle ?? content.plan.scienceBase, width * 0.1, height * 0.62, width * 0.8, ratio === "9:16" ? 58 : 44);

  ctx.fillStyle = "#6bd4c8";
  ctx.font = `700 ${ratio === "9:16" ? 34 : 26}px Arial`;
  ctx.fillText(content.copy?.copy.cta ?? content.plan.ctaType, width * 0.1, height * 0.84);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not create PNG."));
    }, "image/png");
  });
}

export async function downloadDayZip(contents: ProductionContent[], filename = "astral-content-dia.zip") {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  await Promise.all(
    contents.map(async (content, index) => {
      zip.file(`conteudo-${index + 1}/legenda.txt`, buildCaptionTxt(content));
      content.visualPrompts.forEach((prompt, promptIndex) => {
        zip.file(`conteudo-${index + 1}/prompt-visual-${promptIndex + 1}.txt`, prompt.prompt);
      });
      await Promise.all(
        content.visualPrompts.map(async (prompt, promptIndex) => {
          const imageBlob = prompt.imageUrl
            ? await fetch(prompt.imageUrl).then((response) => response.blob())
            : await createPlaceholderPng(content, promptIndex);
          zip.file(`conteudo-${index + 1}/imagem-${promptIndex + 1}.png`, imageBlob);
        })
      );
    })
  );

  zip.file("planejamento.csv", buildPlanningCsv(contents));
  downloadBlob(filename, await zip.generateAsync({ type: "blob" }));
}

function averageScore(content: ProductionContent) {
  const values = Object.values(content.qualityScore);
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function csvCell(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(/\s+/);
  let line = "";
  let currentY = y;

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line) ctx.fillText(line, x, currentY);
}
