import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum ProductStatus {
  ACTIVE = 'active',
  DRAFT = 'draft',
  OUT_OF_STOCK = 'out_of_stock',
  DELETED = 'deleted',
}

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'ID único do produto' })
  id: string;

  @Column({ length: 255 })
  @ApiProperty({ description: 'Nome do produto' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty({ description: 'Descrição do produto', required: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'Preço do produto' })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  @ApiProperty({ description: 'Preço promocional', required: false })
  salePrice: number;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Quantidade em estoque' })
  stock: number;

  @Column({ default: true })
  @ApiProperty({ description: 'Controle de estoque ativado' })
  trackStock: boolean;

  @Column({ type: 'simple-array', nullable: true })
  @ApiProperty({ description: 'URLs das imagens do produto', required: false, type: [String] })
  images: string[];

  @Column({ 
    type: 'enum',
    enum: ProductStatus,
    default: ProductStatus.DRAFT
  })
  @ApiProperty({ 
    description: 'Status do produto', 
    enum: ProductStatus,
    example: ProductStatus.DRAFT
  })
  status: ProductStatus;

  @Column({ nullable: true })
  @ApiProperty({ description: 'SKU (Código) do produto', required: false })
  sku: string;

  @Column({ default: 0 })
  @ApiProperty({ description: 'Peso do produto em gramas' })
  weight: number;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Dimensões do produto (formato JSON)', required: false })
  dimensions: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  @ApiProperty({ description: 'Loja à qual o produto pertence' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Indica se é um produto em destaque' })
  featured: boolean;

  @CreateDateColumn()
  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;
} 