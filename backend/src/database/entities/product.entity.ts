import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from 'typeorm';
import { Sale } from './sale.entity';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column()
  externalId: string; // The ID from Tienda Nube

  @Column()
  name: string;

  @Column('float')
  price: number;

  @Column('float')
  conversionRate: number; // Calculated field

  @OneToMany(() => Sale, (sale) => sale.product)
  sales: Sale[];
}
