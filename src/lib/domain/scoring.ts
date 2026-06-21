import type { Score, Tool } from "./schemas";

export const WEIGHTS: Record<keyof Score, number> = {
  human_usability: 20,
  workflow_fit: 20,
  ai_readiness: 20,
  integration_surface: 15,
  data_portability: 10,
  roi_potential: 10,
  vendor_maturity: 5,
};

export function calculateOverallScore(scores: Score): number {
  const total = (Object.keys(WEIGHTS) as (keyof Score)[]).reduce(
    (sum, key) => sum + scores[key] * WEIGHTS[key],
    0,
  );
  return Math.round(total / 100);
}

export function rankScoredTools(tools: Tool[]): Tool[] {
  return tools
    .filter((tool): tool is Tool & { scores: Score } => tool.scores !== null)
    .toSorted((left, right) => {
      const overall = calculateOverallScore(right.scores) - calculateOverallScore(left.scores);
      if (overall !== 0) return overall;
      const workflow = right.scores.workflow_fit - left.scores.workflow_fit;
      if (workflow !== 0) return workflow;
      const ai = right.scores.ai_readiness - left.scores.ai_readiness;
      return ai !== 0 ? ai : left.name.localeCompare(right.name);
    });
}
