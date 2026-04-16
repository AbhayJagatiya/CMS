from sqlalchemy.orm import Session
from app.students.models import Student
import uuid


def create_student(db: Session, data):
    student = Student(**data.dict())

    db.add(student)
    db.commit()
    db.refresh(student)
    return student

# 🔹 GET ALL (search + filter)
def get_students(db: Session, search=None, Institude=None, course=None, status=None):

    query = db.query(Student)

    if search:
        query = query.filter(
            Student.name.ilike(f"%{search}%") |
            Student.email.ilike(f"%{search}%") |
            Student.Institude.ilike(f"%{search}%") |
            Student.course.ilike(f"%{search}%")
        )
    if Institude:
        query = query.filter(Student.Institude.ilike(f"%{Institude}%"))

    if course:
        query = query.filter(Student.course.ilike(f"%{course}%"))

    if status:
        query = query.filter(Student.status.ilike(f"%{status}%"))

    return query.all()


# 🔹 GET ONE
def get_student(db: Session, student_id: int):
    return db.query(Student).filter(Student.id == student_id).first()


# 🔹 UPDATE
def update_student(db: Session, student_id: int, data):
    student = get_student(db, student_id)

    if not student:
        return None

    for key, value in data.dict().items():
        setattr(student, key, value)

    db.commit()
    db.refresh(student)
    return student


# 🔹 DELETE
def delete_student(db: Session, student_id: int):
    student = get_student(db, student_id)

    if not student:
        return None

    db.delete(student)
    db.commit()
    return True