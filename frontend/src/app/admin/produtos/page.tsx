import React from 'react';
import Link from 'next/link';
import { TenantSwitcher } from '@/components/TenantSwitcher';
import { getProducts, Product } from '@/app/api/products';

async function getProductsData(tenantId: string) {
  try {
    return await getProducts(tenantId);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return [];
  }
}

export default async function ProdutosPage() {
  // Obter o ID do tenant atual (simulado por enquanto)
  const currentTenantId = 'tenant-1'; // Em um cenário real, deve ser obtido do contexto ou URL
  const products = await getProductsData(currentTenantId);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <div className="flex items-center space-x-4">
          <TenantSwitcher currentTenantId={currentTenantId} />
          <Link
            href="/admin/produtos/novo"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Novo Produto
          </Link>
        </div>
      </div>

      {/* Filtros e pesquisa */}
      <div className="mb-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Buscar produtos
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                type="text"
                name="search"
                id="search"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Buscar produtos por nome, SKU ou descrição"
              />
            </div>
          </div>
          <div className="flex space-x-2">
            <div>
              <label htmlFor="status" className="sr-only">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue="all"
              >
                <option value="all">Todos os status</option>
                <option value="active">Ativos</option>
                <option value="draft">Rascunhos</option>
                <option value="out_of_stock">Sem estoque</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="sr-only">
                Ordenar
              </label>
              <select
                id="sort"
                name="sort"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue="newest"
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="price_asc">Preço: Menor para maior</option>
                <option value="price_desc">Preço: Maior para menor</option>
                <option value="name_asc">Nome: A-Z</option>
                <option value="name_desc">Nome: Z-A</option>
              </select>
            </div>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Filtrar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de produtos */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {products.length === 0 ? (
          <div className="py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comece a criar seu catálogo de produtos.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/produtos/novo"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Novo Produto
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {products.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/admin/produtos/${product.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="flex items-center px-4 py-4 sm:px-6">
                    <div className="min-w-0 flex-1 flex items-center">
                      {/* Imagem do produto */}
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md border overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-500">
                            <svg
                              className="h-8 w-8"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      {/* Detalhes do produto */}
                      <div className="min-w-0 flex-1 px-4">
                        <div>
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-blue-600 truncate">
                              {product.name}
                            </p>
                            {product.featured && (
                              <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Destaque
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center">
                            <p className="text-sm text-gray-500 truncate">
                              {product.sku && <span>SKU: {product.sku} | </span>}
                              Estoque: {product.stock}
                            </p>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="flex items-center text-sm text-gray-700 space-x-1">
                            {product.status === 'active' && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Ativo
                              </span>
                            )}
                            {product.status === 'draft' && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                Rascunho
                              </span>
                            )}
                            {product.status === 'out_of_stock' && (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Sem estoque
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Preços e ações */}
                    <div className="flex items-center">
                      <div className="mr-8 text-right">
                        {product.salePrice ? (
                          <>
                            <div className="text-sm text-gray-500 line-through">
                              R$ {product.price.toFixed(2).replace('.', ',')}
                            </div>
                            <div className="text-sm font-medium text-green-600">
                              R$ {product.salePrice.toFixed(2).replace('.', ',')}
                            </div>
                          </>
                        ) : (
                          <div className="text-sm font-medium text-gray-900">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </div>
                        )}
                      </div>
                      <div>
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
} 