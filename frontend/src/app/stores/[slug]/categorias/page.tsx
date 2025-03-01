import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStoreBySlug } from '@/app/api/stores';
import { getCategories } from '@/app/api/categories';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  tenantId: string;
  productCount: number;
}

async function getStoreCategories(storeId: string): Promise<Category[]> {
  try {
    const categories = await getCategories(storeId);
    return categories;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

export default async function CategoriasPage({ params }: { params: { slug: string } }) {
  const store = await getStoreBySlug(params.slug);
  
  if (!store) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Loja não encontrada</h1>
        <p className="mb-6">A loja que você está procurando não existe ou foi desativada.</p>
        <Link href="/" className="text-indigo-600 hover:text-indigo-800">
          Voltar para a página inicial
        </Link>
      </div>
    );
  }
  
  const categories = await getStoreCategories(store.id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categorias</h1>
        <p className="text-gray-600">Explore todas as categorias disponíveis em nossa loja</p>
      </div>
      
      {categories.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Nenhuma categoria encontrada</h2>
          <p className="text-gray-600 mb-4">
            Não encontramos categorias para exibir neste momento.
          </p>
          <Link 
            href={`/stores/${params.slug}`}
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Voltar para a loja
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/stores/${params.slug}/categorias/${category.slug}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group"
            >
              <div className="relative h-48 w-full bg-gray-200">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400 text-4xl">📑</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-indigo-600 transition">
                  {category.name}
                </h2>
                
                {category.description && (
                  <p className="text-gray-600 mb-2 line-clamp-2">{category.description}</p>
                )}
                
                <p className="text-sm text-indigo-600">
                  {category.productCount} {category.productCount === 1 ? 'produto' : 'produtos'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      {/* Navegação de Breadcrumb */}
      <div className="mt-12 py-4 border-t border-gray-200">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link 
                href={`/stores/${params.slug}`}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Início
              </Link>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Categorias</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
} 