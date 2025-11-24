import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { Company } from '../company/entities/company.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EntityStatus } from '../common/enums/entity-status.enum';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(companyId: string, dto: CreateEmployeeDto) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }
    const employee = this.employeesRepository.create({
      ...dto,
      company,
    });
    return this.employeesRepository.save(employee);
  }

  findAll(companyId: string) {
    return this.employeesRepository.find({
      where: { company: { id: companyId } },
    });
  }

  async findOne(companyId: string, id: string) {
    const employee = await this.employeesRepository.findOne({
      where: { id, company: { id: companyId } },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    return employee;
  }

  async update(companyId: string, id: string, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(companyId, id);
    Object.assign(employee, dto);
    return this.employeesRepository.save(employee);
  }

  async remove(companyId: string, id: string) {
    const employee = await this.employeesRepository.findOne({
      where: { id, company: { id: companyId } },
    });
    if (!employee) {
      throw new NotFoundException('Employee not found');
    }
    employee.status = EntityStatus.INACTIVE;
    await this.employeesRepository.save(employee);
    return { deleted: true, status: EntityStatus.INACTIVE };
  }
}

