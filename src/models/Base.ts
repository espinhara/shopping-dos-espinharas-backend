// models/Base.ts
import mongoose, { Schema, SchemaDefinition, SchemaOptions } from 'mongoose';

const SchemaFactory = (
  schemaDefinition: SchemaDefinition,
  schemaOptions?: SchemaOptions
): Schema => {
  const CreatedSchema = new mongoose.Schema(
    {
      _id: { type: String, required: true },
      createdAt: { type: Date },
      updatedAt: { type: Date },
      ownerId: { type: String },
      ...schemaDefinition,
    },
    {
      timestamps: true,
      _id: false,
      ...schemaOptions,
    }
  );

  return CreatedSchema;
};

export default SchemaFactory;
