import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsNumber()
  @IsPositive()
  hourlyRate: number;
}

