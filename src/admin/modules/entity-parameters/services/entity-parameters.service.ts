import { HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  EntityParameter,
  EntityParameterDocument,
} from '../../../../common/schemas/entity-parameter.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';

@Injectable()
export class EntityParametersService {
  constructor(
    @InjectModel(EntityParameter.name)
    private _entityParametersModel: Model<EntityParameterDocument>,
  ) {}

  async getParameters(entityType: string | undefined, res: Response) {
    let queryParams = {};
    if (entityType) {
      queryParams = { ...queryParams, entityType: entityType };
    }

    const entities = await this._entityParametersModel.find(queryParams);
    return res.status(HttpStatus.OK).json(entities);
  }
}
