import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  create(name: string) {
    const company = this.companyRepository.create({ name });
    return this.companyRepository.save(company);
  }

  async findById(id: string) {
    return this.companyRepository.findOne({ where: { id } });
  }
}

