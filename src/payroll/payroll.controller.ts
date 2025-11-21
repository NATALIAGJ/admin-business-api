import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PayrollService } from './payroll.service';
import { CreateWorkLogDto } from './dto/create-work-log.dto';
import { UpdateWorkLogDto } from './dto/update-work-log.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { CurrentCompanyId } from '../common/decorators/company.decorator';

@Controller('payroll')
@UseGuards(JwtAuthGuard, CompanyGuard)
export class PayrollController {
  private readonly logger = new Logger(PayrollController.name);

  constructor(private readonly payrollService: PayrollService) {}

  @Post('work-logs')
  createWorkLog(
    @CurrentCompanyId() companyId: string,
    @Body() createWorkLogDto: CreateWorkLogDto,
  ) {
    this.logger.log(`📝 POST /payroll/work-logs - CompanyId: ${companyId}, EmployeeId: ${createWorkLogDto.employeeId}`);
    return this.payrollService.create(companyId, createWorkLogDto);
  }

  @Get('work-logs')
  findAll(
    @CurrentCompanyId() companyId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    this.logger.log(`📋 GET /payroll/work-logs - CompanyId: ${companyId}, From: ${from || 'N/A'}, To: ${to || 'N/A'}`);
    return this.payrollService.findAll(companyId, from, to);
  }

  @Get('work-logs/:id')
  findOne(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🔍 GET /payroll/work-logs/${id} - CompanyId: ${companyId}`);
    return this.payrollService.findOne(companyId, id);
  }

  @Patch('work-logs/:id')
  update(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
    @Body() updateWorkLogDto: UpdateWorkLogDto,
  ) {
    this.logger.log(`✏️  PATCH /payroll/work-logs/${id} - CompanyId: ${companyId}`);
    return this.payrollService.update(companyId, id, updateWorkLogDto);
  }

  @Delete('work-logs/:id')
  remove(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🗑️  DELETE /payroll/work-logs/${id} - CompanyId: ${companyId}`);
    return this.payrollService.remove(companyId, id);
  }

  @Get('employees/:employeeId/summary')
  summary(
    @CurrentCompanyId() companyId: string,
    @Param('employeeId') employeeId: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    this.logger.log(`📊 GET /payroll/employees/${employeeId}/summary - CompanyId: ${companyId}, From: ${from || 'N/A'}, To: ${to || 'N/A'}`);
    return this.payrollService.generatePayroll(companyId, employeeId, from, to);
  }
}

