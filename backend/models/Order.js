const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  branch: { type: String, required: true },
  customer: {
    name: String,
    phone: String,
    email: String,
    address: String
  },
  delivery: {
    date: String,
    time: String
  },
  items: [{
    id: String,
    name: String,
    price: Number,
    qty: Number,
    category: String
  }],
  packaging: {
    selectedBox: String,
    containerRequired: String
  },
  total: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// Indexes
orderSchema.index({ orderId: 1 });
orderSchema.index({ userId: 1 });
orderSchema.index({ branch: 1, 'createdAt': -1 });

module.exports = mongoose.model('Order', orderSchema);
