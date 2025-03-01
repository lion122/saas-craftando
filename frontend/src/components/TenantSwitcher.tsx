"use client";

import React, { useState, useEffect } from 'react';
import { api } from '@/config/api';
import { redirectToTenant } from '@/utils/tenant';

type Tenant = {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  status: string;
};

interface TenantSwitcherProps {
  currentTenantId?: string;
}

export const TenantSwitcher: React.FC<TenantSwitcherProps> = ({ currentTenantId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        setIsLoading(true);
        // Buscar lojas do usuário atual
        const stores = await api.getMyStores();
        setTenants(stores);
        
        // Definir loja atual se o ID foi fornecido
        if (currentTenantId) {
          const current = stores.find((store: Tenant) => store.id === currentTenantId);
          if (current) {
            setCurrentTenant(current);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar lojas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenants();
  }, [currentTenantId]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectTenant = (tenant: Tenant) => {
    setIsOpen(false);
    redirectToTenant(tenant.slug);
  };

  if (isLoading) {
    return (
      <div className="h-10 flex items-center justify-center">
        <span className="text-sm text-gray-500">Carregando lojas...</span>
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <div className="h-10 flex items-center justify-center">
        <span className="text-sm text-gray-500">Nenhuma loja encontrada</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          id="tenant-menu"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={toggleDropdown}
        >
          {currentTenant ? (
            <div className="flex items-center">
              {currentTenant.logo ? (
                <img 
                  src={currentTenant.logo} 
                  alt={currentTenant.name} 
                  className="w-5 h-5 mr-2 rounded-full"
                />
              ) : (
                <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                  {currentTenant.name.substring(0, 1)}
                </div>
              )}
              <span>{currentTenant.name}</span>
            </div>
          ) : (
            <span>Selecione uma loja</span>
          )}
          
          <svg
            className="-mr-1 ml-2 h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="tenant-menu"
        >
          <div className="py-1" role="none">
            {tenants.map((tenant) => (
              <button
                key={tenant.id}
                className={`flex items-center w-full text-left px-4 py-2 text-sm ${
                  currentTenant?.id === tenant.id
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                role="menuitem"
                onClick={() => handleSelectTenant(tenant)}
              >
                {tenant.logo ? (
                  <img 
                    src={tenant.logo} 
                    alt={tenant.name} 
                    className="w-5 h-5 mr-2 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs mr-2">
                    {tenant.name.substring(0, 1)}
                  </div>
                )}
                <span>{tenant.name}</span>
                
                {tenant.status !== 'active' && (
                  <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                    {tenant.status === 'pending' ? 'Pendente' : 'Suspenso'}
                  </span>
                )}
              </button>
            ))}
            
            <div className="border-t border-gray-100 mt-1 pt-1">
              <a
                href="/admin/lojas/nova"
                className="flex items-center w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-gray-100"
                role="menuitem"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Criar nova loja</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 