import { SiteShell } from "../components/site-shell";

export default function CoupShell() {
  return <SiteShell dark><main className="demo-shell"><header className="demo-header"><div><p className="eyebrow">production / coup.austxu.dev / Gen5</p><h1>Read the room.</h1></div><p>A production game shell that paints immediately, wakes the API on intent, and never confuses a sleeping bot with a broken game.</p></header><div className="demo-card"><div className="demo-orb">ready?</div><p>API base: https://coup-api.austxu.dev · readiness pending</p></div><p className="demo-note">The playable CTA stays quiet until the production health check and concurrent-game smoke test pass.</p></main></SiteShell>;
}
