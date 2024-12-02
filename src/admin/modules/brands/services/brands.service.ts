import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { Model } from 'mongoose';
import { Brand, BrandDocument } from '../../../../common/schemas/brand.schema';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private _brandModel: Model<BrandDocument>,
  ) {}

  async getBrands(res: Response) {
    const brands = await this._brandModel.find();
    if (brands) {
      return res.status(HttpStatus.OK).json(brands);
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
