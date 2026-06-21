import type { Metadata } from "next";
import { LeadCaptureForm } from "@/components/lead/lead-capture-form";

export const metadata: Metadata = { title: "Submit an update", description: "Suggest a factual correction for editorial review." };

export default async function SubmitUpdatePage({ searchParams }: { searchParams: Promise<{ tool?: string }> }) {
  const { tool } = await searchParams;
  return <><header className="page-header"><div className="site-container"><span className="eyebrow">Editorial corrections</span><h1 className="display page-title" style={{ fontSize: "clamp(3.4rem, 7vw, 6.2rem)" }}>Submit an update for review.</h1><p className="lede">Corrections require a source and editorial verification. A vendor submission is marked as vendor-supplied and does not change a score automatically.</p></div></header><section className="site-container section"><div className="surface" style={{ maxWidth: 820, padding: 28 }}><p className="meta">{tool ? `Tool: ${tool}` : "General directory update"}</p><LeadCaptureForm event="submit_update" /></div></section></>;
}
