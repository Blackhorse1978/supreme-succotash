const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, default: 0 },
  groupName: { type: String, required: true },
  category: { type: String, required: true },
  hsncode: String,
  unit1: String,
  unit2: String,
  salesTax: String,
  purchaseTax: String,
  price: { type: String, default: '₹299' }
}, {
  timestamps: true
});

// Indexes for performance
productSchema.index({ category: 1 });
productSchema.index({ groupName: 1 });
productSchema.index({ qty: 1 }, { sparse: true });

module.exports = mongoose.model('Product', productSchema);

