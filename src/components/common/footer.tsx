import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="site-container footer-grid">
        <div>
          <h2 className="display">InvestorStack</h2>
          <p className="footer-note">The operating stack directory for investment firms.</p>
        </div>
        <div>
          <h3>Explore</h3>
          <ul><li><Link href="/categories">Categories</Link></li><li><Link href="/stack-builder">Stack Builder</Link></li><li><Link href="/compare">Compare</Link></li></ul>
        </div>
        <div>
          <h3>Trust</h3>
          <ul><li><Link href="/methodology">Methodology</Link></li><li><Link href="/submit-update">Submit an update</Link></li><li><Link href="/guides">Guides</Link></li></ul>
        </div>
        <p className="footer-note">Independent, evidence-led and built for investment workflows. Paid placement never changes a score or verdict. Methodology v0.1.</p>
      </div>
    </footer>
  );
}
