# Build stage
FROM python:3.10-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    gcc \
    libc-dev \
    libffi-dev \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_HOME=/opt/poetry
ENV POETRY_VERSION=1.7.1
ENV PATH="/opt/poetry/bin:$PATH"
ENV POETRY_VIRTUALENVS_CREATE=false
ENV POETRY_NO_INTERACTION=1

RUN curl -sSL https://install.python-poetry.org | python3 -

# Copy project files
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry install --only main --no-interaction --no-ansi

# Runtime stage
FROM python:3.10-slim

WORKDIR /app

# Install runtime dependencies and Poetry
RUN apt-get update && apt-get install -y \
    netcat-traditional \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry in runtime
ENV POETRY_HOME=/opt/poetry
ENV POETRY_VERSION=1.7.1
ENV PATH="/opt/poetry/bin:$PATH"
ENV POETRY_VIRTUALENVS_CREATE=false
ENV POETRY_NO_INTERACTION=1
ENV PYTHONPATH=/app

RUN curl -sSL https://install.python-poetry.org | python3 -

# Copy Python dependencies from builder
COPY --from=builder /usr/local/lib/python3.10/site-packages/ /usr/local/lib/python3.10/site-packages/
COPY --from=builder /usr/local/bin/ /usr/local/bin/
COPY --from=builder /opt/poetry/ /opt/poetry/

# Copy application code
COPY . .

# Make start script executable
RUN chmod +x /app/bin/start.sh

# Expose port
EXPOSE 8000

# Run the application
CMD ["/app/bin/start.sh"] 