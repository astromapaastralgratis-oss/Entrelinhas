import { describe, expect, it } from "vitest";
import {
  countWeeklyVideoIntents,
  createShortVideoBrief,
  generateShortVideoScript,
  generateWeeklyShortVideoPlan,
  shortVideoSeries
} from "../../lib/short-video-engine";

describe("short video engine", () => {
  it("generates a weekly alternation with the required intent mix", () => {
    const videos = generateWeeklyShortVideoPlan("2026-04-27");
    const counts = countWeeklyVideoIntents(videos);

    expect(videos).toHaveLength(7);
    expect(counts).toEqual({
      identificacao: 3,
      educativo: 2,
      cta_app: 1,
      fechamento_reflexao: 1
    });
  });

  it("returns the required short-video JSON fields", () => {
    const video = generateShortVideoScript(createShortVideoBrief("2026-04-27", "identificacao"));

    expect(video).toEqual(
      expect.objectContaining({
        videoTitle: expect.any(String),
        hook: expect.any(String),
        script: expect.any(String),
        sceneList: expect.any(Array),
        screenTexts: expect.any(Array),
        caption: expect.any(String),
        hashtags: expect.any(Array),
        cta: expect.any(String),
        pinnedComment: expect.any(String)
      })
    );
    expect(video.script).toContain(video.hook);
    expect(video.script).toContain(video.cta);
  });

  it("keeps screen text short enough for mobile video", () => {
    const videos = generateWeeklyShortVideoPlan("2026-04-27");

    expect(videos.flatMap((video) => video.screenTexts).every((text) => text.split(/\s+/).length <= 10)).toBe(true);
  });

  it("organizes all recurring series", () => {
    expect(shortVideoSeries).toEqual([
      "Energia do Dia",
      "Tarot que ninguém quer ouvir",
      "Número do dia",
      "O trânsito astral explicou",
      "Sinais de que sua energia pediu pausa",
      "Astrologia sem complicar",
      "O que você sente tem pista"
    ]);
  });
});
