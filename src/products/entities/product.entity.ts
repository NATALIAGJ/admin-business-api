import { BaseEntity } from '../../common/entities/base.entity';
import { Company } from '../../company/entities/company.entity';
import { Provider } from '../../providers/entities/provider.entity';
import { User } from '../../users/entities/user.entity';
import { ProductStatus } from '../../common/enums/product-status.enum';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  @Column()
  name: string;

  @Column('decimal', { precision: 12, scale: 2 })
  purchasePrice: number;

  @Column('decimal', { precision: 12, scale: 2 })
  salePrice: number;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  weight: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  @ManyToOne(() => User, (user) => user.products, { onDelete: 'SET NULL' })
  registeredBy: User;

  @ManyToOne(() => Provider, (provider) => provider.products, {
    onDelete: 'SET NULL',
  })
  provider: Provider;

  @ManyToOne(() => Company, (company) => company.products, {
    onDelete: 'CASCADE',
  })
  company: Company;
}

