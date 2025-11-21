import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { CompanyModule } from './company/company.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ProvidersModule } from './providers/providers.module';
import { ExpensesModule } from './expenses/expenses.module';
import { BillingModule } from './billing/billing.module';
import { EmployeesModule } from './employees/employees.module';
import { PayrollModule } from './payroll/payroll.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    CompanyModule,
    AuthModule,
    UsersModule,
    ProvidersModule,
    ProductsModule,
    ExpensesModule,
    BillingModule,
    EmployeesModule,
    PayrollModule,
  ],
})
export class AppModule {}
