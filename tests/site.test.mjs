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

test("the homepage contains exactly the four requested rooms", async () => {
  const [page, dashboard] = await readSources(
    "app/page.tsx",
    "app/components/portfolio-dashboard.tsx",
  );
  const source = `${page}\n${dashboard}`;
  const panels = [...source.matchAll(/data-panel=["']([^"']+)["']/g)].map((match) => match[1]);

  assert.deepEqual(panels.sort(), ["about", "blog", "home", "projects"]);
  assert.match(source, /models/i);
  assert.match(source, /machines/i);
  assert.match(source, /markets/i);
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

  assert.doesNotMatch(projectSource, /<input[^>]*type=["']password["']/i);
});

test("the site navigation and social destinations are present", async () => {
  const [shell, dashboard] = await readSources(
    "app/components/site-shell.tsx",
    "app/components/portfolio-dashboard.tsx",
  );

  for (const [label, href] of [
    ["Home", "/"],
    ["Blog", "/blog"],
    ["Projects", "/projects"],
    ["About", "/about"],
  ]) {
    assert.match(shell, new RegExp(`href: ["']${href}["'], label: ["']${label}["']`, "i"));
  }

  assert.match(dashboard, /https:\/\/github\.com\/austxu/);
  assert.match(dashboard, /https:\/\/www\.linkedin\.com\/in\/axu25/);
  assert.match(dashboard, /https:\/\/x\.com\/austixu/);
});

test("the site uses the restrained technical type and color system", async () => {
  const [layout, styles, dashboard] = await readSources(
    "app/layout.tsx",
    "app/globals.css",
    "app/components/portfolio-dashboard.tsx",
  );

  assert.match(layout, /@fontsource\/inter\/latin-400\.css/);
  assert.match(layout, /@fontsource\/roboto-mono\/latin-400\.css/);
  assert.match(styles, /--sans:\s*"Inter"/);
  assert.match(styles, /--mono:\s*"Roboto Mono"/);
  assert.match(styles, /--paper:\s*#0d1117/i);
  assert.doesNotMatch(styles, /#8c7cff|#ffd84d|#2d2496|#ff7a70/i);
  const homeDeck = dashboard.match(/<p className="home-room-deck">([\s\S]*?)<\/p>/)?.[1] ?? "";
  assert.doesNotMatch(homeDeck, /<strong>/i);
});

test("the AMD article preserves evidence boundaries", async () => {
  const article = await readFile(new URL("content/blog/three-percent-honestly.mdx", root), "utf8");
  assert.match(article, /Three Percent, Honestly/);
  assert.match(article, /100,000 deterministic bootstrap replicates/);
  assert.match(article, /Qwen/);
  assert.match(article, /\+3\.095%/);
  assert.match(article, /\+11–14%/);
});
