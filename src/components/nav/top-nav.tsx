"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  ["Categories", "/categories"],
  ["Stack Builder", "/stack-builder"],
  ["Compare", "/compare"],
  ["Guides", "/guides"],
  ["Methodology", "/methodology"],
] as const;

export function TopNav() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <header className="site-header">
      <div className="site-container nav-inner">
        <Link className="wordmark" href="/" aria-label="InvestorStack home" onClick={close}>
          <span className="wordmark-mark" aria-hidden="true">IS</span>
          <span>InvestorStack</span>
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <div className="nav-cta">
          <Link className="nav-audit-link" href="/stack-builder">Audit stack</Link>
          <button
            aria-controls="mobile-navigation"
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="mobile-menu-button"
            type="button"
            onClick={() => setOpen((current) => !current)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </div>
      <nav className="mobile-drawer" data-open={open} id="mobile-navigation" aria-hidden={!open} aria-label="Mobile navigation">
        <div className="site-container mobile-drawer-inner">
          {links.map(([label, href]) => <Link key={href} href={href} onClick={close} tabIndex={open ? 0 : -1}>{label}</Link>)}
          <Link className="button" href="/stack-builder" onClick={close} tabIndex={open ? 0 : -1}>Audit your stack</Link>
        </div>
      </nav>
    </header>
  );
}
