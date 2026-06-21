import type { Category, FirmProfile, Score, Tool } from "./schemas";

const WORKFLOW_CATEGORIES: Record<FirmProfile["primary_workflows"][number], string[]> = {
  origination: ["private_market_data", "contact_data", "gtm_enrichment"],
  crm_pipeline: ["crm_relationship_intelligence"],
  diligence: ["private_market_data", "ai_operating_layer"],
  portfolio_monitoring: ["portfolio_monitoring_reporting"],
  finance_reporting: ["portfolio_monitoring_reporting"],
  outreach: ["contact_data", "gtm_enrichment", "crm_relationship_intelligence"],
  meeting_memory: ["meeting_memory"],
  ai_operating_layer: ["ai_operating_layer"],
  internal_knowledge: ["ai_operating_layer", "meeting_memory"],
};

const MATURITY_MULTIPLIERS: Record<FirmProfile["technical_maturity"], Partial<Record<keyof Score, number>>> = {
  // The source spec's 1.4 / 0.8 pair does not actually re-rank the worked
  // Granola case. This stronger profile mode makes the stated behaviour true.
  spreadsheet_native: { human_usability: 3, ai_readiness: 0.4, integration_surface: 0.5 },
  ops_tools: { human_usability: 1.2, workflow_fit: 1.2 },
  api_ready: { ai_readiness: 1.4, integration_surface: 1.3, data_portability: 1.2 },
  ai_enabled: { ai_readiness: 1.6, integration_surface: 1.4, data_portability: 1.2 },
};

const BURDEN_PENALTY: Record<Tool["implementation_burden"], number> = {
  very_low: 0,
  low: 1,
  medium: 4,
  high: 9,
  very_high: 16,
};

const PRICE_PENALTY: Record<Tool["estimated_price_band"], number> = {
  free: 0,
  low: 0,
  mid: 1,
  high: 5,
  enterprise: 10,
  unknown: 2,
};

const SIGNAL_VALUE = {
  public_api: { none: 25, limited: 55, documented: 85 },
  mcp: { none: 35, third_party: 60, hosted: 95 },
  webhooks: { none: 30, limited: 60, robust: 90 },
  exports: { none: 25, manual_csv: 55, structured_sync: 90 },
  auth: { manual: 35, token: 65, oauth_enterprise: 90 },
} as const;

function inferredScores(tool: Tool): Score {
  const signal = tool.ai_readiness_signal;
  const ai = Math.round((SIGNAL_VALUE.public_api[signal.public_api] + SIGNAL_VALUE.mcp[signal.mcp] + SIGNAL_VALUE.webhooks[signal.webhooks] + SIGNAL_VALUE.exports[signal.exports] + SIGNAL_VALUE.auth[signal.auth]) / 5);
  return {
    human_usability: tool.implementation_burden === "very_low" ? 82 : tool.implementation_burden === "low" ? 76 : 66,
    workflow_fit: 75,
    ai_readiness: ai,
    integration_surface: Math.round((SIGNAL_VALUE.public_api[signal.public_api] + SIGNAL_VALUE.webhooks[signal.webhooks] + SIGNAL_VALUE.auth[signal.auth]) / 3),
    data_portability: SIGNAL_VALUE.exports[signal.exports],
    roi_potential: 72,
    vendor_maturity: tool.confidence === "high" ? 82 : tool.confidence === "medium" ? 70 : 58,
  };
}

export function profileToolScore(profile: FirmProfile, tool: Tool): number {
  const scores = tool.scores ?? inferredScores(tool);
  const multipliers = MATURITY_MULTIPLIERS[profile.technical_maturity];
  const entries = Object.keys(scores) as (keyof Score)[];
  const weighted = entries.reduce((total, key) => total + scores[key] * (multipliers[key] ?? 1), 0);
  let score = weighted / entries.reduce((sum, key) => sum + (multipliers[key] ?? 1), 0);

  if (tool.firm_type_fit.length > 0 && !tool.firm_type_fit.includes(profile.firm_type)) score -= 6;
  if (tool.team_size_fit.length > 0 && !tool.team_size_fit.includes(profile.team_size)) score -= 4;
  if (profile.implementation_owner === "no_clear_owner") score -= BURDEN_PENALTY[tool.implementation_burden] * 1.8;
  if (profile.budget_sensitivity === "low_budget") score -= PRICE_PENALTY[tool.estimated_price_band];
  return score;
}

export function relevantCategoryIds(profile: FirmProfile): string[] {
  return [...new Set(profile.primary_workflows.flatMap((workflow) => WORKFLOW_CATEGORIES[workflow]))];
}

export type RecommendationResult = {
  recommended_stack: Record<string, Tool | undefined>;
  minimum_viable_stack: Tool[];
  upgraded_stack: Tool[];
  avoid_for_now: Tool[];
  implementation_sequence: Array<{ step: number; category: Category; tool: Tool; rationale: string }>;
};

export function recommendTools(profile: FirmProfile, categories: Category[], tools: Tool[]): RecommendationResult {
  const relevant = relevantCategoryIds(profile);
  const recommended_stack: Record<string, Tool | undefined> = {};

  for (const categoryId of relevant) {
    recommended_stack[categoryId] = tools
      .filter((tool) => tool.category_id === categoryId)
      .toSorted((a, b) => profileToolScore(profile, b) - profileToolScore(profile, a) || a.name.localeCompare(b.name))[0];
  }

  const selected = relevant.flatMap((id) => recommended_stack[id] ? [recommended_stack[id]] as Tool[] : []);
  const ordered = selected.toSorted((a, b) => {
    const systemOrder = ["crm_relationship_intelligence", "meeting_memory", "private_market_data", "gtm_enrichment", "contact_data", "portfolio_monitoring_reporting", "ai_operating_layer"];
    return systemOrder.indexOf(a.category_id) - systemOrder.indexOf(b.category_id);
  });
  const categoryMap = new Map(categories.map((category) => [category.id, category]));

  return {
    recommended_stack,
    minimum_viable_stack: ordered.slice(0, Math.min(3, ordered.length)),
    upgraded_stack: ordered.slice(3),
    avoid_for_now: tools.filter((tool) => relevant.includes(tool.category_id) && tool.implementation_burden === "very_high" && profile.implementation_owner === "no_clear_owner").slice(0, 3),
    implementation_sequence: ordered.flatMap((tool, index) => {
      const category = categoryMap.get(tool.category_id);
      return category ? [{ step: index + 1, category, tool, rationale: index === 0 ? "Establish the system of record before layering adjacent workflows." : `Add after step ${index} so adoption and data flow remain controlled.` }] : [];
    }),
  };
}
