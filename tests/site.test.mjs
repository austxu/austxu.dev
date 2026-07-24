import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function readSources(...paths) {
  return Promise.all(paths.map((path) => readFile(new URL(path, root), "utf8")));
}

test("the site contains the requested public routes", async () => {
  const routes = [
    "app/page.tsx", "app/work/amd-inference/page.tsx", "app/work/coup-rl-bot/page.tsx",
    "app/work/heston-regime-lab/page.tsx", "app/blog/page.tsx", "app/blog/three-percent-honestly/page.tsx",
    "app/projects/page.tsx", "app/about/page.tsx", "app/not-found.tsx", "app/rss.xml/route.ts",
    "app/sitemap.ts", "app/robots.ts",
  ];
  await Promise.all(routes.map((route) => access(new URL(route, root))));

  const sitemap = await readFile(new URL("app/sitemap.ts", root), "utf8");
  assert.match(sitemap, /["']\/projects["']/);
});

test("the homepage contains exactly Mitchell's four spatial left panels", async () => {
  const [page, dashboard] = await readSources(
    "app/page.tsx",
    "app/components/portfolio-dashboard.tsx",
  );
  const source = `${page}\n${dashboard}`;
  const panels = [...source.matchAll(/data-panel=["']([^"']+)["']/g)].map((match) => match[1]);

  assert.deepEqual(panels, ["code", "skills", "map", "projects"]);
  assert.equal(new Set(panels).size, 4);
  assert.match(source, /models/i);
  assert.match(source, /machines/i);
  assert.match(source, /markets/i);
  assert.match(source, /line-numbers/);
  assert.match(source, /skill-cloud/);
  assert.match(source, /dot-map/);
  assert.match(source, /role=["']switch["']/);
  assert.doesNotMatch(source, /fetch\(|WebSocket|socket\.io/i);
});

test("the project room reveals public case studies accessibly", async () => {
  const [dashboard, projectData, projectsPage] = await readSources(
    "app/components/portfolio-dashboard.tsx",
    "app/data/projects.ts",
    "app/projects/page.tsx",
  );
  const projectSource = `${dashboard}\n${projectsPage}`;

  assert.match(dashboard, /Boop the bear/i);
  assert.match(dashboard, /bear-cameo\.png/);
  assert.match(dashboard, /aria-expanded=/);
  assert.match(dashboard, /aria-controls=["']project-drawer["']/);
  assert.match(dashboard, /id=["']project-drawer["']/);
  assert.match(dashboard, /aria-live=["']polite["']/);
  assert.match(dashboard, /href=["']\/projects["']/);
  assert.match(projectSource, /projects\.map/);
  assert.match(projectSource, /\/work\/\$\{project\.slug\}/);

  for (const slug of ["amd-inference", "coup-rl-bot", "heston-regime-lab"]) {
    assert.match(projectData, new RegExp(`slug: ["']${slug}["']`));
  }

  assert.doesNotMatch(
    projectSource,
    /type=["']password|passcode|localStorage|sessionStorage|document\.cookie/i,
  );
});

test("the bottom dock has the requested order and social destinations remain present", async () => {
  const [shell, dashboard] = await readSources(
    "app/components/site-shell.tsx",
    "app/components/portfolio-dashboard.tsx",
  );

  const navigationItems = [...shell.matchAll(
    /\{\s*href:\s*["']([^"']+)["'],\s*label:\s*["']([^"']+)["']/g,
  )].map(([, href, label]) => ({ href, label }));

  assert.deepEqual(navigationItems, [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
  ]);
  assert.match(shell, /data-bottom-dock/);
  assert.match(shell, /aria-label=["']Primary navigation["']/);
  assert.match(shell, /aria-current=/);
  assert.match(dashboard, /<PrimaryDock\s*\/>/);

  assert.match(dashboard, /https:\/\/github\.com\/austxu/);
  assert.match(dashboard, /https:\/\/www\.linkedin\.com\/in\/axu25/);
  assert.match(dashboard, /https:\/\/x\.com\/austixu/);
});

test("the site uses Mitchell's licensed fallback type and measured neutral palette", async () => {
  const [layout, styles, dashboard] = await readSources(
    "app/layout.tsx",
    "app/globals.css",
    "app/components/portfolio-dashboard.tsx",
  );

  assert.match(layout, /@fontsource\/inter\/latin-400\.css/);
  assert.match(layout, /@fontsource\/roboto-mono\/latin-400\.css/);
  assert.match(styles, /--sans:\s*"Inter"/);
  assert.match(styles, /--mono:\s*"Roboto Mono"/);
  assert.match(styles, /--shell-bg:\s*#13161b/i);
  assert.match(styles, /--shell-panel:\s*#0c0e12/i);
  assert.match(styles, /--shell-border:\s*#22262f/i);
  assert.match(styles, /height:\s*248px/);
  assert.match(styles, /border-radius:\s*12px/);
  assert.match(styles, /\.bottom-dock/);
  assert.match(dashboard, /const codeRows/);
});

test("the AMD article preserves evidence boundaries", async () => {
  const article = await readFile(new URL("content/blog/three-percent-honestly.mdx", root), "utf8");
  assert.match(article, /Three Percent, Honestly/);
  assert.match(article, /100,000 deterministic bootstrap replicates/);
  assert.match(article, /Qwen/);
  assert.match(article, /\+3\.095%/);
  assert.match(article, /\+11–14%/);
});
