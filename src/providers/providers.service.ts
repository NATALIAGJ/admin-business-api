import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import { Company } from '../company/entities/company.entity';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providersRepository: Repository<Provider>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(companyId: string, dto: CreateProviderDto) {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    const provider = this.providersRepository.create({
      ...dto,
      company,
    });
    return this.providersRepository.save(provider);
  }

  findAll(companyId: string) {
    return this.providersRepository.find({
      where: { company: { id: companyId } },
    });
  }

  async findOne(companyId: string, id: string) {
    const provider = await this.providersRepository.findOne({
      where: { id, company: { id: companyId } },
    });
    if (!provider) {
      throw new NotFoundException('Provider not found');
    }
    return provider;
  }

  async update(companyId: string, id: string, dto: UpdateProviderDto) {
    const provider = await this.findOne(companyId, id);
    Object.assign(provider, dto);
    return this.providersRepository.save(provider);
  }

  async remove(companyId: string, id: string) {
    const provider = await this.findOne(companyId, id);
    await this.providersRepository.remove(provider);
    return { deleted: true };
  }
}

