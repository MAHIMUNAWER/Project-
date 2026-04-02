/* ── userProfile/orders.js ── */

const orders = [];

function renderOrders() {
  const filter = document.getElementById('order-filter').value;
  const items  = filter ? orders.filter(o => o.status === filter) : orders;

  // stats
  const delivered = orders.filter(o => o.status === 'Delivered').length;
  const spent     = orders.reduce((a, o) => a + o.amount, 0);
  document.getElementById('o-total').textContent     = orders.length;
  document.getElementById('o-delivered').textContent = delivered;
  document.getElementById('o-spent').textContent     = 'TK ' + spent.toLocaleString('en-IN');

  const list = document.getElementById('orders-list');

  if (!items.length) {
    list.innerHTML = `
      <div class="empty-orders">
        <div class="ei">🛒</div>
        <div class="et">No orders yet</div>
        <div class="es">Your purchase history will appear here.</div>
      </div>`;
    return;
  }

  const sc = s =>
    s === 'Delivered' ? 's-delivered' :
    s === 'Pending'   ? 's-pending'   :
    s === 'Cancelled' ? 's-cancelled' : 's-shipped';

  list.innerHTML = items.map((o, i) => `
    <div class="order-card" style="animation-delay:${i * 0.05}s">
      <div class="order-icon">${o.icon}</div>
      <div class="order-info">
        <div class="order-name">${o.name}</div>
        <div class="order-meta">${o.id} &nbsp;·&nbsp; ${o.seller} &nbsp;·&nbsp; ${o.qty} &nbsp;·&nbsp; ${o.date}</div>
      </div>
      <div class="order-amount">TK ${o.amount.toLocaleString('en-IN')}</div>
      <div class="order-status">
        <span class="status-pill ${sc(o.status)}">${o.status}</span>
      </div>
    </div>
  `).join('');
}