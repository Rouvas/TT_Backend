import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Model, SchemaTypes, Types } from 'mongoose';
import slugify from 'slugify';
import { Brand, BrandSchema } from "./brand.schema";
import { Model as BrandModel, ModelSchema } from "./model.schema";

@Schema({
  _id: false,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
  toObject: { virtuals: true },
})
export class EntityParameterValue {
  @Prop({ required: true })
  parameterId: string; // Ссылка на id из EntityParameter

  @Prop({ required: true, type: SchemaTypes.Mixed })
  value: string | number | string[] | number[]; // Для select_many может быть массивом id
}

export const EntityParameterValueSchema =
  SchemaFactory.createForClass(EntityParameterValue);

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

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Brand', required: true })
  brandId: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Model', required: true })
  modelId: Types.ObjectId;

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
  sellPrice: number;

  @Prop({ required: true })
  sellPriceMarket: number;

  @Prop({ required: true })
  boughtPrice: number;

  @Prop()
  images: string[];

  @Prop({ type: Date, default: null })
  publicationDate: Date | null;

  @Prop()
  market_sku: string;

  @Prop({ type: [EntityParameterValueSchema], default: [] })
  parameters: EntityParameterValue[];

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
    default: 'created',
  })
  status: string;

  @Prop()
  viewers: { date: string; key: string }[];
}

export const EntitySchema = SchemaFactory.createForClass(Entity);

// Виртуальные поля для популяции Brand и Model
EntitySchema.virtual('brand', {
  ref: 'Brand',
  localField: 'brandId',
  foreignField: '_id',
  justOne: true,
});

EntitySchema.virtual('model', {
  ref: 'Model',
  localField: 'modelId',
  foreignField: '_id',
  justOne: true,
});

EntitySchema.set('toObject', { virtuals: true });
EntitySchema.set('toJSON', { virtuals: true });