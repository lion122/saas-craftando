#!/bin/bash

# Script para iniciar o projeto SaaS Craftando

# Encerrar processos existentes
echo "Encerrando processos existentes..."
pkill -f "next"

# Limpar cache do Next.js
echo "Limpando cache do Next.js..."
cd frontend && rm -rf .next

# Reconstruir a aplicação
echo "Reconstruindo a aplicação..."
npm run build

# Iniciar com PM2
echo "Iniciando aplicação com PM2..."
cd .. && pm2 start pm2.config.js

echo "Aplicação iniciada com sucesso!"
echo "Frontend de produção: http://localhost:3000"
echo "Frontend de desenvolvimento: http://localhost:3002"

# Verificar status
pm2 status 