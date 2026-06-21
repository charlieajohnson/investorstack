import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";
import {
  CategoriesFileSchema,
  GuidesFileSchema,
  ToolsFileSchema,
  WorkflowsFileSchema,
  type Category,
  type Guide,
  type Tool,
  type Workflow,
} from "@/lib/domain/schemas";
import type { ToolRepository } from "./tool-repository";

function readYaml(filename: string): unknown {
  const file = path.join(process.cwd(), "data", filename);
  return parse(fs.readFileSync(file, "utf8"));
}

let cache: { categories: Category[]; tools: Tool[]; workflows: Workflow[]; guides: Guide[] } | undefined;

function loadData() {
  if (cache) return cache;
  cache = {
    categories: CategoriesFileSchema.parse(readYaml("categories.yaml")).categories,
    tools: ToolsFileSchema.parse(readYaml("tools.yaml")).tools,
    workflows: WorkflowsFileSchema.parse(readYaml("workflows.yaml")).workflows,
    guides: GuidesFileSchema.parse(readYaml("guides.yaml")).guides,
  };
  return cache;
}

export class SeedRepository implements ToolRepository {
  async getCategories() { return loadData().categories; }
  async getCategoryBySlug(slug: string) { return loadData().categories.find((category) => category.slug === slug); }
  async getTools() { return loadData().tools; }
  async getToolBySlug(slug: string) { return loadData().tools.find((tool) => tool.slug === slug); }
  async getToolsByCategory(categoryId: string) { return loadData().tools.filter((tool) => tool.category_id === categoryId); }
  async getWorkflows() { return loadData().workflows; }
  async getGuides() { return loadData().guides; }
  async getGuideBySlug(slug: string) { return loadData().guides.find((guide) => guide.slug === slug); }
}

export function validateSeedData() {
  const data = loadData();
  const categoryIds = new Set(data.categories.map((category) => category.id));
  const toolSlugs = new Set(data.tools.map((tool) => tool.slug));
  const errors: string[] = [];
  for (const tool of data.tools) {
    if (!categoryIds.has(tool.category_id)) errors.push(`${tool.slug}: unknown category ${tool.category_id}`);
    for (const related of [...tool.alternatives, ...tool.pairs_well_with, ...tool.overlaps_with]) {
      if (!toolSlugs.has(related)) errors.push(`${tool.slug}: unknown related tool ${related}`);
    }
  }
  if (new Set(data.tools.map((tool) => tool.slug)).size !== data.tools.length) errors.push("Duplicate tool slug");
  if (new Set(data.categories.map((category) => category.slug)).size !== data.categories.length) errors.push("Duplicate category slug");
  if (errors.length) throw new Error(errors.join("\n"));
  return data;
}
