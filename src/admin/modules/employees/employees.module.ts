import { Module } from '@nestjs/common';
import {
  Employee,
  EmployeeSchema,
} from '../../../common/schemas/employee.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './services/employees.service';
import { EmployeeService } from './services/employee.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from '../../guards/auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'DEV',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeeService, AuthGuard],
})
export class EmployeesModule {}
