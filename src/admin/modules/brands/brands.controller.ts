import { Body, Controller, Get, Param, Patch, Post, Res } from "@nestjs/common";
import { Response } from 'express';
import { BrandService } from './services/brand.service';
import { BrandsService } from './services/brands.service';
import { BrandDto } from "./dto/brand.dto";

@Controller('admin/common/entity/brands')
export class BrandsController {
  constructor(
    private _brand: BrandService,
    private _brands: BrandsService,
  ) {}

  @Get()
  getAllBrands(@Res() res: Response) {
    return this._brands.getBrands(res);
  }

  @Get(':id')
  getEntityById(@Param('id') id: string, @Res() res: Response) {
    return this._brand.getBrand(id, res);
  }

  @Get(':id/models')
  getModelsByBrandId(@Param('id') id: string, @Res() res: Response) {
    return this._brand.getModelsByBrand(id, res);
  }

  @Post()
  postBrand(@Body() newBrand: BrandDto, @Res() res: Response) {
    return this._brand.createBrand(newBrand, res);
  }

  @Patch(':id')
  patchBrand(
    @Param('id') id: string,
    @Body() brand: BrandDto,
    @Res() res: Response,
  ) {
    return this._brand.patchBrand(id, brand, res);
  }
}
