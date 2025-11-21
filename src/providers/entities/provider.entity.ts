import { BaseEntity } from '../../common/entities/base.entity';
import { Company } from '../../company/entities/company.entity';
import { Product } from '../../products/entities/product.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity({ name: 'providers' })
export class Provider extends BaseEntity {
  @Column()
  name: string;

  @Column()
  contact: string;

  @Column()
  address: string;

  @Column({ default: 'ACTIVE' })
  status: string;

  @ManyToOne(() => Company, (company) => company.providers, {
    onDelete: 'CASCADE',
  })
  company: Company;

  @OneToMany(() => Product, (product) => product.provider)
  products: Product[];

  @OneToMany(() => Expense, (expense) => expense.provider)
  expenses: Expense[];
}

