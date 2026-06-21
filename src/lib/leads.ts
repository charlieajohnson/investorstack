import { z } from "zod";

export const LeadSchema = z.object({
  email: z.email(),
  firm_type: z.string().min(2).max(80),
  role: z.string().min(2).max(80),
  event: z.enum(["stack_builder_completed", "compare_tools", "request_vendor_intro", "request_stack_audit", "download_stack_recommendation", "submit_current_stack", "submit_update"]),
  notes: z.string().max(3000).optional().default(""),
  tool: z.string().max(100).optional(),
  website: z.string().max(0),
});
export type Lead = z.infer<typeof LeadSchema>;

export function parseLeadRequest(input: unknown) {
  return LeadSchema.safeParse(input);
}

export class InMemoryRateLimiter {
  private readonly entries = new Map<string, number[]>();
  constructor(private readonly limit: number, private readonly windowMs: number) {}

  allow(key: string, now = Date.now()): boolean {
    const recent = (this.entries.get(key) ?? []).filter((timestamp) => now - timestamp < this.windowMs);
    if (recent.length >= this.limit) {
      this.entries.set(key, recent);
      return false;
    }
    recent.push(now);
    this.entries.set(key, recent);
    return true;
  }
}
