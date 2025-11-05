import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { User } from './entities/user.entity';
import { Campaign } from './entities/campaign.entity';
import { Product } from './entities/product.entity';
import { Sale } from './entities/sale.entity';
import { Recommendation } from './entities/recommendation.entity';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USERNAME || 'omniads',
  password: process.env.DB_PASSWORD || 'omniads_password',
  database: process.env.DB_DATABASE || 'omniads',
  entities: [User, Campaign, Product, Sale, Recommendation],
  synchronize: process.env.NODE_ENV === 'development', // Auto-sync in dev only
  logging: process.env.NODE_ENV === 'development',
  migrations: ['dist/database/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
