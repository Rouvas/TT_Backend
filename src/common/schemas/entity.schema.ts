import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EntityDocument = Entity & Document;

@Schema({
  versionKey: false, // __v field not saving to db
  timestamps: true, // auto add both fields  'createdAt' and 'updatedAt'
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Entity {
  @Prop({ required: true, unique: true })
  seoIdentifier: string;

  @Prop({ required: true })
  brandId: string;

  @Prop({ required: true })
  modelId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: ['new', 'after_used', 'after_shop'], required: true })
  quality: string;

  @Prop({ enum: ['pre_order', 'in_stock'], required: true })
  availability: string;

  @Prop({
    enum: ['notebook', 'macbook', 'device', 'accessories'],
    required: true,
  })
  type: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  images: string[];

  @Prop({ required: true })
  createDate: number;

  @Prop()
  publicationDate: number;

  @Prop({
    enum: [
      'created',
      'published',
      'reserved',
      'sold',
      'pre_ordered',
      'hidden',
      'delivery',
      'deleted',
    ],
    required: true,
  })
  status: string;

  @Prop()
  viewersCounter: number;
}

export const EntitySchema = SchemaFactory.createForClass(Entity);
