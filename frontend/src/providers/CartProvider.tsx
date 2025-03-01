"use client";

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { ShoppingCart } from '@/components/ShoppingCart';
import toast from 'react-hot-toast';

// Definição do tipo para um item do carrinho
export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  productId: string;
  storeId: string;
}

// Interface para o contexto do carrinho
export interface CartContextType {
  cartItems: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  subtotal: number;
}

// Criação do contexto com valor inicial undefined
export const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para acessar o contexto do carrinho
export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext deve ser usado dentro de um CartProvider');
  }
  return context;
};

// Props para o provedor do carrinho
interface CartProviderProps {
  children: ReactNode;
}

// Componente provedor do carrinho
export function CartProvider({ children }: CartProviderProps) {
  // Estado para os itens do carrinho
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // Estado para controlar se o carrinho está aberto
  const [isCartOpen, setIsCartOpen] = useState(false);
  // Estado para o subtotal
  const [subtotal, setSubtotal] = useState(0);

  // Efeito para carregar os itens do carrinho do localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart));
      } catch (error) {
        console.error('Erro ao carregar o carrinho:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Efeito para salvar os itens do carrinho no localStorage
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // Efeito para calcular o subtotal
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, [cartItems]);

  // Função para adicionar um item ao carrinho
  const addItem = (item: CartItem) => {
    setCartItems(prevItems => {
      // Verifica se o item já existe no carrinho
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Se o item já existe, atualiza a quantidade
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Se o item não existe, adiciona ao carrinho
        return [...prevItems, item];
      }
    });
    
    // Abre o carrinho quando um item é adicionado
    setIsCartOpen(true);
    toast.success(`${item.name} adicionado ao carrinho!`);
  };

  // Função para remover um item do carrinho
  const removeItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast.success('Item removido do carrinho!');
  };

  // Função para atualizar a quantidade de um item
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      // Se a quantidade for 0 ou menor, remove o item
      removeItem(id);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Função para limpar o carrinho
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    toast.success('Carrinho esvaziado!');
  };

  // Funções para abrir e fechar o carrinho
  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Valor do contexto
  const contextValue: CartContextType = {
    cartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    subtotal
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
      <ShoppingCart 
        isOpen={isCartOpen} 
        onClose={closeCart} 
        cartItems={cartItems} 
        removeItem={removeItem} 
        updateQuantity={updateQuantity}
        subtotal={subtotal}
      />
    </CartContext.Provider>
  );
}

export default CartProvider; 