import type { ReactNode } from "react";

export function StatusTag({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "positive" | "caution" | "accent" }) {
  return <span className="status-tag" data-tone={tone}>{children}</span>;
}
