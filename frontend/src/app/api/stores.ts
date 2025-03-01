import { API_URL } from '@/config/api';

export interface Store {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  status: 'active' | 'suspended' | 'pending' | 'canceled';
  plan: 'free' | 'basic' | 'standard' | 'premium';
  customDomain?: string;
  planExpiresAt?: Date;
  ownerId: string;
  trialUsed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  try {
    const response = await fetch(`${API_URL}/tenants/slug/${slug}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erro ao obter loja: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar loja pelo slug:', error);
    return null;
  }
}

export async function getStoreById(id: string): Promise<Store | null> {
  try {
    const response = await fetch(`${API_URL}/tenants/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erro ao obter loja: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar loja pelo ID:', error);
    return null;
  }
}

export async function getUserStores(): Promise<Store[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const response = await fetch(`${API_URL}/tenants/user/my-stores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter lojas do usuário: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar lojas do usuário:', error);
    return [];
  }
}

export async function createStore(storeData: {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
}): Promise<Store> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/tenants`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(storeData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ao criar loja: ${response.status}`);
  }

  return await response.json();
}

export async function updateStore(
  id: string,
  storeData: Partial<{
    name: string;
    slug: string;
    description?: string;
    logo?: string;
    customDomain?: string;
  }>
): Promise<Store> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Usuário não autenticado');
  }

  const response = await fetch(`${API_URL}/tenants/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(storeData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro ao atualizar loja: ${response.status}`);
  }

  return await response.json();
}

export async function getAllStores(status?: string): Promise<Store[]> {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    let url = `${API_URL}/tenants`;
    if (status) {
      url += `?status=${status}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao obter todas as lojas: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar todas as lojas:', error);
    return [];
  }
} 