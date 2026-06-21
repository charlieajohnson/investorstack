import { describe, expect, it } from "vitest";
import { recommendTools } from "@/lib/domain/recommendations";
import type { Category, FirmProfile, Tool } from "@/lib/domain/schemas";

const category: Category = {
  id: "meeting_memory",
  slug: "meeting-memory",
  name: "Meeting Memory",
  description: "Capture meetings.",
  workflow_stages: ["meet"],
  priority: "P0",
};

function candidate(slug: string, human: number, ai: number, burden: Tool["implementation_burden"]): Tool {
  return {
    id: slug, slug, name: slug, website: `https://${slug}.example.com`, category_id: category.id,
    short_description: "Fixture", best_for: ["meeting memory"], not_best_for: ["none"], primary_users: [],
    firm_type_fit: ["lower_mid_market_pe"], team_size_fit: ["lean_6_20"],
    ai_readiness_signal: { public_api: "documented", mcp: "none", webhooks: "limited", exports: "structured_sync", auth: "token" },
    scores: { human_usability: human, workflow_fit: 80, ai_readiness: ai, integration_surface: ai, data_portability: 75, roi_potential: 80, vendor_maturity: 70 },
    scoring_status: "provisional", implementation_burden: burden, time_to_value: "same_day", estimated_price_band: "low",
    alternatives: [], pairs_well_with: [], overlaps_with: [], confidence: "medium", data_sources: ["fixture"], last_reviewed_at: "2026-06-21",
  };
}

const base: FirmProfile = {
  firm_type: "lower_mid_market_pe", team_size: "lean_6_20", primary_workflows: ["meeting_memory"],
  technical_maturity: "spreadsheet_native", budget_sensitivity: "moderate_budget", implementation_owner: "investment_team_member",
};

describe("recommendations", () => {
  it("favours human usability for spreadsheet-native firms", () => {
    const result = recommendTools(base, [category], [candidate("human", 96, 42, "low"), candidate("machine", 70, 96, "low")]);
    expect(result.recommended_stack.meeting_memory?.slug).toBe("human");
  });

  it("favours AI readiness for AI-enabled firms", () => {
    const result = recommendTools({ ...base, technical_maturity: "ai_enabled" }, [category], [candidate("human", 96, 42, "low"), candidate("machine", 70, 96, "low")]);
    expect(result.recommended_stack.meeting_memory?.slug).toBe("machine");
  });

  it("penalises high implementation burden when there is no owner", () => {
    const result = recommendTools({ ...base, implementation_owner: "no_clear_owner" }, [category], [candidate("heavy", 95, 95, "very_high"), candidate("light", 82, 82, "low")]);
    expect(result.recommended_stack.meeting_memory?.slug).toBe("light");
  });
});
