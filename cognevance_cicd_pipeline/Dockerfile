# ==============================================================================
# Cognevance Technologies - CI/CD Pipeline Automation System
# Production Dockerfile for Python Flask Application (Level 2)
# ==============================================================================

# Stage 1: Base Python slim image for minimal vulnerability surface
FROM python:3.11-slim AS base

# Metadata and labels
LABEL maintainer="Cognevance DevOps Intern <intern@cognevance.com>"
LABEL project="CI/CD Pipeline Automation System"
LABEL level="Level 2 - Intermediate"

# Security & runtime environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5000 \
    FLASK_ENV=production

# Install curl for container HEALTHCHECK probe and clean apt cache
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

# Create dedicated non-root application user and group (Least Privilege Security)
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/bash -m appuser

# Set working directory
WORKDIR /home/appuser/app

# Copy dependency specifications first to leverage Docker layer caching
COPY requirements.txt .

# Install production dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY --chown=appuser:appgroup app/ ./app/
COPY --chown=appuser:appgroup wsgi.py .

# Enforce file permissions
RUN chown -R appuser:appgroup /home/appuser/app

# Switch to non-root execution user
USER appuser:appgroup

# Expose application listening port
EXPOSE 5000

# Container Healthcheck directive
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Start production WSGI server
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "2", "--access-logfile", "-", "--error-logfile", "-", "wsgi:app"]
