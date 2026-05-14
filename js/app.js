(function () {
  const grid = document.getElementById('listingsGrid');
  const emptyState = document.getElementById('emptyState');
  const resultCount = document.getElementById('resultCount');
  const fTabs = document.querySelectorAll('.ftab');
  const tabTriggers = document.querySelectorAll('[data-tab-trigger]');
  const modal = document.getElementById('propertyModal');
  const modalBody = document.getElementById('modalBody');

  const state = {
    type: 'all'
  };

  /* ---------- Render ---------- */
  function formatArea(n) { return n.toLocaleString() + ' 呎'; }
  function bedIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12h20"/><path d="M2 8v8m20-8v8"/><path d="M6 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg>';
  }
  function areaIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>';
  }
  function bathIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12h18v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3z"/><path d="M6 12V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2"/><path d="M5 18l-1 3M19 18l1 3"/></svg>';
  }

  function renderStars(n) {
    return '★'.repeat(n) + '☆'.repeat(Math.max(0, 5 - n));
  }

  function buildCard(item) {
    const stars = '★'.repeat(item.stars);
    const badges = [];
    badges.push(`<span class="badge badge-featured">${item.listingTypeLabel || (item.type === 'sale' ? '售盤' : '租盤')}</span>`);
    if (item.featured) badges.push('<span class="badge badge-vr">精選</span>');
    if (item.vr) badges.push(`<span class="badge badge-vr">
        <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="7" cy="12" r="3"/><circle cx="17" cy="12" r="3"/><path d="M10 12h4"/></svg>
        VR</span>`);
    return `
      <article class="card" data-id="${item.id}" tabindex="0" role="button" aria-label="${item.name}">
        <div class="card-img-wrap">
          <img src="${item.img}" alt="${item.name}" loading="lazy">
          <div class="card-badge">${badges.join('')}</div>
          <button class="card-fav" aria-label="加入收藏" onclick="event.stopPropagation(); this.classList.toggle('active');">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <div class="card-stars">${stars}</div>
        </div>
        <div class="card-body">
          <div class="card-refline">
            <span>物業編號：${item.referenceNo || item.id}</span>
            <span>更新：${item.updateDate || '今日'}</span>
          </div>
          <h3 class="card-name">${item.name}</h3>
          <p class="card-district">${item.districtArea}</p>
          <div class="card-main-data">
            <div>
              <span class="card-data-label">售價</span>
              <strong>${item.priceLabel}</strong>
            </div>
            <div>
              <span class="card-data-label">面積</span>
              <strong>${item.mainAreaLabel || ('實用 ' + formatArea(item.area))}</strong>
            </div>
          </div>
          <div class="card-specs">
            <span>${areaIcon()} 月供 ${item.mortgageLabel}</span>
            <span>${bedIcon()} ${item.bedroomsLabel}</span>
            <span>${bathIcon()} 座向 ${item.orientationLabel}</span>
          </div>
          <div class="card-sub-data">
            <span>呎價 ${item.pricePerSqftLabel}</span>
            <span>樓齡 ${item.buildingAgeLabel}</span>
          </div>
          <div class="card-bottom">
            <div class="card-agent">
              <img src="assets/leo-portrait.jpeg" class="agent-avatar" alt="">
              <div class="card-agent-info">
                <span class="card-agent-name">Leo N. H. Chui</span>
                <span class="card-agent-phone">6182 2429</span>
              </div>
            </div>
            <div class="card-price">${item.listingTypeLabel || ''}<span class="card-price-unit"> 廣告</span></div>
          </div>
        </div>
      </article>
    `;
  }

  function filterListings() {
    let list = state.type === 'all'
      ? [...window.LISTINGS]
      : window.LISTINGS.filter(i => i.type === state.type);
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return list;
  }

  function render() {
    const list = filterListings();
    if (list.length === 0) {
      grid.innerHTML = '';
      emptyState.hidden = false;
    } else {
      emptyState.hidden = true;
      grid.innerHTML = list.map(buildCard).join('');
    }
    const totalText = state.type === 'rent' ? '個出租樓盤' : state.type === 'sale' ? '個出售樓盤' : '個精選樓盤';
    resultCount.textContent = `現正展示 ${list.length.toLocaleString()} ${totalText}`;
    bindCards();
  }

  /* ---------- Modal ---------- */
  function openModal(id) {
    const item = window.LISTINGS.find(x => x.id === id);
    if (!item) return;
    const galleryItems = item.gallery || [item.img];
    const gallery = galleryItems.map((src, idx) => `
      <div${idx === 0 ? ' class="main"' : ''}>
        <img src="${src}" alt="${item.name} 圖片 ${idx + 1}" loading="lazy">
      </div>
    `).join('');
    modalBody.innerHTML = `
      <div class="modal-gallery gallery-count-${galleryItems.length}">${gallery}</div>
      <div class="modal-content">
        <div class="price-row">
          <div>
            <h2 class="modal-title">${item.name}</h2>
            <p class="modal-district">${item.districtArea}</p>
            <p class="modal-refline">物業編號：${item.referenceNo || item.id}｜更新日期：${item.updateDate || '今日'}</p>
          </div>
          <div class="modal-price">${item.listingTypeLabel || ''} ${item.priceLabel}</div>
        </div>
        <div class="modal-primary-data">
          <div><span>主資料</span><strong>${item.listingTypeLabel || ''} ${item.priceLabel}</strong></div>
          <div><span>主資料</span><strong>${item.mainAreaLabel || ('實用 ' + formatArea(item.area))}</strong></div>
        </div>
        <div class="modal-specs">
          <div class="modal-spec"><div class="modal-spec-label">售價</div><div class="modal-spec-value">${item.priceLabel}</div></div>
          <div class="modal-spec"><div class="modal-spec-label">月供</div><div class="modal-spec-value">${item.mortgageLabel}</div></div>
          <div class="modal-spec"><div class="modal-spec-label">實用面積</div><div class="modal-spec-value">${item.mainAreaLabel || formatArea(item.area)}</div></div>
          <div class="modal-spec"><div class="modal-spec-label">呎價</div><div class="modal-spec-value">${item.pricePerSqftLabel}</div></div>
          <div class="modal-spec"><div class="modal-spec-label">間隔</div><div class="modal-spec-value">${item.bedroomsLabel}</div></div>
          <div class="modal-spec"><div class="modal-spec-label">樓齡</div><div class="modal-spec-value">${item.buildingAgeLabel}</div></div>
          <div class="modal-spec"><div class="modal-spec-label">座向</div><div class="modal-spec-value">${item.orientationLabel}</div></div>
        </div>
        <div class="modal-cta-row">
          <a href="tel:+85290760190" class="btn btn-primary">致電查詢 9076 0190</a>
          <a href="https://wa.me/85261822429?text=${encodeURIComponent('您好 Leo，我想查詢 ' + item.id + ' ' + item.name)}" target="_blank" rel="noopener" class="btn btn-ghost">WhatsApp 預約睇樓</a>
          <span style="margin-left:auto;font-size:12px;color:var(--ink-500);">編號 ${item.id}</span>
        </div>
      </div>
    `;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  modal.querySelectorAll('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

  function bindCards() {
    document.querySelectorAll('.card').forEach(card => {
      const id = card.dataset.id;
      card.addEventListener('click', () => openModal(id));
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(id); }
      });
    });
  }

  /* ---------- Wire up controls ---------- */
  function setType(t) {
    state.type = t;
    fTabs.forEach(b => b.classList.toggle('active', b.dataset.tab === t));
    tabTriggers.forEach(b => b.classList.toggle('active', b.dataset.tabTrigger === t));
    render();
  }

  fTabs.forEach(b => b.addEventListener('click', () => setType(b.dataset.tab)));
  tabTriggers.forEach(b => b.addEventListener('click', e => {
    setType(b.dataset.tabTrigger);
  }));

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const phone = data.get('phone');
    const type = data.get('type');
    const message = data.get('message') || '';
    const text = `您好 Leo，我是 ${name}，聯絡電話 ${phone}。\n查詢類型：${type}\n${message ? '留言：' + message : ''}`;
    const url = `https://wa.me/85261822429?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });

  /* ---------- Language toggle (visual only) ---------- */
  document.querySelector('.lang-toggle')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('en-mode');
  });

  /* ---------- Init ---------- */
  render();
})();
