import Link from "next/link";
import { SiteShell } from "./site-shell";

export function PageFrame({ eyebrow, title, intro, children }: { eyebrow: string; title: React.ReactNode; intro: string; children: React.ReactNode }) {
  return (
    <SiteShell>
      <main className="interior-page page-shell">
        <div className="interior-backdrop" aria-hidden="true" />
        <header className="page-intro section-grid">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{intro}</p>
        </header>
        <div className="page-body section-grid">{children}</div>
      </main>
    </SiteShell>
  );
}

export function BackLink() {
  return <Link className="text-link" href="/projects">← back to projects</Link>;
}
