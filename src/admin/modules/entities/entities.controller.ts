import { Controller, Get, Param, Patch, Post, Res } from "@nestjs/common";
import { EntityService } from './services/entity.service';
import { EntitiesService } from './services/entities.service';
import { Response } from "express";

@Controller('entities')
export class EntitiesController {
  constructor(
    private _entity: EntityService,
    private _entities: EntitiesService,
  ) {}

  @Get()
  getEntities(@Res() res: Response) {}

  @Get(':id')
  getEntity(@Param('id') id: string, @Res() res: Response) {}

  @Post()
  createEntity(@Res() res: Response) {}

  @Patch(':id')
  patchEntity(@Param('id') id: string, @Res() res: Response) {}
}
