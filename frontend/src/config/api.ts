import axios from 'axios';

// Domínio principal da aplicação
export const MAIN_DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'saas.craftando.com.br';

// Padrão de domínio para tenants
export const TENANT_DOMAIN_PATTERN = /^[a-z0-9-]+\.saas\.craftando\.com\.br$/;

// URL base da API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Configuração base do axios
const baseURL = process.env.NODE_ENV === 'production' 
  ? process.env.NEXT_PUBLIC_API_URL_PROD || 'http://localhost:3001/api'
  : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Instância do axios com configurações padrão
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
axiosInstance.interceptors.request.use(
  (config) => {
    // Verificar se estamos no navegador
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(process.env.NEXT_PUBLIC_JWT_COOKIE_NAME || 'auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API para interação com o backend
export const api = {
  // Autenticação
  login: async (email: string, password: string) => {
    const response = await axiosInstance.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (userData: any) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },
  
  // Produtos
  getProducts: async (storeId: string, params?: any) => {
    const response = await axiosInstance.get(`/products/store/${storeId}`, { params });
    return response.data;
  },
  
  getProduct: async (id: string) => {
    const response = await axiosInstance.get(`/products/${id}`);
    return response.data;
  },
  
  // Carrinho
  getUserCart: async (userId: string, storeId: string) => {
    const response = await axiosInstance.get(`/carts/user/${userId}`, {
      params: { storeId }
    });
    return response.data;
  },
  
  updateUserCart: async (userId: string, storeId: string, cartData: any) => {
    const response = await axiosInstance.put(`/carts/user/${userId}`, cartData, {
      params: { storeId }
    });
    return response.data;
  },
  
  clearUserCart: async (userId: string, storeId: string) => {
    const response = await axiosInstance.delete(`/carts/user/${userId}`, {
      params: { storeId }
    });
    return response.data;
  },
  
  addItemToCart: async (userId: string, storeId: string, item: any) => {
    const response = await axiosInstance.post(`/carts/user/${userId}/items`, {
      storeId,
      item
    });
    return response.data;
  },
  
  removeItemFromCart: async (userId: string, storeId: string, itemId: string) => {
    const response = await axiosInstance.delete(`/carts/user/${userId}/items/${itemId}`, {
      params: { storeId }
    });
    return response.data;
  },
  
  updateItemQuantity: async (userId: string, storeId: string, itemId: string, quantity: number) => {
    const response = await axiosInstance.put(`/carts/user/${userId}/items/${itemId}`, {
      storeId,
      quantity
    });
    return response.data;
  },
  
  // Pedidos
  createOrder: async (orderData: any) => {
    const response = await axiosInstance.post('/orders', orderData);
    return response.data;
  },
  
  getOrders: async (userId: string, params?: any) => {
    const response = await axiosInstance.get(`/orders/customer/${userId}`, { params });
    return response.data;
  },
  
  getOrder: async (id: string) => {
    const response = await axiosInstance.get(`/orders/${id}`);
    return response.data;
  },
  
  // Usuários
  getUserProfile: async (userId: string) => {
    const response = await axiosInstance.get(`/users/${userId}`);
    return response.data;
  },
  
  updateUserProfile: async (userId: string, userData: any) => {
    const response = await axiosInstance.put(`/users/${userId}`, userData);
    return response.data;
  },
  
  // Endereços
  getUserAddresses: async (userId: string) => {
    const response = await axiosInstance.get(`/users/${userId}/addresses`);
    return response.data;
  },
  
  addUserAddress: async (userId: string, addressData: any) => {
    const response = await axiosInstance.post(`/users/${userId}/addresses`, addressData);
    return response.data;
  },
  
  updateUserAddress: async (userId: string, addressId: string, addressData: any) => {
    const response = await axiosInstance.put(`/users/${userId}/addresses/${addressId}`, addressData);
    return response.data;
  },
  
  deleteUserAddress: async (userId: string, addressId: string) => {
    const response = await axiosInstance.delete(`/users/${userId}/addresses/${addressId}`);
    return response.data;
  },
  
  // Lojas (Tenants)
  getStoreBySlug: async (slug: string) => {
    const response = await axiosInstance.get(`/tenants/slug/${slug}`);
    return response.data;
  },
  
  // Frete
  calculateShipping: async (storeId: string, zipCode: string, items: any[]) => {
    const response = await axiosInstance.post(`/shipping/calculate`, {
      storeId,
      zipCode,
      items
    });
    return response.data;
  },
};

export default axiosInstance; 