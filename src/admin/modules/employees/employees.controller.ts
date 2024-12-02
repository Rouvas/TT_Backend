import { Controller, Get, Patch, Post } from "@nestjs/common";

@Controller('admin/employees')
export class EmployeesController {

  @Get('me')
  getSelfEmployee() {

  }

  @Patch('me')
  patchSelfEmployee() {

  }

  @Post()
  postEmployee() {

  }

  @Get()
  getAllEmployees() {

  }

  @Get(':id')
  getEmployee() {

  }

  @Patch('me')
  patchEmployee() {

  }

}
