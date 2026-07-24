import type { Metadata } from "next";
import EmbeddedLab from "../../components/embedded-lab";
import { PageFrame } from "../../components/page-frame";

export const metadata: Metadata = { title: "Coup RL Bot", description: "A Gen5 1v1 Coup bot for decision-making under hidden information." };

export default function CoupCaseStudy() {
  return <PageFrame eyebrow="02 / strategic deception / Gen5 / production rollout" title={<>The tell is<br /><em>in the timing.</em></>} intro="A playable 1v1 bot trained to act under hidden information, with the working production experience embedded directly into the case study."><EmbeddedLab url="https://coup.austxu.dev" eyebrow="Production bot / embedded view" meta="coup.austxu.dev · Gen5 1v1" title="Coup Gen5 1v1 bot" /><p className="demo-note">The embedded bot keeps its real-time connection and wake-up behavior. Use fullscreen for a larger table, or open the full tab when you want the standalone game.</p><div className="page-link-grid"><div className="page-link-card"><span className="eyebrow">System</span><h2>Gen5 1v1</h2><p>Flask-SocketIO + PyTorch, with immutable shared weights and a fresh per-game hidden state.</p><span className="eyebrow">production bot</span></div><div className="page-link-card"><span className="eyebrow">Guardrail</span><h2>Honest wake-up</h2><p>Health first, Socket.IO second. Timeouts, reconnects, action ranges, and exchange selections are server-validated.</p><span className="eyebrow">production gate</span></div><div className="page-link-card"><span className="eyebrow">Reference</span><h2>Bear, quietly</h2><p>A personal DJUNGELSKOG reference appears as a small visual cue. It is not the logo and has no IKEA affiliation.</p><span className="eyebrow">no catalog styling</span></div></div></PageFrame>;
}
