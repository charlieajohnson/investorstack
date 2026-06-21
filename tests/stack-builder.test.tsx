import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { StackBuilder } from "@/components/stack/stack-builder";
import { SeedRepository } from "@/lib/repository/seed-repository";

describe("StackBuilder", () => {
  it("audits a partial current stack and recommends a complement", async () => {
    const repository = new SeedRepository();
    const [categories, tools] = await Promise.all([repository.getCategories(), repository.getTools()]);
    const user = userEvent.setup();
    render(<StackBuilder categories={categories} tools={tools} />);
    await user.click(screen.getByRole("tab", { name: "Audit your current stack" }));
    await user.selectOptions(screen.getByLabelText("Private Market Data"), "pitchbook");
    await user.selectOptions(screen.getByLabelText("Meeting Memory"), "granola");
    await user.click(screen.getByRole("button", { name: "Audit this stack" }));
    expect(screen.getByRole("heading", { name: "Stack health" })).toBeInTheDocument();
    expect(screen.getByText("Add alongside")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Inven" })).toBeInTheDocument();
  });

  it("builds a recommended stack from a firm profile", async () => {
    const repository = new SeedRepository();
    const [categories, tools] = await Promise.all([repository.getCategories(), repository.getTools()]);
    const user = userEvent.setup();
    render(<StackBuilder categories={categories} tools={tools} />);
    await user.click(screen.getByRole("button", { name: "Build recommendation" }));
    expect(screen.getByRole("heading", { name: "Recommended stack" })).toBeInTheDocument();
    expect(screen.getByText("Implementation sequence")).toBeInTheDocument();
  });

  it("clears stale results when the builder mode changes", async () => {
    const repository = new SeedRepository();
    const [categories, tools] = await Promise.all([repository.getCategories(), repository.getTools()]);
    const user = userEvent.setup();
    render(<StackBuilder categories={categories} tools={tools} />);
    await user.click(screen.getByRole("button", { name: "Build recommendation" }));
    expect(screen.getByRole("heading", { name: "Recommended stack" })).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Audit your current stack" }));
    expect(screen.queryByRole("heading", { name: "Recommended stack" })).not.toBeInTheDocument();
  });
});
