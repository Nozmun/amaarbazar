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
  function renderCategories(){ renderCatBrowser(); renderMegaMenu(); }

  /* ---- card template ---- */
  function cardHTML(l, i = 0){
    const t = l.title[I18nStore.lang] || l.title.en;
    const loc = l.loc[I18nStore.lang] || l.loc.en;
    const days = I18nStore.lang === 'bn' ? toBnNum(l.days) : l.days;
    const ago = I18nStore.lang === 'bn' ? `${days} দিন আগে` : `${days}d ago`;
    return `
      <article class="card" data-id="${l.id}" style="--i:${i % 8}">
        <div class="card__media">
          <img src="${l.img}" alt="${t}" loading="lazy">
          ${l.featured ? `<span class="card__badge" data-i18n="feat.featured">${I18nStore.get('feat.featured')}</span>`:''}
          <button class="card__fav" aria-label="Save">♡</button>
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
  function wireCards(scope){
    $$('.card__fav', scope).forEach(b => b.addEventListener('click', (e) => {
      e.stopPropagation(); b.classList.toggle('on');
      b.textContent = b.classList.contains('on') ? '♥' : '♡';
    }));
    $$('.card', scope).forEach(c => {
      reveal(c);
      c.addEventListener('click', () => {
        toast(I18nStore.lang==='bn' ? 'বিজ্ঞাপন খোলা হচ্ছে…' : 'Opening listing…');
      });
    });
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
      min: 0, max: Infinity, loc: (params.get('loc') || '').toLowerCase(), sort: 'new'
    };
    const catSel = $('#fCat'), minI = $('#fMin'), maxI = $('#fMax'), locI = $('#fLoc'), sortSel = $('#fSort');
    if(catSel && f.cat) catSel.value = f.cat;
    if(locI && f.loc) locI.value = params.get('loc');

    function render(){
      const data = window.Store ? Store.getListings() : (typeof LISTINGS!=='undefined'?LISTINGS:[]);
      let items = data.filter(l => {
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
      f.loc = (locI.value||'').toLowerCase(); f.sort = sortSel.value; render();
    });
    $('#resetFilters')?.addEventListener('click', () => {
      catSel.value=''; minI.value=''; maxI.value=''; locI.value=''; sortSel.value='new';
      f.cat=f.loc=f.group=''; f.min=0; f.max=Infinity; f.sort='new'; render();
    });
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
  let uploadedImg = null;
  let lastListing = null;

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
    if(!title) return fail(t('post.err_title','Please enter an ad title.'));
    if(!cat) return fail(t('post.err_cat','Please choose a category.'));
    if(!loc) return fail(t('post.err_loc','Please enter a location.'));
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(t('post.err_email','Enter a valid email for confirmation.'));
    const group = window.Store ? Store.findGroupOfCat(cat) : '';
    const img = uploadedImg || GROUP_IMG[group] || GROUP_IMG.forsale;
    return { title:{en:title,bn:title}, cat, group, price, desc, loc:{en:loc,bn:loc}, email, img, days:0 };
  }

  function publishAd(data, tier){
    const listing = Store.addListing(Object.assign({}, data, { featured: tier!=='free', tier }));
    lastListing = listing;
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
    $('#psView').href = 'browse.html?cat='+encodeURIComponent(data.cat);
    m.classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closePostSuccess(){ const m=$('#postSuccess'); if(m){ m.classList.remove('open'); document.body.style.overflow=''; } }

  function resetDropzone(dz){ if(dz){ const p=dz.querySelector('p'); if(p){ p.setAttribute('data-i18n','post.f_photo_hint'); I18nStore.apply(); } } }

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
    const dz = $('#dropzone'), fileIn = $('#photoInput');
    dz?.addEventListener('click', () => fileIn.click());
    fileIn?.addEventListener('change', () => {
      if(fileIn.files.length){
        dz.querySelector('p').textContent = `${fileIn.files.length} photo(s) added ✓`;
        const r = new FileReader();
        r.onload = (ev) => { uploadedImg = ev.target.result; };
        r.readAsDataURL(fileIn.files[0]);
      }
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
        form.reset(); uploadedImg = null; resetDropzone(dz);
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
      if(form){ form.reset(); uploadedImg = null; resetDropzone($('#dropzone')); }
      const dest = lastListing ? ('browse.html?cat='+encodeURIComponent(lastListing.cat)) : 'browse.html';
      pendingPost = null;
      window.location.href = dest;
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
    renderCategories(); renderFeatured();
  });

  /* ---- boot ---- */
  document.addEventListener('DOMContentLoaded', () => {
    initLang(); populateCategorySelects(); initNav(); renderCategories(); renderFeatured();
    initReveal(); initCounters(); initSearch(); initGeo();
    initBrowse(); initPost(); initPaymentModal();
    // keep every screen in sync when the store changes (admin edits, new posts, etc.)
    if(window.Store) Store.on(() => { populateCategorySelects(); renderCategories(); renderFeatured(); });
    // re-apply translations to freshly rendered nodes
    I18nStore.apply();
    hideSplash();
  });
})();
