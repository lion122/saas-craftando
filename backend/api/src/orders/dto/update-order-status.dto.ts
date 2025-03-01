import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
}

export class UpdateOrderStatusDto {
  @ApiProperty({ 
    description: 'Novo status do pedido', 
    enum: OrderStatus,
    example: OrderStatus.PROCESSING 
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({ 
    description: 'Comentário opcional sobre a mudança de status', 
    required: false,
    example: 'Pedido processado e pronto para envio' 
  })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ 
    description: 'Código de rastreamento para pedidos enviados', 
    required: false,
    example: 'BR123456789' 
  })
  @IsString()
  @IsOptional()
  trackingCode?: string;

  @ApiProperty({ 
    description: 'Transportadora utilizada para o envio', 
    required: false,
    example: 'Correios' 
  })
  @IsString()
  @IsOptional()
  shippingCarrier?: string;
} 