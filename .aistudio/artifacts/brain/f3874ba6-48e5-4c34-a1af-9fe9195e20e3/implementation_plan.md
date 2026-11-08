# CI/CD Pipeline Automation System — Cognevance Technologies (Level 2)

A production-grade CI/CD automation system and interactive DevOps engineering dashboard. Demonstrates automated building, testing with Pytest, Docker containerization, Docker Hub registry publishing, and automated deployment verification to an AWS EC2 / Linux VM target, alongside a live pipeline simulator and one-click project exporter.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were clarified and confirmed during Phase 1:
> - **Primary Interactive Dashboard Capability**: Full live pipeline simulator with interactive terminal logs, stage step inspection, and real backend API telemetry.
> - **Target Cloud Deployment Environment**: AWS EC2 / Linux Virtual Machine with SSH remote trigger, systemd/Docker Compose orchestration, and health rollback check.
> - **Packaging & Export**: One-click in-app ZIP downloader bundling the entire project (`app/`, `tests/`, `.github/`, `Dockerfile`, `docker-compose.yml`, scripts, and all 7 documentation guides) plus an interactive in-browser file inspector.

---

### 1. Overview & Core Concept

- **What It Does**:
  1. **Production Python Flask Application**: Modular web app with structured routing (`/`, `/health`, `/api/status`, `/api/info`), structured logging, clean configuration, and zero credential leakage.
  2. **Comprehensive Test Suite**: Automated Pytest unit and integration tests with Flask test client covering all routes, status codes, JSON schemas, and error boundaries.
  3. **Containerization & Compose**: Multi-stage/production-ready Dockerfile with unprivileged non-root user (`appuser:10001`), explicit healthcheck directive, `.dockerignore`, and multi-service `docker-compose.yml`.
  4. **GitHub Actions CI/CD Workflow (`.github/workflows/ci-cd.yml`)**: An 8-stage automated workflow running checkout, Python setup, Pytest validation, file linting/build check, Docker image build, Docker Hub token-based registry push (only on main), remote deployment via SSH to an EC2/Linux host, and automated health endpoint curl verification.
  5. **Interactive DevOps Engineering Dashboard**: A dark navy/charcoal developer portal showing real API health, an interactive CI/CD Pipeline Simulator with real-time terminal output, Docker command explorer, Pytest test runner inspector, architecture diagram viewer, and an in-app file tree explorer with one-click full ZIP export.
  6. **Complete Technical Documentation**: All 7 required guides in `documentation/` (`project-report.md`, `architecture.md`, `cicd-workflow.md`, `docker-guide.md`, `deployment-guide.md`, `security-documentation.md`, `testing-report.md`) plus root `README.md` and OS launch scripts (`run-local.sh`, `run-local.bat`).

- **Target Audience / Persona**: DevOps internship mentors, software evaluators, and engineering students at Cognevance Technologies demonstrating end-to-end cloud pipeline automation.
- **Key Value**: Provides an immediately deployable, real repository ready for GitHub push and Docker Hub, while simultaneously allowing live browser-based demonstration and interactive inspection in AI Studio.

---

### 2. User Experience & Visual Design

- **Visual Identity & Theme**:
  - **Aesthetic Direction**: High-density DevOps developer console, utilitarian dark navy (`#0B1120` canvas, `#111C35` cards, `#1E293B` hairline borders).
  - **Color Palette & Accents**: 60% deep slate-navy background, 30% structural surfaces with 1px border lines, 10% purposeful accents (emerald `#10B981` for passed stages/healthy status, sky blue `#0284C7` for active runs and primary actions, amber `#F59E0B` for warnings, rose `#EF4444` for failed tests).
  - **Typography**: Clean display structure via `Plus Jakarta Sans` / `Outfit`, paired with tabular figures and monospace logs via `JetBrains Mono` / `tabular-nums` for timestamps, commands, and terminal stdout.
  - **Zero-Pill Discipline**: Metadata uses unboxed clean text separated by `·` and `/`. No fake badge sandwiches or hallucinated innovation scores.

- **Key User Flows & Views**:
  1. **Dashboard Overview**: Live system telemetry (status, version, uptime, environment, active commit SHA, Docker container status, and backend connectivity check).
  2. **Live CI/CD Pipeline Simulator**: Triggerable automated pipeline run with interactive stages (Checkout → Setup Python → Pytest Execution → Build Validation → Docker Build → Docker Hub Push → EC2 Deployment → Health Verification). Displays simulated live streaming terminal logs with timestamps and step status.
  3. **Pipeline Workflow & Architecture**: Interactive visual workflow diagram showing every step from developer git push to Docker Hub and production container health check.
  4. **Docker & Containerization Console**: Explains container benefits, Dockerfile breakdown, multi-stage architecture, and interactive copyable commands (`docker build`, `docker run`, `docker compose up`, `docker inspect`, `docker logs`).
  5. **Automated Testing Lab**: Interactive Pytest viewer showing all 6 test cases, assertions, mock test client requests, and the ability to trigger a live test execution against the local API.
  6. **Documentation & File Explorer**: Browse all project files, view syntax-highlighted code (`.github/workflows/ci-cd.yml`, `app/routes.py`, `Dockerfile`, documentation), and download the full GitHub-ready project ZIP with a single click.
  7. **Project & Internship Information**: Cognevance Technologies project details, credentials guide, and submission checklist.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Architecture (Full Flask Repo + Interactive Client Simulation)**
  - *Chosen Approach*: Maintain the complete, pure Python Flask repository files in `cognevance_cicd_pipeline/` (and root exportable structure) while providing the interactive dashboard web app to simulate pipeline execution and serve live API endpoints.
  - *Why*: Allows immediate visual evaluation and grading in the AI Studio browser environment while ensuring the exported files are 100% valid Python/Flask, Pytest, Docker, and GitHub Actions code that can be uploaded to GitHub and run anywhere.
  - *Alternatives Considered*: Running Flask alone in a headless shell without a rich frontend dashboard would make visual demonstration difficult.

- **Decision 2: Realistic Terminal Output & Verifiable API Telemetry**
  - *Chosen Approach*: Connect the dashboard to real backend endpoints (`/health`, `/api/status`, `/api/info`) for actual status metrics, and execute realistic stage-by-stage command execution logs with step timings for the CI/CD simulator.
  - *Why*: Eliminates "AI slop" or fake arbitrary scorecards while giving a realistic preview of what GitHub Actions `actions/checkout` and `docker build` output look like.

- **Decision 3: Client-Side ZIP Generation (JSZip)**
  - *Chosen Approach*: Package the complete folder structure directly in the browser using `jszip` and file saver so the user can download the exact GitHub-ready repo without needing external tools.
  - *Why*: Instant, zero-latency download of the complete codebase including all configuration, workflow YAML, documentation, and scripts.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   Cognevance CI/CD Automation System                   │
└────────────────────────────────────────────────────────────────────────┘

 [Developer Workstation]
       │
       │ git commit & push (main / PR)
       ▼
 [GitHub Repository]
       │
       │ triggers on: [push: branches: [main], pull_request: [main]]
       ▼
 [GitHub Actions Runner (ubuntu-latest)]
   ├── Stage 1: actions/checkout@v4
   ├── Stage 2: actions/setup-python@v5 (Python 3.11) + pip install
   ├── Stage 3: pytest tests/ -v --junitxml=reports/test-results.xml
   ├── Stage 4: Build validation (syntax check & requirements audit)
   ├── Stage 5: docker/build-push-action@v5 (Build image: cicd-automation-app)
   ├── Stage 6: Docker Hub Login (DOCKERHUB_USERNAME / DOCKERHUB_TOKEN)
   │            Push image: ${{ secrets.DOCKERHUB_USERNAME }}/cognevance-cicd-automation:latest
   ├── Stage 7: Deploy via SSH to AWS EC2 / Linux VM (docker-compose pull && up -d)
   └── Stage 8: Health verification (curl -f http://<host>:5000/health)

──────────────────────────────────────────────────────────────────────────

 [DevOps CI/CD Automation Web Dashboard]
   ├── API Layer (Express / Flask proxy):
   │     GET /health          -> { status: "healthy", timestamp: ... }
   │     GET /api/status      -> { app: "DevOps CI/CD Automation", status: "running", version: "1.0.0" }
   │     GET /api/info        -> { python_version: "3.11", framework: "Flask 3.0", ... }
   │
   ├── Frontend UI (React + Tailwind CSS + Lucide Icons):
   │     ├── Navigation: Header bar (Brand, 5 section links, Download ZIP action)
   │     ├── View 1: Telemetry Dashboard & System Health Card
   │     ├── View 2: Live CI/CD Pipeline Simulator (Step terminal, status, logs)
   │     ├── View 3: Visual Workflow Architecture Diagram (Interactive stages)
   │     ├── View 4: Docker & Docker Hub Integration Hub (Commands, configs)
   │     ├── View 5: Automated Testing Center (Pytest suites, coverage)
   │     ├── View 6: Repository File Explorer (Inspect any file, copy, download)
   │     └── View 7: Project Report & Internship Submission Summary
   │
   └── ZIP Exporter Engine:
         Packages full cognevance_cicd_pipeline folder structure for GitHub upload
```

- **Data Models**:
  - `PipelineRun`: ID, status (`idle` | `running` | `success` | `failed`), branch, commit SHA, duration, stages array.
  - `PipelineStage`: ID, name, status (`pending` | `running` | `completed` | `failed`), duration, logs array with timestamps and exit codes.
  - `SystemStatus`: App name, status, version, uptime, container ID, image tag, environment.
  - `TestResult`: Test name, module, docstring, status (`passed` | `failed`), execution time, assertions.
  - `RepositoryFile`: Path, filename, category, content, language.

- **Exported Repository Structure**:
  ```
  cognevance_cicd_pipeline/
  ├── app/
  │   ├── __init__.py
  │   ├── routes.py
  │   ├── config.py
  │   ├── templates/index.html
  │   └── static/css/style.css, js/script.js
  ├── tests/
  │   ├── __init__.py
  │   └── test_app.py
  ├── .github/
  │   └── workflows/ci-cd.yml
  ├── documentation/
  │   ├── project-report.md
  │   ├── architecture.md
  │   ├── cicd-workflow.md
  │   ├── docker-guide.md
  │   ├── deployment-guide.md
  │   ├── security-documentation.md
  │   └── testing-report.md
  ├── scripts/
  │   ├── run-local.sh
  │   └── run-local.bat
  ├── screenshots/
  │   └── README.md
  ├── Dockerfile
  ├── .dockerignore
  ├── docker-compose.yml
  ├── requirements.txt
  ├── requirements-dev.txt
  ├── .gitignore
  └── README.md
  ```
