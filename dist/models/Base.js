"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Base.ts
const mongoose_1 = __importDefault(require("mongoose"));
const SchemaFactory = (schemaDefinition, schemaOptions) => {
    const CreatedSchema = new mongoose_1.default.Schema(Object.assign({ _id: { type: String, required: true }, createdAt: { type: Date }, updatedAt: { type: Date }, ownerId: { type: String } }, schemaDefinition), Object.assign({ timestamps: true, _id: false }, schemaOptions));
    return CreatedSchema;
};
exports.default = SchemaFactory;
