'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCartContext } from '@/providers/CartProvider';

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  images?: string[];
  stock: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCartContext();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Falha ao carregar produtos');
        }
        
        const data = await response.json();
        setProducts(data.data || []);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        setError('Não foi possível carregar os produtos. Por favor, tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      quantity: 1,
      image: product.images?.[0] || '/placeholder.png',
      productId: product.id,
      storeId: 'default'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Nossos Produtos</h1>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!loading && products.length === 0 && !error && (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Nenhum produto encontrado</h2>
          <p className="text-gray-600">Não há produtos disponíveis no momento.</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 relative">
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-400">Sem imagem</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description || 'Sem descrição disponível'}
              </p>
              
              <div className="flex justify-between items-center">
                <div>
                  {product.salePrice ? (
                    <div>
                      <span className="text-gray-400 line-through text-sm">
                        R$ {product.price.toFixed(2)}
                      </span>
                      <span className="text-lg font-bold text-indigo-600 ml-2">
                        R$ {product.salePrice.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-indigo-600">
                      R$ {product.price.toFixed(2)}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.stock <= 0}
                  className={`p-2 rounded-full ${
                    product.stock > 0
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  }`}
                  title={product.stock > 0 ? 'Adicionar ao carrinho' : 'Produto indisponível'}
                >
                  <ShoppingCart size={20} />
                </button>
              </div>
              
              {product.stock <= 0 && (
                <p className="text-red-500 text-sm mt-2">Produto indisponível</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 