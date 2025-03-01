/**
 * Configurações globais da aplicação
 */

// URL base da API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Variáveis de ambiente para integrações de pagamento
export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY;
export const MERCADOPAGO_PUBLIC_KEY = process.env.NEXT_PUBLIC_MERCADOPAGO_KEY;

// Configurações de upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

// Opções de paginação
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

// Configurações de SEO padrão
export const DEFAULT_SEO = {
  title: 'Craftando SaaS | Plataforma de E-commerce',
  description: 'Crie sua loja online com facilidade e comece a vender na internet agora mesmo.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://saas.craftando.com.br',
    site_name: 'Craftando SaaS'
  }
}; 