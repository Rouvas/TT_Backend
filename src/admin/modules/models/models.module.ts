import { Module } from '@nestjs/common';
import { ModelsController } from './models.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Model, ModelSchema } from '../../../common/schemas/model.schema';
import { ModelsService } from './services/models.service';
import { ModelService } from './services/model.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Model.name, schema: ModelSchema }]),
  ],
  controllers: [ModelsController],
  providers: [ModelsService, ModelService],
})
export class ModelsModule {}
