import { BaseEntity } from '../../common/entities/base.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { Invoice } from '../../billing/entities/invoice.entity';
import { Product } from '../../products/entities/product.entity';
import { Provider } from '../../providers/entities/provider.entity';
import { User } from '../../users/entities/user.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { WorkLog } from '../../payroll/entities/work-log.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'companies' })
export class Company extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Product, (product) => product.company)
  products: Product[];

  @OneToMany(() => Provider, (provider) => provider.company)
  providers: Provider[];

  @OneToMany(() => Expense, (expense) => expense.company)
  expenses: Expense[];

  @OneToMany(() => Invoice, (invoice) => invoice.company)
  invoices: Invoice[];

  @OneToMany(() => Employee, (employee) => employee.company)
  employees: Employee[];

  @OneToMany(() => WorkLog, (workLog) => workLog.company)
  workLogs: WorkLog[];
}

