const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, default: 0 },
  category: { type: String, required: true },
  stock: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Indexes for performance
productSchema.index({ category: 1 });
productSchema.index({ stock: 1 }, { sparse: true });

module.exports = mongoose.model('Product', productSchema);

