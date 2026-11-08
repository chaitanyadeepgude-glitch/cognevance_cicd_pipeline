"""
Cognevance Technologies - CI/CD Pipeline Automation System
WSGI Entry Point for Gunicorn & Flask CLI
"""

import os
from app import create_app

# Instantiate application with environment settings
app = create_app(os.getenv("FLASK_ENV", "production"))

if __name__ == "__main__":
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "5000"))
    debug = os.getenv("FLASK_DEBUG", "0") == "1"
    app.run(host=host, port=port, debug=debug)
