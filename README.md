Aboutme
A small personal "about me" site built with plain HTML, CSS and JavaScript — no framework, no build step, no dependencies.

The site is Danish by default and is being extended with a Danish/English switcher. It is a work in progress: the current focus is responsive layout and everyday UX, not new content.

Planning notes and the full task breakdown live in HANDOFF.md.

Features
Sticky header with logo, section navigation, theme button and mobile hamburger menu
Hero, About, Interests and Contact sections with anchored navigation
Light/dark theme toggle (persistence and OS preference are on the roadmap)
Responsive layout that collapses to a single column on small screens
Zero dependencies — the whole site is three files
Tech stack
Layer	Choice
Markup	HTML5, single page
Styling	Hand-written CSS with custom properties for theming
Behaviour	Vanilla JavaScript (no bundler, no npm)
Hosting	GitHub Pages via GitHub Actions (planned)
Project structure
Aboutme/
├── index.html    # Page markup and content
├── style.css     # All styling, theme variables, media queries
├── script.js     # Theme toggle, mobile nav, footer year
├── README.md     # This file
└── HANDOFF.md    # Current state, known gaps and the improvement plan
Run locally
No tooling required — open the file directly:

index.html
Or serve it over HTTP (recommended, so anchors and relative paths behave like production):

python -m http.server 8000
Then visit http://localhost:8000.

Roadmap
Work is organised in five phases; details and acceptance criteria are in HANDOFF.md.

Phase 1 — Responsive foundation: breakpoint scale (1024 / 900 / 700 / 420px), tablet layout, contact section stacking, scroll-margin-top for the sticky header, 44px+ touch targets
Phase 2 — Navigation UX: scrollspy with IntersectionObserver + aria-current, menu closes on outside click and Escape, animated open/close
Phase 3 — Theme, language and accessibility: persist theme in localStorage and honour prefers-color-scheme, skip link, :focus-visible styles, reduced-motion support, DA/EN switch
Phase 4 — Verify and polish: 320–1440px test matrix, keyboard-only pass, Lighthouse accessibility ≥ 95
Phase 5 — Deployment: GitHub Actions workflow using actions/deploy-pages
Not planned for now: framework migration, CMS, backend or contact form, and new content sections (Projects, Experience).

Deployment
Not deployed yet. The intended setup is GitHub Pages published from a workflow on every push to main:

Repository Settings → Pages → Source: GitHub Actions
Commit .github/workflows/deploy.yml (draft in HANDOFF.md)
Push to main — the site publishes to https://josoje.github.io/Aboutme/
Accessibility goals
Skip-to-content link and visible keyboard focus everywhere
Active navigation state exposed via aria-current
Respect prefers-reduced-motion
Sufficient colour contrast in both themes
