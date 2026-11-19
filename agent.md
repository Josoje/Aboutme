# AboutMe — Agent Rules & Project Context

## Project
Personal "About Me" site for Jonas — `C:\Code\Aboutme`.

- Pure vanilla stack: **HTML + CSS + vanilla JavaScript**. No frameworks, no build step.
- No bundler, no framework, no dependencies.

## Conventions
- **Mobile-first design** — base styles target mobile, then grow via `min-width` breakpoints
  (~700px, ~1024px) and fluid `clamp()` typography.
- **Design tokens** in CSS `:root` (`--background`, `--surface`, `--text`, `--muted`, `--accent`,
  `--border`, `--shadow`, `--header-height`); dark mode overrides via `:root.dark` (the class
  is set on `<html>` by an inline script in `<head>` to avoid a theme flash).
- **Theming:** toggle in header via `script.js`; persist in `localStorage`; respect
  `prefers-color-scheme` on first visit.
- **i18n:** Danish (default) + English via `data-i18n` attributes and the translation dictionary
  in `i18n.js`; updates `<html lang>`, `<title>`, meta description and persists the choice.
- **Navigation:** sticky header; hamburger below ~900px; horizontal nav at desktop.
  Scrollspy via a rAF-throttled scroll handler with `aria-current` on the active link.
  Mobile menu closes on outside click / Escape; smooth scroll via `scroll-behavior: smooth`
  + `scroll-margin-top` on sections.
- **Accessibility:** skip-to-content link, `:focus-visible`, `prefers-reduced-motion`,
  semantic landmarks, touch targets ≥ 44px.

## Commands / workflow
- Static site — no build. Serve locally with:
  `python -m http.server 8000 --directory C:\Code\Aboutme`
- Open `index.html` via local server or directly.
- Verify changes in browser before finishing.

## Current state
- Files: `index.html`, `style.css`, `i18n.js`, `script.js` (plus `plan.md` and the docs)
- Implemented: sticky header navigation, scrollspy, mobile menu (outside click / `Escape`),
  persisted light/dark theme, DA/EN switch, skip link, responsive breakpoint scale
- Live deployment context: GitHub repo `Josje/Aboutme`, GitHub Pages at
  `https://josoje.github.io/Aboutme/` (the deployed version predates these changes and
  GitHub Pages is not configured to deploy from Actions yet)

## Testing checklist
- Viewports: 320 / 375 / 768 / 1024 / 1440 px
- Light + dark theme, DA + EN language
- Keyboard-only navigation
- Lighthouse accessibility / best-practices

## Out of scope (for now)
- Frameworks / bundlers / component libraries
- Backend / CMS / contact form handling
- Deployment automation (requires GitHub credentials not available to agent)
