# Resumo das Configurações de Domínio

Este documento resume todas as configurações realizadas para integrar a plataforma E-commerce SaaS com o domínio `saas.craftando.com.br` e seus subdomínios para lojas de tenants.

## 1. Configurações do Frontend (Next.js)

### 1.1. Variáveis de Ambiente
- **Arquivo**: `frontend/.env`
- **Configurações**:
  - Domínio principal: `saas.craftando.com.br`
  - Padrão de subdomínio para tenants: `{slug}.saas.craftando.com.br`
  - URLs da API em produção e desenvolvimento

### 1.2. Configuração do Next.js
- **Arquivo**: `frontend/next.config.mjs`
- **Configurações**:
  - Domínios permitidos para imagens
  - Regras de roteamento para subdomínios
  - Headers para CORS

### 1.3. Middleware de Roteamento
- **Arquivo**: `frontend/src/middleware.ts`
- **Funcionalidades**:
  - Detecção de subdomínios
  - Redirecionamento para páginas da loja correspondente
  - Proteção de rotas administrativas em subdomínios

### 1.4. Utilitários para Tenants
- **Arquivo**: `frontend/src/utils/tenant.ts`
- **Funcionalidades**:
  - Detecção do tenant atual pelo domínio/subdomínio
  - Geração de URLs para tenants
  - Funções de redirecionamento entre lojas

## 2. Configurações do Backend (NestJS)

### 2.1. Variáveis de Ambiente
- **Arquivo**: `backend/api/.env`
- **Configurações**:
  - URL do frontend: `https://saas.craftando.com.br`
  - URL base da API: `https://saas.craftando.com.br/api`
  - Padrão de domínio para tenants: `{slug}.saas.craftando.com.br`

### 2.2. Configuração de CORS
- **Arquivo**: `backend/api/src/main.ts`
- **Configurações**:
  - Acesso permitido do domínio principal
  - Acesso permitido de todos os subdomínios usando RegExp

### 2.3. Serviços de Tenant
- **Arquivo**: `backend/api/src/tenants/tenants.service.ts`
- **Funcionalidades**:
  - Geração de URLs para storefront dos tenants
  - Manipulação de domínios personalizados

## 3. Componentes e Páginas Específicas

### 3.1. Layout e Páginas da Loja
- **Arquivos**:
  - `frontend/src/app/stores/[slug]/layout.tsx`
  - `frontend/src/app/stores/[slug]/page.tsx`
- **Funcionalidades**:
  - Renderização de lojas baseadas no slug/subdomínio
  - Carregamento de dados específicos do tenant

### 3.2. Componente de Seleção de Lojas
- **Arquivo**: `frontend/src/components/TenantSwitcher.tsx`
- **Funcionalidades**:
  - Interface para alternar entre lojas do usuário
  - Redirecionamento para URLs de tenant correspondentes

### 3.3. Gerenciamento de Domínios Personalizados
- **Arquivo**: `frontend/src/app/admin/lojas/[id]/dominios/page.tsx`
- **Funcionalidades**:
  - Interface para configuração de domínios personalizados
  - Instruções para configuração de DNS

## 4. Implementação de Subdomínios e Domínios Personalizados

### 4.1. Estratégia de Subdomínios
- Cada loja (tenant) recebe automaticamente um subdomínio no formato `{slug}.saas.craftando.com.br`
- Utilização de middleware no Next.js para direcionar requisições baseadas no subdomínio para o tenant correto

### 4.2. Suporte a Domínios Personalizados
- Implementação de interface para cadastro de domínios personalizados
- Instruções para configuração de DNS para domínios personalizados
- Armazenamento e validação de domínios personalizados no banco de dados

## 5. Documentação para Produção

### 5.1. Instruções para Configuração
- **Arquivo**: `INSTRUCOES_PRODUCAO.md`
- **Conteúdo**:
  - Configuração de DNS (incluindo wildcard)
  - Configuração do Nginx para frontend e backend
  - Obtenção e renovação de certificados SSL
  - Configuração de PM2 para gerenciamento de processos

### 5.2. Considerações de Segurança
- Todos os acessos redirecionados para HTTPS
- Configuração de headers de segurança no Nginx
- Proteção de rotas administrativas em subdomínios de tenant 