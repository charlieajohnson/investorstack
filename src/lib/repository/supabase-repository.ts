import {
  CategorySchema,
  GuideSchema,
  ToolSchema,
  WorkflowSchema,
  type Category,
  type Guide,
  type Tool,
  type Workflow,
} from "@/lib/domain/schemas";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { ToolRepository } from "./tool-repository";

async function payloads<T>(table: string, parser: { parse(value: unknown): T }): Promise<T[]> {
  const { data, error } = await getSupabaseServerClient().from(table).select("payload");
  if (error) throw error;
  return (data ?? []).map((row) => parser.parse(row.payload));
}

export class SupabaseRepository implements ToolRepository {
  async getCategories(): Promise<Category[]> { return payloads("categories", CategorySchema); }
  async getCategoryBySlug(slug: string) { return (await this.getCategories()).find((category) => category.slug === slug); }
  async getTools(): Promise<Tool[]> { return payloads("tools", ToolSchema); }
  async getToolBySlug(slug: string) { return (await this.getTools()).find((tool) => tool.slug === slug); }
  async getToolsByCategory(categoryId: string) { return (await this.getTools()).filter((tool) => tool.category_id === categoryId); }
  async getWorkflows(): Promise<Workflow[]> { return payloads("workflows", WorkflowSchema); }
  async getGuides(): Promise<Guide[]> { return payloads("guides", GuideSchema); }
  async getGuideBySlug(slug: string) { return (await this.getGuides()).find((guide) => guide.slug === slug); }
}
