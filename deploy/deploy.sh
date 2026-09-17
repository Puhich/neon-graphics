#!/usr/bin/env bash
# Деплой на своём сервере. Запускается кроном раз в две минуты от пользователя
# app и один раз руками при первом развёртывании.
#
# Логика: если origin/main ушёл вперёд — подтягиваем. Пересобираем сайт только
# если изменился код. Правки контента и картинок из админки уже лежат на диске
# (админка пишет их сама), для них пересборка не нужна.
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/neon}"
APP_NAME="${APP_NAME:-neon}"
LOCK="/tmp/neon-deploy.lock"

exec 9>"$LOCK"
flock -n 9 || exit 0

cd "$APP_DIR"
git fetch -q origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/main)
FORCE="${1:-}"

if [ "$LOCAL" = "$REMOTE" ] && [ "$FORCE" != "--force" ]; then
  exit 0
fi

# Что изменилось, кроме контента и загруженных картинок
CODE_CHANGED=$(git diff --name-only "$LOCAL" "$REMOTE" | grep -vE '^(data/|public/(images|logos|brand|og)/|public/(icon|apple-icon)\.png$)' || true)

git reset -q --hard origin/main

if [ -n "$CODE_CHANGED" ] || [ "$FORCE" = "--force" ]; then
  echo "[$(date '+%F %T')] deploy $LOCAL -> $REMOTE (rebuild)"
  npm ci --no-audit --no-fund --loglevel=error
  npm run build
  if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    pm2 reload "$APP_NAME" --update-env
  else
    pm2 start deploy/ecosystem.config.cjs
  fi
  pm2 save >/dev/null
else
  echo "[$(date '+%F %T')] sync $LOCAL -> $REMOTE (content only)"
fi
