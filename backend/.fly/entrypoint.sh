#!/bin/bash
set -e

# Cache config and routes for performance
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Ensure storage directories exist
mkdir -p storage/framework/{sessions,views,cache}
chmod -R 775 storage bootstrap/cache

# Update Apache port to match the PORT environment variable
sed -i "s/80/${PORT:-80}/g" /etc/apache2/sites-available/000-default.conf /etc/apache2/ports.conf

# Start Apache
apache2-foreground
