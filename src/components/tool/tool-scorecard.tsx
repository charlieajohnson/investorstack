import Link from "next/link";
import { StatusTag } from "@/components/common/status-tag";
import { ToolMark } from "@/components/common/tool-mark";
import type { Category, Tool } from "@/lib/domain/schemas";
import { DIMENSIONS } from "@/lib/domain/schemas";
import { calculateOverallScore } from "@/lib/domain/scoring";
import { formatLabel } from "@/lib/format";
import { AiReadinessPanel } from "./ai-readiness-panel";

export function ToolScorecard({ tool, category, related }: { tool: Tool; category: Category; related: Tool[] }) {
  const scores = tool.scores;
  const relatedMap = new Map(related.map((item) => [item.slug, item]));
  const pairs = tool.pairs_well_with.flatMap((slug) => relatedMap.get(slug) ? [relatedMap.get(slug)!] : []);
  const alternatives = tool.alternatives.flatMap((slug) => relatedMap.get(slug) ? [relatedMap.get(slug)!] : []);
  return (
    <>
      <header className="page-header">
        <div className="site-container page-header-grid">
          <div>
            <Link className="meta text-link" href={`/categories/${category.slug}`}>{category.name}</Link>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16 }}><ToolMark name={tool.name} slug={tool.slug} /><h1 className="display section-title" style={{ fontSize: "clamp(3rem, 7vw, 5.8rem)" }}>{tool.name}</h1></div>
            <p className="lede">{tool.short_description}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}><StatusTag tone={tool.scoring_status === "provisional" ? "accent" : "neutral"}>{formatLabel(tool.scoring_status)}</StatusTag><StatusTag>{formatLabel(tool.confidence)} confidence</StatusTag><StatusTag>{tool.last_reviewed_at}</StatusTag></div>
          </div>
          <div>
          {scores ? <><span className="meta">Overall</span><div className="display" style={{ color: "var(--color-accent)", fontSize: "6rem", lineHeight: 1 }}>{calculateOverallScore(scores)}</div><span className="muted">Derived from seven provisional dimensions</span></> : <><span className="meta">Scoring status</span><div className="display" style={{ fontSize: "2.4rem", lineHeight: 1.1, marginTop: 8 }}>Not yet scored</div><p className="muted">Qualitative facts and machine-readiness signals only.</p></>}
          </div>
        </div>
      </header>
      <div className="site-container section-compact">
        {tool.scoring_status === "provisional" ? <div className="provisional-banner">These scores are illustrative and provisional. Review the evidence and methodology before using them in a buying decision.</div> : null}
      </div>
      <section className="site-container section-compact">
        <dl className="facts-grid">
          <div className="fact"><dt>Best for</dt><dd>{tool.best_for[0]}</dd></div>
          <div className="fact"><dt>Implementation</dt><dd>{formatLabel(tool.implementation_burden)}</dd></div>
          <div className="fact"><dt>Time-to-value</dt><dd className="mono">{formatLabel(tool.time_to_value)}</dd></div>
          <div className="fact"><dt>Price band</dt><dd className="mono">{formatLabel(tool.estimated_price_band)}</dd></div>
        </dl>
      </section>
      <section className="site-container section-compact score-layout">
        <div>
          <div className="rule-title"><h2>Seven-dimension score</h2><Link className="text-link" href="/methodology">Methodology →</Link></div>
          {scores ? DIMENSIONS.map((dimension) => <div className="score-row" key={dimension}><span>{formatLabel(dimension)}</span><div className="score-track"><div className="score-fill" style={{ width: `${scores[dimension]}%` }} /></div><span className="mono">{scores[dimension]}</span></div>) : <div className="surface" style={{ padding: 24 }}><h3 className="display" style={{ marginTop: 0 }}>Numbers withheld by design</h3><p className="muted">InvestorStack publishes a score only after a deliberate evidence pass. Unscored is not zero.</p></div>}
        </div>
        <div className="surface" style={{ padding: 24 }}>
          <span className="eyebrow">Editorial fit</span><h2 className="display" style={{ fontSize: "2rem", margin: "8px 0 14px" }}>What this tool is for</h2>
          <p>{tool.long_description ?? tool.short_description}</p>
          <p className="meta" style={{ marginTop: 24 }}>Source coverage</p><p className="muted">{tool.data_sources.length} first-party or research source{tool.data_sources.length === 1 ? "" : "s"}. Confidence: {tool.confidence}.</p>
        </div>
      </section>
      <section className="site-container section"><AiReadinessPanel tool={tool} /></section>
      <section className="site-container section-compact split-grid">
        <div><div className="rule-title"><h2>Best for</h2></div><ul className="list-clean">{tool.best_for.map((item) => <li key={item}>{item}</li>)}</ul></div>
        <div><div className="rule-title"><h2>Not best for</h2></div><ul className="list-clean">{tool.not_best_for.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </section>
      <section className="site-container section-compact split-grid">
        <div><div className="rule-title"><h2>Pairs well with</h2></div>{pairs.length ? <ul className="list-clean">{pairs.map((item) => <li key={item.slug}><Link className="text-link" href={`/tools/${item.slug}`}>{item.name}</Link> for {item.best_for[0]}</li>)}</ul> : <p className="muted">No structured complement recorded yet.</p>}</div>
        <div><div className="rule-title"><h2>Alternatives</h2></div>{alternatives.length ? <ul className="list-clean">{alternatives.map((item) => <li key={item.slug}><Link className="text-link" href={`/tools/${item.slug}`}>{item.name}</Link></li>)}</ul> : <p className="muted">No alternatives recorded yet.</p>}</div>
      </section>
      <section className="site-container section"><div className="surface lead-band"><div><span className="eyebrow">Keep the record current</span><h2 className="display" style={{ margin: "8px 0", fontSize: "2rem" }}>Know something we should verify?</h2><p className="muted">Vendor and user corrections enter an editorial review queue. Submissions do not change scores automatically.</p></div><div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}><Link className="button button-secondary" href={`/submit-update?tool=${tool.slug}`}>Suggest an update</Link><Link className="button" href={`/compare?tools=${tool.slug}`}>Compare this tool</Link></div></div></section>
    </>
  );
}
