import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BrandDocument = Brand & Document;

@Schema({
  versionKey: false, // __v field not saving to db
  timestamps: true, // auto add both fields  'createdAt' and 'updatedAt'
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
  toObject: { virtuals: true },
})
export class Brand {
  @Prop({ required: true, unique: true })
  name: string;
}

export const BrandSchema = SchemaFactory.createForClass(Brand);

// Define the virtual field
BrandSchema.virtual('models', {
  ref: 'Model', // The model to use
  localField: '_id', // Find models where `brandId` equals `_id`
  foreignField: 'brandId',
});
