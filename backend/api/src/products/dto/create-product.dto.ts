import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsArray, Min, MaxLength, IsUUID } from 'class-validator';
import { ProductStatus } from '../entities/product.entity';

export class CreateProductDto {
  @ApiProperty({ description: 'Nome do produto' })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Descrição do produto', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Preço do produto' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Preço promocional', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  salePrice?: number;

  @ApiProperty({ description: 'Quantidade em estoque' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({ description: 'Controle de estoque ativado', required: false })
  @IsBoolean()
  @IsOptional()
  trackStock?: boolean;

  @ApiProperty({ description: 'URLs das imagens do produto', required: false, type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ 
    description: 'Status do produto', 
    enum: ProductStatus,
    example: ProductStatus.DRAFT,
    required: false
  })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ description: 'SKU (Código) do produto', required: false })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiProperty({ description: 'Peso do produto em gramas', required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  weight?: number;

  @ApiProperty({ description: 'Dimensões do produto (formato JSON)', required: false })
  @IsString()
  @IsOptional()
  dimensions?: string;

  @ApiProperty({ description: 'ID da loja à qual o produto pertence' })
  @IsUUID()
  tenantId: string;

  @ApiProperty({ description: 'Indica se é um produto em destaque', required: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;
} 