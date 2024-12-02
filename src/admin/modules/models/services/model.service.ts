import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  Model as BrandModel,
  ModelDocument,
} from '../../../../common/schemas/model.schema';
import { Model, Types } from "mongoose";
import { Response } from "express";
import { ModelDto } from "../dto/model.dto";


@Injectable()
export class ModelService {
  constructor(
    @InjectModel(BrandModel.name) private _modelModel: Model<ModelDocument>,
  ) {}

  async getModel(param: string, res: Response) {
    try {
      const entity = await this._modelModel.findById(param);

      if (entity) {
        return res.status(HttpStatus.OK).json(entity);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Модель не найдена' });
      }
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Модель не найдена' });
    }
  }

  async createModel(dto: ModelDto, res: Response) {
    try {
      const newModel = await this._modelModel.create({
        ...dto,
        brandId: new Types.ObjectId(dto.brandId),
      });

      return res.status(HttpStatus.CREATED).json({
        message: 'Успешно создано',
        id: newModel._id,
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e.message);
    }
  }

  async patchModel(id: string, editedModel: ModelDto, res: Response) {
    if (Object.keys(editedModel).length === 0)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Незаполнены поля' });
    try {
      const brand = await this._modelModel.findByIdAndUpdate(id, editedModel);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Успешно изменено', id: brand._id });
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Объект не найден', error: e.message });
    }
  }
}
