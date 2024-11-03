"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Sale.ts
const mongoose_1 = __importDefault(require("mongoose"));
const Base_1 = __importDefault(require("./Base"));
const ProductInSaleSchema = new mongoose_1.default.Schema({
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
});
const SaleSchema = (0, Base_1.default)({
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
const Sale = mongoose_1.default.model('Sale', SaleSchema);
exports.default = Sale;
