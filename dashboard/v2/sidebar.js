/*  sidebar.js  –  100 % standalone  */
(() => {
  /* ----------  helpers  ---------- */
  const $ = (sel) => document.querySelector(sel);
  const LS = (k, v) => (v === undefined ? localStorage.getItem(k) : localStorage.setItem(k, v));

  /* ----------  1. user name  ---------- */
  function initUserName() {
    const welcome = $('#userWelcomeName');
    if (!welcome) return;

    let name = LS('userName');
    if (!name) {
      // ask once, then save
      name = prompt('Please enter your name to get started:')?.trim() || 'Guest';
      LS('userName', name);
    }
    welcome.textContent = name.split(' ')[0];
  }

  /* ----------  2. theme  ---------- */
  function applyTheme(theme) {
    if (theme === 'system') {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.toggle('dark-theme', dark);
    } else {
      document.body.classList.toggle('dark-theme', theme === 'dark');
    }
  }

  function initTheme() {
    let theme = LS('theme') || 'system';
    applyTheme(theme);

    // keep <select id="themeSelect"> in sync if it exists
    const sel = $('#themeSelect');
    if (sel) {
      sel.value = theme;
      sel.addEventListener('change', () => {
        LS('theme', sel.value);
        applyTheme(sel.value);
      });
    }

    // react to system change when “system” is selected
    window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (LS('theme') === 'system') applyTheme('system');
      });
  }

  /* ----------  3. sidebar  ---------- */
  function initSidebar() {
    const sidebar = $('.sidebar');
    const hamburger = $('.hamburger-btn');
    const closeBtn = $('.close-btn');
    const main = $('.main-content');
    const toggle = $('.toggle-collapse');
    if (!sidebar || !main) return;

    const mobile = window.matchMedia('(max-width: 992px)');

    function applyState() {
      if (mobile.matches) {
        sidebar.classList.remove('collapsed', 'open');
        main.classList.remove('expanded');
      } else {
        const collapsed = LS('sidebarCollapsed') === 'true';
        sidebar.classList.toggle('collapsed', collapsed);
        main.classList.toggle('expanded', collapsed);
      }
    }

    // events
    hamburger?.addEventListener('click', () => sidebar.classList.add('open'));
    closeBtn?.addEventListener('click', () => sidebar.classList.remove('open'));
    toggle?.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      main.classList.toggle('expanded');
      if (!mobile.matches) {
        LS('sidebarCollapsed', sidebar.classList.contains('collapsed'));
      }
    });
    window.addEventListener('resize', applyState);
    applyState();

    // close sidebar when tapping outside on mobile
    document.addEventListener('click', (e) => {
      if (mobile.matches && !sidebar.contains(e.target) && !hamburger?.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }

  /* ----------  4. run after DOM ready  ---------- */
  window.addEventListener('DOMContentLoaded', () => {
    initUserName();
    initTheme();
    initSidebar();
    $('#appContainer').style.display = 'block'; // show page
  });
})();