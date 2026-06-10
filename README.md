# vsalzwedel-explorations

Design and prototype explorations, organized by epic. Deployed via GitHub Pages
at <https://vsalzwedel-g2.github.io/vsalzwedel-explorations/>.

## Layout

```
.
├── epics/
│   └── <epic-slug>/
│       ├── epic.json          # epic metadata (title, tag, date, icon, color, description)
│       └── <project-slug>/
│           ├── project.json   # project metadata (overrides defaults)
│           └── …              # static HTML, or a Vite app, or anything that builds to dist/
├── shared/
│   └── elevate-lite/          # design system (tokens, components, icons)
├── scripts/
│   ├── build-index.mjs        # generates the root index page
│   ├── build-epics.mjs        # generates each epic's landing page
│   └── lib/
│       ├── discover.mjs       # epic/project discovery + HTML helpers
│       └── render.mjs         # page templates (chrome + grid + JS for filter/search/sort)
└── .github/workflows/pages.yml  # build + deploy
```

## Adding a new epic

1. `mkdir epics/my-new-epic`
2. Create `epics/my-new-epic/epic.json`:
   ```json
   {
     "title": "My New Epic",
     "tag": "events",
     "tagLabel": "Events",
     "date": "2026-06-10",
     "description": "One-sentence summary.",
     "icon": "calendar",
     "iconBg": "#EEF2FF",
     "iconFg": "#4F46E5"
   }
   ```
3. Add one or more project folders inside it (see below).
4. Push. The workflow rebuilds the index and your epic landing page.

## Adding a project to an epic

Drop the project folder under the epic. Create a `project.json`:

```json
{
  "title": "My Prototype",
  "date": "2026-06-10",
  "description": "Short description.",
  "icon": "sparkle",
  "iconBg": "#FEF3C7",
  "iconFg": "#D97706",
  "build": "vite"
}
```

`build` accepts:

- `"vite"` — runs `npm ci && npm run build`, deploys the `dist/` output.
  The workflow sets `BASE_PATH` so assets resolve under the project's sub-path
  on Pages. Wire it into your `vite.config.ts`:
  ```ts
  const base = process.env.BASE_PATH ?? "/";
  export default defineConfig({ base, plugins: [...] });
  ```
- `"static"` — copies the folder as-is (skip `project.json`, `node_modules`, `dist`).
  Use this for plain HTML/CSS/JS pages.

If `project.json` is omitted but the folder has a `package.json`, `build` defaults
to `vite`. If it has only an `index.html`, `build` defaults to `static`.

## Icons

`scripts/lib/discover.mjs` ships a small inline-SVG icon set: `folder`,
`calendar`, `clock`, `check`, `sparkle`, `bar`, `email`, `search`. Add more by
editing the `ICONS` map in that file.

## Design system

Pages are styled with [Elevate Lite](https://github.com/schildsG2/elevate-lite),
a lightweight prototyping component library. The `shared/elevate-lite/` folder
is a static copy of the tokens / components / icons CSS so the deployed site
has no external CDN dependency.
