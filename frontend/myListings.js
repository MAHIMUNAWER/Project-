// ── DATA ──
let listings = JSON.parse(localStorage.getItem('agri_listings') || '[]');
let editingId = null;

const EMOJIS = {
  'Vegetables': '🥦', 'Fruits': '🍎', 'Grains & Rice': '🌾',
  'Dairy': '🥛', 'Poultry': '🐔', 'Fish': '🐟',
  'Spices': '🌶️', 'Other': '📦'
};

// ── PERSISTENCE ──
function save() {
  localStorage.setItem('agri_listings', JSON.stringify(listings));
}

// ── TOAST ──
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── STATS ──
function updateStats() {
  const total   = listings.length;
  const active  = listings.filter(l => l.status === 'Active').length;
  const sold    = listings.filter(l => l.status === 'Sold Out').length;
  const revenue = listings.reduce(
    (s, l) => s + (l.status === 'Sold Out' ? (l.price * (l.stock || 0)) : 0), 0
  );

  document.getElementById('stat-total').textContent   = total;
  document.getElementById('stat-active').textContent  = active;
  document.getElementById('stat-sold').textContent    = sold;
  document.getElementById('stat-revenue').textContent = 'TK ' + revenue.toLocaleString();
}

// ── RENDER ──
function renderListings() {
  const q    = document.getElementById('search-input').value.toLowerCase();
  const stat = document.getElementById('filter-status').value;
  const cat  = document.getElementById('filter-category').value;

  const filtered = listings.filter(l => {
    const matchQ    = !q    || l.name.toLowerCase().includes(q) || (l.desc || '').toLowerCase().includes(q);
    const matchStat = !stat || l.status === stat;
    const matchCat  = !cat  || l.category === cat;
    return matchQ && matchStat && matchCat;
  });

  const grid = document.getElementById('listings-grid');

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-icon">🌱</div>
        <h3>${listings.length === 0 ? 'No listings yet' : 'No results found'}</h3>
        <p>${listings.length === 0 ? 'Add your first product to start selling!' : 'Try adjusting your search or filters.'}</p>
        ${listings.length === 0 ? '<button class="btn btn-green" onclick="openModal()">＋ Add First Listing</button>' : ''}
      </div>`;
    updateStats();
    return;
  }

  grid.innerHTML = filtered.map(l => {
    const statusClass = l.status === 'Active'
      ? 'status-active'
      : l.status === 'Sold Out'
        ? 'status-sold'
        : 'status-inactive';
    const emoji = l.emoji || EMOJIS[l.category] || '📦';
    return `
      <div class="listing-card">
        <div class="card-img">
          <span>${emoji}</span>
          <div class="card-status ${statusClass}">${l.status}</div>
        </div>
        <div class="card-body">
          <div class="card-name">${l.name}</div>
          <div class="card-category">${l.category || 'Uncategorized'}</div>
          <div class="card-meta">
            <div class="card-price">TK ${Number(l.price).toLocaleString()} <span>/ ${l.unit || 'kg'}</span></div>
            <div class="card-stock">📦 ${l.stock || 0} ${l.unit || 'kg'}</div>
          </div>
          <div class="card-actions">
            <button class="btn btn-outline btn-sm" onclick="editListing('${l.id}')">✎ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteListing('${l.id}')">🗑 Delete</button>
          </div>
        </div>
      </div>`;
  }).join('');

  updateStats();
}

// ── MODAL ──
function openModal(id = null) {
  editingId = id;
  const overlay = document.getElementById('modal-overlay');
  document.getElementById('modal-title').textContent = id ? '✎ Edit Listing' : '＋ Add New Listing';

  if (id) {
    const l = listings.find(x => x.id === id);
    document.getElementById('m-name').value     = l.name     || '';
    document.getElementById('m-category').value = l.category || '';
    document.getElementById('m-status').value   = l.status   || 'Active';
    document.getElementById('m-price').value    = l.price    || '';
    document.getElementById('m-unit').value     = l.unit     || 'kg';
    document.getElementById('m-stock').value    = l.stock    || '';
    document.getElementById('m-emoji').value    = l.emoji    || '';
    document.getElementById('m-desc').value     = l.desc     || '';
  } else {
    ['m-name', 'm-category', 'm-price', 'm-stock', 'm-emoji', 'm-desc']
      .forEach(fieldId => document.getElementById(fieldId).value = '');
    document.getElementById('m-status').value = 'Active';
    document.getElementById('m-unit').value   = 'kg';
  }

  overlay.classList.add('open');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  editingId = null;
}

function closeModalOutside(e) {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
}

// ── SAVE LISTING ──
function saveListing() {
  const name  = document.getElementById('m-name').value.trim();
  const price = document.getElementById('m-price').value.trim();
  if (!name)  { toast('⚠️ Product name is required!'); return; }
  if (!price) { toast('⚠️ Price is required!'); return; }

  const data = {
    id:       editingId || Date.now().toString(),
    name,
    category: document.getElementById('m-category').value,
    status:   document.getElementById('m-status').value,
    price:    parseFloat(price),
    unit:     document.getElementById('m-unit').value,
    stock:    parseInt(document.getElementById('m-stock').value) || 0,
    emoji:    document.getElementById('m-emoji').value.trim(),
    desc:     document.getElementById('m-desc').value.trim(),
  };

  if (editingId) {
    const idx = listings.findIndex(l => l.id === editingId);
    listings[idx] = data;
    toast('✅ Listing updated!');
  } else {
    listings.unshift(data);
    toast('✅ Listing added!');
  }

  save();
  closeModal();
  renderListings();
}

// ── EDIT / DELETE ──
function editListing(id) { openModal(id); }

function deleteListing(id) {
  if (!confirm('Delete this listing?')) return;
  listings = listings.filter(l => l.id !== id);
  save();
  renderListings();
  toast('🗑 Listing deleted.');
}

// ── INIT ──
renderListings();
updateStats();
