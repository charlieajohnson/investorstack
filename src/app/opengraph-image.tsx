import { ImageResponse } from "next/og";

export const alt = "InvestorStack, the operating stack directory for investment firms";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F3EAD9", color: "#241F1A", padding: "64px 72px", border: "18px solid #E6DBC4" }}><div style={{ display: "flex", justifyContent: "space-between", fontSize: 32 }}><strong>InvestorStack</strong><span style={{ color: "#3A6A54", fontSize: 22 }}>Workflow first. Vendor second.</span></div><div style={{ display: "flex", flexDirection: "column" }}><div style={{ color: "#C2872E", fontSize: 20, letterSpacing: 3, textTransform: "uppercase" }}>The investment operating stack</div><div style={{ fontFamily: "serif", fontSize: 78, lineHeight: 0.98, maxWidth: 990, marginTop: 18 }}>Find the right operating stack for your investment firm.</div></div><div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#5C5044" }}><span>35 tools · 7 categories · explicit AI-readiness signals</span><span>No pay-to-rank</span></div></div>, size);
}
