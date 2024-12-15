import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { BrandService } from './services/brand.service';
import { BrandsService } from './services/brands.service';
import { BrandDto } from './dto/brand.dto';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('admin/common/entity/brands')
export class BrandsController {
  constructor(
    private _brand: BrandService,
    private _brands: BrandsService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllBrands(@Res() res: Response) {
    return this._brands.getBrands(res);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getEntityById(@Param('id') id: string, @Res() res: Response) {
    return this._brand.getBrand(id, res);
  }

  @Get(':id/models')
  @UseGuards(AuthGuard)
  getModelsByBrandId(@Param('id') id: string, @Res() res: Response) {
    return this._brand.getModelsByBrand(id, res);
  }

  @Post()
  @UseGuards(AuthGuard)
  postBrand(@Body() newBrand: BrandDto, @Res() res: Response) {
    return this._brand.createBrand(newBrand, res);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  patchBrand(
    @Param('id') id: string,
    @Body() brand: BrandDto,
    @Res() res: Response,
  ) {
    return this._brand.patchBrand(id, brand, res);
  }
}
