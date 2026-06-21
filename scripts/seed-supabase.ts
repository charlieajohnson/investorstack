import { SeedRepository } from "../src/lib/repository/seed-repository";
import { getSupabaseServerClient } from "../src/lib/supabase";

async function main() {
  const repository = new SeedRepository();
  const client = getSupabaseServerClient();
  const [categories, tools, workflows, guides] = await Promise.all([
    repository.getCategories(), repository.getTools(), repository.getWorkflows(), repository.getGuides(),
  ]);

  const operations = [
    client.from("categories").upsert(categories.map((item) => ({ id: item.id, slug: item.slug, name: item.name, description: item.description, workflow_stages: item.workflow_stages, priority: item.priority, payload: item }))),
    client.from("tools").upsert(tools.map((item) => ({ id: item.id, slug: item.slug, name: item.name, website: item.website, category_id: item.category_id, scoring_status: item.scoring_status, scores: item.scores, ai_readiness_signal: item.ai_readiness_signal, confidence: item.confidence, last_reviewed_at: item.last_reviewed_at, payload: item }))),
    client.from("workflows").upsert(workflows.map((item) => ({ id: item.id, label: item.label, payload: item }))),
    client.from("guides").upsert(guides.map((item) => ({ slug: item.slug, title: item.title, audience: item.audience, last_reviewed_at: item.last_reviewed_at, payload: item }))),
  ];

  const results = await Promise.all(operations);
  const errors = results.flatMap((result) => result.error ? [result.error.message] : []);
  if (errors.length) throw new Error(errors.join("\n"));
  console.log(`Seeded ${categories.length} categories, ${tools.length} tools, ${workflows.length} workflows and ${guides.length} guides.`);
}

void main();
