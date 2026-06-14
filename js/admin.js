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
    showSection('stats');
  }

  window.showSection = function(sectionId) {
    document.querySelectorAll('.section').forEach(s => { s.classList.remove('active'); s.classList.add('hidden'); });
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const section = document.getElementById(sectionId);
    const link = document.querySelector(`[data-section="${sectionId}"]`);

    if (section) { section.classList.add('active'); section.classList.remove('hidden'); }
    if (link) link.classList.add('active');

    activeSection = sectionId;
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

  /* ---- Dashboard Data (from Store) ---- */
  function loadDashboardData() {
    const listings = window.Store ? Store.getListings() : (typeof LISTINGS !== 'undefined' ? LISTINGS : []);
    const cats = window.Store ? Store.getFlatCategories() : (typeof CATEGORIES !== 'undefined' ? CATEGORIES : []);
    const revenue = listings.reduce((sum, l) => sum + ({ featured: 299, premium: 599 }[l.tier] || 0), 0);
    document.getElementById('statListings').textContent = listings.length;
    document.getElementById('statRevenue').textContent = '৳' + revenue.toLocaleString();
    document.getElementById('statCategories').textContent = cats.length;
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
          <button class="btn-small" data-action="editUser" data-id="${user.id}">Edit</button>
          <button class="btn-small btn-danger" data-action="deleteUser" data-id="${user.id}">Delete</button>
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

  /* ---- Listings Management (full CRUD via Store) ---- */
  function populateListingCatSelect(selected) {
    const sel = document.getElementById('listingCat');
    if (!sel || !window.Store) return;
    sel.innerHTML = '';
    Store.getGroups().forEach(g => {
      const og = document.createElement('optgroup');
      og.label = g.group || g.key;
      g.categories.forEach(c => {
        const o = document.createElement('option');
        o.value = c.id; o.textContent = Store.catName(c);
        og.appendChild(o);
      });
      sel.appendChild(og);
    });
    if (selected) sel.value = selected;
  }

  function loadListings() {
    const tbody = document.getElementById('listingsTable');
    const listings = window.Store ? Store.getListings() : [];
    if (!listings.length) { tbody.innerHTML = '<tr><td colspan="6">No listings yet. Use “Add Listing”.</td></tr>'; return; }
    tbody.innerHTML = listings.map(l => `
      <tr>
        <td>${l.id}</td>
        <td>${escapeHtml(l.title.en)}${l.featured ? ' <span class="status-badge success">Featured</span>' : ''}</td>
        <td>${escapeHtml(Store.catNameById(l.cat))}</td>
        <td>৳${(l.price||0).toLocaleString()}</td>
        <td>${escapeHtml((l.loc && l.loc.en) || '-')}</td>
        <td>
          <button class="btn-small" data-action="editListing" data-id="${l.id}">Edit</button>
          <button class="btn-small btn-danger" data-action="deleteListing" data-id="${l.id}">Delete</button>
        </td>
      </tr>`).join('');
  }

  window.openCreateListing = function() {
    document.getElementById('listingModalTitle').textContent = 'Add Listing';
    document.getElementById('listingForm').reset();
    document.getElementById('listingId').value = '';
    populateListingCatSelect();
    document.getElementById('listingError').textContent = '';
    document.getElementById('listingModal').classList.remove('hidden');
  };
  window.closeListingModal = function() { document.getElementById('listingModal').classList.add('hidden'); };

  window.editListing = function(id) {
    const l = Store.getListing(id);
    if (!l) return;
    document.getElementById('listingModalTitle').textContent = 'Edit Listing';
    document.getElementById('listingId').value = l.id;
    document.getElementById('listingTitle').value = l.title.en;
    populateListingCatSelect(l.cat);
    document.getElementById('listingPrice').value = l.price;
    document.getElementById('listingLoc').value = (l.loc && l.loc.en) || '';
    document.getElementById('listingFeatured').checked = !!l.featured;
    document.getElementById('listingError').textContent = '';
    document.getElementById('listingModal').classList.remove('hidden');
  };

  window.saveListing = function(e) {
    e.preventDefault();
    const id = document.getElementById('listingId').value;
    const title = document.getElementById('listingTitle').value.trim();
    const cat = document.getElementById('listingCat').value;
    const price = +document.getElementById('listingPrice').value || 0;
    const loc = document.getElementById('listingLoc').value.trim();
    const featured = document.getElementById('listingFeatured').checked;
    const err = document.getElementById('listingError');
    if (!title || !cat || !loc) { err.textContent = 'Title, category and location are required.'; return; }
    const group = Store.findGroupOfCat(cat) || '';
    const data = { title: { en: title, bn: title }, cat, group, price, loc: { en: loc, bn: loc }, featured };
    if (id) {
      Store.updateListing(id, data);
      logActivity('listing_edit', `Edited listing #${id}: ${title}`, 'success');
    } else {
      const created = Store.addListing(Object.assign({ img: 'https://images.unsplash.com/photo-1513708927688-890fe41c2748?w=600&q=80', days: 0 }, data));
      logActivity('listing_create', `Created listing #${created.id}: ${title}`, 'success');
    }
    closeListingModal();
  };

  window.deleteListing = function(listingId) {
    if (!confirm('Delete this listing? This cannot be undone.')) return;
    Store.deleteListing(listingId);
    logActivity('listing_delete', `Deleted listing #${listingId}`, 'success');
  };

  /* ---- Categories Management (full CRUD via Store) ---- */
  function populateGroupSelect(selected) {
    const sel = document.getElementById('catGroup');
    if (!sel || !window.Store) return;
    sel.innerHTML = Store.getGroups().map(g => `<option value="${g.key}">${escapeHtml(g.group || g.key)}</option>`).join('');
    if (selected) sel.value = selected;
  }

  function loadCategories() {
    const tbody = document.getElementById('categoriesTable');
    const cats = window.Store ? Store.getFlatCategories() : [];
    const counts = {};
    (window.Store ? Store.getListings() : []).forEach(l => { counts[l.cat] = (counts[l.cat]||0)+1; });
    if (!cats.length) { tbody.innerHTML = '<tr><td colspan="4">No categories.</td></tr>'; return; }
    tbody.innerHTML = cats.map(cat => `
      <tr>
        <td>${escapeHtml(Store.catName(cat))}</td>
        <td>${cat.icon || ''}</td>
        <td>${counts[cat.id] || 0}</td>
        <td>
          <button class="btn-small" data-action="editCategory" data-id="${cat.id}">Edit</button>
          <button class="btn-small btn-danger" data-action="deleteCategory" data-id="${cat.id}">Delete</button>
        </td>
      </tr>`).join('');
  }

  window.openCreateCategory = function() {
    document.getElementById('catModalTitle').textContent = 'Add Category';
    document.getElementById('catForm').reset();
    document.getElementById('catId').value = '';
    populateGroupSelect();
    document.getElementById('catError').textContent = '';
    document.getElementById('catModal').classList.remove('hidden');
  };
  window.closeCatModal = function() { document.getElementById('catModal').classList.add('hidden'); };

  window.editCategory = function(catId) {
    const cat = Store.getFlatCategories().find(c => c.id === catId);
    if (!cat) return;
    document.getElementById('catModalTitle').textContent = 'Edit Category';
    document.getElementById('catId').value = cat.id;
    document.getElementById('catName').value = Store.catName(cat);
    document.getElementById('catIcon').value = cat.icon || '';
    populateGroupSelect(cat.group);
    document.getElementById('catGroup').disabled = true; // group fixed on edit
    document.getElementById('catError').textContent = '';
    document.getElementById('catModal').classList.remove('hidden');
  };

  window.addCategory = function() { document.getElementById('catGroup').disabled = false; openCreateCategory(); };

  window.saveCategory = function(e) {
    e.preventDefault();
    const id = document.getElementById('catId').value;
    const name = document.getElementById('catName').value.trim();
    const icon = document.getElementById('catIcon').value.trim() || '🏷️';
    const groupKey = document.getElementById('catGroup').value;
    const err = document.getElementById('catError');
    if (!name) { err.textContent = 'Category name is required.'; return; }
    if (id) {
      Store.updateCategory(id, { name, icon, key: null });
      logActivity('category_edit', `Edited category: ${name}`, 'success');
    } else {
      const newId = name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '') || ('cat_' + Date.now());
      const res = Store.addCategory(groupKey, { id: newId, icon, name });
      if (!res) { err.textContent = 'A category with that name/id already exists.'; return; }
      logActivity('category_create', `Created category: ${name}`, 'success');
    }
    document.getElementById('catGroup').disabled = false;
    closeCatModal();
  };

  window.deleteCategory = function(catId) {
    if (!confirm('Delete this category?')) return;
    Store.deleteCategory(catId);
    logActivity('category_delete', `Deleted category: ${catId}`, 'success');
  };

  /* ---- Audit Log (view / add / delete) ---- */
  function loadAuditLog() {
    const logs = getAuditLog();
    const tbody = document.getElementById('auditTable');
    if (logs.length === 0) { tbody.innerHTML = '<tr><td colspan="7">No activity logged yet.</td></tr>'; return; }
    tbody.innerHTML = logs.map((log, i) => `
      <tr>
        <td>${formatDateTime(log.timestamp)}</td>
        <td><strong>${escapeHtml(log.admin)}</strong></td>
        <td><span class="action-badge">${formatAction(log.action)}</span></td>
        <td>${escapeHtml(log.details)}</td>
        <td>${log.ip}</td>
        <td><span class="status-badge ${log.status}">${log.status}</span></td>
        <td><button class="btn-small btn-danger" data-action="deleteAudit" data-id="${i}">Delete</button></td>
      </tr>`).join('');
  }

  window.addAuditNote = function() {
    const note = prompt('Enter an audit note / manual log entry:');
    if (!note) return;
    logActivity('note', note, 'success');
    loadAuditLog();
  };

  window.deleteAuditEntry = function(index) {
    const logs = getAuditLog();
    const i = +index;
    if (i < 0 || i >= logs.length) return;
    if (!confirm('Delete this audit entry?')) return;
    logs.splice(i, 1);
    saveAuditLog(logs);
    loadAuditLog();
  };

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

  /* ---- CSP-safe event wiring (no inline handlers) ---- */
  const ACTIONS = {
    section: (el) => showSection(el.dataset.section),
    logout: () => adminLogout(),
    createUser: () => openCreateUserModal(),
    closeUser: () => closeUserModal(),
    editUser: (el) => editUser(el.dataset.id),
    deleteUser: (el) => deleteUser(el.dataset.id),
    addListing: () => openCreateListing(),
    editListing: (el) => editListing(el.dataset.id),
    deleteListing: (el) => deleteListing(el.dataset.id),
    closeListing: () => closeListingModal(),
    addCategory: () => addCategory(),
    editCategory: (el) => editCategory(el.dataset.id),
    deleteCategory: (el) => deleteCategory(el.dataset.id),
    closeCat: () => closeCatModal(),
    clearAudit: () => clearAuditLog(),
    addAuditNote: () => addAuditNote(),
    deleteAudit: (el) => deleteAuditEntry(el.dataset.id),
    saveSettings: () => saveSettings()
  };

  let activeSection = 'stats';

  function wireEvents() {
    // Delegated clicks for all [data-action] elements (works for dynamic rows too)
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (!el) return;
      const fn = ACTIONS[el.dataset.action];
      if (fn) { e.preventDefault(); fn(el); }
    });
    // Forms
    document.getElementById('loginForm')?.addEventListener('submit', adminLogin);
    document.getElementById('userForm')?.addEventListener('submit', saveUser);
    document.getElementById('listingForm')?.addEventListener('submit', saveListing);
    document.getElementById('catForm')?.addEventListener('submit', saveCategory);
    // Audit filters
    document.getElementById('auditFilterUser')?.addEventListener('keyup', filterAuditLog);
    document.getElementById('auditFilterAction')?.addEventListener('change', filterAuditLog);
    // Close modals when clicking the dark overlay
    ['listingModal', 'catModal'].forEach(id => {
      document.getElementById(id)?.addEventListener('click', (e) => {
        if (e.target.id === id) document.getElementById(id).classList.add('hidden');
      });
    });
    // Re-render whatever's on screen whenever the shared store changes
    if (window.Store) Store.on(() => {
      loadDashboardData();
      if (activeSection === 'listings') loadListings();
      else if (activeSection === 'categories') loadCategories();
      else if (activeSection === 'users') loadUsers();
    });
  }

  /* ---- Initialize ---- */
  window.addEventListener('load', function() {
    initializeStorage();
    wireEvents();
    const session = getSession();
    if (session) {
      showDashboard();
    } else {
      showLoginModal();
    }
    resetInactivityTimer();
  });
})();
