# Plan — Bring Aboutme up to the target version

**Status:** Implemented 2026-11-19 — Phase 5 (deployment) remains open
**Scope:** UX, responsiveness, accessibility and i18n, following `agent.md` and `HANDOFF.md`.
**Out of scope:** new content or sections, frameworks, bundlers, CMS/backend, and changing the placeholder contact email (`hej@example.com`).

The site stays a zero-dependency, no-build static site that can be opened via `index.html`.

---

## 1. `index.html`

| Change | Detail |
| --- | --- |
| Theme bootstrap | Inline script in `<head>` reads `localStorage.theme`, falls back to `prefers-color-scheme`, and sets `dark` on `<html>` before paint to avoid a flash of the wrong theme. CSS moves from `body.dark` to `:root.dark` (keeping `body.dark` working for safety). |
| Skip link | First child of `<body>`: `<a class="skip-link" href="#top">` targeting `<main id="top" tabindex="-1">`. |
| Language switch | Small segmented `DA \| EN` control in `.header-actions` with `aria-pressed` and `data-i18n-aria`. |
| i18n hooks | `data-i18n` on every text node (eyebrow, headings, intro, nav links, buttons, footer, labels) and `data-i18n-aria` on icon-only/aria-labelled controls. |
| Theme button | Keep as a button, add `aria-pressed`; icon-only below 700px so three header controls still fit at 320px. |
| Unchanged | Section IDs (`#top`, `#om-mig`, `#interesser`, `#kontakt`), markup structure, content and the `mailto:` link. |

## 2. New `i18n.js`

- `translations` map with `da` and `en` entries for every key used in `index.html`.
- `applyLanguage(lang)` updates:
  - `[data-i18n]` → `textContent`, `[data-i18n-aria]` → `aria-label`
  - `<html lang>`, `<title>` and `<meta name="description">`
  - theme button label and `aria-pressed`, language buttons' `aria-pressed`
  - persists the choice to `localStorage.lang`
- Initial language: stored value → `navigator.language` (`en` when it starts with `en`, else `da`) → `da`.
- Loaded before `script.js`.

## 3. `script.js`

- **Theme:** toggle on `<html>`, persist `theme` in `localStorage`, sync button label and `aria-pressed`, respect OS preference when nothing is stored.
- **Mobile menu:** keep open/close with `aria-expanded`, add close on outside click, close on `Escape` (return focus to the toggle) and on link click.
- **Scrollspy:** rAF-throttled scroll handler that marks the last section passing the header line; sets `aria-current="true"` on the active nav link, clears the others, keeps `#top` active at page top, and activates the last link at page bottom. A nav-link click wins for one second so the clicked section stays highlighted.
- **Wiring:** language buttons, footer year (existing behaviour) and defensive `if (el)` guards.

## 4. `style.css`

- **Tokens:** add `--header-height` (measured, ~76px) and use it for anchor offsets.
- **Anchors:** `[id] { scroll-margin-top: var(--header-height) }` to fix sticky-header overlap (no `scroll-padding-top`, which would double the offset).
- **Breakpoint scale** (keep the existing `max-width` direction, minimal diff):
  - `1024px` — tablet layout tuning
  - `900px` — nav collapses to hamburger (moves off `700px`)
  - `700px` — hero/contact stack, full-width CTA, theme button icon-only
  - `420px` — small-phone spacing and type tuning
- **Accessibility:** global `:focus-visible` outline, `.skip-link` hidden until focused, 44px minimum targets on all header controls and nav links.
- **Overflow:** `body { overflow-x: clip }`.
- **Motion:** `@media (prefers-reduced-motion: reduce)` disables transitions/animations and smooth scrolling.
- **Contrast:** check `--muted` on `--background` in both themes (documented weakest pair).

## 5. Docs

- `README.md`: add `i18n.js` to the project structure, tick roadmap items, and list the new features (theme persistence, DA/EN, scrollspy).
- `HANDOFF.md`: mark Phases 1–4 done, note Phase 5 status, and update "where the project stands".
- `agent.md`: update "Current state" and the `body.dark` → `:root.dark` note.

## 6. Optional — deployment

- Add `.github/workflows/deploy.yml` (draft in `HANDOFF.md` §4).
- Requires a manual step: *Repo → Settings → Pages → Source: GitHub Actions*.

---

## Order of work

1. Breakpoint scale and scroll offsets
2. Scrollspy and mobile menu interactions
3. Theme persistence and accessibility polish
4. DA/EN switch (plus `i18n.js`)
5. Docs sync (and optional deploy workflow)

This matches the suggested commit sequence in `HANDOFF.md` §6.

## Verification

- Viewports 320 / 375 / 768 / 1024 / 1440 px, light and dark theme, DA and EN
- No horizontal scroll at 320px; anchors land fully below the sticky header
- Menu closes on link click, outside click and `Escape`; `aria-current` updates while scrolling
- Theme and language survive a reload; first visit follows OS/locale
- Keyboard-only pass: skip link → header → nav → theme → language → sections → CTA
- Lighthouse accessibility ≥ 95
- Test locally with `python -m http.server 8000 --directory C:\Code\Aboutme`

## Open decisions

1. **Deploy workflow:** include the GitHub Actions workflow now or leave Phase 5 out?
   — Left out for now; the draft remains in `HANDOFF.md` §4.
2. **CSS direction:** keep the current `max-width` queries (recommended, minimal diff) or do the full mobile-first rewrite from `agent.md` as a separate commit?
   — Decided: kept the existing `max-width` query direction for a minimal diff.
