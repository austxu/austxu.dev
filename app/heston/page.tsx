import type { Metadata } from "next";
import { SiteShell } from "../components/site-shell";

export const metadata: Metadata = { title: "Heston", description: "A quiet production shell for Austin Xu's volatility research demo.", alternates: { canonical: "https://austxu.dev/heston" } };

export default function HestonShell() {
  return <SiteShell dark><main className="demo-shell"><header className="demo-header"><div><p className="eyebrow">heston.austxu.dev / regime lab</p><h1>Volatility, in motion.</h1></div><p>Calibrate a research model with provenance always visible: live when available, synthetic when the service is sleeping.</p></header><div className="demo-card"><div className="demo-orb">σ²(t)</div><p>API base: https://heston-api.austxu.dev · calibration idle</p></div><p className="demo-note">Research demonstration, not financial advice.</p></main></SiteShell>;
}
