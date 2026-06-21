import { describe, expect, it } from "vitest";
import { SeedRepository } from "@/lib/repository/seed-repository";

describe("SeedRepository", () => {
  const repository = new SeedRepository();

  it("loads seven categories and 35 tools", async () => {
    await expect(repository.getCategories()).resolves.toHaveLength(7);
    await expect(repository.getTools()).resolves.toHaveLength(35);
  });

  it("ships scores only for the five provisional Meeting Memory tools", async () => {
    const tools = await repository.getTools();
    expect(tools.filter((tool) => tool.scores !== null)).toHaveLength(5);
    expect(tools.filter((tool) => tool.scores !== null).every((tool) => tool.category_id === "meeting_memory" && tool.scoring_status === "provisional")).toBe(true);
  });

  it("resolves categories and tools by slug", async () => {
    await expect(repository.getCategoryBySlug("meeting-memory")).resolves.toMatchObject({ id: "meeting_memory" });
    await expect(repository.getToolBySlug("granola")).resolves.toMatchObject({ name: "Granola" });
  });

  it("keeps every source and cross-tool relationship resolvable", async () => {
    const tools = await repository.getTools();
    const slugs = new Set(tools.map((tool) => tool.slug));
    for (const tool of tools) {
      expect(tool.data_sources.length).toBeGreaterThan(0);
      for (const related of [...tool.alternatives, ...tool.pairs_well_with, ...tool.overlaps_with]) {
        expect(slugs.has(related), `${tool.slug} -> ${related}`).toBe(true);
      }
    }
  });
});
