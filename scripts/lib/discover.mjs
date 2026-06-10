// Shared discovery + HTML helpers for the index/epic generators.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, basename } from "node:path";

export const IGNORED = new Set([
  "node_modules",
  "dist",
  "build",
  "_site",
  "scripts",
  "shared",
  "shared-backup",
]);

export function exists(p) {
  try {
    statSync(p);
    return true;
  } catch {
    return false;
  }
}

export function readJsonSafe(p) {
  try {
    return JSON.parse(readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

export function isDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

// Discover every epic folder under <repoRoot>/epics/* that has an epic.json.
export function discoverEpics(repoRoot) {
  const epicsDir = join(repoRoot, "epics");
  if (!isDir(epicsDir)) return [];
  return readdirSync(epicsDir)
    .filter((name) => !name.startsWith(".") && !IGNORED.has(name))
    .filter((name) => isDir(join(epicsDir, name)))
    .map((slug) => {
      const dir = join(epicsDir, slug);
      const meta = readJsonSafe(join(dir, "epic.json")) ?? {};
      const projects = discoverProjects(dir);
      return {
        slug,
        dir,
        title: meta.title ?? slug,
        tag: meta.tag ?? "uncategorized",
        tagLabel: meta.tagLabel ?? (meta.tag ?? "Uncategorized"),
        date: meta.date ?? "",
        description: meta.description ?? "",
        icon: meta.icon ?? "folder",
        iconBg: meta.iconBg ?? "#EEF2FF",
        iconFg: meta.iconFg ?? "#4F46E5",
        projects,
      };
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

// Discover every project folder under <epicDir>/* that has a project.json
// or a package.json (treat as build = vite by default if package.json present).
export function discoverProjects(epicDir) {
  return readdirSync(epicDir)
    .filter((name) => !name.startsWith(".") && !IGNORED.has(name))
    .filter((name) => isDir(join(epicDir, name)))
    .map((slug) => {
      const dir = join(epicDir, slug);
      const projectJson = readJsonSafe(join(dir, "project.json"));
      const pkg = readJsonSafe(join(dir, "package.json"));
      const hasProjectJson = projectJson !== null;
      const hasPkg = pkg !== null;
      if (!hasProjectJson && !hasPkg && !existsSync(join(dir, "index.html"))) {
        return null;
      }
      const meta = projectJson ?? {};
      const title = meta.title ?? (pkg?.name ?? slug);
      const description =
        meta.description ?? pkg?.description ?? readTitleFromHtml(join(dir, "index.html")) ?? "";
      const build = meta.build ?? (hasPkg ? "vite" : "static");
      return {
        slug,
        dir,
        title,
        description,
        date: meta.date ?? "",
        icon: meta.icon ?? "folder",
        iconBg: meta.iconBg ?? "#F3F4F6",
        iconFg: meta.iconFg ?? "#4B5563",
        build,
      };
    })
    .filter(Boolean)
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

function readTitleFromHtml(p) {
  try {
    const html = readFileSync(p, "utf8");
    const m = html.match(/<title>([^<]+)<\/title>/i);
    if (m) return m[1].trim();
  } catch {}
  return null;
}

export function uniqueTags(epics) {
  const map = new Map();
  for (const e of epics) {
    if (!map.has(e.tag)) map.set(e.tag, e.tagLabel);
  }
  return Array.from(map.entries()).map(([tag, label]) => ({ tag, label }));
}

export function esc(s) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
}

// Format an ISO date (YYYY-MM-DD) as "Mon DD, YYYY". Empty string passes through.
export function formatDate(iso) {
  if (!iso) return "";
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = months[parseInt(m[2], 10) - 1] ?? m[2];
  const day = String(parseInt(m[3], 10));
  return `${month} ${day}, ${m[1]}`;
}

// Built-in icon set rendered as inline SVG. Falls back to a folder glyph.
const ICONS = {
  folder:
    '<path d="M2 5.5C2 4.67 2.67 4 3.5 4h4l2 2h7c.83 0 1.5.67 1.5 1.5v7c0 .83-.67 1.5-1.5 1.5h-13c-.83 0-1.5-.67-1.5-1.5v-9z"/>',
  calendar:
    '<path d="M6 2v2H4.5C3.67 4 3 4.67 3 5.5v11c0 .83.67 1.5 1.5 1.5h11c.83 0 1.5-.67 1.5-1.5v-11c0-.83-.67-1.5-1.5-1.5H14V2h-2v2H8V2H6zm9 7v7.5H4.5V9H15z"/>',
  clock:
    '<path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm.75 4v4.19l3.53 2.04-.75 1.3L9.25 11V6h1.5z"/>',
  check:
    '<path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm-1.25 11.06L5.69 10l1.06-1.06 2 2 4.5-4.5L14.31 7.5l-5.56 5.56z"/>',
  sparkle:
    '<path d="M10 2l1.6 4.4L16 8l-4.4 1.6L10 14l-1.6-4.4L4 8l4.4-1.6L10 2zm6 9l.9 2.1L19 14l-2.1.9L16 17l-.9-2.1L13 14l2.1-.9L16 11z"/>',
  bar:
    '<path d="M3 17V3h2v12h12v2H3zm3-3V8h3v6H6zm4 0V5h3v9h-3zm4 0v-4h3v4h-3z"/>',
  email:
    '<path d="M3.5 4h13c.83 0 1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5h-13C2.67 16 2 15.33 2 14.5v-9C2 4.67 2.67 4 3.5 4zM10 11l6.5-4H3.5L10 11z"/>',
  search:
    '<path d="M15.9 17l-5-5a4.5 4.5 0 1 1 1.1-1.1l5 5L15.9 17zM8 11.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>',
};

export function iconSvg(name, sizeClass = "elv-icon elv-icon-lg elv-icon-fill-current") {
  const path = ICONS[name] ?? ICONS.folder;
  return `<svg class="${sizeClass}" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">${path}</svg>`;
}
