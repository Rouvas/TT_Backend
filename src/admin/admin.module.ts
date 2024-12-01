import { Module } from '@nestjs/common';
import { EmployeesModule } from './modules/employees/employees.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { EntitiesModule } from './modules/entities/entities.module';

@Module({
  imports: [EmployeesModule, AuthorizationModule, EntitiesModule],
})
export class AdminModule {}
