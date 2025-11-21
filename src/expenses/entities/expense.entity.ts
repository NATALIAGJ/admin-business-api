import { BaseEntity } from '../../common/entities/base.entity';
import { Provider } from '../../providers/entities/provider.entity';
import { Company } from '../../company/entities/company.entity';
import { PaymentStatus } from '../../common/enums/payment-status.enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'expenses' })
export class Expense extends BaseEntity {
  @ManyToOne(() => Provider, (provider) => provider.expenses, {
    onDelete: 'SET NULL',
  })
  provider: Provider;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ManyToOne(() => Company, (company) => company.expenses, {
    onDelete: 'CASCADE',
  })
  company: Company;
}

