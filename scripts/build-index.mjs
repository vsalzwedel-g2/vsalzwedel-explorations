#!/usr/bin/env node
// Render root /index.html into the deploy directory.
// Usage: node scripts/build-index.mjs <repoRoot> <outDir>
import { writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";
import { discoverEpics, uniqueTags } from "./lib/discover.mjs";
import { renderRoot } from "./lib/render.mjs";

const repoRoot = process.argv[2];
const outDir = process.argv[3];

if (!repoRoot || !outDir) {
  console.error("Usage: node scripts/build-index.mjs <repoRoot> <outDir>");
  process.exit(1);
}

const repoName = process.env.REPO_NAME ?? basename(repoRoot);
const eyebrow = process.env.HEADER_EYEBROW ?? "Vsalzwedel";
const tagline = process.env.HEADER_TAGLINE ?? "Gestural HTML prototypes organized by epic.";

const epics = discoverEpics(repoRoot);
const tags = uniqueTags(epics);

console.log(`Root index: ${epics.length} epic(s), ${tags.length} tag(s)`);
for (const e of epics) console.log(`  - ${e.slug} → ${e.title} [${e.tag}] (${e.projects.length} project(s))`);

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "index.html"), renderRoot({ repoName, eyebrow, tagline, epics, tags }));
console.log(`Wrote ${join(outDir, "index.html")}`);
