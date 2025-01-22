import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { Response } from 'express';
import { CreateOperationDto } from './dto/NewOperation.dto';

@Controller('admin/bank')
export class BankController {
  @Get()
  @UseGuards(AuthGuard)
  getAllOperations(@Res() res: Response) {
    // Возврат всех операций
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getOperation(@Param('id') id: string, @Res() res: Response) {
    // Возврат операции
  }

  @Post()
  @UseGuards(AuthGuard)
  createOperation(
    @Body() newOperation: CreateOperationDto,
    @Res() res: Response,
  ) {
    // Создание новой операции
  }
}
