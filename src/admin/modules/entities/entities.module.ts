import { Module } from '@nestjs/common';
import { EntitiesController } from './entities.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Entity,
  EntityParameterValue,
  EntityParameterValueSchema,
  EntitySchema,
} from '../../../common/schemas/entity.schema';
import { Brand, BrandSchema } from '../../../common/schemas/brand.schema';
import { Model, ModelSchema } from '../../../common/schemas/model.schema';
import { EntitiesService } from './services/entities.service';
import { EntityService } from './services/entity.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entity.name, schema: EntitySchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Model.name, schema: ModelSchema },
      { name: EntityParameterValue.name, schema: EntityParameterValueSchema },
    ]),
  ],
  controllers: [EntitiesController],
  providers: [EntitiesService, EntityService],
})
export class EntitiesModule {}
