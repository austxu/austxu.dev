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
  assert.match(source, /PhysicsSkillCloud/);
  assert.match(source, /InteractiveWorldMap/);
  assert.doesNotMatch(source, /continent-(?:na|sa|eu|af|as|au)/);
  assert.match(source, /role=["']switch["']/);
  assert.doesNotMatch(source, /WebSocket|socket\.io/i);
});

test("the location panel uses Mitchell's exact dotted-world geometry", async () => {
  const styles = await readFile(new URL("app/globals.css", root), "utf8");
  await access(new URL("public/world-map-dots.png", root));
  const mapData = JSON.parse(
    await readFile(new URL("public/data/world-map-dots.json", root), "utf8"),
  );

  assert.equal(mapData.w, 1024.59);
  assert.equal(mapData.h, 482.987);
  assert.equal(mapData.r, 1.86);
  assert.equal(mapData.dots.length, 10764);
  assert.match(styles, /\.location-marker\s*\{[^}]*left:\s*115px;[^}]*top:\s*144px;/s);
  assert.match(styles, /\.location-tooltip\s*\{[^}]*left:\s*150px;[^}]*top:\s*144px;/s);
});

test("the project room reveals public case studies accessibly", async () => {
  const [dashboard, projectData, projectsPage] = await readSources(
    "app/components/portfolio-dashboard.tsx",
    "app/data/projects.ts",
    "app/projects/page.tsx",
  );
  const projectSource = `${dashboard}\n${projectsPage}`;

  assert.match(dashboard, /Boop the bear/i);
  assert.match(dashboard, /bear-cameo-reencoded\.png/);
  assert.doesNotMatch(dashboard, /Three public systems case studies\. Open to everyone\./);
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

test("the bear brands the profile and site metadata", async () => {
  const [layout, dashboard] = await readSources(
    "app/layout.tsx",
    "app/components/portfolio-dashboard.tsx",
  );

  assert.match(layout, /applicationName:\s*["']Austin's Portfolio["']/);
  assert.match(layout, /default:\s*["']Austin's Portfolio["']/);
  assert.match(layout, /template:\s*["']%s — Austin's Portfolio["']/);
  assert.match(layout, /icons:\s*\{[\s\S]*bear-cameo-reencoded\.png/);
  assert.doesNotMatch(layout, /favicon\.svg/);
  assert.match(dashboard, /profile-avatar[\s\S]*bear-cameo-reencoded\.png/);
  assert.match(dashboard, /👋/);
  assert.doesNotMatch(dashboard, /👋🏻/);
});

test("the bottom dock has the requested order and social destinations remain present", async () => {
  const [shell, dashboard, about] = await readSources(
    "app/components/site-shell.tsx",
    "app/components/portfolio-dashboard.tsx",
    "app/about/page.tsx",
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

  for (const source of [dashboard, about]) {
    assert.match(source, /https:\/\/github\.com\/austxu/);
    assert.match(source, /https:\/\/www\.linkedin\.com\/in\/axu25/);
    assert.match(source, /https:\/\/x\.com\/austixu/);
  }
});

test("the site uses Mitchell's licensed fallback type and measured neutral palette", async () => {
  const [layout, styles, dashboard, skillCloud, worldMap] = await readSources(
    "app/layout.tsx",
    "app/globals.css",
    "app/components/portfolio-dashboard.tsx",
    "app/components/physics-skill-cloud.tsx",
    "app/components/interactive-world-map.tsx",
  );

  assert.match(layout, /@fontsource\/inter\/latin-400\.css/);
  assert.match(layout, /@fontsource\/roboto-mono\/latin-400\.css/);
  assert.match(styles, /font-family:\s*"Union Fallback"/);
  assert.match(styles, /--sans:\s*"Union Fallback",\s*"Inter"/);
  assert.match(styles, /--mono:\s*"Roboto Mono"/);
  assert.match(styles, /--shell-bg:\s*#13161b/i);
  assert.match(styles, /--shell-panel:\s*#0c0e12/i);
  assert.match(styles, /--shell-border:\s*#22262f/i);
  assert.match(styles, /--shell-code-keyword:\s*#f670c7/i);
  assert.match(styles, /--shell-code-ident:\s*#53b1fd/i);
  assert.match(styles, /--shell-code-comment:\s*#47cd89/i);
  assert.match(styles, /color-mix\(in srgb,\s*var\(--skill-hue\)\s*12%/i);
  assert.match(styles, /color-mix\(in srgb,\s*var\(--skill-hue\)\s*36%/i);
  assert.match(styles, /color-mix\(in srgb,\s*var\(--skill-hue\)\s*80%/i);
  assert.match(worldMap, /url\(["']\/world-map-dots\.png["']\)/i);
  assert.match(worldMap, /world-map-dots\.json/);
  assert.match(skillCloud, /matter-js/);
  assert.match(styles, /grid-template-areas:\s*"code skills"\s*"map projects"/);
  assert.match(styles, /grid-template-rows:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\)/);
  assert.doesNotMatch(styles, /grid-template-areas:\s*"code skills \."\s*"map projects \."/);
  assert.match(styles, /animation-delay:\s*0s\s*!important/i);
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
