"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/User.js
const mongoose_1 = __importDefault(require("mongoose"));
const Base_1 = __importDefault(require("./Base"));
const UserSchema = (0, Base_1.default)({
    name: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    zip: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    neighborhood: { type: String, default: null },
    street: { type: String, default: null },
    number: { type: String, default: null },
    complement: { type: String, default: null },
    cpf: { type: String, default: null },
    phoneNumber: { type: String, default: null },
});
const User = mongoose_1.default.model('User', UserSchema);
exports.default = User;
