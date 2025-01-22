import { Module } from '@nestjs/common';
import { BankController } from './bank.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BankOperation,
  BankOperationSchema,
} from '../../../common/schemas/bank-operation.schema';
import { BankOperationsService } from './services/bank-operations.service';
import { BankOperationService } from './services/bank-operation.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'DEV',
      signOptions: {
        expiresIn: '24h',
      },
    }),
    MongooseModule.forFeature([
      { name: BankOperation.name, schema: BankOperationSchema },
    ]),
  ],
  controllers: [BankController],
  providers: [BankOperationsService, BankOperationService],
})
export class BankModule {}
