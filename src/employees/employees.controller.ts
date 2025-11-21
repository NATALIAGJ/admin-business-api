import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { CurrentCompanyId } from '../common/decorators/company.decorator';

@Controller('employees')
@UseGuards(JwtAuthGuard, CompanyGuard)
export class EmployeesController {
  private readonly logger = new Logger(EmployeesController.name);

  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  create(
    @CurrentCompanyId() companyId: string,
    @Body() createEmployeeDto: CreateEmployeeDto,
  ) {
    this.logger.log(`📝 POST /employees - CompanyId: ${companyId}, Employee: ${createEmployeeDto.name}`);
    return this.employeesService.create(companyId, createEmployeeDto);
  }

  @Get()
  findAll(@CurrentCompanyId() companyId: string) {
    this.logger.log(`📋 GET /employees - CompanyId: ${companyId}`);
    return this.employeesService.findAll(companyId);
  }

  @Get(':id')
  findOne(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🔍 GET /employees/${id} - CompanyId: ${companyId}`);
    return this.employeesService.findOne(companyId, id);
  }

  @Patch(':id')
  update(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    this.logger.log(`✏️  PATCH /employees/${id} - CompanyId: ${companyId}`);
    return this.employeesService.update(companyId, id, updateEmployeeDto);
  }

  @Delete(':id')
  remove(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🗑️  DELETE /employees/${id} - CompanyId: ${companyId}`);
    return this.employeesService.remove(companyId, id);
  }
}

