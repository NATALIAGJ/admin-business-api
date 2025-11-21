import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Company } from '../company/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemsRepository: Repository<InvoiceItem>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

    async create(companyId: string, dto: CreateInvoiceDto) {
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });
      if (!company) {
        throw new NotFoundException('Company not found');
      }

      const cashier = await this.usersRepository.findOne({
        where: { id: dto.cashierId },
        relations: ['company'],
      });
      if (!cashier || cashier.company.id !== companyId) {
        throw new UnauthorizedException('Invalid cashier for company');
      }

      const items = await this.buildItems(companyId, dto.items);
      const total =
        dto.total ??
        items.reduce((acc, item) => acc + Number(item.subtotal), 0);

      const invoice = this.invoicesRepository.create({
        date: dto.date,
        clientName: dto.clientName,
        total,
        cashier,
        company,
        items,
      });

      return this.invoicesRepository.save(invoice);
    }

    findAll(companyId: string) {
      return this.invoicesRepository.find({
        where: { company: { id: companyId } },
        relations: ['items', 'items.product', 'cashier'],
      });
    }

    async findOne(companyId: string, id: string) {
      const invoice = await this.invoicesRepository.findOne({
        where: { id, company: { id: companyId } },
        relations: ['items', 'items.product', 'cashier'],
      });
      if (!invoice) {
        throw new NotFoundException('Invoice not found');
      }
      return invoice;
    }

  async update(companyId: string, id: string, dto: UpdateInvoiceDto) {
    const invoice = await this.findOne(companyId, id);
    const { cashierId, items, ...rest } = dto;

    if (cashierId && cashierId !== invoice.cashier.id) {
        const cashier = await this.usersRepository.findOne({
          where: { id: cashierId },
          relations: ['company'],
        });
        if (!cashier || cashier.company.id !== companyId) {
          throw new UnauthorizedException('Invalid cashier for company');
        }
        invoice.cashier = cashier;
      }

      if (items) {
        await this.invoiceItemsRepository.delete({ invoice: { id: invoice.id } });
        invoice.items = await this.buildItems(companyId, items);
      }

      Object.assign(invoice, rest);

      if (items || dto.total) {
        invoice.total =
          dto.total ??
          invoice.items.reduce((acc, item) => acc + Number(item.subtotal), 0);
      }

      return this.invoicesRepository.save(invoice);
    }

    async remove(companyId: string, id: string) {
      const invoice = await this.findOne(companyId, id);
      await this.invoicesRepository.remove(invoice);
      return { deleted: true };
    }

    private async buildItems(
      companyId: string,
      items: CreateInvoiceDto['items'],
    ) {
      const builtItems: InvoiceItem[] = [];
      for (const item of items) {
        const product = await this.productsRepository.findOne({
          where: { id: item.productId },
          relations: ['company'],
        });
        if (!product || product.company.id !== companyId) {
          throw new UnauthorizedException('Invalid product for company');
        }
        const subtotal = Number(item.unitPrice) * item.quantity;
        builtItems.push(
          this.invoiceItemsRepository.create({
            product,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal,
          }),
        );
      }
      return builtItems;
    }
  }
