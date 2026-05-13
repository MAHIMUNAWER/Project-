const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  farmer:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:        { type: String, required: true, trim: true },
  category:    { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  unit:        { type: String, default: 'kg' },
  stock:       { type: Number, default: 0 },
  emoji:       { type: String, default: '🌿' },
  description: { type: String, default: '' },
  image:       { type: String, default: '' },   // filename stored in /uploads/listings/
  status:      { type: String, enum: ['Active', 'Sold Out', 'Hidden'], default: 'Active' },
  sold:        { type: Number, default: 0 },
  revenue:     { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Listing', ListingSchema);