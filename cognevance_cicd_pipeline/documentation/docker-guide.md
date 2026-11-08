# Docker & Containerization Guide

**Organization:** Cognevance Technologies  
**Project:** CI/CD Pipeline Automation System

---

## 1. What is Docker & Containerization?

Docker is an open-source containerization platform that packages an application and all its runtime dependencies, system tools, and libraries into an immutable, portable unit called a **container**.

### Benefits of Containerization:
1. **Environment Consistency:** Eliminates the classic "works on my machine" problem by ensuring the identical runtime across developer workstations, CI runners, and cloud production servers.
2. **Process Isolation:** Runs applications in lightweight user-space namespaces without the hypervisor overhead of traditional virtual machines.
3. **Rapid Boot Time:** Containers start in milliseconds compared to minutes for full OS virtual machines.
4. **Reproducible Deployments:** Tagged images serve as immutable release artifacts that can be audited or rolled back instantly.

---

## 2. Dockerfile Design Analysis

Our production `Dockerfile` adheres to industry DevSecOps best practices:

```dockerfile
# 1. Minimal base image
FROM python:3.11-slim AS base

# 2. Optimized runtime flags
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5000 \
    FLASK_ENV=production

# 3. Dedicated non-root user (Principle of Least Privilege)
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/bash -m appuser

# 4. Layer caching: install dependencies before copying code
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy source code and set ownership
COPY --chown=appuser:appgroup app/ ./app/
COPY --chown=appuser:appgroup wsgi.py .

# 6. Switch to unprivileged execution
USER appuser:appgroup

# 7. Operational health probe
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# 8. Production WSGI server execution
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--threads", "2", "wsgi:app"]
```

---

## 3. Essential Docker CLI Commands

### 3.1 Build Container Image
```bash
docker build -t cicd-automation-app .
```

### 3.2 Run Container Locally
```bash
# Run detached in background, mapping port 5000
docker run -d -p 5000:5000 --name cicd-app cicd-automation-app
```

### 3.3 Verify Container Health & Status
```bash
# List running containers
docker ps

# Inspect native healthcheck status
docker inspect --format='{{json .State.Health}}' cicd-app
```

### 3.4 View Container Logs
```bash
# Follow live application stdout/stderr logs
docker logs -f cicd-app
```

### 3.5 Stop & Remove Container
```bash
docker stop cicd-app
docker rm cicd-app
```

---

## 4. Multi-Container Orchestration with Docker Compose

To run the complete system locally with environment variables and logging policies:

```bash
# Launch application in background
docker compose up -d

# View status of services
docker compose ps

# Follow logs
docker compose logs -f

# Gracefully tear down container
docker compose down
```
