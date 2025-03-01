import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { NotificationsService } from '../notifications/notifications.service';
import { RegisterDto } from './dto/register.dto';
import { User } from '../users/entities/user.entity';
import { getRepository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private notificationsService: NotificationsService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    
    // Atualiza último login
    user.lastLogin = new Date();
    await this.usersService.update(user.id, { lastLogin: user.lastLogin });
    
    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email,
      role: user.role 
    };
    
    return {
      user,
      access_token: this.jwtService.sign(payload),
      refresh_token: this.jwtService.sign(
        payload,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
        },
      ),
    };
  }

  async register(registerDto: RegisterDto): Promise<any> {
    // Verificar se o email já está em uso
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }
    
    // Criar o novo usuário
    const user = await this.usersService.create({
      name: registerDto.name,
      email: registerDto.email,
      password: registerDto.password,
      // Por padrão será criado como CUSTOMER
    });
    
    // Enviar email de boas-vindas
    try {
      await this.notificationsService.sendWelcomeEmail(user);
    } catch (error) {
      console.error('Erro ao enviar email de boas-vindas:', error);
      // Não bloquear o registro se o envio de email falhar
    }
    
    // Gerar tokens de acesso e refresh
    const tokens = await this.getTokens(user.id.toString(), user.email);
    
    // Armazenar o refresh token sem alterar a senha
    await this.usersService.updateRefreshTokenOnly(user.id.toString(), await bcrypt.hash(tokens.refreshToken, 10));
    
    // Remove a senha antes de retornar
    const { password: _, ...result } = user;
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      
      const user = await this.usersService.findOne(payload.sub);
      
      if (!user || !user.isActive) {
        throw new UnauthorizedException('Usuário inválido ou inativo');
      }
      
      const newPayload = { 
        sub: user.id, 
        email: user.email,
        role: user.role 
      };
      
      return {
        access_token: this.jwtService.sign(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('Token de atualização inválido');
    }
  }

  async getTokens(userId: string, email: string) {
    const payload = { 
      sub: userId, 
      email: email 
    };
    
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(
        payload,
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION'),
        },
      ),
    };
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    // Usar método específico no UsersService para atualizar apenas o refreshToken
    await this.usersService.updateRefreshTokenOnly(userId, hashedRefreshToken);
  }
} 