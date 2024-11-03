import mongoose, { Document, Schema, Model } from 'mongoose';
import SchemaFactory from './Base';


interface IProduct extends Document {
  isActive: boolean;
  name: string;
  description: string;
  price: number;
  quantity: number;
  imagesUrls: string[];
}

const ProductSchema: Schema<IProduct> = SchemaFactory({
  isActive: { type: Boolean, default: true, },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 0, required: true },
  imageUrls: [{ type: String }] // Alterado para array de URLs
});

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema)

export default Product;
