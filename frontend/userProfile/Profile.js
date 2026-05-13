<<<<<<< HEAD
/* ── userProfile/profile.js ──
 * Depends on:  Authutils.js  (must be loaded first in index.html)
 *              orders.js     (must be loaded first in index.html)
 *
 * Load order in index.html:
 *   <script src="orders.js"></script>
 *   <script src="Authutils.js"></script>
 *   <script src="profile.js"></script>
 */

// ── TABS ───────────────────────────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel-section').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-'   + tab).classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
  if (tab === 'orders') renderOrders();
}

// ── SAVE PROFILE ───────────────────────────────────────────────────────────
function saveProfile() {
  const name     = document.getElementById('f-name').value.trim();
  const phone    = document.getElementById('f-phone').value.trim();
  const district = document.getElementById('f-district').value.trim();
  const village  = document.getElementById('f-village').value.trim();
  const farmtype = document.getElementById('f-farmtype').value;
  const land     = document.getElementById('f-land').value.trim();
  const email    = document.getElementById('f-email').value.trim();
  const nid      = document.getElementById('f-nid').value.trim();
  const bio      = document.getElementById('f-bio').value.trim();

  if (!name) { toast('⚠ Name is required.', true); return; }

  // Update hero display
  document.getElementById('display-name').textContent     = name;
  document.getElementById('display-phone').textContent    = phone    || '—';
  document.getElementById('display-farmtype').textContent = farmtype || '—';
  document.getElementById('display-land').textContent     = land ? land + ' acres' : '—';
  document.getElementById('display-location').textContent =
    [village, district].filter(Boolean).join(', ') || '—';

  // Persist to localStorage
  const user = getUser();
  if (user) {
    Object.assign(user, {
      name, phone, email, nid, district, village, farmtype, bio,
      land: land ? parseFloat(land) : null,
    });
    localStorage.setItem('agri_current_user', JSON.stringify(user));

    // Sync back into the users array
    const users = JSON.parse(localStorage.getItem('agri_users') || '[]');
    const idx   = users.findIndex(u => u.id === user.id);
    if (idx > -1) {
      users[idx] = user;
      localStorage.setItem('agri_users', JSON.stringify(users));
    }
  }

  toast('✅ Profile saved!');
}

// ── RESET FORM ─────────────────────────────────────────────────────────────
function resetForm() {
  ['f-name', 'f-phone', 'f-email', 'f-nid', 'f-village', 'f-district', 'f-land', 'f-bio']
    .forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('f-farmtype').selectedIndex = 0;
  toast('Changes discarded.');
}

// ── POPULATE HERO + FORM FROM SESSION ─────────────────────────────────────
function populateFromSession() {
  const user = getUser();
  if (!user) return;

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  };
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val != null) el.value = val;
  };

  // Hero bar
  setText('display-name',     user.name);
  setText('display-phone',    user.phone);
  setText('display-farmtype', user.farmtype);
  setText('display-land',     user.land ? user.land + ' acres' : null);
  setText('display-sales',    user.totalSales ? 'TK ' + Number(user.totalSales).toLocaleString('en-IN') : null);

  const loc = [user.village, user.district].filter(Boolean).join(', ');
  if (loc) document.getElementById('display-location').textContent = loc;

  // Form fields
  setVal('f-name',     user.name);
  setVal('f-phone',    user.phone);
  setVal('f-email',    user.email);
  setVal('f-nid',      user.nid);
  setVal('f-village',  user.village);
  setVal('f-district', user.district);
  setVal('f-land',     user.land);
  setVal('f-bio',      user.bio);

  if (user.farmtype) {
    const sel = document.getElementById('f-farmtype');
    if (sel) sel.value = user.farmtype;
  }
}

// ── INJECT LOGOUT BUTTON INTO NAV ─────────────────────────────────────────
function injectLogoutBtn() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  if (document.getElementById('logout-btn')) return;

  const btn = document.createElement('button');
  btn.id          = 'logout-btn';
  btn.textContent = '🚪 Logout';
  btn.style.cssText = `
    padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    background: transparent; color: var(--muted);
    border: 1px solid var(--border); cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .18s;
  `;
  btn.onmouseover = () => { btn.style.borderColor = 'var(--red)'; btn.style.color = 'var(--red)'; };
  btn.onmouseout  = () => { btn.style.borderColor = 'var(--border)'; btn.style.color = 'var(--muted)'; };
  btn.onclick     = logout;
  navRight.appendChild(btn);
}

// ── INIT (runs after DOM is fully loaded) ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  requireAuth();         // redirect to auth.html if not logged in
  populateFromSession(); // fill hero + form fields from localStorage
  injectLogoutBtn();     // add logout button to nav
  renderOrders();        // render orders tab
=======
/* ── userProfile/profile.js ──
 * Depends on:  Authutils.js  (must be loaded first in index.html)
 *              orders.js     (must be loaded first in index.html)
 *
 * Load order in index.html:
 *   <script src="orders.js"></script>
 *   <script src="Authutils.js"></script>
 *   <script src="profile.js"></script>
 */

// ── TABS ───────────────────────────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel-section').forEach(p => p.classList.remove('active'));
  document.getElementById('tab-'   + tab).classList.add('active');
  document.getElementById('panel-' + tab).classList.add('active');
  if (tab === 'orders') renderOrders();
}

// ── SAVE PROFILE ───────────────────────────────────────────────────────────
function saveProfile() {
  const name     = document.getElementById('f-name').value.trim();
  const phone    = document.getElementById('f-phone').value.trim();
  const district = document.getElementById('f-district').value.trim();
  const village  = document.getElementById('f-village').value.trim();
  const farmtype = document.getElementById('f-farmtype').value;
  const land     = document.getElementById('f-land').value.trim();
  const email    = document.getElementById('f-email').value.trim();
  const nid      = document.getElementById('f-nid').value.trim();
  const bio      = document.getElementById('f-bio').value.trim();

  if (!name) { toast('⚠ Name is required.', true); return; }

  // Update hero display
  document.getElementById('display-name').textContent     = name;
  document.getElementById('display-phone').textContent    = phone    || '—';
  document.getElementById('display-farmtype').textContent = farmtype || '—';
  document.getElementById('display-land').textContent     = land ? land + ' acres' : '—';
  document.getElementById('display-location').textContent =
    [village, district].filter(Boolean).join(', ') || '—';

  // Persist to localStorage
  const user = getUser();
  if (user) {
    Object.assign(user, {
      name, phone, email, nid, district, village, farmtype, bio,
      land: land ? parseFloat(land) : null,
    });
    localStorage.setItem('agri_current_user', JSON.stringify(user));

    // Sync back into the users array
    const users = JSON.parse(localStorage.getItem('agri_users') || '[]');
    const idx   = users.findIndex(u => u.id === user.id);
    if (idx > -1) {
      users[idx] = user;
      localStorage.setItem('agri_users', JSON.stringify(users));
    }
  }

  toast('✅ Profile saved!');
}

// ── RESET FORM ─────────────────────────────────────────────────────────────
function resetForm() {
  ['f-name', 'f-phone', 'f-email', 'f-nid', 'f-village', 'f-district', 'f-land', 'f-bio']
    .forEach(id => { document.getElementById(id).value = ''; });
  document.getElementById('f-farmtype').selectedIndex = 0;
  toast('Changes discarded.');
}

// ── POPULATE HERO + FORM FROM SESSION ─────────────────────────────────────
function populateFromSession() {
  const user = getUser();
  if (!user) return;

  const setText = (id, val) => {
    const el = document.getElementById(id);
    if (el && val) el.textContent = val;
  };
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val != null) el.value = val;
  };

  // Hero bar
  setText('display-name',     user.name);
  setText('display-phone',    user.phone);
  setText('display-farmtype', user.farmtype);
  setText('display-land',     user.land ? user.land + ' acres' : null);
  setText('display-sales',    user.totalSales ? 'TK ' + Number(user.totalSales).toLocaleString('en-IN') : null);

  const loc = [user.village, user.district].filter(Boolean).join(', ');
  if (loc) document.getElementById('display-location').textContent = loc;

  // Form fields
  setVal('f-name',     user.name);
  setVal('f-phone',    user.phone);
  setVal('f-email',    user.email);
  setVal('f-nid',      user.nid);
  setVal('f-village',  user.village);
  setVal('f-district', user.district);
  setVal('f-land',     user.land);
  setVal('f-bio',      user.bio);

  if (user.farmtype) {
    const sel = document.getElementById('f-farmtype');
    if (sel) sel.value = user.farmtype;
  }
}

// ── INJECT LOGOUT BUTTON INTO NAV ─────────────────────────────────────────
function injectLogoutBtn() {
  const navRight = document.querySelector('.nav-right');
  if (!navRight) return;

  if (document.getElementById('logout-btn')) return;

  const btn = document.createElement('button');
  btn.id          = 'logout-btn';
  btn.textContent = '🚪 Logout';
  btn.style.cssText = `
    padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 600;
    background: transparent; color: var(--muted);
    border: 1px solid var(--border); cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .18s;
  `;
  btn.onmouseover = () => { btn.style.borderColor = 'var(--red)'; btn.style.color = 'var(--red)'; };
  btn.onmouseout  = () => { btn.style.borderColor = 'var(--border)'; btn.style.color = 'var(--muted)'; };
  btn.onclick     = logout;
  navRight.appendChild(btn);
}

// ── INIT (runs after DOM is fully loaded) ──────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  requireAuth();         // redirect to auth.html if not logged in
  populateFromSession(); // fill hero + form fields from localStorage
  injectLogoutBtn();     // add logout button to nav
  renderOrders();        // render orders tab
>>>>>>> origin/main
});