import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './services/employees.service';
import { EmployeeService } from './services/employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { Request, Response } from 'express';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('admin/employees')
export class EmployeesController {
  constructor(
    private _employees: EmployeesService,
    private _employee: EmployeeService,
  ) {}

  @Get('me')
  @UseGuards(AuthGuard)
  getSelfEmployee(@Req() req: Request, @Res() res: Response) {
    return this._employee.getSelfEmployee(req, res);
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  patchSelfEmployee(@Req() req: Request, @Res() res: Response, @Body() employeeDto: EmployeeDto) {
    return this._employee.patchSelfEmployee(employeeDto, req, res);
  }

  @Post()
  @UseGuards(AuthGuard)
  postEmployee(@Body() employeeDto: EmployeeDto, @Res() res: Response) {
    return this._employee.createEmployee(employeeDto, res);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAllEmployees(@Res() res: Response) {
    return this._employees.getEmployees(res);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getEmployee(@Param('id') id: string, @Res() res: Response) {
    return this._employee.getEmployee(id, res);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  patchEmployee(
    @Param('id') id: string,
    @Body() employeeDto: EmployeeDto,
    @Res() res: Response,
  ) {
    return this._employee.patchEmployee(id, employeeDto, res);
  }
}
