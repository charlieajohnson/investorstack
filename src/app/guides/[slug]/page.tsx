import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRepository } from "@/lib/repository";

export async function generateStaticParams() { return (await (await getRepository()).getGuides()).map((guide) => ({ slug: guide.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> { const guide = await (await getRepository()).getGuideBySlug((await params).slug); return guide ? { title: guide.title, description: guide.summary } : {}; }

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = await (await getRepository()).getGuideBySlug((await params).slug);
  if (!guide) notFound();
  return <><header className="page-header"><div className="site-container"><Link className="eyebrow" href="/guides">Guides</Link><h1 className="display page-title" style={{ fontSize: "clamp(3.2rem, 7vw, 6rem)" }}>{guide.title}</h1><p className="lede">{guide.summary}</p><span className="meta">For {guide.audience} · Reviewed {guide.last_reviewed_at}</span></div></header><article className="site-container section" style={{ maxWidth: 860 }}>{guide.sections.map((section, index) => <section className="section-compact" key={section.heading}><span className="eyebrow">{String(index + 1).padStart(2, "0")}</span><h2 className="display section-title" style={{ marginTop: 8 }}>{section.heading}</h2><p className="lede">{section.body}</p></section>)}</article></>;
}
