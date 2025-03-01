import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { Product, ProductStatus } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll(queryDto: QueryProductsDto) {
    const { page = 1, limit = 10, search, status, tenantId, sortBy = 'createdAt', sortDirection = 'DESC', featured } = queryDto;
    
    const skip = (page - 1) * limit;
    
    const where: FindOptionsWhere<Product> = {};
    
    if (search) {
      where.name = Like(`%${search}%`);
    }
    
    if (status) {
      where.status = status;
    }
    
    if (tenantId) {
      where.tenantId = tenantId;
    }
    
    if (featured !== undefined) {
      where.featured = featured;
    }
    
    const [products, total] = await this.productRepository.findAndCount({
      where,
      order: {
        [sortBy]: sortDirection,
      },
      skip,
      take: limit,
    });
    
    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    
    // Atualiza apenas os campos fornecidos
    Object.assign(product, updateProductDto);
    
    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    
    // Opção 1: Exclusão lógica (recomendada)
    product.status = ProductStatus.DELETED;
    await this.productRepository.save(product);
    
    // Opção 2: Exclusão física
    // await this.productRepository.remove(product);
  }

  async findByTenant(tenantId: string, queryDto: QueryProductsDto) {
    queryDto.tenantId = tenantId;
    return this.findAll(queryDto);
  }

  async updateStock(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    
    if (!product.trackStock) {
      return product;
    }
    
    if (product.stock < quantity) {
      throw new BadRequestException(`Estoque insuficiente para o produto ${product.name}`);
    }
    
    product.stock -= quantity;
    
    // Atualiza o status se o estoque chegar a zero
    if (product.stock === 0) {
      product.status = ProductStatus.OUT_OF_STOCK;
    }
    
    return this.productRepository.save(product);
  }
} 