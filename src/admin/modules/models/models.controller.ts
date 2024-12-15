import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ModelService } from './services/model.service';
import { ModelsService } from './services/models.service';
import { ModelDto } from './dto/model.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('admin/common/entity/models')
export class ModelsController {
  constructor(
    private _model: ModelService,
    private _models: ModelsService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllModels(@Res() res: Response) {
    return this._models.getModels(res);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getModelById(@Param('id') id: string, @Res() res: Response) {
    return this._model.getModel(id, res);
  }

  @Post()
  @UseGuards(AuthGuard)
  postModel(@Body() newModel: ModelDto, @Res() res: Response) {
    return this._model.createModel(newModel, res);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  patchModel(
    @Param('id') id: string,
    @Body() model: ModelDto,
    @Res() res: Response,
  ) {
    return this._model.patchModel(id, model, res);
  }
}
