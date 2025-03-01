import { Controller, Get, Post, Body, Param, Put, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('carts')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter carrinho do usuário' })
  @ApiResponse({ status: 200, description: 'Carrinho encontrado', type: Cart })
  @ApiQuery({ name: 'storeId', required: true, description: 'ID da loja' })
  async getUserCart(
    @Param('userId') userId: string,
    @Query('storeId') storeId: string,
  ): Promise<Cart> {
    return this.cartsService.getUserCart(userId, storeId);
  }

  @Put('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar carrinho do usuário' })
  @ApiResponse({ status: 200, description: 'Carrinho atualizado', type: Cart })
  @ApiQuery({ name: 'storeId', required: true, description: 'ID da loja' })
  async updateUserCart(
    @Param('userId') userId: string,
    @Query('storeId') storeId: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    return this.cartsService.updateUserCart(userId, storeId, updateCartDto);
  }

  @Delete('user/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Limpar carrinho do usuário' })
  @ApiResponse({ status: 200, description: 'Carrinho limpo' })
  @ApiQuery({ name: 'storeId', required: true, description: 'ID da loja' })
  async clearUserCart(
    @Param('userId') userId: string,
    @Query('storeId') storeId: string,
  ): Promise<void> {
    return this.cartsService.clearUserCart(userId, storeId);
  }

  @Post('user/:userId/items')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar item ao carrinho' })
  @ApiResponse({ status: 200, description: 'Item adicionado', type: Cart })
  async addItemToCart(
    @Param('userId') userId: string,
    @Body() body: { storeId: string; item: any },
  ): Promise<Cart> {
    return this.cartsService.addItemToCart(userId, body.storeId, body.item);
  }

  @Delete('user/:userId/items/:itemId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover item do carrinho' })
  @ApiResponse({ status: 200, description: 'Item removido', type: Cart })
  @ApiQuery({ name: 'storeId', required: true, description: 'ID da loja' })
  async removeItemFromCart(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
    @Query('storeId') storeId: string,
  ): Promise<Cart> {
    return this.cartsService.removeItemFromCart(userId, storeId, itemId);
  }

  @Put('user/:userId/items/:itemId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar quantidade de item no carrinho' })
  @ApiResponse({ status: 200, description: 'Quantidade atualizada', type: Cart })
  async updateItemQuantity(
    @Param('userId') userId: string,
    @Param('itemId') itemId: string,
    @Body() body: { storeId: string; quantity: number },
  ): Promise<Cart> {
    return this.cartsService.updateItemQuantity(userId, body.storeId, itemId, body.quantity);
  }
} 