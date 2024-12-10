import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Entity,
  EntityDocument,
} from '../../../../common/schemas/entity.schema';
import { Response } from 'express';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectModel(Entity.name)
    private _entityModel: Model<EntityDocument>,
  ) {}

  async getEntities(res: Response) {
    const entities = await this._entityModel.find()
      .populate('brand')
      .populate('model');
    if (entities) {
      return res.status(HttpStatus.OK).json(entities);
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
