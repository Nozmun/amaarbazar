// AmaarBazaar Admin Dashboard
(function() {
  'use strict';

  const DEFAULT_ADMIN = { username: 'admin', password: 'bazaar2026' };
  const SESSION_KEY = 'amaarbazar_admin_session';
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  function getSession() {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    const session = JSON.parse(stored);
    if (Date.now() - session.timestamp > SESSION_TIMEOUT) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  }

  function setSession(username) {
    const session = { username, timestamp: Date.now() };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }

  function clearSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('dashboard').classList.add('hidden');
  }

  function showDashboard() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('dashboard').classList.remove('hidden');
    loadDashboardData();
  }

  window.adminLogin = function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const error = document.getElementById('loginError');

    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      setSession(username);
      document.getElementById('loginForm').reset();
      error.textContent = '';
      showDashboard();
    } else {
      error.textContent = 'Invalid credentials. (Demo: admin/bazaar2026)';
    }
  };

  window.adminLogout = function() {
    clearSession();
    showLoginModal();
  };

  window.showSection = function(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.add('active');
      event.target.classList.add('active');
    }
  };

  function loadDashboardData() {
    // Simulate loading data from LISTINGS (from data.js)
    if (typeof LISTINGS !== 'undefined') {
      document.getElementById('statListings').textContent = LISTINGS.length;
      document.getElementById('statRevenue').textContent = '৳' + (LISTINGS.length * 500).toLocaleString();
    }
    if (typeof CATEGORIES !== 'undefined') {
      document.getElementById('statCategories').textContent = CATEGORIES.length;
    }
    document.getElementById('statUsers').textContent = '42';
  }

  window.addCategory = function() {
    alert('Add category feature coming soon.');
  };

  window.saveSettings = function() {
    alert('Settings saved successfully!');
  };

  // Check session on page load
  window.addEventListener('load', function() {
    const session = getSession();
    if (session) {
      showDashboard();
    } else {
      showLoginModal();
    }
  });

  // Auto-logout on inactivity
  let inactivityTimer;
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (getSession()) {
        adminLogout();
        alert('Session expired due to inactivity.');
      }
    }, SESSION_TIMEOUT);
  }

  document.addEventListener('click', resetInactivityTimer);
  document.addEventListener('keypress', resetInactivityTimer);

  resetInactivityTimer();
})();
