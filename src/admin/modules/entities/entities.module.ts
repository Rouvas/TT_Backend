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
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../../guards/auth.guard';
import { EntityStickerService } from "../../../common/services/entity-sticker.service";

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'DEV',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    MongooseModule.forFeature([
      { name: Entity.name, schema: EntitySchema },
      { name: Brand.name, schema: BrandSchema },
      { name: Model.name, schema: ModelSchema },
      { name: EntityParameterValue.name, schema: EntityParameterValueSchema },
    ]),
  ],
  controllers: [EntitiesController],
  providers: [EntitiesService, EntityService, AuthGuard, EntityStickerService],
})
export class EntitiesModule {}
