import Link from "next/link";

export default function NotFound() { return <section className="site-container section" style={{ minHeight: "62vh", display: "grid", placeItems: "center" }}><div style={{ textAlign: "center" }}><span className="eyebrow">404</span><h1 className="display page-title" style={{ fontSize: "clamp(3rem, 8vw, 6rem)" }}>This record is not in the stack.</h1><p className="lede" style={{ marginInline: "auto" }}>Browse the current directory or submit a correction if a tool is missing.</p><Link className="button" href="/categories">Browse categories</Link></div></section>; }
