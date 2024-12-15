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
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../../guards/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'DEV',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    MongooseModule.forFeature([
      { name: EntityParameter.name, schema: EntityParameterSchema },
      { name: ValueVariant.name, schema: ValueVariantSchema },
    ]),
  ],
  controllers: [EntityParametersController],
  providers: [EntityParametersService, EntityParameterService, AuthGuard],
})
export class EntityParametersModule {}
