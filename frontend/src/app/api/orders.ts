import { API_URL } from '@/config';
import { CartItem } from '@/components/ShoppingCart';

// Interface principal para pedidos
export interface Order {
  id: string;
  orderNumber: string;
  tenantId: string;
  customerId?: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddress: ShippingAddress;
  billingAddress?: BillingAddress;
  paymentTransactionId?: string;
  trackingCode?: string;
  notes?: string;
  shippingMethod: string;
  estimatedDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Enums e interfaces relacionadas
export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  COMPLETED = 'completed'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BOLETO = 'boleto',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet'
}

export enum PaymentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DECLINED = 'declined',
  REFUNDED = 'refunded',
  CANCELLED = 'cancelled'
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  sku?: string;
  image?: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface BillingAddress extends ShippingAddress {}

export interface OrdersFilter {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface CreateOrderDto {
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    customerId?: string;
  };
  shippingAddress: Omit<ShippingAddress, 'name' | 'phone'>;
  billingAddress?: Omit<BillingAddress, 'name' | 'phone'>;
  payment: {
    method: PaymentMethod;
    details?: any;
  };
  shippingMethod: string;
  subtotal: number;
  shipping: number;
  discount?: number;
  notes?: string;
}

// Funções para gerenciar pedidos
export async function getOrders(tenantId: string, filters: OrdersFilter = {}): Promise<Order[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    // Construir query parameters
    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.customerId) queryParams.append('customerId', filters.customerId);
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const queryString = queryParams.toString();
    
    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/orders${queryString ? `?${queryString}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar pedidos');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  }
}

export async function getCustomerOrders(tenantId: string, filters: OrdersFilter = {}): Promise<Order[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const queryParams = new URLSearchParams();
    
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.startDate) queryParams.append('startDate', filters.startDate);
    if (filters.endDate) queryParams.append('endDate', filters.endDate);
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const queryString = queryParams.toString();
    
    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/orders/my-orders${queryString ? `?${queryString}` : ''}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar pedidos do cliente');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar pedidos do cliente:', error);
    return [];
  }
}

export async function getOrder(tenantId: string, orderId: string): Promise<Order | null> {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao buscar detalhes do pedido');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    return null;
  }
}

export async function createOrder(tenantId: string, orderData: CreateOrderDto): Promise<Order | null> {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(orderData)
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro ao criar pedido');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    return null;
  }
}

export async function updateOrderStatus(
  tenantId: string, 
  orderId: string, 
  status: OrderStatus
): Promise<Order | null> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/orders/${orderId}/status`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao atualizar status do pedido');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao atualizar status do pedido:', error);
    return null;
  }
}

export async function cancelOrder(tenantId: string, orderId: string, reason?: string): Promise<boolean> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/orders/${orderId}/cancel`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao cancelar pedido');
    }

    return true;
  } catch (error) {
    console.error('Erro ao cancelar pedido:', error);
    return false;
  }
} 