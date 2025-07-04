import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ModelDocument = Model & Document;

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
export class Model {
  @Prop({ type: Types.ObjectId, ref: 'Brand', required: true })
  brandId: Types.ObjectId;

  @Prop({ required: true })
  name: string;
}

export const ModelSchema = SchemaFactory.createForClass(Model);
