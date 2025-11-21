import { IsDateString, IsUUID } from 'class-validator';

export class CreateWorkLogDto {
  @IsUUID()
  employeeId: string;

  @IsDateString()
  clockIn: string;

  @IsDateString()
  clockOut: string;
}

