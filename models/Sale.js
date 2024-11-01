// models/Sale.js
const mongoose = require('mongoose');
const SchemaFactory = require('./Base');

const ProductInSaleSchema = new mongoose.Schema({
  productId: { type: String, required: true }, // ID do produto
  productName: { type: String, required: true }, // ID do produto
  quantity: { type: Number, required: true },  // Quantidade do produto vendido
  price: { type: Number, required: true },     // Preço do produto
});

const SaleSchema = SchemaFactory({
  date: { type: String, required: true },
  products: { type: [ProductInSaleSchema], required: true },
  total: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  pickupName: { type: String, required: true },
  customerName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid', 'completed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['credit_card', 'debit_card', 'paypal', 'cash', 'pix', 'in_installments', 'in_sight'] },
  installments: { type: Number, default: 1 }
});

module.exports = mongoose.model('Sale', SaleSchema);
