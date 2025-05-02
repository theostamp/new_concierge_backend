#!/bin/bash

# Περιμένουμε τη βάση δεδομένων
echo "Waiting for PostgreSQL..."

while ! nc -z db 5432; do
  sleep 0.1
done

echo "PostgreSQL started"

# Εκτελούμε migrations
python manage.py migrate

# (προαιρετικά) Συλλογή στατικών αρχείων
# python manage.py collectstatic --noinput

# Εκκίνηση του Django server
python manage.py runserver 0.0.0.0:8000
