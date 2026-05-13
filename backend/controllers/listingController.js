const Listing = require('../models/Listing');
const jwt     = require('jsonwebtoken');

// ── helper: extract user id from Bearer token ──────────────────────────────
function getUserId(req) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch {
    return null;
  }
}

// ── GET /api/listings  (my listings) ──────────────────────────────────────
exports.getMyListings = async (req, res) => {
  const farmerId = getUserId(req);
  if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized.' });

  try {
    const listings = await Listing.find({ farmer: farmerId }).sort({ createdAt: -1 });
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── POST /api/listings  (create) ──────────────────────────────────────────
exports.createListing = async (req, res) => {
  const farmerId = getUserId(req);
  if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized.' });

  try {
    const { name, category, price, unit, stock, emoji, description, status } = req.body;
    if (!name || !category || price == null)
      return res.status(400).json({ success: false, message: 'Name, category and price are required.' });

    const image = req.file ? req.file.filename : '';

    const listing = await Listing.create({
      farmer: farmerId, name, category,
      price: +price, unit, stock: +stock || 0,
      emoji, description, status, image,
    });

    res.status(201).json({ success: true, listing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── PUT /api/listings/:id  (update) ───────────────────────────────────────
exports.updateListing = async (req, res) => {
  const farmerId = getUserId(req);
  if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized.' });

  try {
    const listing = await Listing.findOne({ _id: req.params.id, farmer: farmerId });
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });

    const fields = ['name','category','price','unit','stock','emoji','description','status'];
    fields.forEach(f => { if (req.body[f] != null) listing[f] = req.body[f]; });
    if (req.file) listing.image = req.file.filename;

    await listing.save();
    res.json({ success: true, listing });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── DELETE /api/listings/:id ───────────────────────────────────────────────
exports.deleteListing = async (req, res) => {
  const farmerId = getUserId(req);
  if (!farmerId) return res.status(401).json({ success: false, message: 'Unauthorized.' });

  try {
    const listing = await Listing.findOneAndDelete({ _id: req.params.id, farmer: farmerId });
    if (!listing) return res.status(404).json({ success: false, message: 'Listing not found.' });
    res.json({ success: true, message: 'Deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── GET /api/listings/all  (public feed) ──────────────────────────────────
exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find({ status: 'Active', stock: { $gt: 0 } })
                                  .sort({ createdAt: -1 });
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};