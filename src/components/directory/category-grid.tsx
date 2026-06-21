import Link from "next/link";
import type { Category, Tool } from "@/lib/domain/schemas";

export function CategoryGrid({ categories, tools }: { categories: Category[]; tools: Tool[] }) {
  return (
    <div className="category-grid">
      {categories.map((category, index) => (
        <article className="category-card" key={category.id}>
          <span className="meta">{String(index + 1).padStart(2, "0")} · {tools.filter((tool) => tool.category_id === category.id).length} tools</span>
          <h3>{category.name}</h3>
          <p>{category.description}</p>
          <Link className="text-link" href={`/categories/${category.slug}`}>View tools →</Link>
        </article>
      ))}
    </div>
  );
}
