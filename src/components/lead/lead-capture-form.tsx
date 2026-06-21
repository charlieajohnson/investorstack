"use client";

import { useState } from "react";

export function LeadCaptureForm({ event = "request_stack_audit", compact = false }: { event?: string; compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");

  async function submit(formData: FormData) {
    setStatus("pending");
    const body = Object.fromEntries(formData.entries());
    const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...body, event }) });
    setStatus(response.ok ? "success" : "error");
  }

  return (
    <form className={compact ? "lead-form" : "form-grid"} action={submit}>
      <div className="field"><label className={compact ? "sr-only" : undefined} htmlFor={`lead-email-${event}`}>Work email</label><input className="input" id={`lead-email-${event}`} name="email" type="email" placeholder="Work email" required /></div>
      <div className="field"><label className={compact ? "sr-only" : undefined} htmlFor={`lead-firm-${event}`}>Firm type</label><select className="select" id={`lead-firm-${event}`} name="firm_type" required defaultValue=""><option value="" disabled>Firm type</option><option value="lower_mid_market_pe">Lower-mid-market PE</option><option value="growth_equity">Growth equity</option><option value="venture_capital">Venture capital</option><option value="search_fund">Search fund</option><option value="family_office">Family office</option><option value="portfolio_company">Portfolio company</option></select></div>
      <div className="field"><label className={compact ? "sr-only" : undefined} htmlFor={`lead-role-${event}`}>Role</label><input className="input" id={`lead-role-${event}`} name="role" placeholder="Role" required /></div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-10000px" }} />
      <button className="button" type="submit" disabled={status === "pending"}>{status === "pending" ? "Sending" : event === "submit_update" ? "Submit update" : "Request stack audit"}</button>
      {status === "success" ? <p className="form-message" data-status="success">Received. We will review the request before responding.</p> : null}
      {status === "error" ? <p className="form-message" data-status="error">The request could not be accepted. Check the fields and try again.</p> : null}
    </form>
  );
}
