const root = document.documentElement;
const header = document.querySelector(".site-header");
const themeButton = document.querySelector("#theme-button");
const yearElement = document.querySelector("#year");
const navToggle = document.querySelector("#nav-toggle");
const navList = document.querySelector("#nav-list");
const navLinks = Array.from(document.querySelectorAll(".site-nav a"));
const languageButtons = Array.from(document.querySelectorAll("[data-lang]"));

const themeStorageKey = "theme";
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

function readStoredTheme() {
  try {
    return localStorage.getItem(themeStorageKey);
  } catch (error) {
    return null;
  }
}

let storedTheme = readStoredTheme();

/* Header height feeds the --header-height token used for anchor offsets. */
function syncHeaderHeight() {
  if (!header) return;
  const height = Math.round(header.getBoundingClientRect().height);
  if (height > 0) root.style.setProperty("--header-height", `${height}px`);
}

syncHeaderHeight();
window.addEventListener("resize", syncHeaderHeight);
if (header && "ResizeObserver" in window) {
  new ResizeObserver(syncHeaderHeight).observe(header);
}

/* Footer year */
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

/* Theme */
function applyTheme(theme, persist) {
  const isDark = theme === "dark";
  root.classList.toggle("dark", isDark);

  if (themeButton) {
    themeButton.setAttribute("aria-pressed", String(isDark));
  }

  if (persist) {
    storedTheme = theme;
    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
      /* Persistence is optional; the theme still applies for this visit. */
    }
  }
}

applyTheme(storedTheme || (prefersDark.matches ? "dark" : "light"), false);

if (themeButton) {
  themeButton.addEventListener("click", () => {
    applyTheme(root.classList.contains("dark") ? "light" : "dark", true);
  });
}

prefersDark.addEventListener?.("change", (event) => {
  if (storedTheme) return;
  applyTheme(event.matches ? "dark" : "light", false);
});

/* Language switch */
languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (window.i18n) window.i18n.applyLanguage(button.dataset.lang);
  });
});

/* Mobile menu */
function menuIsOpen() {
  return Boolean(navList && navList.classList.contains("open"));
}

function setMenu(open, returnFocus = false) {
  if (!navList || !navToggle) return;

  navList.classList.toggle("open", open);
  navToggle.setAttribute("aria-expanded", String(open));

  if (window.i18n) {
    navToggle.setAttribute(
      "aria-label",
      window.i18n.t(open ? "menuClose" : "menuOpen")
    );
  }

  if (open) {
    const firstLink = navList.querySelector("a");
    if (firstLink) firstLink.focus();
  } else if (returnFocus) {
    navToggle.focus();
  }
}

if (navToggle) {
  navToggle.addEventListener("click", () => setMenu(!menuIsOpen()));
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("click", (event) => {
  if (!menuIsOpen()) return;
  if (navList.contains(event.target) || (navToggle && navToggle.contains(event.target))) return;
  setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !menuIsOpen()) return;
  setMenu(false, true);
});

const desktopQuery = window.matchMedia("(min-width: 901px)");
desktopQuery.addEventListener?.("change", (event) => {
  if (event.matches) setMenu(false);
});

document.addEventListener("languagechange", () => {
  if (!navToggle) return;
  navToggle.setAttribute(
    "aria-label",
    window.i18n.t(menuIsOpen() ? "menuClose" : "menuOpen")
  );
});

/* Scrollspy */
const navSpy = navLinks
  .map((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return null;
    const target =
      href === "#top" ? document.querySelector(".hero") : document.querySelector(href);
    return target ? { link, target } : null;
  })
  .filter(Boolean);

function setCurrentLink(activeLink) {
  navLinks.forEach((link) => {
    if (link === activeLink) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if (navSpy.length) {
  let ticking = false;
  let spyOverride = null;

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      spyOverride = link;
      setCurrentLink(link);
      window.setTimeout(() => {
        spyOverride = null;
      }, 1000);
    });
  });

  function updateScrollspy() {
    ticking = false;
    if (spyOverride) return;

    const headerBottom = (header ? header.getBoundingClientRect().bottom : 0) + 8;
    let active = navSpy[0];

    navSpy.forEach((pair) => {
      if (pair.target.getBoundingClientRect().top <= headerBottom) {
        active = pair;
      }
    });

    const scrollable = document.documentElement.scrollHeight > window.innerHeight + 2;
    const atBottom =
      scrollable &&
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    if (atBottom) active = navSpy[navSpy.length - 1];

    if (active) setCurrentLink(active.link);
  }

  function requestScrollspyUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateScrollspy);
  }

  window.addEventListener("scroll", requestScrollspyUpdate, { passive: true });
  window.addEventListener("resize", requestScrollspyUpdate);
  updateScrollspy();
}
