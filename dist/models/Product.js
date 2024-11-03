"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Base_1 = __importDefault(require("./Base"));
const ProductSchema = (0, Base_1.default)({
    isActive: { type: Boolean, default: true, },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0, required: true },
    imageUrls: [{ type: String }] // Alterado para array de URLs
});
const Product = mongoose_1.default.model('Product', ProductSchema);
exports.default = Product;
