'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getStoreBySlug } from '@/app/api/stores';
import { getOrder, Order } from '@/app/api/orders';
import { ArrowLeft, Check, Clock, PackageOpen, Truck } from 'lucide-react';

export default function OrderConfirmationPage() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  
  const [loading, setLoading] = useState(true);
  const [store, setStore] = useState<any>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        // Carregar dados da loja
        const storeData = await getStoreBySlug(slug);
        if (!storeData) {
          setError('Loja não encontrada');
          setLoading(false);
          return;
        }
        setStore(storeData);

        // Carregar pedido se houver um ID
        if (orderId) {
          const orderData = await getOrder(storeData.id, orderId);
          if (orderData) {
            setOrder(orderData);
          }
        }
      } catch (err) {
        setError('Ocorreu um erro ao carregar os dados');
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4 border-4 border-t-primary rounded-full animate-spin"></div>
          <h2 className="text-xl font-semibold">Carregando informações...</h2>
        </div>
      </div>
    );
  }

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            {error || 'Ocorreu um erro ao carregar as informações'}
          </h2>
          <Link href="/" className="text-primary hover:underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }

  // Dados simulados para quando não temos um pedido real
  const mockOrder = {
    orderNumber: 'OSF' + Math.floor(100000 + Math.random() * 900000),
    total: 345.90,
    createdAt: new Date(),
    paymentMethod: 'Cartão de Crédito',
    shippingMethod: 'Entrega Padrão',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 dias a partir de hoje
  };

  const displayOrder = order || mockOrder;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cabeçalho da Loja */}
      <header className="bg-white shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
            <Link 
              href={`/stores/${slug}`}
              className="text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Voltar à loja
            </Link>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href={`/stores/${slug}`} className="hover:text-primary">
                Início
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href={`/stores/${slug}/checkout`} className="hover:text-primary">
                Checkout
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li className="text-primary font-medium">Confirmação</li>
          </ol>
        </nav>

        {/* Mensagem de Confirmação */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check size={32} className="text-green-600" />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-4">
            Pedido Confirmado!
          </h1>
          
          <p className="text-center text-gray-600 mb-6">
            Seu pedido foi recebido e está sendo processado. Obrigado por comprar conosco!
          </p>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Detalhes do Pedido</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Número do Pedido:</span>
                    <span className="font-medium">{displayOrder.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Data:</span>
                    <span className="font-medium">
                      {new Date(displayOrder.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">
                      R$ {typeof displayOrder.total === 'number' ? displayOrder.total.toFixed(2) : displayOrder.total}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de Pagamento:</span>
                    <span className="font-medium">{displayOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Entrega</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="mr-3">
                      <Truck size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{displayOrder.shippingMethod}</p>
                      <p className="text-gray-600 text-sm">
                        Entrega prevista para: {new Date(displayOrder.estimatedDelivery).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3">
                      <Clock size={20} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">Status</p>
                      <p className="text-sm text-green-600">Pedido confirmado, preparando envio</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-6">Próximos Passos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-4">
                <Check size={20} className="text-green-600 mr-2" />
                <h3 className="font-medium">Pedido Recebido</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Recebemos seu pedido e estamos processando.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-4">
                <PackageOpen size={20} className="text-gray-600 mr-2" />
                <h3 className="font-medium">Preparação</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Seu pedido está sendo preparado para envio.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-4">
                <Truck size={20} className="text-gray-600 mr-2" />
                <h3 className="font-medium">Envio</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Você receberá um e-mail com o código de rastreamento assim que seu pedido for enviado.
              </p>
            </div>
          </div>
        </div>

        {/* Links e Ações */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link 
            href={`/stores/${slug}`}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <ArrowLeft size={16} className="mr-2" />
            Continuar Comprando
          </Link>
          
          <Link 
            href={`/stores/${slug}/minha-conta/pedidos`}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Ver Meus Pedidos
          </Link>
        </div>
      </main>
    </div>
  );
} 