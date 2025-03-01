"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/config/api';

// Tipo para itens do carrinho
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  salePrice?: number;
  quantity: number;
  imageUrl?: string;
  stock?: number;
  trackStock?: boolean;
}

// Tipo para o contexto do carrinho
type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  shippingCost: number;
  setShippingCost: (cost: number) => void;
  itemCount: number;
  syncCartWithServer: (userId: string) => Promise<void>;
};

// Criação do contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para usar o contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
};

// Provider do contexto
export const CartProvider = ({ 
  children,
  storeId 
}: { 
  children: ReactNode;
  storeId?: string;
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [initialized, setInitialized] = useState(false);

  // Carregar itens do carrinho do localStorage ao inicializar
  useEffect(() => {
    if (!storeId || initialized) return;
    
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem(`cart_${storeId}`);
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Erro ao carregar carrinho:', error);
        }
      }
      setInitialized(true);
    }
  }, [storeId, initialized]);

  // Salvar itens do carrinho no localStorage quando mudar
  useEffect(() => {
    if (!storeId || !initialized) return;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem(`cart_${storeId}`, JSON.stringify(items));
    }
  }, [items, storeId, initialized]);

  // Calcular subtotal
  const subtotal = items.reduce((total, item) => {
    const price = item.salePrice || item.price;
    return total + (price * item.quantity);
  }, 0);

  // Calcular total
  const total = subtotal + shippingCost;

  // Contar itens
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  // Adicionar item ao carrinho
  const addItem = (item: CartItem) => {
    setItems(currentItems => {
      // Verificar se o item já existe no carrinho
      const existingItemIndex = currentItems.findIndex(i => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Atualizar quantidade se o item já existir
        const updatedItems = [...currentItems];
        const newQuantity = updatedItems[existingItemIndex].quantity + item.quantity;
        
        // Verificar estoque se o produto tiver controle de estoque
        if (item.trackStock && item.stock !== undefined && newQuantity > item.stock) {
          updatedItems[existingItemIndex].quantity = item.stock;
        } else {
          updatedItems[existingItemIndex].quantity = newQuantity;
        }
        
        return updatedItems;
      } else {
        // Adicionar novo item
        return [...currentItems, item];
      }
    });
  };

  // Remover item do carrinho
  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  // Atualizar quantidade de um item
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems => {
      return currentItems.map(item => {
        if (item.id === id) {
          // Verificar estoque se o produto tiver controle de estoque
          if (item.trackStock && item.stock !== undefined && quantity > item.stock) {
            return { ...item, quantity: item.stock };
          }
          return { ...item, quantity };
        }
        return item;
      });
    });
  };

  // Limpar carrinho
  const clearCart = () => {
    setItems([]);
  };

  // Sincronizar carrinho com o servidor para usuários logados
  const syncCartWithServer = async (userId: string) => {
    try {
      if (!storeId) return;
      
      // Buscar carrinho do servidor
      const response = await api.getUserCart(userId, storeId);
      
      if (response && response.items && response.items.length > 0) {
        // Se o usuário tem itens salvos no servidor, atualizar o carrinho local
        setItems(response.items);
      } else if (items.length > 0) {
        // Se o usuário não tem itens no servidor mas tem localmente, salvar no servidor
        await api.updateUserCart(userId, storeId, { items });
      }
    } catch (error) {
      console.error('Erro ao sincronizar carrinho:', error);
    }
  };

  // Valores do contexto
  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    total,
    shippingCost,
    setShippingCost,
    itemCount,
    syncCartWithServer
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}; 