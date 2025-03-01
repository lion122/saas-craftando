import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { TenantSwitcher } from '@/components/TenantSwitcher';

export const metadata: Metadata = {
  title: 'Área Administrativa | Craftando SaaS',
  description: 'Painel de administração da plataforma Craftando SaaS',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Craftando Admin</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link 
                href="/admin/dashboard" 
                className="block p-2 rounded hover:bg-gray-100 transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/lojas" 
                className="block p-2 rounded hover:bg-gray-100 transition-colors"
              >
                Minhas Lojas
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/perfil" 
                className="block p-2 rounded hover:bg-gray-100 transition-colors"
              >
                Meu Perfil
              </Link>
            </li>
            <li>
              <Link 
                href="/admin/assinatura" 
                className="block p-2 rounded hover:bg-gray-100 transition-colors"
              >
                Assinatura
              </Link>
            </li>
            <li>
              <Link 
                href="/auth/logout" 
                className="block p-2 rounded hover:bg-gray-100 transition-colors text-red-600"
              >
                Sair
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="flex-1">
        <header className="bg-white shadow-sm p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Painel Administrativo</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bem-vindo(a)</span>
              <div className="w-8 h-8 rounded-full bg-gray-300"></div>
            </div>
          </div>
        </header>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
} 