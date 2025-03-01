import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export enum TenantStatus {
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  CANCELED = 'canceled',
}

export enum TenantPlan {
  FREE = 'free',
  BASIC = 'basic',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'ID único da loja' })
  id: string;

  @Column({ length: 100 })
  @ApiProperty({ description: 'Nome da loja' })
  name: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Slug/subdomínio único da loja' })
  slug: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Logo da loja', required: false })
  logo: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty({ description: 'Descrição da loja', required: false })
  description: string;

  @Column({
    type: 'enum',
    enum: TenantStatus,
    default: TenantStatus.PENDING
  })
  @ApiProperty({ 
    description: 'Status da loja', 
    enum: TenantStatus,
    example: TenantStatus.PENDING
  })
  status: TenantStatus;

  @Column({
    type: 'enum',
    enum: TenantPlan,
    default: TenantPlan.FREE
  })
  @ApiProperty({ 
    description: 'Plano da loja', 
    enum: TenantPlan,
    example: TenantPlan.FREE
  })
  plan: TenantPlan;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Domínio personalizado da loja', required: false })
  customDomain: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Data de expiração do plano atual', required: false })
  planExpiresAt: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  @ApiProperty({ description: 'Proprietário da loja' })
  owner: User;

  @Column()
  ownerId: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Indica se o período de teste foi utilizado' })
  trialUsed: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;
} 