import { MAIN_DOMAIN, TENANT_DOMAIN_PATTERN } from '@/config/api';

/**
 * Interface para representar informações de um tenant
 */
export interface TenantInfo {
  slug: string;
  isCustomDomain: boolean;
  domain: string;
}

/**
 * Verifica se o domínio atual pertence a um tenant específico
 * @returns Informações do tenant ou null se estiver no domínio principal
 */
export function getCurrentTenant(): TenantInfo | null {
  if (typeof window === 'undefined') {
    return null; // Retorna null durante o SSR
  }

  const hostname = window.location.hostname;
  
  // Se estamos no domínio principal (não é um tenant)
  if (hostname === MAIN_DOMAIN || hostname === 'localhost') {
    return null;
  }
  
  // Detectar slug do tenant a partir do subdomínio
  const subdomain = hostname.split('.')[0];
  
  // Válida apenas para padrão de subdomínio do tenant
  if (hostname.includes(MAIN_DOMAIN.replace('{slug}', ''))) {
    return {
      slug: subdomain,
      isCustomDomain: false,
      domain: hostname
    };
  }
  
  // Se for um domínio personalizado mapeado para um tenant
  // Aqui poderíamos ter lógica adicional para detectar domínios personalizados
  
  return null;
}

/**
 * Gera a URL para um tenant específico
 * @param slug Slug do tenant
 * @returns URL completa do tenant
 */
export function getTenantUrl(slug: string): string {
  return TENANT_DOMAIN_PATTERN.replace('{slug}', slug);
}

/**
 * Redireciona para a loja de um tenant específico
 * @param slug Slug do tenant
 */
export function redirectToTenant(slug: string): void {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const tenantUrl = getTenantUrl(slug);
    window.location.href = `${protocol}//${tenantUrl}`;
  }
}

/**
 * Redireciona para o domínio principal
 */
export function redirectToMainDomain(): void {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    window.location.href = `${protocol}//${MAIN_DOMAIN}`;
  }
} 