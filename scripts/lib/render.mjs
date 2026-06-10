// HTML templates for the root index and per-epic landing pages.
// Both use the Elevate Lite design system already deployed under /shared/.
import { esc, iconSvg, formatDate } from "./discover.mjs";

// `sharedHref` is the relative href prefix to reach /shared/ from the page being rendered.
// Root index lives at /,            so sharedHref = "./shared/"
// Epic page  lives at /epics/<slug>/, so sharedHref = "../../shared/"
function chrome({ title, description, sharedHref, eyebrow, heading, tagline, body, footerLinks }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="stylesheet" href="${esc(sharedHref)}elevate-lite/tokens/elevate.css" />
  <link rel="stylesheet" href="${esc(sharedHref)}elevate-lite/components/elevate.css" />
  <link rel="stylesheet" href="${esc(sharedHref)}elevate-lite/icons/icons.css" />
  <style>
    body { margin: 0; }
    .hidden { display: none !important; }

    .filter-chip { transition: all 0.15s ease-in-out; }
    .filter-chip[data-selected="true"] {
      background: var(--bg-primary-20) !important;
      color: var(--text-primary) !important;
    }
    .filter-chip:hover {
      background: var(--bg-primary-30);
      color: var(--text-primary);
    }

    .card-arrow { transition: transform 0.15s ease, color 0.15s ease; }
    .card-link:hover .card-arrow {
      color: var(--text-primary);
      transform: translateX(3px);
    }

    @media (min-width: 750px)  { #cardGrid { grid-template-columns: repeat(2, 1fr) !important; } }
    @media (min-width: 1000px) { #cardGrid { grid-template-columns: repeat(3, 1fr) !important; } }
  </style>
</head>
<body>
  <div elv class="elv-bg-neutral-5 elv-min-h-screen">
    <header class="elv-bg-neutral-0 elv-border-b elv-border-light" style="border-bottom-width: 0.5px;">
      <div class="elv-max-w-7xl elv-w-full md:elv-w-5/6 elv-mx-auto elv-pt-12 elv-pb-8">
        ${
          eyebrow
            ? `<div class="elv-inline-flex elv-items-center elv-gap-2 elv-px-3 elv-py-1 elv-rounded-full elv-mb-3" style="background: #EEF2FF;">
              <span class="elv-text-xs elv-font-bold elv-uppercase elv-tracking-wide" style="color: #4F46E5;">${esc(eyebrow)}</span>
            </div>`
            : ""
        }
        <h1 class="elv-text-4xl elv-font-extrabold elv-text-default elv-mb-3 elv-leading-tight">${esc(heading)}</h1>
        <p class="elv-text-base elv-text-subtle elv-max-w-xl elv-leading-relaxed">${esc(tagline)}</p>
      </div>
    </header>

    <div class="elv-max-w-7xl elv-w-full md:elv-w-5/6 elv-mx-auto elv-py-12">
      ${body}
      ${
        footerLinks
          ? `<footer class="elv-mt-16 elv-pt-6 elv-text-xs elv-text-nonessential">${footerLinks}</footer>`
          : ""
      }
    </div>
  </div>
</body>
</html>
`;
}

function controlsAndGrid({ tags, label, items, emptyMessage }) {
  const filterChips = [{ tag: "all", label: "All" }, ...tags]
    .map(
      (t, i) => `
      <div class="filter-chip elv-inline-flex elv-w-fit elv-items-center elv-justify-center elv-ease-in-out elv-duration-150 elv-cursor-pointer elv-bg-neutral-10 elv-text-neutral elv-rounded-sm elv-h-9 elv-px-4 elv-py-2 elv-text-sm elv-font-medium"
        data-tag="${esc(t.tag)}" data-selected="${i === 0 ? "true" : "false"}">
        ${esc(t.label)}
      </div>`,
    )
    .join("");

  const cards = items
    .map(
      (item) => `
      <a href="${esc(item.href)}"
         class="card-link epic-card elv-block elv-bg-neutral-0 elv-border elv-border-light elv-rounded-md elv-p-6 elv-no-underline elv-transition-all hover:elv-shadow-2 hover:elv-border-medium hover:elv--translate-y-0-5 elv-relative"
         data-tags="${esc(item.tag ?? "")}"
         data-date="${esc(item.date ?? "")}"
         data-name="${esc(item.title)}"
         style="text-decoration: none; display: flex; flex-direction: column; gap: 12px;">
        <div class="elv-flex elv-items-start elv-justify-between elv-gap-3">
          <div class="elv-w-9 elv-h-9 elv-rounded-md elv-flex elv-items-center elv-justify-center" style="background: ${esc(item.iconBg)}; color: ${esc(item.iconFg)};">
            ${iconSvg(item.icon)}
          </div>
          ${
            item.tagLabel
              ? `<div class="tag-chip elv-inline-flex elv-w-fit elv-items-center elv-justify-center elv-bg-neutral-10 elv-text-neutral elv-rounded-xs elv-h-6 elv-p-0.5">
                  <span class="elv-text-sm elv-font-medium elv-px-0.5 elv-text-inherit elv-whitespace-nowrap">${esc(item.tagLabel)}</span>
                </div>`
              : ""
          }
        </div>
        <div class="elv-text-base elv-font-bold elv-text-default elv-leading-snug">${esc(item.title)}</div>
        ${item.description ? `<div class="elv-text-xs elv-text-subtle elv-leading-relaxed elv-flex-1">${esc(item.description)}</div>` : ""}
        ${
          item.date
            ? `<div class="elv-pt-3"><div class="elv-text-xs elv-text-nonessential">${esc(formatDate(item.date))}</div></div>`
            : ""
        }
        <span class="card-arrow elv-absolute elv-text-sm elv-text-neutral-30" style="bottom: 1.5rem; right: 1.5rem;">→</span>
      </a>`,
    )
    .join("\n");

  return `
    <div class="elv-flex elv-items-center elv-gap-3 elv-mb-12 elv-flex-wrap">
      <div class="elv-flex-1 elv-min-w-60 elv-relative">
        <svg class="elv-icon elv-icon-sm elv-absolute elv-left-3 elv-fill-neutral-80" style="top: 50%; transform: translateY(-50%);" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.9375 17L10.9583 12.0208C10.5417 12.3264 10.0848 12.566 9.58767 12.7396C9.09056 12.9132 8.56158 13 8.00073 13C6.61135 13 5.43056 12.5139 4.45833 11.5417C3.48611 10.5694 3 9.38889 3 8C3 6.61111 3.48611 5.43056 4.45833 4.45833C5.43056 3.48611 6.61111 3 8 3C9.38889 3 10.5694 3.48611 11.5417 4.45833C12.5139 5.43056 13 6.61135 13 8.00073C13 8.56158 12.9132 9.09056 12.7396 9.58767C12.566 10.0848 12.3264 10.5417 12.0208 10.9583L17 15.9375L15.9375 17ZM8 11.5C8.97222 11.5 9.79861 11.1597 10.4792 10.4792C11.1597 9.79861 11.5 8.97222 11.5 8C11.5 7.02778 11.1597 6.20139 10.4792 5.52083C9.79861 4.84028 8.97222 4.5 8 4.5C7.02778 4.5 6.20139 4.84028 5.52083 5.52083C4.84028 6.20139 4.5 7.02778 4.5 8C4.5 8.97222 4.84028 9.79861 5.52083 10.4792C6.20139 11.1597 7.02778 11.5 8 11.5Z"/>
        </svg>
        <input type="search" id="searchInput" placeholder="Search ${esc(label.toLowerCase())}..." aria-label="Search ${esc(label.toLowerCase())}" class="elv-input elv-w-full elv-h-9 elv-pl-10 elv-rounded-full elv-text-sm" />
      </div>
      <div class="elv-flex elv-gap-2 elv-flex-wrap">${filterChips}</div>
      <select id="sortSelect" class="elv-px-3 elv-py-2 elv-border elv-border-medium elv-rounded-sm elv-text-sm elv-bg-neutral-0 elv-cursor-pointer elv-text-default"
        style="font-family: var(--font-sans); appearance: none; background-image: url('data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2712%27 height=%2712%27 viewBox=%270 0 12 12%27%3E%3Cpath fill=%27%236B7280%27 d=%27M6 8L1 3h10z%27/%3E%3C/svg%3E'); background-repeat: no-repeat; background-position: right 10px center; padding-right: 32px; height: 36px;">
        <option value="recent">Most Recent</option>
        <option value="oldest">Oldest First</option>
        <option value="name">A-Z</option>
      </select>
    </div>

    <div class="elv-mb-4">
      <h2 class="elv-text-lg elv-font-bold elv-text-default">
        ${esc(label)} <span class="elv-text-lg elv-font-normal elv-text-subtle" id="itemCount">(${items.length})</span>
      </h2>
    </div>

    <div class="elv-grid elv-grid-cols-1 elv-gap-4 elv-mb-12" id="cardGrid">
      ${cards}
    </div>

    <div class="hidden elv-text-center elv-py-12 elv-text-nonessential" id="emptyState">
      ${esc(emptyMessage)}
    </div>

    <script>
      (function () {
        var searchInput = document.getElementById('searchInput');
        var sortSelect  = document.getElementById('sortSelect');
        var filterChips = document.querySelectorAll('.filter-chip[data-tag]');
        var grid        = document.getElementById('cardGrid');
        var countEl     = document.getElementById('itemCount');
        var emptyEl     = document.getElementById('emptyState');

        var state = { tag: 'all', search: '', sort: 'recent' };

        filterChips.forEach(function (chip) {
          chip.addEventListener('click', function () {
            filterChips.forEach(function (c) { c.setAttribute('data-selected', 'false'); });
            chip.setAttribute('data-selected', 'true');
            state.tag = chip.dataset.tag;
            apply();
          });
        });

        searchInput.addEventListener('input', function (e) {
          state.search = e.target.value.toLowerCase();
          apply();
        });

        sortSelect.addEventListener('change', function (e) {
          state.sort = e.target.value;
          sort();
        });

        function apply() {
          var cards = grid.querySelectorAll('.card-link');
          var visible = 0;
          cards.forEach(function (card) {
            var tags = card.dataset.tags || '';
            var name = (card.dataset.name || '').toLowerCase();
            var descEl = card.querySelector('.elv-text-xs.elv-text-subtle');
            var desc = descEl ? descEl.textContent.toLowerCase() : '';
            var tagMatch = state.tag === 'all' || tags.split(/\\s+/).indexOf(state.tag) !== -1;
            var searchMatch = state.search === '' || name.indexOf(state.search) !== -1 || desc.indexOf(state.search) !== -1;
            if (tagMatch && searchMatch) { card.classList.remove('hidden'); visible++; }
            else                          { card.classList.add('hidden'); }
          });
          countEl.textContent = '(' + visible + ')';
          if (visible === 0) { emptyEl.classList.remove('hidden'); } else { emptyEl.classList.add('hidden'); }
        }

        function sort() {
          var cards = Array.from(grid.querySelectorAll('.card-link'));
          cards.sort(function (a, b) {
            if (state.sort === 'name')   return a.dataset.name.localeCompare(b.dataset.name);
            if (state.sort === 'oldest') return (a.dataset.date || '').localeCompare(b.dataset.date || '');
            return (b.dataset.date || '').localeCompare(a.dataset.date || '');
          });
          cards.forEach(function (c) { grid.appendChild(c); });
        }
      })();
    </script>
  `;
}

export function renderRoot({ repoName, eyebrow, tagline, epics, tags }) {
  const items = epics.map((e) => ({
    href: `./epics/${e.slug}/`,
    title: e.title,
    description: e.description,
    date: e.date,
    icon: e.icon,
    iconBg: e.iconBg,
    iconFg: e.iconFg,
    tag: e.tag,
    tagLabel: e.tagLabel,
  }));
  return chrome({
    title: `${eyebrow ?? repoName} — Explorations`,
    description: tagline,
    sharedHref: "./shared/",
    eyebrow,
    heading: "Explorations",
    tagline,
    body: controlsAndGrid({
      tags,
      label: "Epics",
      items,
      emptyMessage: "No epics match your search or filters.",
    }),
    footerLinks: `<a href="https://github.com/vsalzwedel-g2/${esc(repoName)}" class="elv-text-nonessential hover:elv-text-primary">repository</a>`,
  });
}

export function renderEpic({ repoName, repoBaseHref, epic }) {
  const items = epic.projects.map((p) => ({
    href: `./${p.slug}/`,
    title: p.title,
    description: p.description,
    date: p.date,
    icon: p.icon,
    iconBg: p.iconBg,
    iconFg: p.iconFg,
  }));
  // Per-epic page has only one implicit tag (the epic's tag), so the chip row
  // collapses to just "All". Keeping the same controls keeps the UX consistent.
  return chrome({
    title: `${epic.title} — ${repoName}`,
    description: epic.description,
    sharedHref: "../../shared/",
    eyebrow: epic.tagLabel,
    heading: epic.title,
    tagline: epic.description,
    body: controlsAndGrid({
      tags: [],
      label: "Projects",
      items,
      emptyMessage: "No projects in this epic yet.",
    }),
    footerLinks: `<a href="${esc(repoBaseHref)}" class="elv-text-nonessential hover:elv-text-primary">&larr; All explorations</a>`,
  });
}
