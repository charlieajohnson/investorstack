import type { Tool } from "@/lib/domain/schemas";
import { formatLabel } from "@/lib/format";

const gloss = {
  public_api: "Programmatic read and write access",
  mcp: "Direct agent and model context path",
  webhooks: "Event-driven workflow sync",
  exports: "Structured data ownership",
  auth: "Service and enterprise access",
} as const;

function strength(value: string) {
  return ["documented", "hosted", "robust", "structured_sync", "oauth_enterprise"].includes(value) ? "strong" : ["limited", "third_party", "manual_csv", "token"].includes(value) ? "partial" : "absent";
}

export function AiReadinessPanel({ tool }: { tool: Tool }) {
  return (
    <section className="ai-panel" aria-labelledby="ai-readiness-title">
      <div className="ai-panel-header">
        <div><span className="eyebrow">Machine usability</span><h2 className="ai-panel-title" id="ai-readiness-title">AI-readiness signal</h2></div>
        {tool.scores ? <div><span className="meta">Subscore</span><div className="ai-score">{tool.scores.ai_readiness}</div></div> : <span className="status-tag">Signal only</span>}
      </div>
      <div className="signal-grid">
        {Object.entries(tool.ai_readiness_signal).map(([key, value]) => (
          <div className="signal" data-strength={strength(value)} key={key}>
            <span className="signal-label">{formatLabel(key)}</span>
            <strong className="signal-value">{formatLabel(value)}</strong>
            <span className="signal-note">{gloss[key as keyof typeof gloss]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
