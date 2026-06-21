import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CompareExplorer } from "@/components/compare/compare-explorer";
import { SeedRepository } from "@/lib/repository/seed-repository";

describe("CompareExplorer", () => {
  it("adds a third tool while preserving unscored states", async () => {
    const tools = await new SeedRepository().getTools();
    const user = userEvent.setup();
    render(<CompareExplorer tools={tools} initialSlugs={["fathom", "granola"]} />);
    expect(screen.getByRole("columnheader", { name: /Fathom/ })).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Add a tool"), "affinity");
    expect(screen.getByRole("columnheader", { name: /Affinity/ })).toBeInTheDocument();
    expect(screen.getAllByText("Not yet scored").length).toBeGreaterThan(0);
  });
});
