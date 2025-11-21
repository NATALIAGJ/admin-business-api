import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1732050000000 implements MigrationInterface {
  name = 'InitSchema1732050000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public`,
    );

    await queryRunner.query(
      `CREATE TYPE "user_role_enum" AS ENUM('ADMIN', 'EMPLOYEE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "product_status_enum" AS ENUM('ACTIVE', 'INACTIVE')`,
    );
    await queryRunner.query(
      `CREATE TYPE "payment_status_enum" AS ENUM('PAID', 'PENDING')`,
    );

    await queryRunner.query(`
      CREATE TABLE "companies" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL UNIQUE,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "email" character varying NOT NULL UNIQUE,
        "password" character varying NOT NULL,
        "role" "user_role_enum" NOT NULL DEFAULT 'EMPLOYEE',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "companyId" uuid,
        CONSTRAINT "FK_users_company" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "providers" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "contact" character varying NOT NULL,
        "address" character varying NOT NULL,
        "status" character varying NOT NULL DEFAULT 'ACTIVE',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "companyId" uuid,
        CONSTRAINT "FK_providers_company" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "purchasePrice" numeric(12,2) NOT NULL,
        "salePrice" numeric(12,2) NOT NULL,
        "quantity" integer NOT NULL,
        "weight" numeric(10,2) NOT NULL,
        "status" "product_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "registeredById" uuid,
        "providerId" uuid,
        "companyId" uuid,
        CONSTRAINT "FK_product_user" FOREIGN KEY ("registeredById") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_product_provider" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_product_company" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "expenses" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "amount" numeric(12,2) NOT NULL,
        "date" date NOT NULL,
        "description" text,
        "paymentStatus" "payment_status_enum" NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "providerId" uuid,
        "companyId" uuid,
        CONSTRAINT "FK_expenses_provider" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_expenses_company" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "employees" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "role" character varying NOT NULL,
        "hourlyRate" numeric(10,2) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "companyId" uuid,
        CONSTRAINT "FK_employees_company" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "work_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "clockIn" TIMESTAMPTZ NOT NULL,
        "clockOut" TIMESTAMPTZ NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "employeeId" uuid,
        "companyId" uuid,
        CONSTRAINT "FK_worklogs_employee" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_worklogs_company" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "date" date NOT NULL,
        "clientName" character varying NOT NULL,
        "total" numeric(12,2) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "cashierId" uuid,
        "companyId" uuid,
        CONSTRAINT "FK_invoices_cashier" FOREIGN KEY ("cashierId") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_invoices_company" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "invoice_items" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "quantity" integer NOT NULL,
        "unitPrice" numeric(12,2) NOT NULL,
        "subtotal" numeric(12,2) NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "invoiceId" uuid,
        "productId" uuid,
        CONSTRAINT "FK_invoice_items_invoice" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_invoice_items_product" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "invoice_items"`);
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TABLE "work_logs"`);
    await queryRunner.query(`DROP TABLE "employees"`);
    await queryRunner.query(`DROP TABLE "expenses"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "providers"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "companies"`);

    await queryRunner.query(`DROP TYPE "payment_status_enum"`);
    await queryRunner.query(`DROP TYPE "product_status_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}

