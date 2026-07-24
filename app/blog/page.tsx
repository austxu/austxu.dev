import type { Metadata } from "next";
import Link from "next/link";
import { PageFrame } from "../components/page-frame";
import { getPosts } from "../../lib/content";

export const metadata: Metadata = { title: "Blog", description: "Field notes on models, machines, and markets.", alternates: { canonical: "https://austxu.dev/blog" } };

export default function Blog() {
  const posts = getPosts();
  return <PageFrame eyebrow="Blog / field log" title={<>The work,<br /><em>in plain sight.</em></>} intro="Long-form notes on performance, provenance, and the useful friction between a model and the machine underneath it."><div className="page-link-grid">{posts.map((post) => <article className="page-link-card" key={post.slug}><span className="eyebrow">{post.publishedAt} / {post.readingTime}</span><h2>{post.title}</h2><p>{post.summary}</p><Link className="text-link" href={`/blog/${post.slug}`}>Read the note <span aria-hidden="true">↗</span></Link></article>)}</div></PageFrame>;
}
