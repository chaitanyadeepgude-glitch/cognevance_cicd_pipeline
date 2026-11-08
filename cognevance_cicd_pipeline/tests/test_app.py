"""
Cognevance Technologies - CI/CD Pipeline Automation System
Automated Test Suite (Pytest + Flask Test Client)
Level 2 Intermediate DevOps Internship Verification
"""

import pytest
from app import create_app


@pytest.fixture
def app():
    """Create and configure a clean Flask instance for testing."""
    test_app = create_app("testing")
    return test_app


@pytest.fixture
def client(app):
    """Fixture providing a test client for simulating HTTP requests."""
    return app.test_client()


def test_homepage_status_code_200(client):
    """
    Test Case 1: Verify homepage returns HTTP 200 OK.
    Ensures web application dashboard successfully renders.
    """
    response = client.get("/")
    assert response.status_code == 200, f"Expected HTTP 200, got {response.status_code}"
    # Verify key brand presence
    assert b"Cognevance Technologies" in response.data or b"CI/CD" in response.data


def test_health_endpoint_healthy(client):
    """
    Test Case 2: Verify health endpoint (/health) works for container healthchecks.
    Ensures HTTP 200, valid JSON, and status is 'healthy'.
    """
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
    """
    Test Case 3: Verify /api/status returns valid JSON with required metadata.
    Must include: app_name, status, version, environment, and timestamp.
    """
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
    """
    Test Case 4: Verify /api/info returns architecture and technology stack details.
    Must provide non-sensitive stack details for monitoring systems.
    """
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
    # Sensitive credentials must NEVER be exposed
    assert "password" not in data
    assert "secret_key" not in data
    assert "token" not in data


def test_invalid_routes_return_404_json(client):
    """
    Test Case 5: Verify invalid routes return structured HTTP 404 response.
    Ensures application handles missing resources gracefully without leaking stack traces.
    """
    response = client.get("/api/non-existent-route-xyz")
    assert response.status_code == 404
    assert response.is_json

    data = response.get_json()
    assert data.get("error") == "Not Found"
    assert data.get("status_code") == 404
    assert "message" in data


def test_method_not_allowed_handling(client):
    """
    Test Case 6: Verify application handles unexpected methods correctly.
    POST requests to read-only endpoints should return 405 Method Not Allowed.
    """
    response = client.post("/health", json={"test": "payload"})
    assert response.status_code == 405
