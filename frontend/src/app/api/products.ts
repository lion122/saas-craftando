import { API_URL } from '@/config';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  salePrice?: number;
  images?: string[];
  sku?: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  featured?: boolean;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  weight?: number;
  dimensions?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsFilter {
  search?: string;
  categoryId?: string;
  categorySlug?: string;
  featured?: boolean;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  limit?: number;
  page?: number;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  salePrice?: number;
  images?: string[];
  sku?: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  featured?: boolean;
  categoryId?: string;
  weight?: number;
  dimensions?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

// Função para obter produtos com filtros
export async function getProducts(
  tenantId: string,
  filters: ProductsFilter = {}
): Promise<Product[]> {
  try {
    const queryParams = new URLSearchParams();
    
    // Adicionar parâmetros de filtro à URL
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
    if (filters.categorySlug) queryParams.append('categorySlug', filters.categorySlug);
    if (filters.featured !== undefined) queryParams.append('featured', String(filters.featured));
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.minPrice) queryParams.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice) queryParams.append('maxPrice', String(filters.maxPrice));
    if (filters.sort) queryParams.append('sort', filters.sort);
    if (filters.limit) queryParams.append('limit', String(filters.limit));
    if (filters.page) queryParams.append('page', String(filters.page));
    
    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/products?${queryParams.toString()}`
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

// Função para obter um produto pelo ID
export async function getProduct(
  tenantId: string,
  productId: string
): Promise<Product | null> {
  try {
    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/products/${productId}`
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar produto: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    return null;
  }
}

// Alias para getProduct para manter compatibilidade 
export const getProductById = getProduct;

// Função para obter produtos relacionados
export async function getRelatedProducts(
  tenantId: string,
  productId: string,
  limit: number = 4
): Promise<Product[]> {
  try {
    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/products/${productId}/related?limit=${limit}`
    );
    
    if (!response.ok) {
      // Se a API não suportar produtos relacionados, busque produtos destacados como alternativa
      return getProducts(tenantId, { featured: true, limit });
    }
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Erro ao buscar produtos relacionados:', error);
    // Em caso de erro, busque produtos destacados como alternativa
    return getProducts(tenantId, { featured: true, limit });
  }
}

// Função para obter um produto pelo slug
export async function getProductBySlug(
  tenantId: string,
  slug: string
): Promise<Product | null> {
  try {
    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/products/slug/${slug}`
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar produto por slug: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Erro ao buscar produto por slug:', error);
    return null;
  }
}

// Função para criar um produto
export async function createProduct(
  tenantId: string,
  productData: CreateProductDto
): Promise<Product | null> {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    
    const response = await fetch(`${API_URL}/tenants/${tenantId}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao criar produto: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    return null;
  }
}

// Função para atualizar um produto
export async function updateProduct(
  tenantId: string,
  productId: string,
  productData: UpdateProductDto
): Promise<Product | null> {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    
    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/products/${productId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao atualizar produto: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.product || null;
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    return null;
  }
}

// Função para excluir um produto
export async function deleteProduct(
  tenantId: string,
  productId: string
): Promise<boolean> {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    
    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/products/${productId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao excluir produto: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    return false;
  }
}

// Função para fazer upload de imagens de produto
export async function uploadProductImage(
  tenantId: string,
  productId: string,
  file: File
): Promise<string | null> {
  try {
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }
    
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(
      `${API_URL}/tenants/${tenantId}/products/${productId}/images`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao fazer upload de imagem: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.imageUrl || null;
  } catch (error) {
    console.error('Erro ao fazer upload de imagem:', error);
    return null;
  }
}