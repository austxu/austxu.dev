import { getPosts } from "../../lib/content";

export function GET() {
  const items = getPosts().map((post) => `<item><title><![CDATA[${post.title}]]></title><link>https://austxu.dev/blog/${post.slug}</link><guid>https://austxu.dev/blog/${post.slug}</guid><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate><description><![CDATA[${post.summary}]]></description></item>`).join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8" ?><rss version="2.0"><channel><title>Austin Xu — field notes</title><link>https://austxu.dev</link><description>Research across inference, deception, and volatility.</description>${items}</channel></rss>`, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
