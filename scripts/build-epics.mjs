#!/usr/bin/env node
// For each epic, render epics/<slug>/index.html into the deploy directory.
// Usage: node scripts/build-epics.mjs <repoRoot> <outDir>
import { writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";
import { discoverEpics } from "./lib/discover.mjs";
import { renderEpic } from "./lib/render.mjs";

const repoRoot = process.argv[2];
const outDir = process.argv[3];

if (!repoRoot || !outDir) {
  console.error("Usage: node scripts/build-epics.mjs <repoRoot> <outDir>");
  process.exit(1);
}

const repoName = process.env.REPO_NAME ?? basename(repoRoot);
// The link back from an epic page to the root. On GitHub Pages this is
// "/<repoName>/" (because the site is served from a sub-path).
const repoBaseHref = process.env.SITE_BASE_HREF ?? `/${repoName}/`;

const epics = discoverEpics(repoRoot);

for (const epic of epics) {
  const dir = join(outDir, "epics", epic.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), renderEpic({ repoName, repoBaseHref, epic }));
  console.log(`Wrote ${join(dir, "index.html")} (${epic.projects.length} project(s))`);
}
