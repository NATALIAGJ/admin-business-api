import { ConfigModule, ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { dataSourceOptions } from './src/config/typeorm.config';

config();
ConfigModule.forRoot();

const configService = new ConfigService();

export default new DataSource(dataSourceOptions(configService));
