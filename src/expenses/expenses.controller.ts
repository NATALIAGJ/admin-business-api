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
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { CurrentCompanyId } from '../common/decorators/company.decorator';

@Controller('expenses')
@UseGuards(JwtAuthGuard, CompanyGuard)
export class ExpensesController {
  private readonly logger = new Logger(ExpensesController.name);

  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  create(
    @CurrentCompanyId() companyId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    this.logger.log(`📝 POST /expenses - CompanyId: ${companyId}, Amount: ${createExpenseDto.amount}`);
    return this.expensesService.create(companyId, createExpenseDto);
  }

  @Get()
  findAll(@CurrentCompanyId() companyId: string) {
    this.logger.log(`📋 GET /expenses - CompanyId: ${companyId}`);
    return this.expensesService.findAll(companyId);
  }

  @Get(':id')
  findOne(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🔍 GET /expenses/${id} - CompanyId: ${companyId}`);
    return this.expensesService.findOne(companyId, id);
  }

  @Patch(':id')
  update(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    this.logger.log(`✏️  PATCH /expenses/${id} - CompanyId: ${companyId}`);
    return this.expensesService.update(companyId, id, updateExpenseDto);
  }

  @Delete(':id')
  remove(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🗑️  DELETE /expenses/${id} - CompanyId: ${companyId}`);
    return this.expensesService.remove(companyId, id);
  }
}

