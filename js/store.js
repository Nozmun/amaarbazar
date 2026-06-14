// AmaarBazaar — persistent data layer (listings, categories, email outbox)
// Backed by localStorage, seeded from data.js defaults, emits 'change' so every
// screen can re-render. This is the single source of truth across all pages.
const Store = (function () {
  'use strict';

  const LK = 'amaarbazar_listings';
  const CK = 'amaarbazar_categories';
  const OK = 'amaarbazar_outbox';
  const FK = 'amaarbazar_favorites';
  const bus = document.createElement('div');

  function read(k, def) {
    try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? def : v; }
    catch (e) { return def; }
  }
  function write(k, v) { localStorage.setItem(k, JSON.stringify(v)); }
  function emit(kind) { bus.dispatchEvent(new CustomEvent('change', { detail: { kind } })); }

  function seed() {
    if (localStorage.getItem(LK) == null) write(LK, typeof LISTINGS !== 'undefined' ? LISTINGS : []);
    if (localStorage.getItem(CK) == null) write(CK, typeof CATEGORY_GROUPS !== 'undefined' ? CATEGORY_GROUPS : []);
    if (localStorage.getItem(OK) == null) write(OK, []);
  }
  seed();

  /* ---------------- listings ---------------- */
  function getListings() { return read(LK, []); }
  function saveListings(arr) { write(LK, arr); emit('listings'); }
  function addListing(data) {
    const arr = getListings();
    const id = arr.reduce((m, l) => Math.max(m, +l.id || 0), 0) + 1;
    const listing = Object.assign({ id, days: 0, featured: false }, data);
    arr.unshift(listing);
    try {
      saveListings(arr);
    } catch (e) {
      // localStorage quota — shed image data and keep the listing
      if (Array.isArray(listing.imgs) && listing.imgs.length > 1) { listing.imgs = [listing.imgs[0]]; }
      try { saveListings(arr); }
      catch (e2) { listing.imgs = listing.img ? [listing.img] : []; saveListings(arr); }
    }
    return listing;
  }
  function updateListing(id, patch) {
    const arr = getListings();
    const i = arr.findIndex(l => String(l.id) === String(id));
    if (i < 0) return null;
    arr[i] = Object.assign({}, arr[i], patch);
    saveListings(arr);
    return arr[i];
  }
  function deleteListing(id) {
    saveListings(getListings().filter(l => String(l.id) !== String(id)));
  }
  function getListing(id) { return getListings().find(l => String(l.id) === String(id)); }

  /* ---------------- categories (grouped) ---------------- */
  function getGroups() { return read(CK, []); }
  function saveGroups(g) { write(CK, g); emit('categories'); }
  function groupSlug(key) { return (key || '').split('.').pop(); }
  function getFlatCategories() {
    const flat = [];
    getGroups().forEach(g => g.categories.forEach(c => flat.push(Object.assign({ group: g.key, groupSlug: groupSlug(g.key) }, c))));
    return flat;
  }
  function findGroupOfCat(catId) {
    for (const g of getGroups()) if (g.categories.some(c => c.id === catId)) return groupSlug(g.key);
    return null;
  }
  function addCategory(groupKey, cat) {
    const groups = getGroups();
    const g = groups.find(x => x.key === groupKey) || groups.find(x => groupSlug(x.key) === groupSlug(groupKey));
    if (!g) return null;
    if (groups.some(gr => gr.categories.some(c => c.id === cat.id))) return null; // dup id
    g.categories.push(cat);
    saveGroups(groups);
    return cat;
  }
  function updateCategory(id, patch) {
    const groups = getGroups();
    for (const g of groups) {
      const c = g.categories.find(c => c.id === id);
      if (c) { Object.assign(c, patch); saveGroups(groups); return c; }
    }
    return null;
  }
  function deleteCategory(id) {
    const groups = getGroups();
    groups.forEach(g => { g.categories = g.categories.filter(c => c.id !== id); });
    saveGroups(groups);
  }
  // Human label for a category, translated when an i18n key exists, else its name/id.
  function catName(c) {
    if (!c) return '';
    if (c.key && typeof I18nStore !== 'undefined') { const tr = I18nStore.get(c.key); if (tr && tr !== c.key) return tr; }
    if (c.name) return c.name;
    return c.id;
  }
  function catNameById(id) {
    const c = getFlatCategories().find(c => c.id === id);
    return c ? catName(c) : id;
  }

  /* ---------------- email outbox ---------------- */
  function getOutbox() { return read(OK, []); }
  function sendEmail(to, subject, body) {
    const arr = getOutbox();
    const mail = { id: Date.now(), to, subject, body, sentAt: new Date().toISOString() };
    arr.unshift(mail);
    write(OK, arr);
    emit('outbox');
    return mail;
  }

  /* ---------------- favorites (per user) ---------------- */
  function favKey(user) { return user || '_guest'; }
  function getFavMap() { return read(FK, {}); }
  function getFavorites(user) { return (getFavMap()[favKey(user)] || []).map(String); }
  function isFavorite(user, id) { return getFavorites(user).indexOf(String(id)) !== -1; }
  function toggleFavorite(user, id) {
    const map = getFavMap();
    const k = favKey(user);
    const list = (map[k] || []).map(String);
    const i = list.indexOf(String(id));
    if (i === -1) list.push(String(id)); else list.splice(i, 1);
    map[k] = list;
    write(FK, map);
    emit('favorites');
    return i === -1; // true if now favorited
  }

  /* ---------------- video media (IndexedDB — too big for localStorage) ---------------- */
  let _dbp = null;
  function openDB() {
    if (_dbp) return _dbp;
    _dbp = new Promise((res, rej) => {
      const r = indexedDB.open('amaarbazar_media', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('media');
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
    return _dbp;
  }
  async function putVideo(id, blob) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction('media', 'readwrite');
      tx.objectStore('media').put(blob, 'video_' + id);
      tx.oncomplete = res; tx.onerror = () => rej(tx.error);
    });
  }
  async function getVideo(id) {
    const db = await openDB();
    return new Promise((res, rej) => {
      const tx = db.transaction('media', 'readonly');
      const rq = tx.objectStore('media').get('video_' + id);
      rq.onsuccess = () => res(rq.result || null); rq.onerror = () => rej(rq.error);
    });
  }
  async function delVideo(id) {
    const db = await openDB();
    return new Promise((res) => {
      const tx = db.transaction('media', 'readwrite');
      tx.objectStore('media').delete('video_' + id);
      tx.oncomplete = res; tx.onerror = res;
    });
  }

  /* ---------------- misc ---------------- */
  function on(cb) { bus.addEventListener('change', cb); }
  function reset() {
    [LK, CK, OK].forEach(k => localStorage.removeItem(k));
    seed();
    emit('all');
  }

  return {
    getListings, getListing, addListing, updateListing, deleteListing,
    getGroups, saveGroups, getFlatCategories, findGroupOfCat, groupSlug,
    addCategory, updateCategory, deleteCategory, catName, catNameById,
    getOutbox, sendEmail, getFavorites, isFavorite, toggleFavorite,
    putVideo, getVideo, delVideo, on, reset
  };
})();
window.Store = Store;
