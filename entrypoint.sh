#!/bin/bash

# Περιμένουμε να σηκωθεί το database container
echo "Waiting for postgres..."

while ! nc -z db 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

# Εκτελούμε migrations
python manage.py migrate

# (προαιρετικά αν θες) συλλογή static files
# python manage.py collectstatic --noinput

# Ξεκινάμε τον server
python manage.py runserver 0.0.0.0:8000
