import Image from "next/image";
import Link from "next/link";
import { CategoryGrid } from "@/components/directory/category-grid";
import { CategoryRankingTable } from "@/components/directory/category-ranking-table";
import { WorkflowMap } from "@/components/directory/workflow-map";
import { AiReadinessPanel } from "@/components/tool/ai-readiness-panel";
import { LeadCaptureForm } from "@/components/lead/lead-capture-form";
import { getRepository } from "@/lib/repository";

export default async function HomePage() {
  const repository = await getRepository();
  const [categories, tools, workflows] = await Promise.all([repository.getCategories(), repository.getTools(), repository.getWorkflows()]);
  const meetingTools = tools.filter((tool) => tool.category_id === "meeting_memory");
  const aiReference = tools.find((tool) => tool.slug === "affinity")!;

  return (
    <>
      <section className="hero">
        <Image className="hero-image" src="/images/orchard-hero.jpg" alt="Ordered orchard rows across a cultivated valley" fill fetchPriority="low" loading="lazy" unoptimized sizes="100vw" />
        <div className="site-container hero-content">
          <div className="hero-copy">
            <p className="eyebrow">The investment operating stack</p>
            <h1 className="display page-title" style={{ fontSize: "clamp(3.2rem, 5vw, 4.1rem)" }}>Find the right operating stack for your investment firm.</h1>
            <p className="lede">Compare tools for sourcing, CRM, meeting memory, portfolio monitoring, contact enrichment, reporting and AI-enabled workflows.</p>
            <div className="hero-actions"><Link className="button" href="/stack-builder">Build your stack</Link><Link className="button button-secondary" href="/categories">Browse categories</Link></div>
            <p className="trust-line">Scored by workflow fit, human usability, AI readiness, integration depth and expected time-to-value.</p>
          </div>
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

      <section className="wide-container section-compact">
        <div className="rule-title"><h2>Provisional Meeting Memory ranking</h2><Link className="text-link" href="/categories/meeting-memory">Open category →</Link></div>
        <CategoryRankingTable tools={meetingTools} />
        <p className="muted" style={{ fontSize: "0.8rem" }}>Only Meeting Memory carries provisional scores in pass 1. All other categories remain explicitly unscored.</p>
      </section>

      <section className="site-container section">
        <div className="page-header-grid" style={{ alignItems: "start", marginBottom: 28 }}>
          <div><span className="eyebrow">The differentiating signal</span><h2 className="display section-title" style={{ marginTop: 10 }}>Can your software participate in the AI workflow?</h2></div>
          <p className="lede" style={{ margin: 0 }}>InvestorStack turns API, MCP, webhook, export and authentication evidence into a visible spec sheet. Native AI features are not a substitute for usable interfaces.</p>
        </div>
        <AiReadinessPanel tool={aiReference} />
      </section>

      <section className="section section-rule">
        <div className="site-container split-grid">
          <div><span className="eyebrow">Methodology</span><h2 className="display section-title" style={{ marginTop: 10 }}>Visible provenance, no pay-to-rank.</h2></div>
          <div><p className="lede">Every published score carries a confidence label and review date. Paid introductions never create or reorder a score, ranking or stack verdict.</p><Link className="button button-secondary" href="/methodology">Read the methodology</Link></div>
        </div>
      </section>

      <section className="site-container section-compact">
        <div className="surface lead-band"><div><span className="eyebrow">A real buying decision</span><h2 className="display" style={{ fontSize: "2.2rem", margin: "8px 0" }}>Want a second view on your current stack?</h2><p className="muted">Submit the context after using the audit. The synthetic pass records the interaction locally until email delivery is configured.</p></div><LeadCaptureForm compact /></div>
      </section>
    </>
  );
}
