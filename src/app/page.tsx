import Link from "next/link";
import { CategoryGrid } from "@/components/directory/category-grid";
import { CategoryRankingTable } from "@/components/directory/category-ranking-table";
import { WorkflowMap } from "@/components/directory/workflow-map";
import { StackAuditVignette } from "@/components/home/stack-audit-vignette";
import { AiReadinessPanel } from "@/components/tool/ai-readiness-panel";
import { LeadCaptureForm } from "@/components/lead/lead-capture-form";
import { getRepository } from "@/lib/repository";

const startingModes = [
  { title: "Browse tools", description: "Find vendors by investment workflow category.", href: "/categories" },
  { title: "Audit current stack", description: "Map what you use and identify operating gaps.", href: "/stack-builder" },
  { title: "Compare vendors", description: "Evaluate two to four tools against investor-specific signals.", href: "/compare" },
  { title: "Read methodology", description: "See how evidence, confidence and provisional scores work.", href: "/methodology" },
] as const;

export default async function HomePage() {
  const repository = await getRepository();
  const [categories, tools, workflows] = await Promise.all([repository.getCategories(), repository.getTools(), repository.getWorkflows()]);
  const meetingTools = tools.filter((tool) => tool.category_id === "meeting_memory");
  const aiReference = tools.find((tool) => tool.slug === "affinity")!;

  return (
    <>
      <section className="home-hero">
        <div className="site-container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">The investment operating stack</p>
            <h1 className="display page-title">Find the right operating stack for your investment firm.</h1>
            <p className="lede">Map your current tools, compare vendors, and identify the systems that improve sourcing, diligence, portfolio monitoring, reporting, and AI-enabled workflows.</p>
            <div className="hero-actions">
              <Link className="button" href="/stack-builder">Audit your stack</Link>
              <Link className="button button-secondary" href="/categories">Browse categories</Link>
            </div>
            <p className="trust-line">Map → Score → Recommend → Evidence → Action</p>
          </div>
          <div className="hero-scene">
            <StackAuditVignette />
          </div>
        </div>
      </section>

      <section className="site-container mode-section" aria-labelledby="mode-title">
        <div className="mode-heading">
          <span className="eyebrow">Start with the job</span>
          <h2 id="mode-title" className="display section-title">What are you trying to do?</h2>
        </div>
        <div className="mode-grid">
          {startingModes.map((mode) => (
            <Link className="mode-card" href={mode.href} key={mode.href}>
              <span className="mode-card-arrow">↗</span>
              <h3>{mode.title}</h3>
              <p>{mode.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="site-container section-compact">
        <div className="rule-title"><h2>The investment workflow</h2><span className="meta">Workflow first, vendor second</span></div>
        <WorkflowMap workflows={workflows} />
      </section>

      <section className="site-container section">
        <div className="rule-title"><h2>Browse by category</h2><Link className="text-link" href="/categories">All categories →</Link></div>
        <CategoryGrid categories={categories} tools={tools} />
      </section>

      <section className="site-container section">
        <div className="page-header-grid" style={{ alignItems: "start", marginBottom: 28 }}>
          <div><span className="eyebrow">Product proof</span><h2 className="display section-title" style={{ marginTop: 10 }}>Map what your firm already uses.</h2></div>
          <p className="lede" style={{ margin: 0 }}>InvestorStack turns a partial tool map into a structured view of coverage, AI readiness, integration quality, and consolidation opportunity.</p>
        </div>
        <div className="feature-panel">
          <div className="feature-panel-copy">
            <span className="meta">Stack audit cockpit</span>
            <h3 className="display">From tool sprawl to operating clarity.</h3>
            <p>Start with the systems already in place. The audit keeps useful incumbents visible, flags missing capabilities, and explains each recommendation with evidence and confidence.</p>
            <Link className="button" href="/stack-builder">Start stack audit</Link>
          </div>
          <StackAuditVignette />
        </div>
      </section>

      <section className="section section-rule">
        <div className="site-container split-grid">
          <div><span className="eyebrow">Methodology</span><h2 className="display section-title" style={{ marginTop: 10 }}>Visible provenance, no pay-to-rank.</h2></div>
          <div><p className="lede">Every published score carries a confidence label and review date. Paid introductions never create or reorder a score, ranking or stack verdict.</p><Link className="button button-secondary" href="/methodology">Read the methodology</Link></div>
        </div>
      </section>

      <section className="wide-container section-compact">
        <div className="rule-title"><h2>Provisional Meeting Memory ranking</h2><Link className="text-link" href="/categories/meeting-memory">Open category →</Link></div>
        <CategoryRankingTable tools={meetingTools} />
        <p className="muted" style={{ fontSize: "0.8rem" }}>Only Meeting Memory carries provisional scores in pass 1. All other categories remain explicitly unscored.</p>
      </section>

      <section className="site-container section">
        <div className="page-header-grid" style={{ alignItems: "start", marginBottom: 28 }}>
          <div><span className="eyebrow">AI readiness</span><h2 className="display section-title" style={{ marginTop: 10 }}>Interfaces, not AI feature theatre.</h2></div>
          <p className="lede" style={{ margin: 0 }}>InvestorStack turns API, MCP, webhook, export and authentication evidence into a visible spec sheet. Native AI features are not a substitute for usable interfaces.</p>
        </div>
        <AiReadinessPanel tool={aiReference} />
      </section>

      <section className="site-container section-compact">
        <div className="surface lead-band"><div><span className="eyebrow">A real buying decision</span><h2 className="display" style={{ fontSize: "2.2rem", margin: "8px 0" }}>Want a second view on your current stack?</h2><p className="muted">Submit the context after using the audit. The synthetic pass records the interaction locally until email delivery is configured.</p></div><LeadCaptureForm compact /></div>
      </section>
    </>
  );
}
