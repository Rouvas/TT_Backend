import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Entity, EntityDocument } from '../../common/schemas/entity.schema';
import { Model } from 'mongoose';
import { Request, Response } from 'express';

@Injectable()
export class EntityService {
  constructor(
    @InjectModel(Entity.name) private _entityModel: Model<EntityDocument>,
  ) {}

  async getEntity(req: Request, param: string, res: Response) {
    try {
      const entity = await this._entityModel
        .findOne({ seoIdentifier: param })
        .populate('brand')
        .populate('model');

      const key = req.header('user-key');
      const ip = req.ip;

      if (key) {
        if (!entity.viewers.find((el) => el.ip === ip || el.key === key)) {
          entity.viewers.push({
            key: key.toString(),
            date: new Date().toJSON(),
            ip: ip,
          });
          entity.save();
        }
      }

      const jsonEntity = entity.toJSON();
      const transformedEntity = {
        seoIdentifier: jsonEntity.seoIdentifier,
        name: jsonEntity.name,
        brand: jsonEntity['brand'].name,
        model: jsonEntity['model'].name,
        price: jsonEntity.sellPrice,
        publicationDate: jsonEntity.publicationDate,
        parameters: jsonEntity.parameters,
        description: jsonEntity.description,
        images: jsonEntity.images,
        quality: jsonEntity.quality,
      };

      if (transformedEntity) {
        return res.status(HttpStatus.OK).json(transformedEntity);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Товар не найден' });
      }
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Товар не найден' });
    }
  }
}
