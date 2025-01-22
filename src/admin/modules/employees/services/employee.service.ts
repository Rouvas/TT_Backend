import { HttpStatus, Injectable } from '@nestjs/common';
import { EmployeeDto } from '../dto/employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request, Response } from 'express';
import {
  Employee,
  EmployeeDocument,
} from '../../../../common/schemas/employee.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private _employeeModel: Model<EmployeeDocument>,
  ) {}

  async getEmployee(id: string, res: Response) {
    try {
      const employee = await this._employeeModel.findById(id);

      if (employee) {
        return res.status(HttpStatus.OK).json({
          fullName: employee.fullName,
          email: employee.email,
          phone: employee.phone,
          id: employee._id,
        });
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Сотрудник не найден', details: null });
      }
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Сотрудник не найден', details: e.message });
    }
  }

  async patchEmployee(id: string, dto: EmployeeDto, res: Response) {
    if (Object.keys(dto).length === 0)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Незаполнены поля' });
    try {
      if (dto.password) {
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(dto.password, salt);
        const employee = await this._employeeModel.findByIdAndUpdate(id, {
          ...dto,
          password: password,
        });
        return res
          .status(HttpStatus.OK)
          .json({ message: 'Успешно изменено', id: employee._id });
      } else {
        const employee = await this._employeeModel.findByIdAndUpdate(id, dto);
        return res
          .status(HttpStatus.OK)
          .json({ message: 'Успешно изменено', id: employee._id });
      }
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Сотрудник не найден', error: e.message });
    }
  }

  async patchSelfEmployee(dto: EmployeeDto, req: Request, res: Response) {
    if (Object.keys(dto).length === 0)
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Незаполнены поля' });
    try {
      const employee = await this._employeeModel.findById(req['user']['id']);
      const foundEmployee = await this._employeeModel.findByIdAndUpdate(
        employee,
        { fullName: dto.fullName, email: dto.email, phone: dto.phone },
      );
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Успешно изменено', id: foundEmployee._id });
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Сотрудник не найден', error: e.message });
    }
  }

  async getSelfEmployee(req: Request, res: Response) {
    try {
      const employee = await this._employeeModel.findById(req['user']['id']);

      if (employee) {
        return res.status(HttpStatus.OK).json({
          email: employee.email,
          phone: employee.phone,
          fullName: employee.fullName,
          id: employee._id,
        });
      } else {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Сотрудник не найден' });
      }
    } catch (e) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Сотрудник не найден', details: e.message });
    }
  }

  async createEmployee(dto: EmployeeDto, res: Response) {
    try {
      const salt = await bcrypt.genSalt(10);
      const password = await bcrypt.hash(dto.password, salt);

      const newEmployee = await this._employeeModel.create({
        ...dto,
        password: dto.password ? password : null,
      });

      return res.status(HttpStatus.CREATED).json({
        message: 'Успешно создано',
        id: newEmployee._id,
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Произошла ошибка при создании сотрудника',
        details: e.message,
      });
    }
  }
}
