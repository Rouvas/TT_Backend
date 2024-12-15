import { Types } from "mongoose";

export interface TokenDto {
  fullName: string;
  phone: string;
  email: string;
  _id: Types.ObjectId;
}
