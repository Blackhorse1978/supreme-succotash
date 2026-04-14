const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, default: 0 },
  unit: { type: String, required: true }, // KG, LTR, PCS
  supplier: String,
  expiry: Date,
  category: { type: String, default: 'raw', enum: ['raw', 'packaging'] },
  pricePerUnit: { type: Number, default: 0 },
  minStock: { type: Number, default: 10 }
}, { timestamps: true });

rawMaterialSchema.index({ category: 1 });
rawMaterialSchema.index({ supplier: 1 });
rawMaterialSchema.index({ qty: 1 }, { sparse: true });

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);

