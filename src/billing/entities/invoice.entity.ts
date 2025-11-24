import { BaseEntity } from '../../common/entities/base.entity';
import { Company } from '../../company/entities/company.entity';
import { User } from '../../users/entities/user.entity';
import { InvoiceItem } from './invoice-item.entity';
import { EntityStatus } from '../../common/enums/entity-status.enum';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'invoices' })
export class Invoice extends BaseEntity {
  @Column({ type: 'date' })
  date: string;

  @Column()
  clientName: string;

  @ManyToOne(() => User, (user) => user.invoices, {
    onDelete: 'SET NULL',
  })
  cashier: User;

  @Column('decimal', { precision: 12, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: EntityStatus, default: EntityStatus.ACTIVE })
  status: EntityStatus;

  @ManyToOne(() => Company, (company) => company.invoices, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  items: InvoiceItem[];
}

