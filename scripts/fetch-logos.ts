import fs from "node:fs/promises";
import path from "node:path";
import { SeedRepository } from "../src/lib/repository/seed-repository";

async function main() {
  const output = path.join(process.cwd(), "public", "logos");
  await fs.mkdir(output, { recursive: true });
  const tools = await new SeedRepository().getTools();
  let saved = 0;

  for (const tool of tools) {
    const domain = new URL(tool.website).hostname.replace(/^www\./, "");
    const candidates = [new URL("/favicon.ico", tool.website).toString(), `https://icons.duckduckgo.com/ip3/${domain}.ico`];
    for (const candidate of candidates) {
      try {
        const response = await fetch(candidate, { signal: AbortSignal.timeout(8_000), headers: { "user-agent": "InvestorStack directory research" } });
        const contentType = response.headers.get("content-type") ?? "";
        if (!response.ok || !contentType.startsWith("image/")) continue;
        const bytes = Buffer.from(await response.arrayBuffer());
        if (bytes.length < 100) continue;
        await fs.writeFile(path.join(output, `${tool.slug}.ico`), bytes);
        saved += 1;
        break;
      } catch {
        // The deterministic monogram remains when a vendor blocks favicon access.
      }
    }
  }

  console.log(`Saved ${saved} of ${tools.length} vendor-domain marks. Missing marks use the monogram fallback.`);
}

void main();
