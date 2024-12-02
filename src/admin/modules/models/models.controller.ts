import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ModelService } from './services/model.service';
import { ModelsService } from './services/models.service';
import { ModelDto } from './dto/model.dto';

@Controller('admin/models')
export class ModelsController {
  constructor(
    private _model: ModelService,
    private _models: ModelsService,
  ) {}

  @Get()
  getAllModels(@Res() res: Response) {
    return this._models.getModels(res);
  }

  @Get(':id')
  getModelById(@Param('id') id: string, @Res() res: Response) {
    return this._model.getModel(id, res);
  }

  @Post()
  postModel(@Body() newModel: ModelDto, @Res() res: Response) {
    return this._model.createModel(newModel, res);
  }

  @Patch(':id')
  patchModel(
    @Param('id') id: string,
    @Body() model: ModelDto,
    @Res() res: Response,
  ) {
    return this._model.patchModel(id, model, res);
  }
}
