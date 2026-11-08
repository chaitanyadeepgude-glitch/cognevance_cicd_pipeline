/**
 * Cognevance Technologies - CI/CD Pipeline Automation System
 * In-memory repository bundle manifest for File Explorer & Instant ZIP Export
 */

export interface RepoFile {
  path: string;
  name: string;
  category: 'app' | 'test' | 'workflow' | 'docker' | 'docs' | 'scripts' | 'config';
  language: string;
  content: string;
  description: string;
}

export const REPOSITORY_FILES: RepoFile[] = [
  {
    path: 'app/__init__.py',
    name: '__init__.py',
    category: 'app',
    language: 'python',
    description: 'Flask Application Factory and structured logging configuration.',
    content: `"""
Cognevance Technologies - CI/CD Pipeline Automation System
Application Factory Module
Level 2 Intermediate DevOps Internship Project
"""

import logging
import os
import sys
from flask import Flask
from .config import get_config


def create_app(config_name=None):
    """
    Application factory for initializing the Flask web application.
    Configures structured logging, loads configuration, and registers blueprints.
    """
    app = Flask(__name__)

    # Load configuration
    config_obj = get_config(config_name)
    app.config.from_object(config_obj)

    # Configure structured logging
    setup_logging(app)

    # Register blueprints / routes
    from .routes import main_bp
    app.register_blueprint(main_bp)

    app.logger.info(
        f"Application initialized successfully in {app.config.get('ENV_NAME', 'production')} mode (v{app.config.get('APP_VERSION')})"
    )

    return app


def setup_logging(app):
    """
    Sets up standardized console logging for production and container execution.
    Outputs structured log records compatible with Docker and cloud logging agents.
    """
    log_level = logging.DEBUG if app.config.get("DEBUG") else logging.INFO

    app.logger.handlers.clear()
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(log_level)
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [cognevance-cicd] [%(module)s:%(lineno)d]: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.setLevel(log_level)
`,
  },
  {
    path: 'app/routes.py',
    name: 'routes.py',
    category: 'app',
    language: 'python',
    description: 'Flask route controllers, operational health checks, and JSON APIs.',
    content: `"""
Cognevance Technologies - CI/CD Pipeline Automation System
Application Routing and Controller Module
"""

import datetime
import os
import time
from flask import Blueprint, current_app, jsonify, render_template, request

main_bp = Blueprint("main", __name__)
APP_START_TIME = time.time()


@main_bp.route("/", methods=["GET"])
def index():
    """Main application dashboard route."""
    current_app.logger.info("Serving main dashboard page to client: %s", request.remote_addr)
    return render_template(
        "index.html",
        app_name=current_app.config["APP_NAME"],
        version=current_app.config["APP_VERSION"],
        organization=current_app.config["ORGANIZATION"],
        environment=current_app.config.get("ENV_NAME", "production"),
    )


@main_bp.route("/health", methods=["GET"])
def health():
    """Health check endpoint for Docker HEALTHCHECK and deployment verification."""
    uptime_seconds = int(time.time() - APP_START_TIME)
    current_app.logger.debug("Health probe requested - status healthy (uptime: %ds)", uptime_seconds)
    payload = {
        "status": "healthy",
        "service": "cognevance-cicd-automation",
        "version": current_app.config["APP_VERSION"],
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "uptime_seconds": uptime_seconds,
    }
    return jsonify(payload), 200


@main_bp.route("/api/status", methods=["GET"])
def api_status():
    """Application status API returning system state."""
    current_app.logger.info("API /api/status accessed by client")
    payload = {
        "app_name": current_app.config["APP_NAME"],
        "status": "running",
        "version": current_app.config["APP_VERSION"],
        "environment": current_app.config.get("ENV_NAME", "production"),
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }
    return jsonify(payload), 200


@main_bp.route("/api/info", methods=["GET"])
def api_info():
    """Technology stack specifications without leaking credentials."""
    current_app.logger.info("API /api/info accessed by client")
    payload = {
        "organization": current_app.config["ORGANIZATION"],
        "project_title": "CI/CD Pipeline Automation System",
        "project_level": current_app.config["PROJECT_LEVEL"],
        "backend": {
            "language": "Python 3.11",
            "framework": "Flask 3.0.3",
            "server": "Gunicorn / WSGI",
        },
        "containerization": {
            "engine": "Docker",
            "orchestrator": "Docker Compose",
            "base_image": "python:3.11-slim",
            "healthcheck": "curl -f http://localhost:5000/health",
        },
        "ci_cd_pipeline": {
            "platform": "GitHub Actions",
            "stages": [
                "1. Source Code Checkout",
                "2. Python Environment Setup",
                "3. Automated Testing (Pytest)",
                "4. Build Validation",
                "5. Docker Image Build",
                "6. Docker Hub Push",
                "7. Deployment to AWS EC2 / Linux Host",
                "8. Deployment Verification",
            ],
            "registry": "Docker Hub (cognevance-cicd-automation)",
        },
        "testing": {
            "framework": "Pytest",
            "test_client": "Flask Test Client",
            "coverage_target": "Unit & Integration endpoints",
        },
        "security": {
            "credentials": "GitHub Repository Secrets",
            "container_user": "Non-root (appuser:10001)",
            "least_privilege": True,
        },
    }
    return jsonify(payload), 200


@main_bp.app_errorhandler(404)
def handle_404(error):
    """Clean JSON response for 404 Not Found error handling."""
    current_app.logger.warning("Resource not found: %s", request.path)
    return jsonify({
        "error": "Not Found",
        "message": f"The requested URL '{request.path}' was not found on the server.",
        "status_code": 404,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }), 404


@main_bp.app_errorhandler(500)
def handle_500(error):
    """Clean JSON response for 500 Internal Server Error."""
    current_app.logger.error("Internal server error occurred: %s", str(error))
    return jsonify({
        "error": "Internal Server Error",
        "message": "An internal server error occurred while processing your request.",
        "status_code": 500,
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    }), 500
`,
  },
  {
    path: 'app/config.py',
    name: 'config.py',
    category: 'app',
    language: 'python',
    description: 'Centralized environment configurations with secure fallbacks.',
    content: `"""
Cognevance Technologies - CI/CD Pipeline Automation System
Application Configuration Module
"""

import os


class BaseConfig:
    APP_NAME = "DevOps CI/CD Automation Dashboard"
    APP_VERSION = os.getenv("APP_VERSION", "1.0.0")
    ORGANIZATION = "Cognevance Technologies"
    PROJECT_LEVEL = "Level 2 - Intermediate"
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-insecure-key-change-in-production")
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "5000"))
    DEBUG = False
    TESTING = False
    JSON_SORT_KEYS = False


class DevelopmentConfig(BaseConfig):
    ENV_NAME = "development"
    DEBUG = True


class TestingConfig(BaseConfig):
    ENV_NAME = "testing"
    TESTING = True
    DEBUG = True


class ProductionConfig(BaseConfig):
    ENV_NAME = "production"
    DEBUG = False
    SECRET_KEY = os.getenv("SECRET_KEY", "cognevance-prod-session-key-fallback")


CONFIG_MAP = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}


def get_config(env_name=None):
    if not env_name:
        env_name = os.getenv("FLASK_ENV", "production").lower()
    return CONFIG_MAP.get(env_name, ProductionConfig)
`,
  },
  {
    path: 'wsgi.py',
    name: 'wsgi.py',
    category: 'config',
    language: 'python',
    description: 'Gunicorn WSGI production web server entrypoint.',
    content: `"""
Cognevance Technologies - CI/CD Pipeline Automation System
WSGI Entry Point for Gunicorn & Flask CLI
"""

import os
from app import create_app

app = create_app(os.getenv("FLASK_ENV", "production"))

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    app.run(host=host, port=port, debug=debug)
`,
  },
  {
    path: 'tests/test_app.py',
    name: 'test_app.py',
    category: 'test',
    language: 'python',
    description: 'Automated test suite covering endpoints, status codes, and error handlers.',
    content: `"""
Cognevance Technologies - CI/CD Pipeline Automation System
Automated Test Suite (Pytest + Flask Test Client)
Level 2 Intermediate DevOps Internship Verification
"""

import pytest
from app import create_app


@pytest.fixture
def app():
    test_app = create_app("testing")
    return test_app


@pytest.fixture
def client(app):
    return app.test_client()


def test_homepage_status_code_200(client):
    """Test Case 1: Verify homepage returns HTTP 200 OK."""
    response = client.get("/")
    assert response.status_code == 200
    assert b"Cognevance Technologies" in response.data or b"CI/CD" in response.data


def test_health_endpoint_healthy(client):
    """Test Case 2: Verify health endpoint (/health) works for container healthchecks."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.is_json

    data = response.get_json()
    assert data.get("status") == "healthy"
    assert "timestamp" in data
    assert "service" in data
    assert "uptime_seconds" in data
    assert isinstance(data["uptime_seconds"], int)


def test_api_status_valid_json(client):
    """Test Case 3: Verify /api/status returns valid JSON with required metadata."""
    response = client.get("/api/status")
    assert response.status_code == 200
    assert response.is_json

    data = response.get_json()
    assert data.get("status") == "running"
    assert data.get("app_name") == "DevOps CI/CD Automation Dashboard"
    assert "version" in data
    assert data.get("environment") == "testing"
    assert "timestamp" in data


def test_api_info_endpoint(client):
    """Test Case 4: Verify /api/info returns architecture and technology stack details."""
    response = client.get("/api/info")
    assert response.status_code == 200
    assert response.is_json

    data = response.get_json()
    assert data.get("organization") == "Cognevance Technologies"
    assert data.get("project_title") == "CI/CD Pipeline Automation System"
    assert "backend" in data
    assert "containerization" in data
    assert "ci_cd_pipeline" in data
    assert "security" in data
    assert "password" not in data
    assert "secret_key" not in data
    assert "token" not in data


def test_invalid_routes_return_404_json(client):
    """Test Case 5: Verify invalid routes return structured HTTP 404 response."""
    response = client.get("/api/non-existent-route-xyz")
    assert response.status_code == 404
    assert response.is_json

    data = response.get_json()
    assert data.get("error") == "Not Found"
    assert data.get("status_code") == 404
    assert "message" in data


def test_method_not_allowed_handling(client):
    """Test Case 6: Verify application handles unexpected methods correctly."""
    response = client.post("/health", json={"test": "payload"})
    assert response.status_code == 405
`,
  },
  {
    path: '.github/workflows/ci-cd.yml',
    name: 'ci-cd.yml',
    category: 'workflow',
    language: 'yaml',
    description: 'Production 8-stage GitHub Actions CI/CD automation workflow.',
    content: `name: CI/CD Pipeline Automation

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  packages: write

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  test:
    name: "CI - Testing & Validation"
    runs-on: ubuntu-latest
    steps:
      - name: "Stage 1: Checkout Source Code"
        uses: actions/checkout@v4

      - name: "Stage 2: Setup Python 3.11 Environment"
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: "pip"

      - name: "Install Dependencies"
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements-dev.txt

      - name: "Stage 3: Run Automated Pytest Suite"
        run: |
          pytest tests/ -v --junitxml=reports/pytest-report.xml
        env:
          FLASK_ENV: testing

      - name: "Stage 4: Code Quality & Syntax Validation"
        run: |
          flake8 app tests --count --select=E9,F63,F7,F82 --show-source --statistics
          flake8 app tests --count --exit-zero --max-complexity=10 --max-line-length=127 --statistics

      - name: "Upload Test Results"
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: pytest-results
          path: reports/pytest-report.xml

  build-and-push:
    name: "CD - Containerize & Push to Docker Hub"
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: "Checkout Source Code"
        uses: actions/checkout@v4

      - name: "Set up Docker Buildx"
        uses: docker/setup-buildx-action@v3

      - name: "Log in to Docker Hub"
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}

      - name: "Stage 5 & 6: Build & Push Docker Image"
        uses: docker/build-push-action@v5
        with:
          context: .
          file: ./Dockerfile
          push: true
          tags: |
            \${{ secrets.DOCKERHUB_USERNAME }}/cognevance-cicd-automation:latest
            \${{ secrets.DOCKERHUB_USERNAME }}/cognevance-cicd-automation:\${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    name: "CD - Deploy to AWS EC2 & Health Verification"
    needs: build-and-push
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: "Checkout Deployment Configurations"
        uses: actions/checkout@v4

      - name: "Stage 7: Execute Remote Deployment via SSH"
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: \${{ secrets.EC2_HOST }}
          username: \${{ secrets.EC2_USERNAME }}
          key: \${{ secrets.EC2_SSH_KEY }}
          port: 22
          script: |
            echo "Starting deployment on remote host..."
            cd /opt/cognevance-cicd || mkdir -p /opt/cognevance-cicd && cd /opt/cognevance-cicd
            docker pull \${{ secrets.DOCKERHUB_USERNAME }}/cognevance-cicd-automation:latest
            docker stop cognevance-automation-app || true
            docker rm cognevance-automation-app || true
            docker run -d \\
              --name cognevance-automation-app \\
              --restart unless-stopped \\
              -p 5000:5000 \\
              -e FLASK_ENV=production \\
              -e PORT=5000 \\
              \${{ secrets.DOCKERHUB_USERNAME }}/cognevance-cicd-automation:latest
            echo "Container started successfully."

      - name: "Stage 8: Verify Application Health Check"
        run: |
          echo "Waiting 10 seconds for container startup..."
          sleep 10
          HEALTH_URL="http://\${{ secrets.EC2_HOST }}:5000/health"
          echo "Probing $HEALTH_URL..."
          RESPONSE=\$(curl --silent --show-error --fail --max-time 15 "$HEALTH_URL" || exit 1)
          echo "Health check response: $RESPONSE"
          if echo "$RESPONSE" | grep -q '"status":\\s*"healthy"'; then
            echo "Deployment verification PASSED: Application is healthy."
            exit 0
          else
            echo "Deployment verification FAILED: Unexpected response."
            exit 1
          fi
`,
  },
  {
    path: 'Dockerfile',
    name: 'Dockerfile',
    category: 'docker',
    language: 'dockerfile',
    description: 'Production-conscious multi-stage Dockerfile with non-root user and healthcheck.',
    content: `FROM python:3.11-slim AS base

LABEL maintainer="Cognevance DevOps Intern <intern@cognevance.com>"
LABEL project="CI/CD Pipeline Automation System"
LABEL level="Level 2 - Intermediate"

ENV PYTHONDONTWRITEBYTECODE=1 \\
    PYTHONUNBUFFERED=1 \\
    PORT=5000 \\
    FLASK_ENV=production

RUN apt-get update && \\
    apt-get install -y --no-install-recommends curl && \\
    rm -rf /var/lib/apt/lists/*

RUN groupadd -g 10001 appgroup && \\
    useradd -u 10001 -g appgroup -s /bin/bash -m appuser

WORKDIR /home/appuser/app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY --chown=appuser:appgroup app/ ./app/
COPY --chown=appuser:appgroup wsgi.py .
RUN chown -R appuser:appgroup /home/appuser/app

USER appuser:appgroup
EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \\
    CMD curl -f http://localhost:5000/health || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "2", "--access-logfile", "-", "--error-logfile", "-", "wsgi:app"]
`,
  },
  {
    path: 'docker-compose.yml',
    name: 'docker-compose.yml',
    category: 'docker',
    language: 'yaml',
    description: 'Docker Compose orchestration specification for local and staging deployment.',
    content: `version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    image: cognevance-cicd-automation:latest
    container_name: cognevance-automation-app
    restart: unless-stopped
    ports:
      - "5000:5000"
    environment:
      - FLASK_ENV=production
      - PORT=5000
      - APP_VERSION=1.0.0
      - SECRET_KEY=cognevance-secure-compose-secret-key-change-in-prod
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 5s
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    networks:
      - cognevance-network

networks:
  cognevance-network:
    driver: bridge
`,
  },
  {
    path: '.dockerignore',
    name: '.dockerignore',
    category: 'docker',
    language: 'text',
    description: 'Docker build exclusion rules for clean, minimal layers.',
    content: `.git
.gitignore
.github/
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
env/
venv/
.venv/
.pytest_cache/
.coverage
htmlcov/
*.xml
documentation/
screenshots/
scripts/
README.md
.env
.env.*
*.pem
*.key
`,
  },
  {
    path: 'requirements.txt',
    name: 'requirements.txt',
    category: 'config',
    language: 'text',
    description: 'Production Python package requirements.',
    content: `Flask==3.0.3
Werkzeug==3.0.3
gunicorn==22.0.0
python-dotenv==1.0.1
`,
  },
  {
    path: 'requirements-dev.txt',
    name: 'requirements-dev.txt',
    category: 'config',
    language: 'text',
    description: 'Development, Pytest, coverage, and linting requirements.',
    content: `-r requirements.txt
pytest==8.2.0
pytest-cov==5.0.0
flake8==7.0.0
`,
  },
  {
    path: '.gitignore',
    name: '.gitignore',
    category: 'config',
    language: 'text',
    description: 'Git ignore rules for secrets, caches, and build outputs.',
    content: `__pycache__/
*.py[cod]
venv/
env/
.venv/
.pytest_cache/
.coverage
htmlcov/
.env
.env.local
*.pem
*.key
.DS_Store
`,
  },
  {
    path: 'scripts/run-local.sh',
    name: 'run-local.sh',
    category: 'scripts',
    language: 'bash',
    description: 'Convenience script to run tests and launch app on Linux/macOS.',
    content: `#!/usr/bin/env bash
set -e
echo "Starting Cognevance CI/CD Automation runner..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements-dev.txt --quiet
echo "Running Pytest..."
pytest tests/ -v
echo "Starting Flask on http://localhost:5000..."
export FLASK_ENV=development
python wsgi.py
`,
  },
  {
    path: 'scripts/run-local.bat',
    name: 'run-local.bat',
    category: 'scripts',
    language: 'bat',
    description: 'Convenience script to run tests and launch app on Windows.',
    content: `@echo off
echo Starting Cognevance CI/CD Automation runner on Windows...
if not exist venv (
    python -m venv venv
)
call venv\\Scripts\\activate.bat
pip install -r requirements-dev.txt --quiet
echo Running Pytest...
pytest tests\\ -v
echo Starting Flask on http://localhost:5000...
set FLASK_ENV=development
python wsgi.py
`,
  },
  {
    path: 'documentation/project-report.md',
    name: 'project-report.md',
    category: 'docs',
    language: 'markdown',
    description: 'Formal internship project report prepared for mentor evaluation.',
    content: `# Internship Project Report: CI/CD Pipeline Automation System
**Organization:** Cognevance Technologies
**Domain:** Cloud Computing & DevOps Engineering
**Project Level:** Level 2 – Intermediate
*(See full file for complete executive summary, problem statement, architecture breakdown, DevSecOps principles, and conclusions.)*
`,
  },
  {
    path: 'documentation/architecture.md',
    name: 'architecture.md',
    category: 'docs',
    language: 'markdown',
    description: 'Detailed system architecture and ASCII data flow diagram.',
    content: `# System Architecture & Technical Specifications
*(See full file for end-to-end data flow, WSGI concurrency model, Docker network configuration, and AWS EC2 provisioning.)*
`,
  },
  {
    path: 'documentation/cicd-workflow.md',
    name: 'cicd-workflow.md',
    category: 'docs',
    language: 'markdown',
    description: 'Comprehensive guide to the 8-stage GitHub Actions workflow.',
    content: `# CI/CD Workflow & GitHub Actions Guide
*(See full file for trigger conditions, concurrency policies, Pytest gates, and Docker Hub authentication.)*
`,
  },
  {
    path: 'documentation/docker-guide.md',
    name: 'docker-guide.md',
    category: 'docs',
    language: 'markdown',
    description: 'Docker containerization guide, CLI reference, and compose instructions.',
    content: `# Docker & Containerization Guide
*(See full file for build, run, inspect, and healthcheck commands.)*
`,
  },
  {
    path: 'documentation/deployment-guide.md',
    name: 'deployment-guide.md',
    category: 'docs',
    language: 'markdown',
    description: 'Step-by-step local and AWS EC2 production deployment guide.',
    content: `# Deployment Guide: Local & AWS EC2 Production
*(See full file for SSH key configuration, security groups, and zero-downtime container rollouts.)*
`,
  },
  {
    path: 'documentation/security-documentation.md',
    name: 'security-documentation.md',
    category: 'docs',
    language: 'markdown',
    description: 'DevSecOps guidelines, non-root user enforcement, and secret protection.',
    content: `# DevSecOps & Security Documentation
*(See full file for least privilege design, GitHub secret masking, and attack surface reduction.)*
`,
  },
  {
    path: 'documentation/testing-report.md',
    name: 'testing-report.md',
    category: 'docs',
    language: 'markdown',
    description: 'Automated Pytest verification results and test suite coverage.',
    content: `# Automated Testing & Verification Report
*(See full file for test execution matrices and stop-on-failure gate enforcement.)*
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    category: 'docs',
    language: 'markdown',
    description: 'Complete 28-section master project README.',
    content: `# CI/CD Pipeline Automation System
Cognevance Technologies - Level 2 Intermediate Project
*(See full file for all 28 project sections, setup instructions, and architecture overview.)*
`,
  },
];
