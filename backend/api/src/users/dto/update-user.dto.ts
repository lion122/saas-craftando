import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString, MinLength } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { Type } from 'class-transformer';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Senha do usuário (opcional para atualização)',
    example: 'nova_senha123',
    required: false,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @IsOptional()
  password?: string;
  
  @ApiProperty({
    description: 'Data do último login',
    required: false,
  })
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  lastLogin?: Date;
  
  @ApiProperty({
    description: 'Token de atualização',
    required: false,
  })
  @IsString()
  @IsOptional()
  refreshToken?: string;
} 