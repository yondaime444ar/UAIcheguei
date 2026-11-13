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
    document.documentElement.style.colorScheme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#211f1d" : "#fcfbf9";
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
  const extraStyles = document.createElement("style");
  extraStyles.textContent = '.theme-controls{display:flex;align-items:center;justify-content:center}.theme-icon-button{width:38px;height:38px;display:grid;place-items:center;border:1px solid #e6ddd4;border-radius:50%;background:#f5eee8;color:#8b6247;cursor:pointer;transition:background .2s,border-color .2s,color .2s,transform .2s}.theme-icon-button:hover{transform:translateY(-1px);border-color:#c98359}.theme-icon-button svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}.theme-controls-floating{position:fixed;z-index:100;top:18px;right:18px}body[data-theme="dark"] .theme-icon-button{background:#39332e;border-color:#594b40;color:#f0c6a7}body[data-theme="dark"] .caixa-branca{background:#292522;color:#eee8e2;border-color:#51463d}body[data-theme="dark"] .caixa-branca p,body[data-theme="dark"] .caixa-branca label{color:#d0c5bb}body[data-theme="dark"] .campo-form{background:#211f1d;color:#f2eae3;border-color:#514941}body[data-theme="dark"] .esqueci{color:#e5b28f}';
  document.head.appendChild(extraStyles);
})();