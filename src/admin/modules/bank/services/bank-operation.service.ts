import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  BankOperation,
  BankOperationDocument,
} from '../../../../common/schemas/bank-operation.schema';

@Injectable()
export class BankOperationService {
  constructor(
    @InjectModel(BankOperation.name)
    private _bankOperationModel: Model<BankOperationDocument>,
  ) {}

  getOperation() {}

  createOperation() {}

  editOperation() {}

  deleteOperation() {}
}
