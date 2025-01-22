import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BankOperationDocument = BankOperation & Document;

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
export class BankOperation {
  @Prop({ required: true })
  amount: number;
  @Prop({ required: true })
  description: string;
  @Prop({ required: true, enum: ['plus', 'minus'] })
  type: string;
  @Prop({ required: true })
  creatorId: string;
}

export const BankOperationSchema = SchemaFactory.createForClass(BankOperation);

// Define the virtual field
BankOperationSchema.virtual('employees', {
  ref: 'Employee', // The model to use
  localField: '_id', // Find models where `brandId` equals `_id`
  foreignField: 'creatorId',
});
