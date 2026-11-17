const themeButton = document.querySelector("#theme-button");
const yearElement = document.querySelector("#year");
const navToggle = document.querySelector("#nav-toggle");
const navList = document.querySelector("#nav-list");

yearElement.textContent = new Date().getFullYear();

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeButton.textContent = isDark ? "Lyst tema" : "Mørkt tema";
});

navToggle.addEventListener("click", () => {
  const isOpen = navList.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".site-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    navList.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});
