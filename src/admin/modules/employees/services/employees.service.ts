import { Injectable } from '@nestjs/common';

@Injectable()
export class EmployeesService {
  getEmployees() {
    return 'Many employees';
  }
}
