import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { StackBuilder } from "@/components/stack/stack-builder";
import { SeedRepository } from "@/lib/repository/seed-repository";

describe("StackBuilder", () => {
  async function advanceToCurrentTools(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
  }

  async function buildRecommendation(user: ReturnType<typeof userEvent.setup>) {
    await advanceToCurrentTools(user);
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Build recommendation" }));
  }

  it("audits a partial current stack and recommends a complement", async () => {
    const repository = new SeedRepository();
    const [categories, tools] = await Promise.all([repository.getCategories(), repository.getTools()]);
    const user = userEvent.setup();
    render(<StackBuilder categories={categories} tools={tools} />);
    await advanceToCurrentTools(user);
    await user.selectOptions(screen.getByLabelText("Private Market Data"), "pitchbook");
    await user.selectOptions(screen.getByLabelText("Meeting Memory"), "granola");
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Build recommendation" }));
    expect(screen.getByRole("heading", { name: "Stack health" })).toBeInTheDocument();
    expect(screen.getByText("Add alongside")).toBeInTheDocument();
    expect(screen.getByText("Inven")).toBeInTheDocument();
  });

  it("builds a recommended stack from a firm profile", async () => {
    const repository = new SeedRepository();
    const [categories, tools] = await Promise.all([repository.getCategories(), repository.getTools()]);
    const user = userEvent.setup();
    render(<StackBuilder categories={categories} tools={tools} />);
    await buildRecommendation(user);
    expect(screen.getByRole("heading", { name: "Recommended stack" })).toBeInTheDocument();
    expect(screen.getByText("Implementation sequence")).toBeInTheDocument();
  });

  it("shows a concept-only firm prefill slip in the stack preview", async () => {
    const repository = new SeedRepository();
    const [categories, tools] = await Promise.all([repository.getCategories(), repository.getTools()]);
    const user = userEvent.setup();
    render(<StackBuilder categories={categories} tools={tools} />);

    await user.type(screen.getByLabelText("Firm name or URL"), "examplecapital.com");

    expect(screen.getAllByText("Agent prefill: concept only")).toHaveLength(2);
    expect(screen.getByRole("region", { name: "Operating stack preview" })).toHaveTextContent("examplecapital.com");
    expect(screen.getByRole("region", { name: "Operating stack preview" })).toHaveTextContent("Synthetic starting point");
  });

  it("clears stale results when an upstream answer changes", async () => {
    const repository = new SeedRepository();
    const [categories, tools] = await Promise.all([repository.getCategories(), repository.getTools()]);
    const user = userEvent.setup();
    render(<StackBuilder categories={categories} tools={tools} />);
    await buildRecommendation(user);
    expect(screen.getByRole("heading", { name: "Recommended stack" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Step 1 Firm identity/ }));
    await user.type(screen.getByLabelText("Firm name or URL"), "newfund.co");
    expect(screen.queryByRole("heading", { name: "Recommended stack" })).not.toBeInTheDocument();
  });
});
