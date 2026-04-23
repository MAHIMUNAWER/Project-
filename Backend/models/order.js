const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  sellerName: { type: String, default: '' },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  name:   { type: String, required: true },  // product name snapshot
  icon:   { type: String, default: '🛒' },
  qty:    { type: String, default: '1 unit' },
  amount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
}, { timestamps: true });

// Virtual for formatted date
orderSchema.virtual('date').get(function () {
  return this.createdAt.toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
});

orderSchema.set('toObject', { virtuals: true });
orderSchema.set('toJSON',   { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
