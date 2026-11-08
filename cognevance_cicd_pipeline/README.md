# CI/CD Pipeline Automation System

**Organization:** Cognevance Technologies  
**Project Level:** Level 2 – Intermediate  
**Domain:** Cloud Computing & DevOps Engineering  

An automated Continuous Integration and Continuous Deployment (CI/CD) pipeline that automatically tests, builds, containerizes, and deploys a Python Flask web application using GitHub Actions, Docker, Docker Hub, and AWS EC2.

---

## 1. Project Title
**Cognevance Technologies - Level 2 CI/CD Pipeline Automation System**

## 2. Introduction
In contemporary DevOps engineering, automated software delivery pipelines represent the backbone of agile, reliable application lifecycles. This project demonstrates an automated pipeline engineered according to industry best practices, enforcing automated testing on every code push, immutable containerization, token-authenticated registry publishing, and remote cloud verification.

## 3. Problem Statement
Manual deployment pipelines suffer from configuration drift, human error during deployment commands, environment discrepancies between staging and production, and delayed defect discovery. These issues cause unexpected downtime and slow down feature delivery.

## 4. Objectives
1. Implement a modular Python Flask web application with operational endpoints.
2. Construct an automated Pytest test suite guarding critical endpoints.
3. Containerize the application with a multi-stage, non-root Dockerfile.
4. Integrate Docker Hub for automated image hosting and versioning.
5. Create a GitHub Actions CI/CD workflow executing 8 automated stages.
6. Automate deployment to a cloud virtual machine (AWS EC2) via SSH.
7. Implement automated health verification and zero-downtime container rollouts.
8. Deliver comprehensive technical documentation and logging.

## 5. Scope
- **In Scope:** Full automated CI/CD pipeline, Git workflow, Docker containerization, Docker Compose, Pytest testing, Docker Hub integration, AWS EC2 deployment via SSH, automated health checks, security hardening, and complete documentation.
- **Out of Scope:** Multi-cluster Kubernetes orchestration, paid external monitoring SaaS agents, multi-region database failover.

## 6. Technologies Used
- **Backend:** Python 3.11, Flask 3.0.3, Gunicorn 22.0.0
- **Testing:** Pytest 8.2, Flask Test Client
- **Containerization:** Docker 24+, Docker Compose v2
- **Container Registry:** Docker Hub
- **CI/CD Platform:** GitHub Actions (Ubuntu Latest runners)
- **Target Cloud Environment:** AWS EC2 (Ubuntu 22.04 LTS) / Linux VM
- **Code Quality:** Flake8, Python Logging

## 7. System Architecture
```
Developer Workstation
        ↓ (git commit & push)
GitHub Repository (main / PR)
        ↓ (actions trigger)
GitHub Actions Workflow
   ├── 1. Source Code Checkout
   ├── 2. Python 3.11 Setup & Cache
   ├── 3. Automated Pytest Execution
   ├── 4. Code Quality & Syntax Validation
   ├── 5. Docker Image Build
   ├── 6. Push to Docker Hub (tagged latest & SHA)
   ├── 7. SSH Deployment to AWS EC2
   └── 8. Automated HTTP Health Verification
```

## 8. Application Features
- **Real-Time DevOps Dashboard:** Clean dark-theme interface displaying system status, pipeline health, Docker metadata, and test metrics.
- **Operational Health Probe:** `/health` endpoint returning service uptime and operational status for container healthchecks.
- **Structured JSON APIs:** `/api/status` and `/api/info` endpoints serving application runtime metadata.
- **Graceful Error Handling:** Formatted 404 and 500 error handlers preventing stack trace disclosures.

## 9. Backend Explanation
The backend is structured using the Flask Application Factory pattern (`create_app()`) located in `app/__init__.py`. This pattern allows clean instantiation across development, testing, and production environments without global state conflicts. Route blueprints are registered in `app/routes.py`, and runtime options are centralized in `app/config.py`.

## 10. API Endpoints
| HTTP Verb | Route | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Web application dashboard | `200 OK` |
| `GET` | `/health` | Application health probe for Docker | `200 OK` |
| `GET` | `/api/status` | System runtime status metadata | `200 OK` |
| `GET` | `/api/info` | Tech stack specifications | `200 OK` |
| Any | Unknown | Structured 404 handler | `404 Not Found` |

## 11. Project Folder Structure
```
cognevance_cicd_pipeline/
├── app/
│   ├── __init__.py           # Flask application factory & logger
│   ├── routes.py             # Route definitions & API controllers
│   ├── config.py             # Environment configurations
│   ├── templates/
│   │   └── index.html        # Web dashboard template
│   └── static/
│       ├── css/style.css     # Dark-theme styling
│       └── js/script.js      # Client status polling script
├── tests/
│   ├── __init__.py
│   └── test_app.py           # Automated Pytest test suite (6 tests)
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # 8-stage GitHub Actions CI/CD workflow
├── documentation/
│   ├── project-report.md     # Full internship report for mentor
│   ├── architecture.md       # Architectural deep dive & diagrams
│   ├── cicd-workflow.md      # GitHub Actions stage documentation
│   ├── docker-guide.md       # Dockerfile & CLI reference
│   ├── deployment-guide.md   # Local & AWS EC2 step-by-step guide
│   ├── security-documentation.md # DevSecOps & secret management
│   └── testing-report.md     # Automated test results & coverage
├── scripts/
│   ├── run-local.sh          # Linux/macOS run & test script
│   └── run-local.bat         # Windows run & test script
├── screenshots/
│   └── README.md             # Screenshot submission checklist
├── Dockerfile                # Multi-stage, non-root Docker configuration
├── .dockerignore             # Container build exclusion list
├── docker-compose.yml        # Multi-container orchestration
├── requirements.txt          # Production Python dependencies
├── requirements-dev.txt      # Development & testing dependencies
├── wsgi.py                   # Gunicorn WSGI production entrypoint
├── .gitignore                # Git repository ignore rules
└── README.md                 # Complete project documentation
```

## 12. Installation Instructions
```bash
# Clone the repository
git clone https://github.com/<your-username>/cognevance_cicd_pipeline.git
cd cognevance_cicd_pipeline

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # (On Windows: venv\Scripts\activate)

# Install dependencies
pip install -r requirements-dev.txt
```

## 13. Local Execution
```bash
# Run application locally
export FLASK_ENV=development
export PORT=5000
python wsgi.py

# Or use the convenience script:
chmod +x scripts/run-local.sh
./scripts/run-local.sh
```

## 14. Automated Testing
Run the Pytest suite:
```bash
pytest tests/ -v
```
All 6 test cases will execute and validate the endpoints.

## 15. Docker Configuration
Build the Docker image:
```bash
docker build -t cicd-automation-app .
```
Run the Docker container:
```bash
docker run -d -p 5000:5000 --name cicd-app cicd-automation-app
```
Stop the container:
```bash
docker stop cicd-app
```

## 16. Docker Compose
Deploy locally via Docker Compose:
```bash
docker compose up -d
docker compose ps
docker compose logs -f
docker compose down
```

## 17. GitHub Actions Workflow
The workflow file `.github/workflows/ci-cd.yml` executes on every push to `main` and on pull requests targeting `main`. It runs:
1. Source checkout
2. Python 3.11 setup & pip caching
3. Pytest suite
4. Flake8 syntax checks
5. Docker Buildx container build
6. Docker Hub image push
7. SSH remote deployment to AWS EC2
8. Automated curl health check verification

## 18. Docker Hub Integration
Images are automatically pushed to:
`docker.io/<DOCKERHUB_USERNAME>/cognevance-cicd-automation`
Tagged as:
- `:latest`
- `:<commit-sha>`

## 19. GitHub Secrets Setup
In your GitHub repository settings, navigate to **Secrets and variables > Actions** and create:
- `DOCKERHUB_USERNAME`: Your Docker Hub username
- `DOCKERHUB_TOKEN`: Personal Access Token from Docker Hub
- `EC2_HOST`: Public IP of AWS EC2 instance
- `EC2_USERNAME`: `ubuntu`
- `EC2_SSH_KEY`: Private SSH Key (.pem)

## 20. Deployment Instructions
Refer to `documentation/deployment-guide.md` for complete step-by-step instructions for AWS EC2 provisioning, security groups, Docker installation, and GitHub Actions trigger.

## 21. Logging
The application uses Python's standard `logging` library configured in `app/__init__.py`. Logs are output in structured format to `sys.stdout` for consumption by Docker logging drivers.
```bash
docker logs <container_id>
```

## 22. Security
- Unprivileged non-root container user `appuser:10001`
- Encrypted GitHub Secrets for all credentials
- Docker Hub Personal Access Tokens (PAT) instead of account passwords
- Strict `.dockerignore` and `.gitignore` file rules

## 23. Troubleshooting
- **Port 5000 in use:** Stop existing containers with `docker stop $(docker ps -q)`.
- **Docker Hub push denied:** Verify `DOCKERHUB_TOKEN` has read/write permissions.
- **SSH timeout in GitHub Actions:** Ensure EC2 security group allows inbound TCP port 22.

## 24. Screenshots
Refer to `screenshots/README.md` for the list of 11 required screenshots to capture for internship evaluation.

## 25. Results
- 100% automated build-test-deploy lifecycle.
- Zero manual deployment steps required.
- Verified health probe on every rollout.

## 26. Limitations
- Single host deployment (no multi-node auto-scaling).
- Dependent on GitHub Actions cloud runner availability.

## 27. Future Enhancements
- Kubernetes (EKS / K3s) deployment with Helm charts.
- Canary or blue/green progressive delivery with ArgoCD.
- Prometheus and Grafana metrics dashboard.

## 28. Conclusion
The Cognevance Technologies Level 2 CI/CD Pipeline Automation System demonstrates a complete, reliable, and secure cloud automation pipeline ready for enterprise adoption.
