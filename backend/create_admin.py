"""
Admin seed script — run this ONCE to create or reset the admin account.

Usage:
    cd d:\projects\college_project\CMS\backend\backend
    python create_admin.py

Credentials:
    Email   : admin@gmail.com
    Password: admin123
    Role    : ADMIN
"""

from app.core.database import SessionLocal
from app.auth.models import User

ADMIN_EMAIL    = "admin@gmail.com"
ADMIN_PASSWORD = "admin123"
ADMIN_NAME     = "System Admin"

def create_admin():
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == ADMIN_EMAIL).first()
        if existing:
            existing.password = ADMIN_PASSWORD
            existing.name = ADMIN_NAME
            db.commit()
            print(f"[OK] Admin password updated: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
            return

        admin = User(
            name=ADMIN_NAME,
            email=ADMIN_EMAIL,
            phone="0000000000",
            employee_id="ADMIN-001",
            password=ADMIN_PASSWORD,
            role="ADMIN",
        )
        db.add(admin)
        db.commit()
        print(f"[OK] Admin created: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
