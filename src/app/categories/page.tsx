import type { Metadata } from "next";
import Link from "next/link";
import { CategoryGrid } from "@/components/directory/category-grid";
import { WorkflowMap } from "@/components/directory/workflow-map";
import { getRepository } from "@/lib/repository";

export const metadata: Metadata = { title: "Categories", description: "Browse the investment operating stack by workflow category." };

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ stage?: string }> }) {
  const repository = await getRepository();
  const [categories, tools, workflows, params] = await Promise.all([repository.getCategories(), repository.getTools(), repository.getWorkflows(), searchParams]);
  const activeStage = params.stage ? workflows.find((workflow) => workflow.id === params.stage) : undefined;
  const visible = activeStage ? categories.filter((category) => activeStage.category_ids.includes(category.id)) : categories;
  return (
    <>
      <header className="page-header"><div className="site-container"><span className="eyebrow">Category atlas</span><h1 className="display page-title" style={{ fontSize: "clamp(3.6rem, 8vw, 6.8rem)" }}>Browse the operating-stack atlas.</h1><p className="lede">Seven initial categories across sourcing, execution, portfolio work and the AI operating layer. Coverage expands only after the current set is useful.</p></div></header>
      <section className="site-container section-compact"><div className="rule-title"><h2>Filter by workflow</h2>{activeStage ? <Link className="text-link" href="/categories">Clear filter</Link> : <span className="meta">All stages</span>}</div><WorkflowMap workflows={workflows} /></section>
      <section className="site-container section"><div className="rule-title"><h2>{activeStage ? `${activeStage.label} categories` : "All categories"}</h2><span className="meta">{visible.length} categories · {tools.length} tools</span></div><CategoryGrid categories={visible} tools={tools} /></section>
    </>
  );
}
