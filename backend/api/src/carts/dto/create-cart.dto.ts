import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartItem } from '../entities/cart.entity';

export class CreateCartItemDto implements Partial<CartItem> {
  @ApiProperty({ description: 'ID único do item' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'ID do produto' })
  @IsUUID()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Preço do produto' })
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Preço promocional', required: false })
  salePrice?: number;

  @ApiProperty({ description: 'Quantidade do produto' })
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ description: 'URL da imagem do produto', required: false })
  imageUrl?: string;
}

export class CreateCartDto {
  @ApiProperty({ description: 'ID da loja' })
  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @ApiProperty({ description: 'ID do usuário' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Itens do carrinho', type: [CreateCartItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCartItemDto)
  items: CreateCartItemDto[];
} 