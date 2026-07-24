import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the site contains the requested public routes", async () => {
  const routes = [
    "app/page.tsx", "app/projects/page.tsx", "app/work/amd-inference/page.tsx", "app/work/coup-rl-bot/page.tsx",
    "app/work/heston-regime-lab/page.tsx", "app/blog/page.tsx", "app/blog/three-percent-honestly/page.tsx",
    "app/about/page.tsx", "app/not-found.tsx", "public/rss.xml", "public/sitemap.xml", "public/robots.txt",
  ];
  await Promise.all(routes.map((route) => access(new URL(route, root))));
});

test("the forest gateway exposes the requested title and Home link", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  const landing = await readFile(new URL("app/components/forest-landing.tsx", root), "utf8");
  const layout = await readFile(new URL("app/layout.tsx", root), "utf8");
  assert.match(page, /ForestLanding/);
  assert.match(landing, /forest-home-tag/);
  assert.match(landing, /href="\/about"/);
  assert.match(landing, /HOME/);
  assert.match(layout, /Austin's Portfolio/);
  assert.doesNotMatch(landing, /fetch\(|WebSocket|socket\.io/i);
});

test("projects keep the three authored entries discoverable", async () => {
  const page = await readFile(new URL("app/projects/page.tsx", root), "utf8");
  assert.match(page, /amd-inference/);
  assert.match(page, /coup-rl-bot/);
  assert.match(page, /heston-regime-lab/);
  assert.match(page, /Open case study/);
});

test("the interior navigation exposes the four top-level routes", async () => {
  const shell = await readFile(new URL("app/components/site-shell.tsx", root), "utf8");
  for (const href of ["/", "/about", "/projects", "/blog"]) assert.match(shell, new RegExp(`href: \\"${href.replace("/", "\\/")}\\"`));
});

test("the AMD article preserves evidence boundaries", async () => {
  const article = await readFile(new URL("content/blog/three-percent-honestly.mdx", root), "utf8");
  assert.match(article, /Three Percent, Honestly/);
  assert.match(article, /100,000 deterministic bootstrap replicates/);
  assert.match(article, /Qwen/);
  assert.match(article, /\+3\.095%/);
  assert.match(article, /\+11–14%/);
});
