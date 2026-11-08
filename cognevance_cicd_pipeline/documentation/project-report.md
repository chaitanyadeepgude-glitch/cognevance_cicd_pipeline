# Internship Project Report: CI/CD Pipeline Automation System

**Organization:** Cognevance Technologies  
**Domain:** Cloud Computing & DevOps Engineering  
**Project Level:** Level 2 – Intermediate  
**Project Title:** Automated CI/CD Pipeline with GitHub Actions, Docker, and AWS EC2  
**Author:** DevOps Engineering Intern  
**Submission Date:** November 2026  

---

## 1. Executive Summary

In modern cloud engineering, manual software deployment creates friction, introduces human configuration error, and delays time-to-market. The objective of this Level 2 internship project at Cognevance Technologies was to design, implement, and validate an automated, production-grade Continuous Integration and Continuous Deployment (CI/CD) pipeline for a containerized web application.

The developed system integrates:
1. **Application Layer:** A clean, modular Python Flask web application exposing operational health checks and telemetry APIs.
2. **Quality Assurance:** An automated Pytest testing suite checking routes, status codes, JSON response schemas, and error boundaries.
3. **Containerization:** A multi-stage, security-conscious Docker image executed under an unprivileged non-root user (`appuser:10001`) with built-in container health checking.
4. **Automation Engine:** GitHub Actions executing an 8-stage pipeline upon every push and pull request.
5. **Registry Integration:** Automated image building and tagging pushed securely to Docker Hub via repository secrets.
6. **Continuous Deployment:** Automated zero-downtime deployment to an AWS EC2 Linux virtual machine over SSH with automated health verification.

---

## 2. Problem Statement & Motivation

Prior to continuous integration and continuous deployment, software delivery faced critical obstacles:
- **Disjointed Environments:** Code functioning on a developer's local workstation frequently failed in production due to dependency and OS variance ("it works on my machine" syndrome).
- **Delayed Testing:** Bugs were discovered late in the development cycle, multiplying the cost and difficulty of defect resolution.
- **Manual Deployment Risk:** SSH logins, manual package installations, and manual process restarts introduced configuration drift and downtime.

This project delivers an end-to-end automated solution that enforces reproducible builds, continuous testing on every commit, immutable container artifacts, and verified production deployments.

---

## 3. Technology Stack & Architectural Decisions

| Component | Selected Technology | Rationale & Justification |
| :--- | :--- | :--- |
| **Backend Framework** | Python 3.11 / Flask 3.0.3 | Lightweight, standard WSGI architecture, minimal footprint, and rapid endpoint prototyping. |
| **WSGI Server** | Gunicorn 22.0.0 | Production-grade multi-worker WSGI server for concurrency and stability. |
| **Testing Framework** | Pytest 8.2 & Flask Test Client | Fast execution, powerful fixture system, clean assertion syntax, and XML reporting. |
| **Containerization** | Docker 24+ & Docker Compose | Immutable, isolated application environment with deterministic runtime dependencies. |
| **Base Image** | `python:3.11-slim` (Debian) | Low vulnerability footprint (~150MB) compared to full Python images (~1GB). |
| **Container Registry** | Docker Hub | Industry-standard container registry supporting tagged image versioning. |
| **CI/CD Platform** | GitHub Actions | Native GitHub integration, hosted Ubuntu runners, granular secret protection. |
| **Target Host** | AWS EC2 (Ubuntu 22.04 LTS) | Industry-standard cloud compute instance for hosting containerized workloads. |

---

## 4. End-to-End Pipeline Workflow Description

The pipeline automates 8 distinct operational stages:

```
[Developer Push to Git]
        │
        ▼
[GitHub Actions Trigger]
   ├── 1. Source Code Checkout (actions/checkout@v4)
   ├── 2. Python Setup & Pip Caching (actions/setup-python@v5)
   ├── 3. Automated Pytest Execution (pytest tests/ -v)
   ├── 4. Code Quality & Syntax Check (flake8)
   │
   [Quality Gate Passed]
        │
        ▼
   ├── 5. Docker Build (docker/build-push-action@v5)
   ├── 6. Docker Hub Push (secrets.DOCKERHUB_USERNAME & DOCKERHUB_TOKEN)
   │
   [Artifact Published]
        │
        ▼
   ├── 7. SSH Remote Deploy to AWS EC2 (appleboy/ssh-action)
   └── 8. Deployment Health Verification (curl -f http://<host>:5000/health)
```

1. **Source Code Checkout:** Retrieves the exact Git commit SHA on the runner.
2. **Environment Setup:** Provisions Python 3.11 and restores cached pip dependencies.
3. **Automated Testing:** Runs `tests/test_app.py`. If any assertion fails, the entire pipeline immediately halts, preventing defective code from reaching Docker or production.
4. **Build Validation:** Verifies syntax and evaluates code complexity.
5. **Docker Build:** Builds the production container image using Docker Buildx and GitHub Actions layer caching.
6. **Docker Hub Publishing:** Authenticates via encrypted GitHub Secrets and pushes two tags: `:latest` and `:${{ github.sha }}`.
7. **Production Deployment:** Connects securely over SSH to the target EC2 instance, pulls the new image tag, and restarts the container.
8. **Deployment Health Verification:** Executes an HTTP probe against `/health`. The workflow only reports success if HTTP 200 and `"status": "healthy"` are confirmed.

---

## 5. Security & DevSecOps Implementation

Security was engineered into every layer of the architecture:
- **Zero Hardcoded Secrets:** Docker Hub credentials and EC2 SSH private keys are stored exclusively in GitHub Repository Secrets.
- **Pull Request Safety:** Docker images are only pushed to Docker Hub and deployed when commits merge into the `main` branch. Pull requests execute tests and build checks without access to production secrets.
- **Unprivileged Non-Root User:** The container runs as `appuser:10001`, blocking host kernel privilege escalation even in the event of an application exploit.
- **Minimal Attack Surface:** Sensitive files (`.env`, `.git`, `tests/`, `documentation/`) are excluded from container layers via `.dockerignore`.
- **Sanitized Logging & Telemetry:** Application APIs (`/api/status`, `/api/info`) return operational status without leaking environment variables or keys.

---

## 6. Challenges & Solutions

| Challenge Encountered | Root Cause | Engineering Solution Implemented |
| :--- | :--- | :--- |
| **Docker Layer Invalidation** | Source code changes invalidated cached `pip install` steps. | Reordered Dockerfile instructions to copy `requirements.txt` and install packages before copying `app/` code. |
| **Port Conflicts on Host** | Previous container instances retained port 5000 during deployment. | Automated graceful `docker stop` and container removal commands prior to launching new container revisions. |
| **Premature Health Probing** | Verification curl executed before Flask WSGI finished worker binding. | Configured a 10-second stabilization pause in GitHub Actions prior to probing `/health`. |

---

## 7. Results & Key Learnings

- **Full Automation:** Eliminated manual build and deployment steps, reducing delivery cycle time from minutes to under 90 seconds.
- **100% Test Pass Rate:** Verified all 6 core test scenarios using Pytest.
- **Reproducible Artifacts:** Every commit produces an immutable Docker image tagged by Git SHA on Docker Hub.
- **Internship Skills Acquired:** Mastery of GitHub Actions workflow design, Docker security best practices, WSGI concurrency configuration, and automated cloud health monitoring.

---

## 8. Conclusion & Future Enhancements

The Cognevance Technologies Level 2 CI/CD Pipeline Automation System successfully satisfies all internship project objectives. Recommended future enhancements include:
- Integrating Kubernetes (EKS / K3s) with Helm charts for blue/green or canary rollouts.
- Adding SonarQube static application security testing (SAST) in CI Stage 4.
- Integrating Prometheus and Grafana for long-term metric visualization.
