import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { EmployeesService } from './services/employees.service';
import { EmployeeService } from './services/employee.service';
import { EmployeeDto } from './dto/employee.dto';
import { Response } from 'express';

@Controller('admin/employees')
export class EmployeesController {
  constructor(
    private _employees: EmployeesService,
    private _employee: EmployeeService,
  ) {}

  @Get('me')
  getSelfEmployee() {
    return this._employee.getSelfEmployee();
  }

  @Patch('me')
  patchSelfEmployee(@Body() employeeDto: EmployeeDto) {
    return this._employee.patchSelfEmployee(employeeDto);
  }

  @Post()
  postEmployee(@Body() employeeDto: EmployeeDto, @Res() res: Response) {
    return this._employee.createEmployee(employeeDto, res);
  }

  @Get()
  getAllEmployees(@Res() res: Response) {
    return this._employees.getEmployees(res);
  }

  @Get(':id')
  getEmployee(@Param('id') id: string, @Res() res: Response) {
    return this._employee.getEmployee(id, res);
  }

  @Patch(':id')
  patchEmployee(
    @Param('id') id: string,
    @Body() employeeDto: EmployeeDto,
    @Res() res: Response,
  ) {
    return this._employee.patchEmployee(id, employeeDto, res);
  }
}
