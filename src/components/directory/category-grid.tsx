import Link from "next/link";
import type { Category, Tool } from "@/lib/domain/schemas";

const categoryTableaus: Record<string, {
  label: string;
  purpose: string;
  visual: string;
}> = {
  meeting_memory: {
    label: "MEETING MEMORY",
    purpose: "Capture conversations and preserve what was decided.",
    visual: "meeting",
  },
  crm_relationship_intelligence: {
    label: "RELATIONSHIP LEDGER",
    purpose: "Track relationships, context and next actions.",
    visual: "relationship",
  },
  private_market_data: {
    label: "MARKET SOURCES",
    purpose: "Discover companies and understand market shape.",
    visual: "market",
  },
  contact_data: {
    label: "CONTACT DOSSIER",
    purpose: "Find and validate professional contact information.",
    visual: "contact",
  },
  gtm_enrichment: {
    label: "ENRICHMENT WORKSHOP",
    purpose: "Build lists, add context and route the next action.",
    visual: "enrichment",
  },
  portfolio_monitoring_reporting: {
    label: "PORTFOLIO LEDGER",
    purpose: "Track portfolio KPIs, reporting and operating signals.",
    visual: "portfolio",
  },
  ai_operating_layer: {
    label: "OPERATING LAYER",
    purpose: "Coordinate AI workflows over trusted firm context.",
    visual: "operating",
  },
};

export function CategoryGrid({ categories, tools }: { categories: Category[]; tools: Tool[] }) {
  const toolCounts = tools.reduce<Record<string, number>>((counts, tool) => {
    counts[tool.category_id] = (counts[tool.category_id] ?? 0) + 1;
    return counts;
  }, {});

  return (
    <div className="category-grid">
      {categories.map((category, index) => {
        const tableau = categoryTableaus[category.id] ?? { label: category.name.toUpperCase(), purpose: category.description, visual: "default" };
        const toolCount = toolCounts[category.id] ?? 0;
        const isSystemLayer = category.id === "ai_operating_layer";
        const titleId = `category-${category.id}-title`;

        return (
          <article aria-labelledby={titleId} className="category-card" data-featured={isSystemLayer ? "true" : undefined} key={category.id}>
            <div className="category-card-body">
              <span className="meta">{isSystemLayer ? `${String(index + 1).padStart(2, "0")} · SYSTEM LAYER` : `${String(index + 1).padStart(2, "0")} · ${toolCount} tools`}</span>
              <h3 id={titleId}>{category.name}</h3>
              <p>{tableau.purpose}</p>
              {isSystemLayer ? <p className="category-system-path">Context → Evidence → Recommendation → Action</p> : null}
              <Link className="text-link category-cta" href={`/categories/${category.slug}`}>
                <span>View tools</span>
                <span aria-hidden="true" className="category-cta-arrow">→</span>
              </Link>
            </div>
            <CategoryTableauVisual label={tableau.label} variant={tableau.visual} />
          </article>
        );
      })}
    </div>
  );
}

function CategoryTableauVisual({ label, variant }: { label: string; variant: string }) {
  return (
    <div aria-label={`${label.toLowerCase()} workflow visual`} className="category-visual" data-visual={variant} role="img">
      <span className="category-visual-label">{label}</span>
      <div className="visual-field" aria-hidden="true">
        <span className="visual-object visual-object-a" />
        <span className="visual-object visual-object-b" />
        <span className="visual-object visual-object-c" />
        <span className="visual-line visual-line-a" />
        <span className="visual-line visual-line-b" />
        <span className="visual-dot visual-dot-a" />
        <span className="visual-dot visual-dot-b" />
        <span className="visual-dot visual-dot-c" />
      </div>
    </div>
  );
}
