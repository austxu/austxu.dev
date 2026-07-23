import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("the site contains the requested public routes", async () => {
  const routes = [
    "app/page.tsx", "app/work/amd-inference/page.tsx", "app/work/coup-rl-bot/page.tsx",
    "app/work/heston-regime-lab/page.tsx", "app/blog/page.tsx", "app/blog/three-percent-honestly/page.tsx",
    "app/about/page.tsx", "app/not-found.tsx", "app/rss.xml/route.ts", "app/sitemap.ts", "app/robots.ts",
  ];
  await Promise.all(routes.map((route) => access(new URL(route, root))));
});

test("the homepage keeps backend-dependent actions out of first render", async () => {
  const page = await readFile(new URL("app/page.tsx", root), "utf8");
  assert.match(page, /Explore the work/);
  assert.match(page, /Read the AMD story/);
  assert.match(page, /Cloudflare|cold|inference/i);
  assert.doesNotMatch(page, /fetch\(|WebSocket|socket\.io/i);
});

test("the AMD article preserves evidence boundaries", async () => {
  const article = await readFile(new URL("content/blog/three-percent-honestly.mdx", root), "utf8");
  assert.match(article, /Three Percent, Honestly/);
  assert.match(article, /100,000 deterministic bootstrap replicates/);
  assert.match(article, /Qwen/);
  assert.match(article, /\+3\.095%/);
  assert.match(article, /\+11–14%/);
});
