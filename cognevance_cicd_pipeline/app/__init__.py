"""
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

    # Clean existing handlers
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
