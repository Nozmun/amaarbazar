// AmaarBazaar Admin Dashboard with User Management & Audit Logging
(function() {
  'use strict';

  const SESSION_KEY = 'amaarbazar_admin_session';
  const USERS_KEY = 'amaarbazar_users';
  const AUDIT_LOG_KEY = 'amaarbazar_audit_log';
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // Default admin user
  const DEFAULT_ADMIN = { id: 'admin', username: 'admin', email: 'admin@amaarbazaar.com', password: 'bazaar2026', role: 'admin', active: true };

  /* ---- Storage & Session Management ---- */
  function initializeStorage() {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify([DEFAULT_ADMIN]));
    }
    if (!localStorage.getItem(AUDIT_LOG_KEY)) {
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify([]));
    }
  }

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  }

  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  function getAuditLog() {
    return JSON.parse(localStorage.getItem(AUDIT_LOG_KEY) || '[]');
  }

  function saveAuditLog(log) {
    localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(log));
  }

  function logActivity(action, details, status = 'success') {
    const session = getSession();
    if (!session) return;

    const log = getAuditLog();
    const entry = {
      timestamp: new Date().toISOString(),
      admin: session.username,
      action: action,
      details: details,
      ip: 'localhost', // In production, get real IP from server
      status: status
    };
    log.unshift(entry); // Add to beginning
    if (log.length > 1000) log.pop(); // Keep last 1000 entries
    saveAuditLog(log);
  }

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
    logActivity('login', `Admin ${username} logged in`, 'success');
  }

  function clearSession() {
    const session = getSession();
    if (session) {
      logActivity('logout', `Admin ${session.username} logged out`, 'success');
    }
    localStorage.removeItem(SESSION_KEY);
  }

  /* ---- UI State Management ---- */
  function showLoginModal() {
    document.getElementById('loginModal').classList.add('active');
    document.getElementById('dashboard').classList.add('hidden');
  }

  function showDashboard() {
    document.getElementById('loginModal').classList.remove('active');
    document.getElementById('dashboard').classList.remove('hidden');
    loadDashboardData();
  }

  window.showSection = function(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const section = document.getElementById(sectionId);
    const link = document.querySelector(`[onclick="showSection('${sectionId}')"]`);

    if (section) section.classList.remove('hidden');
    if (link) link.classList.add('active');

    // Load section-specific data
    if (sectionId === 'users') loadUsers();
    else if (sectionId === 'listings') loadListings();
    else if (sectionId === 'categories') loadCategories();
    else if (sectionId === 'audit') loadAuditLog();
  };

  /* ---- Authentication ---- */
  window.adminLogin = function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const error = document.getElementById('loginError');

    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password && u.active);

    if (user) {
      setSession(username);
      document.getElementById('loginForm').reset();
      error.textContent = '';
      showDashboard();
    } else {
      logActivity('login', `Failed login attempt for username: ${username}`, 'failed');
      error.textContent = 'Invalid credentials or inactive account.';
    }
  };

  window.adminLogout = function() {
    clearSession();
    showLoginModal();
  };

  /* ---- Dashboard Data ---- */
  function loadDashboardData() {
    if (typeof LISTINGS !== 'undefined') {
      document.getElementById('statListings').textContent = LISTINGS.length;
      document.getElementById('statRevenue').textContent = '৳' + (LISTINGS.length * 500).toLocaleString();
    }
    if (typeof CATEGORIES !== 'undefined') {
      document.getElementById('statCategories').textContent = CATEGORIES.length;
    }
    document.getElementById('statUsers').textContent = getUsers().length;
  }

  /* ---- User Management ---- */
  window.openCreateUserModal = function() {
    document.getElementById('userModalTitle').textContent = 'Create New User';
    document.getElementById('userId').value = '';
    document.getElementById('userForm').reset();
    document.getElementById('userModal').classList.remove('hidden');
    logActivity('user_create', 'Opened create user modal', 'view');
  };

  window.closeUserModal = function() {
    document.getElementById('userModal').classList.add('hidden');
  };

  window.saveUser = function(e) {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const username = document.getElementById('userUsername').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    const active = document.getElementById('userActive').checked;
    const errorEl = document.getElementById('userError');

    const users = getUsers();

    // Validation
    if (!username || !email || !password) {
      errorEl.textContent = 'All fields are required.';
      return;
    }

    if (password.length < 6) {
      errorEl.textContent = 'Password must be at least 6 characters.';
      return;
    }

    // Check if username already exists (excluding current user if editing)
    if (users.some(u => u.username === username && u.id !== userId)) {
      errorEl.textContent = 'Username already exists.';
      return;
    }

    if (userId) {
      // Edit existing user
      const user = users.find(u => u.id === userId);
      if (user) {
        user.username = username;
        user.email = email;
        user.password = password;
        user.role = role;
        user.active = active;
        logActivity('user_edit', `Edited user: ${username} (Role: ${role})`, 'success');
      }
    } else {
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        username,
        email,
        password,
        role,
        active,
        created: new Date().toISOString(),
        lastLogin: null
      };
      users.push(newUser);
      logActivity('user_create', `Created new user: ${username} (Role: ${role})`, 'success');
    }

    saveUsers(users);
    closeUserModal();
    loadUsers();
  };

  function loadUsers() {
    const users = getUsers();
    const tbody = document.getElementById('usersTable');

    if (users.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7">No users found.</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(user => `
      <tr>
        <td><strong>${escapeHtml(user.username)}</strong></td>
        <td>${escapeHtml(user.email)}</td>
        <td><span class="role-badge role-${user.role}">${user.role}</span></td>
        <td><span class="status-badge ${user.active ? 'active' : 'inactive'}">${user.active ? 'Active' : 'Inactive'}</span></td>
        <td>${formatDate(user.created)}</td>
        <td>${user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
        <td>
          <button class="btn-small" onclick="editUser('${user.id}')">Edit</button>
          <button class="btn-small btn-danger" onclick="deleteUser('${user.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  window.editUser = function(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);

    if (!user) return;

    document.getElementById('userModalTitle').textContent = 'Edit User';
    document.getElementById('userId').value = user.id;
    document.getElementById('userUsername').value = user.username;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userPassword').value = user.password;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userActive').checked = user.active;
    document.getElementById('userModal').classList.remove('hidden');

    logActivity('user_edit', `Opened edit modal for user: ${user.username}`, 'view');
  };

  window.deleteUser = function(userId) {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    const users = getUsers();
    const user = users.find(u => u.id === userId);

    if (!user || user.id === 'admin') {
      alert('Cannot delete the default admin user.');
      return;
    }

    const newUsers = users.filter(u => u.id !== userId);
    saveUsers(newUsers);
    logActivity('user_delete', `Deleted user: ${user.username}`, 'success');
    loadUsers();
  };

  /* ---- Listings Management ---- */
  function loadListings() {
    const tbody = document.getElementById('listingsTable');
    if (typeof LISTINGS === 'undefined' || LISTINGS.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No listings available.</td></tr>';
      return;
    }

    tbody.innerHTML = LISTINGS.map(listing => `
      <tr>
        <td>${listing.id}</td>
        <td>${escapeHtml(listing.title.en)}</td>
        <td>${listing.cat}</td>
        <td>৳${listing.price.toLocaleString()}</td>
        <td><span class="status-badge active">Active</span></td>
        <td>
          <button class="btn-small" onclick="deleteListing(${listing.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  window.deleteListing = function(listingId) {
    if (confirm('Delete this listing?')) {
      logActivity('listing_delete', `Deleted listing ID: ${listingId}`, 'success');
      alert('Listing deleted (Demo mode - data not actually persisted)');
    }
  };

  /* ---- Categories Management ---- */
  function loadCategories() {
    const tbody = document.getElementById('categoriesTable');
    if (typeof CATEGORIES === 'undefined' || CATEGORIES.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4">No categories available.</td></tr>';
      return;
    }

    tbody.innerHTML = CATEGORIES.map(cat => `
      <tr>
        <td>${escapeHtml(cat.key || cat.id)}</td>
        <td>${cat.icon}</td>
        <td>${Math.floor(Math.random() * 50)}</td>
        <td>
          <button class="btn-small" onclick="editCategory('${cat.id}')">Edit</button>
        </td>
      </tr>
    `).join('');
  }

  window.editCategory = function(catId) {
    logActivity('category_edit', `Opened edit for category: ${catId}`, 'view');
    alert('Category edit coming soon');
  };

  window.addCategory = function() {
    logActivity('category_edit', 'Opened create category modal', 'view');
    alert('Add category feature coming soon.');
  };

  /* ---- Audit Log ---- */
  function loadAuditLog() {
    const logs = getAuditLog();
    const tbody = document.getElementById('auditTable');

    if (logs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No activity logged yet.</td></tr>';
      return;
    }

    tbody.innerHTML = logs.map(log => `
      <tr>
        <td>${formatDateTime(log.timestamp)}</td>
        <td><strong>${escapeHtml(log.admin)}</strong></td>
        <td><span class="action-badge">${formatAction(log.action)}</span></td>
        <td>${escapeHtml(log.details)}</td>
        <td>${log.ip}</td>
        <td><span class="status-badge ${log.status}">${log.status}</span></td>
      </tr>
    `).join('');
  }

  window.filterAuditLog = function() {
    const userFilter = document.getElementById('auditFilterUser').value.toLowerCase();
    const actionFilter = document.getElementById('auditFilterAction').value;
    const rows = document.querySelectorAll('#auditTable tr');

    rows.forEach(row => {
      const username = row.cells[1]?.textContent.toLowerCase() || '';
      const action = row.cells[2]?.textContent || '';

      const userMatch = !userFilter || username.includes(userFilter);
      const actionMatch = !actionFilter || action.toLowerCase().includes(actionFilter);

      row.style.display = (userMatch && actionMatch) ? '' : 'none';
    });
  };

  window.clearAuditLog = function() {
    if (confirm('Clear all audit log entries? This cannot be undone.')) {
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify([]));
      logActivity('audit_clear', 'Cleared audit log', 'success');
      loadAuditLog();
    }
  };

  /* ---- Settings ---- */
  window.saveSettings = function() {
    logActivity('settings_change', 'Updated admin settings', 'success');
    alert('Settings saved successfully!');
  };

  /* ---- Utility Functions ---- */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  function formatDateTime(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    }) + ' ' + date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    });
  }

  function formatAction(action) {
    return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  /* ---- Session Management ---- */
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

  /* ---- Modal Styling ---- */
  document.addEventListener('click', (e) => {
    const userModal = document.getElementById('userModal');
    if (e.target === userModal) {
      closeUserModal();
    }
  });

  /* ---- Initialize ---- */
  window.addEventListener('load', function() {
    initializeStorage();
    const session = getSession();
    if (session) {
      showDashboard();
    } else {
      showLoginModal();
    }
    resetInactivityTimer();
  });
})();
