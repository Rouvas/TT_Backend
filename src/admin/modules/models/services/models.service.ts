import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import {
  Model as BrandModel,
  ModelDocument,
} from '../../../../common/schemas/model.schema';
import { Model } from 'mongoose';

@Injectable()
export class ModelsService {
  constructor(
    @InjectModel(BrandModel.name) private _modelModel: Model<ModelDocument>,
  ) {}

  async getModels(res: Response) {
    const models = await this._modelModel.find();
    if (models) {
      return res.status(HttpStatus.OK).json(models);
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
