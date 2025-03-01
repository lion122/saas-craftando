import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { TenantStatus, TenantPlan } from './entities/tenant.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Lojas (Tenants)')
@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @ApiOperation({ summary: 'Obter todas as lojas' })
  @ApiResponse({ status: 200, description: 'Lista de lojas recuperada com sucesso' })
  @ApiQuery({ name: 'status', enum: TenantStatus, required: false })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll(@Query('status') status?: TenantStatus) {
    return this.tenantsService.findAll(status);
  }

  @ApiOperation({ summary: 'Obter uma loja específica' })
  @ApiResponse({ status: 200, description: 'Loja recuperada com sucesso' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da loja' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @ApiOperation({ summary: 'Obter loja pelo slug' })
  @ApiResponse({ status: 200, description: 'Loja recuperada com sucesso' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada' })
  @ApiParam({ name: 'slug', description: 'Slug da loja' })
  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.tenantsService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Criar uma nova loja' })
  @ApiResponse({ status: 201, description: 'Loja criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'Slug já está em uso' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTenantDto: CreateTenantDto, @Request() req) {
    return this.tenantsService.create(createTenantDto, req.user.id);
  }

  @ApiOperation({ summary: 'Atualizar uma loja existente' })
  @ApiResponse({ status: 200, description: 'Loja atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da loja' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @ApiOperation({ summary: 'Atualizar o status de uma loja' })
  @ApiResponse({ status: 200, description: 'Status da loja atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da loja' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id/status')
  updateStatus(
    @Param('id') id: string, 
    @Body('status') status: TenantStatus
  ) {
    return this.tenantsService.updateStatus(id, status);
  }

  @ApiOperation({ summary: 'Atualizar o plano de uma loja' })
  @ApiResponse({ status: 200, description: 'Plano da loja atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da loja' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Put(':id/plan')
  updatePlan(
    @Param('id') id: string, 
    @Body('plan') plan: TenantPlan,
    @Body('planExpiresAt') planExpiresAt?: Date,
  ) {
    return this.tenantsService.updatePlan(id, plan, planExpiresAt);
  }

  @ApiOperation({ summary: 'Remover uma loja' })
  @ApiResponse({ status: 200, description: 'Loja removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Loja não encontrada' })
  @ApiParam({ name: 'id', description: 'ID da loja' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }

  @ApiOperation({ summary: 'Obter lojas do usuário atual' })
  @ApiResponse({ status: 200, description: 'Lojas do usuário recuperadas com sucesso' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('user/my-stores')
  getMyStores(@Request() req) {
    return this.tenantsService.getTenantsByOwnerId(req.user.id);
  }
} 