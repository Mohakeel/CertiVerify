# ─── App Configuration ────────────────────────────────────────────────────────
import os
from datetime import timedelta

# ─── Base directory (absolute path to backend folder) ────────────────────────
basedir = os.path.abspath(os.path.dirname(__file__))

# ─── Ensure instance directory exists for SQLite ─────────────────────────────
instance_dir = os.path.join(basedir, 'instance')
os.makedirs(instance_dir, exist_ok=True)

class Config:
    # ─── App secret key ───────────────────────────────────────────────────────
    # IMPORTANT: Change these to strong random keys in production!
    # Generate with: python -c "import secrets; print(secrets.token_hex(32))"
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production-' + os.urandom(24).hex()

    # ─── SQLite database path (absolute) ─────────────────────────────────────
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(instance_dir, 'database.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # ─── JWT settings ─────────────────────────────────────────────────────────
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'dev-jwt-key-change-in-production-' + os.urandom(24).hex()
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)

    # ─── File upload path ─────────────────────────────────────────────────────
    UPLOAD_FOLDER = 'uploads/resumes'
