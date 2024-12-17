import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Entity,
  EntityDocument,
} from '../../../../common/schemas/entity.schema';
import { Model, Types } from 'mongoose';
import slugify from 'slugify';
import e, { Response } from 'express';
import { EntityDto } from '../dto/entity.dto';
import { Brand, BrandDocument } from '../../../../common/schemas/brand.schema';
import {
  Model as BrandModel,
  ModelDocument,
} from '../../../../common/schemas/model.schema';
import { EntityImagePositionDto } from '../dto/entity-image-position.dto';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { writeFile } from 'fs/promises';
import { EntityStickerService } from '../../../../common/services/entity-sticker.service';

@Injectable()
export class EntityService {
  constructor(
    @InjectModel(Entity.name) private _entityModel: Model<EntityDocument>,
    @InjectModel(Brand.name) private _brandModel: Model<BrandDocument>,
    @InjectModel(BrandModel.name) private _modelModel: Model<ModelDocument>,
    private _sticker: EntityStickerService,
  ) {}

  async getEntity(param: string, res: Response) {
    try {
      const entity = await this._entityModel
        .findById(param)
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

  async checkEntityAndSaveFilesIntoStorage(
    param: string,
    files: Express.Multer.File[],
    res: Response,
  ) {
    const entity = await this._entityModel.findById(param);

    if (!entity) {
      return res.status(404).json({ message: 'Товар не найден' });
    } else {
      const savedFilenames: string[] = [];

      for (const file of files) {
        // Генерация уникального имени файла
        const uniqueSuffix = uuidv4();
        const fileExtName = extname(file.originalname);
        const filename = `${uniqueSuffix}${fileExtName}`;

        const filePath = `./storage/${filename}`;

        try {
          // Сохранение файла на диск
          await writeFile(filePath, file.buffer);
          savedFilenames.push(filename);
        } catch (err) {
          // Обработка ошибок при сохранении файла
          return res
            .status(500)
            .json({ message: 'Ошибка при сохранении файла', detail: err });
        }
      }
      return res.status(200).json({ newFiles: savedFilenames });
    }
  }

  async postEntityImagesPositions(
    dto: EntityImagePositionDto,
    id: string,
    res: Response,
  ) {}

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

  async getEntitySticker(id: string, res: Response) {
    try {
      const entity = await this._entityModel
        .findById(id)
        .populate('brand')
        .populate('model');

      if (entity) {
        const pdfBuffer = await this._sticker.generateCard(
          {
            productId: entity.id,
            brand: 'Thunderobot',
            model: '911 X Wild Hunter G2',
            param1: 'I5-12450H',
            param2: '8 GB',
            param3: 'RTX 4050',
            param4: '512 GB',
          }
        );

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=card.pdf',
          'Content-Length': pdfBuffer.length,
        });
        return res.end(pdfBuffer);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Товар не найден' });
      }
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Товар не найден', details: e });
    }
  }
}
