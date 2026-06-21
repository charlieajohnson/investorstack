import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/common/footer";
import { TopNav } from "@/components/nav/top-nav";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: "normal", display: "optional" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://investorstack.vercel.app"),
  title: { default: "InvestorStack", template: "%s | InvestorStack" },
  description: "Compare and build the operating stack for a modern investment firm, with explicit AI-readiness signals and evidence-led recommendations.",
  openGraph: { title: "InvestorStack", description: "The operating stack directory for investment firms.", type: "website" },
};

const themeScript = `(function(){try{var t=localStorage.getItem('investorstack-theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})()`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <TopNav />
        <main id="main-content" className="page-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
