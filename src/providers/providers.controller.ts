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
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { CurrentCompanyId } from '../common/decorators/company.decorator';

@Controller('providers')
@UseGuards(JwtAuthGuard, CompanyGuard)
export class ProvidersController {
  private readonly logger = new Logger(ProvidersController.name);

  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(
    @CurrentCompanyId() companyId: string,
    @Body() createProviderDto: CreateProviderDto,
  ) {
    this.logger.log(`📝 POST /providers - CompanyId: ${companyId}, Provider: ${createProviderDto.name}`);
    return this.providersService.create(companyId, createProviderDto);
  }

  @Get()
  findAll(@CurrentCompanyId() companyId: string) {
    this.logger.log(`📋 GET /providers - CompanyId: ${companyId}`);
    return this.providersService.findAll(companyId);
  }

  @Get(':id')
  findOne(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🔍 GET /providers/${id} - CompanyId: ${companyId}`);
    return this.providersService.findOne(companyId, id);
  }

  @Patch(':id')
  update(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
    @Body() updateProviderDto: UpdateProviderDto,
  ) {
    this.logger.log(`✏️  PATCH /providers/${id} - CompanyId: ${companyId}`);
    return this.providersService.update(companyId, id, updateProviderDto);
  }

  @Delete(':id')
  remove(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🗑️  DELETE /providers/${id} - CompanyId: ${companyId}`);
    return this.providersService.remove(companyId, id);
  }
}

