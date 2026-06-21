import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TopNav } from "@/components/nav/top-nav";
import { ThemeToggle } from "@/components/nav/theme-toggle";

describe("site navigation", () => {
  it("exposes the five primary product routes", () => {
    render(<TopNav />);
    const nav = screen.getByRole("navigation", { name: "Primary navigation" });
    for (const label of ["Categories", "Stack Builder", "Compare", "Guides", "Methodology"]) {
      expect(within(nav).getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("toggles and persists the dark theme", () => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Use dark theme" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("investorstack-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Use light theme" })).toBeInTheDocument();
  });
});
