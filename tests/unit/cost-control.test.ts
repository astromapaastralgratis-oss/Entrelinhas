import { describe, expect, it } from "vitest";
import {
  buildTokenBudget,
  decideBudget,
  defaultAutomationSettings,
  getAutomationAlerts,
  getModePolicy
} from "../../lib/cost-control";

describe("cost control", () => {
  it("builds the requested token budget shape", () => {
    const budget = buildTokenBudget(defaultAutomationSettings, {
      dailyGenerations: 0,
      weeklyGenerations: 0,
      monthlyEstimatedCost: 0,
      dailyTokens: 120,
      weeklyTokens: 500
    });

    expect(budget).toMatchObject({
      dailyLimit: 10000,
      weeklyLimit: 50000,
      monthlyCostLimit: 50,
      currentUsage: 120,
      mode: "economico"
    });
  });

  it("keeps economy mode limited to essential AI fields", () => {
    const policy = getModePolicy("economico");

    expect(policy.intensity).toBe("leve");
    expect(policy.aiFields).toEqual(["hook", "caption"]);
    expect(policy.reuseCarouselStructure).toBe(true);
  });

  it("blocks bulk regeneration without confirmation", () => {
    const decision = decideBudget({
      estimatedTokens: 100,
      estimatedCost: 0.001,
      isBulkRegeneration: true
    });

    expect(decision.allowed).toBe(false);
    expect(decision.alerts[0].message).toBe("Regere apenas este conteúdo.");
  });

  it("warns when daily token usage is near the limit", () => {
    const alerts = getAutomationAlerts({
      dailyGenerations: 2,
      weeklyGenerations: 4,
      monthlyEstimatedCost: 2,
      dailyTokens: 8200,
      weeklyTokens: 9000
    });

    expect(alerts.map((alert) => alert.message)).toContain("Você está perto do limite diário.");
  });
});
