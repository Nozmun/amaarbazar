// AmaarBazaar — interactions, rendering, animations, payment flow
(function(){
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const t = (key, fb) => { const v = I18nStore.get(key); return (v && v !== key) ? v : fb; };
  let pendingPost = null;

  /* ---- language toggle ---- */
  function initLang(){
    I18nStore.apply();
    $$('[data-lang-toggle]').forEach(btn =>
      btn.addEventListener('click', () => I18nStore.toggle()));
  }

  /* ---- populate category dropdowns (from Store) ---- */
  function populateCategorySelects(){
    const groups = (window.Store ? Store.getGroups() : (typeof CATEGORY_GROUPS!=='undefined'?CATEGORY_GROUPS:[]));
    ['#fCat', '#postCat'].forEach(selector => {
      const select = $(selector);
      if(!select) return;
      const prev = select.value;
      select.innerHTML = `<option value="" data-i18n="browse.all">${I18nStore.get('browse.all')}</option>`;
      groups.forEach(group => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = I18nStore.get(group.key) !== group.key ? I18nStore.get(group.key) : group.group;
        group.categories.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.id;
          option.textContent = Store ? Store.catName(cat) : (I18nStore.get(cat.key)||cat.id);
          if(cat.key) option.setAttribute('data-i18n', cat.key);
          optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
      });
      if(prev) select.value = prev;
    });
  }

  /* ---- sticky nav + mobile menu + scroll progress ---- */
  function initNav(){
    const nav = $('.nav');
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    const onScroll = () => {
      if(nav) nav.classList.toggle('scrolled', window.scrollY > 40);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    };
    onScroll(); window.addEventListener('scroll', onScroll, {passive:true});
    const burger = $('.nav__burger'), mobile = $('.nav__mobile');
    if(burger && mobile){
      burger.addEventListener('click', () => mobile.classList.toggle('open'));
      $$('a', mobile).forEach(a => a.addEventListener('click', () => mobile.classList.remove('open')));
    }
  }

  /* ---- scroll reveal (shared observer; works for static + injected nodes) ---- */
  const revealIO = ('IntersectionObserver' in window)
    ? new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); revealIO.unobserve(e.target); }});
      }, {threshold:.12, rootMargin:'0px 0px -40px'})
    : null;
  function reveal(el){ if(revealIO) revealIO.observe(el); else el.classList.add('in'); }
  function initReveal(){ $$('.reveal').forEach(reveal); }

  /* ---- animated counters ---- */
  function initCounters(){
    const els = $$('[data-count]');
    if(!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if(!e.isIntersecting) return;
        const el = e.target, target = +el.dataset.count, suffix = el.dataset.suffix || '';
        let cur = 0; const step = target / 60;
        const tick = () => {
          cur += step;
          if(cur >= target){ cur = target; }
          const v = Math.floor(cur).toLocaleString('en-US');
          el.textContent = (I18nStore.lang === 'bn' ? toBnNum(v) : v) + suffix;
          if(cur < target) requestAnimationFrame(tick);
        };
        tick(); io.unobserve(el);
      });
    }, {threshold:.5});
    els.forEach(el => io.observe(el));
  }

  /* ---- group icons (one per top-level group) ---- */
  const GROUP_ICON = {
    'group.vehicles':'🚗','group.forsale':'🏷️','group.services':'🛠️',
    'group.property':'🏠','group.pets':'🐾','group.jobs':'💼','group.community':'🤝'
  };
  const slug = (k) => k.split('.')[1];

  /* ---- illustrated category icons (Gumtree-style tile art) ----
     Original line illustrations drawn on-brand; colour comes from --c via currentColor. */
  const SVG = {
    vehicles:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 30l3-9a5 5 0 0 1 4.7-3.4h16.6A5 5 0 0 1 37 21l3 9"/><rect x="5" y="30" width="38" height="9" rx="3"/><circle cx="15" cy="39" r="3.2"/><circle cx="33" cy="39" r="3.2"/></svg>',
    forsale:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M24.5 7H37a4 4 0 0 1 4 4v12.5a4 4 0 0 1-1.2 2.8L25 41a3 3 0 0 1-4.2 0L7 27.2a3 3 0 0 1 0-4.2L21.7 8.2A4 4 0 0 1 24.5 7Z"/><circle cx="31.5" cy="16.5" r="2.6"/></svg>',
    services:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M30 8a7 7 0 0 0-8.4 9.1L8 30.7V40h9.3l13.6-13.6A7 7 0 0 0 40 18.4l-5.6 5.6-4.4-1.2-1.2-4.4 5.6-5.6A7 7 0 0 0 30 8Z"/></svg>',
    property:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 23 24 9l16 14"/><path d="M12 21v18h24V21"/><rect x="21" y="29" width="6" height="10"/></svg>',
    pets:'<svg viewBox="0 0 48 48" fill="currentColor" stroke="none"><ellipse cx="17" cy="16" rx="3.4" ry="4.6"/><ellipse cx="31" cy="16" rx="3.4" ry="4.6"/><ellipse cx="9.5" cy="25" rx="3.2" ry="4.2"/><ellipse cx="38.5" cy="25" rx="3.2" ry="4.2"/><path d="M24 24c-5.2 0-9.2 4.1-9.2 8.6 0 3 2.3 4.6 5 4.6 1.9 0 2.9-1 4.2-1s2.3 1 4.2 1c2.7 0 5-1.6 5-4.6C33.2 28.1 29.2 24 24 24Z"/></svg>',
    jobs:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="17" width="34" height="22" rx="3"/><path d="M18 17v-3.5A3.5 3.5 0 0 1 21.5 10h5A3.5 3.5 0 0 1 30 13.5V17"/><path d="M7 27h34"/></svg>',
    community:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="18" r="5"/><circle cx="32" cy="19" r="4"/><path d="M9 38v-2a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8v2"/><path d="M30 28.3A7 7 0 0 1 39 35v3"/></svg>'
  };
  /* per-group icon colour + soft tile tint (kept within the brand palette) */
  const GROUP_META = {
    'group.vehicles': { svg:'vehicles', c:'#0e8e8a', bg:'#e4f3f2' },
    'group.forsale':  { svg:'forsale',  c:'#e8568a', bg:'#fde6f0' },
    'group.services': { svg:'services', c:'#c98a12', bg:'#f8efd9' },
    'group.property': { svg:'property', c:'#0a6b68', bg:'#e1efee' },
    'group.pets':     { svg:'pets',     c:'#d63e75', bg:'#fce3ec' },
    'group.jobs':     { svg:'jobs',     c:'#16847f', bg:'#e2f1f0' },
    'group.community':{ svg:'community', c:'#b9791a', bg:'#f7edda' }
  };

  /* ---- Gumtree-style illustrated category tiles (homepage headline grid) ---- */
  function renderCatTiles(){
    const wrap = $('#catTiles'); if(!wrap) return;
    wrap.innerHTML = GROUPS().map(g => {
      const m = GROUP_META[g.key] || { svg:'forsale', c:'#0e8e8a', bg:'#e4f3f2' };
      const label = I18nStore.get(g.key)!==g.key ? I18nStore.get(g.key) : g.group;
      return `
        <a class="cat-tile" href="browse.html?group=${slug(g.key)}" style="--c:${m.c};--tint:${m.bg}">
          <span class="cat-tile__ic">${SVG[m.svg]||''}</span>
          <span class="cat-tile__label">${label}</span>
        </a>`;
    }).join('');
  }

  function GROUPS(){ return window.Store ? Store.getGroups() : (typeof CATEGORY_GROUPS!=='undefined'?CATEGORY_GROUPS:[]); }
  function catLabel(c){ return window.Store ? Store.catName(c) : (I18nStore.get(c.key)||c.id); }

  /* ---- Gumtree-style homepage browser: left rail + flyout + ad ---- */
  let activeGroup = 0;
  function renderCatBrowser(){
    const rail = $('#catRail'), panel = $('#catPanel');
    if(!rail || !panel) return;
    const groups = GROUPS();

    rail.innerHTML = groups.map((g, i) => `
      <button class="cat-rail__item${i===activeGroup?' active':''}" data-group="${i}" type="button">
        <span class="ic">${GROUP_ICON[g.key]||'📦'}</span>
        <span data-i18n="${g.key}">${I18nStore.get(g.key)}</span>
        <span class="arrow">›</span>
      </button>`).join('');

    function paint(i){
      const g = groups[i];
      panel.innerHTML = `
        <div class="cat-panel__head">
          <div class="cat-panel__title">${I18nStore.get(g.key)!==g.key?I18nStore.get(g.key):g.group}</div>
          <a href="browse.html?group=${slug(g.key)}" class="cat-panel__all">${I18nStore.get('cat.viewall')} ›</a>
        </div>
        <div class="cat-panel__grid">
          ${g.categories.map((c, idx) => `
            <a href="browse.html?cat=${c.id}" class="cat-flink" style="--i:${idx}">
              <span class="ic">${c.icon||'•'}</span>
              <span>${catLabel(c)}</span>
            </a>`).join('')}
        </div>`;
    }
    paint(activeGroup);

    $$('.cat-rail__item', rail).forEach(btn => {
      const i = +btn.dataset.group;
      const activate = () => {
        activeGroup = i;
        $$('.cat-rail__item', rail).forEach(b => b.classList.toggle('active', b===btn));
        paint(i);
      };
      btn.addEventListener('mouseenter', activate);
      btn.addEventListener('click', activate);
      btn.addEventListener('focus', activate);
    });
  }

  /* ---- Gumtree-style nav mega menu (all groups across & down) ---- */
  function renderMegaMenu(){
    const mega = $('#megaPanel'); if(!mega) return;
    mega.innerHTML = `
      <div class="mega__grid">
        ${GROUPS().map(g => `
          <div class="mega__group">
            <a class="mega__group-title" href="browse.html?group=${slug(g.key)}">
              <span>${GROUP_ICON[g.key]||'📦'}</span>
              <span>${I18nStore.get(g.key)!==g.key?I18nStore.get(g.key):g.group}</span>
            </a>
            ${g.categories.slice(0,6).map(c => `
              <a href="browse.html?cat=${c.id}" class="mega__link">
                <span class="ic">${c.icon||'•'}</span>
                <span>${catLabel(c)}</span>
              </a>`).join('')}
            ${g.categories.length>6 ? `<a href="browse.html?group=${slug(g.key)}" class="mega__link" style="color:var(--green)">+${g.categories.length-6} ${I18nStore.get('cat.more')||'more'}</a>`:''}
          </div>`).join('')}
      </div>
      <div class="mega__foot">
        <span style="color:var(--grey-1);font-size:.86rem">${I18nStore.get('cat.sub')}</span>
        <a href="browse.html">${I18nStore.get('cat.viewall')} →</a>
      </div>`;
  }

  /* ---- keep old name working for any callers ---- */
  function renderCategories(){ renderCatTiles(); renderCatBrowser(); renderMegaMenu(); }

  /* ---- card template ---- */
  function cardHTML(l, i = 0){
    const t = l.title[I18nStore.lang] || l.title.en;
    const loc = l.loc[I18nStore.lang] || l.loc.en;
    const days = I18nStore.lang === 'bn' ? toBnNum(l.days) : l.days;
    const ago = I18nStore.lang === 'bn' ? `${days} দিন আগে` : `${days}d ago`;
    return `
      <article class="card" data-id="${l.id}" style="--i:${i % 8}" tabindex="0">
        <div class="card__media">
          <img src="${(l.imgs && l.imgs[0]) || l.img}" alt="${t}" loading="lazy">
          <div class="card__shine"></div>
          ${l.featured ? `<span class="card__badge" data-i18n="feat.featured">${I18nStore.get('feat.featured')}</span>`:''}
          ${l.video ? `<span class="card__videoflag">▶</span>`:''}
          <button class="card__fav" aria-label="Save">♡</button>
          <span class="card__view"><span data-i18n="feat.view">View details</span> →</span>
        </div>
        <div class="card__body">
          <div class="card__price" data-price="${l.price}">${I18nStore.fmtPrice(l.price)}</div>
          <div class="card__title">${t}</div>
          <div class="card__meta">
            <span class="card__loc">📍 ${loc}</span>
            <span>${ago}</span>
          </div>
        </div>
      </article>`;
  }
  function currentUserName(){
    try { return (window.AmaarAuth && AmaarAuth.currentUser() && AmaarAuth.currentUser().username) || '_guest'; }
    catch(e){ return '_guest'; }
  }
  function setFavBtn(btn, on){ btn.classList.toggle('on', on); btn.textContent = on ? '♥' : '♡'; }
  function wireCards(scope){
    $$('.card', scope).forEach(c => {
      reveal(c);
      const id = c.dataset.id;
      const fav = c.querySelector('.card__fav');
      if(fav && window.Store){
        setFavBtn(fav, Store.isFavorite(currentUserName(), id));
        fav.addEventListener('click', (e) => {
          e.stopPropagation();
          const now = Store.toggleFavorite(currentUserName(), id);
          setFavBtn(fav, now);
        });
      }
      const open = () => openListing(id);
      c.addEventListener('click', open);
      c.addEventListener('keydown', (e) => { if(e.key==='Enter'){ e.preventDefault(); open(); }});
    });
  }

  /* ---- listing detail modal (injected once, reused on every page) ---- */
  let ldVideoURL = null;
  function ensureListingModal(){
    if($('#listingDetail')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = `
<div class="modal" id="listingDetail" aria-hidden="true">
  <div class="modal__overlay" data-ld-close></div>
  <div class="modal__panel modal__panel--listing">
    <button class="modal__close" data-ld-close aria-label="Close">✕</button>
    <div class="ld__grid">
      <div class="ld__gallery">
        <div class="ld__main" id="ldMain"></div>
        <div class="ld__thumbs" id="ldThumbs"></div>
        <span id="ldBadge" class="card__badge" style="display:none" data-i18n="feat.featured">Featured</span>
      </div>
      <div class="ld__body">
        <div class="ld__top">
          <div class="ld__price" id="ldPrice"></div>
          <button class="ld__fav" id="ldFav" type="button" aria-label="Save to favourites">♡</button>
        </div>
        <h3 class="ld__title" id="ldTitle"></h3>
        <div class="ld__meta">
          <span id="ldLoc"></span>
          <span id="ldCat" class="ld__chip"></span>
          <span id="ldDays" class="ld__days"></span>
        </div>
        <h4 class="ld__dh" id="ldDescHead" style="display:none" data-i18n="ld.description">Description</h4>
        <p class="ld__desc" id="ldDesc"></p>
        <div class="ld__contact">
          <h4 data-i18n="ld.contact">Contact seller</h4>
          <div class="ld__actions">
            <button id="ldPhoneBtn" class="btn btn--primary" type="button"><span data-i18n="ld.show_phone">📞 Show phone number</span></button>
            <a id="ldPhoneLink" class="btn btn--primary" style="display:none"></a>
            <a id="ldEmail" class="btn btn--outline" data-i18n="ld.email_seller">✉️ Email seller</a>
          </div>
          <div class="ld__safety">🛡️ <span data-i18n="ld.safety">Tip: meet in a public place and inspect items before paying.</span></div>
        </div>
      </div>
    </div>
  </div>
</div>`;
    document.body.appendChild(wrap.firstElementChild);
    $$('[data-ld-close]').forEach(b => b.addEventListener('click', closeListing));
    document.addEventListener('keydown', (e) => { if(e.key==='Escape') closeListing(); });
  }
  function closeListing(){
    const m = $('#listingDetail'); if(!m) return;
    m.classList.remove('open'); m.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    if(ldVideoURL){ URL.revokeObjectURL(ldVideoURL); ldVideoURL = null; }
    const main = $('#ldMain'); if(main) main.innerHTML='';
  }
  function buildGallery(l, title){
    const main = $('#ldMain'), thumbs = $('#ldThumbs');
    const imgs = (l.imgs && l.imgs.length) ? l.imgs : (l.img ? [l.img] : []);
    thumbs.innerHTML = '';
    const showImg = (src) => { main.innerHTML = `<img src="${src}" alt="${title}">`; };
    const setActive = (btn) => $$('.ld__thumb', thumbs).forEach(b => b.classList.toggle('active', b===btn));
    imgs.forEach((src, i) => {
      const b = document.createElement('button');
      b.type='button'; b.className = 'ld__thumb' + (i===0?' active':'');
      b.innerHTML = `<img src="${src}" alt="">`;
      b.addEventListener('click', () => { setActive(b); showImg(src); });
      thumbs.appendChild(b);
    });
    if(imgs.length) showImg(imgs[0]); else main.innerHTML = '';
    // video thumb (loaded async from IndexedDB)
    if(l.video && window.Store){
      Store.getVideo(l.id).then(blob => {
        if(!blob) return;
        if(ldVideoURL) URL.revokeObjectURL(ldVideoURL);
        ldVideoURL = URL.createObjectURL(blob);
        const b = document.createElement('button');
        b.type='button'; b.className='ld__thumb ld__thumb--video'; b.innerHTML='▶';
        b.addEventListener('click', () => { setActive(b); main.innerHTML = `<video src="${ldVideoURL}" controls autoplay playsinline></video>`; });
        thumbs.appendChild(b);
      }).catch(()=>{});
    }
    thumbs.style.display = (imgs.length > 1 || l.video) ? 'flex' : 'none';
  }
  function openListing(id){
    ensureListingModal();
    const l = window.Store ? Store.getListing(id) : null;
    if(!l){ toast('Listing not found.'); return; }
    const lang = I18nStore.lang;
    const title = (l.title && (l.title[lang]||l.title.en)) || 'Listing';
    const loc = (l.loc && (l.loc[lang]||l.loc.en)) || '';
    const days = lang==='bn' ? toBnNum(l.days||0) : (l.days||0);
    buildGallery(l, title);
    $('#ldBadge').style.display = l.featured ? '' : 'none';
    $('#ldPrice').textContent = I18nStore.fmtPrice(l.price||0);
    $('#ldTitle').textContent = title;
    $('#ldLoc').textContent = '📍 ' + loc;
    $('#ldCat').textContent = window.Store ? Store.catNameById(l.cat) : l.cat;
    $('#ldDays').textContent = (lang==='bn' ? `${days} দিন আগে` : `${days}d ago`);
    $('#ldDesc').textContent = l.desc || '';
    $('#ldDesc').style.display = l.desc ? '' : 'none';
    $('#ldDescHead').style.display = l.desc ? '' : 'none';
    // favourite
    const favBtn = $('#ldFav');
    setFavBtn(favBtn, window.Store ? Store.isFavorite(currentUserName(), l.id) : false);
    favBtn.onclick = () => { const now = Store.toggleFavorite(currentUserName(), l.id); setFavBtn(favBtn, now); };
    // contact: phone hidden behind reveal button
    const phoneBtn = $('#ldPhoneBtn'), phoneLink = $('#ldPhoneLink');
    phoneLink.style.display = 'none';
    if(l.phone){
      phoneBtn.style.display = ''; phoneBtn.disabled = false;
      phoneBtn.onclick = () => {
        phoneBtn.style.display = 'none';
        phoneLink.style.display = '';
        phoneLink.textContent = '📞 ' + l.phone;
        phoneLink.href = 'tel:' + l.phone;
      };
    } else {
      phoneBtn.style.display = 'none';
      phoneLink.style.display = '';
      phoneLink.textContent = t('ld.no_phone','Phone number not provided.');
      phoneLink.removeAttribute('href');
    }
    const emailBtn = $('#ldEmail');
    if(l.email){ emailBtn.style.display=''; emailBtn.href = 'mailto:'+l.email+'?subject='+encodeURIComponent('Interested in: '+title); }
    else emailBtn.style.display='none';
    $('#listingDetail').classList.add('open');
    $('#listingDetail').setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    I18nStore.apply();
  }

  /* ---- featured on homepage ---- */
  function renderFeatured(){
    const grid = $('#featGrid'); if(!grid) return;
    const all = window.Store ? Store.getListings() : (typeof LISTINGS!=='undefined'?LISTINGS:[]);
    const featured = all.filter(l => l.featured);
    const items = featured.concat(all.filter(l=>!l.featured)).slice(0, 8);
    grid.innerHTML = items.length ? items.map(cardHTML).join('')
      : `<div class="browse-empty">${I18nStore.get('browse.empty')||'No listings yet.'}</div>`;
    wireCards(grid);
  }

  /* ---- browse page ---- */
  function initBrowse(){
    const grid = $('#browseGrid'); if(!grid) return;
    const params = new URLSearchParams(location.search);
    const f = {
      cat: params.get('cat') || '',
      group: params.get('group') || '',
      q: (params.get('q') || '').toLowerCase(),
      fav: params.get('fav') === '1',
      min: 0, max: Infinity, loc: (params.get('loc') || '').toLowerCase(), sort: 'new'
    };
    const catSel = $('#fCat'), minI = $('#fMin'), maxI = $('#fMax'), locI = $('#fLoc'), sortSel = $('#fSort'), favChk = $('#fFav');
    if(catSel && f.cat) catSel.value = f.cat;
    if(locI && f.loc) locI.value = params.get('loc');
    if(favChk) favChk.checked = f.fav;

    function render(){
      const data = window.Store ? Store.getListings() : (typeof LISTINGS!=='undefined'?LISTINGS:[]);
      const favs = (f.fav && window.Store) ? Store.getFavorites(currentUserName()) : null;
      let items = data.filter(l => {
        if(f.fav && favs && favs.indexOf(String(l.id)) === -1) return false;
        if(f.cat && l.cat !== f.cat) return false;
        if(f.group){ const g = l.group || (window.Store && Store.findGroupOfCat(l.cat)); if(g !== f.group) return false; }
        if(f.q){ const hay = (l.title.en+' '+l.title.bn+' '+l.loc.en+' '+l.loc.bn).toLowerCase(); if(!hay.includes(f.q)) return false; }
        if(l.price < f.min || l.price > f.max) return false;
        if(f.loc){ const hay = (l.loc.en+' '+l.loc.bn).toLowerCase(); if(!hay.includes(f.loc)) return false; }
        return true;
      });
      if(f.sort==='low') items.sort((a,b)=>a.price-b.price);
      else if(f.sort==='high') items.sort((a,b)=>b.price-a.price);
      else items.sort((a,b)=>a.days-b.days);

      const count = $('#browseCount');
      if(count){ const n = I18nStore.lang==='bn'?toBnNum(items.length):items.length; count.innerHTML = `<b>${n}</b> <span data-i18n="browse.results">${I18nStore.get('browse.results')}</span>`; }
      grid.innerHTML = items.length ? items.map(cardHTML).join('')
        : `<div class="browse-empty" data-i18n="browse.empty">${I18nStore.get('browse.empty')}</div>`;
      wireCards(grid);
    }
    $('#applyFilters')?.addEventListener('click', () => {
      f.cat = catSel.value; f.group = ''; f.min = +minI.value||0; f.max = +maxI.value||Infinity;
      f.loc = (locI.value||'').toLowerCase(); f.sort = sortSel.value; f.fav = !!(favChk && favChk.checked); render();
    });
    $('#resetFilters')?.addEventListener('click', () => {
      catSel.value=''; minI.value=''; maxI.value=''; locI.value=''; sortSel.value='new';
      if(favChk) favChk.checked=false;
      f.cat=f.loc=f.group=''; f.fav=false; f.min=0; f.max=Infinity; f.sort='new'; render();
    });
    favChk?.addEventListener('change', () => { f.fav = favChk.checked; render(); });
    sortSel?.addEventListener('change', () => { f.sort = sortSel.value; render(); });
    document.addEventListener('langchange', render);
    if(window.Store) Store.on(render);
    render();
  }

  /* ---- search bar (home) ---- */
  function initSearch(){
    const form = $('#heroSearch'); if(!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = $('#heroQuery').value.trim();
      const loc = ($('#heroLoc')?.value||'').trim();
      const params = new URLSearchParams();
      if(q) params.set('q', q);
      if(loc && !/^all\b/i.test(loc)) params.set('loc', loc);
      const qs = params.toString();
      location.href = 'browse.html' + (qs ? ('?'+qs) : '');
    });
  }

  /* ---- geolocation + city picker (shared) ---- */
  function nearestCity(lat,lng){
    if(typeof BD_CITY_COORDS === 'undefined') return 'Dhaka';
    let best='Dhaka', bd=Infinity;
    Object.keys(BD_CITY_COORDS).forEach(city => {
      const [clat,clng]=BD_CITY_COORDS[city];
      const d=(clat-lat)*(clat-lat)+(clng-lng)*(clng-lng);
      if(d<bd){ bd=d; best=city; }
    });
    return best;
  }
  function initGeo(){
    if(typeof BD_CITIES !== 'undefined' && !$('#cityList')){
      const dl=document.createElement('datalist'); dl.id='cityList';
      dl.innerHTML = BD_CITIES.map(c=>`<option value="${c}"></option>`).join('');
      document.body.appendChild(dl);
    }
    $$('[data-citylist]').forEach(inp => inp.setAttribute('list','cityList'));
    $$('[data-geo]').forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.dataset.target ? $(btn.dataset.target) : null;
      if(!('geolocation' in navigator)){ toast(t('geo.unsupported','Location not supported here.')); return; }
      btn.classList.add('is-loading'); btn.disabled = true;
      navigator.geolocation.getCurrentPosition(pos => {
        btn.classList.remove('is-loading'); btn.disabled = false;
        const city = nearestCity(pos.coords.latitude, pos.coords.longitude);
        if(target){ target.value = city; target.dispatchEvent(new Event('input',{bubbles:true})); }
        toast(t('geo.found','Nearest city: ')+city);
      }, () => {
        btn.classList.remove('is-loading'); btn.disabled = false;
        toast(t('geo.denied','Couldn’t detect location — pick a city.'));
      }, { timeout: 8000, enableHighAccuracy:false });
    }));
  }

  /* ---- post page ---- */
  const TIER_PRICE = { free:0, featured:299, premium:599 };
  const GROUP_IMG = {
    vehicles:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
    forsale:'https://images.unsplash.com/photo-1513708927688-890fe41c2748?w=600&q=80',
    property:'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80',
    services:'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80',
    pets:'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&q=80',
    jobs:'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
    community:'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=600&q=80'
  };
  let currentTier = 'free';
  let uploadedImgs = [];
  let uploadedVideoFile = null;
  let lastListing = null;

  /* read + downscale an image file to a compact JPEG data URL */
  function fileToScaledDataURL(file, maxW = 1100, quality = 0.72){
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => {
        const img = new Image();
        img.onload = () => {
          const scale = Math.min(1, maxW / img.width);
          const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
          const c = document.createElement('canvas'); c.width = w; c.height = h;
          c.getContext('2d').drawImage(img, 0, 0, w, h);
          try { resolve(c.toDataURL('image/jpeg', quality)); } catch(e){ resolve(r.result); }
        };
        img.onerror = () => resolve(r.result);
        img.src = r.result;
      };
      r.onerror = reject;
      r.readAsDataURL(file);
    });
  }

  function gatherPost(){
    const err = $('#postError');
    const fail = (m) => { if(err) err.textContent = m; else toast(m); return null; };
    if(err) err.textContent = '';
    const title=($('#pTitle')?.value||'').trim();
    const cat=$('#postCat')?.value||'';
    const price=+($('#pPrice')?.value)||0;
    const desc=($('#pDesc')?.value||'').trim();
    const loc=($('#pLoc')?.value||'').trim();
    const email=($('#pEmail')?.value||'').trim();
    const phone=($('#pPhone')?.value||'').replace(/\s/g,'');
    if(!title) return fail(t('post.err_title','Please enter an ad title.'));
    if(!cat) return fail(t('post.err_cat','Please choose a category.'));
    if(!loc) return fail(t('post.err_loc','Please enter a location.'));
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(t('post.err_email','Enter a valid email for confirmation.'));
    if(!/^01\d{9}$/.test(phone)) return fail(t('post.err_phone','Enter a valid 11-digit mobile number (01XXXXXXXXX).'));
    const group = window.Store ? Store.findGroupOfCat(cat) : '';
    const imgs = uploadedImgs.length ? uploadedImgs.slice() : [GROUP_IMG[group] || GROUP_IMG.forsale];
    return { title:{en:title,bn:title}, cat, group, price, desc, loc:{en:loc,bn:loc}, email, phone,
             imgs, img: imgs[0], video: !!uploadedVideoFile, days:0 };
  }

  function publishAd(data, tier){
    const listing = Store.addListing(Object.assign({}, data, { featured: tier!=='free', tier }));
    lastListing = listing;
    // persist video (if any) to IndexedDB, keyed by the new listing id
    if(uploadedVideoFile && window.Store){
      Store.putVideo(listing.id, uploadedVideoFile)
        .then(() => Store.updateListing(listing.id, { video: true }))
        .catch(() => Store.updateListing(listing.id, { video: false }));
    }
    const tierName = {free:'Basic (Free)',featured:'Featured',premium:'Premium'}[tier]||tier;
    const ref = 'AB-'+listing.id;
    const body =
      'Hi,\n\nThanks for posting on AmaarBazaar — your ad is now live!\n\n'+
      '• Title: '+data.title.en+'\n'+
      '• Reference: '+ref+'\n'+
      '• Category: '+(Store.catNameById(data.cat))+'\n'+
      '• Price: ৳'+(data.price||0).toLocaleString()+'\n'+
      '• Location: '+data.loc.en+'\n'+
      '• Plan: '+tierName+'\n\n'+
      'Buyers can now find and contact you. You can manage this ad from your account.\n\n— Team AmaarBazaar';
    Store.sendEmail(data.email, 'Your ad is live on AmaarBazaar ('+ref+')', body);
    return listing;
  }

  function showPostSuccess(listing, data){
    const m = $('#postSuccess'); if(!m){ toast('Ad published! 🎉'); return; }
    $('#psTitle').textContent = data.title.en;
    $('#psRef').textContent = 'AB-'+listing.id;
    $('#psEmail').textContent = data.email;
    const view = $('#psView');
    if(view){ view.href = '#'; view.onclick = (e) => { e.preventDefault(); closePostSuccess(); openListing(listing.id); }; }
    m.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closePostSuccess(){ const m=$('#postSuccess'); if(m){ m.classList.remove('open'); document.body.style.overflow=''; } }

  function renderPostPreview(){
    const wrap = $('#postPreview'); if(!wrap) return;
    let html = uploadedImgs.map((src,i) => `<div class="pp-thumb"><img src="${src}" alt="photo ${i+1}"></div>`).join('');
    if(uploadedVideoFile) html += `<div class="pp-thumb pp-thumb--video">🎬<span>${escapeHtmlA(uploadedVideoFile.name)}</span></div>`;
    wrap.innerHTML = html;
    wrap.style.display = html ? 'flex' : 'none';
  }
  function escapeHtmlA(s){ const d=document.createElement('div'); d.textContent=s==null?'':s; return d.innerHTML; }
  function resetDropzone(dz){
    uploadedImgs = []; uploadedVideoFile = null;
    const pv = $('#postPreview'); if(pv){ pv.innerHTML=''; pv.style.display='none'; }
    const vz = $('#videozone'); if(vz){ const p=vz.querySelector('p'); if(p){ p.setAttribute('data-i18n','post.f_video_hint'); } }
    if(dz){ const p=dz.querySelector('p'); if(p){ p.setAttribute('data-i18n','post.f_photo_hint'); } }
    I18nStore.apply();
  }

  function initPost(){
    const form = $('#postForm'); if(!form) return;
    $$('.tier').forEach(ti => ti.addEventListener('click', () => {
      $$('.tier').forEach(x => x.classList.remove('sel'));
      ti.classList.add('sel');
      currentTier = ti.dataset.tier;
      updateSubmitLabel();
    }));
    function updateSubmitLabel(){
      const btn = $('#postSubmit'); if(!btn) return;
      const key = TIER_PRICE[currentTier] > 0 ? 'post.submit_paid' : 'post.submit';
      btn.setAttribute('data-i18n', key);
      btn.textContent = I18nStore.get(key);
    }
    $('#pPhone')?.addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g,'').slice(0,11); });
    const dz = $('#dropzone'), fileIn = $('#photoInput');
    dz?.addEventListener('click', () => fileIn.click());
    fileIn?.addEventListener('change', async () => {
      const files = [...fileIn.files].slice(0, 8);
      if(!files.length) return;
      const p = dz.querySelector('p');
      p.textContent = '⏳ ' + t('post.processing_imgs','Processing photos…');
      uploadedImgs = [];
      for(const f of files){ try{ uploadedImgs.push(await fileToScaledDataURL(f)); }catch(e){} }
      renderPostPreview(dz);
      p.textContent = `${uploadedImgs.length} ` + t('post.photos_added','photo(s) added ✓');
    });
    // video
    const videoIn = $('#videoInput'), videoZone = $('#videozone');
    videoZone?.addEventListener('click', () => videoIn.click());
    videoIn?.addEventListener('change', () => {
      const f = videoIn.files[0];
      const note = videoZone?.querySelector('p');
      if(!f){ uploadedVideoFile = null; return; }
      if(f.size > 12 * 1024 * 1024){ toast(t('post.video_big','Video too large — max 12 MB.')); videoIn.value=''; uploadedVideoFile=null; return; }
      uploadedVideoFile = f;
      if(note) note.textContent = '🎬 ' + f.name;
      renderPostPreview(dz);
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = gatherPost(); if(!data) return;
      pendingPost = data;
      if(TIER_PRICE[currentTier] > 0){
        openPayment(TIER_PRICE[currentTier], currentTier);
      } else {
        const listing = publishAd(data, 'free');
        showPostSuccess(listing, data);
        form.reset(); resetDropzone(dz);
      }
    });
    $('#psClose')?.addEventListener('click', closePostSuccess);
    $('#psAnother')?.addEventListener('click', closePostSuccess);
    $('#postSuccess .modal__overlay')?.addEventListener('click', closePostSuccess);
    document.addEventListener('langchange', updateSubmitLabel);
    updateSubmitLabel();
  }

  /* ===================  PAYMENT FLOW  =================== */
  let payAmount = 0, payMethod = 'bkash';
  function openPayment(amount, tier){
    payAmount = amount;
    $('#paySummaryItem').textContent = (I18nStore.lang==='bn'
      ? ({featured:'ফিচার্ড আপগ্রেড',premium:'প্রিমিয়াম আপগ্রেড'}[tier]||'আপগ্রেড')
      : ({featured:'Featured upgrade',premium:'Premium upgrade'}[tier]||'Upgrade'));
    $('#paySummaryAmt').setAttribute('data-price', amount);
    $('#payTotalAmt').setAttribute('data-price', amount);
    $('#payModal').classList.add('open');
    $('#payForm').style.display='';
    $('#paySuccess').style.display='none';
    I18nStore.apply();
    document.body.style.overflow='hidden';
  }
  function closePayment(){
    $('#payModal').classList.remove('open');
    document.body.style.overflow='';
  }
  function initPaymentModal(){
    if(!$('#payModal')) return;
    $('#payClose')?.addEventListener('click', closePayment);
    $('#payModal .modal__overlay')?.addEventListener('click', closePayment);

    $$('.pay-method').forEach(m => m.addEventListener('click', () => {
      $$('.pay-method').forEach(x => x.classList.remove('sel'));
      m.classList.add('sel');
      payMethod = m.dataset.method;
      $('#mobileFields').style.display = payMethod==='card' ? 'none' : '';
      $('#cardFields').style.display = payMethod==='card' ? '' : 'none';
    }));

    // input formatting
    $('#cardNum')?.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g,'').slice(0,16);
      e.target.value = v.replace(/(.{4})/g,'$1 ').trim();
    });
    $('#cardExp')?.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g,'').slice(0,4);
      e.target.value = v.length>2 ? v.slice(0,2)+'/'+v.slice(2) : v;
    });
    $('#payMobile')?.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g,'').slice(0,11);
    });

    $('#payForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      // basic validation
      if(payMethod !== 'card'){
        const m = $('#payMobile').value;
        if(m.length !== 11){ toast(I18nStore.lang==='bn'?'সঠিক মোবাইল নম্বর দিন':'Enter a valid mobile number'); return; }
      } else {
        if($('#cardNum').value.replace(/\s/g,'').length < 16){ toast(I18nStore.lang==='bn'?'সঠিক কার্ড নম্বর দিন':'Enter a valid card number'); return; }
      }
      const btn = $('#payBtn');
      const orig = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner"></span> <span data-i18n="pay.processing">${I18nStore.get('pay.processing')}</span>`;
      // Simulated gateway round-trip. Replace with real bKash/Stripe call.
      setTimeout(() => {
        // Payment cleared → persist the ad and send the email confirmation.
        if(pendingPost && window.Store){
          const listing = publishAd(pendingPost, currentTier);
          const note = $('#paySuccessEmail');
          if(note) note.textContent = t('pay.email_sent','A confirmation email was sent to ')+pendingPost.email;
        }
        $('#payForm').style.display='none';
        $('#paySuccess').style.display='block';
        btn.disabled = false; btn.innerHTML = orig;
      }, 1600);
    });
    $('#paySuccessBtn')?.addEventListener('click', () => {
      closePayment();
      const form = $('#postForm');
      if(form){ form.reset(); resetDropzone($('#dropzone')); }
      const id = lastListing && lastListing.id;
      pendingPost = null;
      if(id) openListing(id); else window.location.href = 'browse.html';
    });
  }

  /* ---- toast ---- */
  let toastTimer;
  function toast(msg){
    let el = $('#toast');
    if(!el){ el = document.createElement('div'); el.id='toast'; el.className='toast'; document.body.appendChild(el); }
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---- splash screen ---- */
  function hideSplash(){
    const splash = $('#splash');
    if(splash) setTimeout(() => splash.classList.add('hide'), 400);
  }

  /* ---- re-render dynamic content on language change ---- */
  document.addEventListener('langchange', () => {
    populateCategorySelects(); renderCategories(); renderFeatured();
  });

  /* ---- boot ---- */
  document.addEventListener('DOMContentLoaded', () => {
    initLang(); populateCategorySelects(); initNav(); renderCategories(); renderFeatured();
    initReveal(); initCounters(); initSearch(); initGeo();
    initBrowse(); initPost(); initPaymentModal(); ensureListingModal();
    // keep every screen in sync when the store changes (admin edits, new posts, etc.)
    if(window.Store) Store.on(() => { populateCategorySelects(); renderCategories(); renderFeatured(); });
    // re-apply translations to freshly rendered nodes
    I18nStore.apply();
    hideSplash();
  });
})();
