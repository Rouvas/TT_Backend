import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmployeeDocument = Employee & Document;

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
export class Employee {
  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  fullName: string;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
