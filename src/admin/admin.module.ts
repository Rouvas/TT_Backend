import { Module } from '@nestjs/common';
import { EmployeesModule } from './modules/employees/employees.module';
import { AuthorizationModule } from './modules/authorization/authorization.module';
import { EntitiesModule } from './modules/entities/entities.module';
import { BrandsModule } from './modules/brands/brands.module';
import { ModelsModule } from './modules/models/models.module';

@Module({
  imports: [EmployeesModule, AuthorizationModule, EntitiesModule, BrandsModule, ModelsModule],
})
export class AdminModule {}
