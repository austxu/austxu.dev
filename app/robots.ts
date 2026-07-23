import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots { return { rules: [{ userAgent: "*", allow: "/" }], sitemap: "https://austxu.dev/sitemap.xml", host: "https://austxu.dev" }; }
