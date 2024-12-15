import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, ModelSchema } from '../../../common/schemas/model.schema';
import { ModelsService } from './services/models.service';
import { ModelService } from './services/model.service';
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
    MongooseModule.forFeature([{ name: Model.name, schema: ModelSchema }]),
  ],
  controllers: [ModelsController],
  providers: [ModelsService, ModelService, AuthGuard],
})
export class ModelsModule {}
