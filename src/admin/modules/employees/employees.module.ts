import { Module } from '@nestjs/common';
import {
  Employee,
  EmployeeSchema,
} from '../../../common/schemas/employee.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './services/employees.service';
import { EmployeeService } from './services/employee.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeeService],
})
export class EmployeesModule {}
