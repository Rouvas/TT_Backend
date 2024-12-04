import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ResetPasswordDocument = ResetPassword & Document;

@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class ResetPassword {
  @Prop({ type: Types.ObjectId, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  code: number;

  @Prop({ default: false })
  used: boolean;
}

export const ResetPasswordSchema = SchemaFactory.createForClass(ResetPassword);
