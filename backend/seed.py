"""
Database Seed Script - Initializes the College Management System with default accounts.
Run this to set up a fresh environment with all manager roles.

Credentials:
    Role: ADMIN                | Email: admin@cms.com        | Pass: admin123
    Role: STUDENT_MANAGER      | Email: student_m@cms.com    | Pass: password123
    Role: ATTENDANCE_MANAGER   | Email: attendance_m@cms.com | Pass: password123
    Role: COURSE_MANAGER       | Email: course_m@cms.com     | Pass: password123
    Role: FEES_MANAGER         | Email: fees_m@cms.com       | Pass: password123
"""

from app.core.database import SessionLocal, create_tables
from app.auth.models import User

def seed_database():
    print("--- Starting Database Seeding ---")
    
    # Ensure tables exist
    create_tables()
    
    db = SessionLocal()
    try:
        users_to_create = [
            {
                "name": "System Admin",
                "email": "admin@cms.com",
                "phone": "9999999999",
                "employee_id": "ADM-001",
                "password": "admin123",
                "role": "ADMIN"
            },
            {
                "name": "Student Manager",
                "email": "student_m@cms.com",
                "phone": "9888888888",
                "employee_id": "SM-001",
                "password": "password123",
                "role": "STUDENT_MANAGER"
            },
            {
                "name": "Attendance Manager",
                "email": "attendance_m@cms.com",
                "phone": "9777777777",
                "employee_id": "AM-001",
                "password": "password123",
                "role": "ATTENDANCE_MANAGER"
            },
            {
                "name": "Course Manager",
                "email": "course_m@cms.com",
                "phone": "9666666666",
                "employee_id": "CM-001",
                "password": "password123",
                "role": "COURSE_MANAGER"
            },
            {
                "name": "Fees Manager",
                "email": "fees_m@cms.com",
                "phone": "9555555555",
                "employee_id": "FM-001",
                "password": "password123",
                "role": "FEES_MANAGER"
            }
        ]

        for u_data in users_to_create:
            existing = db.query(User).filter(User.email == u_data["email"]).first()
            if existing:
                print(f"[SKIP] User already exists: {u_data['email']}")
                continue
            
            new_user = User(**u_data)
            db.add(new_user)
            print(f"[OK] Created User: {u_data['email']} ({u_data['role']})")
        
        db.commit()
        print("--- Seeding Completed Successfully ---")
        
    except Exception as e:
        print(f"[ERROR] Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
