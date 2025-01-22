import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  BankOperation,
  BankOperationDocument,
} from '../../../../common/schemas/bank-operation.schema';
import { Model } from 'mongoose';

@Injectable()
export class BankOperationsService {
  constructor(
    @InjectModel(BankOperation.name)
    private _bankOperationModel: Model<BankOperationDocument>,
  ) {}

  getOperations() {}
}
