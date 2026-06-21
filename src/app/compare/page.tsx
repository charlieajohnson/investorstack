import type { Metadata } from "next";
import { CompareExplorer } from "@/components/compare/compare-explorer";
import { getRepository } from "@/lib/repository";

export const metadata: Metadata = { title: "Compare tools", description: "Compare two to four investment-stack tools side by side." };

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ tools?: string }> }) {
  const [tools, params] = await Promise.all([(await getRepository()).getTools(), searchParams]);
  const initial = params.tools?.split(",").filter(Boolean) ?? [];
  return (
    <><header className="page-header"><div className="site-container"><span className="eyebrow">Side by side</span><h1 className="display page-title" style={{ fontSize: "clamp(3.6rem, 8vw, 6.6rem)" }}>Compare tools without inventing certainty.</h1><p className="lede">Scores appear only where the evidence pass exists. Qualitative fields and machine-readiness signals remain comparable across the directory.</p></div></header><section className="wide-container section"><CompareExplorer tools={tools} initialSlugs={initial} /></section></>
  );
}
