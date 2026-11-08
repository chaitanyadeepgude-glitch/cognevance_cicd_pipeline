#!/usr/bin/env bash
# ==============================================================================
# Cognevance Technologies - CI/CD Pipeline Automation System
# Local Run & Automated Test Execution Script (Linux / macOS)
# ==============================================================================

set -e

echo "=========================================================="
echo " Cognevance CI/CD Automation System - Local Runner"
echo "=========================================================="

# 1. Check Python version
if ! command -v python3 &> /dev/null; then
    echo "[-] Error: Python 3 is not installed or not in PATH."
    exit 1
fi

echo "[+] Python version: $(python3 --version)"

# 2. Setup virtual environment if not present
if [ ! -d "venv" ]; then
    echo "[+] Creating virtual environment 'venv'..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate
echo "[+] Virtual environment activated."

# 3. Install dependencies
echo "[+] Installing application & testing dependencies..."
pip install --upgrade pip --quiet
pip install -r requirements-dev.txt --quiet

# 4. Run automated Pytest test suite
echo ""
echo "=========================================================="
echo " Executing Pytest Test Suite..."
echo "=========================================================="
pytest tests/ -v

# 5. Start application
echo ""
echo "=========================================================="
echo " Starting Flask Application on http://localhost:5000"
echo " Press Ctrl+C to terminate the server."
echo "=========================================================="
export FLASK_ENV=development
export PORT=5000
python wsgi.py
