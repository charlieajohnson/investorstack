import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const links = [
  ["Categories", "/categories"],
  ["Stack Builder", "/stack-builder"],
  ["Compare", "/compare"],
  ["Guides", "/guides"],
  ["Methodology", "/methodology"],
] as const;

export function TopNav() {
  return (
    <header className="site-header">
      <div className="site-container nav-inner">
        <Link className="wordmark" href="/" aria-label="InvestorStack home">InvestorStack</Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
