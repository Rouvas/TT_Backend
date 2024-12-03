import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Employee,
  EmployeeDocument,
} from '../../../../common/schemas/employee.schema';
import { Model } from 'mongoose';
import { Response } from 'express';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name)
    private _employeeModel: Model<EmployeeDocument>,
  ) {}

  async getEmployees(res: Response) {
    const brands = await this._employeeModel.find();
    if (brands) {
      return res.status(HttpStatus.OK).json(brands);
    } else {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
