import articleSource from "../content/blog/three-percent-honestly.txt?raw";

export type PostFrontmatter = {
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  hero: string;
  draft: boolean;
};

export type Post = PostFrontmatter & { slug: string; body: string; readingTime: string };

const sources = [{ file: "three-percent-honestly.mdx", raw: articleSource }];

function parseFrontmatter(raw: string): { frontmatter: PostFrontmatter; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) throw new Error("Missing frontmatter delimiter");
  const values = new Map<string, string>();
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    values.set(line.slice(0, separator).trim(), line.slice(separator + 1).trim());
  }
  const required = ["title", "summary", "publishedAt", "tags", "hero", "draft"];
  for (const key of required) if (!values.has(key)) throw new Error(`Missing frontmatter field: ${key}`);
  return {
    frontmatter: {
      title: values.get("title")!, summary: values.get("summary")!, publishedAt: values.get("publishedAt")!,
      updatedAt: values.get("updatedAt") || undefined,
      tags: JSON.parse(values.get("tags")!), hero: values.get("hero")!, draft: values.get("draft") === "true",
    },
    body: match[2].trim(),
  };
}

export function getPosts(): Post[] {
  return sources.map(({ file, raw }) => {
    const parsed = parseFrontmatter(raw);
    const body = parsed.body;
    const words = body.replace(/[#>*`_\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
    return { ...parsed.frontmatter, slug: file.replace(/\.mdx$/, ""), body, readingTime: `${Math.max(1, Math.round(words / 220))} min read` };
  }).filter((post) => !post.draft).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(slug: string) { return getPosts().find((post) => post.slug === slug); }

export function contentBlocks(body: string) {
  const lines = body.split("\n");
  const blocks: Array<{ type: "heading" | "paragraph" | "quote" | "list" | "figure"; text: string; level?: number }> = [];
  let paragraph: string[] = [];
  const flush = () => { if (paragraph.length) { blocks.push({ type: "paragraph", text: paragraph.join(" ").trim() }); paragraph = []; } };
  for (const line of lines) {
    if (!line.trim()) { flush(); continue; }
    if (line.startsWith("<!-- figure:")) { flush(); blocks.push({ type: "figure", text: line.replace("<!-- figure:", "").replace("-->", "").trim() }); continue; }
    if (line.startsWith("## ")) { flush(); blocks.push({ type: "heading", level: 2, text: line.slice(3) }); continue; }
    if (line.startsWith("### ")) { flush(); blocks.push({ type: "heading", level: 3, text: line.slice(4) }); continue; }
    if (line.startsWith("> ")) { flush(); blocks.push({ type: "quote", text: line.slice(2) }); continue; }
    if (line.startsWith("- ")) { flush(); blocks.push({ type: "list", text: line.slice(2) }); continue; }
    paragraph.push(line.trim());
  }
  flush();
  return blocks;
}
