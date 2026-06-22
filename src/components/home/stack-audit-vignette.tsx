const stackRows = [
  ["CRM", "Salesforce", "Mapped"],
  ["Data & research", "PitchBook", "Mapped"],
  ["Modelling", "Excel", "Manual"],
  ["Documents", "Google Drive", "Mapped"],
  ["Workflow", "Asana", "Fragmented"],
  ["Reporting", "PowerPoint", "Gap"],
] as const;

const healthScores = [
  ["Coverage", "72", "moderate"],
  ["AI readiness", "41", "emerging"],
  ["Integration", "38", "fragmented"],
] as const;

export function StackAuditVignette() {
  return (
    <div className="audit-vignette" aria-label="Animated stack audit product preview">
      <div className="audit-vignette-shell">
        <aside className="audit-vignette-rail" aria-label="InvestorStack product navigation preview">
          <span className="rail-mark">IS</span>
          <span className="rail-item">Stack Map</span>
          <span className="rail-item rail-item-active">Audit</span>
          <span className="rail-item">Compare</span>
          <span className="rail-item">Methodology</span>
        </aside>
        <div className="audit-vignette-main">
          <div className="vignette-header">
            <div>
              <span className="meta">InvestorStack Audit</span>
              <h2>Current operating stack</h2>
            </div>
            <span className="status-tag" data-tone="accent">Evidence attached</span>
          </div>
          <div className="stack-row-list">
            {stackRows.map(([label, tool, state], index) => (
              <div className="stack-row" key={label} style={{ "--row-index": index } as CSSProperties}>
                <span>{label}</span>
                <strong>{tool}</strong>
                <span className="stack-row-state">{state}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="floating-card health-card">
        <span className="meta">Stack health</span>
        {healthScores.map(([label, score, state]) => (
          <div className="health-score" key={label}>
            <span>{label}</span>
            <strong>{score}</strong>
            <span className="health-score-state">{state}</span>
          </div>
        ))}
      </div>
      <div className="floating-card recommendation-card">
        <span className="meta">Recommendation</span>
        <strong>Add reporting automation layer</strong>
        <p>Reason: manual reporting process and portfolio KPI fragmentation.</p>
        <span className="evidence-line">Methodology, vendor docs, user mapping</span>
      </div>
    </div>
  );
}
import type { CSSProperties } from "react";
