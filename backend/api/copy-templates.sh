#!/bin/bash

# Criar diretório de destino se não existir
mkdir -p dist/notifications/templates

# Copiar todos os templates
cp -r src/notifications/templates/* dist/notifications/templates/

echo "Templates copiados com sucesso!" 