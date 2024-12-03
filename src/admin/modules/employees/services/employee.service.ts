import { HttpStatus, Injectable } from '@nestjs/common';
import { EmployeeDto } from '../dto/employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'express';
import {
  Employee,
  EmployeeDocument,
} from '../../../../common/schemas/employee.schema';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private _employeeModel: Model<EmployeeDocument>,
  ) {}

  async getEmployee(id: string, res: Response) {
    try {
      const entity = await this._employeeModel.findById(id);

      if (entity) {
        return res.status(HttpStatus.OK).json(entity);
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Сотрудник не найден' });
      }
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Сотрудник не найден' });
    }
  }

  async patchEmployee(id: string, dto: EmployeeDto, res: Response) {
    if (Object.keys(dto).length === 0)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Незаполнены поля' });
    try {
      const brand = await this._employeeModel.findByIdAndUpdate(id, dto);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Успешно изменено', id: brand._id });
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Сотрудник не найден', error: e.message });
    }
  }

  patchSelfEmployee(dto: EmployeeDto) {
    return dto;
  }

  getSelfEmployee() {
    return 'Some me get';
  }

  async createEmployee(dto: EmployeeDto, res: Response) {
    try {
      const newEmployee = await this._employeeModel.create({
        ...dto,
        password: dto.password ? dto.password : null,
      });

      return res.status(HttpStatus.CREATED).json({
        message: 'Успешно создано',
        id: newEmployee._id,
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json(e.message);
    }
  }
}
