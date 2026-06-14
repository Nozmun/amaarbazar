// AmaarBazaar — interactions, rendering, animations, payment flow
(function(){
  'use strict';
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  /* ---- language toggle ---- */
  function initLang(){
    I18nStore.apply();
    $$('[data-lang-toggle]').forEach(btn =>
      btn.addEventListener('click', () => I18nStore.toggle()));
  }

  /* ---- populate category dropdowns ---- */
  function populateCategorySelects(){
    const selects = ['#fCat', '#postCat'];
    selects.forEach(selector => {
      const select = $(selector);
      if(!select) return;
      select.innerHTML = `<option value="" data-i18n="browse.all">${I18nStore.get('browse.all')}</option>`;
      CATEGORY_GROUPS.forEach(group => {
        const optgroup = document.createElement('optgroup');
        optgroup.label = I18nStore.get(group.key);
        group.categories.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.id;
          option.textContent = I18nStore.get(cat.key);
          option.setAttribute('data-i18n', cat.key);
          optgroup.appendChild(option);
        });
        select.appendChild(optgroup);
      });
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

  /* ---- render categories ---- */
  function renderCategories(){
    const grid = $('#catGrid'); if(!grid) return;
    let cardIndex = 0;
    grid.innerHTML = CATEGORY_GROUPS.map((group, gidx) => `
      <div class="cat-group">
        <h3 class="cat-group__title" data-i18n="${group.key}">${I18nStore.get(group.key)}</h3>
        <div class="cat-group__items">
          ${group.categories.map((c) => {
            const style = `--i:${cardIndex % 8}`;
            cardIndex++;
            return `<a href="browse.html?cat=${c.id}" class="cat-card" style="${style}">
              <div class="cat-card__icon">${c.icon}</div>
              <div class="cat-card__name" data-i18n="${c.key}">${I18nStore.get(c.key)}</div>
            </a>`;
          }).join('')}
        </div>
      </div>`).join('');
    $$('.cat-card', grid).forEach(reveal);
  }

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
    const items = LISTINGS.filter(l => l.featured).concat(LISTINGS.filter(l=>!l.featured)).slice(0,8);
    grid.innerHTML = items.map(cardHTML).join('');
    wireCards(grid);
  }

  /* ---- browse page ---- */
  function initBrowse(){
    const grid = $('#browseGrid'); if(!grid) return;
    const params = new URLSearchParams(location.search);
    const f = {
      cat: params.get('cat') || '',
      q: (params.get('q') || '').toLowerCase(),
      min: 0, max: Infinity, loc: '', sort: 'new'
    };
    const catSel = $('#fCat'), minI = $('#fMin'), maxI = $('#fMax'), locI = $('#fLoc'), sortSel = $('#fSort');
    if(catSel && f.cat) catSel.value = f.cat;

    function render(){
      let items = LISTINGS.filter(l => {
        if(f.cat && l.cat !== f.cat) return false;
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
      f.cat = catSel.value; f.min = +minI.value||0; f.max = +maxI.value||Infinity;
      f.loc = (locI.value||'').toLowerCase(); f.sort = sortSel.value; render();
    });
    $('#resetFilters')?.addEventListener('click', () => {
      catSel.value=''; minI.value=''; maxI.value=''; locI.value=''; sortSel.value='new';
      f.cat=f.loc=''; f.min=0; f.max=Infinity; f.sort='new'; render();
    });
    sortSel?.addEventListener('change', () => { f.sort = sortSel.value; render(); });
    document.addEventListener('langchange', render);
    render();
  }

  /* ---- search bar (home) ---- */
  function initSearch(){
    const form = $('#heroSearch'); if(!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = $('#heroQuery').value.trim();
      location.href = 'browse.html' + (q ? ('?q='+encodeURIComponent(q)) : '');
    });
  }

  /* ---- post page tiers ---- */
  const TIER_PRICE = { free:0, featured:299, premium:599 };
  let currentTier = 'free';
  function initPost(){
    const form = $('#postForm'); if(!form) return;
    $$('.tier').forEach(t => t.addEventListener('click', () => {
      $$('.tier').forEach(x => x.classList.remove('sel'));
      t.classList.add('sel');
      currentTier = t.dataset.tier;
      updateSubmitLabel();
    }));
    function updateSubmitLabel(){
      const btn = $('#postSubmit');
      const key = TIER_PRICE[currentTier] > 0 ? 'post.submit_paid' : 'post.submit';
      btn.setAttribute('data-i18n', key);
      btn.textContent = I18nStore.get(key);
    }
    const dz = $('#dropzone'), fileIn = $('#photoInput');
    dz?.addEventListener('click', () => fileIn.click());
    fileIn?.addEventListener('change', () => {
      if(fileIn.files.length){
        dz.querySelector('p').textContent = (I18nStore.lang==='bn'
          ? `${toBnNum(fileIn.files.length)} টি ছবি যুক্ত হয়েছে`
          : `${fileIn.files.length} photo(s) added`);
      }
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if(TIER_PRICE[currentTier] > 0){
        openPayment(TIER_PRICE[currentTier], currentTier);
      } else {
        toast(I18nStore.lang==='bn' ? 'বিজ্ঞাপন প্রকাশিত হয়েছে! 🎉' : 'Ad published! 🎉');
        form.reset();
        if(dz) dz.querySelector('p').setAttribute('data-i18n','post.f_photo_hint'), I18nStore.apply();
      }
    });
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
        $('#payForm').style.display='none';
        $('#paySuccess').style.display='block';
        btn.disabled = false; btn.innerHTML = orig;
      }, 1600);
    });
    $('#paySuccessBtn')?.addEventListener('click', () => {
      closePayment();
      $('#postForm')?.reset();
      toast(I18nStore.lang==='bn'?'বিজ্ঞাপন বুস্ট হয়েছে! 🚀':'Ad boosted & live! 🚀');
    });
  }

  /* ---- toast ---- */
  let toastTimer;
  function toast(msg){
    let t = $('#toast');
    if(!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
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
    initReveal(); initCounters(); initSearch();
    initBrowse(); initPost(); initPaymentModal();
    // re-apply translations to freshly rendered nodes
    I18nStore.apply();
    hideSplash();
  });
})();
