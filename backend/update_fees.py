from app.core.database import SessionLocal
from app.courses.models import Course

def update_fees():
    db = SessionLocal()
    try:
        # Update Bsc.It to 20,000
        course_it = db.query(Course).filter(Course.course_name == "Bsc.It").first()
        if course_it:
            course_it.total_fee = 20000
            print(f"Updated {course_it.course_name} fee to 20000")
        
        # Update B.tech to 50,000
        course_tech = db.query(Course).filter(Course.course_name == "B.tech").first()
        if course_tech:
            course_tech.total_fee = 50000
            print(f"Updated {course_tech.course_name} fee to 50000")
            
        db.commit()
        print("Database updated successfully.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    update_fees()
