import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EntityParametersService } from './services/entity-parameters.service';
import { EntityParameterService } from './services/entity-parameter.service';
import { Response } from 'express';
import { EntityParameterDto } from './dto/entity-parameter.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('admin/common/entity/parameters')
export class EntityParametersController {
  constructor(
    private _parameters: EntityParametersService,
    private _parameter: EntityParameterService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  getEntities(@Query('entityType') entityType: string, @Res() res: Response) {
    return this._parameters.getParameters(entityType, res);
  }

  @Post()
  @UseGuards(AuthGuard)
  createParameter(
    @Body() newParameter: EntityParameterDto,
    @Res() res: Response,
  ) {
    return this._parameter.createNewParameter(newParameter, res);
  }
}
