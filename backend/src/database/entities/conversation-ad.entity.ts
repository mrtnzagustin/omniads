import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('conversation_ads')
export class ConversationAd {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  dialogueTree: any; // Stores complete dialogue tree structure

  @Column({ type: 'simple-array', nullable: true })
  targetPlatforms: string[]; // ['meta', 'google', 'tiktok']

  @Column({ default: 'draft' })
  status: string; // draft, active, paused, completed

  @Column({ type: 'jsonb', nullable: true })
  platformConfigs: any; // Platform-specific configurations

  @Column({ type: 'jsonb', nullable: true })
  performanceMetrics: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('dialogue_nodes')
export class DialogueNode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationAdId: string;

  @Column()
  nodeId: string;

  @Column({ type: 'text' })
  text: string;

  @Column({ type: 'jsonb', nullable: true })
  responseOptions: any[]; // Array of response buttons/options

  @Column({ type: 'jsonb', nullable: true })
  branchingLogic: any; // Conditional logic for next nodes

  @Column({ type: 'jsonb', nullable: true })
  aiOptimizationMetadata: any;

  @Column({ default: 0 })
  interactionCount: number;

  @Column({ default: 0 })
  conversionCount: number;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('conversation_interactions')
export class ConversationInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationAdId: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ type: 'jsonb' })
  conversationPath: any[]; // Array of node IDs visited

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ default: false })
  converted: boolean;

  @Column({ type: 'jsonb', nullable: true })
  outcomeData: any;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity('conversation_optimizations')
export class ConversationOptimization {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  conversationAdId: string;

  @Column()
  nodeId: string;

  @Column({ type: 'text' })
  suggestedText: string;

  @Column({ type: 'jsonb', nullable: true })
  suggestedOptions: any[];

  @Column({ type: 'float' })
  predictedImpact: number;

  @Column({ default: 'pending' })
  status: string; // pending, approved, rejected, deployed

  @Column({ type: 'text', nullable: true })
  rationale: string;

  @CreateDateColumn()
  createdAt: Date;
}
