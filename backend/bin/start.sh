#!/bin/bash
set -e

# Wait for database to be ready
echo "Waiting for database..."
while ! nc -z db 3306; do
  sleep 1
done
echo "Database is ready!"

# Wait for Redis to be ready
echo "Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 1
done
echo "Redis is ready!"

# Run migrations
# python -m alembic upgrade head

# Start the application
cd /app/src && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload