import type { Metadata } from "next";
import { StackBuilder } from "@/components/stack/stack-builder";
import { getRepository } from "@/lib/repository";

export const metadata: Metadata = { title: "Stack Builder", description: "Build or audit the operating stack for your investment firm." };

export default async function StackBuilderPage() {
  const repository = await getRepository();
  const [categories, tools] = await Promise.all([repository.getCategories(), repository.getTools()]);
  return (
    <><header className="page-header"><div className="site-container page-header-grid"><div><span className="eyebrow">Recommendation engine</span><h1 className="display page-title" style={{ fontSize: "clamp(3.3rem, 7vw, 6.3rem)" }}>Build or audit your operating stack.</h1><p className="lede">Map the firm profile or the tools already in place. See what is working, fill what is missing, and preserve incumbents where the evidence supports them.</p></div><div className="surface" style={{ padding: 22 }}><p className="display" style={{ fontSize: "1.4rem", margin: 0 }}>Recommendations respect the incumbent and default to augment, not replace.</p></div></div></header><section className="wide-container section"><StackBuilder categories={categories} tools={tools} /></section></>
  );
}
