import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap { return ["", "/projects", "/work/amd-inference", "/work/coup-rl-bot", "/work/heston-regime-lab", "/blog", "/blog/three-percent-honestly", "/about", "/coup", "/heston"].map((path) => ({ url: `https://austxu.dev${path}`, lastModified: new Date("2026-07-23"), changeFrequency: path === "" ? "weekly" : "monthly", priority: path === "" ? 1 : .7 })); }
