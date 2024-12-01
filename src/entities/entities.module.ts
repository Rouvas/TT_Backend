import { Module } from '@nestjs/common';
import { EntitiesController } from './entities.controller';
import { EntityService } from './services/entity.service';
import { EntitiesService } from './services/entities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Entity, EntitySchema } from '../common/schemas/entity.schema';
import { Brand, BrandSchema } from '../common/schemas/brand.schema';
import { Model, ModelSchema } from '../common/schemas/model.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.name, schema: EntitySchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Model.name, schema: ModelSchema },
    ]),
  ],
  controllers: [EntitiesController],
  providers: [EntityService, EntitiesService],
})
export class EntitiesModule {}
