const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  isActive: { type: Boolean, default: true, },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrls: [{ type: String }] // Alterado para array de URLs
}, { timestamps: true }, { _id: false });

module.exports = mongoose.model('Product', productSchema);
