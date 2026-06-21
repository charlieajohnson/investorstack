import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolScorecard } from "@/components/tool/tool-scorecard";
import { getRepository } from "@/lib/repository";

export async function generateStaticParams() {
  const tools = await (await getRepository()).getTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const tool = await (await getRepository()).getToolBySlug((await params).slug);
  return tool ? { title: tool.name, description: tool.short_description } : {};
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const repository = await getRepository();
  const tool = await repository.getToolBySlug((await params).slug);
  if (!tool) notFound();
  const [categories, tools] = await Promise.all([repository.getCategories(), repository.getTools()]);
  const category = categories.find((item) => item.id === tool.category_id);
  if (!category) notFound();
  return <ToolScorecard tool={tool} category={category} related={tools} />;
}
