import { HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import {
  Entity,
  EntityDocument,
} from '../../../../common/schemas/entity.schema';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import { Response } from 'express';
import { EntityDto } from '../dto/entity.dto';
import { Brand, BrandDocument } from '../../../../common/schemas/brand.schema';
import {
  Model as BrandModel,
  ModelDocument,
} from '../../../../common/schemas/model.schema';

@Injectable()
export class EntityService {
  constructor(
    @InjectModel(Entity.name) private _entityModel: Model<EntityDocument>,
    @InjectModel(Brand.name) private _brandModel: Model<BrandDocument>,
    @InjectModel(BrandModel.name) private _modelModel: Model<ModelDocument>,
  ) {}

  async getEntity(param: string, res: Response) {
    try {
      const entity = await this._entityModel.findById(param)
        .populate('brand')
        .populate('model');

      if (entity) {
        return res.status(HttpStatus.OK).json(entity);
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

  patchEntity() {}

  async postEntity(dto: EntityDto, res: Response) {
    try {
      const { brandId, modelId } = dto;

      // Получаем названия бренда и модели
      const brand = await this._brandModel.findById(brandId).exec();
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }

      const model = await this._modelModel.findById(modelId).exec();
      if (!model) {
        throw new NotFoundException('Model not found');
      }

      // Генерируем базовый slug
      const baseSlug = slugify(`${brand.name}-${model.name}`, {
        lower: true,
        strict: true, // Удаляет символы, кроме букв, цифр и тире
      });

      let uniqueSlug = baseSlug;
      let suffix = 1;

      // Проверяем уникальность slug
      while (await this._entityModel.exists({ seoIdentifier: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${suffix}`;
        suffix++;
      }

      const newModel = await this._entityModel.create({
        ...dto,
        seoIdentifier: uniqueSlug,
      });

      return res.status(HttpStatus.CREATED).json({
        message: 'Успешно создано',
        id: newModel._id,
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e.message);
    }
  }
}
