import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame } from "../../components/page-frame";

export const metadata: Metadata = { title: "Heston Regime Lab", description: "A calibration interface for reading volatility as a changing regime." };

export default function HestonCaseStudy() {
  return <PageFrame eyebrow="03 / market volatility / research demo" title={<>A surface that<br /><em>changes its mind.</em></>} intro="A Heston calibration lab that treats volatility as a regime with provenance, not a single number to admire after the fact."><div className="demo-card"><div className="demo-orb">σ²(t)</div><p>live / synthetic provenance · calibration interface shell</p></div><p className="demo-note">Research demonstration, not financial advice.</p><div className="page-link-grid"><div className="page-link-card"><span className="eyebrow">Service</span><h2>FastAPI + WebSocket</h2><p>The API keeps REST and WebSocket schemas stable while moving from Railway to a bounded Render Free demo service.</p><Link className="text-link" href="/heston">Open the shell <span aria-hidden="true">↗</span></Link></div><div className="page-link-card"><span className="eyebrow">Frontend</span><h2>Small, awake</h2><p>Static assets render first. The calibration request warms the service only after user intent, with bounded retry and honest failure states.</p><span className="eyebrow">Vite / Cloudflare Pages</span></div><div className="page-link-card"><span className="eyebrow">Provenance</span><h2>Two truths</h2><p>Live and synthetic data stay visibly distinct so a graceful fallback never looks like a market feed.</p><span className="eyebrow">live ≠ synthetic</span></div></div></PageFrame>;
}
