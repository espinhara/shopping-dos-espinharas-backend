// models/User.js
import mongoose, { Document, Schema, Model } from 'mongoose';
import SchemaFactory from './Base';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  zip: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  number: number;
  complement: number;
  cpf: string;
  phoneNumber: number;
}

const UserSchema: Schema<IUser> = SchemaFactory({
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

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;