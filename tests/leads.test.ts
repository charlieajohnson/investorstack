import { describe, expect, it } from "vitest";
import { InMemoryRateLimiter, parseLeadRequest } from "@/lib/leads";

describe("lead boundary", () => {
  it("accepts a minimal valid audit request", () => {
    expect(parseLeadRequest({ email: "buyer@example.com", firm_type: "lower_mid_market_pe", role: "partner", event: "request_stack_audit", website: "" })).toMatchObject({ success: true });
  });

  it("rejects invalid email and honeypot submissions", () => {
    expect(parseLeadRequest({ email: "bad", firm_type: "pe", role: "partner", event: "request_stack_audit", website: "" }).success).toBe(false);
    expect(parseLeadRequest({ email: "buyer@example.com", firm_type: "pe", role: "partner", event: "request_stack_audit", website: "spam" }).success).toBe(false);
  });

  it("rate-limits the third request inside a fixed window", () => {
    const limiter = new InMemoryRateLimiter(2, 60_000);
    expect(limiter.allow("ip", 0)).toBe(true);
    expect(limiter.allow("ip", 1)).toBe(true);
    expect(limiter.allow("ip", 2)).toBe(false);
    expect(limiter.allow("ip", 60_001)).toBe(true);
  });
});
