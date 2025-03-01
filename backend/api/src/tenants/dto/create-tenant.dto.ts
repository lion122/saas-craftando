import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Nome da loja',
    example: 'Minha Loja Virtual',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MaxLength(100, { message: 'Nome deve ter no máximo 100 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Slug/subdomínio único da loja (apenas letras minúsculas, números e hífens)',
    example: 'minha-loja',
  })
  @IsString({ message: 'Slug deve ser uma string' })
  @IsNotEmpty({ message: 'Slug é obrigatório' })
  @Matches(/^[a-z0-9-]+$/, { 
    message: 'Slug deve conter apenas letras minúsculas, números e hífens'
  })
  @Transform(({ value }) => value.toLowerCase())
  slug: string;

  @ApiProperty({
    description: 'Logo da loja (URL)',
    example: 'https://exemplo.com/logo.png',
    required: false,
  })
  @IsString({ message: 'Logo deve ser uma string (URL)' })
  @IsOptional()
  logo?: string;

  @ApiProperty({
    description: 'Descrição da loja',
    example: 'Loja especializada em produtos artesanais',
    required: false,
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsOptional()
  description?: string;
} 