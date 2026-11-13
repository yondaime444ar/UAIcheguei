(() => {
  const key = "uai-cheguei-tema";
  const saved = localStorage.getItem(key);
  const preferred = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const button = document.createElement("button");
  const controls = document.createElement("div");
  controls.className = "theme-controls";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "Tema do site");
  button.type = "button";
  button.className = "theme-icon-button";
  button.setAttribute("aria-label", "Ativar tema escuro");
  button.title = "Ativar tema escuro";
  const sun = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"></path></svg>';
  const moon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.6 8.6 0 1 0 20.2 15.2Z"></path></svg>';
  const applyTheme = theme => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#211f1d" : "#fcfbf9";
    document.querySelectorAll("[data-uai-logo]").forEach(logo => { logo.src = theme === "dark" ? "logo-horizontal-white.svg" : "logo-horizontal.svg"; });
    const nextTheme = theme === "dark" ? "light" : "dark";
    button.innerHTML = theme === "dark" ? moon : sun;
    button.setAttribute("aria-label", "Ativar tema " + (nextTheme === "dark" ? "escuro" : "claro"));
    button.title = "Ativar tema " + (nextTheme === "dark" ? "escuro" : "claro");
    button.setAttribute("aria-pressed", String(theme === "dark"));
  };
  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(key, next);
    applyTheme(next);
  });
  applyTheme(saved || (preferred ? "dark" : "light"));
  controls.appendChild(button);
  const target = document.querySelector(".header-actions, .header-right");
  if (target) {
    target.prepend(controls);
  } else {
    controls.classList.add("theme-controls-floating");
    document.body.appendChild(controls);
  }
})();