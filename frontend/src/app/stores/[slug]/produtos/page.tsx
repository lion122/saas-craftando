import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStoreBySlug } from '@/app/api/stores';
import { getProducts, Product } from '@/app/api/products';

interface Props {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
    search?: string;
  };
}

async function getStoreProducts(storeId: string, searchParams: Props['searchParams']): Promise<Product[]> {
  try {
    const { sort, search } = searchParams;
    
    const products = await getProducts(storeId, {
      status: 'active',
      search,
      sort,
    });
    
    return products;
  } catch (error) {
    console.error('Erro ao buscar produtos da loja:', error);
    return [];
  }
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { slug } = params;
  const store = await getStoreBySlug(slug);
  
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
  
  const products = await getStoreProducts(store.id, searchParams);
  
  // Ordenar produtos conforme parâmetro
  const sort = searchParams.sort || 'name';
  let sortedProducts = [...products];
  
  switch (sort) {
    case 'price-asc':
      sortedProducts.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sortedProducts.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
      sortedProducts.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    default:
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Todos os Produtos</h1>
        <p className="text-gray-600">Explore todos os produtos disponíveis em nossa loja</p>
      </div>
      
      {/* Barra de pesquisa */}
      <div className="mb-8">
        <form method="get" className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="Buscar produtos..."
                defaultValue={searchParams.search || ''}
                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full sm:w-48">
            <select
              name="sort"
              defaultValue={sort}
              onChange={(e) => {
                const form = e.target.form;
                if (form) form.submit();
              }}
              className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Nome</option>
              <option value="price-asc">Menor preço</option>
              <option value="price-desc">Maior preço</option>
              <option value="newest">Mais recentes</option>
            </select>
          </div>
        </form>
      </div>
      
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Nenhum produto encontrado</h2>
          {searchParams.search ? (
            <p className="text-gray-600 mb-4">
              Não encontramos produtos correspondentes à sua busca: "{searchParams.search}"
            </p>
          ) : (
            <p className="text-gray-600 mb-4">
              Não encontramos produtos disponíveis no momento.
            </p>
          )}
          <Link 
            href={`/stores/${slug}`}
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Voltar para a loja
          </Link>
        </div>
      ) : (
        <>
          {/* Contagem de resultados */}
          <div className="mb-6 text-sm text-gray-500">
            {products.length} {products.length === 1 ? 'produto' : 'produtos'} encontrado{products.length !== 1 && 's'}
            {searchParams.search && (
              <span> para "{searchParams.search}"</span>
            )}
          </div>
          
          {/* Grade de produtos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <Link
                key={product.id}
                href={`/stores/${slug}/produtos/${product.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition group"
              >
                <div className="relative h-56 w-full bg-gray-200">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-400 text-4xl">📷</span>
                    </div>
                  )}
                  
                  {product.salePrice && product.salePrice < product.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round((1 - product.salePrice / product.price) * 100)}% OFF
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-2 group-hover:text-indigo-600 transition line-clamp-2">
                    {product.name}
                  </h2>
                  
                  <div className="flex items-baseline">
                    {product.salePrice ? (
                      <>
                        <span className="text-lg font-bold text-gray-800">
                          R$ {product.salePrice.toFixed(2).replace('.', ',')}
                        </span>
                        <span className="ml-2 text-sm line-through text-gray-500">
                          R$ {product.price.toFixed(2).replace('.', ',')}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-800">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                  </div>
                  
                  <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition">
                    Adicionar ao carrinho
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
      
      {/* Navegação de Breadcrumb */}
      <div className="mt-12 py-4 border-t border-gray-200">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link 
                href={`/stores/${slug}`}
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
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Produtos</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
} 