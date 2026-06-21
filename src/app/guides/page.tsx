import type { Metadata } from "next";
import Link from "next/link";
import { getRepository } from "@/lib/repository";

export const metadata: Metadata = { title: "Guides", description: "Practical operating-stack guides for investment teams." };

export default async function GuidesPage() {
  const guides = await (await getRepository()).getGuides();
  return <><header className="page-header"><div className="site-container"><span className="eyebrow">Implementation guides</span><h1 className="display page-title">Move from shortlist to operating workflow.</h1><p className="lede">Practical guidance for sequencing tools, preserving data ownership and avoiding adoption failure.</p></div></header><section className="site-container section"><div className="category-grid">{guides.map((guide, index) => <article className="category-card" key={guide.slug}><span className="meta">Guide {String(index + 1).padStart(2, "0")} · {guide.audience}</span><h3>{guide.title}</h3><p>{guide.summary}</p><Link className="text-link" href={`/guides/${guide.slug}`}>Read guide →</Link></article>)}</div></section></>;
}
