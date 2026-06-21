import fs from "node:fs";
import path from "node:path";

const roots = ["src", "data"];
const allowed = new Set([".ts", ".tsx", ".yaml", ".yml"]);
const failures: string[] = [];

function visit(target: string) {
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const file = path.join(target, entry.name);
    if (entry.isDirectory()) visit(file);
    else if (allowed.has(path.extname(file))) {
      const source = fs.readFileSync(file, "utf8");
      if (source.includes("—")) failures.push(`${file}: em dash`);
      if (/<em\b|font-style\s*:\s*italic|className=["'][^"']*\bitalic\b/.test(source)) failures.push(`${file}: italic styling`);
    }
  }
}

for (const root of roots) visit(root);
if (failures.length) throw new Error(failures.join("\n"));
console.log("Copy lint passed: no em dashes or italic styling in product source and seed content.");
