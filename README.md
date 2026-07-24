# austxu.dev

Focused, static-export compatible portfolio for Austin Xu: models, machines,
and markets. The homepage is a compact four-widget technical interface: code
profile, research tags, Los Angeles map, and public project access. Home,
About, Projects, and Blog live in the shared bottom dock. The intended public
repository is `austxu/austxu.dev` and the canonical domain is
`https://austxu.dev`.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm ci
npm run dev
```

Build and validate the Cloudflare Pages artifact:

```bash
npm run validate:content
npm run lint
npm test
```

## Routes

- `/` — four-widget portfolio dashboard with a playful public project reveal
- `/projects` — public overview of all three case studies
- `/work/amd-inference` — audited AMD inference case study
- `/work/coup-rl-bot` — Gen5 1v1 Coup case study and shell
- `/work/heston-regime-lab` — Heston regime lab case study and shell
- `/blog` and `/blog/three-percent-honestly` — local MDX notes
- `/about` — background and contact methods
- `/coup` and `/heston` — static frontend shells for the production subdomain deployments
- `/rss.xml`, `/sitemap.xml`, `/robots.txt`, and custom 404

## Evidence and content

The authored AMD article lives in `content/blog/three-percent-honestly.mdx`.
The `.txt` copy is a runtime-safe static import for the Cloudflare-compatible
bundle and is checksum-validated against the authored MDX during the content
check. `public/data/amd-inference.json` is the versioned export used to drive
the confidence, protocol, thermal, and accepted/rejected experiment figures.

The later +11–14% retained-stack epilogue stays intentionally unpublished until
the public evidence bundle, raw samples, checksums, README/results, and evidence
index are synchronized.

## Deployment intent

- Portfolio, Coup shell, and Heston shell: Cloudflare Pages / static export
- Coup API: `coup-api.austxu.dev` on Render Free
- Heston API: `heston-api.austxu.dev` on Render Free

The local build includes frontend shells and honest cold-start/readiness copy,
but it does not claim that either backend has passed production smoke tests.
No backend credentials, model weights, DNS changes, Cloudflare projects, Render
services, or GitHub publication are included in this local handoff.
