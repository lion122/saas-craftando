import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Minhas Lojas | Craftando SaaS',
  description: 'Gerencie suas lojas virtuais na plataforma Craftando SaaS',
};

export default function StoresListPage() {
  // Normalmente, aqui buscaríamos as lojas do usuário da API
  // Por enquanto, vamos usar dados de exemplo
  const exampleStores = [
    {
      id: 'e640c0ff-7eaf-49bd-9d0a-d752b7c38bc1',
      name: 'Loja de Artesanato',
      slug: 'loja-artesanato',
      status: 'active',
      createdAt: '2023-01-15',
    },
    {
      id: '8f7b5c2a-6d9e-4f3a-b1c8-e5d7a9f62b3d',
      name: 'Moda Sustentável',
      slug: 'moda-sustentavel',
      status: 'active',
      createdAt: '2023-03-22',
    },
    {
      id: '3a1b5c8d-7e9f-4a2b-8c6d-5e3f2a1b9c8d',
      name: 'Decoração Criativa',
      slug: 'decoracao-criativa',
      status: 'inactive',
      createdAt: '2023-05-10',
    },
  ];

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minhas Lojas</h1>
        <Link 
          href="/admin/lojas/nova" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Nova Loja
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Criação
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exampleStores.map((store) => (
              <tr key={store.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{store.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{store.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    store.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {store.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(store.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link 
                      href={`/admin/lojas/${store.id}`} 
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Gerenciar
                    </Link>
                    <Link 
                      href={`https://${store.slug}.saas.craftando.com.br`} 
                      target="_blank"
                      className="text-green-600 hover:text-green-900"
                    >
                      Visitar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 