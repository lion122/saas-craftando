"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/config/api';
import { formatPrice, formatDate } from '@/utils/format';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle2 } from 'lucide-react';

// Tipos
interface OrderItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface OrderAddress {
  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  items: OrderItem[];
  address: OrderAddress;
  shippingMethod: {
    name: string;
    price: number;
    estimatedDays: number;
  };
  paymentMethod: {
    name: string;
  };
  subtotal: number;
  shippingCost: number;
  total: number;
  createdAt: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const orderId = params.id as string;
  
  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const orderData = await api.getOrder(orderId);
        setOrder(orderData);
      } catch (err) {
        console.error('Erro ao carregar pedido:', err);
        setError('Não foi possível carregar os detalhes do pedido. Por favor, tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Erro</h1>
        <p className="text-red-500 mb-6">{error}</p>
        <Button onClick={() => router.push('/')}>Voltar para a página inicial</Button>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container mx-auto py-8 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Pedido não encontrado</h1>
        <p className="mb-6">O pedido que você está procurando não foi encontrado.</p>
        <Button onClick={() => router.push('/')}>Voltar para a página inicial</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Pedido Confirmado!</h1>
          <p className="text-gray-600 mb-2">
            Seu pedido #{order.orderNumber} foi recebido e está sendo processado.
          </p>
          <p className="text-gray-600">
            Um e-mail de confirmação foi enviado para o seu endereço de e-mail cadastrado.
          </p>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
            <CardDescription>
              Pedido realizado em {formatDate(order.createdAt)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Status do pedido */}
              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <div className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {order.status === 'pending' ? 'Pendente' : 
                   order.status === 'processing' ? 'Em processamento' :
                   order.status === 'shipped' ? 'Enviado' :
                   order.status === 'delivered' ? 'Entregue' :
                   order.status === 'cancelled' ? 'Cancelado' : order.status}
                </div>
              </div>
              
              {/* Itens do pedido */}
              <div>
                <h3 className="font-medium mb-2">Itens</h3>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">x{item.quantity}</span>
                      </div>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Resumo de valores */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Frete ({order.shippingMethod.name})</span>
                  <span>{formatPrice(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
              
              <Separator />
              
              {/* Endereço de entrega */}
              <div>
                <h3 className="font-medium mb-2">Endereço de Entrega</h3>
                <p>{order.address.street}, {order.address.number}</p>
                {order.address.complement && <p>{order.address.complement}</p>}
                <p>{order.address.district}, {order.address.city} - {order.address.state}</p>
                <p>CEP: {order.address.zipCode}</p>
              </div>
              
              {/* Método de pagamento */}
              <div>
                <h3 className="font-medium mb-2">Forma de Pagamento</h3>
                <p>{order.paymentMethod.name}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link href="/">Continuar Comprando</Link>
            </Button>
            <Button asChild>
              <Link href="/account/orders">Ver Meus Pedidos</Link>
            </Button>
          </CardFooter>
        </Card>
        
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Dúvidas sobre seu pedido? Entre em contato com nosso suporte.
          </p>
          <Button variant="outline" asChild>
            <Link href="/contact">Fale Conosco</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 