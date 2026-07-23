import type { Metadata } from "next";
import { BackLink } from "../../components/page-frame";
import { ConfidenceFigure, EvidenceTable, ProtocolFigure } from "../../components/evidence-figure";
import { getPost, contentBlocks } from "../../../lib/content";

export const metadata: Metadata = { title: "Three Percent, Honestly", description: "An evidence-first account of optimizing LLM decode on an RX 6700 XT." };

export default function AmdInference() {
  const post = getPost("three-percent-honestly");
  if (!post) return null;
  return <main className="article-page page-shell"><header className="article-intro section-grid"><BackLink /><p className="eyebrow" style={{ marginTop: "2.5rem" }}>AMD inference / long read</p><h1>{post.title}</h1><div className="article-meta"><span>{post.publishedAt}</span><span>{post.readingTime}</span><span>{post.tags.join(" / ")}</span></div><p className="article-summary">{post.summary}</p></header><div className="article-layout section-grid"><aside className="article-aside">A field note<br />on what held up</aside><article className="article-body">{contentBlocks(post.body).map((block, index) => { if (block.type === "figure") return block.text === "confidence" ? <ConfidenceFigure key={index} /> : block.text === "protocol" ? <ProtocolFigure key={index} /> : <EvidenceTable key={index} />; if (block.type === "heading") return block.level === 3 ? <h3 key={index}>{block.text}</h3> : <h2 key={index}>{block.text}</h2>; if (block.type === "quote") return <blockquote key={index}>{block.text}</blockquote>; if (block.type === "list") return <ul key={index}><li>{block.text}</li></ul>; return <p key={index}>{block.text}</p>; })}<div className="epilogue"><strong>Evidence-gated epilogue:</strong> the later +11–14% retained-stack results remain unpublished here until raw samples, checksums, the public evidence bundle, README/results, and the evidence index are synchronized.</div></article></div></main>;
}
