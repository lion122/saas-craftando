import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Order } from '../orders/entities/order.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendOrderConfirmation(order: Order, user: User): Promise<void> {
    try {
      this.logger.log(`Enviando email de confirmação de pedido para ${user.email}`);
      await this.mailerService.sendMail({
        to: user.email,
        subject: `Pedido #${order.orderNumber} Confirmado`,
        template: 'order-confirmation',
        context: {
          order,
          user,
          date: new Date().toLocaleDateString('pt-BR'),
        },
      });
      this.logger.log(`Email de confirmação de pedido enviado com sucesso para ${user.email}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email de confirmação de pedido: ${error.message}`, error.stack);
    }
  }

  async sendOrderStatusUpdate(order: Order, user: User): Promise<void> {
    try {
      this.logger.log(`Enviando email de atualização de status para ${user.email}`);
      await this.mailerService.sendMail({
        to: user.email,
        subject: `Atualização do Pedido #${order.orderNumber}`,
        template: 'order-status-update',
        context: {
          order,
          user,
          date: new Date().toLocaleDateString('pt-BR'),
          statusText: this.getStatusText(order.status),
        },
      });
      this.logger.log(`Email de atualização de status enviado com sucesso para ${user.email}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email de atualização de status: ${error.message}`, error.stack);
    }
  }

  async sendShippingConfirmation(order: Order, user: User, trackingCode: string): Promise<void> {
    try {
      this.logger.log(`Enviando email de confirmação de envio para ${user.email}`);
      await this.mailerService.sendMail({
        to: user.email,
        subject: `Pedido #${order.orderNumber} Enviado`,
        template: 'shipping-confirmation',
        context: {
          order,
          user,
          trackingCode,
          date: new Date().toLocaleDateString('pt-BR'),
        },
      });
      this.logger.log(`Email de confirmação de envio enviado com sucesso para ${user.email}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email de confirmação de envio: ${error.message}`, error.stack);
    }
  }

  async sendWelcomeEmail(user: User): Promise<void> {
    try {
      this.logger.log(`Enviando email de boas-vindas para ${user.email}`);
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Bem-vindo à nossa plataforma',
        template: 'welcome',
        context: {
          user,
          name: user.name,
          loginUrl: 'https://saas.craftando.com.br/login',
          date: new Date().toLocaleDateString('pt-BR'),
        },
      });
      this.logger.log(`Email de boas-vindas enviado com sucesso para ${user.email}`);
    } catch (error) {
      this.logger.error(`Erro ao enviar email de boas-vindas: ${error.message}`, error.stack);
      // Não lançar exceção para não bloquear o fluxo de registro
    }
  }

  private getStatusText(status: string): string {
    const statusMap = {
      pending: 'Pendente',
      paid: 'Pago',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado',
      shipped: 'Enviado',
      delivered: 'Entregue',
      completed: 'Concluído',
    };

    return statusMap[status] || status;
  }
} 