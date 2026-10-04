#!/bin/sh
set -e

# Support Render dynamic PORT
if [ -n "$PORT" ]; then
    sed -i "s/80/$PORT/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf
fi

# Link storage
php artisan storage:link --force || true

# Cache configurations
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run database migrations
php artisan migrate --force || true

# Start Apache in foreground
exec apache2-foreground
