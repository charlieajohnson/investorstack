import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CategoryGrid } from "@/components/directory/category-grid";
import type { Category, Tool } from "@/lib/domain/schemas";

const categories: Category[] = ([
  ["meeting_memory", "meeting-memory", "Meeting Memory"],
  ["crm_relationship_intelligence", "crm-relationship-intelligence", "CRM / Relationship Intelligence"],
  ["private_market_data", "private-market-data", "Private Market Data"],
  ["contact_data", "contact-data", "Contact Data"],
  ["gtm_enrichment", "gtm-enrichment", "GTM / Enrichment"],
  ["portfolio_monitoring_reporting", "portfolio-monitoring-finance-reporting", "Portfolio Monitoring / Finance Reporting"],
  ["ai_operating_layer", "ai-operating-layer", "AI Operating Layer"],
] satisfies Array<[string, string, string]>).map(([id, slug, name]) => ({
  id,
  slug,
  name,
  description: `${name} tools`,
  workflow_stages: ["atlas"],
  priority: "P1",
}));

const tools = categories.map((category, index) => ({
  id: `tool-${index}`,
  category_id: category.id,
})) as Tool[];

describe("CategoryGrid", () => {
  it("renders category atlas tableau cards with workflow-specific visuals", () => {
    render(<CategoryGrid categories={categories} tools={tools} />);

    for (const label of [
      "MEETING MEMORY",
      "RELATIONSHIP LEDGER",
      "MARKET SOURCES",
      "CONTACT DOSSIER",
      "ENRICHMENT WORKSHOP",
      "PORTFOLIO LEDGER",
      "OPERATING LAYER",
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }

    expect(screen.getByText("Capture conversations and preserve what was decided.")).toBeInTheDocument();

    const systemLayer = screen.getByRole("article", { name: /AI Operating Layer/i });
    expect(systemLayer).toHaveAttribute("data-featured", "true");
    expect(within(systemLayer).getByText("07 · SYSTEM LAYER")).toBeInTheDocument();
    expect(within(systemLayer).getByText("Context → Evidence → Recommendation → Action")).toBeInTheDocument();
  });
});
