import { Module } from '@nestjs/common';
import { AuthorizationController } from './authorization.controller';
import { AuthorizationService } from './services/authorization.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Employee,
  EmployeeSchema,
} from '../../../common/schemas/employee.schema';
import { Session, SessionSchema } from '../../../common/schemas/session.schema';
import { JwtModule } from '@nestjs/jwt';
import { ResetPassword, ResetPasswordSchema } from "../../../common/schemas/reset-password.schema";

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
      { name: Session.name, schema: SessionSchema },
      { name: ResetPassword.name, schema: ResetPasswordSchema },
    ]),
  ],
  controllers: [AuthorizationController],
  providers: [AuthorizationService],
})
export class AuthorizationModule {}
