"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Tool } from "@/lib/domain/schemas";
import { calculateOverallScore } from "@/lib/domain/scoring";
import { formatLabel } from "@/lib/format";

export function CompareExplorer({ tools, initialSlugs }: { tools: Tool[]; initialSlugs: string[] }) {
  const validInitial = initialSlugs.filter((slug) => tools.some((tool) => tool.slug === slug)).slice(0, 4);
  const [selected, setSelected] = useState(validInitial.length >= 2 ? validInitial : ["fathom", "granola"]);
  const selectedTools = useMemo(() => selected.flatMap((slug) => tools.find((tool) => tool.slug === slug) ? [tools.find((tool) => tool.slug === slug)!] : []), [selected, tools]);

  function add(slug: string) {
    if (!slug || selected.includes(slug) || selected.length >= 4) return;
    const next = [...selected, slug];
    setSelected(next);
    window.history.replaceState(null, "", `/compare?tools=${next.join(",")}`);
  }

  function remove(slug: string) {
    if (selected.length <= 2) return;
    const next = selected.filter((item) => item !== slug);
    setSelected(next);
    window.history.replaceState(null, "", `/compare?tools=${next.join(",")}`);
  }

  return (
    <div>
      <div className="surface" style={{ padding: 18, marginBottom: 24 }}>
        <div className="field" style={{ maxWidth: 360 }}>
          <label htmlFor="compare-add">Add a tool</label>
          <select id="compare-add" className="select" value="" onChange={(event) => add(event.target.value)} disabled={selected.length >= 4}>
            <option value="">Select from the directory</option>
            {tools.filter((tool) => !selected.includes(tool.slug)).map((tool) => <option key={tool.slug} value={tool.slug}>{tool.name}</option>)}
          </select>
        </div>
        <p className="meta" style={{ marginBottom: 0 }}>Compare 2 to 4 tools · URL state is shareable</p>
      </div>
      <div className="table-wrap">
        <table className="data-table" style={{ minWidth: Math.max(760, selectedTools.length * 250) }}>
          <thead><tr><th scope="col">Field</th>{selectedTools.map((tool) => <th key={tool.slug} scope="col"><span>{tool.name}</span>{selected.length > 2 ? <button type="button" onClick={() => remove(tool.slug)} aria-label={`Remove ${tool.name}`} style={{ marginLeft: 10, color: "var(--color-negative)" }}>×</button> : null}</th>)}</tr></thead>
          <tbody>
            <tr><th scope="row">Overall</th>{selectedTools.map((tool) => <td className="mono" key={tool.slug}>{tool.scores ? calculateOverallScore(tool.scores) : <span className="empty-score">Not yet scored</span>}</td>)}</tr>
            <tr><th scope="row">Best for</th>{selectedTools.map((tool) => <td key={tool.slug}>{tool.best_for[0]}</td>)}</tr>
            <tr><th scope="row">Time-to-value</th>{selectedTools.map((tool) => <td className="mono" key={tool.slug}>{formatLabel(tool.time_to_value)}</td>)}</tr>
            <tr><th scope="row">Implementation</th>{selectedTools.map((tool) => <td key={tool.slug}>{formatLabel(tool.implementation_burden)}</td>)}</tr>
            <tr><th scope="row">Public API</th>{selectedTools.map((tool) => <td key={tool.slug}>{formatLabel(tool.ai_readiness_signal.public_api)}</td>)}</tr>
            <tr><th scope="row">MCP</th>{selectedTools.map((tool) => <td key={tool.slug}>{formatLabel(tool.ai_readiness_signal.mcp)}</td>)}</tr>
            <tr><th scope="row">Webhooks</th>{selectedTools.map((tool) => <td key={tool.slug}>{formatLabel(tool.ai_readiness_signal.webhooks)}</td>)}</tr>
            <tr><th scope="row">Exports</th>{selectedTools.map((tool) => <td key={tool.slug}>{formatLabel(tool.ai_readiness_signal.exports)}</td>)}</tr>
            <tr><th scope="row">Price band</th>{selectedTools.map((tool) => <td className="mono" key={tool.slug}>{formatLabel(tool.estimated_price_band)}</td>)}</tr>
            <tr><th scope="row">Evidence</th>{selectedTools.map((tool) => <td key={tool.slug}><Link className="text-link" href={`/tools/${tool.slug}`}>Open scorecard →</Link></td>)}</tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
