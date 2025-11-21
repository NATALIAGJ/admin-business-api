import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Configurar CORS
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  logger.log('✅ CORS enabled for frontend origins');

  // Verificar conexión a la base de datos
  try {
    const dataSource = app.get<DataSource>(getDataSourceToken());
    if (dataSource.isInitialized) {
      logger.log('✅ Database connection established');
      logger.log(
        '✅ TypeORM synchronize is enabled - tables will be created automatically',
      );

      // Listar tablas creadas
      const queryRunner = dataSource.createQueryRunner();
      const tables = await queryRunner.getTables();
      logger.log(`📊 Found ${tables.length} tables in database`);
      if (tables.length > 0) {
        logger.log(`   Tables: ${tables.map((t) => t.name).join(', ')}`);
      }
      await queryRunner.release();
    }
  } catch (error) {
    logger.error('❌ Database connection failed', error);
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  logger.log(`🚀 Application is running on: http://localhost:${port}`);
}
void bootstrap();
