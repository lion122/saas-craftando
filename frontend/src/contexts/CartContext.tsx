import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/config/api';
import { useAuth } from './AuthContext';

// Tipos
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  options?: Record<string, any>;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  subtotal: number;
  itemCount: number;
}

// Contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
export const CartProvider: React.FC<{ children: ReactNode; storeId: string }> = ({ 
  children, 
  storeId 
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  
  // Carregar carrinho do localStorage ou da API
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      try {
        if (isAuthenticated && user) {
          // Carregar da API se o usuário estiver autenticado
          const response = await api.getUserCart(user.id, storeId);
          setItems(response.items || []);
        } else {
          // Carregar do localStorage se não estiver autenticado
          const savedCart = localStorage.getItem(`cart-${storeId}`);
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error('Erro ao carregar o carrinho:', error);
        // Fallback para localStorage em caso de erro
        const savedCart = localStorage.getItem(`cart-${storeId}`);
        if (savedCart) {
          setItems(JSON.parse(savedCart));
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCart();
  }, [storeId, isAuthenticated, user]);
  
  // Salvar carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(`cart-${storeId}`, JSON.stringify(items));
      
      // Sincronizar com a API se o usuário estiver autenticado
      if (isAuthenticated && user) {
        api.updateUserCart(user.id, storeId, { items })
          .catch(error => console.error('Erro ao sincronizar carrinho com a API:', error));
      }
    }
  }, [items, storeId, isAuthenticated, user, isLoading]);
  
  // Calcular subtotal
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Calcular quantidade total de itens
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  // Adicionar item ao carrinho
  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      // Verificar se o item já existe no carrinho
      const existingItemIndex = currentItems.findIndex(
        item => item.productId === newItem.productId
      );
      
      if (existingItemIndex >= 0) {
        // Atualizar quantidade se o item já existir
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Adicionar novo item se não existir
        return [...currentItems, newItem];
      }
    });
  };
  
  // Remover item do carrinho
  const removeItem = (itemId: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };
  
  // Atualizar quantidade de um item
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(currentItems => 
      currentItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };
  
  // Limpar carrinho
  const clearCart = () => {
    setItems([]);
  };
  
  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isLoading,
      subtotal,
      itemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook para usar o contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de um CartProvider');
  }
  return context;
}; 