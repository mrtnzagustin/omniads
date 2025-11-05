import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('campaigns')
export class Campaign {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  platform: string; // "meta", "google", "tiktok"

  @Column()
  name: string;

  @Index({ unique: true })
  @Column()
  externalId: string; // The ID from the ad platform

  @Column('timestamp')
  date: Date;

  @Column('float')
  investment: number;

  @Column('float')
  revenue: number;

  @Column('float')
  roas: number;

  @Column('int')
  impressions: number;

  @Column('int')
  clicks: number;
}
