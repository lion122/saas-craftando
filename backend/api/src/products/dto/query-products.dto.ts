import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus } from '../entities/product.entity';

export class QueryProductsDto {
  @ApiProperty({ description: 'Página atual', required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({ description: 'Itens por página', required: false, default: 10 })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Type(() => Number)
  limit?: number = 10;

  @ApiProperty({ description: 'Termo de busca para nome ou descrição', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Filtrar por status', required: false, enum: ProductStatus })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @ApiProperty({ description: 'Filtrar por ID da loja', required: false })
  @IsUUID()
  @IsOptional()
  tenantId?: string;

  @ApiProperty({ description: 'Ordenar por campo', required: false, default: 'createdAt' })
  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiProperty({ description: 'Direção da ordenação', required: false, default: 'DESC', enum: ['ASC', 'DESC'] })
  @IsString()
  @IsOptional()
  sortDirection?: 'ASC' | 'DESC' = 'DESC';

  @ApiProperty({ description: 'Filtrar apenas produtos em destaque', required: false })
  @IsOptional()
  @Type(() => Boolean)
  featured?: boolean;
} 