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
    "Chamada para acao:",
    copy?.cta ?? content.plan.ctaType,
    "",
    "Comentario fixado:",
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
  const prompt = content.visualPrompts[promptIndex];
  const ratio = prompt?.ratio ?? "4:5";
  const width = 1080;
  const height = ratio === "9:16" ? 1920 : ratio === "1:1" ? 1080 : 1350;
  const isLight = prompt?.visualMode === "light";
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas not supported.");

  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, isLight ? "#F7F1E8" : "#08061A");
  gradient.addColorStop(0.52, isLight ? "#EFE3D1" : "#1A1535");
  gradient.addColorStop(1, isLight ? "#F5E7D8" : "#07182D");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "rgba(201, 169, 110, 0.28)";
  ctx.beginPath();
  ctx.arc(width * 0.78, height * 0.18, width * 0.16, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(201, 169, 110, 0.42)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(width * 0.78, height * 0.18, width * 0.21, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = isLight ? "#2B2118" : "#F5EDD6";
  ctx.font = `700 ${ratio === "9:16" ? 78 : 68}px Georgia`;
  wrapText(ctx, content.copy?.copy.title ?? content.plan.theme, width * 0.095, height * 0.32, width * 0.8, ratio === "9:16" ? 92 : 78, 4);

  ctx.fillStyle = isLight ? "#7C6B5B" : "#A08CC8";
  ctx.font = `500 ${ratio === "9:16" ? 38 : 32}px Arial`;
  wrapText(ctx, content.copy?.copy.subtitle ?? content.plan.scienceBase, width * 0.095, height * 0.55, width * 0.8, ratio === "9:16" ? 54 : 44, 3);

  ctx.fillStyle = isLight ? "#2B2118" : "#F5EDD6";
  ctx.font = `700 ${ratio === "9:16" ? 30 : 28}px Arial`;
  wrapText(ctx, content.copy?.copy.cta ?? content.plan.ctaType, width * 0.095, height * 0.83, width * 0.78, 38, 2);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not create PNG."));
    }, "image/png");
  });
}

export async function getSafePngBlob(content: ProductionContent, promptIndex = 0) {
  const imageUrl = content.visualPrompts[promptIndex]?.imageUrl;
  if (!imageUrl) return createPlaceholderPng(content, promptIndex);

  try {
    const blob = await fetch(imageUrl).then((response) => response.blob());
    if (blob.type === "image/png") return blob;
    return await convertImageBlobToPng(blob, content, promptIndex);
  } catch {
    return createPlaceholderPng(content, promptIndex);
  }
}

export async function downloadDayZip(contents: ProductionContent[], filename = "astral-content-dia.zip") {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  await Promise.all(
    contents.map(async (content, index) => {
      zip.file(`conteudo-${index + 1}/legenda.txt`, buildCaptionTxt(content));
      content.visualPrompts.forEach((prompt, promptIndex) => {
        zip.file(`conteudo-${index + 1}/estilo-post-${promptIndex + 1}.txt`, prompt.prompt);
      });
      await Promise.all(
        content.visualPrompts.map(async (_prompt, promptIndex) => {
          const postBlob = await getSafePngBlob(content, promptIndex);
          zip.file(`conteudo-${index + 1}/post-${promptIndex + 1}.png`, postBlob);
        })
      );
    })
  );

  zip.file("planejamento.csv", buildPlanningCsv(contents));
  downloadBlob(filename, await zip.generateAsync({ type: "blob" }));
}

async function convertImageBlobToPng(blob: Blob, content: ProductionContent, promptIndex: number) {
  const prompt = content.visualPrompts[promptIndex];
  const ratio = prompt?.ratio ?? "4:5";
  const width = 1080;
  const height = ratio === "9:16" ? 1920 : ratio === "1:1" ? 1080 : 1350;
  const url = URL.createObjectURL(blob);

  try {
    const image = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported.");
    ctx.drawImage(image, 0, 0, width, height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((pngBlob) => {
        if (pngBlob) resolve(pngBlob);
        else reject(new Error("Could not create PNG."));
      }, "image/png");
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load generated post."));
    image.src = url;
  });
}

function averageScore(content: ProductionContent) {
  const values = Object.values(content.qualityScore);
  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function csvCell(value: string | number) {
  return `"${String(value).replace(/"/g, '""')}"`;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 4
) {
  const words = text.split(/\s+/);
  let line = "";
  let currentY = y;
  let lineCount = 0;

  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      if (lineCount < maxLines) ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
      lineCount += 1;
    } else {
      line = testLine;
    }
  });

  if (line && lineCount < maxLines) ctx.fillText(line, x, currentY);
}
