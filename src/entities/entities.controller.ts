import { Controller, Get, Param, Req } from "@nestjs/common";

@Controller('entities')
export class EntitiesController {

  // Get entities

  @Get()
  getAllEntities(@Req() request: Request): string {
    return 'This action returns all cats';
  }

  @Get(':id')
  getEntityById(@Param('id') id: string, @Req() request: Request): string {
    return `This action returns ${id}`;
  }

  @Get(':id/MarkAsViewed')
  markEntityAsViewed(@Param('id') id: string, @Req() request: Request): string {
    return 'This action returns all cats';
  }
}
