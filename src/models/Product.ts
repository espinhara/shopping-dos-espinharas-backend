import mongoose, { Document, Schema, Model } from 'mongoose';
import SchemaFactory from './Base';

export interface IProduct extends Document {
  isActive: Boolean;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imagesUrls: string[];
}


const ProductSchema: Schema<IProduct> = SchemaFactory({
  _id: { type: String, required: true },
  isActive: { type: Boolean, default: true, },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  imageUrls: [{ type: String }] // Alterado para array de URLs
});

const Product: Model<IProduct> = mongoose.model('Product', ProductSchema);

export default Product;
