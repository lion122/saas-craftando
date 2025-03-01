import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus, PaymentMethod } from '../entities/order.entity';

class OrderItemDto {
  @ApiProperty({ description: 'ID do produto' })
  @IsUUID()
  productId: string;

  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Preço unitário do produto' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Quantidade do produto' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: 'URL da imagem principal do produto', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;
}

class AddressDto {
  @ApiProperty({ description: 'Nome completo' })
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Endereço (rua, número, complemento)' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Cidade' })
  @IsString()
  city: string;

  @ApiProperty({ description: 'Estado' })
  @IsString()
  state: string;

  @ApiProperty({ description: 'CEP' })
  @IsString()
  zipCode: string;

  @ApiProperty({ description: 'País', required: false })
  @IsString()
  @IsOptional()
  country?: string = 'Brasil';

  @ApiProperty({ description: 'Telefone' })
  @IsString()
  phone: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: 'ID da loja à qual o pedido pertence' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: 'ID do cliente (opcional para compras como convidado)', required: false })
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiProperty({ description: 'Valor total dos produtos' })
  @IsNumber()
  @Min(0)
  subtotal: number;

  @ApiProperty({ description: 'Valor do frete' })
  @IsNumber()
  @Min(0)
  shipping: number;

  @ApiProperty({ description: 'Valor do desconto aplicado', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number = 0;

  @ApiProperty({ description: 'Valor total do pedido' })
  @IsNumber()
  @Min(0)
  total: number;

  @ApiProperty({ 
    description: 'Status do pedido', 
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    required: false
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus = OrderStatus.PENDING;

  @ApiProperty({ 
    description: 'Método de pagamento', 
    enum: PaymentMethod,
    required: false
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: PaymentMethod;

  @ApiProperty({ description: 'ID da transação no gateway de pagamento', required: false })
  @IsString()
  @IsOptional()
  paymentTransactionId?: string;

  @ApiProperty({ description: 'Dados do endereço de entrega' })
  @ValidateNested()
  @Type(() => AddressDto)
  shippingAddress: AddressDto;

  @ApiProperty({ description: 'Dados do endereço de cobrança', required: false })
  @ValidateNested()
  @Type(() => AddressDto)
  @IsOptional()
  billingAddress?: AddressDto;

  @ApiProperty({ description: 'Items do pedido com produtos, quantidades e preços' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({ description: 'Notas do cliente', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
} 