import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('generative_ai_creative_studio_main')
export class GenerativeAiCreativeStudio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('simple-json')
  configuration: {
    enabled: boolean;
    aiProvider: 'openai' | 'anthropic';
    model: string;
    imageModel: string;
    creativesPerBatch: number;
    autoPublish: boolean;
    platforms: string[];
    brandGuidelines: Record<string, any>;
    settings: Record<string, any>;
  };

  @Column('simple-json', { nullable: true })
  metrics: {
    totalCreatives: number;
    successRate: number;
    avgGenerationTime: number;
    lastRun: Date;
    costSavings: number;
  };

  @Column({
    type: 'enum',
    enum: ['active', 'paused', 'archived'],
    default: 'active'
  })
  status: 'active' | 'paused' | 'archived';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
