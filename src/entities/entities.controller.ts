import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityService } from './services/entity.service';
import { EntitiesService } from './services/entities.service';

@Controller('entities')
export class EntitiesController {
  constructor(
    private _entity: EntityService,
    private _entities: EntitiesService,
  ) {}

  @Get()
  getAllEntities(@Res() res: Response) {
    return this._entities.getEntities(res);
  }

  @Get(':id')
  getEntityById(@Req() req: Request, @Param('id') id: string, @Res() res: Response) {
    return this._entity.getEntity(req, id, res);
  }
}
