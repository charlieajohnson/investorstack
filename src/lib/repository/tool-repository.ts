import type { Category, Guide, Tool, Workflow } from "@/lib/domain/schemas";

export interface ToolRepository {
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  getTools(): Promise<Tool[]>;
  getToolBySlug(slug: string): Promise<Tool | undefined>;
  getToolsByCategory(categoryId: string): Promise<Tool[]>;
  getWorkflows(): Promise<Workflow[]>;
  getGuides(): Promise<Guide[]>;
  getGuideBySlug(slug: string): Promise<Guide | undefined>;
}
