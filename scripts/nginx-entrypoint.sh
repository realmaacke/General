#!/bin/sh
 
SITES_DIR="/etc/nginx/conf.d"
CERT_BASE="/etc/letsencrypt/live"

# Logger
log() { echo "==> [entrypoint] $1"; }

# Gets all the domains & subdomains.
scrape_domains() {
  grep -h "server_name" $SITES_DIR/*.conf \
    | awk '{print $2}' \
    | sed 's/;//' \
    | grep -v "^$" \
    | sort -u
}

# Since nginx needs a cert to function this is the temp one
# it will be replaced by certbot.
generate_self_signed() {
  DOMAIN=$1
  mkdir -p $CERT_BASE/$DOMAIN
  openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
    -keyout $CERT_BASE/$DOMAIN/privkey.pem \
    -out $CERT_BASE/$DOMAIN/fullchain.pem \
    -subj "/CN=$DOMAIN" 2>/dev/null
  log "Self-signed cert generated for $DOMAIN"
}

# this is where certbot issues the domain.
issue_cert() {
  DOMAIN=$1
  log "Issuing cert for $DOMAIN..."
  certbot certonly --webroot \
    -w /var/www/certbot \
    -d $DOMAIN \
    --register-unsafely-without-email \
    --agree-tos \
    --non-interactive \
    --keep-until-expiring
}

# Development
if [ "$APP_ENV" = "development" ]; then
  log "Development mode detected"
  log "Skipping certbot in development mode"
  exec nginx -g "daemon off;"
fi

# Production
log "Production mode detected, swapping to prod configs..."
DOMAINS=$(scrape_domains)
NEEDS_NGINX_START=false

# Loops through domains, if it does not exist, create a new one.
for DOMAIN in $DOMAINS; do
  if [ ! -f "$CERT_BASE/$DOMAIN/fullchain.pem" ]; then
    log "No cert found for $DOMAIN, generating self-signed fallback..."
    generate_self_signed $DOMAIN
    NEEDS_NGINX_START=true
  fi
done

# start nginx so certbot can do HTTP-01 challenge
if [ "$NEEDS_NGINX_START" = "true" ]; then
  log "Starting nginx with self-signed certs for ACME challenge..."
  nginx
 
  for DOMAIN in $DOMAINS; do
    # only issue if currently self-signed (check expiry <= 1 day)
    EXPIRY=$(openssl x509 -enddate -noout \
      -in $CERT_BASE/$DOMAIN/fullchain.pem 2>/dev/null \
      | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$EXPIRY" +%s)
    NOW_EPOCH=$(date +%s)
    DAYS_LEFT=$(( ($EXPIRY_EPOCH - $NOW_EPOCH) / 86400 ))
 
    if [ "$DAYS_LEFT" -le 1 ]; then
      issue_cert $DOMAIN
    fi
  done
 
  log "Stopping temporary nginx..."
  nginx -s stop
  sleep 1
fi

# start renewal loop in background (runs once a day)
(while true; do
  sleep 24h
  log "Running certbot renew..."
  certbot renew --quiet --webroot -w /var/www/certbot
  nginx -s reload
done) &
 
log "Starting nginx..."
exec nginx -g "daemon off;"
