import { Body, Controller, Get, Param, Patch, Post, Res } from "@nestjs/common";
import { EntityService } from './services/entity.service';
import { EntitiesService } from './services/entities.service';
import { Response } from 'express';
import { EntityDto } from "./dto/entity.dto";

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

  @Patch(':id')
  patchEntity(@Param('id') id: string, @Body() newEntity: EntityDto, @Res() res: Response) {

  }
}
