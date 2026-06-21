import type { MetadataRoute } from "next";
import { getRepository } from "@/lib/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://investorstack.vercel.app";
  const repository = await getRepository();
  const [categories, tools, guides] = await Promise.all([repository.getCategories(), repository.getTools(), repository.getGuides()]);
  const staticRoutes = ["", "/categories", "/compare", "/stack-builder", "/guides", "/methodology", "/submit-update"];
  return [
    ...staticRoutes.map((route) => ({ url: `${base}${route}`, lastModified: new Date("2026-06-21") })),
    ...categories.map((category) => ({ url: `${base}/categories/${category.slug}`, lastModified: new Date("2026-06-21") })),
    ...tools.map((tool) => ({ url: `${base}/tools/${tool.slug}`, lastModified: new Date(tool.last_reviewed_at) })),
    ...guides.map((guide) => ({ url: `${base}/guides/${guide.slug}`, lastModified: new Date(guide.last_reviewed_at) })),
  ];
}
