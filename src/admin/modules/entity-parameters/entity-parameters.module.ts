import { Module } from '@nestjs/common';
import { EntityParametersController } from './entity-parameters.controller';
import { EntityParametersService } from './services/entity-parameters.service';
import { EntityParameterService } from './services/entity-parameter.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EntityParameter,
  EntityParameterSchema,
  ValueVariant,
  ValueVariantSchema,
} from '../../../common/schemas/entity-parameter.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EntityParameter.name, schema: EntityParameterSchema },
      { name: ValueVariant.name, schema: ValueVariantSchema },
    ]),
  ],
  controllers: [EntityParametersController],
  providers: [EntityParametersService, EntityParameterService],
})
export class EntityParametersModule {}
