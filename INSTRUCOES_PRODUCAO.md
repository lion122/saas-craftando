# Instruções de Configuração para Produção

Este documento contém as instruções necessárias para configurar a plataforma E-commerce SaaS em um ambiente de produção, utilizando o domínio `saas.craftando.com.br`.

## 1. Configuração de DNS

### 1.1. Domínio Principal

Configure os seguintes registros DNS para o domínio principal:

```
saas.craftando.com.br.    IN    A    [ENDEREÇO_IP_DO_SERVIDOR]
```

### 1.2. Subdomínios Wildcard

Configure um registro wildcard para permitir que os subdomínios das lojas funcionem:

```
*.saas.craftando.com.br.    IN    A    [ENDEREÇO_IP_DO_SERVIDOR]
```

Ou, se preferir usar um serviço de CDN como o Cloudflare:

```
*.saas.craftando.com.br.    IN    CNAME    saas.craftando.com.br
```

## 2. Configuração do Servidor Web (Nginx)

### 2.1. Configuração do Frontend (Next.js)

Crie um arquivo de configuração do Nginx para o frontend:

```nginx
server {
    listen 80;
    server_name saas.craftando.com.br *.saas.craftando.com.br;
    
    # Redireciona para HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name saas.craftando.com.br *.saas.craftando.com.br;
    
    # Configuração SSL
    ssl_certificate /etc/letsencrypt/live/saas.craftando.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/saas.craftando.com.br/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    # Configurações de segurança
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    
    # Configuração do Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2.2. Configuração do Backend (NestJS)

Crie um arquivo de configuração do Nginx para o backend:

```nginx
server {
    listen 80;
    server_name api.saas.craftando.com.br;
    
    # Redireciona para HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.saas.craftando.com.br;
    
    # Configuração SSL
    ssl_certificate /etc/letsencrypt/live/api.saas.craftando.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.saas.craftando.com.br/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    
    # Configurações de segurança
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
    
    # Configuração do NestJS
    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 3. Certificados SSL

### 3.1. Configuração com Let's Encrypt

Execute os seguintes comandos para obter certificados SSL utilizando Certbot:

```bash
# Instale o Certbot
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Obtenha o certificado para o domínio principal e wildcard
sudo certbot --nginx -d saas.craftando.com.br -d *.saas.craftando.com.br

# Obtenha o certificado para a API
sudo certbot --nginx -d api.saas.craftando.com.br
```

### 3.2. Renovação Automática

O Certbot configura automaticamente a renovação dos certificados. Você pode testar o processo de renovação com:

```bash
sudo certbot renew --dry-run
```

## 4. Configuração do Process Manager (PM2)

### 4.1. Frontend (Next.js)

```bash
cd frontend
npm install --production
npm run build
pm2 start "npm start" --name "saas-frontend"
```

### 4.2. Backend (NestJS)

```bash
cd backend/api
npm install --production
npm run build
pm2 start dist/main.js --name "saas-backend"
```

### 4.3. Configurar inicialização automática

```bash
pm2 startup
pm2 save
```

## 5. Monitoramento e Logs

### 5.1. Monitoramento com PM2

```bash
pm2 monit
```

### 5.2. Logs do Aplicativo

```bash
# Logs do frontend
pm2 logs saas-frontend

# Logs do backend
pm2 logs saas-backend
```

## 6. Verificação de Funcionamento

1. Acesse o domínio principal: `https://saas.craftando.com.br`
2. Verifique se um subdomínio de exemplo funciona: `https://exemplo.saas.craftando.com.br`
3. Teste a API: `https://saas.craftando.com.br/api/tenants` 