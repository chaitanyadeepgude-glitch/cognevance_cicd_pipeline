# System Architecture & Technical Specifications

**Organization:** Cognevance Technologies  
**Project:** CI/CD Pipeline Automation System (Level 2)

---

## 1. High-Level Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Cognevance CI/CD Automation System                   │
└────────────────────────────────────────────────────────────────────────┘

  [ Developer Workstation ]
             │
             │ 1. Git Commit & Push (branch: main or PR)
             ▼
  [ GitHub Source Repository ]
             │
             │ 2. Webhook Event Trigger
             ▼
  [ GitHub Actions Cloud Runner (Ubuntu Latest) ]
             │
             ├── 3. actions/checkout@v4
             ├── 4. actions/setup-python@v5 (Python 3.11, pip cache)
             ├── 5. Pytest Execution (tests/test_app.py)
             │      └── [STOP ON FAILURE Quality Gate]
             ├── 6. Code Quality & Syntax Validation (flake8)
             │
             ├── 7. Docker Buildx (Dockerfile multi-stage build)
             ├── 8. Docker Hub Authentication (secrets.DOCKERHUB_*)
             │      └── Push: cognevance-cicd-automation:latest & :${{ sha }}
             │
             ├── 9. Remote SSH Trigger (appleboy/ssh-action)
             │      └── Connect to AWS EC2 Host
             └── 10. Automated Health Probe (curl http://<host>:5000/health)
                     └── [SUCCESS / ROLLBACK Gate]

                                 │
                                 ▼
                     [ Target Deployment: AWS EC2 ]
                     ┌───────────────────────────┐
                     │ Docker Engine             │
                     │  └── Container:           │
                     │      appuser:10001        │
                     │      Gunicorn WSGI (x2)   │
                     │      Port: 5000:5000      │
                     │      /health Probe        │
                     └───────────────────────────┘
```

---

## 2. Component Breakdown

### 2.1 Backend Application Layer
- **Framework:** Flask 3.0.3 using the Application Factory pattern (`create_app()`).
- **WSGI Server:** Gunicorn 22.0.0 configured with 2 workers and 2 threads for concurrent HTTP request handling.
- **Port:** Exposed internally and externally on port `5000`.
- **Endpoints:**
  - `GET /`: Renders the responsive DevOps CI/CD Automation Dashboard.
  - `GET /health`: Operational health check returning JSON payload with service uptime.
  - `GET /api/status`: Real-time system status and runtime environment metadata.
  - `GET /api/info`: Technology stack, container, and pipeline specifications.

### 2.2 Containerization Layer
- **Engine:** Docker Engine v24+.
- **Base Image:** `python:3.11-slim` based on Debian Bookworm.
- **Security:** Custom system group `appgroup:10001` and user `appuser:10001`.
- **Healthcheck:** Native Docker `HEALTHCHECK` running every 30 seconds:
  `CMD curl -f http://localhost:5000/health || exit 1`

### 2.3 Registry Layer
- **Registry Provider:** Docker Hub (`hub.docker.com`).
- **Repository Name:** `cognevance-cicd-automation`.
- **Tagging Strategy:** Dual tagging on every successful main build:
  1. `latest`: Represents the current active production artifact.
  2. `${{ github.sha }}`: Immutable Git commit SHA tag enabling instant rollbacks.

### 2.4 Cloud Infrastructure Layer
- **Cloud Provider:** Amazon Web Services (AWS) or generic Linux VM.
- **Compute Instance:** AWS EC2 `t3.micro` or `t2.micro` running Ubuntu 22.04 LTS.
- **Firewall / Security Group:**
  - Port `22` (SSH): Restricted to authorized IP addresses.
  - Port `5000` (HTTP): Accessible for web traffic and health probes.
