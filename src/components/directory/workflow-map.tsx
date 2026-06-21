import Link from "next/link";
import type { Workflow } from "@/lib/domain/schemas";

export function WorkflowMap({ workflows }: { workflows: Workflow[] }) {
  return (
    <div className="workflow-scroll" aria-label="Investment workflow">
      <div className="workflow-row">
        {workflows.map((workflow, index) => (
          <Link key={workflow.id} className="workflow-step" href={`/categories?stage=${workflow.id}`} title={workflow.description}>
            <span className="workflow-number">{String(index + 1).padStart(2, "0")}</span>
            <span className="workflow-label">{workflow.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
