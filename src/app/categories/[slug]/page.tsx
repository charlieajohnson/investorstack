import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryRankingTable } from "@/components/directory/category-ranking-table";
import { getRepository } from "@/lib/repository";

export async function generateStaticParams() {
  const categories = await (await getRepository()).getCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = await (await getRepository()).getCategoryBySlug((await params).slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const repository = await getRepository();
  const category = await repository.getCategoryBySlug((await params).slug);
  if (!category) notFound();
  const tools = await repository.getToolsByCategory(category.id);
  const isMeeting = category.id === "meeting_memory";
  return (
    <>
      <header className="page-header"><div className="site-container"><Link className="eyebrow" href="/categories">Categories</Link><h1 className="display page-title" style={{ fontSize: "clamp(3.2rem, 7vw, 6.3rem)" }}>{category.name}</h1><p className="lede">{category.description}</p><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}><span className="status-tag">{tools.length} tools</span>{category.workflow_stages.map((stage) => <span className="status-tag" key={stage}>{stage}</span>)}</div></div></header>
      <section className="wide-container section"><div className="rule-title"><h2>{isMeeting ? "Provisional ranking" : "Qualitative directory"}</h2><Link className="text-link" href="/methodology">How this works →</Link></div>{isMeeting ? <div className="provisional-banner" style={{ marginBottom: 18 }}>This category is the worked scoring example. Results are provisional and show how profile weighting can differ from the absolute ranking.</div> : <div className="provisional-banner" style={{ marginBottom: 18 }}>This category has not completed a deliberate scoring pass. The directory shows factual fit and AI-readiness signals without fabricated numbers.</div>}<CategoryRankingTable tools={tools} /></section>
      <section className="site-container section-compact"><div className="rule-title"><h2>Best-for matrix</h2><span className="meta">Editorial fit, not a universal rank</span></div><div className="category-grid">{tools.map((tool) => <article className="category-card" key={tool.slug}><span className="meta">{tool.scoring_status}</span><h3>{tool.name}</h3><p>{tool.best_for.join(" · ")}</p><Link className="text-link" href={`/tools/${tool.slug}`}>Open scorecard →</Link></article>)}</div></section>
      {isMeeting ? <section className="site-container section"><div className="surface" style={{ padding: 28 }}><span className="eyebrow">Why rankings are contextual</span><h2 className="display" style={{ fontSize: "2.4rem", margin: "8px 0" }}>Granola leads on human usability, not on the blended score.</h2><p className="lede">A partner-led, spreadsheet-native profile increases the weight on adoption and reduces the weight on machine interfaces. The recommendation can therefore diverge from the absolute category table, and the result states why.</p></div></section> : null}
    </>
  );
}
