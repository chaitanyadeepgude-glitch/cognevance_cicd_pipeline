"""
Cognevance Technologies - CI/CD Pipeline Automation System
Application Configuration Module
"""

import os


class BaseConfig:
    """Base configuration shared across environments."""
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
    """Local development environment configuration."""
    ENV_NAME = "development"
    DEBUG = True


class TestingConfig(BaseConfig):
    """Pytest automated test configuration."""
    ENV_NAME = "testing"
    TESTING = True
    DEBUG = True


class ProductionConfig(BaseConfig):
    """Production and container runtime configuration."""
    ENV_NAME = "production"
    DEBUG = False
    # Ensure SECRET_KEY is securely sourced from environment in production
    SECRET_KEY = os.getenv("SECRET_KEY", "cognevance-prod-session-key-fallback")


CONFIG_MAP = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}


def get_config(env_name=None):
    """Select the active configuration object based on environment variable or parameter."""
    if not env_name:
        env_name = os.getenv("FLASK_ENV", "production").lower()
    return CONFIG_MAP.get(env_name, ProductionConfig)
