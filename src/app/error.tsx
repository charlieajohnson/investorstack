"use client";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <section className="site-container section" style={{ minHeight: "60vh" }}><span className="eyebrow">Render error</span><h1 className="display section-title">The directory could not render this state.</h1><p className="lede">The seed data remains available. Retry the route before reporting the issue.</p><button className="button" onClick={reset} type="button">Try again</button></section>; }
