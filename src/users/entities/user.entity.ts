import { BaseEntity } from '../../common/entities/base.entity';
import { Company } from '../../company/entities/company.entity';
import { Product } from '../../products/entities/product.entity';
import { Invoice } from '../../billing/entities/invoice.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.EMPLOYEE })
  role: UserRole;

  @ManyToOne(() => Company, (company) => company.users, { onDelete: 'CASCADE' })
  company: Company;

  @OneToMany(() => Product, (product) => product.registeredBy)
  products: Product[];

  @OneToMany(() => Invoice, (invoice) => invoice.cashier)
  invoices: Invoice[];
}

