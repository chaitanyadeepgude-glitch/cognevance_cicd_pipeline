# DevSecOps & Security Documentation

**Organization:** Cognevance Technologies  
**Project:** CI/CD Pipeline Automation System

---

## 1. Security Architecture Principles

DevSecOps embeds security testing, secret governance, and unprivileged execution directly into the CI/CD pipeline rather than auditing post-deployment.

The Cognevance CI/CD Automation System adheres to the following principles:
1. **Least Privilege:** Components operate with the minimum level of access required to perform their functions.
2. **Zero Hardcoded Secrets:** Credentials, private keys, and tokens are stored externally in encrypted vaults.
3. **Defense in Depth:** Multi-layered security spanning application code, container configuration, network access, and CI runner environments.

---

## 2. GitHub Actions Secrets & Runner Hardening

- **Encrypted Secrets:** All credentials (`DOCKERHUB_TOKEN`, `EC2_SSH_KEY`) are masked in GitHub Actions log outputs automatically.
- **Pull Request Quarantine:** Pull requests from forks or untrusted branches are isolated: the workflow will execute Pytest checks, but the Docker Hub push and EC2 deployment jobs are conditional:
  ```yaml
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  ```
- **Scoped Permissions:** The workflow declares explicit, minimal permissions:
  ```yaml
  permissions:
    contents: read
    packages: write
  ```

---

## 3. Container Hardening (Dockerfile Security)

### Non-Root Execution
By default, Docker containers run as `root` (UID 0), which introduces severe privilege escalation risks if an attacker escapes the container namespace.

Our Dockerfile enforces:
```dockerfile
# Dedicated system group and user
RUN groupadd -g 10001 appgroup && \
    useradd -u 10001 -g appgroup -s /bin/bash -m appuser

# Enforce ownership and drop root
USER appuser:appgroup
```

### Minimal Attack Surface
Using `python:3.11-slim` reduces installed OS packages by over 70% compared to standard base images, mitigating common vulnerabilities and exposures (CVEs).

### .dockerignore Protection
Prevents accidental leakage of local `.env` files, Git metadata, SSH keys, or virtual environments into intermediate image layers.

---

## 4. Application-Level Security

- **Safe Exception Handling:** 404 and 500 error handlers return clean JSON envelopes without dumping stack traces, database strings, or path disclosures to clients.
- **Sanitized Telemetry:** `/api/status` and `/api/info` endpoints provide high-level operational metrics while strictly omitting environment variables, passwords, and secret keys.
- **HTTP Method Whitelisting:** Endpoints explicitly enforce supported HTTP methods (`methods=['GET']`), rejecting unauthorized POST/PUT/DELETE requests with `405 Method Not Allowed`.
