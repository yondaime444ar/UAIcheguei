(() => {
  const KEY = "uai-cheguei-tema";
  const saved = localStorage.getItem(KEY);
  const preferred = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const applyTheme = theme => {
    document.documentElement.dataset.theme = theme;
    document.body.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#24211f" : "#fcfbf9";
    document.querySelectorAll("[data-theme-choice]").forEach(button => {
      const active = button.dataset.themeChoice === theme;
      button.setAttribute("aria-pressed", String(active));
    });
  };
  applyTheme(saved || (preferred ? "dark" : "light"));
  const controls = document.createElement("div");
  controls.className = "theme-controls";
  controls.setAttribute("role", "group");
  controls.setAttribute("aria-label", "Escolher aparência");
  [["light","Claro"],["dark","Escuro"]].forEach(([value,label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.dataset.themeChoice = value;
    button.textContent = label;
    button.addEventListener("click", () => {
      localStorage.setItem(KEY, value);
      applyTheme(value);
    });
    controls.appendChild(button);
  });
  const target = document.querySelector(".header-actions, .header-right");
  if (target) target.prepend(controls);
})();