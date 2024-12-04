import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SessionDocument = Session & Document;

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
export class Session {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiredTime: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
