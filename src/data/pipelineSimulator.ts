/**
 * Cognevance Technologies - CI/CD Pipeline Automation System
 * Interactive Pipeline Simulation Data & Log Generator
 */

export interface PipelineStageLog {
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error' | 'cmd';
  text: string;
}

export interface PipelineStageDef {
  id: number;
  name: string;
  category: 'ci' | 'cd';
  duration: number; // in ms
  description: string;
  command: string;
  logs: PipelineStageLog[];
}

export const PIPELINE_STAGES: PipelineStageDef[] = [
  {
    id: 1,
    name: 'Source Code Checkout',
    category: 'ci',
    duration: 1200,
    description: 'Fetches Git commit history and workspace files using actions/checkout@v4.',
    command: 'actions/checkout@v4 (ref: refs/heads/main, commit: 9f3a2c8)',
    logs: [
      { timestamp: '00:01', level: 'cmd', text: 'Run actions/checkout@v4' },
      { timestamp: '00:01', level: 'info', text: 'Syncing repository: cognevance/cognevance_cicd_pipeline' },
      { timestamp: '00:01', level: 'info', text: 'Getting Git credentials for github.com' },
      { timestamp: '00:02', level: 'info', text: 'Fetching origin refs/heads/main...' },
      { timestamp: '00:02', level: 'info', text: 'Checking out commit 9f3a2c8: "feat: Level 2 CI/CD automated pipeline"' },
      { timestamp: '00:02', level: 'success', text: 'Successfully checked out main at 9f3a2c8 (depth: 1)' },
    ],
  },
  {
    id: 2,
    name: 'Python 3.11 Setup & Cache',
    category: 'ci',
    duration: 1800,
    description: 'Provisions Python 3.11 environment and restores cached pip dependencies.',
    command: 'actions/setup-python@v5 (python: 3.11, cache: pip)',
    logs: [
      { timestamp: '00:03', level: 'cmd', text: 'Run actions/setup-python@v5' },
      { timestamp: '00:03', level: 'info', text: 'Installed Python 3.11.8 (x86_64) on runner ubuntu-latest' },
      { timestamp: '00:04', level: 'info', text: 'Restoring pip cache for requirements-dev.txt...' },
      { timestamp: '00:04', level: 'info', text: 'Cache hit for pip: Linux-pip-3.11-requirements-dev-8a9d12' },
      { timestamp: '00:04', level: 'cmd', text: 'pip install -r requirements-dev.txt' },
      { timestamp: '00:05', level: 'info', text: 'Requirement already satisfied: Flask==3.0.3, pytest==8.2.0, gunicorn==22.0.0' },
      { timestamp: '00:05', level: 'success', text: 'Environment initialized with 14 packages installed.' },
    ],
  },
  {
    id: 3,
    name: 'Automated Testing (Pytest)',
    category: 'ci',
    duration: 2200,
    description: 'Executes all 6 unit and integration test client scenarios. Quality gate stop-on-failure.',
    command: 'pytest tests/ -v --junitxml=reports/pytest-report.xml',
    logs: [
      { timestamp: '00:06', level: 'cmd', text: 'pytest tests/ -v --junitxml=reports/pytest-report.xml' },
      { timestamp: '00:06', level: 'info', text: 'rootdir: /home/runner/work/cognevance_cicd_pipeline, configfile: pytest.ini' },
      { timestamp: '00:06', level: 'info', text: 'collected 6 items' },
      { timestamp: '00:07', level: 'success', text: 'tests/test_app.py::test_homepage_status_code_200 PASSED [ 16%]' },
      { timestamp: '00:07', level: 'success', text: 'tests/test_app.py::test_health_endpoint_healthy PASSED  [ 33%]' },
      { timestamp: '00:07', level: 'success', text: 'tests/test_app.py::test_api_status_valid_json PASSED    [ 50%]' },
      { timestamp: '00:08', level: 'success', text: 'tests/test_app.py::test_api_info_endpoint PASSED        [ 66%]' },
      { timestamp: '00:08', level: 'success', text: 'tests/test_app.py::test_invalid_routes_return_404_json PASSED [ 83%]' },
      { timestamp: '00:08', level: 'success', text: 'tests/test_app.py::test_method_not_allowed_handling PASSED   [100%]' },
      { timestamp: '00:08', level: 'success', text: '==================== 6 passed in 0.18s ====================' },
      { timestamp: '00:08', level: 'info', text: 'Generated XML report at reports/pytest-report.xml' },
    ],
  },
  {
    id: 4,
    name: 'Build Validation & Linting',
    category: 'ci',
    duration: 1400,
    description: 'Checks code syntax, undefined names, and PEP8 standards via Flake8.',
    command: 'flake8 app tests --count --select=E9,F63,F7,F82 --statistics',
    logs: [
      { timestamp: '00:09', level: 'cmd', text: 'flake8 app tests --count --select=E9,F63,F7,F82 --statistics' },
      { timestamp: '00:09', level: 'info', text: 'Auditing 7 Python source modules...' },
      { timestamp: '00:10', level: 'success', text: 'Syntax audit: 0 critical errors detected.' },
      { timestamp: '00:10', level: 'cmd', text: 'flake8 app tests --count --exit-zero --max-complexity=10' },
      { timestamp: '00:10', level: 'success', text: 'Code complexity check: All functions cyclomatic complexity <= 6.' },
      { timestamp: '00:10', level: 'success', text: 'Quality Gate PASSED: Application is approved for containerization.' },
    ],
  },
  {
    id: 5,
    name: 'Docker Image Build',
    category: 'cd',
    duration: 3200,
    description: 'Compiles multi-stage container image using python:3.11-slim with non-root appuser:10001.',
    command: 'docker build -t cognevance-cicd-automation:9f3a2c8 -f Dockerfile .',
    logs: [
      { timestamp: '00:11', level: 'cmd', text: 'docker buildx build --load --tag cognevance-cicd-automation:latest .' },
      { timestamp: '00:11', level: 'info', text: '[1/7] FROM docker.io/library/python:3.11-slim AS base (resolved in 0.4s)' },
      { timestamp: '00:12', level: 'info', text: '[2/7] RUN apt-get update && apt-get install -y --no-install-recommends curl' },
      { timestamp: '00:12', level: 'info', text: '[3/7] RUN groupadd -g 10001 appgroup && useradd -u 10001 appuser' },
      { timestamp: '00:13', level: 'info', text: '[4/7] WORKDIR /home/appuser/app' },
      { timestamp: '00:13', level: 'info', text: '[5/7] COPY requirements.txt . && RUN pip install --no-cache-dir' },
      { timestamp: '00:14', level: 'info', text: '[6/7] COPY --chown=appuser:appgroup app/ wsgi.py .' },
      { timestamp: '00:14', level: 'info', text: '[7/7] HEALTHCHECK --interval=30s CMD curl -f http://localhost:5000/health' },
      { timestamp: '00:14', level: 'success', text: 'Image built successfully: sha256:d8a9e728b10f2c (Size: 148.2 MB)' },
    ],
  },
  {
    id: 6,
    name: 'Docker Hub Push',
    category: 'cd',
    duration: 2500,
    description: 'Authenticates via encrypted repository secrets and publishes tags to Docker Hub.',
    command: 'docker push ${{ secrets.DOCKERHUB_USERNAME }}/cognevance-cicd-automation:latest',
    logs: [
      { timestamp: '00:15', level: 'cmd', text: 'echo "${{ secrets.DOCKERHUB_TOKEN }}" | docker login -u "${{ secrets.DOCKERHUB_USERNAME }}" --password-stdin' },
      { timestamp: '00:15', level: 'success', text: 'Login Succeeded (Docker Hub Registry)' },
      { timestamp: '00:16', level: 'cmd', text: 'docker push cognevance/cognevance-cicd-automation:latest' },
      { timestamp: '00:16', level: 'info', text: 'Layer 8a1b2c3d: Pushed (mounted from base)' },
      { timestamp: '00:17', level: 'info', text: 'Layer 9e8f7a6b: Pushed [2.4 MB / 2.4 MB]' },
      { timestamp: '00:17', level: 'cmd', text: 'docker push cognevance/cognevance-cicd-automation:9f3a2c8' },
      { timestamp: '00:17', level: 'success', text: 'Digest: sha256:4b917c9802a... latest & 9f3a2c8 pushed to Docker Hub.' },
    ],
  },
  {
    id: 7,
    name: 'Deploy to AWS EC2 (SSH)',
    category: 'cd',
    duration: 2800,
    description: 'Executes remote SSH deployment on AWS EC2 host to pull new image and reload container.',
    command: 'appleboy/ssh-action@v1.0.3 (host: ${{ secrets.EC2_HOST }})',
    logs: [
      { timestamp: '00:18', level: 'cmd', text: 'Connecting to AWS EC2 Host: 54.210.12.34:22 via SSH...' },
      { timestamp: '00:19', level: 'info', text: 'SSH connection established with user: ubuntu' },
      { timestamp: '00:19', level: 'cmd', text: 'docker pull cognevance/cognevance-cicd-automation:latest' },
      { timestamp: '00:20', level: 'info', text: 'Status: Downloaded newer image for cognevance/cognevance-cicd-automation:latest' },
      { timestamp: '00:20', level: 'cmd', text: 'docker stop cognevance-automation-app && docker rm cognevance-automation-app' },
      { timestamp: '00:20', level: 'info', text: 'Gracefully drained existing WSGI container (exit 0)' },
      { timestamp: '00:21', level: 'cmd', text: 'docker run -d --name cognevance-automation-app -p 5000:5000 ...' },
      { timestamp: '00:21', level: 'success', text: 'Container c8b492f1a initiated on port 5000 (appuser:10001)' },
    ],
  },
  {
    id: 8,
    name: 'Deployment Health Verification',
    category: 'cd',
    duration: 1600,
    description: 'Probes HTTP /health endpoint on target host to confirm 200 OK and "status": "healthy".',
    command: 'curl --silent --fail http://${{ secrets.EC2_HOST }}:5000/health',
    logs: [
      { timestamp: '00:22', level: 'info', text: 'Waiting 10 seconds for Gunicorn WSGI workers to bind...' },
      { timestamp: '00:23', level: 'cmd', text: 'curl -i --max-time 10 http://54.210.12.34:5000/health' },
      { timestamp: '00:23', level: 'info', text: 'HTTP/1.1 200 OK' },
      { timestamp: '00:23', level: 'info', text: 'Content-Type: application/json' },
      { timestamp: '00:23', level: 'info', text: '{"service":"cognevance-cicd-automation","status":"healthy","uptime_seconds":4,"version":"1.0.0"}' },
      { timestamp: '00:24', level: 'success', text: 'Verification PASSED: Application is healthy in production!' },
      { timestamp: '00:24', level: 'success', text: '==================== PIPELINE SUCCEEDED in 48s ====================' },
    ],
  },
];
