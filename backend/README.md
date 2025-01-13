# Management Web System Backend

## Description
A REST API for customer management system.

## Requirements
- Python 3.10+
- Poetry
- MySQL

## Installation

1. Clone the repository
2. Install dependencies:
```bash
poetry install
```
3. Copy .env.example to .env and configure your environment variables
4. Run migrations:
```bash
alembic upgrade head
```

## Running the Application



The API will be available at http://localhost:2002

## API Documentation
- Swagger UI: http://localhost:2002/api/v1/docs
- ReDoc: http://localhost:2002/api/v1/redoc
- OpenAPI JSON: http://localhost:2002/api/v1/openapi.json
