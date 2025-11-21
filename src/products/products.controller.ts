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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { CurrentCompanyId } from '../common/decorators/company.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, CompanyGuard)
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @CurrentCompanyId() companyId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    this.logger.log(`📝 POST /products - CompanyId: ${companyId}, Product: ${createProductDto.name}`);
    return this.productsService.create(companyId, createProductDto);
  }

  @Get()
  findAll(@CurrentCompanyId() companyId: string) {
    console.log({ companyId });

    this.logger.log(`📋 GET /products - CompanyId: ${companyId}`);
    return this.productsService.findAll(companyId);
  }

  @Get(':id')
  findOne(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {    
    this.logger.log(`🔍 GET /products/${id} - CompanyId: ${companyId}`);
    return this.productsService.findOne(companyId, id);
  }

  @Patch(':id')
  update(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    this.logger.log(`✏️  PATCH /products/${id} - CompanyId: ${companyId}`);
    return this.productsService.update(companyId, id, updateProductDto);
  }

  @Delete(':id')
  remove(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🗑️  DELETE /products/${id} - CompanyId: ${companyId}`);
    return this.productsService.remove(companyId, id);
  }
}

