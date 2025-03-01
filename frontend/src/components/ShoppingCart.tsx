"use client";

import React, { useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useParams } from 'next/navigation';
import { CartItem } from '@/providers/CartProvider';
import { CartContext } from '@/providers/CartProvider';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  subtotal: number;
}

// Hook para usar o contexto do carrinho
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}

export function ShoppingCart({ 
  isOpen, 
  onClose, 
  cartItems, 
  removeItem, 
  updateQuantity,
  subtotal
}: ShoppingCartProps) {
  const params = useParams();
  const slug = params.slug as string;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay de fundo */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />
      
      {/* Painel do carrinho */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        {/* Cabeçalho do carrinho */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <ShoppingBag className="mr-2" size={20} />
            Seu Carrinho
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Conteúdo do carrinho */}
        <div className="flex flex-col h-full max-h-[calc(100vh-180px)] overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag size={64} className="text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">Seu carrinho está vazio</p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            <>
              {/* Lista de itens */}
              <ul className="divide-y">
                {cartItems.map((item) => (
                  <li key={item.id} className="py-4 flex">
                    {/* Imagem do produto */}
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={96}
                        height={96}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    {/* Detalhes do produto */}
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3>{item.name}</h3>
                          <p className="ml-4">R$ {item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-1 items-end justify-between text-sm">
                        {/* Controles de quantidade */}
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Botão remover */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="font-medium text-red-600 hover:text-red-500"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Rodapé do carrinho com subtotal e botões de ação */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            {/* Resumo do valor */}
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>R$ {subtotal.toFixed(2)}</p>
            </div>
            <p className="text-sm text-gray-500">
              Frete e impostos calculados no checkout.
            </p>
            
            {/* Botões de ação */}
            <div className="space-y-2">
              <Link
                href={`/stores/${slug}/checkout`}
                onClick={onClose}
                className="flex items-center justify-center w-full bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-800 rounded-md"
              >
                Finalizar Compra
              </Link>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-full bg-white px-6 py-3 text-base font-medium text-black shadow-sm hover:bg-gray-100 border border-gray-300 rounded-md"
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ShoppingCart; 