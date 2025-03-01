'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/config/api';
import { useRouter } from 'next/navigation';

// Tipos
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: any) => Promise<void>;
}

// Contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        // Verificar se há um token no localStorage
        const token = localStorage.getItem(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'auth-token');
        
        if (token) {
          // Se houver token, buscar os dados do usuário
          const userData = await api.getUserProfile('me');
          setUser(userData);
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        // Limpar token em caso de erro
        localStorage.removeItem(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'auth-token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  // Login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.login(email, password);
      
      // Salvar token no localStorage
      localStorage.setItem(
        process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'auth-token', 
        response.access_token
      );
      
      // Buscar dados do usuário
      const userData = await api.getUserProfile('me');
      setUser(userData);
      
      // Redirecionar para a página inicial
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout
  const logout = () => {
    // Remover token do localStorage
    localStorage.removeItem(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'auth-token');
    setUser(null);
    
    // Redirecionar para a página de login
    router.push('/auth/login');
  };
  
  // Registro
  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await api.register(userData);
      
      // Salvar token no localStorage
      localStorage.setItem(
        process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'auth-token', 
        response.access_token
      );
      
      // Buscar dados do usuário
      const userProfile = await api.getUserProfile('me');
      setUser(userProfile);
      
      // Redirecionar para a página inicial
      router.push('/');
    } catch (error) {
      console.error('Erro ao registrar:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      register
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}; 