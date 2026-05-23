(function () {
  'use strict';

  var storageKey = 'materio-theme';
  var themeButtons = Array.from(document.querySelectorAll('[data-bs-theme-value]'));
  var activeIcon = document.querySelector('.theme-icon-active');
  var systemQuery = window.matchMedia('(prefers-color-scheme: dark)');

  if (!themeButtons.length) {
    return;
  }

  function getStoredTheme() {
    return localStorage.getItem(storageKey) || 'light';
  }

  function getResolvedTheme(theme) {
    if (theme === 'system') {
      return systemQuery.matches ? 'dark' : 'light';
    }

    return theme;
  }

  function getThemeIcon(theme) {
    if (theme === 'dark') {
      return 'ri-moon-clear-line';
    }

    if (theme === 'system') {
      return 'ri-computer-line';
    }

    return 'ri-sun-line';
  }

  function updateActiveIcon(theme) {
    if (!activeIcon) {
      return;
    }

    activeIcon.classList.remove('ri-sun-line', 'ri-moon-clear-line', 'ri-computer-line');
    activeIcon.classList.add(getThemeIcon(theme));
  }

  function updateButtons(theme) {
    themeButtons.forEach(function (button) {
      var isActive = button.getAttribute('data-bs-theme-value') === theme;

      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  function applyTheme(theme) {
    var resolvedTheme = getResolvedTheme(theme);

    document.documentElement.setAttribute('data-bs-theme', resolvedTheme);
    localStorage.setItem(storageKey, theme);
    updateActiveIcon(theme);
    updateButtons(theme);

    if (window.Helpers && typeof window.Helpers.update === 'function') {
      window.Helpers.update();
    }
  }

  themeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      applyTheme(button.getAttribute('data-bs-theme-value'));
    });
  });

  systemQuery.addEventListener('change', function () {
    if (getStoredTheme() === 'system') {
      applyTheme('system');
    }
  });

  applyTheme(getStoredTheme());
})();
