import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('web3_metaverse')
export class Web3MetaverseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  workspaceId: string;

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  configuration: any;

  @Column({ type: 'jsonb', nullable: true })
  metrics: any;

  @Column({ type: 'enum', enum: ['active', 'paused', 'archived'], default: 'active' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
