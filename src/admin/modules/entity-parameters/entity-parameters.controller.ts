import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { EntityParametersService } from './services/entity-parameters.service';
import { EntityParameterService } from './services/entity-parameter.service';
import { Response } from 'express';
import { EntityParameterDto } from './dto/entity-parameter.dto';

@Controller('admin/common/entity/parameters')
export class EntityParametersController {
  constructor(
    private _parameters: EntityParametersService,
    private _parameter: EntityParameterService,
  ) {}

  @Get()
  getEntities(@Query('entityType') entityType: string, @Res() res: Response) {
    return this._parameters.getParameters(entityType, res);
  }

  @Post()
  createParameter(
    @Body() newParameter: EntityParameterDto,
    @Res() res: Response,
  ) {
    return this._parameter.createNewParameter(newParameter, res);
  }
}
