"use client";

import React from 'react';
import { TenantSwitcher } from '@/components/TenantSwitcher';
import { api } from '@/config/api';
import { MAIN_DOMAIN } from '@/config/api';

// Definição da interface Store
interface Store {
  id: string;
  name: string;
  slug: string;
  customDomain?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: string;
  description?: string;
}

// Função para buscar dados da loja
async function getStoreData(id: string): Promise<Store | null> {
  try {
    return await api.getStoreById(id);
  } catch (error) {
    return null;
  }
}

interface DominiosPageProps {
  params: {
    id: string;
  };
}

export default function DominiosPage({ params }: DominiosPageProps) {
  const [store, setStore] = React.useState<Store | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    async function loadStore() {
      try {
        const storeData = await getStoreData(params.id);
        setStore(storeData);
      } catch (error) {
        console.error('Erro ao carregar loja:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadStore();
  }, [params.id]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando informações da loja...</p>
      </div>
    );
  }
  
  if (!store) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Loja não encontrada</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Configuração de Domínios</h1>
        <TenantSwitcher currentTenantId={params.id} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Domínio atual da loja</h2>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <p className="text-gray-700">
            <span className="font-semibold">Subdomínio padrão:</span>{' '}
            <a 
              href={`https://${store.slug}.${MAIN_DOMAIN}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {store.slug}.{MAIN_DOMAIN}
            </a>
          </p>
          
          {store.customDomain && store.customDomain !== `${store.slug}.${MAIN_DOMAIN}` && (
            <p className="text-gray-700 mt-2">
              <span className="font-semibold">Domínio personalizado:</span>{' '}
              <a 
                href={`https://${store.customDomain}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {store.customDomain}
              </a>
            </p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Configurar domínio personalizado</h2>
        
        <form className="space-y-4">
          <div>
            <label htmlFor="customDomain" className="block text-sm font-medium text-gray-700 mb-1">
              Seu domínio personalizado
            </label>
            <input
              type="text"
              id="customDomain"
              name="customDomain"
              placeholder="loja.seudominio.com.br"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">
              Informe o domínio que você deseja usar para sua loja, como "loja.seudominio.com.br"
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">Importante: Configuração de DNS</h3>
            <p className="text-sm text-yellow-700">
              Após salvar, você precisará configurar os registros de DNS do seu domínio para apontar para nossa plataforma:
            </p>
            <ol className="mt-2 pl-5 list-decimal text-sm text-yellow-700 space-y-1">
              <li>Acesse o painel de controle DNS do seu provedor de domínio</li>
              <li>Adicione um registro CNAME com o nome do subdomínio apontando para <code className="bg-yellow-100 px-1 rounded">{MAIN_DOMAIN}</code></li>
              <li>
                Exemplo: <code className="bg-yellow-100 px-1 rounded">loja CNAME {MAIN_DOMAIN}</code>
              </li>
              <li>As alterações de DNS podem levar até 48 horas para propagação completa</li>
            </ol>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Salvar configurações
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Certificado SSL</h2>
        
        <div className="p-4 bg-green-50 rounded-md border border-green-200">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-green-500 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-green-800">Certificado SSL automático</h3>
              <p className="text-sm text-green-700 mt-1">
                Nossa plataforma gera automaticamente certificados SSL para todos os domínios conectados.
                Não é necessária nenhuma configuração adicional da sua parte.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 