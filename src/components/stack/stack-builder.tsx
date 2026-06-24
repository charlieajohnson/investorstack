"use client";

import { useMemo, useState, type FormEvent } from "react";
import type { Category, FirmProfile, Tool } from "@/lib/domain/schemas";
import { recommendTools, relevantCategoryIds, type RecommendationResult } from "@/lib/domain/recommendations";
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

const workflowOptions = [
  "origination",
  "crm_pipeline",
  "diligence",
  "portfolio_monitoring",
  "finance_reporting",
  "outreach",
  "meeting_memory",
  "ai_operating_layer",
  "internal_knowledge",
] as const;

const builderSteps = [
  {
    shortTitle: "Firm identity",
    title: "What firm are we mapping?",
    description: "Start with a name or URL. This updates the local stack preview and does not call an external agent.",
  },
  {
    shortTitle: "Firm profile",
    title: "What kind of operating context are we dealing with?",
    description: "Set the firm shape before asking the directory to recommend tools.",
  },
  {
    shortTitle: "Workflows",
    title: "Which workflows matter now?",
    description: "Each selected workflow places a brick into the operating-stack preview.",
  },
  {
    shortTitle: "Current tools",
    title: "What is already in place?",
    description: "Partial maps are fine. Incumbents stay visible so the output can augment before replacing.",
  },
  {
    shortTitle: "Constraints",
    title: "How should the recommendation behave?",
    description: "Tune the sequence around maturity, budget and implementation ownership.",
  },
  {
    shortTitle: "Recommendation",
    title: "Review the stack ledger.",
    description: "Generate a provisional sequence with profile assumptions, workflow fit and evidence attached.",
  },
] as const;

export function StackBuilder({ categories, tools }: { categories: Category[]; tools: Tool[] }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [firmIdentity, setFirmIdentity] = useState("");
  const [profile, setProfile] = useState<FirmProfile>(defaultProfile);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [preserveIncumbents, setPreserveIncumbents] = useState("preserve");
  const [pace, setPace] = useState("balanced");
  const [securityPosture, setSecurityPosture] = useState("standard");
  const [recommendation, setRecommendation] = useState<RecommendationResult>();
  const [audit, setAudit] = useState<StackAudit>();

  const relevantIds = useMemo(() => relevantCategoryIds(profile), [profile]);
  const currentStep = builderSteps[stepIndex] ?? builderSteps[0]!;
  const mappedRows = useMemo(() => categories.map((category) => {
    const selected = tools.find((tool) => tool.slug === mapping[category.id]);
    return { category, selected };
  }), [categories, mapping, tools]);
  const mappedCount = mappedRows.filter((row) => row.selected).length;
  const relevantGapCount = categories.filter((category) => relevantIds.includes(category.id) && !mapping[category.id]).length;

  function clearResults() {
    setRecommendation(undefined);
    setAudit(undefined);
  }

  function updateProfile<K extends keyof FirmProfile>(key: K, value: FirmProfile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
    clearResults();
  }

  function updateIdentity(value: string) {
    setFirmIdentity(value);
    clearResults();
  }

  function toggleWorkflow(workflow: FirmProfile["primary_workflows"][number]) {
    const exists = profile.primary_workflows.includes(workflow);
    const next = exists
      ? profile.primary_workflows.filter((item) => item !== workflow)
      : [...profile.primary_workflows, workflow];
    if (next.length === 0) return;
    updateProfile("primary_workflows", next);
  }

  function updateMapping(categoryId: string, toolSlug: string) {
    setMapping((current) => {
      const next = { ...current };
      if (toolSlug) {
        next[categoryId] = toolSlug;
      } else {
        delete next[categoryId];
      }
      return next;
    });
    clearResults();
  }

  function buildRecommendation() {
    setRecommendation(recommendTools(profile, categories, tools));
    setAudit(auditStack(profile, mapping, categories, tools));
  }

  function goNext() {
    setStepIndex((current) => Math.min(current + 1, builderSteps.length - 1));
  }

  function goBack() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (stepIndex < builderSteps.length - 1) {
      goNext();
      return;
    }
    buildRecommendation();
  }

  return (
    <div className="builder-atlas">
      <div className="builder-stepper" aria-label="Builder steps">
        {builderSteps.map((step, index) => (
          <button
            aria-current={stepIndex === index ? "step" : undefined}
            className="builder-step"
            key={step.shortTitle}
            type="button"
            onClick={() => setStepIndex(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>Step {index + 1} {step.shortTitle}</strong>
          </button>
        ))}
      </div>

      <div className="builder-ledger">
        <form className="question-panel" onSubmit={onSubmit}>
          <span className="eyebrow">Stack Builder / Step {String(stepIndex + 1).padStart(2, "0")} of {builderSteps.length}</span>
          <h2 className="display">{currentStep.title}</h2>
          <p>{currentStep.description}</p>
          {stepIndex === 0 ? (
            <FirmIdentityStep firmIdentity={firmIdentity} onChange={updateIdentity} />
          ) : stepIndex === 1 ? (
            <FirmProfileStep profile={profile} updateProfile={updateProfile} />
          ) : stepIndex === 2 ? (
            <WorkflowStep profile={profile} toggleWorkflow={toggleWorkflow} />
          ) : stepIndex === 3 ? (
            <CurrentToolsStep categories={categories} mapping={mapping} tools={tools} updateMapping={updateMapping} />
          ) : stepIndex === 4 ? (
            <ConstraintsStep
              pace={pace}
              preserveIncumbents={preserveIncumbents}
              profile={profile}
              securityPosture={securityPosture}
              setPace={(value) => { setPace(value); clearResults(); }}
              setPreserveIncumbents={(value) => { setPreserveIncumbents(value); clearResults(); }}
              setSecurityPosture={(value) => { setSecurityPosture(value); clearResults(); }}
              updateProfile={updateProfile}
            />
          ) : (
            <ReviewStep
              mappedCount={mappedCount}
              pace={pace}
              preserveIncumbents={preserveIncumbents}
              profile={profile}
              relevantGapCount={relevantGapCount}
              securityPosture={securityPosture}
            />
          )}
          <div className="builder-actions">
            <button className="button button-secondary" type="button" onClick={goBack} disabled={stepIndex === 0}>Back</button>
            <button className="button" type="submit">{stepIndex === builderSteps.length - 1 ? "Build recommendation" : "Continue"}</button>
          </div>
        </form>

        <StackPreview
          audit={audit}
          firmIdentity={firmIdentity}
          mappedCount={mappedCount}
          mappedRows={mappedRows}
          pace={pace}
          preserveIncumbents={preserveIncumbents}
          profile={profile}
          recommendation={recommendation}
          relevantGapCount={relevantGapCount}
          securityPosture={securityPosture}
        />
      </div>

      {recommendation ? <RecommendationView result={recommendation} /> : null}
      {audit ? <AuditView audit={audit} /> : null}
    </div>
  );
}

function FirmIdentityStep({ firmIdentity, onChange }: { firmIdentity: string; onChange: (value: string) => void }) {
  return (
    <div className="question-fields">
      <div className="field">
        <label htmlFor="firm-identity">Firm name or URL</label>
        <input
          className="input firm-input"
          id="firm-identity"
          name="firm-identity"
          onChange={(event) => onChange(event.target.value)}
          placeholder="examplecapital.com"
          value={firmIdentity}
        />
      </div>
      <p className="field-help">Future version: dispatch an agent to pre-fill the firm profile from public context. For now this creates a synthetic starting point for the audit.</p>
      <span className="status-tag" data-tone="accent">Agent prefill: concept only</span>
    </div>
  );
}

function FirmProfileStep({
  profile,
  updateProfile,
}: {
  profile: FirmProfile;
  updateProfile: <K extends keyof FirmProfile>(key: K, value: FirmProfile[K]) => void;
}) {
  return (
    <div className="form-grid">
      <div className="field"><label htmlFor="firm-type">Firm type</label><select className="select" id="firm-type" value={profile.firm_type} onChange={(event) => updateProfile("firm_type", event.target.value as FirmProfile["firm_type"])}><option value="lower_mid_market_pe">Lower-mid-market PE</option><option value="growth_equity">Growth equity</option><option value="venture_capital">Venture capital</option><option value="search_fund">Search fund</option><option value="family_office">Family office</option><option value="portfolio_company">Portfolio company</option><option value="portfolio_finance_team">Portfolio finance team</option></select></div>
      <div className="field"><label htmlFor="team-size">Team size</label><select className="select" id="team-size" value={profile.team_size} onChange={(event) => updateProfile("team_size", event.target.value as FirmProfile["team_size"])}><option value="solo">Solo</option><option value="small_1_5">1 to 5</option><option value="lean_6_20">6 to 20</option><option value="mid_21_75">21 to 75</option><option value="large_75_plus">75 plus</option></select></div>
      <div className="field"><label htmlFor="owner">Implementation owner</label><select className="select" id="owner" value={profile.implementation_owner} onChange={(event) => updateProfile("implementation_owner", event.target.value as FirmProfile["implementation_owner"])}><option value="no_clear_owner">No clear owner</option><option value="investment_team_member">Investment team member</option><option value="ops_lead">Operations lead</option><option value="finance_lead">Finance lead</option><option value="ai_data_lead">AI or data lead</option><option value="external_consultant">External consultant</option></select></div>
    </div>
  );
}

function WorkflowStep({ profile, toggleWorkflow }: { profile: FirmProfile; toggleWorkflow: (workflow: FirmProfile["primary_workflows"][number]) => void }) {
  return (
    <fieldset className="choice-fieldset">
      <legend className="field-label">Primary workflows</legend>
      <div className="choice-grid choice-grid-large">
        {workflowOptions.map((workflow) => {
          const selected = profile.primary_workflows.includes(workflow);
          return (
            <label className="choice choice-card" data-selected={selected} key={workflow}>
              <input type="checkbox" checked={selected} onChange={() => toggleWorkflow(workflow)} />
              <span>{formatLabel(workflow)}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function CurrentToolsStep({
  categories,
  mapping,
  tools,
  updateMapping,
}: {
  categories: Category[];
  mapping: Record<string, string>;
  tools: Tool[];
  updateMapping: (categoryId: string, toolSlug: string) => void;
}) {
  return (
    <div className="form-grid current-tools-grid">
      {categories.map((category) => (
        <div className="field" key={category.id}>
          <label htmlFor={`mapping-${category.id}`}>{category.name}</label>
          <select className="select" id={`mapping-${category.id}`} value={mapping[category.id] ?? ""} onChange={(event) => updateMapping(category.id, event.target.value)}>
            <option value="">Not mapped</option>
            {tools.filter((tool) => tool.category_id === category.id).map((tool) => <option key={tool.slug} value={tool.slug}>{tool.name}</option>)}
          </select>
        </div>
      ))}
    </div>
  );
}

function ConstraintsStep({
  pace,
  preserveIncumbents,
  profile,
  securityPosture,
  setPace,
  setPreserveIncumbents,
  setSecurityPosture,
  updateProfile,
}: {
  pace: string;
  preserveIncumbents: string;
  profile: FirmProfile;
  securityPosture: string;
  setPace: (value: string) => void;
  setPreserveIncumbents: (value: string) => void;
  setSecurityPosture: (value: string) => void;
  updateProfile: <K extends keyof FirmProfile>(key: K, value: FirmProfile[K]) => void;
}) {
  return (
    <div className="constraints-grid">
      <div className="field"><label htmlFor="maturity">Technical maturity</label><select className="select" id="maturity" value={profile.technical_maturity} onChange={(event) => updateProfile("technical_maturity", event.target.value as FirmProfile["technical_maturity"])}><option value="spreadsheet_native">Spreadsheet-native</option><option value="ops_tools">Operations tools</option><option value="api_ready">API-ready</option><option value="ai_enabled">AI-enabled</option></select></div>
      <div className="field"><label htmlFor="budget">Budget sensitivity</label><select className="select" id="budget" value={profile.budget_sensitivity} onChange={(event) => updateProfile("budget_sensitivity", event.target.value as FirmProfile["budget_sensitivity"])}><option value="low_budget">Low budget</option><option value="moderate_budget">Moderate budget</option><option value="enterprise_budget">Enterprise budget</option><option value="unknown">Unknown</option></select></div>
      <ChoiceGroup label="Incumbent stance" name="preserve-incumbents" options={[["preserve", "Preserve where defensible"], ["neutral", "Review each incumbent"], ["replace", "Open to replacement"]]} value={preserveIncumbents} onChange={setPreserveIncumbents} />
      <ChoiceGroup label="Implementation pace" name="implementation-pace" options={[["fast", "Speed first"], ["balanced", "Balanced"], ["deliberate", "Completeness first"]]} value={pace} onChange={setPace} />
      <ChoiceGroup label="Security posture" name="security-posture" options={[["standard", "Standard review"], ["sensitive", "Compliance sensitive"], ["enterprise", "Enterprise controls"]]} value={securityPosture} onChange={setSecurityPosture} />
    </div>
  );
}

function ChoiceGroup({ label, name, onChange, options, value }: { label: string; name: string; onChange: (value: string) => void; options: readonly (readonly [string, string])[]; value: string }) {
  return (
    <fieldset className="choice-fieldset">
      <legend className="field-label">{label}</legend>
      <div className="choice-grid">
        {options.map(([optionValue, optionLabel]) => (
          <label className="choice choice-card" data-selected={value === optionValue} key={optionValue}>
            <input checked={value === optionValue} name={name} type="radio" value={optionValue} onChange={() => onChange(optionValue)} />
            <span>{optionLabel}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function ReviewStep({
  mappedCount,
  pace,
  preserveIncumbents,
  profile,
  relevantGapCount,
  securityPosture,
}: {
  mappedCount: number;
  pace: string;
  preserveIncumbents: string;
  profile: FirmProfile;
  relevantGapCount: number;
  securityPosture: string;
}) {
  const assumptions = [
    ["Firm", formatLabel(profile.firm_type)],
    ["Workflows", `${profile.primary_workflows.length} selected`],
    ["Current tools", `${mappedCount} mapped`],
    ["Gap slips", `${relevantGapCount} open`],
    ["Incumbents", formatLabel(preserveIncumbents)],
    ["Pace", formatLabel(pace)],
    ["Security", formatLabel(securityPosture)],
  ] as const;

  return (
    <div className="review-ledger">
      {assumptions.map(([label, value]) => (
        <div className="review-row" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
      <p className="field-help">The output remains provisional. It uses local structured data only, with no external agent call.</p>
    </div>
  );
}

function StackPreview({
  audit,
  firmIdentity,
  mappedCount,
  mappedRows,
  pace,
  preserveIncumbents,
  profile,
  recommendation,
  relevantGapCount,
  securityPosture,
}: {
  audit?: StackAudit;
  firmIdentity: string;
  mappedCount: number;
  mappedRows: Array<{ category: Category; selected?: Tool }>;
  pace: string;
  preserveIncumbents: string;
  profile: FirmProfile;
  recommendation?: RecommendationResult;
  relevantGapCount: number;
  securityPosture: string;
}) {
  const visibleIdentity = firmIdentity.trim() || "Firm not entered";
  const workflowLabels = profile.primary_workflows.slice(0, 5).map(formatLabel);
  const mappedLabels = mappedRows.filter((row) => row.selected).slice(0, 4).map((row) => row.selected!.name);
  const sequenceLabels = recommendation?.implementation_sequence.slice(0, 4).map((item) => item.tool.name) ?? [];

  return (
    <aside className="operating-stack-preview" role="region" aria-label="Operating stack preview" aria-live="polite">
      <div className="preview-header">
        <span className="meta">Your operating stack preview</span>
        <span className="status-tag" data-tone="accent">Agent prefill: concept only</span>
      </div>
      <PreviewSlip tone="profile" title="Firm profile" count="1.01" state={firmIdentity.trim() ? "Synthetic starting point" : "Awaiting input"} items={[visibleIdentity, formatLabel(profile.firm_type), formatLabel(profile.team_size)]} />
      <PreviewSlip tone="workflow" title="Workflow bricks" count={`${profile.primary_workflows.length}.01`} state="Placed locally" items={workflowLabels} />
      <PreviewSlip tone="tools" title="Current-tool bricks" count={`${mappedCount}.01`} state={mappedCount ? "Mapped incumbents" : "No incumbents mapped"} items={mappedLabels.length ? mappedLabels : ["Not mapped yet"]} />
      <PreviewSlip tone="gap" title="Gap slips" count={`${relevantGapCount}.01`} state={relevantGapCount ? "Needs coverage" : "No relevant gaps"} items={[`${relevantGapCount} relevant gaps`, "Fill only gaps that matter"]} />
      <PreviewSlip tone="sequence" title="Recommendation sequence" count={`${sequenceLabels.length}.01`} state={recommendation ? "Ready" : "Pending"} items={sequenceLabels.length ? sequenceLabels : ["Keep", "Add alongside", "Fill gap", "Review later"]} />
      <PreviewSlip tone="evidence" title="Evidence attached" count={audit ? `${audit.items.length}.01` : "0.01"} state="Profile assumptions" items={["Workflow fit", "Methodology signal", formatLabel(preserveIncumbents), formatLabel(pace), formatLabel(securityPosture)]} />
      <p className="preview-principle">Principle: workflow first, vendor second, evidence always attached.</p>
    </aside>
  );
}

function PreviewSlip({ count, items, state, title, tone }: { count: string; items: string[]; state: string; title: string; tone: string }) {
  return (
    <section className="preview-slip" data-tone={tone}>
      <div className="preview-slip-icon" aria-hidden="true" />
      <div>
        <h3 className="display">{title}</h3>
        <p>{state}</p>
        <div className="preview-slip-items">
          {items.map((item) => <span key={item}>{item}</span>)}
        </div>
      </div>
      <span className="preview-slip-count">{count}</span>
    </section>
  );
}

function RecommendationView({ result }: { result: RecommendationResult }) {
  return (
    <section className="section-compact recommendation-ledger" aria-live="polite">
      <div className="rule-title"><h2>Recommended stack</h2><span className="status-tag" data-tone="accent">Provisional</span></div>
      <div className="result-grid">
        {Object.entries(result.recommended_stack).flatMap(([category, tool]) => tool ? <article className="surface recommendation-slip" key={category}><span className="meta">{formatLabel(category)}</span><h3 className="display">{tool.name}</h3><p>{tool.short_description}</p><span className="status-tag">Evidence attached</span></article> : [])}
      </div>
      <h3 className="display implementation-title">Implementation sequence</h3>
      <ol className="sequence-ledger">
        {result.implementation_sequence.map((item) => (
          <li key={item.category.id}>
            <span className="sequence-step">{String(item.step).padStart(2, "0")}</span>
            <div><strong>{item.tool.name}</strong><p>{item.rationale}</p></div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function AuditView({ audit }: { audit: StackAudit }) {
  const verdictLabel = { keep: "Keep", add_alongside: "Add alongside", consider_replacing: "Consider replacing", fill_gap: "Fill gap" } as const;
  return (
    <section className="section-compact" aria-live="polite">
      <div className="rule-title"><h2>Stack health</h2><span className="status-tag" data-tone="accent">Provisional data</span></div>
      <div className="health-grid">{Object.entries(audit.health).map(([key, value]) => <div className="health-item" key={key}><span className="meta">{formatLabel(key)}</span><strong>{formatLabel(value)}</strong></div>)}</div>
      <div className="audit-card-grid">
        {audit.items.map((item) => (
          <article className="surface audit-card" key={item.category.id}>
            <div>
              <span className="meta">{item.category.name}</span>
              <h3>{item.current_tool?.name ?? "Not mapped"}</h3>
            </div>
            <span className={`verdict verdict-${item.verdict}`}>{verdictLabel[item.verdict]}</span>
            <p><strong>{item.recommended_tool?.name ?? "Keep and optimise"}</strong></p>
            <p>{item.rationale} {item.expected_value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
