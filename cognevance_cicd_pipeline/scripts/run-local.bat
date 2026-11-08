@echo off
REM ==============================================================================
REM Cognevance Technologies - CI/CD Pipeline Automation System
REM Local Run & Automated Test Execution Script (Windows)
REM ==============================================================================

echo ==========================================================
echo  Cognevance CI/CD Automation System - Local Windows Runner
echo ==========================================================

python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [-] Error: Python is not installed or not in system PATH.
    pause
    exit /b 1
)

if not exist venv (
    echo [+] Creating virtual environment 'venv'...
    python -m venv venv
)

call venv\Scripts\activate.bat
echo [+] Virtual environment activated.

echo [+] Installing dependencies...
python -m pip install --upgrade pip --quiet
pip install -r requirements-dev.txt --quiet

echo.
echo ==========================================================
echo  Executing Pytest Test Suite...
echo ==========================================================
pytest tests\ -v

echo.
echo ==========================================================
echo  Starting Flask Application on http://localhost:5000
echo  Press Ctrl+C to stop.
echo ==========================================================
set FLASK_ENV=development
set PORT=5000
python wsgi.py
pause
