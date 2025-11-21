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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CompanyGuard } from '../common/guards/company.guard';
import { CurrentCompanyId } from '../common/decorators/company.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, CompanyGuard)
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(
    @CurrentCompanyId() companyId: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    this.logger.log(`📝 POST /users - CompanyId: ${companyId}, Email: ${createUserDto.email}`);
    return this.usersService.create(companyId, createUserDto);
  }

  @Get()
  findAll(@CurrentCompanyId() companyId: string) {
    this.logger.log(`📋 GET /users - CompanyId: ${companyId}`);
    return this.usersService.findAll(companyId);
  }

  @Get(':id')
  findOne(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🔍 GET /users/${id} - CompanyId: ${companyId}`);
    return this.usersService.findOne(companyId, id);
  }

  @Patch(':id')
  update(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    this.logger.log(`✏️  PATCH /users/${id} - CompanyId: ${companyId}`);
    return this.usersService.update(companyId, id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @CurrentCompanyId() companyId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(`🗑️  DELETE /users/${id} - CompanyId: ${companyId}`);
    return this.usersService.remove(companyId, id);
  }
}

