import { API_URL } from '@/config/api';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  tenantId: string;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface CategoriesFilter {
  search?: string;
  sort?: string;
  limit?: number;
}

export async function getCategories(tenantId: string, filters?: CategoriesFilter): Promise<Category[]> {
  try {
    let url = `${API_URL}/categories?tenantId=${tenantId}`;
    
    if (filters) {
      if (filters.search) url += `&search=${encodeURIComponent(filters.search)}`;
      if (filters.sort) url += `&sort=${encodeURIComponent(filters.sort)}`;
      if (filters.limit) url += `&limit=${filters.limit}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter categorias: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro na API de categorias:', error);
    return [];
  }
}

export async function getCategory(tenantId: string, categoryId: string): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/${categoryId}?tenantId=${tenantId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Erro ao obter categoria: ${response.status}`);
  }

  return await response.json();
}

export async function getCategoryBySlug(tenantId: string, slug: string): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/slug/${slug}?tenantId=${tenantId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Erro ao obter categoria pelo slug: ${response.status}`);
  }

  return await response.json();
}

export async function createCategory(tenantId: string, categoryData: CreateCategoryDto): Promise<Category> {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      ...categoryData,
      tenantId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao criar categoria: ${response.status}`);
  }

  return await response.json();
}

export async function updateCategory(tenantId: string, categoryId: string, categoryData: UpdateCategoryDto): Promise<Category> {
  const response = await fetch(`${API_URL}/categories/${categoryId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({
      ...categoryData,
      tenantId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Erro ao atualizar categoria: ${response.status}`);
  }

  return await response.json();
}

export async function deleteCategory(tenantId: string, categoryId: string): Promise<void> {
  const response = await fetch(`${API_URL}/categories/${categoryId}?tenantId=${tenantId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ao deletar categoria: ${response.status}`);
  }
}

export async function uploadCategoryImage(file: File): Promise<string> {
  // Aqui você pode implementar uma função para upload de imagem
  // Pode usar serviços como Cloudinary, AWS S3, ou sua própria API
  
  // Implementação básica com FormData
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error(`Erro ao fazer upload da imagem: ${response.status}`);
  }
  
  const data = await response.json();
  return data.url;
} 