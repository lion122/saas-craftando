# E-commerce SaaS - Plataforma de Lojas Virtuais

Um sistema de e-commerce SaaS completo semelhante ao Nuvemshop, permitindo a criação e gestão de lojas virtuais para comerciantes.

## Tecnologias Utilizadas

### Backend
- **NestJS**: Framework Node.js para construção de aplicações server-side eficientes e escaláveis
- **PostgreSQL**: Banco de dados relacional para armazenamento persistente
- **TypeORM**: ORM para interação com o banco de dados
- **JWT**: Para autenticação e autorização
- **Swagger**: Documentação da API

### Frontend
- **Next.js**: Framework React para renderização server-side e static site generation
- **TypeScript**: Superset tipado de JavaScript
- **Tailwind CSS**: Framework CSS utilitário para design responsivo
- **React Hook Form**: Gerenciamento de formulários
- **Zustand**: Gerenciamento de estado

## Estrutura do Projeto

```
/
├── backend/          # Aplicação NestJS (API)
│   └── api/
│       ├── src/      # Código fonte da API
│       └── ...       # Configurações e dependências
│
├── frontend/         # Aplicação Next.js
│   ├── public/       # Arquivos estáticos
│   ├── src/          # Código fonte do frontend
│   └── ...           # Configurações e dependências
│
└── README.md         # Este arquivo
```

## Funcionalidades Principais

### Para Lojistas (Usuários do SaaS)
- Criação e gestão de lojas virtuais
- Personalização de tema e layout
- Gestão de produtos e categorias
- Gestão de pedidos e clientes
- Integração com métodos de pagamento
- Configuração de envio e frete
- Relatórios e análises de vendas

### Para Administradores da Plataforma
- Gestão de planos e assinaturas
- Monitoramento de lojas
- Suporte a lojistas
- Gestão de modelos e temas

## Inicialização do Projeto

### Método Recomendado (usando PM2)

Para iniciar o projeto de forma automatizada e gerenciada, utilize o script de inicialização:

```bash
./start-project.sh
```

Este script irá:
1. Encerrar processos existentes do Next.js
2. Limpar o cache do Next.js
3. Reconstruir a aplicação
4. Iniciar os serviços usando PM2

### Portas Utilizadas

- Frontend (produção): http://localhost:3000
- Frontend (desenvolvimento): http://localhost:3002
- Backend API: http://localhost:3001/api

### Comandos PM2 Úteis

- Verificar status: `pm2 status`
- Ver logs: `pm2 logs [nome-do-serviço]`
- Reiniciar serviços: `pm2 restart all`
- Parar serviços: `pm2 stop all`

## Equipe de Desenvolvimento

- [Seu Nome]
- [Membros da Equipe]

## Licença

Este projeto está licenciado sob a [Licença Escolhida] 