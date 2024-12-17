import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors
} from "@nestjs/common";
import { EntityService } from './services/entity.service';
import { EntitiesService } from './services/entities.service';
import { Response } from 'express';
import { EntityDto } from './dto/entity.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage, memoryStorage } from "multer";
import { extname } from 'path';

import { EntityImagePositionDto } from './dto/entity-image-position.dto';

@Controller('admin/entities')
export class EntitiesController {
  constructor(
    private _entity: EntityService,
    private _entities: EntitiesService,
  ) {}

  @Get()
  getEntities(@Res() res: Response) {
    return this._entities.getEntities(res);
  }

  @Get(':id')
  getEntity(@Param('id') id: string, @Res() res: Response) {
    return this._entity.getEntity(id, res);
  }

  @Post()
  postEntity(@Body() newEntity: EntityDto, @Res() res: Response) {
    return this._entity.postEntity(newEntity, res);
  }

  @Post(':id/images')
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: memoryStorage(), // Временное хранение в памяти
      limits: { fileSize: 10 * 1024 * 1024 }, // Максимальный размер файла 10MB
      fileFilter: (req, file, callback) => {
        // Разрешенные типы файлов
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          callback(null, true);
        } else {
          callback(new BadRequestException('Недопустимый тип файла'), false);
        }
      },
    }),
  )
  postImagesIntoEntity(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() res: Response,
  ) {
    if (!files || files.length === 0) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Файлы не загружены' });
    }
    return this._entity.checkEntityAndSaveFilesIntoStorage(id, files, res);
  }


  @Post(':id/images/position')
  postChangeImagesPosition(
    @Param('id') id: string,
    @Body() dto: EntityImagePositionDto,
    @Res() res: Response,
  ) {
    return this._entity.postEntityImagesPositions(dto, id, res);
  }

  @Patch(':id')
  patchEntity(
    @Param('id') id: string,
    @Body() newEntity: EntityDto,
    @Res() res: Response,
  ) {}

  @Get(':id/sticker')
  getEntitySticker(@Param('id') id: string, @Res() res: Response,) {
    return this._entity.getEntitySticker(id, res);
  }
}
