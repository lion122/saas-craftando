import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Tenant } from '../../tenants/entities/tenant.entity';
import { User } from '../../users/entities/user.entity';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  COMPLETED = 'completed',
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BOLETO = 'boleto',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'ID único do pedido' })
  id: string;

  @Column({ unique: true })
  @ApiProperty({ description: 'Número de referência do pedido (exibido para o cliente)' })
  orderNumber: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  @ApiProperty({ description: 'Loja à qual o pedido pertence' })
  tenant: Tenant;

  @Column()
  tenantId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'customerId' })
  @ApiProperty({ description: 'Cliente que fez o pedido (pode ser nulo para compras como convidado)' })
  customer: User;

  @Column({ nullable: true })
  customerId: string;

  @Column()
  @ApiProperty({ description: 'ID do usuário que fez o pedido' })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  @ApiProperty({ description: 'Usuário que fez o pedido' })
  user: User;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'Valor total dos produtos' })
  subtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'Valor do frete' })
  shipping: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ description: 'Valor do desconto aplicado' })
  discount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @ApiProperty({ description: 'Valor total do pedido' })
  total: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING
  })
  @ApiProperty({ 
    description: 'Status do pedido', 
    enum: OrderStatus,
    example: OrderStatus.PENDING
  })
  status: OrderStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true
  })
  @ApiProperty({ 
    description: 'Método de pagamento', 
    enum: PaymentMethod,
    required: false
  })
  paymentMethod: PaymentMethod;

  @Column({ nullable: true })
  @ApiProperty({ description: 'ID da transação no gateway de pagamento', required: false })
  paymentTransactionId: string;

  @Column({ 
    type: 'json', 
    nullable: true,
  })
  @ApiProperty({ description: 'Dados do endereço de entrega', required: false })
  shippingAddress: Record<string, any>;

  @Column({ 
    type: 'json', 
    nullable: true,
  })
  @ApiProperty({ description: 'Dados do endereço de cobrança', required: false })
  billingAddress: Record<string, any>;

  @Column({ 
    type: 'json'
  })
  @ApiProperty({ description: 'Items do pedido com produtos, quantidades e preços' })
  items: Record<string, any>[];

  @Column({ nullable: true })
  @ApiProperty({ description: 'Código de rastreamento da entrega', required: false })
  trackingCode: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Transportadora utilizada para o envio', required: false })
  shippingCarrier: string;

  @Column({ nullable: true, type: 'date' })
  @ApiProperty({ description: 'Data estimada de entrega', required: false })
  estimatedDeliveryDate: Date;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Notas do cliente', required: false })
  notes: string;

  @Column({ 
    type: 'json', 
    nullable: true,
  })
  @ApiProperty({ description: 'Histórico de status do pedido', required: false })
  statusHistory: Record<string, any>[];

  @CreateDateColumn()
  @ApiProperty({ description: 'Data de criação' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'Data da última atualização' })
  updatedAt: Date;
} 