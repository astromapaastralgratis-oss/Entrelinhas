import type { GenerateImageRequest } from "@/types/image-generation";
import type { VisualMode, VisualRatio } from "@/types/visual";
import { getDimensionsForRatio } from "@/lib/visual-prompts";

export type PostArtworkResult = {
  svg: string;
  bytes: Buffer;
  dataUrl: string;
  contentType: "image/svg+xml";
  width: number;
  height: number;
  validation: PostArtworkValidation;
};

export type PostArtworkValidation = {
  valid: boolean;
  errors: string[];
};

const darkPalette = {
  background: "#08061A",
  background2: "#1A1535",
  text: "#F5EDD6",
  muted: "#A08CC8",
  gold: "#C9A96E",
  panel: "rgba(8, 6, 26, 0.66)"
};

const lightPalette = {
  background: "#F7F1E8",
  background2: "#EFE3D1",
  text: "#2B2118",
  muted: "#7C6B5B",
  gold: "#C9A96E",
  panel: "rgba(255, 250, 242, 0.78)"
};

export function generatePostArtwork(input: GenerateImageRequest): PostArtworkResult {
  const validation = validatePostArtworkInput(input);
  const { width, height } = getDimensionsForRatio(input.ratio);
  const visualMode = getVisualMode(input.visualStyle, input.prompt);
  const palette = visualMode === "light" ? lightPalette : darkPalette;
  const title = trimWords(input.title, 12);
  const subtitle = trimWords(input.subtitle, 18);
  const cta = trimWords(input.cta, 14);
  const isVertical = input.ratio === "9:16";
  const margin = Math.round(width * 0.095);
  const titleFont = isVertical ? 78 : input.ratio === "4:5" ? 68 : 58;
  const subtitleFont = isVertical ? 38 : 32;
  const titleLines = wrapText(title, isVertical ? 18 : input.ratio === "4:5" ? 19 : 17, 4);
  const subtitleLines = wrapText(subtitle, isVertical ? 31 : 38, 3);
  const ctaLines = wrapText(cta, isVertical ? 28 : 42, 2);
  const cardLabel = getCardLabel(input);
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    "<defs>",
    `<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="${palette.background}"/><stop offset="55%" stop-color="${palette.background2}"/><stop offset="100%" stop-color="${visualMode === "light" ? "#F5E7D8" : "#07182D"}"/></linearGradient>`,
    `<radialGradient id="glow" cx="72%" cy="18%" r="54%"><stop offset="0%" stop-color="${palette.gold}" stop-opacity="${visualMode === "light" ? "0.26" : "0.34"}"/><stop offset="45%" stop-color="${palette.muted}" stop-opacity="0.13"/><stop offset="100%" stop-color="${palette.background}" stop-opacity="0"/></radialGradient>`,
    `<filter id="softGlow"><feGaussianBlur stdDeviation="7" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`,
    "</defs>",
    `<rect width="${width}" height="${height}" fill="url(#bg)"/>`,
    `<rect width="${width}" height="${height}" fill="url(#glow)"/>`,
    visualMode === "light" ? lightEditorialElements(width, height, palette) : darkCosmicElements(width, height, palette),
    `<text x="${margin}" y="${margin + 22}" fill="${palette.gold}" font-family="Inter, Arial, sans-serif" font-size="${isVertical ? 24 : 20}" letter-spacing="7">${escapeXml(cardLabel)}</text>`,
    renderTextBlock({
      lines: titleLines,
      x: margin,
      y: Math.round(height * (isVertical ? 0.31 : 0.28)),
      fontSize: titleFont,
      lineHeight: Math.round(titleFont * 1.08),
      fill: palette.text,
      family: "Georgia, 'Times New Roman', serif",
      weight: 700
    }),
    renderTextBlock({
      lines: subtitleLines,
      x: margin,
      y: Math.round(height * (isVertical ? 0.53 : 0.5)),
      fontSize: subtitleFont,
      lineHeight: Math.round(subtitleFont * 1.34),
      fill: palette.muted,
      family: "Inter, Arial, sans-serif",
      weight: 500
    }),
    renderCta({
      lines: ctaLines,
      x: margin,
      y: Math.round(height * 0.81),
      width: width - margin * 2,
      fill: palette.text,
      stroke: palette.gold,
      panel: palette.panel
    }),
    `<text x="${width - margin}" y="${height - margin * 0.55}" text-anchor="end" fill="${palette.gold}" opacity="0.72" font-family="Inter, Arial, sans-serif" font-size="22" letter-spacing="2">ASTRAL PESSOAL</text>`,
    "</svg>"
  ].join("");

  const bytes = Buffer.from(svg);
  return {
    svg,
    bytes,
    dataUrl: `data:image/svg+xml;base64,${bytes.toString("base64")}`,
    contentType: "image/svg+xml",
    width,
    height,
    validation
  };
}

export function validatePostArtworkInput(input: GenerateImageRequest): PostArtworkValidation {
  const errors: string[] = [];
  if (!input.ratio) errors.push("formato incorreto");
  if (!input.title?.trim()) errors.push("titulo muito longo");
  if (wordCount(input.title) > 12) errors.push("titulo muito longo");
  if (wordCount(input.subtitle) > 18) errors.push("texto pode cortar");
  if (!input.cta?.trim()) errors.push("falta chamada para acao");
  if (input.ratio === "1:1" && input.format !== "feed") errors.push("formato quadrado so deve ser usado quando escolhido");
  return { valid: errors.length === 0, errors };
}

function darkCosmicElements(width: number, height: number, palette: typeof darkPalette) {
  const stars = Array.from({ length: 58 }, (_, index) => {
    const x = (index * 97) % width;
    const y = (index * 151) % height;
    const opacity = 0.18 + ((index % 5) * 0.08);
    const r = index % 9 === 0 ? 3 : 1.4;
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${palette.gold}" opacity="${opacity}"/>`;
  }).join("");

  const ringX = Math.round(width * 0.74);
  const ringY = Math.round(height * 0.24);
  const ringR = Math.round(Math.min(width, height) * 0.19);

  return [
    stars,
    `<circle cx="${ringX}" cy="${ringY}" r="${ringR}" fill="none" stroke="${palette.gold}" stroke-width="2" opacity="0.25"/>`,
    `<circle cx="${ringX}" cy="${ringY}" r="${ringR * 0.68}" fill="none" stroke="${palette.gold}" stroke-width="1.4" opacity="0.2"/>`,
    `<path d="M${ringX - ringR * 0.35} ${ringY - ringR * 0.58} A${ringR * 0.55} ${ringR * 0.55} 0 1 0 ${ringX - ringR * 0.35} ${ringY + ringR * 0.58} A${ringR * 0.38} ${ringR * 0.38} 0 1 1 ${ringX - ringR * 0.35} ${ringY - ringR * 0.58}" fill="${palette.gold}" opacity="0.22" filter="url(#softGlow)"/>`,
    `<path d="M${width * 0.08} ${height * 0.1} C ${width * 0.35} ${height * 0.04}, ${width * 0.54} ${height * 0.18}, ${width * 0.88} ${height * 0.08}" fill="none" stroke="${palette.gold}" stroke-width="1.4" opacity="0.22"/>`,
    `<path d="M${width * 0.1} ${height * 0.9} C ${width * 0.34} ${height * 0.82}, ${width * 0.58} ${height * 0.92}, ${width * 0.92} ${height * 0.84}" fill="none" stroke="${palette.gold}" stroke-width="1.4" opacity="0.2"/>`
  ].join("");
}

function lightEditorialElements(width: number, height: number, palette: typeof lightPalette) {
  const ringX = Math.round(width * 0.78);
  const ringY = Math.round(height * 0.18);
  const ringR = Math.round(Math.min(width, height) * 0.18);

  return [
    `<circle cx="${ringX}" cy="${ringY}" r="${ringR}" fill="none" stroke="${palette.gold}" stroke-width="2" opacity="0.35"/>`,
    `<circle cx="${ringX}" cy="${ringY}" r="${ringR * 0.58}" fill="none" stroke="${palette.muted}" stroke-width="1.4" opacity="0.18"/>`,
    `<line x1="${width * 0.08}" y1="${height * 0.16}" x2="${width * 0.42}" y2="${height * 0.16}" stroke="${palette.gold}" stroke-width="2" opacity="0.45"/>`,
    `<line x1="${width * 0.08}" y1="${height * 0.875}" x2="${width * 0.78}" y2="${height * 0.875}" stroke="${palette.gold}" stroke-width="2" opacity="0.32"/>`,
    `<path d="M${width * 0.05} ${height * 0.7} C ${width * 0.22} ${height * 0.64}, ${width * 0.4} ${height * 0.71}, ${width * 0.56} ${height * 0.63}" fill="none" stroke="${palette.muted}" stroke-width="1.2" opacity="0.2"/>`,
    `<circle cx="${width * 0.15}" cy="${height * 0.73}" r="5" fill="${palette.gold}" opacity="0.42"/>`,
    `<circle cx="${width * 0.86}" cy="${height * 0.78}" r="4" fill="${palette.gold}" opacity="0.38"/>`
  ].join("");
}

function renderTextBlock(input: {
  lines: string[];
  x: number;
  y: number;
  fontSize: number;
  lineHeight: number;
  fill: string;
  family: string;
  weight: number;
}) {
  return input.lines
    .map(
      (line, index) =>
        `<text x="${input.x}" y="${input.y + index * input.lineHeight}" fill="${input.fill}" font-family="${input.family}" font-size="${input.fontSize}" font-weight="${input.weight}">${escapeXml(line)}</text>`
    )
    .join("");
}

function renderCta(input: {
  lines: string[];
  x: number;
  y: number;
  width: number;
  fill: string;
  stroke: string;
  panel: string;
}) {
  const height = 80 + Math.max(0, input.lines.length - 1) * 34;
  return [
    `<rect x="${input.x}" y="${input.y - 46}" width="${input.width}" height="${height}" rx="26" fill="${input.panel}" stroke="${input.stroke}" stroke-width="2" opacity="0.94"/>`,
    input.lines
      .map(
        (line, index) =>
          `<text x="${input.x + input.width / 2}" y="${input.y + index * 34}" text-anchor="middle" fill="${input.fill}" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700">${escapeXml(line)}</text>`
      )
      .join("")
  ].join("");
}

function getCardLabel(input: GenerateImageRequest) {
  const index = input.cardIndex ? String(input.cardIndex).padStart(2, "0") : "01";
  if (input.format === "stories" || input.format === "story") return `STORY ${index}`;
  if (input.format === "reels" || input.format === "tiktok") return "CAPA";
  if (input.format === "carrossel") return `CARD ${index}`;
  return "FEED";
}

function getVisualMode(styleName: string, prompt: string): VisualMode {
  const normalized = `${styleName} ${prompt}`.toLowerCase();
  if (normalized.includes("light") || normalized.includes("claro") || normalized.includes("editorial sofisticado claro")) return "light";
  return "dark";
}

function wrapText(text: string, maxChars: number, maxLines: number) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
      if (lines.length >= maxLines) break;
    } else {
      current = candidate;
    }
  }

  if (current && lines.length < maxLines) lines.push(current);
  return lines;
}

function trimWords(text: string | null | undefined, maxWords: number) {
  return String(text ?? "").split(/\s+/).filter(Boolean).slice(0, maxWords).join(" ");
}

function wordCount(text?: string) {
  return text?.split(/\s+/).filter(Boolean).length ?? 0;
}

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
