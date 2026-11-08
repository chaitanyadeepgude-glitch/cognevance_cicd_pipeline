# Deployment Guide: Local & AWS EC2 Production

**Organization:** Cognevance Technologies  
**Project:** CI/CD Pipeline Automation System

---

## 1. Deployment Strategies Overview

This project supports three deployment workflows:
1. **Local Native Execution:** Running directly via Python virtual environment (ideal for debugging).
2. **Local Container Execution:** Running inside Docker or Docker Compose (mirrors production).
3. **Cloud VM Continuous Deployment:** Fully automated zero-downtime deployment to AWS EC2 via GitHub Actions.

---

## 2. Local Native Deployment (Without Docker)

### Prerequisites:
- Python 3.10+ installed
- Git installed

### Execution Steps:
```bash
# 1. Clone your repository
git clone https://github.com/<your-username>/cognevance_cicd_pipeline.git
cd cognevance_cicd_pipeline

# 2. Run automated script
# On Linux / macOS:
chmod +x scripts/run-local.sh
./scripts/run-local.sh

# On Windows:
scripts\run-local.bat
```

The application will start on `http://localhost:5000`.

---

## 3. Local Docker Deployment

```bash
# 1. Build Docker image
docker build -t cognevance-cicd-automation:latest .

# 2. Run container
docker run -d -p 5000:5000 --name cognevance-app cognevance-cicd-automation:latest

# 3. Test health check
curl -i http://localhost:5000/health
```

---

## 4. Production Cloud Deployment: AWS EC2 Setup

### Step 1: Provision an AWS EC2 Instance
1. Launch an EC2 instance:
   - **AMI:** Ubuntu Server 22.04 LTS (HVM), SSD Volume Type
   - **Instance Type:** `t3.micro` or `t2.micro` (Free Tier eligible)
   - **Key Pair:** Create or select an existing `.pem` key pair (e.g., `cognevance-devops.pem`)
2. Configure Security Group:
   - Allow **SSH (Port 22)** from your IP address or GitHub Actions IP range.
   - Allow **Custom TCP (Port 5000)** from Anywhere (`0.0.0.0/0`).

### Step 2: Prepare the EC2 Instance
Connect to your EC2 instance via SSH:
```bash
ssh -i "cognevance-devops.pem" ubuntu@<ec2-public-ip>
```

Install Docker on the instance:
```bash
# Update packages and install Docker
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Grant ubuntu user docker access
sudo usermod -aG docker ubuntu
newgrp docker

# Create application directory
sudo mkdir -p /opt/cognevance-cicd
sudo chown ubuntu:ubuntu /opt/cognevance-cicd
```

### Step 3: Configure GitHub Repository Secrets
Navigate to **GitHub > Your Repository > Settings > Secrets and variables > Actions > New repository secret**:

1. `DOCKERHUB_USERNAME`: Your Docker Hub username.
2. `DOCKERHUB_TOKEN`: Personal Access Token from Docker Hub.
3. `EC2_HOST`: The Public IPv4 address or Public IPv4 DNS of your EC2 instance.
4. `EC2_USERNAME`: `ubuntu`
5. `EC2_SSH_KEY`: The entire content of your `.pem` private key file, including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`.

### Step 4: Trigger the Pipeline
Push a commit to the `main` branch:
```bash
git add .
git commit -m "feat: complete automated deployment pipeline"
git push origin main
```

Watch the workflow execute in the **Actions** tab. Once completed, browse to:
`http://<EC2_PUBLIC_IP>:5000`
