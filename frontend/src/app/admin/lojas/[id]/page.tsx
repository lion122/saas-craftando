import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Administração da Loja | Craftando SaaS',
  description: 'Painel de administração da sua loja virtual',
};

export default function StoreAdminPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Painel de Administração da Loja</h1>
      <p className="text-gray-600 mb-8">ID da Loja: {params.id}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Produtos</h2>
          <p className="text-gray-600 mb-4">Gerencie os produtos da sua loja</p>
          <a href={`/admin/lojas/${params.id}/produtos`} className="text-blue-600 hover:underline">
            Gerenciar Produtos →
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pedidos</h2>
          <p className="text-gray-600 mb-4">Acompanhe e gerencie os pedidos recebidos</p>
          <a href={`/admin/lojas/${params.id}/pedidos`} className="text-blue-600 hover:underline">
            Gerenciar Pedidos →
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Domínios</h2>
          <p className="text-gray-600 mb-4">Configure os domínios da sua loja</p>
          <a href={`/admin/lojas/${params.id}/dominios`} className="text-blue-600 hover:underline">
            Gerenciar Domínios →
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Configurações</h2>
          <p className="text-gray-600 mb-4">Personalize as configurações da sua loja</p>
          <a href={`/admin/lojas/${params.id}/configuracoes`} className="text-blue-600 hover:underline">
            Editar Configurações →
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Aparência</h2>
          <p className="text-gray-600 mb-4">Personalize a aparência da sua loja</p>
          <a href={`/admin/lojas/${params.id}/aparencia`} className="text-blue-600 hover:underline">
            Editar Aparência →
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Relatórios</h2>
          <p className="text-gray-600 mb-4">Visualize relatórios e estatísticas</p>
          <a href={`/admin/lojas/${params.id}/relatorios`} className="text-blue-600 hover:underline">
            Ver Relatórios →
          </a>
        </div>
      </div>
    </div>
  );
} 