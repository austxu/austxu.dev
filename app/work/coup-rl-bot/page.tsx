import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame } from "../../components/page-frame";

export const metadata: Metadata = { title: "Coup RL Bot", description: "A Gen5 1v1 Coup bot for decision-making under hidden information." };

export default function CoupCaseStudy() {
  return <PageFrame eyebrow="02 / strategic deception / Gen5 / staging only" title={<>The tell is<br /><em>in the timing.</em></>} intro="A playable 1v1 bot trained to act under hidden information, with the interface designed around what the server can honestly promise during a cold start."><div className="demo-card"><div className="demo-orb">bot / asleep</div><p>staging shell online · API readiness intentionally unclaimed</p></div><p className="demo-note">Staging only. The live CTA stays quiet until two simultaneous games pass isolation testing.</p><div className="page-link-grid"><div className="page-link-card"><span className="eyebrow">System</span><h2>Gen5 1v1</h2><p>Flask-SocketIO + PyTorch, with immutable shared weights and a fresh per-game hidden state.</p><Link className="text-link" href="/coup">Open staging shell <span aria-hidden="true">↗</span></Link></div><div className="page-link-card"><span className="eyebrow">Guardrail</span><h2>Honest wake-up</h2><p>Health first, Socket.IO second. Timeouts, reconnects, action ranges, and exchange selections are server-validated.</p><span className="eyebrow">staging only</span></div><div className="page-link-card"><span className="eyebrow">Reference</span><h2>Bear, quietly</h2><p>A personal DJUNGELSKOG reference appears as a small visual cue. It is not the logo and has no IKEA affiliation.</p><span className="eyebrow">no catalog styling</span></div></div></PageFrame>;
}
