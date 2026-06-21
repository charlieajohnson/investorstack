import type { Category, FirmProfile, Tool } from "./schemas";
import { profileToolScore, relevantCategoryIds } from "./recommendations";

export type AuditVerdict = "keep" | "add_alongside" | "consider_replacing" | "fill_gap";

export type AuditItem = {
  category: Category;
  current_tool?: Tool;
  verdict: AuditVerdict;
  recommended_tool?: Tool;
  rationale: string;
  expected_value: string;
};

export type StackAudit = {
  health: {
    coverage: "limited" | "developing" | "strong";
    ai_readiness: "limited" | "developing" | "strong";
    integration_cohesion: "fragmented" | "developing" | "connected";
    consolidation: "low" | "review" | "opportunity";
  };
  items: AuditItem[];
};

export function auditStack(
  profile: FirmProfile,
  mapping: Record<string, string | undefined>,
  categories: Category[],
  tools: Tool[],
): StackAudit {
  const relevant = relevantCategoryIds(profile);
  const items = categories.filter((category) => relevant.includes(category.id)).map((category): AuditItem => {
    const candidates = tools.filter((tool) => tool.category_id === category.id);
    const ranked = candidates.toSorted((a, b) => profileToolScore(profile, b) - profileToolScore(profile, a));
    const current = tools.find((tool) => tool.slug === mapping[category.id] && tool.category_id === category.id);
    const leader = ranked[0];

    if (!current) {
      return {
        category,
        verdict: "fill_gap",
        recommended_tool: leader,
        rationale: `No ${category.name.toLowerCase()} tool is mapped for a workflow you selected.`,
        expected_value: leader ? `Establish coverage with ${leader.name} without disturbing the rest of the stack.` : "Establish category coverage.",
      };
    }

    const complementSlug = current.pairs_well_with.find((slug) => candidates.some((tool) => tool.slug === slug));
    const complement = candidates.find((tool) => tool.slug === complementSlug);
    if (complement) {
      return {
        category,
        current_tool: current,
        verdict: "add_alongside",
        recommended_tool: complement,
        rationale: `${current.name} remains the incumbent; ${complement.name} covers ${complement.best_for[0]} as a distinct job.`,
        expected_value: "Wider workflow coverage without a rip-and-replace programme.",
      };
    }

    if (leader && leader.slug !== current.slug && current.scores && leader.scores && profileToolScore(profile, leader) - profileToolScore(profile, current) >= 8) {
      return {
        category,
        current_tool: current,
        verdict: "consider_replacing",
        recommended_tool: leader,
        rationale: `${leader.name} is materially stronger against this firm profile's weighted requirements.`,
        expected_value: "Potential fit improvement, subject to migration cost and direct product validation.",
      };
    }

    return {
      category,
      current_tool: current,
      verdict: "keep",
      rationale: `${current.name} remains a defensible fit and no structured evidence supports replacement.`,
      expected_value: "Retain the incumbent and improve process discipline before adding software.",
    };
  });

  const mapped = items.filter((item) => item.current_tool).length;
  const coverageRatio = items.length === 0 ? 0 : mapped / items.length;
  const mappedTools = items.flatMap((item) => item.current_tool ? [item.current_tool] : []);
  const aiStrong = mappedTools.filter((tool) => tool.ai_readiness_signal.mcp !== "none" || tool.ai_readiness_signal.public_api === "documented").length;
  const complementCount = items.filter((item) => item.verdict === "add_alongside").length;

  return {
    health: {
      coverage: coverageRatio >= 0.8 ? "strong" : coverageRatio >= 0.45 ? "developing" : "limited",
      ai_readiness: mappedTools.length > 0 && aiStrong / mappedTools.length >= 0.7 ? "strong" : aiStrong > 0 ? "developing" : "limited",
      integration_cohesion: complementCount > 1 ? "connected" : mapped > 2 ? "developing" : "fragmented",
      consolidation: items.some((item) => item.verdict === "consider_replacing") ? "opportunity" : mapped > 4 ? "review" : "low",
    },
    items,
  };
}
