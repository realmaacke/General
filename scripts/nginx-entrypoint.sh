#!/bin/sh
log() { echo "==> [entrypoint] $1"; }

if [ "$APP_ENV" = "development" ]; then
  log "Development mode"
  exec nginx -g "daemon off;"
fi

log "Production mode"
exec nginx -g "daemon off;"