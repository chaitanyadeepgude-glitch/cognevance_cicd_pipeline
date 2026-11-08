# CI/CD Workflow & GitHub Actions Guide

**Organization:** Cognevance Technologies  
**File:** `.github/workflows/ci-cd.yml`

---

## 1. Overview of Pipeline Architecture

The Continuous Integration & Continuous Deployment pipeline automates the complete lifecycle from code commit to verified production deployment. It eliminates manual intervention while providing strict quality gates.

---

## 2. Pipeline Triggers

The workflow responds to two primary GitHub event hooks:
1. `push` to branch `main`: Triggers the complete CI + CD lifecycle (Test, Lint, Docker Build, Docker Hub Push, EC2 Deploy, Verification).
2. `pull_request` targeting `main`: Triggers the CI phase only (Test, Lint, Build check). Secrets are protected, and no artifacts are pushed to Docker Hub.

```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```

---

## 3. Detailed Stage Breakdown

### Stage 1 – Source Code Checkout
Uses `actions/checkout@v4` to retrieve the repository contents into the runner workspace.

### Stage 2 – Python Environment Setup
Configures Python version 3.11 with pip caching enabled to accelerate subsequent workflow executions.
```yaml
- uses: actions/setup-python@v5
  with:
    python-version: "3.11"
    cache: "pip"
```

### Stage 3 – Automated Testing (Pytest)
Executes all unit and integration tests defined in `tests/test_app.py`. If a single assertion fails, the job immediately terminates with an exit code of 1.
```bash
pytest tests/ -v --junitxml=reports/pytest-report.xml
```

### Stage 4 – Build Validation & Linting
Validates Python syntax and enforces code standards using `flake8`. Blocks critical syntax errors (`E9, F63, F7, F82`).

### Stage 5 – Docker Image Build
Utilizes `docker/setup-buildx-action@v3` and `docker/build-push-action@v5` with GitHub Actions cache backend to generate the optimized container image.

### Stage 6 – Docker Hub Integration
Authenticates securely with Docker Hub using encrypted repository secrets:
- `DOCKERHUB_USERNAME`: Your Docker Hub account username.
- `DOCKERHUB_TOKEN`: Personal Access Token (PAT) with Read/Write permissions.

Tags applied:
- `${{ secrets.DOCKERHUB_USERNAME }}/cognevance-cicd-automation:latest`
- `${{ secrets.DOCKERHUB_USERNAME }}/cognevance-cicd-automation:${{ github.sha }}`

### Stage 7 – Deployment via SSH
Connects to the target AWS EC2 instance using `appleboy/ssh-action@v1.0.3` and executes container restart commands:
```bash
docker pull ${{ secrets.DOCKERHUB_USERNAME }}/cognevance-cicd-automation:latest
docker stop cognevance-automation-app || true
docker rm cognevance-automation-app || true
docker run -d --name cognevance-automation-app --restart unless-stopped -p 5000:5000 \
  ${{ secrets.DOCKERHUB_USERNAME }}/cognevance-cicd-automation:latest
```

### Stage 8 – Automated Health Verification
Waits for container startup and queries the `/health` endpoint using `curl`. Asserts HTTP 200 response and confirms `"status": "healthy"`.

---

## 4. Required GitHub Secrets Setup

To enable Docker Hub and EC2 deployment, configure these secrets under **GitHub Repository > Settings > Secrets and variables > Actions**:

| Secret Name | Description | Example Value |
| :--- | :--- | :--- |
| `DOCKERHUB_USERNAME` | Docker Hub username | `johndoe` |
| `DOCKERHUB_TOKEN` | Docker Hub Personal Access Token | `dckr_pat_xxxx...` |
| `EC2_HOST` | Public IP or DNS of EC2 instance | `54.210.12.34` |
| `EC2_USERNAME` | Linux username on remote host | `ubuntu` |
| `EC2_SSH_KEY` | Private SSH Key (PEM format) | `-----BEGIN RSA PRIVATE KEY-----...` |
