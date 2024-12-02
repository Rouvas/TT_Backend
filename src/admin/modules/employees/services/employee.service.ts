import { Injectable } from '@nestjs/common';
import { EmployeeDto } from '../dto/employee.dto';

@Injectable()
export class EmployeeService {
  getEmployee(id: string) {
    return `Some employee ${id}`;
  }

  patchEmployee(id: string) {
    return `Some employee patched ${id}`;
  }

  patchSelfEmployee(dto: EmployeeDto) {
    return dto;
  }

  getSelfEmployee() {
    return 'Some me get';
  }

  createEmployee(dto: EmployeeDto) {
    return dto;
  }
}
