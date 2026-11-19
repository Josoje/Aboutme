(function () {
  const translations = {
    da: {
      meta: {
        title: "Om mig | Jonas",
        description: "En enkel about me-side for Jonas.",
      },
      skipLink: "Spring til indhold",
      logoAria: "Gå til toppen",
      navAria: "Hovednavigation",
      languageAria: "Sprog",
      menuOpen: "Åbn menu",
      menuClose: "Luk menu",
      theme: {
        label: "Mørkt tema",
      },
      nav: {
        home: "Hjem",
        about: "Om mig",
        interests: "Interesser",
        contact: "Kontakt",
      },
      hero: {
        eyebrow: "Hej, jeg er",
        intro:
          "En nysgerrig person, der elsker at lære nyt, skabe ting og gøre idéer til virkelighed.",
        cta: "Læs mere",
        profileAria: "Profilkort",
        role: "Kreativ problemløser",
        location: "Danmark",
      },
      about: {
        eyebrow: "Lidt om mig",
        title: "Jeg bygger, lærer og udforsker.",
        body: "Jeg er interesseret i teknologi, design og projekter, hvor jeg kan kombinere kreativitet med logik. Når jeg ikke sidder ved computeren, bruger jeg gerne tid på musik, natur og gode mennesker.",
      },
      interests: {
        eyebrow: "Det arbejder jeg med",
        title: "Mine interesser",
        javascript: "JavaScript",
        webdesign: "Webdesign",
        creativity: "Kreativitet",
        problemSolving: "Problemløsning",
      },
      contact: {
        eyebrow: "Skal vi tale sammen?",
        title: "Lad os skabe noget godt.",
        cta: "Skriv til mig",
      },
      footer: {
        note: "Lavet med HTML, CSS og JavaScript",
      },
    },
    en: {
      meta: {
        title: "About me | Jonas",
        description: "A simple about me page for Jonas.",
      },
      skipLink: "Skip to content",
      logoAria: "Go to top",
      navAria: "Main navigation",
      languageAria: "Language",
      menuOpen: "Open menu",
      menuClose: "Close menu",
      theme: {
        label: "Dark theme",
      },
      nav: {
        home: "Home",
        about: "About",
        interests: "Interests",
        contact: "Contact",
      },
      hero: {
        eyebrow: "Hi, I'm",
        intro:
          "A curious person who loves learning new things, building stuff and turning ideas into reality.",
        cta: "Read more",
        profileAria: "Profile card",
        role: "Creative problem solver",
        location: "Denmark",
      },
      about: {
        eyebrow: "A bit about me",
        title: "I build, learn and explore.",
        body: "I'm interested in technology, design and projects where I can combine creativity with logic. When I'm not at the computer, I like spending time on music, nature and good people.",
      },
      interests: {
        eyebrow: "What I work with",
        title: "My interests",
        javascript: "JavaScript",
        webdesign: "Web design",
        creativity: "Creativity",
        problemSolving: "Problem solving",
      },
      contact: {
        eyebrow: "Shall we talk?",
        title: "Let's build something good.",
        cta: "Write to me",
      },
      footer: {
        note: "Made with HTML, CSS and JavaScript",
      },
    },
  };

  const supported = Object.keys(translations);
  const storageKey = "lang";

  function getStoredLanguage() {
    try {
      return localStorage.getItem(storageKey);
    } catch (error) {
      return null;
    }
  }

  function detectLanguage() {
    const stored = getStoredLanguage();
    if (supported.includes(stored)) return stored;

    const browserLanguage = (navigator.language || "").toLowerCase();
    return browserLanguage.startsWith("en") ? "en" : "da";
  }

  let current = detectLanguage();

  function lookup(dictionary, key) {
    return key.split(".").reduce((value, part) => {
      if (value && typeof value === "object") return value[part];
      return undefined;
    }, dictionary);
  }

  function t(key) {
    const value = lookup(translations[current], key);
    if (typeof value === "string") return value;
    const fallback = lookup(translations.da, key);
    return typeof fallback === "string" ? fallback : key;
  }

  function applyLanguage(lang) {
    if (!supported.includes(lang)) return;

    current = lang;

    document.documentElement.lang = lang;
    document.title = t("meta.title");

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
      element.setAttribute("aria-label", t(element.dataset.i18nAria));
    });

    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.lang === lang)
      );
    });

    try {
      localStorage.setItem(storageKey, lang);
    } catch (error) {
      /* Persistence is optional; the language still applies for this visit. */
    }

    document.dispatchEvent(
      new CustomEvent("languagechange", { detail: { lang } })
    );
  }

  window.i18n = {
    t,
    applyLanguage,
    get lang() {
      return current;
    },
  };

  applyLanguage(current);
})();
