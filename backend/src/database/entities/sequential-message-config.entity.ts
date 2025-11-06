import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('sequential_message_configs')
export class SequentialMessageConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column()
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  messages: unknown;

  @Column({ default: 0 })
  delayHours: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
