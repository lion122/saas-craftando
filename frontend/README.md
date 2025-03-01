# Projeto E-commerce SaaS

Este é um projeto de e-commerce multi-tenant (SaaS) desenvolvido com Next.js no frontend e NestJS no backend.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Frontend**: Aplicação Next.js com TypeScript e Tailwind CSS
- **Backend**: API RESTful desenvolvida com NestJS e TypeORM

## Funcionalidades Implementadas

### Frontend

- **Autenticação**: Login, registro e recuperação de senha
- **Gerenciamento de Produtos**: Listagem, detalhes, busca e filtragem
- **Carrinho de Compras**: Adição, remoção e atualização de itens
- **Checkout**: Processo completo de finalização de compra
- **Painel do Usuário**: Gerenciamento de pedidos, endereços e dados pessoais
- **Painel do Administrador**: Gerenciamento de produtos, pedidos e usuários
- **Multi-tenant**: Suporte a múltiplas lojas na mesma plataforma

### Backend

- **Autenticação**: JWT, controle de acesso baseado em funções
- **Produtos**: CRUD completo com suporte a categorias e variações
- **Pedidos**: Processamento, atualização de status e histórico
- **Usuários**: Gerenciamento de perfis, endereços e permissões
- **Multi-tenant**: Isolamento de dados por loja
- **Envio de E-mails**: Confirmações, recuperação de senha, etc.

## Tecnologias Utilizadas

### Frontend

- **Next.js**: Framework React para renderização híbrida (SSR/SSG)
- **TypeScript**: Tipagem estática para melhor desenvolvimento
- **Tailwind CSS**: Framework CSS utilitário
- **Shadcn/UI**: Componentes de UI baseados em Radix UI
- **React Hook Form**: Gerenciamento de formulários
- **Zustand**: Gerenciamento de estado global
- **Axios**: Cliente HTTP para comunicação com a API
- **SWR**: Estratégia de cache e revalidação de dados

### Backend

- **NestJS**: Framework Node.js para aplicações escaláveis
- **TypeORM**: ORM para interação com o banco de dados
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação baseada em tokens
- **Passport**: Estratégias de autenticação
- **Class Validator**: Validação de dados
- **Nodemailer**: Envio de e-mails

## Como Executar o Projeto

### Pré-requisitos

- Node.js (v18 ou superior)
- npm ou yarn
- PostgreSQL

### Frontend

1. Navegue até o diretório `frontend`
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente: copie `.env.example` para `.env.local`
4. Execute o servidor de desenvolvimento: `npm run dev`

### Backend

1. Navegue até o diretório `backend/api`
2. Instale as dependências: `npm install`
3. Configure as variáveis de ambiente: copie `.env.example` para `.env`
4. Execute o servidor de desenvolvimento: `npm run start:dev`

## Fluxo de Compra

1. Usuário navega pelos produtos
2. Adiciona itens ao carrinho
3. Procede para o checkout
4. Seleciona endereço de entrega
5. Escolhe método de envio
6. Seleciona forma de pagamento
7. Finaliza o pedido
8. Recebe confirmação por e-mail

## Próximos Passos

- Implementação de gateway de pagamento
- Melhorias na interface do administrador
- Relatórios e análises de vendas
- Integração com serviços de logística
- Implementação de sistema de avaliações e comentários
- Otimização de SEO
- Testes automatizados

## Contribuição

Para contribuir com o projeto, siga os passos:

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
3. Faça commit das alterações: `git commit -m 'Adiciona nova feature'`
4. Envie para o repositório: `git push origin feature/nova-feature`
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT.
