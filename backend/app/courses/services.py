from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.courses.models import Course
from app.students.models import Student

def create_course(db: Session, data):
    course = Course(**data.dict())
    db.add(course)
    db.commit()
    db.refresh(course)
    return course

def get_courses(db, search=None, institute=None, status=None, fee=None, faculty=None):

    query = db.query(Course)

    # 🔍 search
    if search:
        query = query.filter(
            or_(
                Course.course_name.ilike(f"%{search}%"),
                Course.course_id.ilike(f"%{search}%")
            )
        )

    # 🎯 filters
    if institute:
        query = query.filter(Course.institute.ilike(f"%{institute}%"))

    if status:
        query = query.filter(Course.status.ilike(f"%{status}%"))

    if faculty:
        query = query.filter(Course.faculty.ilike(f"%{faculty}%"))

    # 💰 fee filter (range)
    if fee:
        if fee == "3":
            query = query.filter(Course.total_fee <= 300000)
        elif fee == "4":
            query = query.filter(Course.total_fee <= 400000)
        elif fee == "5":
            query = query.filter(Course.total_fee <= 500000)

    courses = query.all()

    result = []

    for course in courses:
        # 🔥 enrollment count
        count = db.query(Student).filter(
            Student.course.ilike(f"%{course.course_name}%")
        ).count()

        result.append({
            "id": course.id,
            "course_id": course.course_id,
            "institute": course.institute,
            "course_name": course.course_name,
            "total_fee": course.total_fee,
            "duration": course.duration,
            "faculty": course.faculty,
            "status": course.status,
            "enrollment": count
        })

    return result

def get_course_detail(db, course_id):

    course = db.query(Course).filter(
        Course.course_id == course_id
    ).first()

    students = db.query(Student).filter(
        Student.course.ilike(f"%{course.course_name}%")
    ).all()

    student_list = []

    for s in students:
        student_list.append({
            "student_id": s.student_id,
            "name": s.name,
            "phone": s.phone,
            "email": s.email,
            "status": s.status
        })

    return {
        "course_id": course.course_id,
        "course_name": course.course_name,
        "total_fee": course.total_fee,
        "duration": course.duration,
        "faculty": course.faculty,
        "status": course.status,
        "students": student_list
    }

def update_course(db, course_id: str, data):

    course = db.query(Course).filter(Course.course_id == course_id).first()

    if not course:
        return None

    # 🔥 update fields
    course.institute = data.institute
    course.course_name = data.course_name
    course.total_fee = data.total_fee
    course.duration = data.duration
    course.faculty = data.faculty
    course.status = data.status

    db.commit()
    db.refresh(course)

    return course

