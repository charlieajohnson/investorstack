import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopNav } from "@/components/nav/top-nav";

describe("site navigation", () => {
  it("exposes the five primary product routes", () => {
    render(<TopNav />);
    const nav = screen.getByRole("navigation", { name: "Primary navigation" });
    for (const label of ["Categories", "Stack Builder", "Compare", "Guides", "Methodology"]) {
      expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("does not expose the archived light or dark theme toggle", () => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    render(<TopNav />);
    expect(screen.queryByRole("button", { name: /theme/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /dark/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /light/i })).not.toBeInTheDocument();
  });
});
