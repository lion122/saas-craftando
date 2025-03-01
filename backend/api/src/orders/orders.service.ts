import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, FindOptionsWhere } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrdersDto } from './dto/query-orders.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ProductsService } from '../products/products.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    private productsService: ProductsService,
    private usersService: UsersService,
    private notificationsService: NotificationsService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Gerar número de pedido único
    const orderNumber = this.generateOrderNumber();
    
    // Verificar e atualizar estoque dos produtos
    if (createOrderDto.items && createOrderDto.items.length > 0) {
      for (const item of createOrderDto.items) {
        await this.productsService.updateStock(item.productId, item.quantity);
      }
    }
    
    // Criar o pedido
    const order = this.orderRepository.create({
      ...createOrderDto,
      orderNumber,
      statusHistory: [
        {
          status: OrderStatus.PENDING,
          date: new Date(),
          comment: 'Pedido criado',
        },
      ],
    });
    
    // Salvar o pedido
    const savedOrder = await this.orderRepository.save(order);

    // Enviar email de confirmação do pedido
    try {
      const user = await this.usersService.findOne(savedOrder.userId);
      if (user && user.email) {
        await this.notificationsService.sendOrderConfirmation(savedOrder, user);
      }
    } catch (error) {
      console.error('Erro ao enviar email de confirmação:', error);
    }

    return savedOrder;
  }

  async findAll(queryDto: QueryOrdersDto) {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      paymentMethod,
      tenantId, 
      customerId,
      sortBy = 'createdAt', 
      sortDirection = 'DESC',
      startDate,
      endDate
    } = queryDto;
    
    const skip = (page - 1) * limit;
    
    const where: FindOptionsWhere<Order> = {};
    
    if (search) {
      where.orderNumber = Like(`%${search}%`);
    }
    
    if (status) {
      where.status = status;
    }
    
    if (paymentMethod) {
      where.paymentMethod = paymentMethod;
    }
    
    if (tenantId) {
      where.tenantId = tenantId;
    }
    
    if (customerId) {
      where.customerId = customerId;
    }
    
    // Filtro por data
    if (startDate && endDate) {
      where.createdAt = Between(
        new Date(startDate), 
        new Date(endDate)
      );
    }
    
    const [orders, total] = await this.orderRepository.findAndCount({
      where,
      order: {
        [sortBy]: sortDirection,
      },
      skip,
      take: limit,
      relations: ['customer', 'tenant'],
    });
    
    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ 
      where: { id },
      relations: ['customer', 'tenant'],
    });
    
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    
    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ 
      where: { orderNumber },
      relations: ['customer', 'tenant'],
    });
    
    if (!order) {
      throw new NotFoundException(`Pedido com número ${orderNumber} não encontrado`);
    }
    
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    
    // Atualiza apenas os campos fornecidos
    Object.assign(order, updateOrderDto);
    
    return this.orderRepository.save(order);
  }

  async updateStatus(id: string, updateStatusDto: UpdateOrderStatusDto): Promise<Order> {
    const order = await this.findOne(id);
    
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    
    // Verificar se a transição de status é válida
    this.validateStatusTransition(order.status, updateStatusDto.status);
    
    // Atualizar status
    order.status = updateStatusDto.status;
    
    // Adicionar comentário se fornecido
    if (updateStatusDto.comment) {
      if (!order.statusHistory) {
        order.statusHistory = [];
      }
      
      order.statusHistory.push({
        status: updateStatusDto.status,
        date: new Date(),
        comment: updateStatusDto.comment
      });
    }
    
    // Atualizar data de modificação
    order.updatedAt = new Date();
    
    // Salvar as alterações
    const updatedOrder = await this.orderRepository.save(order);

    // Enviar email de atualização de status
    try {
      const user = await this.usersService.findOne(updatedOrder.userId);
      if (user && user.email) {
        await this.notificationsService.sendOrderStatusUpdate(updatedOrder, user);
        
        // Se o status for "shipped", enviar email de confirmação de envio
        if (updateStatusDto.status === 'shipped' && updateStatusDto.trackingCode) {
          await this.notificationsService.sendShippingConfirmation(
            updatedOrder, 
            user, 
            updateStatusDto.trackingCode
          );
          
          // Atualizar o código de rastreamento no pedido
          updatedOrder.trackingCode = updateStatusDto.trackingCode;
          await this.orderRepository.save(updatedOrder);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar email de atualização de status:', error);
    }
    
    return updatedOrder;
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    
    // Verificar se o pedido pode ser cancelado
    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PAID) {
      throw new BadRequestException(`Não é possível cancelar um pedido com status ${order.status}`);
    }
    
    // Atualizar status para cancelado
    order.status = OrderStatus.CANCELLED;
    
    // Adicionar ao histórico de status
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    
    order.statusHistory.push({
      status: OrderStatus.CANCELLED,
      date: new Date(),
      comment: 'Pedido cancelado',
    });
    
    await this.orderRepository.save(order);
  }

  async findByTenant(tenantId: string, queryDto: QueryOrdersDto) {
    queryDto.tenantId = tenantId;
    return this.findAll(queryDto);
  }

  async findByCustomer(customerId: string, queryDto: QueryOrdersDto) {
    queryDto.customerId = customerId;
    return this.findAll(queryDto);
  }

  private generateOrderNumber(): string {
    // Gerar número de pedido no formato: ANO + MÊS + DIA + 6 dígitos aleatórios
    const now = new Date();
    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    return `${year}${month}${day}${random}`;
  }

  private validateStatusTransition(currentStatus: OrderStatus, newStatus: OrderStatus): void {
    // Definir transições válidas de status
    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.PENDING]: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.CANCELLED],
      [OrderStatus.PROCESSING]: [OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.PAID]: [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.REFUNDED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED, OrderStatus.REFUNDED],
      [OrderStatus.DELIVERED]: [OrderStatus.COMPLETED, OrderStatus.REFUNDED],
      [OrderStatus.COMPLETED]: [OrderStatus.REFUNDED],
      [OrderStatus.CANCELLED]: [],
      [OrderStatus.REFUNDED]: [],
    };
    
    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Transição de status inválida: ${currentStatus} -> ${newStatus}`
      );
    }
  }
} 