#!/usr/bin/env bash
# ---------------------------------------------------------------------
# Deploy do site para o servidor de producao (nginx + rsync via SSH)
#
# Uso:
#   SSH_HOST=usuario@IP-do-servidor ./deploy/deploy.sh
#
# Variaveis (podem ser exportadas ou editadas aqui):
#   SSH_HOST     ex.: deploy@203.0.113.10   (obrigatorio)
#   REMOTE_PATH  pasta do site no servidor  (default abaixo)
#   SSH_PORT     porta SSH                  (default 22)
# ---------------------------------------------------------------------
set -euo pipefail

SSH_HOST="${SSH_HOST:?defina SSH_HOST, ex.: SSH_HOST=deploy@1.2.3.4}"
REMOTE_PATH="${REMOTE_PATH:-/usr/share/nginx/html}"
SSH_PORT="${SSH_PORT:-22}"

echo "==> Build de producao"
npm ci
npm run build

echo "==> Enviando dist/ para ${SSH_HOST}:${REMOTE_PATH}"
rsync -avz --delete \
  -e "ssh -p ${SSH_PORT}" \
  dist/ "${SSH_HOST}:${REMOTE_PATH}/"

echo "==> Recarregando nginx"
ssh -p "${SSH_PORT}" "${SSH_HOST}" 'sudo nginx -t && sudo systemctl reload nginx'

echo "==> OK - https://souzacamposadvise.com.br"
