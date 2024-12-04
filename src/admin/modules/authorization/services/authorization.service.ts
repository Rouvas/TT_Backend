import { Body, HttpStatus, Injectable, Req, Res } from '@nestjs/common';
import { ResetDto } from '../dto/reset.dto';
import { Response, Request } from 'express';
import { LoginDto } from '../dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import {
  Employee,
  EmployeeDocument,
} from '../../../../common/schemas/employee.schema';
import { Model, Types } from "mongoose";
import { Session, SessionDocument } from "../../../../common/schemas/session.schema";
import { JwtService } from '@nestjs/jwt';
import { EmployeeDto } from '../../employees/dto/employee.dto';
import { CompleteResetDto } from '../dto/complete-reset.dto';
import { ResetPassword, ResetPasswordDocument } from "../../../../common/schemas/reset-password.schema";
import { generateSecureRandomInteger } from "../../../../common/functions/generate-secure-random-integer";

@Injectable()
export class AuthorizationService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Employee.name)
    private _employeeModel: Model<EmployeeDocument>,
    @InjectModel(Session.name)
    private _sessionModel: Model<SessionDocument>,
    @InjectModel(ResetPassword.name)
    private _resetPasswordModel: Model<ResetPasswordDocument>,
  ) {}

  async loginUser(@Req() req: Request, @Body() dto: LoginDto, @Res() res: Response) {
    const key = req.header('user-key');
    if ((!dto.email && !dto.phone) || !key) return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Ошибка авторизации' });

    const findBy = dto.email ? { email: dto.email } : { phone: dto.phone };

    const employee = await this._employeeModel.findOne(findBy);
    if (!employee) return res.status(HttpStatus.NOT_FOUND).json({ message: 'Сотрудник не найден' });

    if (!employee.password) return res.status(HttpStatus.FORBIDDEN).json({ message: 'Сотрудник не активирован' });

    const passwordEqual = await bcrypt.compare(dto.password, employee.password);
    if (!passwordEqual) return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Введен неверный пароль' });

    const expiredTime = new Date().getTime() + 604800000;

    const accessToken = this.generateToken(employee);

    try {
      await this._sessionModel.create({key: key, user: employee._id, token: accessToken,  expiredTime: expiredTime});
      return res.status(HttpStatus.ACCEPTED).json({ message: 'Успешно авторизован', expiredTime: expiredTime, accessToken: accessToken });
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Произошла неизвестная ошибка' });
    }

  }

  async resetPassword(@Req() req: Request, @Body() dto: ResetDto, @Res() res: Response) {
    const key = req.header('user-key');
    if (!key) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Ошибка авторизации' });
    }

    const findBy = dto.email ? { email: dto.email } : { phone: dto.phone };
    const employee = await this._employeeModel.findOne(findBy);
    if (!employee) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Сотрудник не найден' });
    }

    const lastResets = await this._resetPasswordModel
      .find({ user: employee._id, used: false })
      .sort({ createdAt: -1 });

    if (lastResets.length > 0) {
      const lastReset = lastResets[0];
      const attemptsCount = lastResets.length;
      const delayMultiplier = Math.pow(2, attemptsCount - 1); // Увеличение времени в два раза за каждую попытку
      const requiredDelay = 60000 * delayMultiplier; // Базовое время 1 минута, увеличивается в зависимости от количества попыток

      const timeDifference = Date.now() - new Date(lastReset.toJSON()['createdAt']).getTime();
      if (timeDifference < requiredDelay) {
        return res.status(HttpStatus.TOO_MANY_REQUESTS).json({
          message: `Повторная отправка возможна через ${Math.ceil((requiredDelay - timeDifference) / 60000)} минут`,
        });
      }
    }

    const code = generateSecureRandomInteger(100000, 999999);

    try {
      await this._resetPasswordModel.create({ key: key, user: employee._id, code: code });

      // Тут прикрутить отправку кода на почту

      return res.status(HttpStatus.ACCEPTED).json({ message: 'Письмо отправлено на почту', devCode: code });
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Произошла неизвестная ошибка' });
    }
  }

  async completeResetPassword(@Req() req: Request, @Body() dto: CompleteResetDto, @Res() res: Response)  {
    const key = req.header('user-key');
    if (!key) return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Ошибка авторизации' });

    const findBy = dto.email ? { email: dto.email } : { phone: dto.phone };

    const employee = await this._employeeModel.findOne(findBy);
    if (!employee) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Сотрудник не найден' });
    }

    const lastReset = await this._resetPasswordModel
      .findOne({ user: employee._id, key: key, used: false })
      .sort({ createdAt: -1 });

    if (!lastReset || lastReset.code !== parseInt(dto.code)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Неверный или устаревший код сброса' });
    }

    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      employee.password = hashedPassword;
      await employee.save();

      lastReset.used = true;
      await lastReset.save();

      return res.status(HttpStatus.OK).json({ message: 'Пароль успешно изменен' });
    } catch (e) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Произошла неизвестная ошибка' });
    }
  }

  async generateToken(employee: EmployeeDto) {
    const payload = {
      email: employee.email,
      phone: employee.phone,
      fullName: employee.fullName,
    };
    return this.jwtService.sign(payload);
  }
}
