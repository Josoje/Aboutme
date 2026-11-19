# Handoff — Aboutme

**Repo:** https://github.com/Josoje/Aboutme
**Branch:** `main`
**Stack:** Vanilla HTML / CSS / JS (no build step, no framework)
**Last commit at handoff:** `8e05915` — *Add navigation menu and mobile nav toggle, refine layout styles*
**Handoff date:** 2026-11-17

---

## 1. Where the project stands

Five files, no tooling:

| File | Purpose |
| --- | --- |
| `index.html` | Single-page site: header, hero, about, interests, contact, footer |
| `style.css` | All styling, theme variables, breakpoint scale (1024 / 900 / 700 / 420px) |
| `i18n.js` | DA/EN translation dictionary and `applyLanguage()` |
| `script.js` | Theme persistence, language wiring, mobile nav, scrollspy, footer year |
| `plan.md` | Implementation plan for the UX/accessibility work |

Already working:

- Sticky header with logo, 4 nav links, DA/EN switch, theme button, hamburger below 900px
- Hero as 2-column grid, then single column on mobile
- Light/dark theme persisted in `localStorage`, following `prefers-color-scheme` on first visit
- Section anchors `#top`, `#om-mig`, `#interesser`, `#kontakt` with sticky-header offsets
- Scrollspy with `aria-current`, skip link, keyboard focus styles, reduced-motion support
- Danish/English switch (texts, `<html lang>`, title, meta description; persisted)

---

## 2. Known gaps (the actual work)

> **Status 2026-11-19:** items 1–8 are implemented in `index.html`, `style.css`,
> `i18n.js` and `script.js`. Item 9 (deployment) is still open.

1. **Only one breakpoint (700px)** → tablet widths (700–1024px) are cramped.
2. **No `scroll-margin-top`** → sticky header covers section headings when navigating via anchors.
3. **No scrollspy** → active section is never reflected in the nav.
4. **Mobile menu** doesn't close on outside click or `Escape`, and has no transition.
5. **Theme is not persisted** → no `localStorage`, no `prefers-color-scheme` on first visit.
6. **No a11y polish** → no skip link, no explicit `:focus-visible` styling, no reduced-motion handling.
7. **Contact section on small screens** is cramped; CTA button should go full width.
8. **No language switcher** → site is Danish only.
9. **No deployment pipeline** → currently nothing is published automatically.

---

## 3. Confirmed decisions (from planning conversation)

| Question | Decision |
| --- | --- |
| Mobile-first priority? | **Yes** — design for phones first, then scale up |
| Keep vanilla stack? | **Yes** — HTML/CSS/JS, no frameworks, no build step |
| Content scope? | **UX / responsiveness only** — no new sections (no Projects/Experience for now) |
| Language? | Danish stays default, **plus a DA/EN switcher in the top corner of the site** |
| Deployment? | Recommended: GitHub Actions + GitHub Pages (`actions/deploy-pages`) so a push to `main` deploys |

**Out of scope:** framework migration, CMS, blog, new content sections, backend/contact form.

---

## 4. Plan

### Phase 1 — Responsive foundation

- Introduce a breakpoint scale: `1024px` (tablet) → `900px` (nav collapse) → `700px` (mobile) → `420px` (small phone).
- Move the nav-to-hamburger switch from `700px` to `~900px`; keep the 700px block for layout stacking.
- Hero: tune `grid-template-columns`, `gap`, and vertical padding at 1024 / 700 / 420.
- Contact section: stack vertically on mobile, CTA becomes full-width, comfortable padding.
- Add `scroll-margin-top` to `#om-mig`, `#interesser`, `#kontakt` using a shared `--header-height` variable (fixes sticky-header overlap).
- Guard against horizontal overflow (`overflow-x: clip` on body, no fixed widths) and enforce ≥44px touch targets for nav links, theme button, language button.

### Phase 2 — Navigation UX

- Scrollspy (rAF-throttled scroll handler) → highlight active link, set `aria-current="true"` on the active item.
- Mobile menu: close on outside click and on `Escape`, return focus to the toggle, animate open/close (height/opacity or transform).
- Smooth transitions for nav hover/active states (respecting reduced motion).
- Keep the nav usable by keyboard: tab order, visible focus, `aria-expanded` kept in sync.

### Phase 3 — Theme, language & accessibility

**Theme**

- Persist choice in `localStorage` (`theme: "light" | "dark"`).
- On first visit, follow `prefers-color-scheme`.
- Apply the theme from an inline script in `<head>` (before paint) to avoid a flash of the wrong theme.
- Keep the toggle label in sync (and translated).

**Language (new requirement)**

- Add a DA/EN switch in the **top corner of the header** (suggested: small segmented control `DA | EN`, or a single button that shows the target language).
- Implementation: `data-i18n` attributes on text nodes + a `translations` map in a separate `i18n.js` (keep `script.js` for behaviour).
- `applyLanguage(lang)` must update:
  - all `data-i18n` / `data-i18n-aria` nodes,
  - `<html lang="da|en">`,
  - `<title>` and `<meta name="description">`,
  - the theme button label.
- Persist in `localStorage` (`lang`); default from stored value → `navigator.language` → `da`.
- Keep URLs unchanged (no `/en/` routes); this is a client-side toggle only.
- Header on mobile now holds 3 controls — collapse the theme button to an icon-only button below ~700px so the row still fits at 320px.

### Phase 4 — Verify & polish

- Test matrix: `320 / 375 / 768 / 1024 / 1440px`, light + dark, both languages.
- Keyboard-only pass: skip link → header → nav → theme → language → sections → CTA.
- Lighthouse: Accessibility and Best Practices ≥ 95.
- Final spacing / typographic rhythm pass; check contrast in both themes (`--muted` on `--background` is the weakest pair).

### Phase 5 — Deployment (recommended, not yet done)

GitHub Pages served from Actions:

1. Repo → Settings → Pages → **Source: GitHub Actions**.
2. Add `.github/workflows/deploy.yml` (draft below), commit, push to `main`.
3. Site publishes to `https://josoje.github.io/Aboutme/`.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

No build step is required (static files). Note: files starting with `_` are ignored by Pages, and `node_modules`/`.git` are excluded by the artifact action automatically — nothing extra needed for this repo.

---

## 5. Acceptance criteria

- [x] No horizontal scroll at 320px, in either theme or language.
- [x] Nav collapses at tablet width, not only on phones; menu closes on link click, outside click, and `Escape`.
- [x] Clicking a nav link lands with the heading fully visible below the sticky header.
- [x] Active section is indicated in the nav and exposed via `aria-current`.
- [x] Theme survives reload and matches OS preference on first visit.
- [x] DA/EN switch changes all visible strings, `<html lang>`, `<title>`, and persists across reloads.
- [x] Skip link appears on focus and jumps to `<main>`.
- [x] All controls reachable and clearly focused via keyboard; no motion when `prefers-reduced-motion: reduce`.
- [ ] Lighthouse accessibility ≥ 95 — not re-run after the update.

---

## 6. Suggested commit sequence

1. `Add responsive breakpoint scale and fix sticky-header anchor offsets`
2. `Add scrollspy and finish mobile menu interactions`
3. `Persist theme and add accessibility polish`
4. `Add DA/EN language switch with localStorage persistence`
5. `Add GitHub Actions workflow for GitHub Pages`

---

## 7. Notes for the next session

- Start by reading `index.html`, `style.css`, `i18n.js`, `script.js` — together they are under 1000 lines.
- Prefer appending new media queries in the existing `max-width` direction (desktop → down) unless the mobile-first refactor is done deliberately as its own commit.
- Don't introduce a build step, framework, or npm dependencies; the site must stay openable via `index.html`.
- Contact email is still the placeholder `hej@example.com` — do not "fix" it without asking the owner.
- The previous session was in Plan mode and made **no file changes**; this document is the first written artifact.
