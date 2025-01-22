import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type ValueVariantDocument = ValueVariant & Document;

@Schema({
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
export class ValueVariant {
  @Prop({ required: true, type: SchemaTypes.Mixed })
  value: string | number;
}

export const ValueVariantSchema = SchemaFactory.createForClass(ValueVariant);

export type EntityParameterDocument = EntityParameter & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
  toObject: { virtuals: true },
})
export class EntityParameter {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  label: string;

  @Prop()
  measure: string;

  @Prop({
    enum: ['select_many', 'select_one', 'input_number', 'input_text'],
    required: true,
  })
  type: string;

  @Prop({
    enum: ['notebook', 'macbook', 'device', 'accessories', 'all'],
    required: true,
  })
  entityType: string;

  @Prop({ type: [ValueVariantSchema], default: null })
  valuesVariants: ValueVariant[] | ValueVariant | null;
}

export const EntityParameterSchema =
  SchemaFactory.createForClass(EntityParameter);
