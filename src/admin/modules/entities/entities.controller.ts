import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { EntityService } from './services/entity.service';
import { EntitiesService } from './services/entities.service';
import { Response } from 'express';
import { EntityDto } from './dto/entity.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { EntityImagePositionDto } from './dto/entity-image-position.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('admin/entities')
export class EntitiesController {
  constructor(
    private _entity: EntityService,
    private _entities: EntitiesService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  getEntities(@Res() res: Response) {
    return this._entities.getEntities(res);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getEntity(@Param('id') id: string, @Res() res: Response) {
    return this._entity.getEntity(id, res);
  }

  @Post()
  @UseGuards(AuthGuard)
  postEntity(@Body() newEntity: EntityDto, @Res() res: Response) {
    return this._entity.postEntity(newEntity, res);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('image', 10, {
      // 'files' - имя поля формы, максимум 10 файлов
      storage: diskStorage({
        destination: './storage', // Папка для сохранения файлов
        filename: (req, file, cb) => {
          // Генерация уникального имени файла
          const uniqueSuffix = uuidv4();
          const fileExtName = extname(file.originalname);
          cb(null, `${uniqueSuffix}${fileExtName}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // Максимальный размер файла 5MB
      fileFilter: (req, file, callback) => {
        // Разрешенные типы файлов
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          callback(null, true);
        } else {
          callback(new Error('Недопустимый тип файла'), false);
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
    return res.status(200).json({ newImages: files.map((el) => el.filename) });
  }

  // postChangeImagesPosition(
  //   @Param('id') id: string,
  //   @Body() dto: EntityImagePositionDto,
  //   @Res() res: Response,
  // ) {
  //   return this._entity.postEntityImagesPositions(dto, id, res);
  // }

  @Patch(':id')
  @UseGuards(AuthGuard)
  patchEntity(
    @Param('id') id: string,
    @Body() newEntity: EntityDto,
    @Res() res: Response,
  ) {}
}
