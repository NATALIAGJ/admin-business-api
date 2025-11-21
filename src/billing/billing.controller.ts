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
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { CurrentCompanyId } from '../common/decorators/company.decorator';

@Controller('billing')
@UseGuards(JwtAuthGuard, CompanyGuard)
export class BillingController {
  private readonly logger = new Logger(BillingController.name);

  constructor(private readonly billingService: BillingService) {}

  @Post('invoices')
  create(
    @CurrentCompanyId() companyId: string,
    @Body() createInvoiceDto: CreateInvoiceDto,
  ) {
    this.logger.log(`📝 POST /billing/invoices - CompanyId: ${companyId}, Client: ${createInvoiceDto.clientName}, Total: ${createInvoiceDto.total}`);
    return this.billingService.create(companyId, createInvoiceDto);
  }

  @Get('invoices')
  findAll(@CurrentCompanyId() companyId: string) {
    this.logger.log(`📋 GET /billing/invoices - CompanyId: ${companyId}`);
    return this.billingService.findAll(companyId);
  }

  @Get('invoices/:id')
  findOne(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🔍 GET /billing/invoices/${id} - CompanyId: ${companyId}`);
    return this.billingService.findOne(companyId, id);
  }

  @Patch('invoices/:id')
  update(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    this.logger.log(`✏️  PATCH /billing/invoices/${id} - CompanyId: ${companyId}`);
    return this.billingService.update(companyId, id, updateInvoiceDto);
  }

  @Delete('invoices/:id')
  remove(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🗑️  DELETE /billing/invoices/${id} - CompanyId: ${companyId}`);
    return this.billingService.remove(companyId, id);
  }
}

