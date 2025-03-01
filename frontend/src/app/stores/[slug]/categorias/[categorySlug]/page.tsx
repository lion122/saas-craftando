import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStoreBySlug } from '@/app/api/stores';
import { getCategoryBySlug } from '@/app/api/categories';
import { getProducts, Product } from '@/app/api/products';

interface Props {
  params: {
    slug: string;
    categorySlug: string;
  };
  searchParams: {
    page?: string;
    sort?: string;
  };
}

async function getCategoryProducts(storeId: string, categorySlug: string): Promise<{
  products: Product[];
  category: any | null;
}> {
  try {
    // Obtém a categoria pelo slug
    const category = await getCategoryBySlug(storeId, categorySlug);
    
    // Então busca os produtos associados a esta categoria
    const products = await getProducts(storeId, {
      categoryId: category.id,
      status: 'active',
    });
    
    return { products, category };
  } catch (error) {
    console.error('Erro ao buscar produtos da categoria:', error);
    return { products: [], category: null };
  }
}

export default async function CategoryProductsPage({ params, searchParams }: Props) {
  const { slug, categorySlug } = params;
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
  
  const { products, category } = await getCategoryProducts(store.id, categorySlug);
  
  if (!category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Categoria não encontrada</h1>
        <p className="mb-6">A categoria que você está procurando não existe ou foi removida.</p>
        <Link href={`/stores/${slug}/categorias`} className="text-indigo-600 hover:text-indigo-800">
          Ver todas as categorias
        </Link>
      </div>
    );
  }
  
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
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
      </div>
      
      {/* Opções de Ordenação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="text-sm text-gray-500">
          {products.length} {products.length === 1 ? 'produto' : 'produtos'} encontrado{products.length !== 1 && 's'}
        </div>
        
        <div className="flex items-center">
          <label htmlFor="sort" className="mr-2 text-sm text-gray-600">Ordenar por:</label>
          <select
            id="sort"
            className="border border-gray-300 rounded-md text-gray-700 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue={sort}
            onChange={(e) => {
              const url = new URL(window.location.href);
              url.searchParams.set('sort', e.target.value);
              window.location.href = url.toString();
            }}
          >
            <option value="name">Nome</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="newest">Mais recentes</option>
          </select>
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Nenhum produto encontrado</h2>
          <p className="text-gray-600 mb-4">
            Não encontramos produtos nesta categoria no momento.
          </p>
          <Link 
            href={`/stores/${slug}/categorias`}
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Ver todas as categorias
          </Link>
        </div>
      ) : (
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
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link
                  href={`/stores/${slug}/categorias`}
                  className="ml-1 text-sm font-medium text-gray-700 hover:text-indigo-600 md:ml-2"
                >
                  Categorias
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{category.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
} 