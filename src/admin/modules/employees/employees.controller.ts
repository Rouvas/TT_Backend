import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { EmployeesService } from './services/employees.service';
import { EmployeeService } from './services/employee.service';
import { EmployeeDto } from "./dto/employee.dto";

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
  postEmployee(@Body() employeeDto: EmployeeDto) {
    return this._employee.createEmployee(employeeDto);
  }

  @Get()
  getAllEmployees() {
    return this._employees.getEmployees();
  }

  @Get(':id')
  getEmployee(@Param('id') id: string) {
    return this._employee.getEmployee(id);
  }

  @Patch(':id')
  patchEmployee(@Body() employeeDto: EmployeeDto) {
    return this._employee.patchEmployee(employeeDto);
  }
}
