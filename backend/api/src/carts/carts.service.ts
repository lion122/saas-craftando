import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart, CartItem } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  async findOrCreateUserCart(userId: string, storeId: string): Promise<Cart> {
    // Buscar carrinho existente
    let cart = await this.cartRepository.findOne({
      where: { userId, storeId },
    });

    // Se não existir, criar um novo
    if (!cart) {
      cart = this.cartRepository.create({
        userId,
        storeId,
        items: [],
      });
      await this.cartRepository.save(cart);
    }

    return cart;
  }

  async getUserCart(userId: string, storeId: string): Promise<Cart> {
    return this.findOrCreateUserCart(userId, storeId);
  }

  async updateUserCart(userId: string, storeId: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOrCreateUserCart(userId, storeId);
    
    // Atualizar itens do carrinho
    if (updateCartDto.items) {
      cart.items = updateCartDto.items;
    }
    
    return this.cartRepository.save(cart);
  }

  async clearUserCart(userId: string, storeId: string): Promise<void> {
    const cart = await this.findOrCreateUserCart(userId, storeId);
    
    // Limpar itens do carrinho
    cart.items = [];
    
    await this.cartRepository.save(cart);
  }

  async addItemToCart(userId: string, storeId: string, item: CartItem): Promise<Cart> {
    const cart = await this.findOrCreateUserCart(userId, storeId);
    
    // Verificar se o item já existe no carrinho
    const existingItemIndex = cart.items.findIndex(i => i.id === item.id);
    
    if (existingItemIndex >= 0) {
      // Atualizar quantidade se o item já existir
      cart.items[existingItemIndex].quantity += item.quantity;
    } else {
      // Adicionar novo item
      cart.items.push(item);
    }
    
    return this.cartRepository.save(cart);
  }

  async removeItemFromCart(userId: string, storeId: string, itemId: string): Promise<Cart> {
    const cart = await this.findOrCreateUserCart(userId, storeId);
    
    // Remover item do carrinho
    cart.items = cart.items.filter(item => item.id !== itemId);
    
    return this.cartRepository.save(cart);
  }

  async updateItemQuantity(userId: string, storeId: string, itemId: string, quantity: number): Promise<Cart> {
    const cart = await this.findOrCreateUserCart(userId, storeId);
    
    // Encontrar o item no carrinho
    const itemIndex = cart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex === -1) {
      throw new NotFoundException(`Item com ID ${itemId} não encontrado no carrinho`);
    }
    
    // Atualizar quantidade
    cart.items[itemIndex].quantity = quantity;
    
    return this.cartRepository.save(cart);
  }
} 