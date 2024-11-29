// models/Sale.ts
import mongoose, { Document, Schema, Model } from 'mongoose';
import SchemaFactory from './Base';

interface IProductInSale {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

const ProductInSaleSchema: Schema<IProductInSale> = new mongoose.Schema({
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

export interface ISale extends Document {
  date: Date;
  products: IProductInSale[];
  total: number;
  subtotal: number;
  pickupName: string;
  customerName: string;
  status: 'pending' | 'paid' | 'completed';
  paymentMethod?: 'credit_card' | 'debit_card' | 'paypal' | 'cash' | 'pix' | 'in_installments' | 'in_sight';
  installments: number;
}

const SaleSchema: Schema<ISale> = SchemaFactory({
  date: { type: Date, required: true },
  products: { type: [ProductInSaleSchema], required: true },
  total: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  pickupName: { type: String, required: true },
  customerName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'paid', 'completed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['credit_card', 'debit_card', 'paypal', 'cash', 'pix', 'in_installments', 'in_sight'] },
  installments: { type: Number, default: 1 }
});

const Sale: Model<ISale> = mongoose.model<ISale>('Sale', SaleSchema);

export default Sale;
