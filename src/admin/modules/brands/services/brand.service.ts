import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Brand, BrandDocument } from '../../../../common/schemas/brand.schema';
import { Model } from 'mongoose';
import { Response } from 'express';
import { BrandDto } from '../dto/brand.dto';
import {
  Model as BrandModel,
  ModelDocument,
} from '../../../../common/schemas/model.schema';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(Brand.name) private _brandModel: Model<BrandDocument>,
    @InjectModel(BrandModel.name) private _modelModel: Model<ModelDocument>,
  ) {}

  async getBrand(param: string, res: Response) {
    try {
      const entity = await this._brandModel
        .findById(param)
        .populate('models')
        .exec();

      if (entity) {
        return res.status(HttpStatus.OK).json(entity);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Бренд не найден' });
      }
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Бренд не найден' });
    }
  }

  async createBrand(dto: BrandDto, res: Response) {
    try {
      const newBrand = await this._brandModel.create({
        ...dto,
      });

      await this._modelModel.create({
        name: 'Нет данных',
        brandId: newBrand._id,
      });

      return res.status(HttpStatus.CREATED).json({
        message: 'Успешно создано',
        id: newBrand._id,
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e.message);
    }
  }

  async patchBrand(id: string, editedBrand: BrandDto, res: Response) {
    if (Object.keys(editedBrand).length === 0)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Незаполнены поля' });
    try {
      const brand = await this._brandModel.findByIdAndUpdate(id, editedBrand);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Успешно изменено', id: brand._id });
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Объект не найден', error: e.message });
    }
  }

  async getModelsByBrand(id: string, res: Response) {
    try {
      const entity = await this._brandModel
        .findById(id)
        .populate('models')
        .exec();

      if (entity) {
        return res.status(HttpStatus.OK).json(entity.toJSON()['models']);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Бренд не найден' });
      }
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Бренд не найден' });
    }
  }
}
