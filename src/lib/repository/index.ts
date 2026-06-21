import type { ToolRepository } from "./tool-repository";
import { SeedRepository } from "./seed-repository";

let repository: ToolRepository | undefined;

export async function getRepository(): Promise<ToolRepository> {
  if (repository) return repository;
  if (process.env.USE_SUPABASE === "true" && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
    const { SupabaseRepository } = await import("./supabase-repository");
    const selected = new SupabaseRepository();
    repository = selected;
    return selected;
  }
  const selected = new SeedRepository();
  repository = selected;
  return selected;
}
