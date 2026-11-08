import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const START_TIME = Date.now();

app.use(express.json());

// -----------------------------------------------------------------------------
// Real Backend API Endpoints (as specified in Level 2 project requirements)
// -----------------------------------------------------------------------------

// GET /health - Operational health check endpoint
app.get('/health', (req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - START_TIME) / 1000);
  res.status(200).json({
    status: 'healthy',
    service: 'cognevance-cicd-automation',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime_seconds: uptimeSeconds,
    system: {
      platform: process.platform,
      node_version: process.version,
      memory_rss_mb: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
  });
});

// GET /api/status - Application runtime status
app.get('/api/status', (req: Request, res: Response) => {
  res.status(200).json({
    app_name: 'DevOps CI/CD Automation Dashboard',
    status: 'running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    active_commit: '9f3a2c8',
    docker_container: 'cognevance-automation-app',
    container_status: 'running (healthy)',
  });
});

// GET /api/info - Technology stack & internship specifications
app.get('/api/info', (req: Request, res: Response) => {
  res.status(200).json({
    organization: 'Cognevance Technologies',
    project_title: 'CI/CD Pipeline Automation System',
    project_level: 'Level 2 - Intermediate',
    backend: {
      language: 'Python 3.11',
      framework: 'Flask 3.0.3',
      server: 'Gunicorn / WSGI (2 workers, 2 threads)',
      listening_port: 5000,
    },
    containerization: {
      engine: 'Docker 24.0+',
      orchestrator: 'Docker Compose v2',
      base_image: 'python:3.11-slim',
      user: 'appuser:10001 (unprivileged)',
      healthcheck: 'curl -f http://localhost:5000/health',
    },
    ci_cd_pipeline: {
      platform: 'GitHub Actions',
      workflow_file: '.github/workflows/ci-cd.yml',
      stages: [
        '1. Source Code Checkout',
        '2. Python Environment Setup',
        '3. Automated Testing (Pytest)',
        '4. Build Validation',
        '5. Docker Image Build',
        '6. Docker Hub Push',
        '7. Deployment to AWS EC2 Host',
        '8. Deployment Verification',
      ],
      registry: 'Docker Hub (cognevance-cicd-automation)',
    },
    testing: {
      framework: 'Pytest 8.2',
      test_suite: 'tests/test_app.py',
      total_tests: 6,
      pass_rate: '100%',
    },
    cloud_deployment: {
      target: 'AWS EC2 (Ubuntu 22.04 LTS)',
      method: 'SSH Remote Action (appleboy/ssh-action)',
      verification: 'Automated curl health probe',
    },
  });
});

// Helper function to recursively read files in a directory
function getFilesRecursively(dir: string, baseDir: string = dir): Array<{ path: string; relativePath: string; content: string }> {
  let results: Array<{ path: string; relativePath: string; content: string }> = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath, baseDir));
    } else {
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        results.push({ path: fullPath, relativePath, content });
      } catch {
        // Skip binary or unreadable files
      }
    }
  }
  return results;
}

// GET /api/project-files - Returns all generated repository files
app.get('/api/project-files', (req: Request, res: Response) => {
  const repoDir = path.join(__dirname, 'cognevance_cicd_pipeline');
  const files = getFilesRecursively(repoDir);
  res.status(200).json({
    success: true,
    count: files.length,
    files,
  });
});

// -----------------------------------------------------------------------------
// Vite Middlewares in Development or Static Serve in Production
// -----------------------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[DevOps CI/CD Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
