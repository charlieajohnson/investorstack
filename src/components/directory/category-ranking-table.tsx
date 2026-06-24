import Link from "next/link";
import { ToolMark } from "@/components/common/tool-mark";
import { StatusTag } from "@/components/common/status-tag";
import type { Tool } from "@/lib/domain/schemas";
import { calculateOverallScore, rankScoredTools } from "@/lib/domain/scoring";
import { formatLabel } from "@/lib/format";

export function CategoryRankingTable({ tools }: { tools: Tool[] }) {
  const scored = rankScoredTools(tools);
  const ranked = scored.length > 0 ? scored : tools.toSorted((a, b) => a.name.localeCompare(b.name));
  return (
    <>
      <div className="table-wrap category-ledger-table">
        <table className="data-table">
          <thead><tr><th scope="col">Rank</th><th scope="col">Tool</th><th scope="col">Overall</th><th scope="col">Best for</th><th scope="col">AI readiness</th><th scope="col">Time-to-value</th><th scope="col">Compare</th></tr></thead>
          <tbody>
            {ranked.map((tool, index) => (
              <tr key={tool.slug}>
                <td className="mono">{tool.scores ? index + 1 : "Not scored"}</td>
                <td><Link className="tool-cell" href={`/tools/${tool.slug}`}><ToolMark name={tool.name} slug={tool.slug} />{tool.name}</Link></td>
                <td className={index === 0 && tool.scores ? "leader-score mono" : "mono"}>{tool.scores ? calculateOverallScore(tool.scores) : <span className="empty-score">Not scored</span>}</td>
                <td>{tool.best_for[0]}</td>
                <td><StatusTag tone={tool.ai_readiness_signal.mcp === "hosted" ? "positive" : tool.ai_readiness_signal.public_api === "documented" ? "caution" : "neutral"}>{tool.ai_readiness_signal.mcp === "hosted" ? "Hosted MCP" : formatLabel(tool.ai_readiness_signal.public_api)}</StatusTag></td>
                <td className="mono">{formatLabel(tool.time_to_value)}</td>
                <td><Link className="text-link" href={`/compare?tools=${tool.slug}`}>Add</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mobile-ledger-list">
        {ranked.map((tool, index) => (
          <article className="surface mobile-ledger-card" key={tool.slug}>
            <div className="tool-cell"><ToolMark name={tool.name} slug={tool.slug} /><Link href={`/tools/${tool.slug}`}>{tool.name}</Link></div>
            <dl>
              <div><dt>Rank</dt><dd>{tool.scores ? index + 1 : "Not scored"}</dd></div>
              <div><dt>Best for</dt><dd>{tool.best_for[0]}</dd></div>
              <div><dt>AI readiness</dt><dd>{tool.ai_readiness_signal.mcp === "hosted" ? "Hosted MCP" : formatLabel(tool.ai_readiness_signal.public_api)}</dd></div>
              <div><dt>Time-to-value</dt><dd>{formatLabel(tool.time_to_value)}</dd></div>
            </dl>
            <Link className="text-link" href={`/compare?tools=${tool.slug}`}>Add to compare</Link>
          </article>
        ))}
      </div>
    </>
  );
}
