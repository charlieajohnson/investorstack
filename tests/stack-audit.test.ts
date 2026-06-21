import { describe, expect, it } from "vitest";
import { auditStack } from "@/lib/domain/stack-audit";
import type { Category, FirmProfile, Tool } from "@/lib/domain/schemas";

const profile: FirmProfile = {
  firm_type: "lower_mid_market_pe", team_size: "lean_6_20", primary_workflows: ["origination", "meeting_memory"],
  technical_maturity: "ops_tools", budget_sensitivity: "moderate_budget", implementation_owner: "ops_lead",
};

const categories: Category[] = [
  { id: "private_market_data", slug: "private-market-data", name: "Private Market Data", description: "Data", workflow_stages: ["source"], priority: "P0" },
  { id: "meeting_memory", slug: "meeting-memory", name: "Meeting Memory", description: "Meetings", workflow_stages: ["meet"], priority: "P0" },
];

function tool(id: string, category: string, pairs: string[] = []): Tool {
  return {
    id, slug: id, name: id, website: `https://${id}.example.com`, category_id: category, short_description: "Fixture",
    best_for: [id === "inven" ? "AI-native long-tail search" : "verified market depth"], not_best_for: ["none"], primary_users: [],
    firm_type_fit: ["lower_mid_market_pe"], team_size_fit: ["lean_6_20"],
    ai_readiness_signal: { public_api: "documented", mcp: "none", webhooks: "limited", exports: "structured_sync", auth: "token" },
    scores: null, scoring_status: "unscored", implementation_burden: "low", time_to_value: "one_week", estimated_price_band: "mid",
    alternatives: [], pairs_well_with: pairs, overlaps_with: [], confidence: "medium", data_sources: ["fixture"], last_reviewed_at: "2026-06-21",
  };
}

describe("stack audit", () => {
  it("fills relevant gaps", () => {
    const result = auditStack(profile, {}, categories, [tool("pitchbook", "private_market_data"), tool("granola", "meeting_memory")]);
    expect(result.items.map((item) => item.verdict)).toEqual(["fill_gap", "fill_gap"]);
  });

  it("adds a documented complement alongside an incumbent", () => {
    const tools = [tool("pitchbook", "private_market_data", ["inven"]), tool("inven", "private_market_data"), tool("granola", "meeting_memory")];
    const result = auditStack(profile, { private_market_data: "pitchbook", meeting_memory: "granola" }, categories, tools);
    expect(result.items.find((item) => item.category.id === "private_market_data")?.verdict).toBe("add_alongside");
    expect(result.items.find((item) => item.category.id === "private_market_data")?.recommended_tool?.slug).toBe("inven");
  });

  it("keeps a mapped tool when no evidence supports replacement or complement", () => {
    const result = auditStack(profile, { meeting_memory: "granola" }, categories, [tool("granola", "meeting_memory")]);
    expect(result.items.find((item) => item.category.id === "meeting_memory")?.verdict).toBe("keep");
  });
});
