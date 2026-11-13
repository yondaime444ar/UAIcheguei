(() => {
  const KEY = "uai-cheguei-tema";
  const saved = localStorage.getItem(KEY);
  const preferred = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const applyTheme = theme => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#24211f" : "#fcfbf9";
    const button = document.getElementById("themeToggle");
    if (button) {
      button.textContent = theme === "dark" ? "☀ Tema claro" : "☾ Tema escuro";
      button.setAttribute("aria-label", theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro");
      button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    }
  };
  const initial = saved || (preferred ? "dark" : "light");
  applyTheme(initial);
  const button = document.createElement("button");
  button.type = "button";
  button.id = "themeToggle";
  button.className = document.body.dataset.panel ? "theme-toggle panel-theme-toggle" : "theme-toggle";
  button.addEventListener("click", () => {
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(KEY, next);
    applyTheme(next);
  });
  const target = document.querySelector(".header-actions, .header-right");
  if (target) target.prepend(button);
})();