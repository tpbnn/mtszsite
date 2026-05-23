(function () {
  const KEY = "theme";

  function applyTheme() {
    const theme = localStorage.getItem(KEY) || "dark";
    const isLight = theme === "light";

    document.documentElement.classList.toggle("light-mode", isLight);

    if (document.body) {
      document.body.classList.toggle("light-mode", isLight);
    }
  }

  window.toggleTheme = function () {
    const isLightNow = document.body.classList.contains("light-mode");
    localStorage.setItem(KEY, isLightNow ? "dark" : "light");
    applyTheme();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyTheme);
  } else {
    applyTheme();
  }

  window.addEventListener("pageshow", applyTheme);
})();