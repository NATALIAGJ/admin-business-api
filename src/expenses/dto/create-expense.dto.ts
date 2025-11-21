import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { PaymentStatus } from '../../common/enums/payment-status.enum';

export class CreateExpenseDto {
  @IsUUID()
  providerId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;
}

