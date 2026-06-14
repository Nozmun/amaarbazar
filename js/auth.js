// AmaarBazaar — front-end auth (register, login, session, account menu)
// Shares the user store with the admin dashboard (key: amaarbazar_users).
(function () {
  'use strict';

  const USERS_KEY = 'amaarbazar_users';
  const USER_SESSION_KEY = 'amaarbazar_user_session';
  const ADMIN_SESSION_KEY = 'amaarbazar_admin_session';
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // Same default admin the dashboard seeds, so admin can log in from the main site too.
  const DEFAULT_ADMIN = {
    id: 'admin', username: 'admin', email: 'admin@amaarbazaar.com',
    password: 'bazaar2026', role: 'admin', active: true
  };

  /* ---------- tiny i18n shim (works even before/without I18nStore) ---------- */
  function t(key, fallback) {
    try { if (window.I18nStore && I18nStore.get) { const v = I18nStore.get(key); if (v && v !== key) return v; } }
    catch (e) {}
    return fallback;
  }

  /* ---------- storage ---------- */
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch (e) { return []; }
  }
  function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }

  function seedUsers() {
    const users = getUsers();
    if (!users.some(u => u.username === 'admin')) {
      users.unshift(DEFAULT_ADMIN);
      saveUsers(users);
    }
  }

  function getSession() {
    try {
      const s = JSON.parse(localStorage.getItem(USER_SESSION_KEY) || 'null');
      if (!s) return null;
      if (Date.now() - s.timestamp > SESSION_TIMEOUT) { localStorage.removeItem(USER_SESSION_KEY); return null; }
      return s;
    } catch (e) { return null; }
  }
  function setSession(user) {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify({
      username: user.username, role: user.role, timestamp: Date.now()
    }));
    // If an admin signs in here, also open an admin-dashboard session.
    if (user.role === 'admin') {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ username: user.username, timestamp: Date.now() }));
    }
  }
  function clearSession() {
    localStorage.removeItem(USER_SESSION_KEY);
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
  function currentUser() {
    const s = getSession();
    if (!s) return null;
    return getUsers().find(u => u.username === s.username) || { username: s.username, role: s.role };
  }

  /* ---------- validation ---------- */
  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  /* ---------- modal markup ---------- */
  function injectModal() {
    if (document.getElementById('authModal')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
<div class="modal" id="authModal" aria-hidden="true">
  <div class="modal__overlay" data-auth-close></div>
  <div class="modal__panel modal__panel--auth">
    <button class="modal__close" data-auth-close aria-label="Close">✕</button>
    <div class="modal__head">
      <div class="auth-logo" aria-hidden="true">
        <svg viewBox="0 0 48 48"><g fill="#0e8e8a"><path d="M24 34C16 25 16 14 24 6 32 14 32 25 24 34Z" opacity=".5" transform="rotate(-70 24 34)"/><path d="M24 34C16 25 16 14 24 6 32 14 32 25 24 34Z" opacity=".5" transform="rotate(70 24 34)"/><path d="M24 34C20 25 21 15 24 8 27 15 28 25 24 34Z" transform="rotate(-46 24 34)"/><path d="M24 34C20 25 21 15 24 8 27 15 28 25 24 34Z" transform="rotate(-23 24 34)"/><path d="M24 34C20 25 21 15 24 8 27 15 28 25 24 34Z"/><path d="M24 34C20 25 21 15 24 8 27 15 28 25 24 34Z" transform="rotate(23 24 34)"/><path d="M24 34C20 25 21 15 24 8 27 15 28 25 24 34Z" transform="rotate(46 24 34)"/></g><circle cx="24" cy="31.5" r="3" fill="#f5a623"/></svg>
      </div>
      <h3 id="authTitle">${t('auth.login_title', 'Welcome back')}</h3>
      <p id="authSub">${t('auth.login_sub', 'Log in to your AmaarBazaar account.')}</p>
    </div>
    <div class="auth-tabs">
      <button type="button" class="auth-tab active" data-auth-tab="login">${t('auth.tab_login', 'Log in')}</button>
      <button type="button" class="auth-tab" data-auth-tab="register">${t('auth.tab_register', 'Register')}</button>
    </div>
    <div class="modal__body">
      <!-- LOGIN -->
      <form id="authLoginForm" class="auth-form">
        <div class="field">
          <label>${t('auth.username', 'Username')}</label>
          <input type="text" id="liUser" autocomplete="username" placeholder="${t('auth.username_ph', 'your username')}">
        </div>
        <div class="field">
          <label>${t('auth.password', 'Password')}</label>
          <input type="password" id="liPass" autocomplete="current-password" placeholder="••••••••">
        </div>
        <div class="auth-error" id="liError"></div>
        <button type="submit" class="btn btn--primary btn--block btn--lg">${t('auth.login_btn', 'Log in')}</button>
        <p class="auth-hint">${t('auth.demo_admin', 'Admin demo: admin / bazaar2026')}</p>
      </form>
      <!-- REGISTER -->
      <form id="authRegForm" class="auth-form" style="display:none">
        <div class="field">
          <label>${t('auth.username', 'Username')}</label>
          <input type="text" id="rgUser" autocomplete="username" placeholder="${t('auth.username_ph', 'choose a username')}">
        </div>
        <div class="field">
          <label>${t('auth.email', 'Email')}</label>
          <input type="email" id="rgEmail" autocomplete="email" placeholder="you@example.com">
        </div>
        <div class="field">
          <label>${t('auth.password', 'Password')}</label>
          <input type="password" id="rgPass" autocomplete="new-password" placeholder="${t('auth.password_ph', 'at least 6 characters')}">
        </div>
        <div class="auth-error" id="rgError"></div>
        <button type="submit" class="btn btn--primary btn--block btn--lg">${t('auth.register_btn', 'Create account')}</button>
        <p class="auth-hint">${t('auth.terms', 'By registering you agree to our Terms & Privacy Policy.')}</p>
      </form>
    </div>
  </div>
</div>`;
    document.body.appendChild(wrap.firstElementChild);
  }

  /* ---------- modal control ---------- */
  function openModal(mode) {
    const m = document.getElementById('authModal');
    if (!m) return;
    setMode(mode || 'login');
    m.classList.add('open');
    m.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const first = m.querySelector('.auth-form:not([style*="none"]) input');
    if (first) setTimeout(() => first.focus(), 50);
  }
  function closeModal() {
    const m = document.getElementById('authModal');
    if (!m) return;
    m.classList.remove('open');
    m.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    clearErrors();
  }
  function setMode(mode) {
    const loginForm = document.getElementById('authLoginForm');
    const regForm = document.getElementById('authRegForm');
    const title = document.getElementById('authTitle');
    const sub = document.getElementById('authSub');
    document.querySelectorAll('.auth-tab').forEach(tb =>
      tb.classList.toggle('active', tb.dataset.authTab === mode));
    const isReg = mode === 'register';
    if (loginForm) loginForm.style.display = isReg ? 'none' : '';
    if (regForm) regForm.style.display = isReg ? '' : 'none';
    if (title) title.textContent = isReg ? t('auth.register_title', 'Create your account') : t('auth.login_title', 'Welcome back');
    if (sub) sub.textContent = isReg ? t('auth.register_sub', 'Join AmaarBazaar — it’s free.') : t('auth.login_sub', 'Log in to your AmaarBazaar account.');
    clearErrors();
  }
  function clearErrors() {
    const a = document.getElementById('liError'); if (a) a.textContent = '';
    const b = document.getElementById('rgError'); if (b) b.textContent = '';
  }

  /* ---------- handlers ---------- */
  function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('liUser').value.trim();
    const password = document.getElementById('liPass').value;
    const err = document.getElementById('liError');
    if (!username || !password) { err.textContent = t('auth.err_required', 'Please fill in all fields.'); return; }
    const user = getUsers().find(u => u.username === username && u.password === password && u.active !== false);
    if (!user) { err.textContent = t('auth.err_invalid', 'Invalid username or password.'); return; }
    setSession(user);
    // record last login
    const users = getUsers();
    const u = users.find(x => x.username === username);
    if (u) { u.lastLogin = new Date().toISOString(); saveUsers(users); }
    closeModal();
    refreshNav();
    toast((t('auth.welcome', 'Welcome back') + ', ' + user.username + '!'));
    if (user.role === 'admin') {
      toast(t('auth.admin_redirect', 'Opening admin dashboard…'));
      setTimeout(() => { window.location.href = 'admin.html'; }, 700);
    }
  }

  function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('rgUser').value.trim();
    const email = document.getElementById('rgEmail').value.trim();
    const password = document.getElementById('rgPass').value;
    const err = document.getElementById('rgError');
    if (!username || !email || !password) { err.textContent = t('auth.err_required', 'Please fill in all fields.'); return; }
    if (username.length < 3) { err.textContent = t('auth.err_username', 'Username must be at least 3 characters.'); return; }
    if (!validEmail(email)) { err.textContent = t('auth.err_email', 'Please enter a valid email address.'); return; }
    if (password.length < 6) { err.textContent = t('auth.err_password', 'Password must be at least 6 characters.'); return; }
    const users = getUsers();
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      err.textContent = t('auth.err_taken', 'That username is already taken.'); return;
    }
    if (users.some(u => u.email && u.email.toLowerCase() === email.toLowerCase())) {
      err.textContent = t('auth.err_email_used', 'That email is already registered.'); return;
    }
    const newUser = {
      id: Date.now().toString(), username, email, password,
      role: 'user', active: true, created: new Date().toISOString(), lastLogin: new Date().toISOString()
    };
    users.push(newUser);
    saveUsers(users);
    setSession(newUser);
    closeModal();
    refreshNav();
    toast(t('auth.account_created', 'Account created — you’re signed in! 🎉'));
  }

  /* ---------- nav account state ---------- */
  function refreshNav() {
    const user = currentUser();
    document.querySelectorAll('[data-i18n="nav.login"]').forEach(link => {
      // keep a flag so toggle handler knows the state
      if (user) {
        link.textContent = '👤 ' + user.username;
        link.dataset.authState = 'in';
      } else {
        link.textContent = t('nav.login', 'Log in');
        link.dataset.authState = 'out';
        link.removeAttribute('data-i18n-skip');
      }
    });
    buildAccountMenu(user);
  }

  function buildAccountMenu(user) {
    let menu = document.getElementById('accountMenu');
    if (!user) { if (menu) menu.remove(); return; }
    if (!menu) {
      menu = document.createElement('div');
      menu.id = 'accountMenu';
      menu.className = 'account-menu';
      document.body.appendChild(menu);
    }
    const isAdmin = user.role === 'admin';
    menu.innerHTML = `
      <div class="account-menu__head">
        <strong>${escapeHtml(user.username)}</strong>
        <span>${escapeHtml(user.email || (isAdmin ? 'Administrator' : 'Member'))}</span>
      </div>
      ${isAdmin ? `<a href="admin.html" class="account-menu__item">🛠️ ${t('auth.dashboard', 'Admin dashboard')}</a>` : ''}
      <a href="post.html" class="account-menu__item">➕ ${t('nav.post', 'Post an Ad')}</a>
      <button type="button" class="account-menu__item account-menu__logout" id="authLogout">↩︎ ${t('auth.logout', 'Log out')}</button>`;
    menu.querySelector('#authLogout').addEventListener('click', () => {
      clearSession(); refreshNav(); menu.classList.remove('open');
      toast(t('auth.logged_out', 'You’ve been logged out.'));
    });
  }

  function positionMenu(anchor) {
    const menu = document.getElementById('accountMenu');
    if (!menu) return;
    const r = anchor.getBoundingClientRect();
    menu.style.top = (r.bottom + 10) + 'px';
    menu.style.right = Math.max(12, (window.innerWidth - r.right)) + 'px';
  }

  /* ---------- utils ---------- */
  function escapeHtml(s) { const d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }
  function toast(msg) {
    let el = document.getElementById('toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------- wiring ---------- */
  function wire() {
    // login link click → modal or account menu
    document.querySelectorAll('[data-i18n="nav.login"], [data-auth-open]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentUser()) {
          const menu = document.getElementById('accountMenu');
          if (menu) { positionMenu(link); menu.classList.toggle('open'); }
        } else {
          openModal('login');
        }
      });
    });
    // register triggers
    document.querySelectorAll('[data-auth-register]').forEach(b =>
      b.addEventListener('click', (e) => { e.preventDefault(); openModal('register'); }));

    // modal internals
    document.querySelectorAll('[data-auth-close]').forEach(b => b.addEventListener('click', closeModal));
    document.querySelectorAll('.auth-tab').forEach(tb =>
      tb.addEventListener('click', () => setMode(tb.dataset.authTab)));
    document.getElementById('authLoginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('authRegForm')?.addEventListener('submit', handleRegister);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

    // close account menu on outside click
    document.addEventListener('click', (e) => {
      const menu = document.getElementById('accountMenu');
      if (!menu || !menu.classList.contains('open')) return;
      if (menu.contains(e.target)) return;
      if (e.target.closest('[data-i18n="nav.login"], [data-auth-open]')) return;
      menu.classList.remove('open');
    });

    // refresh labels when language changes
    document.addEventListener('langchange', refreshNav);
  }

  /* ---------- boot ---------- */
  function init() {
    seedUsers();
    injectModal();
    wire();
    refreshNav();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // expose for other scripts
  window.AmaarAuth = { open: openModal, currentUser, logout: () => { clearSession(); refreshNav(); } };
})();
