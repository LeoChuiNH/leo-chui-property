(function () {
  const grid = document.getElementById('listingsGrid');
  const emptyState = document.getElementById('emptyState');
  const resultCount = document.getElementById('resultCount');
  const fTabs = document.querySelectorAll('.ftab');
  const tabTriggers = document.querySelectorAll('[data-tab-trigger]');
  const modal = document.getElementById('propertyModal');
  const modalBody = document.getElementById('modalBody');

  const CONTACT_PHONE = '6182 2429';
  const CONTACT_TEL = '+85261822429';

  const state = {
    type: 'all'
  };

  function escapeHtml(value) {
    return String(value || '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function bedIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M2 12h20"/><path d="M2 8v8m20-8v8"/><path d="M6 12V8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg>';
  }
  function areaIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/></svg>';
  }
  function bathIcon() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 12h18v3a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-3z"/><path d="M6 12V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2"/><path d="M5 18l-1 3M19 18l1 3"/></svg>';
  }

  function buildCard(item) {
    const badges = [
      `<span class="badge badge-featured">${escapeHtml(item.listingTypeLabel)}</span>`
    ];
    if (item.statusLabel) badges.push(`<span class="badge badge-vr">${escapeHtml(item.statusLabel)}</span>`);
    if (item.featured) badges.push('<span class="badge badge-vr">精選</span>');

    const priceLabel = item.type === 'rent' ? '租金' : '售價';
    const statusClass = item.statusLabel ? ' card-is-closed' : '';

    return `
      <article class="card${statusClass}" data-id="${escapeHtml(item.id)}" tabindex="0" role="button" aria-label="${escapeHtml(item.name)}">
        <div class="card-img-wrap">
          <img src="${escapeHtml(item.img)}" alt="${escapeHtml(item.name)}" loading="lazy">
          <div class="card-badge">${badges.join('')}</div>
          <button class="card-fav" aria-label="加入收藏" onclick="event.stopPropagation(); this.classList.toggle('active');">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <div class="card-stars">★★★★★</div>
        </div>
        <div class="card-body">
          <div class="card-refline">
            <span>物業編號：${escapeHtml(item.referenceNo)}</span>
            <span>更新：${escapeHtml(item.updateDate || '今日')}</span>
          </div>
          <h3 class="card-name">${escapeHtml(item.name)}</h3>
          <p class="card-district">${escapeHtml(item.districtArea)}</p>
          <div class="card-main-data">
            <div>
              <span class="card-data-label">${priceLabel}</span>
              <strong>${escapeHtml(item.priceLabel)}</strong>
            </div>
            <div>
              <span class="card-data-label">面積</span>
              <strong>${escapeHtml(item.mainAreaLabel)}</strong>
            </div>
          </div>
          <div class="card-specs">
            ${item.mortgageLabel ? `<span>${areaIcon()} 月供 ${escapeHtml(item.mortgageLabel)}</span>` : ''}
            ${item.bedroomsLabel ? `<span>${bedIcon()} ${escapeHtml(item.bedroomsLabel)}</span>` : ''}
            ${item.orientationLabel ? `<span>${bathIcon()} 座向 ${escapeHtml(item.orientationLabel)}</span>` : ''}
          </div>
          <div class="card-sub-data">
            ${item.pricePerSqftLabel ? `<span>呎價 ${escapeHtml(item.pricePerSqftLabel)}</span>` : ''}
            ${item.buildingAgeLabel ? `<span>樓齡 ${escapeHtml(item.buildingAgeLabel)}</span>` : ''}
          </div>
          <div class="card-bottom">
            <div class="card-agent">
              <img src="assets/leo-portrait.jpeg" class="agent-avatar" alt="">
              <div class="card-agent-info">
                <span class="card-agent-name">Leo N. H. Chui</span>
                <span class="card-agent-phone">${CONTACT_PHONE}</span>
              </div>
            </div>
            <div class="card-price">${escapeHtml(item.listingTypeLabel)}<span class="card-price-unit"> 廣告</span></div>
          </div>
        </div>
      </article>
    `;
  }

  function filterListings() {
    const source = window.LISTINGS || [];
    const list = state.type === 'all' ? [...source] : source.filter(i => i.type === state.type);
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

  function buildMediaButtons(item) {
    const typeButton = `<span class="modal-action-pill type-pill">${escapeHtml(item.listingTypeLabel)}</span>`;
    const statusButton = item.statusLabel ? `<span class="modal-action-pill status-pill">${escapeHtml(item.statusLabel)}</span>` : '';
    const mediaButtons = (item.media || []).map(media => `
      <button type="button" class="modal-media-trigger" data-media-key="${escapeHtml(media.key)}">
        <span>${escapeHtml(media.icon)}</span>${escapeHtml(media.label)}
      </button>
    `).join('');
    return typeButton + statusButton + mediaButtons;
  }

  function buildSpecRows(item) {
    const priceLabel = item.type === 'rent' ? '租金' : '售價';
    return [
      [priceLabel, item.priceLabel],
      ['月供', item.mortgageLabel],
      ['實用面積', item.mainAreaLabel],
      ['呎價', item.pricePerSqftLabel],
      ['間隔', item.bedroomsLabel],
      ['樓齡', item.buildingAgeLabel],
      ['座向', item.orientationLabel]
    ]
      .filter(([, value]) => value)
      .map(([label, value]) => `
        <div class="modal-spec">
          <div class="modal-spec-label">${escapeHtml(label)}</div>
          <div class="modal-spec-value">${escapeHtml(value)}</div>
        </div>
      `).join('');
  }

  function openModal(id) {
    const item = (window.LISTINGS || []).find(x => x.id === id);
    if (!item) return;

    const galleryItems = item.gallery && item.gallery.length ? item.gallery : [item.img];
    const thumbnails = galleryItems.map((src, idx) => `
      <button type="button" class="modal-thumb${idx === 0 ? ' active' : ''}" data-slide-index="${idx}" aria-label="查看圖片 ${idx + 1}">
        <img src="${escapeHtml(src)}" alt="" loading="lazy">
      </button>
    `).join('');

    const mediaPanel = item.media && item.media.length ? `
      <section class="modal-media-section" hidden>
        <div class="modal-media-heading"></div>
        <div class="modal-media-frame"></div>
      </section>
    ` : '';

    modalBody.innerHTML = `
      <div class="modal-slider" data-current="0">
        <div class="modal-slide-stage">
          <img class="modal-slide-image" src="${escapeHtml(galleryItems[0])}" alt="${escapeHtml(item.name)} 圖片 1">
          <button type="button" class="modal-slide-nav prev" data-slide-prev aria-label="上一張">‹</button>
          <button type="button" class="modal-slide-nav next" data-slide-next aria-label="下一張">›</button>
          <div class="modal-slide-count">1 / ${galleryItems.length}</div>
        </div>
        <div class="modal-thumbs">${thumbnails}</div>
      </div>
      <div class="modal-content">
        <div class="price-row modal-header-row">
          <div>
            <h2 class="modal-title">${escapeHtml(item.name)}</h2>
            <div class="modal-title-actions">${buildMediaButtons(item)}</div>
            <p class="modal-district">${escapeHtml(item.districtArea)}</p>
            <p class="modal-refline">物業編號：${escapeHtml(item.referenceNo)}｜更新日期：${escapeHtml(item.updateDate || '今日')}</p>
          </div>
        </div>
        <div class="modal-primary-data">
          <div><span>${item.type === 'rent' ? '租金' : '售價'}</span><strong>${escapeHtml(item.priceLabel)}</strong></div>
          <div><span>實用面積</span><strong>${escapeHtml(item.mainAreaLabel)}</strong></div>
        </div>
        <div class="modal-specs">${buildSpecRows(item)}</div>
        ${item.remarks ? `
          <section class="modal-remarks">
            <div class="modal-spec-label">備注</div>
            <p>${escapeHtml(item.remarks)}</p>
          </section>
        ` : ''}
        ${mediaPanel}
        <div class="modal-cta-row">
          <a href="tel:${CONTACT_TEL}" class="btn btn-primary">致電查詢 ${CONTACT_PHONE}</a>
          <a href="https://wa.me/85261822429?text=${encodeURIComponent('我想查詢 ' + item.referenceNo + ' ' + item.name)}" target="_blank" rel="noopener" class="btn btn-ghost">WhatsApp 預約睇樓</a>
          <span class="modal-reference">編號 ${escapeHtml(item.referenceNo)}</span>
        </div>
      </div>
    `;

    bindModalGallery(galleryItems, item.name);
    bindModalMedia(item.media || []);
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function bindModalGallery(galleryItems, name) {
    const image = modalBody.querySelector('.modal-slide-image');
    const count = modalBody.querySelector('.modal-slide-count');
    const thumbs = modalBody.querySelectorAll('.modal-thumb');
    const prev = modalBody.querySelector('[data-slide-prev]');
    const next = modalBody.querySelector('[data-slide-next]');
    let current = 0;

    function setSlide(index) {
      current = (index + galleryItems.length) % galleryItems.length;
      image.src = galleryItems[current];
      image.alt = `${name} 圖片 ${current + 1}`;
      count.textContent = `${current + 1} / ${galleryItems.length}`;
      thumbs.forEach((thumb, idx) => thumb.classList.toggle('active', idx === current));
    }

    prev?.addEventListener('click', () => setSlide(current - 1));
    next?.addEventListener('click', () => setSlide(current + 1));
    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => setSlide(Number(thumb.dataset.slideIndex)));
    });
  }

  function bindModalMedia(mediaItems) {
    const panel = modalBody.querySelector('.modal-media-section');
    if (!panel) return;

    const heading = panel.querySelector('.modal-media-heading');
    const frame = panel.querySelector('.modal-media-frame');
    const buttons = modalBody.querySelectorAll('.modal-media-trigger');

    function toEmbedHtml(value) {
      const source = String(value || '').trim();
      if (!source) return '';
      if (source.startsWith('<iframe')) return source;
      return `<iframe src="${escapeHtml(source)}" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    }

    function activate(key) {
      const media = mediaItems.find(item => item.key === key);
      if (!media) return;
      buttons.forEach(button => button.classList.toggle('active', button.dataset.mediaKey === key));
      heading.textContent = media.label;
      frame.innerHTML = toEmbedHtml(media.embed);
      panel.hidden = false;
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    buttons.forEach(button => {
      button.addEventListener('click', () => activate(button.dataset.mediaKey));
    });
  }

  function closeModal() {
    modal.hidden = true;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modalBody.innerHTML = '';
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

  function setType(t) {
    state.type = t;
    fTabs.forEach(b => b.classList.toggle('active', b.dataset.tab === t));
    tabTriggers.forEach(b => b.classList.toggle('active', b.dataset.tabTrigger === t));
    render();
  }

  fTabs.forEach(b => b.addEventListener('click', () => setType(b.dataset.tab)));
  tabTriggers.forEach(b => b.addEventListener('click', () => setType(b.dataset.tabTrigger)));

  const form = document.getElementById('contactForm');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const phone = data.get('phone');
    const type = data.get('type');
    const message = data.get('message') || '';
    const text = `我是 ${name}，聯絡電話 ${phone}。\n查詢類型：${type}\n${message ? '留言：' + message : ''}`;
    const url = `https://wa.me/85261822429?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener');
  });

  document.querySelector('.lang-toggle')?.addEventListener('click', () => {
    document.documentElement.classList.toggle('en-mode');
  });

  Promise.resolve(window.LISTINGS_READY)
    .then(render)
    .catch(render);
})();
