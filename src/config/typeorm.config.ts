import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Company } from '../company/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { Provider } from '../providers/entities/provider.entity';
import { Product } from '../products/entities/product.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Invoice } from '../billing/entities/invoice.entity';
import { InvoiceItem } from '../billing/entities/invoice-item.entity';
import { Employee } from '../employees/entities/employee.entity';
import { WorkLog } from '../payroll/entities/work-log.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'localhost'),
    port: parseInt(configService.get('DB_PORT', '5432'), 10),
    username: configService.get('DB_USER', 'myuser'),
    password: configService.get('DB_PASSWORD', 'mypassword'),
    database: configService.get('DB_NAME', 'business_db'),
    entities: [
      Company,
      User,
      Provider,
      Product,
      Expense,
      Invoice,
      InvoiceItem,
      Employee,
      WorkLog,
    ],
    synchronize: true,
    logging: configService.get('NODE_ENV') === 'development',
    migrations: ['dist/migrations/*.js'],
    autoLoadEntities: true,
  }),
};

export const dataSourceOptions = (
  config: ConfigService,
): DataSourceOptions => ({
  type: 'postgres',
  host: config.get('DB_HOST', 'localhost'),
  port: parseInt(config.get('DB_PORT', '5432'), 10),
  username: config.get('DB_USER', 'myuser'),
  password: config.get('DB_PASSWORD', 'mypassword'),
  database: config.get('DB_NAME', 'business_db'),
  entities: [
    Company,
    User,
    Provider,
    Product,
    Expense,
    Invoice,
    InvoiceItem,
    Employee,
    WorkLog,
  ],
  migrations: ['dist/migrations/*.js'],
  synchronize: true,
  logging: config.get('NODE_ENV') === 'development',
});

export const createDataSource = (options: DataSourceOptions) =>
  new DataSource(options);
