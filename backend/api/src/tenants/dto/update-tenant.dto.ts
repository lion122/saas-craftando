import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { TenantStatus } from '../entities/tenant.entity';

export class UpdateTenantDto extends PartialType(OmitType(CreateTenantDto, [] as const)) {
  @ApiProperty({
    description: 'Status da loja',
    enum: TenantStatus,
    required: false,
  })
  @IsEnum(TenantStatus, { message: 'Status inválido' })
  @IsOptional()
  status?: TenantStatus;
  
  @ApiProperty({
    description: 'Domínio personalizado (geralmente gerado automaticamente)',
    example: 'minha-loja.saas.craftando.com.br',
    required: false,
  })
  @IsString({ message: 'Domínio personalizado deve ser uma string' })
  @IsOptional()
  customDomain?: string;
} 