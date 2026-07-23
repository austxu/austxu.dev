import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const mdx = await readFile(new URL("content/blog/three-percent-honestly.mdx", root), "utf8");
const runtimeCopy = await readFile(new URL("content/blog/three-percent-honestly.txt", root), "utf8");
assert.equal(createHash("sha256").update(runtimeCopy).digest("hex"), createHash("sha256").update(mdx).digest("hex"), "runtime content copy must match the authored MDX");
const json = JSON.parse(await readFile(new URL("public/data/amd-inference.json", root), "utf8"));
const frontmatter = mdx.match(/^---\n([\s\S]*?)\n---/);
assert.ok(frontmatter, "MDX frontmatter is required");
const fields = new Map(frontmatter[1].split("\n").map((line) => {
  const index = line.indexOf(":");
  return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
}));
for (const field of ["title", "summary", "publishedAt", "tags", "hero", "draft"]) assert.ok(fields.get(field), `Missing MDX field: ${field}`);
assert.equal(fields.get("draft"), "false", "published article must not be a draft");
assert.equal(json.schemaVersion, "1.0.0");
assert.ok(json.source.repository && json.source.tag && json.source.commit);
assert.ok(json.evidenceChecksum.startsWith("sha256:"));
assert.equal(json.protocol.samplesPerInvocation, 7);
assert.equal(json.protocol.bootstrapReplicates, 100000);
assert.ok(json.campaignCells.some((cell) => cell.pairedGain === 3.095));
assert.ok(json.negativeResults.some((result) => result.model === "Qwen"));
const body = mdx.replace(frontmatter[0], "");
const wordCount = body.replace(/[#>*`_\[\](){}<>]/g, " ").split(/\s+/).filter(Boolean).length;
assert.ok(wordCount >= 2500 && wordCount <= 3500, `AMD article is ${wordCount} words; expected 2,500–3,500`);
const contentHash = createHash("sha256").update(JSON.stringify({ ...json, evidenceChecksum: undefined })).digest("hex");
console.log(`content ok · ${wordCount} words · export hash ${contentHash.slice(0, 12)}`);
