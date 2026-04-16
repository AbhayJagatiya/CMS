from sqlalchemy.orm import Session

# 🔥 IMPORT ORIGINAL SERVICES
from app.students import services as student_services
from app.attendance import services as attendance_services
from app.courses import services as course_services
from app.fees import services as fees_services


# 👨‍🎓 STUDENTS
def get_students(db: Session, search=None, institute=None, course=None, status=None):
    return student_services.get_students(db, search, institute, course, status)


def get_student(db: Session, id: int):
    return student_services.get_student(db, id)


# 📅 ATTENDANCE
def get_attendance(db, selected_date=None, search=None, institute=None, course=None):
    return attendance_services.get_attendance_by_date(
        db, selected_date, search, institute, course
    )


def get_student_attendance(db, student_id):
    return attendance_services.get_student_attendance(db, student_id)


# 📚 COURSES
def get_courses(db, search=None, institute=None, status=None, fee=None, faculty=None):
    return course_services.get_courses(db, search, institute, status, fee, faculty)


def get_course_detail(db, course_id):
    return course_services.get_course_detail(db, course_id)


# 💰 FEES
def get_fees(db, search=None, institute=None, course=None, status=None):
    return fees_services.get_all(db, search, institute, course, status)


def get_fee_detail(db, student_id):
    return fees_services.get_fee_detail(db, student_id)