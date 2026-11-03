const themeButton = document.querySelector("#theme-button");
const yearElement = document.querySelector("#year");

yearElement.textContent = new Date().getFullYear();

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  themeButton.textContent = isDark ? "Lyst tema" : "Mørkt tema";
});
