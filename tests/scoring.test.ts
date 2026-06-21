import { describe, expect, it } from "vitest";
import { calculateOverallScore, rankScoredTools, WEIGHTS } from "@/lib/domain/scoring";
import type { Tool } from "@/lib/domain/schemas";

const scores = {
  human_usability: 88,
  workflow_fit: 82,
  ai_readiness: 80,
  integration_surface: 78,
  data_portability: 70,
  roi_potential: 80,
  vendor_maturity: 72,
};

function tool(slug: string, workflowFit: number, aiReadiness: number): Tool {
  return {
    id: slug,
    slug,
    name: slug,
    website: `https://${slug}.example.com`,
    category_id: "meeting_memory",
    short_description: "Fixture",
    best_for: ["fixture"],
    not_best_for: ["fixture"],
    primary_users: [],
    firm_type_fit: [],
    team_size_fit: [],
    ai_readiness_signal: {
      public_api: "documented",
      mcp: "none",
      webhooks: "limited",
      exports: "structured_sync",
      auth: "token",
    },
    scores: { ...scores, workflow_fit: workflowFit, ai_readiness: aiReadiness },
    scoring_status: "provisional",
    implementation_burden: "low",
    time_to_value: "same_day",
    estimated_price_band: "low",
    alternatives: [],
    pairs_well_with: [],
    overlaps_with: [],
    confidence: "medium",
    data_sources: ["fixture"],
    last_reviewed_at: "2026-06-21",
  };
}

describe("scoring", () => {
  it("keeps dimension weights at 100", () => {
    expect(Object.values(WEIGHTS).reduce((sum, weight) => sum + weight, 0)).toBe(100);
  });

  it("derives Fathom's worked-example score", () => {
    expect(calculateOverallScore(scores)).toBe(80);
  });

  it("breaks equal overall scores by workflow fit, then AI readiness", () => {
    const ranked = rankScoredTools([tool("b", 80, 90), tool("a", 90, 80)]);
    expect(ranked.map((item) => item.slug)).toEqual(["a", "b"]);
  });

  it("excludes unscored tools instead of treating them as zero", () => {
    const unscored = { ...tool("unscored", 90, 90), scores: null, scoring_status: "unscored" as const };
    expect(rankScoredTools([unscored, tool("scored", 80, 80)]).map((item) => item.slug)).toEqual(["scored"]);
  });
});
