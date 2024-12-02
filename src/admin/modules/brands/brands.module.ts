import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandSchema } from '../../../common/schemas/brand.schema';
import { Model, ModelSchema } from '../../../common/schemas/model.schema';
import { BrandsService } from './services/brands.service';
import { BrandService } from './services/brand.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Brand.name, schema: BrandSchema },
      { name: Model.name, schema: ModelSchema },
    ]),
  ],
  controllers: [BrandsController],
  providers: [BrandsService, BrandService],
})
export class BrandsModule {}
