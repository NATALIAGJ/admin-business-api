import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Provider } from '../providers/entities/provider.entity';
import { Company } from '../company/entities/company.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(Provider)
    private readonly providersRepository: Repository<Provider>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(companyId: string, dto: CreateProductDto) {
    const [company, provider, registeredBy] = await Promise.all([
      this.companyRepository.findOne({ where: { id: companyId } }),
      this.providersRepository.findOne({
        where: { id: dto.providerId },
        relations: ['company'],
      }),
      this.usersRepository.findOne({
        where: { id: dto.registeredById },
        relations: ['company'],
      }),
    ]);

    if (!company) {
      throw new NotFoundException('Company not found');
    }
    if (!provider || provider.company.id !== companyId) {
      throw new UnauthorizedException('Invalid provider for company');
    }
    if (!registeredBy || registeredBy.company.id !== companyId) {
      throw new UnauthorizedException('Invalid user for company');
    }

    const { providerId, registeredById, ...data } = dto;

    const product = this.productsRepository.create({
      ...data,
      company,
      provider,
      registeredBy,
    });

    return this.productsRepository.save(product);
  }

  findAll(companyId: string) {
    return this.productsRepository.find({
      where: { company: { id: companyId } },
      relations: ['provider', 'registeredBy'],
    });
  }

  async findOne(companyId: string, id: string) {
    const product = await this.productsRepository.findOne({
      where: { id, company: { id: companyId } },
      relations: ['provider', 'registeredBy'],
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(companyId: string, id: string, dto: UpdateProductDto) {
    const product = await this.findOne(companyId, id);

    const { providerId, registeredById, ...rest } = dto;

    if (providerId && providerId !== product.provider.id) {
      const provider = await this.providersRepository.findOne({
        where: { id: providerId },
        relations: ['company'],
      });
      if (!provider || provider.company.id !== companyId) {
        throw new UnauthorizedException('Invalid provider for company');
      }
      product.provider = provider;
    }

    if (registeredById && registeredById !== product.registeredBy.id) {
      const registeredBy = await this.usersRepository.findOne({
        where: { id: registeredById },
        relations: ['company'],
      });
      if (!registeredBy || registeredBy.company.id !== companyId) {
        throw new UnauthorizedException('Invalid user for company');
      }
      product.registeredBy = registeredBy;
    }

    Object.assign(product, rest);
    return this.productsRepository.save(product);
  }

  async remove(companyId: string, id: string) {
    const product = await this.findOne(companyId, id);
    await this.productsRepository.remove(product);
    return { deleted: true };
  }
}

