import { expect, test } from "@playwright/test";

test("runs the daily production and export workflow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Conteúdos de Hoje" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Gerar conteúdos de hoje" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Controle rígido de custo" })).toBeVisible();
  await expect(page.getByText("Econômico")).toBeVisible();
  await expect(page.getByText("Regere apenas este conteúdo.")).toBeVisible();
  await expect(page.getByRole("button", { name: "ZIP do dia" })).toBeVisible();
  await expect(page.getByRole("button", { name: "CSV" })).toBeVisible();
  await expect(page.getByText("Prompts visuais PNG").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Copiar prompt" }).first()).toBeVisible();
  await expect(page.getByText("Qualidade").first()).toBeVisible();

  await page.getByRole("button", { name: "Gerar conteúdos de hoje" }).click();
  await expect(page.locator("article").first()).toBeVisible();

  await page.getByRole("button", { name: "Regenerar copy" }).first().click();
  await expect(page.getByText("Copy gerada").first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Copiar legenda" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Baixar PNG" }).first()).toBeVisible();
  await page.getByRole("button", { name: "Gerar PNG" }).first().click();
  await expect(page.getByText("PNG individual gerado.").first()).toBeVisible();

  await page.getByRole("button", { name: "Aprovar" }).first().click();
  await expect(page.getByText("aprovado").first()).toBeVisible();

  await expect(page.getByRole("heading", { name: "Logs recentes" })).toBeVisible();

  await page.getByRole("button", { name: "Pronto para postar" }).click();
  await expect(page.getByRole("heading", { name: "Pronto para postar" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Copiar legenda" }).first()).toBeVisible();

  await page.getByRole("button", { name: "Publicado" }).first().click();

  await page.getByRole("button", { name: "Conteúdos de Hoje" }).click();
  await expect(page.getByText("publicado").first()).toBeVisible();
  await page.getByRole("button", { name: "Biblioteca" }).click();
  await expect(page.getByRole("heading", { name: "Histórico operacional" })).toBeVisible();

  await page.getByRole("button", { name: "Gerar semana" }).click();
  await expect(page.getByRole("heading", { name: "Calendário semanal" })).toBeVisible();
  await expect(page.getByText("28 peças")).toBeVisible();

  await page.getByRole("button", { name: "Vídeos Curtos" }).click();
  await expect(page.getByRole("heading", { name: "Vídeos Curtos" })).toBeVisible();
  await expect(page.getByText("3 vídeos")).toBeVisible();
  await expect(page.getByText("Tarot que ninguém quer ouvir")).toBeVisible();
  await expect(page.getByRole("button", { name: "Copiar roteiro" }).first()).toBeVisible();

  await page.getByRole("button", { name: "Performance Manual" }).click();
  await expect(page.getByRole("heading", { name: "Registrar resultado de publicação" })).toBeVisible();
  await page.getByLabel("Tema").fill("ritual de clareza emocional");
  await page.getByLabel("Views").fill("2500");
  await page.getByLabel("Novos seguidores").fill("120");
  await page.getByLabel("Compartilhamentos").fill("140");
  await page.getByRole("button", { name: "Registrar performance" }).click();
  await expect(page.getByText("ritual de clareza emocional").first()).toBeVisible();
  await expect(page.getByText("Recomendar mais conteúdos parecidos").first()).toBeVisible();
});
