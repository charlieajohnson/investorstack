export function ToolMark({ name, slug }: { name: string; slug?: string }) {
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <span className="tool-mark" aria-hidden="true"><span>{initials}</span>{slug ? <span className="tool-mark-image" style={{ backgroundImage: `url(/logos/${slug}.ico)` }} /> : null}</span>;
}
