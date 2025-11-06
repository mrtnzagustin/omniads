import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('whatsapp_sessions')
export class WhatsAppSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: true })
  workspaceId: string;

  @Column()
  sessionId: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ default: false })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
