import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('recommendation_cache')
export class RecommendationCache {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @Column()
  cacheKey: string;

  @Column('jsonb')
  recommendations: any[];

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
