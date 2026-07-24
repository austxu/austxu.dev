import type { Metadata } from "next";
import Link from "next/link";
import EmbeddedLab from "../../components/embedded-lab";
import { PageFrame } from "../../components/page-frame";

export const metadata: Metadata = { title: "Heston Regime Lab", description: "A calibration interface for reading volatility as a changing regime.", alternates: { canonical: "https://austxu.dev/work/heston-regime-lab" } };

export default function HestonCaseStudy() {
  return <PageFrame eyebrow="03 / market volatility / research demo" title={<>A surface that<br /><em>changes its mind.</em></>} intro="A Heston calibration lab that treats volatility as a regime with provenance, not a single number to admire after the fact."><EmbeddedLab url="https://heston.austxu.dev" eyebrow="Production lab / embedded view" meta="heston.austxu.dev · live + synthetic provenance" title="Heston regime lab" /><p className="demo-note">Research demonstration, not financial advice. The embedded view is the same production lab as heston.austxu.dev.</p><div className="page-link-grid"><div className="page-link-card"><span className="eyebrow">Service</span><h2>FastAPI + WebSocket</h2><p>The API keeps REST and WebSocket schemas stable while moving from Railway to a bounded Render Free demo service.</p><Link className="text-link" href="https://heston.austxu.dev" target="_blank" rel="noreferrer">Open the full lab <span aria-hidden="true">↗</span></Link></div><div className="page-link-card"><span className="eyebrow">Frontend</span><h2>Same lab, larger frame</h2><p>The production frontend is embedded here so the case study and the working instrument stay in one place.</p><span className="eyebrow">Vite / Cloudflare Pages</span></div><div className="page-link-card"><span className="eyebrow">Provenance</span><h2>Two truths</h2><p>Live and synthetic data stay visibly distinct so a graceful fallback never looks like a market feed.</p><span className="eyebrow">live ≠ synthetic</span></div></div></PageFrame>;
}
