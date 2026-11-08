"""
Cognevance Technologies - CI/CD Pipeline Automation System
Application Routing and Controller Module
"""

import datetime
import os
import time
from flask import Blueprint, current_app, jsonify, render_template, request

main_bp = Blueprint("main", __name__)

# Track process start time for health uptime calculation
APP_START_TIME = time.time()


@main_bp.route("/", methods=["GET"])
def index():
    """
    Main application dashboard route.
    Renders the responsive DevOps CI/CD Automation Dashboard.
    """
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
    """
    Health check endpoint for Docker HEALTHCHECK and deployment verification.
    Returns HTTP 200 with operational metrics.
    """
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
    """
    Application status API endpoint.
    Returns high-level system metadata and operational state.
    """
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
    """
    Technology stack and architecture information endpoint.
    Describes internship project specifications without leaking credentials.
    """
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
