"use client";

import { useMemo, useState } from "react";
import type { Category, FirmProfile, Tool } from "@/lib/domain/schemas";
import { recommendTools, type RecommendationResult } from "@/lib/domain/recommendations";
import { auditStack, type StackAudit } from "@/lib/domain/stack-audit";
import { formatLabel } from "@/lib/format";

const defaultProfile: FirmProfile = {
  firm_type: "lower_mid_market_pe",
  team_size: "lean_6_20",
  primary_workflows: ["origination", "meeting_memory", "crm_pipeline", "ai_operating_layer"],
  technical_maturity: "ops_tools",
  budget_sensitivity: "moderate_budget",
  implementation_owner: "ops_lead",
};

export function StackBuilder({ categories, tools }: { categories: Category[]; tools: Tool[] }) {
  const [mode, setMode] = useState<"profile" | "audit">("profile");
  const [profile, setProfile] = useState<FirmProfile>(defaultProfile);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [recommendation, setRecommendation] = useState<RecommendationResult>();
  const [audit, setAudit] = useState<StackAudit>();
  const mappedRows = useMemo(() => categories.map((category) => {
    const selected = tools.find((tool) => tool.slug === mapping[category.id]);
    return { category, selected };
  }), [categories, mapping, tools]);
  const mappedCount = mappedRows.filter((row) => row.selected).length;

  function updateProfile<K extends keyof FirmProfile>(key: K, value: FirmProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    setRecommendation(undefined);
  }

  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Stack builder mode">
        <button className="tab" type="button" role="tab" aria-selected={mode === "profile"} onClick={() => { setMode("profile"); setAudit(undefined); }}>Build from a firm profile</button>
        <button className="tab" type="button" role="tab" aria-selected={mode === "audit"} onClick={() => { setMode("audit"); setRecommendation(undefined); }}>Audit your current stack</button>
      </div>
      <div className="surface builder-shell" style={{ borderTopLeftRadius: 0 }}>
        {mode === "profile" ? (
          <form onSubmit={(event) => { event.preventDefault(); setRecommendation(recommendTools(profile, categories, tools)); }}>
            <div className="builder-intro">
              <div>
                <span className="eyebrow">Build from context</span>
                <h2 className="display">Start with the firm profile.</h2>
                <p className="lede">Use structured inputs to produce a provisional operating-stack sequence with rationale and implementation order.</p>
              </div>
              <div className="stack-map-preview">
                <span className="meta">Default profile</span>
                <ul>
                  <li><span>Firm type</span><strong>Lower-mid-market PE</strong><span className="stack-map-state">assumed</span></li>
                  <li><span>Team size</span><strong>6 to 20</strong><span className="stack-map-state">lean</span></li>
                  <li><span>Owner</span><strong>Ops lead</strong><span className="stack-map-state">implementation</span></li>
                </ul>
              </div>
            </div>
            <div className="form-grid">
              <div className="field"><label htmlFor="firm-type">Firm type</label><select className="select" id="firm-type" value={profile.firm_type} onChange={(event) => updateProfile("firm_type", event.target.value as FirmProfile["firm_type"])}><option value="lower_mid_market_pe">Lower-mid-market PE</option><option value="growth_equity">Growth equity</option><option value="venture_capital">Venture capital</option><option value="search_fund">Search fund</option><option value="family_office">Family office</option><option value="portfolio_company">Portfolio company</option><option value="portfolio_finance_team">Portfolio finance team</option></select></div>
              <div className="field"><label htmlFor="team-size">Team size</label><select className="select" id="team-size" value={profile.team_size} onChange={(event) => updateProfile("team_size", event.target.value as FirmProfile["team_size"])}><option value="solo">Solo</option><option value="small_1_5">1 to 5</option><option value="lean_6_20">6 to 20</option><option value="mid_21_75">21 to 75</option><option value="large_75_plus">75 plus</option></select></div>
              <div className="field"><label htmlFor="maturity">Technical maturity</label><select className="select" id="maturity" value={profile.technical_maturity} onChange={(event) => updateProfile("technical_maturity", event.target.value as FirmProfile["technical_maturity"])}><option value="spreadsheet_native">Spreadsheet-native</option><option value="ops_tools">Operations tools</option><option value="api_ready">API-ready</option><option value="ai_enabled">AI-enabled</option></select></div>
              <div className="field"><label htmlFor="budget">Budget sensitivity</label><select className="select" id="budget" value={profile.budget_sensitivity} onChange={(event) => updateProfile("budget_sensitivity", event.target.value as FirmProfile["budget_sensitivity"])}><option value="low_budget">Low budget</option><option value="moderate_budget">Moderate budget</option><option value="enterprise_budget">Enterprise budget</option><option value="unknown">Unknown</option></select></div>
              <div className="field"><label htmlFor="owner">Implementation owner</label><select className="select" id="owner" value={profile.implementation_owner} onChange={(event) => updateProfile("implementation_owner", event.target.value as FirmProfile["implementation_owner"])}><option value="no_clear_owner">No clear owner</option><option value="investment_team_member">Investment team member</option><option value="ops_lead">Operations lead</option><option value="finance_lead">Finance lead</option><option value="ai_data_lead">AI or data lead</option><option value="external_consultant">External consultant</option></select></div>
            </div>
            <fieldset style={{ border: 0, padding: 0, margin: "24px 0 0" }}><legend className="field-label" style={{ marginBottom: 8 }}>Primary workflows</legend><div className="choice-grid">{(["origination", "crm_pipeline", "diligence", "portfolio_monitoring", "finance_reporting", "outreach", "meeting_memory", "ai_operating_layer", "internal_knowledge"] as const).map((workflow) => <label className="choice" key={workflow}><input type="checkbox" checked={profile.primary_workflows.includes(workflow)} onChange={(event) => { const next = event.target.checked ? [...profile.primary_workflows, workflow] : profile.primary_workflows.filter((item) => item !== workflow); if (next.length) updateProfile("primary_workflows", next); }} />{formatLabel(workflow)}</label>)}</div></fieldset>
            <div className="builder-actions"><p className="muted">Recommendations are deterministic, provisional and explain their profile assumptions.</p><button className="button" type="submit">Build recommendation</button></div>
          </form>
        ) : (
          <form onSubmit={(event) => { event.preventDefault(); setAudit(auditStack(profile, mapping, categories, tools)); }}>
            <div className="builder-intro">
              <div>
                <span className="eyebrow">Stack health cockpit</span>
                <h2 className="display">Map what you use. See what works.</h2>
                <p className="lede">Partial maps are fine. Each selected tool becomes part of the stack health view before a provisional recommendation is produced.</p>
              </div>
              <div className="stack-map-preview">
                <span className="meta">{mappedCount} of {categories.length} categories mapped</span>
                <ul>
                  {mappedRows.slice(0, 6).map(({ category, selected }) => (
                    <li key={category.id}>
                      <span>{category.name}</span>
                      <strong>{selected?.name ?? "Not mapped"}</strong>
                      <span className="stack-map-state">{selected ? selected.implementation_burden.replaceAll("_", " ") : "gap"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="form-grid">{categories.map((category) => <div className="field" key={category.id}><label htmlFor={`mapping-${category.id}`}>{category.name}</label><select className="select" id={`mapping-${category.id}`} value={mapping[category.id] ?? ""} onChange={(event) => { setMapping((current) => ({ ...current, [category.id]: event.target.value })); setAudit(undefined); }}><option value="">Not mapped</option>{tools.filter((tool) => tool.category_id === category.id).map((tool) => <option key={tool.slug} value={tool.slug}>{tool.name}</option>)}</select></div>)}</div>
            <div className="builder-actions"><p className="muted">Recommendations respect the incumbent and default to augment, not replace.</p><button className="button" type="submit">Audit this stack</button></div>
          </form>
        )}
      </div>
      {recommendation ? <RecommendationView result={recommendation} /> : null}
      {audit ? <AuditView audit={audit} /> : null}
    </div>
  );
}

function RecommendationView({ result }: { result: RecommendationResult }) {
  return (
    <section className="section-compact" aria-live="polite">
      <div className="rule-title"><h2>Recommended stack</h2><span className="status-tag" data-tone="accent">Provisional</span></div>
      <div className="result-grid">
        {Object.entries(result.recommended_stack).flatMap(([category, tool]) => tool ? <div className="surface" key={category} style={{ padding: 20 }}><span className="meta">{formatLabel(category)}</span><h3 className="display" style={{ fontSize: "1.8rem", margin: "8px 0" }}>{tool.name}</h3><p className="muted">{tool.short_description}</p></div> : [])}
      </div>
      <h3 className="display" style={{ fontSize: "2rem", marginTop: 42 }}>Implementation sequence</h3>
      <ol className="list-clean">{result.implementation_sequence.map((item) => <li key={item.category.id}><span className="mono">{item.step}. </span><strong>{item.tool.name}</strong> · {item.rationale}</li>)}</ol>
    </section>
  );
}

function AuditView({ audit }: { audit: StackAudit }) {
  const verdictLabel = { keep: "Keep", add_alongside: "Add alongside", consider_replacing: "Consider replacing", fill_gap: "Fill gap" } as const;
  return (
    <section className="section-compact" aria-live="polite">
      <div className="rule-title"><h2>Stack health</h2><span className="status-tag" data-tone="accent">Provisional data</span></div>
      <div className="health-grid">{Object.entries(audit.health).map(([key, value]) => <div className="health-item" key={key}><span className="meta">{formatLabel(key)}</span><strong>{formatLabel(value)}</strong></div>)}</div>
      <div className="table-wrap" style={{ marginTop: 24 }}><table className="data-table"><thead><tr><th>Category</th><th>Current tool</th><th>Verdict</th><th>Recommendation</th><th>Rationale and expected value</th></tr></thead><tbody>{audit.items.map((item) => <tr key={item.category.id}><td>{item.category.name}</td><td>{item.current_tool?.name ?? "Not mapped"}</td><td><span className={`verdict verdict-${item.verdict}`}>{verdictLabel[item.verdict]}</span></td><td>{item.recommended_tool?.name ?? "Keep and optimise"}</td><td>{item.rationale} {item.expected_value}</td></tr>)}</tbody></table></div>
    </section>
  );
}
