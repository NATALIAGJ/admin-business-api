import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { Provider } from '../providers/entities/provider.entity';
import { Company } from '../company/entities/company.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { EntityStatus } from '../common/enums/entity-status.enum';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense)
    private readonly expensesRepository: Repository<Expense>,
    @InjectRepository(Provider)
    private readonly providersRepository: Repository<Provider>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async create(companyId: string, dto: CreateExpenseDto) {
    const [company, provider] = await Promise.all([
      this.companyRepository.findOne({ where: { id: companyId } }),
      this.providersRepository.findOne({
        where: { id: dto.providerId },
        relations: ['company'],
      }),
    ]);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (!provider || provider.company.id !== companyId) {
      throw new UnauthorizedException('Invalid provider for company');
    }

    const { providerId, ...data } = dto;

    const expense = this.expensesRepository.create({
      ...data,
      company,
      provider,
    });
    return this.expensesRepository.save(expense);
  }

  findAll(companyId: string) {
    return this.expensesRepository.find({
      where: { company: { id: companyId } },
      relations: ['provider'],
    });
  }

  async findOne(companyId: string, id: string) {
    const expense = await this.expensesRepository.findOne({
      where: { id, company: { id: companyId } },
      relations: ['provider'],
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    return expense;
  }

  async update(companyId: string, id: string, dto: UpdateExpenseDto) {
    const expense = await this.findOne(companyId, id);

    const { providerId, ...rest } = dto;

    if (providerId && providerId !== expense.provider.id) {
      const provider = await this.providersRepository.findOne({
        where: { id: providerId },
        relations: ['company'],
      });
      if (!provider || provider.company.id !== companyId) {
        throw new UnauthorizedException('Invalid provider for company');
      }
      expense.provider = provider;
    }

    Object.assign(expense, rest);
    return this.expensesRepository.save(expense);
  }

  async remove(companyId: string, id: string) {
    const expense = await this.expensesRepository.findOne({
      where: { id, company: { id: companyId } },
    });
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }
    expense.status = EntityStatus.INACTIVE;
    await this.expensesRepository.save(expense);
    return { deleted: true, status: EntityStatus.INACTIVE };
  }
}
