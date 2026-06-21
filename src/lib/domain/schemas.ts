import { z } from "zod";

export const DIMENSIONS = [
  "human_usability",
  "workflow_fit",
  "ai_readiness",
  "integration_surface",
  "data_portability",
  "roi_potential",
  "vendor_maturity",
] as const;

export const DimensionSchema = z.enum(DIMENSIONS);
export type Dimension = z.infer<typeof DimensionSchema>;

export const ScoreSchema = z.object({
  human_usability: z.number().min(0).max(100),
  workflow_fit: z.number().min(0).max(100),
  ai_readiness: z.number().min(0).max(100),
  integration_surface: z.number().min(0).max(100),
  data_portability: z.number().min(0).max(100),
  roi_potential: z.number().min(0).max(100),
  vendor_maturity: z.number().min(0).max(100),
});
export type Score = z.infer<typeof ScoreSchema>;

export const AiReadinessSignalSchema = z.object({
  public_api: z.enum(["none", "limited", "documented"]),
  mcp: z.enum(["none", "third_party", "hosted"]),
  webhooks: z.enum(["none", "limited", "robust"]),
  exports: z.enum(["none", "manual_csv", "structured_sync"]),
  auth: z.enum(["manual", "token", "oauth_enterprise"]),
});

export const ToolSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  website: z.string().url(),
  category_id: z.string().min(1),
  short_description: z.string().min(1),
  long_description: z.string().optional(),
  best_for: z.array(z.string()).min(1),
  not_best_for: z.array(z.string()).min(1),
  primary_users: z.array(z.string()).default([]),
  firm_type_fit: z.array(z.string()).default([]),
  team_size_fit: z.array(z.string()).default([]),
  ai_readiness_signal: AiReadinessSignalSchema,
  scores: ScoreSchema.nullable(),
  scoring_status: z.enum(["scored", "provisional", "unscored"]),
  implementation_burden: z.enum(["very_low", "low", "medium", "high", "very_high"]),
  time_to_value: z.enum(["same_day", "one_week", "two_to_four_weeks", "one_to_three_months", "three_months_plus", "unknown"]),
  estimated_price_band: z.enum(["free", "low", "mid", "high", "enterprise", "unknown"]),
  alternatives: z.array(z.string()).default([]),
  pairs_well_with: z.array(z.string()).default([]),
  overlaps_with: z.array(z.string()).default([]),
  confidence: z.enum(["high", "medium", "low"]),
  data_sources: z.array(z.string()).min(1),
  last_reviewed_at: z.iso.date(),
});
export type Tool = z.infer<typeof ToolSchema>;

export const CategorySchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  description: z.string().min(1),
  workflow_stages: z.array(z.string()).min(1),
  priority: z.enum(["P0", "P1", "P2"]),
});
export type Category = z.infer<typeof CategorySchema>;

export const WorkflowSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string(),
  category_ids: z.array(z.string()),
});
export type Workflow = z.infer<typeof WorkflowSchema>;

export const GuideSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string(),
  summary: z.string(),
  audience: z.string(),
  sections: z.array(z.object({ heading: z.string(), body: z.string() })).min(1),
  last_reviewed_at: z.iso.date(),
});
export type Guide = z.infer<typeof GuideSchema>;

export const FirmProfileSchema = z.object({
  firm_type: z.enum(["lower_mid_market_pe", "growth_equity", "venture_capital", "search_fund", "family_office", "portfolio_company", "portfolio_finance_team"]),
  team_size: z.enum(["solo", "small_1_5", "lean_6_20", "mid_21_75", "large_75_plus"]),
  primary_workflows: z.array(z.enum(["origination", "crm_pipeline", "diligence", "portfolio_monitoring", "finance_reporting", "outreach", "meeting_memory", "ai_operating_layer", "internal_knowledge"])).min(1),
  technical_maturity: z.enum(["spreadsheet_native", "ops_tools", "api_ready", "ai_enabled"]),
  budget_sensitivity: z.enum(["low_budget", "moderate_budget", "enterprise_budget", "unknown"]),
  implementation_owner: z.enum(["no_clear_owner", "investment_team_member", "ops_lead", "finance_lead", "ai_data_lead", "external_consultant"]),
});
export type FirmProfile = z.infer<typeof FirmProfileSchema>;

export const CategoriesFileSchema = z.object({ categories: z.array(CategorySchema).min(1) });
export const ToolsFileSchema = z.object({ tools: z.array(ToolSchema).min(1) });
export const WorkflowsFileSchema = z.object({ workflows: z.array(WorkflowSchema).min(1) });
export const GuidesFileSchema = z.object({ guides: z.array(GuideSchema).min(1) });
