import { validateSeedData } from "../src/lib/repository/seed-repository";

const data = validateSeedData();
const scored = data.tools.filter((tool) => tool.scores !== null);

if (data.categories.length !== 7) throw new Error(`Expected 7 categories, found ${data.categories.length}`);
if (data.tools.length !== 35) throw new Error(`Expected 35 tools, found ${data.tools.length}`);
if (scored.length !== 5 || scored.some((tool) => tool.category_id !== "meeting_memory" || tool.scoring_status !== "provisional")) {
  throw new Error("Only five provisional Meeting Memory tools may carry pass-1 scores");
}

console.log(`Validated ${data.categories.length} categories, ${data.tools.length} tools, ${data.guides.length} guides and ${data.workflows.length} workflow stages.`);
