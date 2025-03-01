"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStoreBySlug } from '@/app/api/stores';
import { getProductById, getRelatedProducts } from '@/app/api/products';
import { useCart } from '@/components/ShoppingCart';
import { toast } from 'react-hot-toast';

interface Props {
  params: {
    slug: string;
    productId: string;
  };
}

export default function ProductDetailsPage({ params }: Props) {
  const { slug, productId } = params;
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [loading, setLoading] = useState<boolean>(true);
  const [store, setStore] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  
  // Usar useEffect para carregar os dados do servidor
  React.useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const storeData = await getStoreBySlug(slug);
        
        if (!storeData) {
          setLoading(false);
          return;
        }
        
        setStore(storeData);
        
        const productDetails = await getProductById(productId);
        if (!productDetails) {
          setLoading(false);
          return;
        }
        
        setProduct(productDetails);
        
        // Buscar produtos relacionados
        const related = await getRelatedProducts(storeData.id, productId);
        setRelatedProducts(related);
        
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setLoading(false);
      }
    }
    
    loadData();
  }, [slug, productId]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images && product.images.length > 0 ? product.images[0] : undefined,
      quantity: quantity,
      tenantId: store.id,
      tenantSlug: slug
    });
    
    toast.success(`${product.name} adicionado ao carrinho!`);
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }
  
  if (!store) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Loja não encontrada</h1>
          <p className="mt-2 text-gray-600">A loja que você está procurando não existe.</p>
          <Link href="/" className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Produto não encontrado</h1>
          <p className="mt-2 text-gray-600">O produto que você está procurando não existe.</p>
          <Link href={`/stores/${slug}`} className="mt-4 inline-block text-indigo-600 hover:text-indigo-800">
            Voltar para a loja
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <Link href={`/stores/${slug}`} className="text-gray-500 hover:text-indigo-600">
          Início
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        {product.category && (
          <>
            <Link 
              href={`/stores/${slug}/categorias/${product.category.slug}`} 
              className="text-gray-500 hover:text-indigo-600"
            >
              {product.category.name}
            </Link>
            <span className="mx-2 text-gray-500">/</span>
          </>
        )}
        <span className="text-gray-800 font-medium">{product.name}</span>
      </nav>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Imagens do produto */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="relative h-96 w-full">
            {product.images && product.images.length > 0 ? (
              <Image 
                src={product.images[0]} 
                alt={product.name}
                fill
                className="object-contain"
              />
            ) : (
              <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                <span className="text-gray-400 text-4xl">Sem imagem</span>
              </div>
            )}
          </div>
          
          {/* Galeria de miniaturas */}
          {product.images && product.images.length > 1 && (
            <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
              {product.images.map((image: string, index: number) => (
                <div key={index} className="relative h-20 w-20 flex-shrink-0 border border-gray-200 rounded-md overflow-hidden">
                  <Image 
                    src={image} 
                    alt={`${product.name} - imagem ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Informações do produto */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          {/* Preço */}
          <div className="mt-4">
            {product.salePrice ? (
              <div className="flex items-center">
                <span className="text-3xl font-bold text-indigo-600">
                  R$ {product.salePrice.toFixed(2).replace('.', ',')}
                </span>
                <span className="ml-2 text-lg text-gray-500 line-through">
                  R$ {product.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-indigo-600">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            )}
          </div>
          
          {/* SKU e disponibilidade */}
          <div className="mt-4 space-y-2">
            {product.sku && (
              <p className="text-gray-500">
                <span className="font-medium">SKU:</span> {product.sku}
              </p>
            )}
            <p className="text-gray-500">
              <span className="font-medium">Disponibilidade:</span> 
              {product.stock > 0 ? (
                <span className="text-green-600 ml-1">Em estoque</span>
              ) : (
                <span className="text-red-600 ml-1">Fora de estoque</span>
              )}
            </p>
          </div>
          
          {/* Quantidade e botões */}
          <div className="mt-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantidade
            </label>
            <div className="mt-1 flex rounded-md">
              <button
                type="button"
                className="px-3 py-2 border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-100"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value || '1'))}
                className="block w-16 text-center border-y border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <button
                type="button"
                className="px-3 py-2 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-100"
                onClick={incrementQuantity}
              >
                +
              </button>
            </div>
          </div>
          
          {/* Botões de ação */}
          <div className="mt-6 space-x-3 flex">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={`flex-1 py-3 px-6 rounded-md text-white font-medium ${
                product.stock > 0 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {product.stock > 0 ? 'Adicionar ao Carrinho' : 'Indisponível'}
            </button>
            <button
              type="button"
              className="py-3 px-6 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 font-medium"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </button>
          </div>
          
          {/* Descrição */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Descrição</h3>
            <div className="mt-4 prose prose-indigo">
              <p className="text-gray-700">{product.description || 'Sem descrição disponível.'}</p>
            </div>
          </div>
          
          {/* Informações adicionais */}
          {(product.weight || product.dimensions) && (
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Informações Adicionais</h3>
              <dl className="mt-4 space-y-3">
                {product.weight && (
                  <div className="grid grid-cols-3">
                    <dt className="text-gray-600">Peso</dt>
                    <dd className="col-span-2 text-gray-800">{product.weight} kg</dd>
                  </div>
                )}
                {product.dimensions && (
                  <div className="grid grid-cols-3">
                    <dt className="text-gray-600">Dimensões</dt>
                    <dd className="col-span-2 text-gray-800">{product.dimensions}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </div>
      
      {/* Produtos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Produtos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((related) => (
              <Link 
                key={related.id} 
                href={`/stores/${slug}/produtos/${related.id}`}
                className="group"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48 w-full">
                    {related.images && related.images.length > 0 ? (
                      <Image 
                        src={related.images[0]} 
                        alt={related.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center">
                        <span className="text-gray-400 text-2xl">Sem imagem</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-gray-900 font-medium group-hover:text-indigo-600">
                      {related.name}
                    </h3>
                    
                    <div className="mt-2">
                      {related.salePrice ? (
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-indigo-600">
                            R$ {related.salePrice.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            R$ {related.price.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      ) : (
                        <span className="text-lg font-bold text-indigo-600">
                          R$ {related.price.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 