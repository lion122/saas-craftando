import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  ADMIN = 'admin',        // Administrador da plataforma
  TENANT_OWNER = 'owner', // Proprietário de loja (tenant)
  TENANT_STAFF = 'staff', // Funcionário de loja
  CUSTOMER = 'customer',  // Cliente final
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'ID único do usuário' })
  id: string;

  @Column({ length: 100 })
  @ApiProperty({ description: 'Nome completo do usuário' })
  name: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Email do usuário (utilizado para login)' })
  email: string;

  @Column()
  @Exclude()
  @ApiProperty({ description: 'Senha criptografada', writeOnly: true })
  password: string;

  @Column({ nullable: true })
  @Exclude()
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.CUSTOMER
  })
  @ApiProperty({ 
    description: 'Papel do usuário no sistema', 
    enum: UserRole,
    example: UserRole.CUSTOMER
  })
  role: UserRole;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Último login do usuário', required: false })
  lastLogin: Date;

  @Column({ default: true })
  @ApiProperty({ description: 'Status de ativação do usuário' })
  isActive: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
} 