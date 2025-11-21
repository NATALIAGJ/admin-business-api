import 'reflect-metadata';
import { config } from 'dotenv';
import * as bcrypt from 'bcrypt';
import dataSource from '../../data-source';
import { Company } from '../company/entities/company.entity';
import { User } from '../users/entities/user.entity';
import { Provider } from '../providers/entities/provider.entity';
import { Product } from '../products/entities/product.entity';
import { Expense } from '../expenses/entities/expense.entity';
import { Employee } from '../employees/entities/employee.entity';
import { WorkLog } from '../payroll/entities/work-log.entity';
import { Invoice } from '../billing/entities/invoice.entity';
import { InvoiceItem } from '../billing/entities/invoice-item.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { ProductStatus } from '../common/enums/product-status.enum';
import { PaymentStatus } from '../common/enums/payment-status.enum';

config();

async function clearDatabase() {
  // Orden correcto: primero las tablas hijas (con foreign keys), luego las padres
  // Usar queryBuilder para DELETE que funciona mejor con restricciones

  await dataSource.createQueryBuilder().delete().from(InvoiceItem).execute();

  await dataSource.createQueryBuilder().delete().from(Invoice).execute();

  await dataSource.createQueryBuilder().delete().from(WorkLog).execute();

  await dataSource.createQueryBuilder().delete().from(Employee).execute();

  await dataSource.createQueryBuilder().delete().from(Expense).execute();

  await dataSource.createQueryBuilder().delete().from(Product).execute();

  await dataSource.createQueryBuilder().delete().from(Provider).execute();

  await dataSource.createQueryBuilder().delete().from(User).execute();

  await dataSource.createQueryBuilder().delete().from(Company).execute();
}

async function seedCompanyData() {
  const companyRepo = dataSource.getRepository(Company);
  const userRepo = dataSource.getRepository(User);
  const providerRepo = dataSource.getRepository(Provider);
  const productRepo = dataSource.getRepository(Product);
  const expenseRepo = dataSource.getRepository(Expense);
  const employeeRepo = dataSource.getRepository(Employee);
  const workLogRepo = dataSource.getRepository(WorkLog);
  const invoiceRepo = dataSource.getRepository(Invoice);
  const invoiceItemRepo = dataSource.getRepository(InvoiceItem);

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // Company 1 - El Antojo Boyacense
  const elAntojo = companyRepo.create({ name: 'El Antojo Boyacense' });
  await companyRepo.save(elAntojo);

  const elAntojoAdmin = userRepo.create({
    name: 'María González',
    email: 'maria@elantojoboyacense.com',
    password: passwordHash,
    role: UserRole.ADMIN,
    company: elAntojo,
  });
  await userRepo.save(elAntojoAdmin);

  const elAntojoCashier = userRepo.create({
    name: 'Juan Pérez',
    email: 'juan@elantojoboyacense.com',
    password: passwordHash,
    role: UserRole.EMPLOYEE,
    company: elAntojo,
  });
  await userRepo.save(elAntojoCashier);

  const quesosBoyaca = providerRepo.create({
    name: 'Quesos Artesanales Boyacá',
    contact: 'ventas@quesosboyaca.com',
    address: 'Vereda La Esperanza, Duitama, Boyacá',
    status: 'ACTIVE',
    company: elAntojo,
  });
  await providerRepo.save(quesosBoyaca);

  const artesaniasColombia = providerRepo.create({
    name: 'Artesanías Colombianas',
    contact: 'contacto@artesaniascol.com',
    address: 'Calle 15 #8-45, Tunja, Boyacá',
    status: 'ACTIVE',
    company: elAntojo,
  });
  await providerRepo.save(artesaniasColombia);

  const lacteosBoyaca = providerRepo.create({
    name: 'Lácteos Boyacá Premium',
    contact: 'ventas@lacteosboyaca.com',
    address: 'Finca La Esperanza, Vía Sogamoso, Boyacá',
    status: 'ACTIVE',
    company: elAntojo,
  });
  await providerRepo.save(lacteosBoyaca);

  const arepaBoyacense = productRepo.create({
    name: 'Arepa Boyacense (unidad)',
    purchasePrice: 800,
    salePrice: 1500,
    quantity: 150,
    weight: 0.2,
    status: ProductStatus.ACTIVE,
    company: elAntojo,
    provider: quesosBoyaca,
    registeredBy: elAntojoAdmin,
  });
  await productRepo.save(arepaBoyacense);

  const quesoCuajada = productRepo.create({
    name: 'Queso Cuajada 500g',
    purchasePrice: 12000,
    salePrice: 18000,
    quantity: 45,
    weight: 0.5,
    status: ProductStatus.ACTIVE,
    company: elAntojo,
    provider: quesosBoyaca,
    registeredBy: elAntojoAdmin,
  });
  await productRepo.save(quesoCuajada);

  const yogurNatural = productRepo.create({
    name: 'Yogur Natural 500ml',
    purchasePrice: 3500,
    salePrice: 5500,
    quantity: 80,
    weight: 0.5,
    status: ProductStatus.ACTIVE,
    company: elAntojo,
    provider: quesosBoyaca,
    registeredBy: elAntojoAdmin,
  });
  await productRepo.save(yogurNatural);

  const artesaniaCeramica = productRepo.create({
    name: 'Artesanía Cerámica Boyacense',
    purchasePrice: 25000,
    salePrice: 45000,
    quantity: 20,
    weight: 0.8,
    status: ProductStatus.ACTIVE,
    company: elAntojo,
    provider: artesaniasColombia,
    registeredBy: elAntojoAdmin,
  });
  await productRepo.save(artesaniaCeramica);

  const almojabana = productRepo.create({
    name: 'Almojábana Boyacense (unidad)',
    purchasePrice: 1200,
    salePrice: 2200,
    quantity: 100,
    weight: 0.15,
    status: ProductStatus.ACTIVE,
    company: elAntojo,
    provider: quesosBoyaca,
    registeredBy: elAntojoAdmin,
  });
  await productRepo.save(almojabana);

  const garullas = productRepo.create({
    name: 'Garullas Boyacenses (unidad)',
    purchasePrice: 1000,
    salePrice: 1800,
    quantity: 120,
    weight: 0.12,
    status: ProductStatus.ACTIVE,
    company: elAntojo,
    provider: quesosBoyaca,
    registeredBy: elAntojoAdmin,
  });
  await productRepo.save(garullas);

  const quesoCampesino = productRepo.create({
    name: 'Queso Campesino 1kg',
    purchasePrice: 22000,
    salePrice: 32000,
    quantity: 30,
    weight: 1,
    status: ProductStatus.ACTIVE,
    company: elAntojo,
    provider: lacteosBoyaca,
    registeredBy: elAntojoAdmin,
  });
  await productRepo.save(quesoCampesino);

  const yogurGriego = productRepo.create({
    name: 'Yogur Griego Natural 500ml',
    purchasePrice: 4500,
    salePrice: 6800,
    quantity: 60,
    weight: 0.5,
    status: ProductStatus.ACTIVE,
    company: elAntojo,
    provider: lacteosBoyaca,
    registeredBy: elAntojoAdmin,
  });
  await productRepo.save(yogurGriego);

  const arepaRellena = productRepo.create({
    name: 'Arepa Rellena (queso/huevo)',
    purchasePrice: 2500,
    salePrice: 4500,
    quantity: 80,
    weight: 0.3,
    status: ProductStatus.ACTIVE,
    company: elAntojo,
    provider: quesosBoyaca,
    registeredBy: elAntojoAdmin,
  });
  await productRepo.save(arepaRellena);

  const artesaniaTejido = productRepo.create({
    name: 'Artesanía Tejido Boyacense',
    purchasePrice: 35000,
    salePrice: 65000,
    quantity: 15,
    weight: 0.5,
    status: ProductStatus.ACTIVE,
    company: elAntojo,
    provider: artesaniasColombia,
    registeredBy: elAntojoAdmin,
  });
  await productRepo.save(artesaniaTejido);

  const quesoExpense = expenseRepo.create({
    provider: quesosBoyaca,
    amount: 450000,
    date: '2025-01-10',
    description: 'Compra mensual de quesos y productos lácteos',
    paymentStatus: PaymentStatus.PAID,
    company: elAntojo,
  });
  await expenseRepo.save(quesoExpense);

  const artesaniaExpense = expenseRepo.create({
    provider: artesaniasColombia,
    amount: 320000,
    date: '2025-01-18',
    description: 'Pedido de artesanías para exposición',
    paymentStatus: PaymentStatus.PENDING,
    company: elAntojo,
  });
  await expenseRepo.save(artesaniaExpense);

  const lacteosExpense = expenseRepo.create({
    provider: lacteosBoyaca,
    amount: 280000,
    date: '2025-01-22',
    description: 'Compra quincenal de productos lácteos premium',
    paymentStatus: PaymentStatus.PAID,
    company: elAntojo,
  });
  await expenseRepo.save(lacteosExpense);

  const barista = employeeRepo.create({
    name: 'Carlos Rodríguez',
    role: 'Barista y preparador',
    hourlyRate: 12000,
    company: elAntojo,
  });
  await employeeRepo.save(barista);

  const cocinero = employeeRepo.create({
    name: 'Ana Martínez',
    role: 'Cocinera especializada en amasijos',
    hourlyRate: 15000,
    company: elAntojo,
  });
  await employeeRepo.save(cocinero);

  const mesero = employeeRepo.create({
    name: 'Luis Hernández',
    role: 'Mesero y atención al cliente',
    hourlyRate: 10000,
    company: elAntojo,
  });
  await employeeRepo.save(mesero);

  await workLogRepo.save(
    workLogRepo.create({
      employee: barista,
      company: elAntojo,
      clockIn: new Date('2025-01-15T06:00:00Z'),
      clockOut: new Date('2025-01-15T14:00:00Z'),
    }),
  );
  await workLogRepo.save(
    workLogRepo.create({
      employee: cocinero,
      company: elAntojo,
      clockIn: new Date('2025-01-15T05:30:00Z'),
      clockOut: new Date('2025-01-15T13:30:00Z'),
    }),
  );
  await workLogRepo.save(
    workLogRepo.create({
      employee: mesero,
      company: elAntojo,
      clockIn: new Date('2025-01-15T07:00:00Z'),
      clockOut: new Date('2025-01-15T15:00:00Z'),
    }),
  );

  const elAntojoInvoice = invoiceRepo.create({
    date: '2025-01-20',
    clientName: 'Restaurante La Casona',
    total: 0,
    cashier: elAntojoCashier,
    company: elAntojo,
    items: [],
  });
  const elAntojoItems = [
    invoiceItemRepo.create({
      product: arepaBoyacense,
      quantity: 50,
      unitPrice: 1500,
      subtotal: 75000,
    }),
    invoiceItemRepo.create({
      product: quesoCuajada,
      quantity: 10,
      unitPrice: 18000,
      subtotal: 180000,
    }),
    invoiceItemRepo.create({
      product: yogurNatural,
      quantity: 20,
      unitPrice: 5500,
      subtotal: 110000,
    }),
    invoiceItemRepo.create({
      product: almojabana,
      quantity: 30,
      unitPrice: 2200,
      subtotal: 66000,
    }),
    invoiceItemRepo.create({
      product: garullas,
      quantity: 25,
      unitPrice: 1800,
      subtotal: 45000,
    }),
    invoiceItemRepo.create({
      product: arepaRellena,
      quantity: 15,
      unitPrice: 4500,
      subtotal: 67500,
    }),
  ];
  elAntojoInvoice.items = elAntojoItems;
  elAntojoInvoice.total = elAntojoItems.reduce(
    (acc, item) => acc + Number(item.subtotal),
    0,
  );
  await invoiceRepo.save(elAntojoInvoice);

  // Segunda factura para El Antojo Boyacense
  const elAntojoInvoice2 = invoiceRepo.create({
    date: '2025-01-25',
    clientName: 'Café del Centro',
    total: 0,
    cashier: elAntojoCashier,
    company: elAntojo,
    items: [],
  });
  const elAntojoItems2 = [
    invoiceItemRepo.create({
      product: quesoCampesino,
      quantity: 5,
      unitPrice: 32000,
      subtotal: 160000,
    }),
    invoiceItemRepo.create({
      product: yogurGriego,
      quantity: 12,
      unitPrice: 6800,
      subtotal: 81600,
    }),
    invoiceItemRepo.create({
      product: artesaniaCeramica,
      quantity: 2,
      unitPrice: 45000,
      subtotal: 90000,
    }),
    invoiceItemRepo.create({
      product: artesaniaTejido,
      quantity: 1,
      unitPrice: 65000,
      subtotal: 65000,
    }),
  ];
  elAntojoInvoice2.items = elAntojoItems2;
  elAntojoInvoice2.total = elAntojoItems2.reduce(
    (acc, item) => acc + Number(item.subtotal),
    0,
  );
  await invoiceRepo.save(elAntojoInvoice2);

  // Company 2
  const freshBites = companyRepo.create({ name: 'FreshBites Logistics' });
  await companyRepo.save(freshBites);

  const freshAdmin = userRepo.create({
    name: 'Nicolás Duarte',
    email: 'nicolas@freshbites.com',
    password: passwordHash,
    role: UserRole.ADMIN,
    company: freshBites,
  });
  await userRepo.save(freshAdmin);

  const freshCashier = userRepo.create({
    name: 'Sofía Ramírez',
    email: 'sofia@freshbites.com',
    password: passwordHash,
    role: UserRole.EMPLOYEE,
    company: freshBites,
  });
  await userRepo.save(freshCashier);

  const greenHarvest = providerRepo.create({
    name: 'Green Harvest Co.',
    contact: 'ventas@greenharvest.co',
    address: 'Km 22 Carretera Mérida, Yucatán',
    status: 'ACTIVE',
    company: freshBites,
  });
  await providerRepo.save(greenHarvest);

  const andesCoffee = providerRepo.create({
    name: 'Andes Coffee Export',
    contact: 'contact@andescoffee.com',
    address: 'Calle 7 #42-11, Medellín',
    status: 'ACTIVE',
    company: freshBites,
  });
  await providerRepo.save(andesCoffee);

  const mangoCrates = productRepo.create({
    name: 'Cajas de mango ataulfo',
    purchasePrice: 18.5,
    salePrice: 32.5,
    quantity: 200,
    weight: 3.5,
    status: ProductStatus.ACTIVE,
    company: freshBites,
    provider: greenHarvest,
    registeredBy: freshAdmin,
  });
  await productRepo.save(mangoCrates);

  const coffeeBlend = productRepo.create({
    name: 'Blend espresso premium 1kg',
    purchasePrice: 9.2,
    salePrice: 16.0,
    quantity: 150,
    weight: 1,
    status: ProductStatus.ACTIVE,
    company: freshBites,
    provider: andesCoffee,
    registeredBy: freshAdmin,
  });
  await productRepo.save(coffeeBlend);

  await expenseRepo.save(
    expenseRepo.create({
      provider: greenHarvest,
      amount: 3700,
      date: '2025-02-02',
      description: 'Compra semanal de fruta premium',
      paymentStatus: PaymentStatus.PAID,
      company: freshBites,
    }),
  );

  await expenseRepo.save(
    expenseRepo.create({
      provider: andesCoffee,
      amount: 2100,
      date: '2025-02-05',
      description: 'Pedido mensual de café tostado',
      paymentStatus: PaymentStatus.PENDING,
      company: freshBites,
    }),
  );

  const packingLead = employeeRepo.create({
    name: 'Ivanna Ruiz',
    role: 'Líder de empaque',
    hourlyRate: 15.25,
    company: freshBites,
  });
  await employeeRepo.save(packingLead);

  const logisticsAgent = employeeRepo.create({
    name: 'Gerardo Molina',
    role: 'Agente logístico',
    hourlyRate: 17.4,
    company: freshBites,
  });
  await employeeRepo.save(logisticsAgent);

  await workLogRepo.save(
    workLogRepo.create({
      employee: packingLead,
      company: freshBites,
      clockIn: new Date('2025-02-03T06:00:00Z'),
      clockOut: new Date('2025-02-03T14:30:00Z'),
    }),
  );
  await workLogRepo.save(
    workLogRepo.create({
      employee: logisticsAgent,
      company: freshBites,
      clockIn: new Date('2025-02-03T09:00:00Z'),
      clockOut: new Date('2025-02-03T17:15:00Z'),
    }),
  );

  const freshInvoice = invoiceRepo.create({
    date: '2025-02-06',
    clientName: 'Bistró Costa Azul',
    total: 0,
    cashier: freshCashier,
    company: freshBites,
    items: [],
  });
  const freshItems = [
    invoiceItemRepo.create({
      product: mangoCrates,
      quantity: 30,
      unitPrice: 32.5,
      subtotal: 975,
    }),
    invoiceItemRepo.create({
      product: coffeeBlend,
      quantity: 40,
      unitPrice: 16,
      subtotal: 640,
    }),
  ];
  freshInvoice.items = freshItems;
  freshInvoice.total = freshItems.reduce(
    (acc, item) => acc + Number(item.subtotal),
    0,
  );
  await invoiceRepo.save(freshInvoice);
}

async function run() {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
    }
    await clearDatabase();
    await seedCompanyData();
    console.log('✅ Seed data inserted successfully');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exitCode = 1;
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

void run();
