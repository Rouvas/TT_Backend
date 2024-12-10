import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Entity, EntityDocument } from '../../common/schemas/entity.schema';
import { Model } from 'mongoose';
import e, { Response } from 'express';

@Injectable()
export class EntitiesService {
  constructor(
    @InjectModel(Entity.name)
    private _entityModel: Model<EntityDocument>,
  ) {}

  async getEntities(res: Response) {
    const entities = await this._entityModel
      .find({ status: 'published' })
      .populate('brand')
      .populate('model')
      .lean();

    const transformedEntities = entities.map((entity) => {
      return {
        seoIdentifier: entity.seoIdentifier,
        name: entity.name,
        brand: entity['brand'].name,
        model: entity['model'].name,
        price: entity.sellPrice,
        publicationDate: entity.publicationDate,
        parameters: entity.parameters,
        description: entity.description,
        images: entity.images,
        quality: entity.quality,
      };
    });

    if (transformedEntities) {
      return res.status(HttpStatus.OK).json(transformedEntities);
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
