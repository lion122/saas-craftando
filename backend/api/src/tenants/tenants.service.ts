import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant, TenantStatus, TenantPlan } from './entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private tenantsRepository: Repository<Tenant>,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async findAll(status?: TenantStatus): Promise<Tenant[]> {
    const query = this.tenantsRepository.createQueryBuilder('tenant');
    
    if (status) {
      query.where('tenant.status = :status', { status });
    }
    
    return query.getMany();
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantsRepository.findOne({ 
      where: { id },
      relations: ['owner'],
    });
    
    if (!tenant) {
      throw new NotFoundException(`Loja com ID ${id} não encontrada`);
    }
    
    return tenant;
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return this.tenantsRepository.findOne({ 
      where: { slug },
      relations: ['owner'],
    });
  }

  async create(createTenantDto: CreateTenantDto, userId: string): Promise<Tenant> {
    // Verifica se o slug já está em uso
    const existingTenant = await this.findBySlug(createTenantDto.slug);
    if (existingTenant) {
      throw new ConflictException('Este slug já está em uso. Escolha outro nome para sua loja.');
    }
    
    // Verifica se o usuário existe
    const owner = await this.usersService.findOne(userId);
    
    // Atualiza o papel do usuário para TENANT_OWNER se ainda não for
    if (owner.role !== UserRole.ADMIN && owner.role !== UserRole.TENANT_OWNER) {
      await this.usersService.update(userId, { role: UserRole.TENANT_OWNER });
    }
    
    const tenant = this.tenantsRepository.create({
      ...createTenantDto,
      ownerId: userId,
    });
    
    // Gera o domínio personalizado com base no padrão configurado
    const domainPattern = this.configService.get<string>('TENANT_DOMAIN_PATTERN') || '{slug}.saas.craftando.com.br';
    tenant.customDomain = domainPattern.replace('{slug}', tenant.slug);
    
    return this.tenantsRepository.save(tenant);
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    
    // Se estiver tentando atualizar o slug, verifica se já existe
    if (updateTenantDto.slug && updateTenantDto.slug !== tenant.slug) {
      const existingTenant = await this.findBySlug(updateTenantDto.slug);
      if (existingTenant) {
        throw new ConflictException('Este slug já está em uso. Escolha outro nome para sua loja.');
      }
      
      // Atualiza também o domínio personalizado
      const domainPattern = this.configService.get<string>('TENANT_DOMAIN_PATTERN') || '{slug}.saas.craftando.com.br';
      updateTenantDto.customDomain = domainPattern.replace('{slug}', updateTenantDto.slug);
    }
    
    // Atualiza os campos
    Object.assign(tenant, updateTenantDto);
    
    return this.tenantsRepository.save(tenant);
  }

  async updateStatus(id: string, status: TenantStatus): Promise<Tenant> {
    const tenant = await this.findOne(id);
    tenant.status = status;
    return this.tenantsRepository.save(tenant);
  }

  async updatePlan(id: string, plan: TenantPlan, planExpiresAt?: Date): Promise<Tenant> {
    const tenant = await this.findOne(id);
    tenant.plan = plan;
    
    if (planExpiresAt) {
      tenant.planExpiresAt = planExpiresAt;
    }
    
    return this.tenantsRepository.save(tenant);
  }

  async remove(id: string): Promise<void> {
    const tenant = await this.findOne(id);
    await this.tenantsRepository.remove(tenant);
  }

  async getTenantsByOwnerId(ownerId: string): Promise<Tenant[]> {
    return this.tenantsRepository.find({
      where: { ownerId },
    });
  }

  getStorefrontUrl(tenant: Tenant): string {
    return `https://${tenant.customDomain || tenant.slug + '.saas.craftando.com.br'}`;
  }

  getAdminUrl(tenant: Tenant): string {
    return `https://saas.craftando.com.br/admin/lojas/${tenant.id}`;
  }
} 