const Order = require('../models/Order');

/* ── GET /api/orders ──────────────────────────────────────────────────────
   Returns all orders for the logged-in buyer.
   Query params:
     ?status=Pending|Shipped|Delivered|Cancelled   (optional filter)
     ?page=1&limit=20                               (pagination, optional)  */
exports.getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;

    const query = { buyer: req.userId };
    if (status) query.status = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean({ virtuals: true }),
      Order.countDocuments(query),
    ]);

    // Compute stats across ALL user orders (ignore filter for stats)
    const allOrders = await Order.find({ buyer: req.userId }).lean();
    const stats = {
      total:     allOrders.length,
      delivered: allOrders.filter(o => o.status === 'Delivered').length,
      spent:     allOrders.reduce((sum, o) => sum + (o.amount || 0), 0),
    };

    res.json({ orders, stats, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('getMyOrders:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/* ── GET /api/orders/:id ──────────────────────────────────────────────────
   Returns a single order (must belong to the logged-in buyer).            */
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      buyer: req.userId,
    }).lean({ virtuals: true });

    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ order });
  } catch (err) {
    console.error('getOrderById:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/* ── POST /api/orders ─────────────────────────────────────────────────────
   Create a new order.  Called internally by the shop checkout flow.
   Body: { name, icon, qty, amount, sellerName, productId }               */
exports.createOrder = async (req, res) => {
  try {
    const { name, icon, qty, amount, sellerName, productId } = req.body;
    if (!name || amount == null) {
      return res.status(400).json({ message: 'name and amount are required.' });
    }

    const order = await Order.create({
      buyer: req.userId,
      name,
      icon:       icon       || '🛒',
      qty:        qty        || '1 unit',
      amount:     Number(amount),
      sellerName: sellerName || '',
      productId:  productId  || undefined,
    });

    res.status(201).json({ message: 'Order created.', order });
  } catch (err) {
    console.error('createOrder:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};

/* ── PATCH /api/orders/:id/status ─────────────────────────────────────────
   Update order status.  Typically called by seller/admin middleware.      */
exports.updateOrderStatus = async (req, res) => {
  const valid = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];
  const { status } = req.body;
  if (!valid.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${valid.join(', ')}` });
  }

  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    ).lean({ virtuals: true });

    if (!order) return res.status(404).json({ message: 'Order not found.' });
    res.json({ message: 'Status updated.', order });
  } catch (err) {
    console.error('updateOrderStatus:', err);
    res.status(500).json({ message: 'Server error.' });
  }
};
