import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { InMemoryRateLimiter, parseLeadRequest } from "@/lib/leads";

const limiter = new InMemoryRateLimiter(5, 60_000);
let resend: Resend | undefined;

function getResend() {
  if (!process.env.RESEND_API_KEY) return undefined;
  resend ??= new Resend(process.env.RESEND_API_KEY);
  return resend;
}

export async function POST(request: Request) {
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!limiter.allow(ip)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

  const parsed = parseLeadRequest(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid submission" }, { status: 400 });

  const client = getResend();
  const destination = process.env.LEAD_NOTIFICATION_EMAIL;
  if (client && destination) {
    await client.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "InvestorStack <onboarding@resend.dev>",
      to: destination,
      replyTo: parsed.data.email,
      subject: `InvestorStack: ${parsed.data.event}`,
      text: JSON.stringify({ ...parsed.data, website: undefined }, null, 2),
    });
    return NextResponse.json({ ok: true, mode: "delivered" }, { status: 202 });
  }

  console.info("InvestorStack synthetic lead", { ...parsed.data, email: "[redacted]", website: undefined });
  return NextResponse.json({ ok: true, mode: "synthetic" }, { status: 202 });
}
