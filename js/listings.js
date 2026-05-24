(function () {
  const DATA_URL = 'data/listings.json';
  const STATUS_LABELS = {
    available: '',
    sold: '已售',
    rented: '已租'
  };

  window.LISTINGS = [];

  function joinPath(folder, file) {
    const base = folder.endsWith('/') ? folder : folder + '/';
    return base + file;
  }

  function normalizeSlot(slot, type) {
    if (!slot || slot.visibility !== 'show' || !slot.property_id || !slot.title) return null;

    const gallery = (slot.photos || [])
      .filter(Boolean)
      .slice(0, 8)
      .map(file => joinPath(slot.photo_folder || `assets/properties/${slot.slot_id}/`, file));

    const media = [
      { key: 'youtube', label: '影片', icon: '▶', embed: slot.youtube_embed || '' },
      { key: 'map', label: '地圖', icon: '⌖', embed: slot.google_maps_embed || '' },
      { key: 'vr', label: 'VR', icon: '◌', embed: slot.vr_embed || '' }
    ].filter(item => item.embed);

    return {
      id: slot.slot_id,
      slotId: slot.slot_id,
      referenceNo: slot.property_id,
      updateDate: slot.updated_date,
      type,
      listingTypeLabel: slot.listing_type_label || (type === 'sale' ? '出售' : '出租'),
      listingStatus: slot.listing_status || 'available',
      statusLabel: STATUS_LABELS[slot.listing_status] || '',
      name: slot.title,
      district: slot.district,
      districtArea: slot.district_area || slot.district,
      priceLabel: slot.price_label,
      mainAreaLabel: slot.area_label,
      mortgageLabel: slot.mortgage_label,
      pricePerSqftLabel: slot.price_per_sqft_label,
      bedroomsLabel: slot.bedrooms_label,
      buildingAgeLabel: slot.building_age_label,
      orientationLabel: slot.orientation_label,
      remarks: slot.remarks || '',
      stars: 5,
      featured: true,
      vr: Boolean(slot.vr_embed),
      img: gallery[0] || 'assets/listing-05.png',
      gallery,
      media
    };
  }

  function normalizeData(data) {
    const sale = (data.sale_slots || []).map(slot => normalizeSlot(slot, 'sale')).filter(Boolean);
    const rent = (data.rent_slots || []).map(slot => normalizeSlot(slot, 'rent')).filter(Boolean);
    return [...sale, ...rent];
  }

  window.LISTINGS_READY = fetch(`${DATA_URL}?v=${Date.now()}`, { cache: 'no-store' })
    .then(response => {
      if (!response.ok) throw new Error(`Cannot load ${DATA_URL}`);
      return response.json();
    })
    .then(data => {
      window.LISTINGS = normalizeData(data);
      return window.LISTINGS;
    })
    .catch(error => {
      console.error('Listing data failed to load:', error);
      window.LISTINGS = [];
      return window.LISTINGS;
    });
})();
