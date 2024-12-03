import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EntityParameter,
  EntityParameterDocument,
} from '../../../../common/schemas/entity-parameter.schema';
import { Model } from 'mongoose';
import { Response } from 'express';
import { EntityParameterDto } from '../dto/entity-parameter.dto';

@Injectable()
export class EntityParameterService {
  constructor(
    @InjectModel(EntityParameter.name)
    private _entityParameterModel: Model<EntityParameterDocument>,
  ) {}

  async createNewParameter(dto: EntityParameterDto, res: Response) {
    try {
      const newEntityParameter = await this._entityParameterModel.create({
        ...dto,
      });

      return res.status(HttpStatus.CREATED).json({
        message: 'Успешно создано',
        id: newEntityParameter._id,
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e.message);
    }
  }
}
